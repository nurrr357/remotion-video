import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
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

const Mascot2D = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 85}});
  const bob = Math.sin(frame / 14) * 8;
  const wave = Math.sin(frame / 6) * 12;
  const blink = frame % 96 < 5;
  const x = interpolate(enter, [0, 1], [180, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        right: 40,
        bottom: 210,
        width: 340,
        height: 420,
        transform: `translateX(${x}px) translateY(${bob}px) scale(${
          0.85 + enter * 0.15
        })`,
        opacity: enter,
      }}
    >
      <svg viewBox="0 0 340 420" width="340" height="420">
        <defs>
          <linearGradient id="shirt" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2d78e8" />
            <stop offset="1" stopColor="#174aa1" />
          </linearGradient>
        </defs>

        <ellipse cx="170" cy="398" rx="105" ry="16" fill="#000" opacity="0.35" />

        <g transform={`rotate(${wave} 268 258)`}>
          <path
            d="M260 252 C294 260 306 290 300 326"
            fill="none"
            stroke="#F0C39E"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <circle cx="300" cy="330" r="15" fill="#F0C39E" />
        </g>

        <path
          d="M80 248 C48 262 40 292 52 326"
          fill="none"
          stroke="#F0C39E"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <circle cx="52" cy="330" r="15" fill="#F0C39E" />

        <rect x="70" y="232" width="200" height="150" rx="42" fill="url(#shirt)" />
        <path
          d="M92 270 H248 M88 304 H252 M92 338 H248"
          stroke="#F5FAFF"
          strokeWidth="10"
          opacity="0.85"
        />

        <rect x="92" y="92" width="156" height="150" rx="42" fill="#F0C39E" />
        <path
          d="M92 150 C92 92 150 66 216 84 C242 92 254 120 248 148 L226 136 C198 116 156 116 120 136 Z"
          fill="#2A1A16"
        />

        <rect x="80" y="63" width="180" height="62" rx="24" fill="#1E63D6" />
        <rect x="98" y="49" width="144" height="34" rx="16" fill="#2F7CF0" />
        <circle cx="170" cy="44" r="19" fill="#1E63D6" />
        <path
          d="M92 90 H248"
          stroke="#0D2F6B"
          strokeWidth="5"
          opacity="0.45"
        />

        <path
          d="M122 136 C134 126 150 124 160 134"
          fill="none"
          stroke="#5A3022"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M180 134 C192 124 210 126 220 138"
          fill="none"
          stroke="#5A3022"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {blink ? (
          <>
            <path d="M134 166 H154" stroke="#182235" strokeWidth="8" strokeLinecap="round" />
            <path d="M190 166 H210" stroke="#182235" strokeWidth="8" strokeLinecap="round" />
          </>
        ) : (
          <>
            <rect x="136" y="158" width="18" height="22" rx="7" fill="#182235" />
            <rect x="190" y="158" width="18" height="22" rx="7" fill="#182235" />
            <circle cx="141" cy="164" r="3" fill="#FFFFFF" />
            <circle cx="195" cy="164" r="3" fill="#FFFFFF" />
          </>
        )}

        <ellipse cx="124" cy="194" rx="14" ry="8" fill="#DE8F87" opacity="0.6" />
        <ellipse cx="214" cy="194" rx="14" ry="8" fill="#DE8F87" opacity="0.6" />
        <path
          d="M156 206 C168 220 188 220 200 204"
          fill="none"
          stroke="#743728"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </div>
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
