import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {Mascot2D} from './brand/Mascot2D';
import {
  AbsoluteFill,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const ACCENT = '#54A8FF';
const GOLD = '#FFD166';
const BG = '#05070d';

const PARTICLE_COUNT = 320;
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlePositions[i * 3] = (random(`px-${i}`) - 0.5) * 14;
  particlePositions[i * 3 + 1] = (random(`py-${i}`) - 0.5) * 10;
  particlePositions[i * 3 + 2] = (random(`pz-${i}`) - 0.5) * 8;
}

const CameraRig = () => {
  const frame = useCurrentFrame();
  const {camera} = useThree();
  const orbit = frame * 0.004;
  camera.position.set(
    Math.sin(orbit) * 4.6,
    1.1 + Math.sin(frame * 0.006) * 0.45,
    5.6 + Math.cos(orbit) * 0.7,
  );
  camera.lookAt(0, 0, 0);
  return null;
};

const Particles = () => {
  const frame = useCurrentFrame();
  return (
    <points rotation={[0.1, frame * 0.0018, frame * 0.0006]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT}
        size={0.045}
        transparent
        opacity={0.72}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const ExplainerGraphic = () => {
  const frame = useCurrentFrame();
  const orbit = frame * 0.008;

  return (
    <group rotation={[0.12, frame * 0.003, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color={ACCENT}
          wireframe
          transparent
          opacity={0.75}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, frame * 0.002]}>
        <torusGeometry args={[2.1, 0.015, 10, 90]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, frame * 0.003, 0.2]}>
        <torusGeometry args={[2.55, 0.012, 10, 90]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.32} />
      </mesh>

      {[0, 1, 2, 3].map((i) => {
        const angle = orbit + (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 2.25,
              Math.sin(angle * 1.4 + i) * 0.6,
              Math.sin(angle) * 1.1,
            ]}
          >
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? GOLD : '#FFFFFF'}
              emissive={i % 2 === 0 ? GOLD : ACCENT}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const ThreeWorld = () => {
  const {width, height} = useVideoConfig();
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [330, 390, 690, 750], [1, 0.55, 0.55, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'absolute', inset: 0, opacity: dim}}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{fov: 44, position: [0, 0, 6]}}
        style={{position: 'absolute', inset: 0}}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 5, 13]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 5]} intensity={2.4} />
        <pointLight position={[-3, -1, 3]} intensity={2.2} color={ACCENT} />
        <CameraRig />
        <Particles />
        <ExplainerGraphic />
        <gridHelper
          args={[16, 24, '#1b3152', '#0b1322']}
          position={[0, -1.8, -1]}
        />
      </ThreeCanvas>
    </div>
  );
};

const Brand = () => (
  <div
    style={{
      position: 'absolute',
      top: 58,
      left: 72,
      right: 72,
      display: 'flex',
      justifyContent: 'space-between',
      color: '#f7faff',
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 25,
      letterSpacing: 3,
      fontWeight: 800,
    }}
  >
    <span>SAT SET INFO</span>
    <span style={{color: '#7e8da7'}}>THREE.REELS / 001</span>
  </div>
);

