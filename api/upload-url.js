import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob';
import jwt from 'jsonwebtoken';

function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  try {
    const secret = process.env.JWT_SECRET || 'fallback-dev-secret-change-me';
    jwt.verify(authHeader.split(' ')[1], secret);
    return true;
  } catch { return false; }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { filename } = req.body || {};
  if (!filename) {
    return res.status(400).json({ error: 'filename required' });
  }

  const accountName = process.env.AZURE_STORAGE_ACCOUNT;
  const accountKey = process.env.AZURE_STORAGE_KEY;
  const containerName = process.env.AZURE_STORAGE_CONTAINER || 'portfolio-media';

  if (!accountName || !accountKey) {
    return res.status(500).json({ error: 'Azure storage not configured' });
  }

  try {
    // Sanitize filename: add timestamp prefix to avoid collisions
    const timestamp = Date.now();
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobName = `${timestamp}-${sanitized}`;

    // Generate SAS token valid for 30 minutes
    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    const expiresOn = new Date(Date.now() + 30 * 60 * 1000);

    const sasParams = generateBlobSASQueryParameters({
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('cw'), // create + write
      expiresOn,
    }, credential);

    const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasParams.toString()}`;
    const publicUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;

    return res.status(200).json({ uploadUrl, publicUrl, blobName });
  } catch (err) {
    console.error('SAS generation error:', err);
    return res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}
