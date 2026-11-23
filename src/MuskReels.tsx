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

const BG = '#05080d';
const ACCENT = '#5EE6A8';
const BLUE = '#66B7FF';
const GOLD = '#FFD166';
const WHITE = '#F6FAFF';
const MUTED = '#A9B7C9';

const PARTICLES = 320;
const particlePositions = new Float32Array(PARTICLES * 3);
for (let i = 0; i < PARTICLES; i++) {
  particlePositions[i * 3] = (random(`mx-${i}`) - 0.5) * 14;
  particlePositions[i * 3 + 1] = (random(`my-${i}`) - 0.5) * 10;
  particlePositions[i * 3 + 2] = (random(`mz-${i}`) - 0.5) * 8;
}

const CameraRig = () => {
  const frame = useCurrentFrame();
  const {camera} = useThree();
  const orbit = frame * 0.004;
  camera.position.set(
    Math.sin(orbit) * 4.8,
    1.1 + Math.sin(frame * 0.006) * 0.45,
    5.7 + Math.cos(orbit) * 0.8,
  );
  camera.lookAt(0, 0, 0);
  return null;
};

const ParticleField = () => {
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
        size={0.042}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const NetworkCore = () => {
  const frame = useCurrentFrame();
  const orbit = frame * 0.008;
  const nodeNames = [0, 1, 2, 3, 4];

  return (
    <group rotation={[0.1, frame * 0.003, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.18, 1]} />
        <meshStandardMaterial
          color={ACCENT}
          wireframe
          transparent
          opacity={0.72}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, frame * 0.002]}>
        <torusGeometry args={[2.08, 0.014, 10, 90]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.38} />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, frame * 0.003, 0.2]}>
        <torusGeometry args={[2.5, 0.011, 10, 90]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.3} />
      </mesh>

      {nodeNames.map((i) => {
        const angle = orbit + (i * Math.PI * 2) / nodeNames.length;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 2.3,
              Math.sin(angle * 1.35 + i) * 0.68,
              Math.sin(angle) * 1.12,
            ]}
          >
            <sphereGeometry args={[i === 0 ? 0.14 : 0.1, 18, 18]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? GOLD : WHITE}
              emissive={i % 2 === 0 ? GOLD : ACCENT}
              emissiveIntensity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const World = () => {
  const {width, height} = useVideoConfig();
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [0, 360, 660, 760], [0.9, 0.9, 0.55, 0.4], {
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
        <ParticleField />
        <NetworkCore />
        <gridHelper
          args={[16, 24, '#17382e', '#0a1411']}
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
      color: WHITE,
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 24,
      letterSpacing: 3,
      fontWeight: 800,
    }}
  >
    <span>SAT SET INFO</span>
    <span style={{color: '#7F92A8'}}>MUSK / 001</span>
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
          'linear-gradient(to top, rgba(3,6,11,0.82) 0%, rgba(3,6,11,0.18) 50%, transparent 76%)',
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px)`,
          opacity: 0.45 + enter * 0.55,
          maxWidth: 820,
        }}
      >
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
            color: WHITE,
            fontSize: 88,
            lineHeight: 0.96,
            fontWeight: 900,
            letterSpacing: -4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: MUTED,
            fontSize: 34,
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

const Heading = ({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 178,
        left: 72,
        right: 72,
        fontFamily: 'Inter, Arial, sans-serif',
        transform: `translateY(${(1 - enter) * 35}px)`,
        opacity: 0.45 + enter * 0.55,
      }}
    >
      <div
        style={{
          color: ACCENT,
          fontSize: 26,
          letterSpacing: 6,
          fontWeight: 800,
          marginBottom: 16,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          color: WHITE,
          fontSize: 82,
          lineHeight: 0.96,
          fontWeight: 900,
          letterSpacing: -4,
          maxWidth: 900,
        }}
      >
        {title}
      </div>
    </div>
  );
};

const COMPANIES = [
  {name: 'TESLA', tag: 'ENERGI', color: '#E85D5D'},
  {name: 'SPACEX', tag: 'ANTARIKSA', color: BLUE},
  {name: 'X', tag: 'KOMUNIKASI', color: WHITE},
  {name: 'NEURALINK', tag: 'OTAK', color: '#B798FF'},
  {name: 'BORING CO.', tag: 'INFRASTRUKTUR', color: GOLD},
];

const CompanyGrid = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 72,
        top: 600,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {COMPANIES.map((company, i) => {
        const enter = spring({
          frame: frame - i * 7,
          fps,
          config: {damping: 17, stiffness: 90},
        });
        return (
          <div
            key={company.name}
            style={{
              gridColumn: i === 4 ? '1 / -1' : undefined,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              minHeight: 104,
              padding: '18px 22px',
              borderRadius: 18,
              border: '1px solid rgba(94,230,168,0.32)',
              background: 'rgba(6,11,17,0.9)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
              transform: `translateY(${(1 - enter) * 30}px)`,
              opacity: 0.3 + enter * 0.7,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 99,
                  background: company.color,
                  boxShadow: `0 0 16px ${company.color}`,
                }}
              />
              <span
                style={{
                  color: WHITE,
                  fontSize: 27,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                }}
              >
                {company.name}
              </span>
            </div>
            <span
              style={{
                color: '#91A3B8',
                fontSize: 18,
                letterSpacing: 2,
                fontWeight: 700,
              }}
            >
              {company.tag}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ConnectionRail = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 90}});

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 72,
        top: 620,
        display: 'grid',
        gap: 18,
        fontFamily: 'Inter, Arial, sans-serif',
        opacity: 0.4 + enter * 0.6,
        transform: `translateY(${(1 - enter) * 30}px)`,
      }}
    >
      {['ENERGI', 'ANTARIKSA', 'KOMUNIKASI', 'OTAK', 'INFRASTRUKTUR'].map(
        (label, i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              paddingBottom: 13,
              borderBottom: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <span
              style={{
                color: ACCENT,
                width: 43,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              0{i + 1}
            </span>
            <span
              style={{
                color: WHITE,
                fontSize: 29,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              {label}
            </span>
          </div>
        ),
      )}
    </div>
  );
};

const Monogram = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 15, stiffness: 80}});
  const rotate = Math.sin(frame / 35) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        right: 58,
        top: 150,
        width: 168,
        height: 168,
        borderRadius: '50%',
        border: '1px solid rgba(94,230,168,0.4)',
        display: 'grid',
        placeItems: 'center',
        transform: `rotate(${rotate}deg) scale(${0.75 + enter * 0.25})`,
        opacity: 0.35 + enter * 0.65,
        fontFamily: 'Inter, Arial, sans-serif',
        color: ACCENT,
        fontSize: 74,
        fontWeight: 900,
        boxShadow: '0 0 60px rgba(94,230,168,0.12)',
      }}
    >
      M
      <span
        style={{
          position: 'absolute',
          inset: 14,
          border: '1px dashed rgba(255,209,102,0.4)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

const SceneOne = () => (
  <>
    <Monogram />
    <TextBlock
      kicker="ELON MUSK / BUKAN CUMA CEO"
      title="BUKAN CUMA CEO."
      body="Dia membangun ekosistem, bukan satu perusahaan."
    />
  </>
);

const SceneTwo = () => (
  <>
    <Heading kicker="YANG DI BELAKANGNYA" title="EKOSISTEMNYA." />
    <CompanyGrid />
  </>
);

const SceneThree = () => (
  <>
    <Heading kicker="BUKAN SATU PRODUK" title="SALING TERHUBUNG." />
    <ConnectionRail />
  </>
);

const SceneFour = () => {
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
          'linear-gradient(120deg, rgba(4,8,13,0.9), rgba(4,8,13,0.3))',
      }}
    >
      <div
        style={{
          opacity: 0.45 + enter * 0.55,
          transform: `translateY(${(1 - enter) * 45}px)`,
        }}
      >
        <div
          style={{
            color: ACCENT,
            fontSize: 28,
            letterSpacing: 7,
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          MAU PART 2?
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 97,
            lineHeight: 0.94,
            fontWeight: 900,
            letterSpacing: -5,
          }}
        >
          KOMENTAR
          <br />
          <span style={{color: ACCENT}}>“MUSK”.</span>
        </div>
        <div
          style={{
            color: MUTED,
            fontSize: 31,
            marginTop: 32,
          }}
        >
          follow @SatSetInfo buat lanjutannya.
        </div>
        <div
          style={{
            color: '#75879D',
            fontSize: 22,
            letterSpacing: 2,
            marginTop: 54,
          }}
        >
          EKOSISTEM, BUKAN SATU PRODUK.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MuskReels = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 900], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        color: WHITE,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <Audio src={staticFile('music.mp3')} volume={0.1} loop />
      <World />
      <Brand />

      <Sequence from={0} durationInFrames={180}>
        <Audio src={staticFile('musk-voice-01.mp3')} />
        <SceneOne />
      </Sequence>
      <Sequence from={180} durationInFrames={240}>
        <Audio src={staticFile('musk-voice-02.mp3')} />
        <SceneTwo />
      </Sequence>
      <Sequence from={420} durationInFrames={240}>
        <Audio src={staticFile('musk-voice-03.mp3')} />
        <SceneThree />
      </Sequence>
      <Sequence from={660} durationInFrames={240}>
        <Audio src={staticFile('musk-voice-04.mp3')} />
        <SceneFour />
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
