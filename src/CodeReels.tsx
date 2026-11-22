import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const ACCENT = '#54A8FF';
const ACCENT_2 = '#FFD166';

const Background = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 900], [0, 120]);
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 72% 18%, #17284a 0%, #070a12 38%, #04050a 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(110,150,220,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(110,150,220,0.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `translateY(${drift * 0.25}px)`,
          maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: ACCENT,
          opacity: 0.14,
          filter: 'blur(160px)',
          top: -420 + drift,
          right: -330,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 650,
          height: 650,
          borderRadius: '50%',
          background: '#7A5CFF',
          opacity: 0.1,
          filter: 'blur(150px)',
          bottom: -240,
          left: -240,
        }}
      />
    </AbsoluteFill>
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
      alignItems: 'center',
      color: '#f5f8ff',
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 27,
      letterSpacing: 3,
      fontWeight: 700,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: ACCENT,
          boxShadow: '0 0 24px rgba(84,168,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#06111f',
          fontWeight: 900,
          fontSize: 22,
        }}
      >
        C
      </div>
      SAT SET INFO
    </div>
    <div style={{color: '#98a8c2', fontSize: 20, letterSpacing: 2}}>
      CODE REELS / 001
    </div>
  </div>
);

const SceneTitle = ({
  kicker,
  title,
  accent,
  body,
}: {
  kicker: string;
  title: string;
  accent: string;
  body?: string;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(enter, [0, 1], [70, 0]);

  return (
    <AbsoluteFill
      style={{
        padding: 78,
        justifyContent: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        opacity,
      }}
    >
      <div style={{transform: `translateY(${y}px)`}}>
        <div
          style={{
            color: accent,
            fontSize: 30,
            letterSpacing: 7,
            textTransform: 'uppercase',
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            color: '#f7f9ff',
            fontSize: 108,
            lineHeight: 0.93,
            fontWeight: 900,
            letterSpacing: -5,
          }}
        >
          {title}
        </div>
        {body ? (
          <div
            style={{
              color: '#b9c5d8',
              fontSize: 38,
              lineHeight: 1.2,
              marginTop: 34,
              maxWidth: 880,
            }}
          >
            {body}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const CodeWindow = ({
  title,
  lines,
  highlight,
  compact = false,
}: {
  title: string;
  lines: string[];
  highlight?: number;
  compact?: boolean;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 80}});
  const y = interpolate(enter, [0, 1], [45, 0]);

  return (
    <div
      style={{
        background: 'rgba(8,12,22,0.96)',
        border: '1px solid rgba(113,155,220,0.3)',
        borderRadius: 22,
        boxShadow: '0 28px 80px rgba(0,0,0,0.55)',
        overflow: 'hidden',
        transform: `translateY(${y}px)`,
        opacity: 0.35 + enter * 0.65,
      }}
    >
      <div
        style={{
          height: compact ? 52 : 62,
          background: '#111827',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 9,
        }}
      >
        <div style={{width: 11, height: 11, borderRadius: 99, background: '#ff5f57'}} />
        <div style={{width: 11, height: 11, borderRadius: 99, background: '#febc2e'}} />
        <div style={{width: 11, height: 11, borderRadius: 99, background: '#28c840'}} />
        <div
          style={{
            color: '#7f8da5',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: compact ? 18 : 21,
            marginLeft: 14,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          padding: compact ? '20px 24px' : '26px 30px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: compact ? 19 : 22,
          lineHeight: 1.7,
        }}
      >
        {lines.map((line, index) => (
          <div
            key={`${title}-${index}`}
            style={{
              color:
                index === highlight
                  ? '#d8f3ff'
                  : line.startsWith('//')
                    ? '#71809a'
                    : line.startsWith('>')
                      ? ACCENT_2
                      : '#c8d4e8',
              background:
                index === highlight ? 'rgba(84,168,255,0.13)' : 'transparent',
              borderLeft:
                index === highlight ? `3px solid ${ACCENT}` : '3px solid transparent',
              paddingLeft: 12,
              whiteSpace: 'pre-wrap',
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

const StyleCard = ({
  label,
  color,
  index,
  active,
  glyph,
}: {
  label: string;
  color: string;
  index: number;
  active?: boolean;
  glyph: string;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: Math.max(0, frame - index * 4),
    fps,
    config: {damping: 20, stiffness: 100},
  });
  const scale = active ? 1.03 : 1;
  return (
    <div
      style={{
        width: 202,
        height: 172,
        borderRadius: 18,
        padding: 17,
        boxSizing: 'border-box',
        background: `linear-gradient(145deg, ${color}33, #0c1220 80%)`,
        border: active ? `2px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.12)',
        boxShadow: active ? '0 0 32px rgba(84,168,255,0.28)' : 'none',
        transform: `scale(${scale * enter})`,
        opacity: enter,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          color,
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: -1,
        }}
      >
        {glyph}
      </div>
      <div
        style={{
          color: active ? '#ffffff' : '#c4d1e4',
          fontSize: 21,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const CubeBuddy = () => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 12) * 10;
  return (
    <div
      style={{
        width: 300,
        height: 360,
        position: 'relative',
        transform: `translateY(${bob}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 42,
          width: 232,
          height: 220,
          borderRadius: 26,
          background: '#f1c39e',
          border: '12px solid #122039',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 22,
            right: 22,
            top: -18,
            height: 58,
            borderRadius: 18,
            background: '#2166d6',
            border: '8px solid #122039',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 44,
            top: 82,
            width: 34,
            height: 28,
            borderRadius: 7,
            background: '#182235',
            boxShadow: '66px 0 0 #182235',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 42,
            top: 66,
            width: 52,
            height: 10,
            borderRadius: 8,
            background: '#6c3b22',
            transform: 'rotate(-8deg)',
            boxShadow: '72px 8px 0 #6c3b22',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 92,
            top: 132,
            width: 48,
            height: 22,
            borderRadius: 10,
            background: '#7b3425',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 126,
            width: 28,
            height: 14,
            borderRadius: 9,
            background: '#e88f8f',
            opacity: 0.7,
            boxShadow: '156px 0 0 #e88f8f',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 62,
          top: 268,
          width: 176,
          height: 88,
          borderRadius: '0 0 24px 24px',
          background:
            'repeating-linear-gradient(to bottom, #f7fbff 0 12px, #367cdf 12px 24px)',
          border: '9px solid #122039',
        }}
      />
    </div>
  );
};

const SceneOne = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 80}});
  const y = interpolate(enter, [0, 1], [90, 0]);
  return (
    <AbsoluteFill style={{padding: 78, justifyContent: 'center'}}>
      <div style={{transform: `translateY(${y}px)`, opacity: 1}}>
        <div
          style={{
            color: ACCENT,
            fontSize: 29,
            letterSpacing: 7,
            fontWeight: 800,
            marginBottom: 25,
          }}
        >
          CODE REELS
        </div>
        <div
          style={{
            color: '#f8fbff',
            fontSize: 124,
            lineHeight: 0.88,
            fontWeight: 900,
            letterSpacing: -7,
          }}
        >
          REELS
          <br />
          <span style={{color: ACCENT}}>ANIMASI</span>
        </div>
        <div
          style={{
            color: '#c0ccdf',
            fontSize: 43,
            lineHeight: 1.15,
            marginTop: 30,
            maxWidth: 750,
          }}
        >
          tanpa generator video.
        </div>
        <div
          style={{
            display: 'inline-flex',
            marginTop: 34,
            border: `1px solid ${ACCENT}66`,
            borderRadius: 999,
            padding: '13px 22px',
            color: '#dff0ff',
            fontSize: 24,
            letterSpacing: 2,
            background: 'rgba(84,168,255,0.1)',
          }}
        >
          100% DARI KODE
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneTwo = () => (
  <AbsoluteFill style={{padding: 74, justifyContent: 'center'}}>
    <div
      style={{
        color: ACCENT_2,
        fontSize: 27,
        letterSpacing: 6,
        fontWeight: 800,
        marginBottom: 26,
      }}
    >
      01 / AI NULIS KODE
    </div>
    <CodeWindow
      title="AI CODE — ~/reels"
      lines={[
        '> bikin reels 30 detik, gaya kinetik',
        'Write(reel.tsx)',
        "hook.text('Reels animasi')",
        "hook.sfx('whoosh', 0.2)",
        "styles.cards(['Kinetik','Voxel'])",
      ]}
      highlight={2}
    />
    <div
      style={{
        color: '#f7f9ff',
        fontSize: 72,
        lineHeight: 0.96,
        fontWeight: 900,
        letterSpacing: -3,
        marginTop: 38,
      }}
    >
      Kasih satu ide.
      <br />
      <span style={{color: ACCENT}}>Sisanya kode.</span>
    </div>
  </AbsoluteFill>
);

const SceneThree = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({frame, fps, config: {damping: 20, stiffness: 90}});
  return (
    <AbsoluteFill style={{padding: 70, justifyContent: 'center'}}>
      <div style={{opacity: 0.35 + title * 0.65, transform: `translateY(${(1 - title) * 35}px)`}}>
        <div
          style={{
            color: ACCENT_2,
            fontSize: 27,
            letterSpacing: 6,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          02 / GAYA BEBAS
        </div>
        <div
          style={{
            color: '#f8fbff',
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 0.95,
          }}
        >
          pilih satu,
          <br />
          atau campur.
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginTop: 32,
        }}
      >
        <StyleCard label="KINETIK" color="#54A8FF" index={0} glyph="Aa" />
        <StyleCard label="KOLASE" color="#FFD166" index={1} glyph="▧" />
        <StyleCard label="SKETSA" color="#F4F7FF" index={2} glyph="✎" />
        <StyleCard label="VOXEL" color="#9B8CFF" index={3} active glyph="▦" />
        <StyleCard label="GLOW" color="#44E0C1" index={4} glyph="✦" />
        <StyleCard label="CARD" color="#FF8DAA" index={5} glyph="▤" />
        <StyleCard label="DIORAMA" color="#E3A66B" index={6} glyph="◫" />
        <StyleCard label="FLAT" color="#8ED8FF" index={7} glyph="◉" />
      </div>
      <div
        style={{
          color: '#d7e2f3',
          fontSize: 30,
          marginTop: 28,
          letterSpacing: 1,
        }}
      >
        dari teks kinetik <span style={{color: ACCENT}}>sampai voxel.</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneFour = () => (
  <AbsoluteFill style={{padding: 70, justifyContent: 'center'}}>
    <div
      style={{
        color: ACCENT_2,
        fontSize: 27,
        letterSpacing: 6,
        fontWeight: 800,
        marginBottom: 16,
      }}
    >
      03 / SEMUANYA DARI KODE
    </div>
    <div
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'center',
      }}
    >
      <div style={{flex: 1}}>
        <CodeWindow
          title="reel.tsx"
          compact
          lines={[
            '<Reel fps={30} duration={30}>',
            '  <Hook text="..." />',
            '  <Style name="voxel" />',
            '  <CTA text="deskripsi" />',
            '</Reel>',
          ]}
          highlight={2}
        />
        <div
          style={{
            color: '#f8fbff',
            fontSize: 72,
            lineHeight: 0.95,
            fontWeight: 900,
            letterSpacing: -4,
            marginTop: 34,
          }}
        >
          tiap frame
          <br />
          <span style={{color: ACCENT}}>dari kode.</span>
        </div>
      </div>
      <div style={{width: 300, flexShrink: 0}}>
        <CubeBuddy />
      </div>
    </div>
    <div
      style={{
        color: '#b9c7da',
        fontSize: 29,
        marginTop: 24,
        letterSpacing: 0.5,
      }}
    >
      render sendiri <span style={{color: ACCENT_2}}>tanpa watermark.</span>
    </div>
  </AbsoluteFill>
);

const SceneFive = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 100}});
  const blink = Math.floor(frame / 18) % 2 === 0;
  return (
    <AbsoluteFill style={{padding: 78, justifyContent: 'center'}}>
      <div style={{transform: `scale(${0.96 + enter * 0.04})`, opacity: 0.35 + enter * 0.65}}>
        <div
          style={{
            color: ACCENT,
            fontSize: 30,
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
            fontSize: 118,
            lineHeight: 0.9,
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
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginTop: 36,
            color: '#d6e4f7',
            fontSize: 31,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 20,
              height: 38,
              background: blink ? ACCENT : 'transparent',
              border: `2px solid ${ACCENT}`,
            }}
          />
          follow @SatSetInfo
        </div>
        <div
          style={{
            marginTop: 52,
            borderTop: '1px solid rgba(255,255,255,0.14)',
            paddingTop: 22,
            color: '#8191aa',
            fontSize: 24,
            letterSpacing: 1,
          }}
        >
          BUKAN VIDEO AI. INI KODE.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CodeReels = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 900], [0, 1]);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#04050a',
        fontFamily: 'Inter, Arial, sans-serif',
        color: '#f8fbff',
      }}
    >
      <Audio src={staticFile('music.mp3')} volume={0.1} loop />
      <Background />
      <Sequence from={0} durationInFrames={150}>
        <Audio src={staticFile('reel-voice-01.mp3')} />
        <SceneOne />
      </Sequence>
      <Sequence from={150} durationInFrames={210}>
        <Audio src={staticFile('reel-voice-02.mp3')} />
        <SceneTwo />
      </Sequence>
      <Sequence from={360} durationInFrames={240}>
        <Audio src={staticFile('reel-voice-03.mp3')} />
        <SceneThree />
      </Sequence>
      <Sequence from={600} durationInFrames={180}>
        <Audio src={staticFile('reel-voice-04.mp3')} />
        <SceneFour />
      </Sequence>
      <Sequence from={780} durationInFrames={120}>
        <Audio src={staticFile('reel-voice-05.mp3')} />
        <SceneFive />
      </Sequence>
      <Brand />
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
