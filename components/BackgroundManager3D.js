'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Points as DreiPoints, PointMaterial as DreiPointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// Common Canvas texture helpers to avoid loading external assets and ensure zero layout latency
function createRadialTexture(coreColor, glowColor) {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, coreColor);
  gradient.addColorStop(0.55, glowColor);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

// -------------------------------------------------------------
// 1. NEURAL LATTICE BACKGROUND (theme: 'lattice')
// -------------------------------------------------------------
function LatticeMesh({ mouseRef, scrollRef }) {
  const nodesGeomRef = useRef();
  const linesGeomRef = useRef();
  const packetsGeomRef = useRef();
  const meshGroupRef = useRef();

  const numNodes = 80;
  const maxConnections = 240;
  const numPackets = 8;

  // Initialize Nodes
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < numNodes; i++) {
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

  // Initialize Data Packets
  const packets = useMemo(() => {
    const arr = [];
    for (let p = 0; p < numPackets; p++) {
      const start = Math.floor(Math.random() * numNodes);
      let end = Math.floor(Math.random() * numNodes);
      while (end === start) end = Math.floor(Math.random() * numNodes);
      arr.push({
        startNodeIndex: start,
        endNodeIndex: end,
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.18,
      });
    }
    return arr;
  }, []);

  // Buffers
  const nodesPositions = useMemo(() => new Float32Array(numNodes * 3), []);
  const linePositions = useMemo(() => new Float32Array(maxConnections * 2 * 3), []);
  const lineColors = useMemo(() => new Float32Array(maxConnections * 2 * 4), []);
  const packetsPositions = useMemo(() => new Float32Array(numPackets * 3), []);

  // Textures
  const nodeTexture = useMemo(() => createRadialTexture('rgba(59, 130, 246, 1)', 'rgba(37, 99, 235, 0.25)'), []);
  const packetTexture = useMemo(() => createRadialTexture('rgba(34, 211, 238, 1)', 'rgba(6, 182, 212, 0.35)'), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta || 0, 0.1);
    const time = state.clock.getElapsedTime();

    const mX = mouseRef.current.x * state.viewport.width * 0.5;
    const mY = mouseRef.current.y * state.viewport.height * 0.5;

    // Nodes placement & repulsion
    for (let i = 0; i < numNodes; i++) {
      const node = nodes[i];
      node.currentX = node.x + Math.sin(time * node.speedX + node.phaseX) * node.ampX;
      node.currentY = node.y + Math.cos(time * node.speedY + node.phaseY) * node.ampY;
      node.currentZ = node.z + Math.sin(time * node.speedZ + node.phaseZ) * node.ampZ;

      const dx = node.currentX - mX;
      const dy = node.currentY - mY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 0.65;

      if (dist < repulsionRadius) {
        const force = (repulsionRadius - dist) * 0.45;
        node.repelledX += ((dx / (dist || 0.001)) * force - node.repelledX) * 0.1;
        node.repelledY += ((dy / (dist || 0.001)) * force - node.repelledY) * 0.1;
      } else {
        node.repelledX += (0 - node.repelledX) * 0.15;
        node.repelledY += (0 - node.repelledY) * 0.15;
      }

      nodesPositions[i * 3] = node.currentX + node.repelledX;
      nodesPositions[i * 3 + 1] = node.currentY + node.repelledY;
      nodesPositions[i * 3 + 2] = node.currentZ;
    }
    if (nodesGeomRef.current) nodesGeomRef.current.attributes.position.needsUpdate = true;

    // Line segments connecting close nodes
    let lineIdx = 0;
    const maxDist = 0.35;
    const maxDistSq = maxDist * maxDist;

    for (let i = 0; i < numNodes; i++) {
      const nodeA = nodes[i];
      const ax = nodeA.currentX + nodeA.repelledX;
      const ay = nodeA.currentY + nodeA.repelledY;
      const az = nodeA.currentZ;

      for (let j = i + 1; j < numNodes; j++) {
        const nodeB = nodes[j];
        const bx = nodeB.currentX + nodeB.repelledX;
        const by = nodeB.currentY + nodeB.repelledY;
        const bz = nodeB.currentZ;

        const dx = ax - bx;
        const dy = ay - by;
        const dz = az - bz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistSq) {
          if (lineIdx >= maxConnections) break;
          const dist = Math.sqrt(distSq);
          const alpha = 1.0 - dist / maxDist;

          linePositions[lineIdx * 6] = ax;
          linePositions[lineIdx * 6 + 1] = ay;
          linePositions[lineIdx * 6 + 2] = az;
          linePositions[lineIdx * 6 + 3] = bx;
          linePositions[lineIdx * 6 + 4] = by;
          linePositions[lineIdx * 6 + 5] = bz;

          // Vertex gradient colors (indigo to cyan)
          lineColors[lineIdx * 8] = 0.23;
          lineColors[lineIdx * 8 + 1] = 0.51;
          lineColors[lineIdx * 8 + 2] = 0.96;
          lineColors[lineIdx * 8 + 3] = alpha * 0.35;

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

    // Dynamic Packets Routing
    for (let p = 0; p < numPackets; p++) {
      const packet = packets[p];
      packet.progress += packet.speed * dt;

      if (packet.progress >= 1) {
        packet.progress = 0;
        packet.startNodeIndex = packet.endNodeIndex;

        const nodeA = nodes[packet.startNodeIndex];
        const ax = nodeA.currentX + nodeA.repelledX;
        const ay = nodeA.currentY + nodeA.repelledY;
        const az = nodeA.currentZ;

        const neighbors = [];
        for (let k = 0; k < numNodes; k++) {
          if (k === packet.startNodeIndex) continue;
          const nodeK = nodes[k];
          const dx = ax - (nodeK.currentX + nodeK.repelledX);
          const dy = ay - (nodeK.currentY + nodeK.repelledY);
          const dz = az - nodeK.currentZ;
          if (dx * dx + dy * dy + dz * dz < maxDistSq) {
            neighbors.push(k);
          }
        }
        packet.endNodeIndex = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : Math.floor(Math.random() * numNodes);
      }

      const nodeStart = nodes[packet.startNodeIndex];
      const nodeEnd = nodes[packet.endNodeIndex];

      const ax = nodeStart.currentX + nodeStart.repelledX;
      const ay = nodeStart.currentY + nodeStart.repelledY;
      const az = nodeStart.currentZ;

      const bx = nodeEnd.currentX + nodeEnd.repelledX;
      const by = nodeEnd.currentY + nodeEnd.repelledY;
      const bz = nodeEnd.currentZ;

      packetsPositions[p * 3] = ax + (bx - ax) * packet.progress;
      packetsPositions[p * 3 + 1] = ay + (by - ay) * packet.progress;
      packetsPositions[p * 3 + 2] = az + (bz - az) * packet.progress;
    }
    if (packetsGeomRef.current) packetsGeomRef.current.attributes.position.needsUpdate = true;

    // Apply rotation & scroll flythrough
    const scrollZ = 1.3 - scrollRef.current * 0.9;
    const scrollY = -scrollRef.current * 0.75;
    const px = mouseRef.current.x * 0.16;
    const py = mouseRef.current.y * 0.12;

    state.camera.position.x += (px - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + py) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8, 0);

    if (meshGroupRef.current) meshGroupRef.current.rotation.y = time * 0.015;
  });

  return (
    <group ref={meshGroupRef}>
      <lineSegments>
        <bufferGeometry ref={linesGeomRef}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={linePositions.length / 3} array={linePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 4]} count={lineColors.length / 4} array={lineColors} itemSize={4} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.7} />
      </lineSegments>

      <points>
        <bufferGeometry ref={nodesGeomRef}>
          <bufferAttribute attach="attributes-position" args={[nodesPositions, 3]} count={nodesPositions.length / 3} array={nodesPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.075} sizeAttenuation={true} transparent blending={THREE.AdditiveBlending} depthWrite={false} map={nodeTexture} />
      </points>

      <points>
        <bufferGeometry ref={packetsGeomRef}>
          <bufferAttribute attach="attributes-position" args={[packetsPositions, 3]} count={packetsPositions.length / 3} array={packetsPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.11} sizeAttenuation={true} transparent blending={THREE.AdditiveBlending} depthWrite={false} map={packetTexture} />
      </points>
    </group>
  );
}

