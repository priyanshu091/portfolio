import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 1. Documentary: Spinning geometric focus lens
export const DocModel = ({ color, hovered }) => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    if (hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={color} wireframe={true} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.2} />
      </mesh>
    </Float>
  );
};

// 2. Reels: Vertical smartphone slab
export const ReelsModel = ({ color, hovered }) => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    if (hovered) {
      meshRef.current.rotation.y += delta * 2;
      meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={2}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.2, 2.4, 0.1]} />
        <meshStandardMaterial color="#111" emissive={color} emissiveIntensity={hovered ? 0.6 : 0.1} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
};

// 3. Commercial: Dynamic Torus Knot
export const CommModel = ({ color, hovered }) => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.5;
    if (hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.1} distort={hovered ? 0.4 : 0} speed={2} roughness={0.1} metalness={1} />
      </mesh>
    </Float>
  );
};

// 4. Beat Sync: Equalizer bars
export const BeatModel = ({ color, hovered }) => {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const time = state.clock.elapsedTime;
        const scaleY = 1 + Math.sin(time * 5 + i) * 0.5;
        child.scale.y = hovered ? scaleY * 1.5 : scaleY;
      });
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={groupRef}>
        {[-1, -0.5, 0, 0.5, 1].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

// 5. Long Format: Floating Microphone/Capsule
export const LongModel = ({ color, hovered }) => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
    if (hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={meshRef}>
        <capsuleGeometry args={[0.6, 1.2, 16, 32]} />
        <meshStandardMaterial color="#222" emissive={color} emissiveIntensity={hovered ? 0.4 : 0.1} wireframe={hovered} />
      </mesh>
    </Float>
  );
};

// 6. AI & Stock: Neural Core
export const AiModel = ({ color, hovered }) => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.6;
    if (hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.6 : 0.2} wireframe={true} distort={0.2} speed={3} />
      </mesh>
    </Float>
  );
};

// 7. Wedding: Interlocking Rings
export const WedModel = ({ color, hovered }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    groupRef.current.rotation.x += delta * 0.3;
    groupRef.current.rotation.y += delta * 0.5;
    if (hovered) {
      groupRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        <mesh position={[-0.4, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.05, 16, 100]} />
          <meshStandardMaterial color={color} metalness={1} roughness={0.1} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.1} />
        </mesh>
        <mesh position={[0.4, 0, 0]} rotation={[Math.PI / 2, 0.5, 0]}>
          <torusGeometry args={[0.8, 0.05, 16, 100]} />
          <meshStandardMaterial color="#fff" metalness={1} roughness={0.1} emissive="#fff" emissiveIntensity={hovered ? 0.5 : 0.1} />
        </mesh>
      </group>
    </Float>
  );
};
