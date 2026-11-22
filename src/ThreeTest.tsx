import {ThreeCanvas} from '@remotion/three';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const ACCENT = '#54A8FF';

export const ThreeTest = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const fade = interpolate(frame, [0, 12], [0.35, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#05070d', fontFamily: 'Inter, Arial, sans-serif'}}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{fov: 45, position: [0, 0, 6]}}
        style={{position: 'absolute', inset: 0}}
      >
        <color attach="background" args={['#05070d']} />
        <fog attach="fog" args={['#05070d', 5, 12]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 4, 5]} intensity={2.6} />
        <pointLight position={[-3, -1, 2]} intensity={2.2} color={ACCENT} />

        <mesh
          position={[0, 0.15, 0]}
          rotation={[0.2 + frame * 0.006, frame * 0.025, 0]}
        >
          <boxGeometry args={[1.55, 1.55, 1.55]} />
          <meshStandardMaterial
            color={ACCENT}
            metalness={0.55}
            roughness={0.2}
            emissive={ACCENT}
            emissiveIntensity={0.08}
          />
        </mesh>

        <mesh
          position={[1.85, -1.15, -0.6]}
          rotation={[0.4, -frame * 0.018, 0.2]}
        >
          <torusKnotGeometry args={[0.43, 0.15, 110, 24]} />
          <meshStandardMaterial
            color="#FFD166"
            metalness={0.45}
            roughness={0.25}
          />
        </mesh>

        <mesh
          position={[-2.05, 1.25, -1.4]}
          rotation={[0.2, frame * 0.012, -0.2]}
        >
          <icosahedronGeometry args={[0.65, 1]} />
          <meshStandardMaterial
            color="#9B8CFF"
            metalness={0.2}
            roughness={0.35}
            wireframe
          />
        </mesh>

        <gridHelper
          args={[14, 28, '#1d3557', '#0c1424']}
          position={[0, -1.7, -1]}
        />
      </ThreeCanvas>

      <AbsoluteFill
        style={{
          padding: 72,
          justifyContent: 'space-between',
          opacity: fade,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#f6f9ff',
            fontSize: 25,
            letterSpacing: 4,
            fontWeight: 800,
          }}
        >
          <span>SAT SET INFO</span>
          <span style={{color: '#7d8da8'}}>THREE.JS TEST / 005s</span>
        </div>

        <div
          style={{
            transform: `translateY(${(1 - enter) * 50}px)`,
            opacity: 0.45 + enter * 0.55,
          }}
        >
          <div
            style={{
              color: ACCENT,
              fontSize: 28,
              letterSpacing: 7,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            GITHUB ACTIONS
          </div>
          <div
            style={{
              color: '#f7faff',
              fontSize: 94,
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: -4,
            }}
          >
            THREE.JS
            <br />
            <span style={{color: ACCENT}}>TANPA GPU.</span>
          </div>
          <div
            style={{
              color: '#b9c7da',
              fontSize: 32,
              marginTop: 26,
            }}
          >
            software renderer / swangle
          </div>
        </div>

        <div
          style={{
            height: 7,
            borderRadius: 99,
            background: '#1b2638',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(frame / 150) * 100}%`,
              height: '100%',
              background: ACCENT,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