// -------------------------------------------------------------
// 2. LIQUID NOISE WAVES (theme: 'waves')
// -------------------------------------------------------------
function WavesMesh({ mouseRef, scrollRef }) {
  const wavesGeomRef = useRef();
  const columns = 40;
  const rows = 30;
  const numPoints = columns * rows;

  const pointsPositions = useMemo(() => {
    const arr = new Float32Array(numPoints * 3);
    let idx = 0;
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        arr[idx * 3] = (c / (columns - 1) - 0.5) * 3.5;
        arr[idx * 3 + 1] = (r / (rows - 1) - 0.5) * 3.5;
        arr[idx * 3 + 2] = 0;
        idx++;
      }
    }
    return arr;
  }, []);

  const waveTexture = useMemo(() => createRadialTexture('rgba(45, 212, 191, 1)', 'rgba(13, 148, 136, 0.25)'), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mX = mouseRef.current.x * state.viewport.width * 0.5;
    const mY = mouseRef.current.y * state.viewport.height * 0.5;
    const pos = wavesGeomRef.current.attributes.position.array;

    let idx = 0;
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const bx = (c / (columns - 1) - 0.5) * 3.5;
        const by = (r / (rows - 1) - 0.5) * 3.5;

        // Double sin wave trigonometric noise approximation
        let z = Math.sin(bx * 2.2 + time * 1.1) * Math.cos(by * 2.2 + time * 0.9) * 0.12;
        z += Math.sin((bx + by) * 1.5 + time * 1.6) * 0.05;

        // Hover disturbance
        const dx = bx - mX;
        const dy = by - mY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.6) {
          const force = (0.6 - dist) * 0.28;
          z += Math.sin(dist * 12 - time * 8) * force;
        }

        pos[idx * 3] = bx;
        pos[idx * 3 + 1] = by;
        pos[idx * 3 + 2] = z - 0.2;
        idx++;
      }
    }
    wavesGeomRef.current.attributes.position.needsUpdate = true;

    // Scroll depth
    const scrollZ = 1.3 - scrollRef.current * 0.8;
    const scrollY = -scrollRef.current * 0.6;
    state.camera.position.x += (mouseRef.current.x * 0.15 - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + mouseRef.current.y * 0.12) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8, -0.2);
  });

  return (
    <points>
      <bufferGeometry ref={wavesGeomRef}>
        <bufferAttribute attach="attributes-position" args={[pointsPositions, 3]} count={numPoints} array={pointsPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.065} sizeAttenuation={true} transparent blending={THREE.AdditiveBlending} depthWrite={false} map={waveTexture} />
    </points>
  );
}

