import {Composition} from 'remotion';
import {CodeReels} from './CodeReels';
import {DailyAIReels, type DailyAIReelsProps} from './DailyAIReels';
import {MuskReels} from './MuskReels';
import {Shorts} from './Shorts';
import {ThreeReels} from './ThreeReels';
import {ThreeTest} from './ThreeTest';

const agentScenes: DailyAIReelsProps['scenes'] = [
  {
    kicker: '01 / BUKAN CHATBOT',
    title: 'Chatbot jawab. Agent kerja.',
    body: 'Bukan cuma balas chat.',
    audio: 'agent-01.mp3',
  },
  {
    kicker: '02 / BEDANYA',
    title: 'Chatbot kasih jawaban. Agent bikin rencana.',
    body: 'Langkah demi langkah.',
    audio: 'agent-02.mp3',
  },
  {
    kicker: '03 / PAKAI TOOL',
    title: 'Agent bisa pakai aplikasi.',
    body: 'Baca file. Buka app. Jalankan tugas.',
    audio: 'agent-03.mp3',
  },
  {
    kicker: '04 / KONTROL',
    title: 'Tetap butuh izin dan batas.',
    body: 'Izin. Batas. Review manusia.',
    audio: 'agent-04.mp3',
  },
  {
    kicker: '05 / CTA',
    title: 'Mau contoh workflow?',
    body: 'Komentar AGENT.',
    audio: 'agent-05.mp3',
  },
];

const verifyScenes: DailyAIReelsProps['scenes'] = [
  {
    kicker: '01 / AI CHECK',
    title: '3 detik. Asli atau AI?',
    body: 'Cek sebelum percaya.',
    audio: 'verify-01.mp3',
  },
  {
    kicker: '02 / TEKS & TANGAN',
    title: 'Huruf aneh. Jari tidak konsisten.',
    body: 'Mulai dari detail kecil.',
    audio: 'verify-02.mp3',
  },
  {
    kicker: '03 / WAJAH & GERAKAN',
    title: 'Mata dan gerak bisa janggal.',
    body: 'Lihat wajah, kulit, dan transisi.',
    audio: 'verify-03.mp3',
  },
  {
    kicker: '04 / AUDIO & BAYANGAN',
    title: 'Suara dan cahaya tidak cocok.',
    body: 'Cocokkan dengan konteks.',
    audio: 'verify-04.mp3',
  },
  {
    kicker: '05 / SIMPAN',
    title: 'Simpan buat cek berikutnya.',
    body: 'Tidak ada tes yang sempurna.',
    audio: 'verify-05.mp3',
  },
];

const videoAgentScenes: DailyAIReelsProps['scenes'] = [
  {
    kicker: '01 / BUKAN KLIP',
    title: 'Bukan bikin klip. Bikin video.',
    body: 'Dari satu brief.',
    audio: 'videoagent-01.mp3',
  },
  {
    kicker: '02 / GENERATOR KLIP',
    title: 'Satu potongan. Masih perlu disusun.',
    body: 'Clip generator berhenti di scene.',
    audio: 'videoagent-02.mp3',
  },
  {
    kicker: '03 / VIDEO AGENT',
    title: 'Satu alur dari script sampai edit.',
    body: 'Script. Scene. Voice. Edit.',
    audio: 'videoagent-03.mp3',
  },
  {
    kicker: '04 / MANUSIA',
    title: 'Kualitas tetap dicek manusia.',
    body: 'Cek fakta. Cek rasa. Cek kualitas.',
    audio: 'videoagent-04.mp3',
  },
  {
    kicker: '05 / PART 2',
    title: 'Follow buat part 2.',
    body: 'AI video agent, dijelaskan.',
    audio: 'videoagent-05.mp3',
  },
];

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="AgentReels"
        component={DailyAIReels}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          theme: 'agent',
          index: '001',
          title: 'Chatbot vs AI Agent',
          scenes: agentScenes,
        }}
      />
      <Composition
        id="VerifyReels"
        component={DailyAIReels}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          theme: 'verify',
          index: '002',
          title: '3 Tanda Video AI',
          scenes: verifyScenes,
        }}
      />
      <Composition
        id="VideoAgentReels"
        component={DailyAIReels}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          theme: 'videoagent',
          index: '003',
          title: 'AI Video Agent',
          scenes: videoAgentScenes,
        }}
      />
      <Composition
        id="MuskReels"
        component={MuskReels}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
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
