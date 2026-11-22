import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Props = {
  title: string;
  subtitle: string;
  accent: string;
};

const Background = ({accent}: {accent: string}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 900], [0, 80]);

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(150deg, #07090f 0%, #131a2a 55%, #05060a 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: accent,
          opacity: 0.18,
          filter: 'blur(140px)',
          top: -260 + drift,
          right: -320 - drift,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: '#3b82f6',
          opacity: 0.12,
          filter: 'blur(160px)',
          bottom: -240,
          left: -260 + drift,
        }}
      />
    </AbsoluteFill>
  );
};

const Scene = ({
  eyebrow,
  title,
  body,
  accent,
}: {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 90},
  });

  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(enter, [0, 1], [90, 0]);

  return (
    <AbsoluteFill style={{padding: 96, justifyContent: 'center', opacity}}>
      <div style={{transform: `translateY(${y}px)`}}>
        <div
          style={{
            color: accent,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 8,
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 100,
            lineHeight: 0.98,
            fontWeight: 800,
            letterSpacing: -4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: '#c7cbd6',
            fontSize: 42,
            lineHeight: 1.25,
            marginTop: 40,
            maxWidth: 880,
          }}
        >
          {body}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Shorts = ({title, subtitle, accent}: Props) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 900], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#05060a',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <Background accent={accent} />

      <Sequence from={0} durationInFrames={300}>
        <Scene
          eyebrow="Shorts"
          title={title}
          body={subtitle}
          accent={accent}
        />
      </Sequence>

      <Sequence from={300} durationInFrames={300}>
        <Scene
          eyebrow="Poin 01"
          title="Satu ide. Satu pesan."
          body="Jangan taruh semua hal di satu video. Pilih satu masalah, satu solusi."
          accent={accent}
        />
      </Sequence>

      <Sequence from={600} durationInFrames={300}>
        <Scene
          eyebrow="Penutup"
          title="Simpan untuk nanti."
          body="Ganti judul, teks, dan warna lewat props. Render ulang."
          accent={accent}
        />
      </Sequence>

      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          bottom: 72,
          height: 8,
          backgroundColor: '#1f2430',
          borderRadius: 999,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: accent,
            borderRadius: 999,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