// -------------------------------------------------------------
// 3. COSMIC NEBULA DUST (theme: 'universe')
// -------------------------------------------------------------
function UniverseMesh({ scrollRef, mouseRef }) {
  const universeGeomRef = useRef();
  const numStars = 1800;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(numStars * 3);
    const col = new Float32Array(numStars * 4);

    for (let i = 0; i < numStars; i++) {
      // Spiral Arm Math
      const r = Math.random() * 1.7;
      const arm = Math.floor(Math.random() * 3);
      const angle = (arm * Math.PI * 2) / 3 + r * 2.6 + (Math.random() - 0.5) * 0.25;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // Indigo/Purple Gradient Colors
      const isCore = r < 0.35;
      if (isCore) {
        col[i * 4] = 0.85;     // White/Cyan Core
        col[i * 4 + 1] = 0.95;
        col[i * 4 + 2] = 1.0;
        col[i * 4 + 3] = 0.8;
      } else {
        const rnd = Math.random();
        if (rnd < 0.5) {
          col[i * 4] = 0.49;   // Indigo #7c3aed
          col[i * 4 + 1] = 0.23;
          col[i * 4 + 2] = 0.93;
          col[i * 4 + 3] = 0.55;
        } else {
          col[i * 4] = 0.93;   // Pink #db2777
          col[i * 4 + 1] = 0.15;
          col[i * 4 + 2] = 0.47;
          col[i * 4 + 3] = 0.55;
        }
      }
    }
    return { positions: pos, colors: col };
  }, []);

  const starTexture = useMemo(() => createRadialTexture('rgba(255, 255, 255, 1)', 'rgba(168, 85, 247, 0.3)'), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Slow rotational vortex
    if (universeGeomRef.current) {
      universeGeomRef.current.rotation.z = time * 0.025;
      universeGeomRef.current.rotation.x = 0.55 + Math.sin(time * 0.04) * 0.05;
    }

    const scrollZ = 1.3 - scrollRef.current * 0.85;
    const scrollY = -scrollRef.current * 0.7;

    state.camera.position.x += (mouseRef.current.x * 0.15 - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + mouseRef.current.y * 0.12) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8, 0);
  });

  return (
    <group ref={universeGeomRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={numStars} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[colors, 4]} count={numStars} array={colors} itemSize={4} />
        </bufferGeometry>
        <pointsMaterial size={0.06} sizeAttenuation={true} transparent vertexColors blending={THREE.AdditiveBlending} depthWrite={false} map={starTexture} />
      </points>
    </group>
  );
}

