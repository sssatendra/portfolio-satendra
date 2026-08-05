'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const NUM_NODES = 85;
const MAX_CONNECTIONS = 280;
const NUM_PACKETS = 10;

function LatticeMesh() {
  const nodesGeomRef = useRef();
  const linesGeomRef = useRef();
  const packetsGeomRef = useRef();
  const meshGroupRef = useRef();

  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  // Global mouse move listener to capture window hover regardless of canvas overlap rules
  useEffect(() => {
    const handlePointerMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Track global scroll level to translate camera position down deep space
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      scrollRef.current = window.scrollY / maxScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Initialize Nodes with randomized drift variables and axis phases
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < NUM_NODES; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 3.2,
        y: (Math.random() - 0.5) * 3.2,
        z: (Math.random() - 0.5) * 2.2 - 0.2,

        speedX: 0.08 + Math.random() * 0.18,
        speedY: 0.08 + Math.random() * 0.18,
        speedZ: 0.08 + Math.random() * 0.18,

        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,

        ampX: 0.06 + Math.random() * 0.12,
        ampY: 0.06 + Math.random() * 0.12,
        ampZ: 0.06 + Math.random() * 0.12,

        repelledX: 0,
        repelledY: 0,
        
        currentX: 0,
        currentY: 0,
        currentZ: 0,
      });
    }
    return arr;
  }, []);

  // 2. Initialize Data Packets traversing the network graph
  const packets = useMemo(() => {
    const arr = [];
    for (let p = 0; p < NUM_PACKETS; p++) {
      const start = Math.floor(Math.random() * NUM_NODES);
      let end = Math.floor(Math.random() * NUM_NODES);
      while (end === start) {
        end = Math.floor(Math.random() * NUM_NODES);
      }
      arr.push({
        startNodeIndex: start,
        endNodeIndex: end,
        progress: Math.random(),
        speed: 0.12 + Math.random() * 0.18,
      });
    }
    return arr;
  }, []);

  // 3. Pre-allocated Buffer Arrays for lightning fast rendering at 60fps
  const nodesPositions = useMemo(() => new Float32Array(NUM_NODES * 3), []);
  const linePositions = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 3), []);
  const lineColors = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 4), []);
  const packetsPositions = useMemo(() => new Float32Array(NUM_PACKETS * 3), []);

  // 4. Generate High-Quality Radial Canvas Textures for perfect glowing antialiased circles
  const nodeTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(59, 130, 246, 1)');      // Vibrant blue core
    gradient.addColorStop(0.55, 'rgba(37, 99, 235, 0.25)');   // Elegant soft blue glow
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const packetTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(34, 211, 238, 1)');     // Neon cyan core
    gradient.addColorStop(0.65, 'rgba(6, 182, 212, 0.35)');    // Intense cyan glow
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // 5. Frameloop Render Updates
  useFrame((state, delta) => {
    const dt = Math.min(delta || 0, 0.1); // Clamp extreme frames
    const time = state.clock.getElapsedTime();

    const viewportWidth = state.viewport.width;
    const viewportHeight = state.viewport.height;
    
    // Project mouse onto viewport coordinate system
    const mX = mouseRef.current.x * viewportWidth * 0.5;
    const mY = mouseRef.current.y * viewportHeight * 0.5;

    // A. Update server/node positions with drifting math & cursor repulsion
    for (let i = 0; i < NUM_NODES; i++) {
      const node = nodes[i];

      // Multi-sine mathematical organic path drift
      node.currentX = node.x + Math.sin(time * node.speedX + node.phaseX) * node.ampX;
      node.currentY = node.y + Math.cos(time * node.speedY + node.phaseY) * node.ampY;
      node.currentZ = node.z + Math.sin(time * node.speedZ + node.phaseZ) * node.ampZ;

      // High-performance proximity repulsion
      const dx = node.currentX - mX;
      const dy = node.currentY - mY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 0.65;

      if (dist < repulsionRadius) {
        const force = (repulsionRadius - dist) * 0.45;
        const rx = (dx / (dist || 0.001)) * force;
        const ry = (dy / (dist || 0.001)) * force;

        // Smooth velocity ease
        node.repelledX += (rx - node.repelledX) * 0.1;
        node.repelledY += (ry - node.repelledY) * 0.1;
      } else {
        // Return to natural drift orbits
        node.repelledX += (0 - node.repelledX) * 0.15;
        node.repelledY += (0 - node.repelledY) * 0.15;
      }

      const finalX = node.currentX + node.repelledX;
      const finalY = node.currentY + node.repelledY;
      const finalZ = node.currentZ;

      nodesPositions[i * 3] = finalX;
      nodesPositions[i * 3 + 1] = finalY;
      nodesPositions[i * 3 + 2] = finalZ;
    }

    if (nodesGeomRef.current) {
      nodesGeomRef.current.attributes.position.needsUpdate = true;
    }

    // B. Calculate Lattice connections (Line Segments)
    let lineIdx = 0;
    const maxDist = 0.35;
    const maxDistSq = maxDist * maxDist;

    for (let i = 0; i < NUM_NODES; i++) {
      const nodeA = nodes[i];
      const ax = nodeA.currentX + nodeA.repelledX;
      const ay = nodeA.currentY + nodeA.repelledY;
      const az = nodeA.currentZ;

      for (let j = i + 1; j < NUM_NODES; j++) {
        const nodeB = nodes[j];
        const bx = nodeB.currentX + nodeB.repelledX;
        const by = nodeB.currentY + nodeB.repelledY;
        const bz = nodeB.currentZ;

        const dx = ax - bx;
        const dy = ay - by;
        const dz = az - bz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistSq) {
          if (lineIdx >= MAX_CONNECTIONS) break;
          const dist = Math.sqrt(distSq);
          const alpha = 1.0 - dist / maxDist;

          // Node A
          linePositions[lineIdx * 6] = ax;
          linePositions[lineIdx * 6 + 1] = ay;
          linePositions[lineIdx * 6 + 2] = az;
          // Node B
          linePositions[lineIdx * 6 + 3] = bx;
          linePositions[lineIdx * 6 + 4] = by;
          linePositions[lineIdx * 6 + 5] = bz;

          // Indigo blue node A color representation
          lineColors[lineIdx * 8] = 0.23;
          lineColors[lineIdx * 8 + 1] = 0.51;
          lineColors[lineIdx * 8 + 2] = 0.96;
          lineColors[lineIdx * 8 + 3] = alpha * 0.35;

          // Cyan node B color representation
          lineColors[lineIdx * 8 + 4] = 0.13;
          lineColors[lineIdx * 8 + 5] = 0.83;
          lineColors[lineIdx * 8 + 6] = 0.93;
          lineColors[lineIdx * 8 + 7] = alpha * 0.35;

          lineIdx++;
        }
      }
    }

    if (linesGeomRef.current) {
      linesGeomRef.current.setDrawRange(0, lineIdx * 2);
      linesGeomRef.current.attributes.position.needsUpdate = true;
      linesGeomRef.current.attributes.color.needsUpdate = true;
    }

    // C. Route data packets along the lattice dynamically
    for (let p = 0; p < NUM_PACKETS; p++) {
      const packet = packets[p];
      packet.progress += packet.speed * dt;

      if (packet.progress >= 1) {
        packet.progress = 0;
        packet.startNodeIndex = packet.endNodeIndex;

        // Adjacency pathfinder: look for neighboring nodes within connection range
        const nodeA = nodes[packet.startNodeIndex];
        const ax = nodeA.currentX + nodeA.repelledX;
        const ay = nodeA.currentY + nodeA.repelledY;
        const az = nodeA.currentZ;

        const neighbors = [];
        for (let k = 0; k < NUM_NODES; k++) {
          if (k === packet.startNodeIndex) continue;
          const nodeK = nodes[k];
          const kx = nodeK.currentX + nodeK.repelledX;
          const ky = nodeK.currentY + nodeK.repelledY;
          const kz = nodeK.currentZ;

          const dx = ax - kx;
          const dy = ay - ky;
          const dz = az - kz;
          if (dx * dx + dy * dy + dz * dz < maxDistSq) {
            neighbors.push(k);
          }
        }

        if (neighbors.length > 0) {
          packet.endNodeIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
        } else {
          // If node drifts out of connections, pick any close random node
          packet.endNodeIndex = Math.floor(Math.random() * NUM_NODES);
        }
      }

      const nodeStart = nodes[packet.startNodeIndex];
      const nodeEnd = nodes[packet.endNodeIndex];

      const ax = nodeStart.currentX + nodeStart.repelledX;
      const ay = nodeStart.currentY + nodeStart.repelledY;
      const az = nodeStart.currentZ;

      const bx = nodeEnd.currentX + nodeEnd.repelledX;
      const by = nodeEnd.currentY + nodeEnd.repelledY;
      const bz = nodeEnd.currentZ;

      // Perform position lerping
      packetsPositions[p * 3] = ax + (bx - ax) * packet.progress;
      packetsPositions[p * 3 + 1] = ay + (by - ay) * packet.progress;
      packetsPositions[p * 3 + 2] = az + (bz - az) * packet.progress;
    }

    if (packetsGeomRef.current) {
      packetsGeomRef.current.attributes.position.needsUpdate = true;
    }

    // D. Flythrough navigation lerped with mouse parallax & page scroll percentage
    const scrollZ = 1.3 - scrollRef.current * 0.9;  // camera flies deep space from 1.3 to 0.4
    const scrollY = -scrollRef.current * 0.75;     // camera pans downwards from 0 to -0.75
    
    // Parallax values based on normalized cursor position
    const parallaxX = mouseRef.current.x * 0.16;
    const parallaxY = mouseRef.current.y * 0.12;

    // Apply high-fidelity smoothing loops
    state.camera.position.x += (parallaxX - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + parallaxY) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;

    // Focus camera down the grid
    state.camera.lookAt(0, scrollY * 0.8, 0);

    // Continuous subtle visual drift rotation on entire mesh
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.y = time * 0.015;
    }
  });

  return (
    <group ref={meshGroupRef}>
      {/* 1. Semi-transparent Connection Edges */}
      <lineSegments>
        <bufferGeometry ref={linesGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 4]}
            count={lineColors.length / 4}
            array={lineColors}
            itemSize={4}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.7}
        />
      </lineSegments>

      {/* 2. Primary Network Nodes */}
      <points>
        <bufferGeometry ref={nodesGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[nodesPositions, 3]}
            count={nodesPositions.length / 3}
            array={nodesPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          sizeAttenuation={true}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={nodeTexture}
        />
      </points>

      {/* 3. Glowing Data Packets Flowing Along Grid */}
      <points>
        <bufferGeometry ref={packetsGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[packetsPositions, 3]}
            count={packetsPositions.length / 3}
            array={packetsPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          sizeAttenuation={true}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={packetTexture}
        />
      </points>
    </group>
  );
}

export default function LatticeBackground3D() {
  return (
    <div id="canvas-container">
      <Canvas camera={{ position: [0, 0, 1.3], fov: 60 }}>
        <LatticeMesh />
      </Canvas>
    </div>
  );
}
