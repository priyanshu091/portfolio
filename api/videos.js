import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import jwt from 'jsonwebtoken';

const METADATA_BLOB = '_cms_videos.json';

function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  try {
    const secret = process.env.JWT_SECRET || 'fallback-dev-secret-change-me';
    jwt.verify(authHeader.split(' ')[1], secret);
    return true;
  } catch { return false; }
}

function getContainerClient() {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT;
  const accountKey = process.env.AZURE_STORAGE_KEY;
  const containerName = process.env.AZURE_STORAGE_CONTAINER || 'portfolio-media';

  if (!accountName || !accountKey) throw new Error('Azure storage not configured');

  const credential = new StorageSharedKeyCredential(accountName, accountKey);
  const blobService = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential);
  return blobService.getContainerClient(containerName);
}

async function readMetadata() {
  try {
    const container = getContainerClient();
    const blobClient = container.getBlockBlobClient(METADATA_BLOB);
    const response = await blobClient.download(0);
    const text = await streamToString(response.readableStreamBody);
    return JSON.parse(text);
  } catch (err) {
    // If file doesn't exist yet, return empty structure
    if (err.statusCode === 404 || err.code === 'BlobNotFound') {
      return { videos: [] };
    }
    throw err;
  }
}

async function writeMetadata(data) {
  const container = getContainerClient();
  const blobClient = container.getBlockBlobClient(METADATA_BLOB);
  const content = JSON.stringify(data, null, 2);
  await blobClient.upload(content, content.length, {
    blobHTTPHeaders: { blobContentType: 'application/json' },
    overwrite: true,
  });
}

async function streamToString(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — public, no auth required (portfolio fetches this)
  if (req.method === 'GET') {
    try {
      const data = await readMetadata();
      
      // Auto-discover any orphaned/unlisted video blobs on Azure
      try {
        const container = getContainerClient();
        const accountName = process.env.AZURE_STORAGE_ACCOUNT;
        const containerName = process.env.AZURE_STORAGE_CONTAINER || 'portfolio-media';
        
        const blobs = [];
        for await (const blob of container.listBlobsFlat()) {
          // Exclude the metadata json itself and non-video assets
          const lowerName = blob.name.toLowerCase();
          if (blob.name !== METADATA_BLOB && (
            lowerName.endsWith('.mp4') || 
            lowerName.endsWith('.mov') || 
            lowerName.endsWith('.webm') || 
            lowerName.endsWith('.png') || 
            lowerName.endsWith('.jpg') || 
            lowerName.endsWith('.jpeg') || 
            lowerName.endsWith('.webp')
          )) {
            blobs.push({ name: blob.name, createdOn: blob.properties?.createdOn });
          }
        }
        
        // Find blobs that are NOT referenced in metadata
        const metadataUrls = new Set(data.videos.map(v => v.videoUrl));
        
        for (const blobInfo of blobs) {
          const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobInfo.name}`;
          if (!metadataUrls.has(blobUrl)) {
            // Guess section from filename
            let section = 'doc'; // default
            const lowerName = blobInfo.name.toLowerCase();
            if (lowerName.startsWith('reels') || lowerName.includes('reels')) section = 'reels';
            else if (lowerName.startsWith('comm') || lowerName.includes('commercial')) section = 'comm';
            else if (lowerName.startsWith('beat') || lowerName.includes('travel')) section = 'beat';
            else if (lowerName.startsWith('long') || lowerName.includes('podcast')) section = 'long';
            else if (lowerName.startsWith('ai') || lowerName.includes('stock')) section = 'ai';
            else if (lowerName.startsWith('wed') || lowerName.includes('wedding')) section = 'wed';
            else if (lowerName.startsWith('motion') || lowerName.includes('graphics') || lowerName.includes('anim')) section = 'motion';
            
            // Clean title from filename
            const cleanTitle = blobInfo.name.substring(0, blobInfo.name.lastIndexOf('.')).replace(/[-_]/g, ' ').toUpperCase();
            
            data.videos.push({
              id: `unlisted:${blobInfo.name}`,
              section,
              title: cleanTitle || blobInfo.name.toUpperCase(),
              tag: 'UNLISTED AZURE BLOB',
              videoUrl: blobUrl,
              createdAt: blobInfo.createdOn || new Date().toISOString(),
              isUnlisted: true
            });
          }
        }
      } catch (azureErr) {
        console.warn('Azure blob autodiscover warning:', azureErr.message);
      }
      
      return res.status(200).json(data);
    } catch (err) {
      console.error('Read metadata error:', err);
      return res.status(500).json({ error: 'Failed to read videos' });
    }
  }

  // POST & DELETE require auth
  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // POST — add a new video
  if (req.method === 'POST') {
    const { section, title, tag, videoUrl } = req.body || {};
    if (!section || !title || !tag || !videoUrl) {
      return res.status(400).json({ error: 'section, title, tag, videoUrl are required' });
    }

    try {
      const data = await readMetadata();
      const newVideo = {
        id: `${section}-${Date.now()}`,
        section,
        title: title.toUpperCase(),
        tag: tag.toUpperCase(),
        videoUrl,
        createdAt: new Date().toISOString(),
      };
      data.videos.push(newVideo);
      await writeMetadata(data);
      return res.status(201).json({ video: newVideo });
    } catch (err) {
      console.error('Add video error:', err);
      return res.status(500).json({ error: 'Failed to add video' });
    }
  }

  // DELETE — remove a video by id
  if (req.method === 'DELETE') {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'Video id required' });
    }

    try {
      // If it's an unlisted Azure blob, delete directly from Azure
      if (id.startsWith('unlisted:')) {
        const blobName = id.replace('unlisted:', '');
        const container = getContainerClient();
        await container.getBlockBlobClient(blobName).deleteIfExists();
        return res.status(200).json({ deleted: id });
      }

      const data = await readMetadata();
      const index = data.videos.findIndex(v => v.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Also delete the blob from Azure if it's in our container
      const video = data.videos[index];
      const accountName = process.env.AZURE_STORAGE_ACCOUNT;
      if (video.videoUrl && video.videoUrl.includes(accountName)) {
        try {
          const urlParts = new URL(video.videoUrl);
          const blobName = urlParts.pathname.split('/').pop();
          const container = getContainerClient();
          await container.getBlockBlobClient(blobName).deleteIfExists();
        } catch (deleteErr) {
          console.warn('Blob delete warning:', deleteErr.message);
        }
      }

      data.videos.splice(index, 1);
      await writeMetadata(data);
      return res.status(200).json({ deleted: id });
    } catch (err) {
      console.error('Delete video error:', err);
      return res.status(500).json({ error: 'Failed to delete video' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