// -------------------------------------------------------------
// 4. FLOATING GEOMETRY CONSTELLATIONS (theme: 'geometry')
// -------------------------------------------------------------
function GeometryMesh({ mouseRef, scrollRef }) {
  const shapesRef = useRef([]);
  const linesGeomRef = useRef();

  const numShapes = 7;
  const shapesData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < numShapes; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 2.8,
        y: (Math.random() - 0.5) * 2.8,
        z: (Math.random() - 0.5) * 1.5 - 0.15,
        speedX: 0.04 + Math.random() * 0.07,
        speedY: 0.04 + Math.random() * 0.07,
        speedR: 0.2 + Math.random() * 0.35,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        currentX: 0,
        currentY: 0,
        currentZ: 0,
      });
    }
    return arr;
  }, []);

  const linePositions = useMemo(() => new Float32Array(35 * 2 * 3), []); // MAX lines
  const lineColors = useMemo(() => new Float32Array(35 * 2 * 4), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mX = mouseRef.current.x * state.viewport.width * 0.5;
    const mY = mouseRef.current.y * state.viewport.height * 0.5;

    // Update coordinates & drift
    for (let i = 0; i < numShapes; i++) {
      const data = shapesData[i];
      data.currentX = data.x + Math.sin(time * data.speedX + data.phaseX) * 0.12;
      data.currentY = data.y + Math.cos(time * data.speedY + data.phaseY) * 0.12;
      data.currentZ = data.z;

      // Mouse attraction warping
      const dx = mX - data.currentX;
      const dy = mY - data.currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.95) {
        data.currentX += dx * 0.06;
        data.currentY += dy * 0.06;
      }

      // Rotate individual mesh models
      if (shapesRef.current[i]) {
        shapesRef.current[i].position.set(data.currentX, data.currentY, data.currentZ);
        shapesRef.current[i].rotation.x = time * data.speedR * 0.5;
        shapesRef.current[i].rotation.y = time * data.speedR;
      }
    }

    // Connect centers if close
    let lineIdx = 0;
    const maxLinkDist = 0.95;
    const maxLinkSq = maxLinkDist * maxLinkDist;

    for (let i = 0; i < numShapes; i++) {
      const sA = shapesData[i];
      for (let j = i + 1; j < numShapes; j++) {
        const sB = shapesData[j];
        const dx = sA.currentX - sB.currentX;
        const dy = sA.currentY - sB.currentY;
        const dz = sA.currentZ - sB.currentZ;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxLinkSq) {
          const dist = Math.sqrt(distSq);
          const alpha = 1.0 - dist / maxLinkDist;

          linePositions[lineIdx * 6] = sA.currentX;
          linePositions[lineIdx * 6 + 1] = sA.currentY;
          linePositions[lineIdx * 6 + 2] = sA.currentZ;
          linePositions[lineIdx * 6 + 3] = sB.currentX;
          linePositions[lineIdx * 6 + 4] = sB.currentY;
          linePositions[lineIdx * 6 + 5] = sB.currentZ;

          lineColors[lineIdx * 8] = 0.59; // Purple-Blue #8b5cf6
          lineColors[lineIdx * 8 + 1] = 0.36;
          lineColors[lineIdx * 8 + 2] = 0.96;
          lineColors[lineIdx * 8 + 3] = alpha * 0.3;

          lineColors[lineIdx * 8 + 4] = 0.23; // Blue #3b82f6
          lineColors[lineIdx * 8 + 5] = 0.51;
          lineColors[lineIdx * 8 + 6] = 0.96;
          lineColors[lineIdx * 8 + 7] = alpha * 0.3;

          lineIdx++;
        }
      }
    }

    if (linesGeomRef.current) {
      linesGeomRef.current.setDrawRange(0, lineIdx * 2);
      linesGeomRef.current.attributes.position.needsUpdate = true;
      linesGeomRef.current.attributes.color.needsUpdate = true;
    }

    // Scroll flythrough
    const scrollZ = 1.3 - scrollRef.current * 0.85;
    const scrollY = -scrollRef.current * 0.7;

    state.camera.position.x += (mouseRef.current.x * 0.15 - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + mouseRef.current.y * 0.12) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8, 0);
  });

  return (
    <group>
      {/* Dynamic line networks */}
      <lineSegments>
        <bufferGeometry ref={linesGeomRef}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={35 * 2} array={linePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 4]} count={35 * 2} array={lineColors} itemSize={4} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      {/* Shapes wireframes */}
      {shapesData.map((d, i) => (
        <group key={i} ref={(el) => (shapesRef.current[i] = el)}>
          <mesh>
            {i % 3 === 0 && <octahedronGeometry args={[d.scale, 0]} />}
            {i % 3 === 1 && <icosahedronGeometry args={[d.scale, 0]} />}
            {i % 3 === 2 && <torusGeometry args={[d.scale * 0.7, d.scale * 0.25, 6, 16]} />}
            <meshBasicMaterial wireframe transparent color="#3b82f6" opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// 5. QUANTUM VORTEX CYCLONE (theme: 'vortex')
// -------------------------------------------------------------
function VortexMesh({ mouseRef, scrollRef }) {
  const vortexGeomRef = useRef();
  const numPoints = 1400;

  const { particlesData, positions } = useMemo(() => {
    const pData = [];
    const pos = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
      // Concentric circular orbit layers
      const radius = 0.15 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      const baseZ = (Math.random() - 0.5) * 0.3;
      pData.push({
        radius,
        baseAngle: angle,
        baseZ,
        speed: 0.15 + 0.12 / (radius || 0.1),
      });

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = baseZ;
    }
    return { particlesData: pData, positions: pos };
  }, []);

  const vortexTexture = useMemo(() => createRadialTexture('rgba(255, 255, 255, 1)', 'rgba(56, 189, 248, 0.35)'), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pos = vortexGeomRef.current.attributes.position.array;

    for (let i = 0; i < numPoints; i++) {
      const p = particlesData[i];
      // Faster rotation inside core, slower at fringes
      const angle = p.baseAngle + time * p.speed;

      pos[i * 3] = Math.cos(angle) * p.radius;
      pos[i * 3 + 1] = Math.sin(angle) * p.radius;
      pos[i * 3 + 2] = p.baseZ + Math.sin(angle * 3.0 + time) * 0.08;
    }
    vortexGeomRef.current.attributes.position.needsUpdate = true;

    // Scroll flythrough
    const scrollZ = 1.3 - scrollRef.current * 0.85;
    const scrollY = -scrollRef.current * 0.7;

    state.camera.position.x += (mouseRef.current.x * 0.15 - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + mouseRef.current.y * 0.12) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8, 0);
  });

  return (
    <points>
      <bufferGeometry ref={vortexGeomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={numPoints} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} sizeAttenuation={true} transparent blending={THREE.AdditiveBlending} depthWrite={false} map={vortexTexture} />
    </points>
  );
}

