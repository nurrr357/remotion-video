import {Composition} from 'remotion';
import {CodeReels} from './CodeReels';
import {Shorts} from './Shorts';
import {ThreeReels} from './ThreeReels';
import {ThreeTest} from './ThreeTest';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ThreeReels"
        component={ThreeReels}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThreeTest"
        component={ThreeTest}
        durationInFrames={5 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
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
