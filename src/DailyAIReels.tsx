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
import {COLORS, FONT_FAMILY, Mascot2D} from './brand';

const SCENE_FRAMES = 180;

type SceneData = {
  kicker: string;
  title: string;
  body: string;
  audio: string;
};

export type DailyAIReelsProps = {
  theme: 'agent' | 'verify' | 'videoagent';
  index: string;
  title: string;
  scenes: SceneData[];
};

const accentFor = (theme: DailyAIReelsProps['theme']) => {
  if (theme === 'verify') return COLORS.gold;
  if (theme === 'videoagent') return COLORS.blue;
  return COLORS.accent;
};

const Background = ({theme}: {theme: DailyAIReelsProps['theme']}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 55) * 22;
  const accent = accentFor(theme);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          top: -430,
          right: -300 + drift,
          borderRadius: '50%',
          border: `1px solid ${accent}30`,
          transform: `rotate(${frame * 0.04}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          bottom: -340,
          left: -260 - drift,
          borderRadius: '50%',
          border: `1px solid ${COLORS.text}16`,
          transform: `rotate(${-frame * 0.03}deg)`,
        }}
      />
      {theme === 'agent' ? <AgentField accent={accent} /> : null}
      {theme === 'verify' ? <VerifyField /> : null}
      {theme === 'videoagent' ? <VideoField /> : null}
    </AbsoluteFill>
  );
};

const AgentField = ({accent}: {accent: string}) => {
  const frame = useCurrentFrame();
  const nodes = [
    [740, 620, 0.4],
    [900, 760, 1.3],
    [700, 840, 2.2],
    [520, 700, 3.1],
    [820, 1030, 4.0],
  ];
  return (
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <g opacity={0.45}>
        {nodes.slice(0, -1).map((node, index) => {
          const next = nodes[index + 1];
          return (
            <line
              key={index}
              x1={node[0]}
              y1={node[1]}
              x2={next[0]}
              y2={next[1]}
              stroke={accent}
              strokeWidth={2}
              opacity={0.32 + Math.sin(frame / 30 + index) * 0.16}
            />
          );
        })}
      </g>
      {nodes.map((node, index) => (
        <circle
          key={index}
          cx={node[0]}
          cy={node[1] + Math.sin(frame / 30 + node[2]) * 10}
          r={index === 2 ? 12 : 7}
          fill={index === 2 ? accent : COLORS.text}
          opacity={0.85}
        />
      ))}
    </svg>
  );
};

const VerifyField = () => {
  const frame = useCurrentFrame();
  const scan = ((frame / 90) % 1) * 100;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 0.28}}>
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: `${scan}%`,
          height: 2,
          background: COLORS.gold,
          boxShadow: `0 0 30px ${COLORS.gold}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 130,
          top: 370,
          width: 180,
          height: 180,
          border: `1px solid ${COLORS.gold}`,
          transform: `rotate(${frame * 0.3}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 110,
          bottom: 420,
          width: 260,
          height: 1,
          background: `${COLORS.text}44`,
        }}
      />
    </div>
  );
};

const VideoField = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 0.3}}>
      {[0, 1, 2, 3].map((rank) => (
        <div
          key={rank}
          style={{
            position: 'absolute',
            left: 90 + rank * 230,
            top: 330 + (rank % 2) * 26,
            width: 190,
            height: 2,
            background: rank === 2 ? COLORS.blue : `${COLORS.text}44`,
            transform: `scaleX(${0.2 + (Math.sin(frame / 50 + rank) + 1) * 0.35})`,
            transformOrigin: 'left',
          }}
        />
      ))}
    </div>
  );
};

const TopBar = ({index, accent}: {index: string; accent: string}) => (
  <div
    style={{
      position: 'absolute',
      top: 148,
      left: 72,
      right: 72,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: FONT_FAMILY,
      fontSize: 20,
      letterSpacing: 4,
      fontWeight: 700,
      zIndex: 5,
    }}
  >
    <span style={{color: COLORS.text}}>
      SAT SET <span style={{color: accent}}>INFO</span>
    </span>
    <span style={{color: COLORS.muted, fontFamily: 'ui-monospace, SFMono-Regular, monospace'}}>AI / {index}</span>
  </div>
);

const SceneVisual = ({theme, step}: {theme: DailyAIReelsProps['theme']; step: number}) => {
  const accent = accentFor(theme);
  if (step === 4) return null;
  if (theme === 'agent') {
    return (
      <div
        style={{
          position: 'absolute',
          left: 72,
          bottom: 278,
          width: 650,
          maxWidth: '78%',
          padding: '20px 24px',
          border: `1px solid ${accent}55`,
          borderRadius: 16,
          background: '#08131b',
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 20,
          lineHeight: 1.55,
        }}
      >
        <div style={{color: COLORS.muted, marginBottom: 9}}>workflow.run()</div>
        <div style={{color: COLORS.text}}>read_file</div>
        <div style={{color: accent}}>plan_next_step</div>
        <div style={{color: COLORS.text}}>open_tool</div>
        <div style={{color: COLORS.muted}}>ask_for_permission</div>
      </div>
    );
  }
  if (theme === 'verify') {
    return (
      <div
        style={{
          position: 'absolute',
          left: 72,
          bottom: 278,
          display: 'flex',
          gap: 14,
          width: '72%',
        }}
      >
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              padding: '16px 14px',
              border: `1px solid ${n === step ? accent : `${COLORS.text}28`}`,
              borderRadius: 12,
              background: n === step ? `${accent}14` : '#08131b',
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 16,
              color: n === step ? accent : COLORS.muted,
            }}
          >
            0{n}
            <br />
            CHECK
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        bottom: 278,
        width: '72%',
        padding: '16px 20px',
        border: `1px solid ${accent}55`,
        borderRadius: 14,
        background: '#08131b',
      }}
    >
      <div style={{display: 'flex', gap: 7, marginBottom: 12}}>
        {[0, 1, 2, 3, 4].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 5,
              background: n <= step ? `${accent}bb` : `${COLORS.text}22`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: `${((step + 1) / 4) * 100}%`,
          height: 3,
          borderRadius: 99,
          background: accent,
        }}
      />
    </div>
  );
};

const Scene = ({
  scene,
  step,
  theme,
  index,
}: {
  scene: SceneData;
  step: number;
  theme: DailyAIReelsProps['theme'];
  index: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const accent = accentFor(theme);
  const isHook = step === 0;

  return (
    <AbsoluteFill style={{padding: '210px 72px 260px', fontFamily: FONT_FAMILY}}>
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 790,
          opacity: isHook ? 1 : 0.55 + enter * 0.45,
          transform: `translateY(${isHook ? 0 : (1 - enter) * 34}px)`,
        }}
      >
        <div
          style={{
            color: accent,
            fontSize: 23,
            letterSpacing: 6,
            fontWeight: 800,
            marginBottom: 22,
          }}
        >
          {scene.kicker}
        </div>
        <div
          style={{
            color: COLORS.text,
            fontSize: isHook ? 92 : 80,
            lineHeight: 0.96,
            letterSpacing: -4,
            fontWeight: 900,
            maxWidth: 790,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            color: COLORS.muted,
            fontSize: 35,
            lineHeight: 1.3,
            marginTop: 28,
            maxWidth: 720,
          }}
        >
          {scene.body}
        </div>
      </div>
      <SceneVisual theme={theme} step={step} />
      {step === 0 || step === 4 ? (
        <Mascot2D right={20} bottom={260} scale={step === 4 ? 0.72 : 0.58} />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 72,
          bottom: 190,
          right: 72,
          height: 4,
          borderRadius: 99,
          background: `${COLORS.text}1c`,
          zIndex: 4,
        }}
      >
        <div
          style={{
            width: `${((index + (frame + 1) / SCENE_FRAMES) / 5) * 100}%`,
            height: '100%',
            borderRadius: 99,
            background: accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const DailyAIReels = ({theme, index, scenes}: DailyAIReelsProps) => {
  const accent = accentFor(theme);
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background}}>
      <Background theme={theme} />
      <TopBar index={index} accent={accent} />
      {scenes.map((scene, sceneIndex) => (
        <Sequence key={scene.audio} from={sceneIndex * SCENE_FRAMES} durationInFrames={SCENE_FRAMES}>
          <Audio src={staticFile(scene.audio)} volume={0.95} />
          <Scene scene={scene} step={sceneIndex} theme={theme} index={sceneIndex} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
