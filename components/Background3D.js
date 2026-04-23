'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as random from 'maath/random/dist/maath-random.esm';

function StarField(props) {
  const ref = useRef();
  // 5000 points * 3 coordinates (x, y, z) = 15000
  const [sphere] = useState(() => random.inSphere(new Float32Array(15000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Background3D() {
  return (
    <div id="canvas-container">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarField />
      </Canvas>
    </div>
  );
}