// -------------------------------------------------------------
// 6. 3D CYBERNETIC MATRIX CODE CASCADE (theme: 'matrix')
// -------------------------------------------------------------
function MatrixMesh({ mouseRef, scrollRef }) {
  const matrixGeomRef = useRef();
  
  const numTrails = 28;
  const trailLength = 12;
  const numPoints = numTrails * trailLength;

  const trails = useMemo(() => {
    const arr = [];
    for (let i = 0; i < numTrails; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 3.2,
        z: (Math.random() - 0.5) * 1.6 - 0.1,
        yOffset: Math.random() * 5.0 - 2.5,
        speed: 0.7 + Math.random() * 0.9,
      });
    }
    return arr;
  }, []);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(numPoints * 3);
    const col = new Float32Array(numPoints * 4);
    return { positions: pos, colors: col };
  }, []);

  const codeTexture = useMemo(() => createRadialTexture('rgba(255, 255, 255, 1)', 'rgba(16, 185, 129, 0.35)'), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pos = matrixGeomRef.current.attributes.position.array;
    const col = matrixGeomRef.current.attributes.color.array;

    const mX = mouseRef.current.x * state.viewport.width * 0.5;
    const mY = mouseRef.current.y * state.viewport.height * 0.5;

    let idx = 0;
    for (let t = 0; t < numTrails; t++) {
      const trail = trails[t];
      
      // Cascading fall equations
      const headY = 2.0 - ((time * trail.speed + trail.yOffset) % 4.0);

      for (let s = 0; s < trailLength; s++) {
        let y = headY + s * 0.09;
        let x = trail.x;

        // Hover code bending
        const dx = x - mX;
        const dy = y - mY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.5) {
          const force = (0.5 - dist) * 0.25;
          x += (dx / (dist || 0.001)) * force;
        }

        pos[idx * 3] = x;
        pos[idx * 3 + 1] = y;
        pos[idx * 3 + 2] = trail.z;

        // Fade tail upwards
        const alpha = Math.max(0, 1.0 - s / (trailLength - 1));
        
        col[idx * 4] = s === 0 ? 0.8 : 0.06; // White head, green trail
        col[idx * 4 + 1] = s === 0 ? 1.0 : 0.85;
        col[idx * 4 + 2] = s === 0 ? 0.8 : 0.45;
        col[idx * 4 + 3] = alpha * 0.7;

        idx++;
      }
    }
    matrixGeomRef.current.attributes.position.needsUpdate = true;
    matrixGeomRef.current.attributes.color.needsUpdate = true;

    // Scroll flythrough
    const scrollZ = 1.3 - scrollRef.current * 0.8;
    const scrollY = -scrollRef.current * 0.65;

    state.camera.position.x += (mouseRef.current.x * 0.15 - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + mouseRef.current.y * 0.12) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8, 0);
  });

  return (
    <points>
      <bufferGeometry ref={matrixGeomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={numPoints} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 4]} count={numPoints} array={colors} itemSize={4} />
      </bufferGeometry>
      <pointsMaterial size={0.065} sizeAttenuation={true} transparent vertexColors blending={THREE.AdditiveBlending} depthWrite={false} map={codeTexture} />
    </points>
  );
}

