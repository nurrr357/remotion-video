import {Composition} from 'remotion';
import {CodeReels} from './CodeReels';
import {Shorts} from './Shorts';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="CodeReels"
        component={CodeReels}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Shorts"
        component={Shorts}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'Mulai dari satu ide',
          subtitle: 'Tiga detik pertama menentukan apakah orang berhenti scroll.',
          accent: '#FFD166',
        }}
      />
    </>
  );
};