const TextBlock = ({
  kicker,
  title,
  body,
  align = 'left',
}: {
  kicker: string;
  title: string;
  body: string;
  align?: 'left' | 'right';
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const y = interpolate(enter, [0, 1], [45, 0]);
  return (
    <AbsoluteFill
      style={{
        padding: 78,
        justifyContent: 'flex-end',
        paddingBottom: 190,
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
        textAlign: align,
        fontFamily: 'Inter, Arial, sans-serif',
        background:
          'linear-gradient(to top, rgba(3,5,10,0.78) 0%, rgba(3,5,10,0.2) 48%, transparent 75%)',
      }}
    >
      <div style={{transform: `translateY(${y}px)`, maxWidth: 760}}>
        <div
          style={{
            color: ACCENT,
            fontSize: 27,
            letterSpacing: 6,
            fontWeight: 800,
            marginBottom: 20,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            color: '#f8fbff',
            fontSize: 82,
            lineHeight: 0.96,
            fontWeight: 900,
            letterSpacing: -4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: '#c2cee0',
            fontSize: 33,
            lineHeight: 1.25,
            marginTop: 24,
          }}
        >
          {body}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CodePanel = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const y = interpolate(enter, [0, 1], [40, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        bottom: 470,
        width: 560,
        background: 'rgba(7,11,20,0.94)',
        border: '1px solid rgba(84,168,255,0.35)',
        borderRadius: 20,
        boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
        padding: '20px 24px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 20,
        lineHeight: 1.6,
        transform: `translateY(${y}px)`,
        opacity: 0.4 + enter * 0.6,
      }}
    >
      <div style={{color: '#6e7f9b', marginBottom: 12}}>scene.config.ts</div>
      <div style={{color: GOLD}}>camera: orbit(0.006)</div>
      <div style={{color: ACCENT}}>particles: 460</div>
      <div style={{color: '#f7faff'}}>character: 2d.sprite</div>
      <div style={{color: '#8c9bb2'}}>// 3d background + 2d actor</div>
    </div>
  );
};

const SceneOne = () => (
  <TextBlock
    kicker="01 / DUNIA 3D"
    title="PARTIKEL & KAMERA."
    body="3D untuk atmosfer. Bukan untuk karakter."
  />
);

const SceneTwo = () => (
  <TextBlock
    kicker="02 / GRAFIK 3D"
    title="JELASKAN DENGAN RUANG."
    body="Kamera bergerak. Objek menjelaskan."
  />
);

const SceneThree = () => (
  <>
    <TextBlock
      kicker="03 / KARAKTER 2D"
      title="TETAP 2D."
      body="Tapi dianimasikan frame demi frame."
    />
    <Mascot2D />
  </>
);

const SceneFour = () => (
  <>
    <TextBlock
      kicker="04 / SEMUA KODE"
      title="ATUR SEMUA."
      body="Kamera, partikel, gerakan karakter."
    />
    <CodePanel />
    <Mascot2D />
  </>
);

const SceneFive = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 100}});
  return (
    <AbsoluteFill
      style={{
        padding: 78,
        justifyContent: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        background:
          'linear-gradient(120deg, rgba(4,7,14,0.88), rgba(4,7,14,0.3))',
      }}
    >
      <div style={{opacity: 0.45 + enter * 0.55, transform: `translateY(${(1 - enter) * 45}px)`}}>
        <div
          style={{
            color: ACCENT,
            fontSize: 28,
            letterSpacing: 7,
            fontWeight: 800,
            marginBottom: 26,
          }}
        >
          MAU TEMPLATE-NYA?
        </div>
        <div
          style={{
            color: '#f8fbff',
            fontSize: 108,
            lineHeight: 0.92,
            fontWeight: 900,
            letterSpacing: -6,
          }}
        >
          Cek
          <br />
          <span style={{color: ACCENT}}>deskripsi.</span>
        </div>
        <div
          style={{
            color: '#c2cee0',
            fontSize: 31,
            marginTop: 34,
          }}
        >
          follow @SatSetInfo
        </div>
        <div
          style={{
            color: '#7f8da6',
            fontSize: 24,
            letterSpacing: 2,
            marginTop: 54,
          }}
        >
          THREE.JS UNTUK DUNIA. SVG UNTUK KARAKTER.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ThreeReels = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 900], [0, 1]);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        fontFamily: 'Inter, Arial, sans-serif',
        color: '#f8fbff',
      }}
    >
      <Audio src={staticFile('music.mp3')} volume={0.1} loop />
      <ThreeWorld />
      <Brand />

      <Sequence from={0} durationInFrames={180}>
        <Audio src={staticFile('three-voice-01.mp3')} />
        <SceneOne />
      </Sequence>
      <Sequence from={180} durationInFrames={180}>
        <Audio src={staticFile('three-voice-02.mp3')} />
        <SceneTwo />
      </Sequence>
      <Sequence from={360} durationInFrames={210}>
        <Audio src={staticFile('three-voice-03.mp3')} />
        <SceneThree />
      </Sequence>
      <Sequence from={570} durationInFrames={180}>
        <Audio src={staticFile('three-voice-04.mp3')} />
        <SceneFour />
      </Sequence>
      <Sequence from={750} durationInFrames={150}>
        <Audio src={staticFile('three-voice-05.mp3')} />
        <SceneFive />
      </Sequence>

      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 52,
          height: 7,
          borderRadius: 99,
          background: 'rgba(255,255,255,0.12)',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 99,
            background: ACCENT,
            boxShadow: `0 0 18px ${ACCENT}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