// -------------------------------------------------------------
// 7. MATHEMATICAL AURORA RIBBONS (theme: 'aurora')
// -------------------------------------------------------------
function AuroraMesh({ scrollRef, mouseRef }) {
  const ribbonsRef = useRef([]);

  const numRibbons = 7;
  const pointsPerRibbon = 50;

  // Initialize data vectors
  const ribbonPositions = useMemo(() => {
    const list = [];
    for (let r = 0; r < numRibbons; r++) {
      list.push(new Float32Array(pointsPerRibbon * 3));
    }
    return list;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    for (let r = 0; r < numRibbons; r++) {
      const pos = ribbonPositions[r];
      for (let p = 0; p < pointsPerRibbon; p++) {
        const x = (p / (pointsPerRibbon - 1) - 0.5) * 3.5;
        // Superimposition of double wavy aurora sine streams
        const y = Math.sin(x * 1.6 + time * 1.1 + r * 0.5) * 0.22 + (r / (numRibbons - 1) - 0.5) * 0.7;
        const z = Math.cos(x * 1.1 + time * 0.7 + r * 0.45) * 0.15 - 0.1;

        pos[p * 3] = x;
        pos[p * 3 + 1] = y;
        pos[p * 3 + 2] = z;
      }
      
      if (ribbonsRef.current[r]) {
        ribbonsRef.current[r].geometry.attributes.position.needsUpdate = true;
      }
    }

    // Scroll depth
    const scrollZ = 1.3 - scrollRef.current * 0.85;
    const scrollY = -scrollRef.current * 0.7;

    state.camera.position.x += (mouseRef.current.x * 0.15 - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + mouseRef.current.y * 0.12) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8, 0);
  });

  return (
    <group>
      {ribbonPositions.map((positions, r) => (
        <line key={r} ref={(el) => (ribbonsRef.current[r] = el)}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} count={pointsPerRibbon} array={positions} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            opacity={0.55}
            color={
              r % 3 === 0 ? '#ec4899' : // Pink neon #ec4899
              r % 3 === 1 ? '#8b5cf6' : // Indigo neon #8b5cf6
              '#06b6d4'                 // Cyan neon #06b6d4
            }
          />
        </line>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// 8. COSMIC STARFIELD GALAXY (theme: 'galaxy')
// -------------------------------------------------------------
function GalaxyMesh({ mouseRef, scrollRef }) {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(15000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= (delta || 0) / 10;
    ref.current.rotation.y -= (delta || 0) / 15;

    // Add scroll-cam flight-through logic for depth navigation consistency
    const scrollZ = 1.3 - scrollRef.current * 0.85;
    const scrollY = -scrollRef.current * 0.7;

    state.camera.position.x += (mouseRef.current.x * 0.15 - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + mouseRef.current.y * 0.12) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8, 0);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <DreiPoints ref={ref} positions={sphere} stride={3} frustumCulled>
        <DreiPointMaterial
          transparent
          color="#3b82f6"
          size={0.0025}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </DreiPoints>
    </group>
  );
}

// -------------------------------------------------------------
// 9. RETRO SYNTHWAVE PERSPECTIVE GRID (theme: 'cybergrid')
// -------------------------------------------------------------
function RetroGridMesh({ mouseRef, scrollRef }) {
  const gridGeomRef = useRef();
  
  // 21 lines Z + 21 lines X = 42 lines total * 2 points/line * 3 dimensions = 252 floats
  const numVertices = 84 * 3;
  const linePositions = useMemo(() => new Float32Array(numVertices), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = 0.55;
    const spacing = 0.16;
    const Y = -0.75;
    const pos = gridGeomRef.current.attributes.position.array;
    
    let idx = 0;
    
    // 1. Perspective Longitudinal Z-lines (merging towards horizon)
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20 - 0.5) * 4.5;
      
      // Far boundary Z
      pos[idx * 3] = x;
      pos[idx * 3 + 1] = Y;
      pos[idx * 3 + 2] = -3.0;
      
      // Near boundary Z (widened for 3D depth perspective)
      pos[idx * 3 + 3] = x * 1.5;
      pos[idx * 3 + 4] = Y;
      pos[idx * 3 + 5] = 1.0;
      idx += 2;
    }
    
    // 2. Endless Flowing Latitudinal X-lines (scrolling forward)
    const zOffset = (time * speed) % spacing;
    for (let i = 0; i <= 20; i++) {
      const z = -3.0 + i * spacing + zOffset;
      if (z > 1.0) continue;
      
      // Scale line ends out as they come closer to simulate correct perspective
      const leftX = -2.25 * (1.0 + (z + 3.0) * 0.1);
      const rightX = 2.25 * (1.0 + (z + 3.0) * 0.1);
      
      pos[idx * 3] = leftX;
      pos[idx * 3 + 1] = Y;
      pos[idx * 3 + 2] = z;
      pos[idx * 3 + 3] = rightX;
      pos[idx * 3 + 4] = Y;
      pos[idx * 3 + 5] = z;
      idx += 2;
    }
    
    // Zero fill safe boundaries
    while (idx < 84) {
      pos[idx * 3] = 999;
      pos[idx * 3 + 1] = 999;
      pos[idx * 3 + 2] = 999;
      idx++;
    }
    
    gridGeomRef.current.attributes.position.needsUpdate = true;

    // Camera scroll flow-through and mouse hover parallax
    const scrollZ = 1.3 - scrollRef.current * 0.85;
    const scrollY = -scrollRef.current * 0.7;

    state.camera.position.x += (mouseRef.current.x * 0.15 - state.camera.position.x) * 0.04;
    state.camera.position.y += ((scrollY + mouseRef.current.y * 0.12) - state.camera.position.y) * 0.04;
    state.camera.position.z += (scrollZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, scrollY * 0.8 - 0.25, 0);
  });

  return (
    <lineSegments>
      <bufferGeometry ref={gridGeomRef}>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={84} array={linePositions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#ec4899" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

// -------------------------------------------------------------
// MAIN MASTER CONTAINER WITH THEME DETECT SWITCH
// -------------------------------------------------------------
export default function BackgroundManager3D({ theme }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  // Capture global window movements (bypasses pointer-events restrictions)
  useEffect(() => {
    const handlePointerMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Track global scroll index
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      scrollRef.current = window.scrollY / maxScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="canvas-container">
      <Canvas camera={{ position: [0, 0, 1.3], fov: 60 }}>
        {theme === 'lattice' && <LatticeMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
        {theme === 'waves' && <WavesMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
        {theme === 'universe' && <UniverseMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
        {theme === 'galaxy' && <GalaxyMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
        {theme === 'geometry' && <GeometryMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
        {theme === 'vortex' && <VortexMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
        {theme === 'matrix' && <MatrixMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
        {theme === 'aurora' && <AuroraMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
        {theme === 'cybergrid' && <RetroGridMesh mouseRef={mouseRef} scrollRef={scrollRef} />}
      </Canvas>
    </div>
  );
}
