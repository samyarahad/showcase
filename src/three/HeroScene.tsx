import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

/* =============================================================================
   HeroScene — a cinematic 3D opening:
   - A central glowing icosahedron "core" with subtle pulsing
   - A field of particles around it
   - Subtle connection lines between nearby particles
   - Slow camera dolly toward the core as the user scrolls past hero
   ============================================================================= */

interface HeroSceneProps {
  /** Scroll progress through the hero section (0 → 1) */
  scrollProgress: number;
}

function CoreGeometry({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
    if (meshRef.current) {
      const pulse = 1 + Math.sin(t * 0.8) * 0.04;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Solid inner icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#6366f1"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.7}
          flatShading
        />
      </mesh>
      {/* Wireframe outer shell */}
      <lineSegments ref={wireRef} scale={1.6}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.4, 1)]} />
        <lineBasicMaterial color="#a855f7" transparent opacity={0.55} />
      </lineSegments>
      {/* Outer halo */}
      <mesh scale={2.4}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function ParticleField({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, colors, linePositions } = useMemo(() => {
    const count = reducedMotion ? 240 : 720;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const linePositions: number[] = [];

    const indigo = new THREE.Color('#6366f1');
    const violet = new THREE.Color('#a855f7');
    const magenta = new THREE.Color('#d946ef');

    const points: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      // Distribute on a spherical shell
      const r = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions.set([x, y, z], i * 3);
      points.push(new THREE.Vector3(x, y, z));

      const mix = Math.random();
      const c = mix < 0.5 ? indigo : mix < 0.85 ? violet : magenta;
      colors.set([c.r, c.g, c.b], i * 3);
    }

    // Connect close neighbors
    const linkDist = 1.2;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < linkDist) {
          linePositions.push(points[i].x, points[i].y, points[i].z);
          linePositions.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }

    return {
      positions,
      colors,
      linePositions: new Float32Array(linePositions),
    };
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x += delta * 0.012;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.04;
      linesRef.current.rotation.x += delta * 0.012;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function CameraRig({ scrollProgress, reducedMotion }: { scrollProgress: number; reducedMotion: boolean }) {
  const { camera } = useThree();
  const targetZ = useRef(7);

  useFrame(() => {
    // Dolly the camera closer as the user scrolls past hero
    const desiredZ = reducedMotion ? 7 : 7 - scrollProgress * 3.5;
    const desiredY = reducedMotion ? 0 : -scrollProgress * 0.8;
    targetZ.current += (desiredZ - targetZ.current) * 0.06;
    camera.position.z = targetZ.current;
    camera.position.y += (desiredY - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroScene({ scrollProgress }: HeroSceneProps) {
  const reducedMotion = useReducedMotion();
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      const test = document.createElement('canvas');
      const gl = test.getContext('webgl2') || test.getContext('webgl');
      if (!gl) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, []);

  if (!webglOk) {
    // ---- CSS fallback ----
    return (
      <div className="hero-fallback" aria-hidden>
        <div className="hero-fallback__core" />
        <div className="hero-fallback__ring" />
        <div className="hero-fallback__ring hero-fallback__ring--2" />
        <style>{`
          .hero-fallback {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }
          .hero-fallback__core {
            width: 200px; height: 200px;
            border-radius: 50%;
            background: radial-gradient(circle at 35% 35%, #c4b5fd, #6366f1 50%, #1e1b4b 100%);
            box-shadow: 0 0 80px 8px rgba(168, 85, 247, 0.45), 0 0 200px 20px rgba(99, 102, 241, 0.25);
          }
          .hero-fallback__ring {
            position: absolute;
            width: 380px; height: 380px;
            border-radius: 50%;
            border: 1px solid rgba(168, 85, 247, 0.35);
            animation: hero-ring 18s linear infinite;
          }
          .hero-fallback__ring--2 {
            width: 520px; height: 520px;
            border-color: rgba(99, 102, 241, 0.25);
            animation-duration: 28s;
            animation-direction: reverse;
          }
          @keyframes hero-ring {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .hero-fallback__ring, .hero-fallback__ring--2 { animation: none; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <color attach="background" args={['#050614']} />
      <fog attach="fog" args={['#050614', 6, 18]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2.2} color="#a855f7" />
      <pointLight position={[-5, -3, 4]} intensity={1.6} color="#6366f1" />
      <pointLight position={[0, 0, -8]} intensity={1.2} color="#d946ef" />

      <CoreGeometry reducedMotion={reducedMotion} />
      <ParticleField reducedMotion={reducedMotion} />
      <CameraRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
