# Remotion + GitHub Actions Shorts Starter

Starter video 1080x1920, 30 fps, 30 detik. Rendering dilakukan di GitHub
Actions; VPS hanya menerima MP4 dan menjalankan FFmpeg untuk finishing/upload.

## Apa yang dibutuhkan

- Akun GitHub dan repository (public atau private).
- Project ini di-push ke repository.
- GitHub Actions aktif.
- Untuk repo private: kuota menit GitHub Actions. Repo public biasanya gratis
  untuk runner standar.
- Node.js 22 atau lebih baru (hanya untuk development lokal).
- FFmpeg di VPS untuk finishing.
- YouTube Data API/OAuth jika ingin upload otomatis (terpisah dari workflow ini).

Tidak dibutuhkan di VPS:
- Chromium
- Playwright
- Docker
- GPU

## Struktur

```text
.github/workflows/render.yml   # workflow GitHub Actions
src/index.ts                   # entry point Remotion
src/Root.tsx                   # registrasi komposisi "Shorts"
src/Shorts.tsx                 # komposisi video
props.example.json             # contoh props untuk render lokal
```

## 1. Push ke GitHub

```bash
git init
git add .
git commit -m "feat: remotion shorts starter"
git branch -M main
git remote add origin git@github.com:USER/REPO.git
git push -u origin main
```

Jangan commit `node_modules/`, `out/`, atau `props.json`. Semua sudah ada di
`.gitignore`.

## 2. Jalankan render di GitHub Actions

1. Buka repository di GitHub.
2. Masuk tab **Actions**.
3. Pilih **Render Shorts**.
4. Klik **Run workflow**.
5. Isi `title`, `subtitle`, dan `accent`.
6. Klik **Run workflow** lagi.

Workflow akan:
- checkout repo,
- setup Node 22,
- `npm ci`,
- mengunduh Chrome headless Remotion,
- membuat `props.json` dari input,
- render `out/shorts.mp4`,
- render `out/thumbnail.png`,
- upload keduanya sebagai artifact `shorts-render`.

## 3. Download hasil

Lewat UI:
- buka run yang selesai,
- scroll ke **Artifacts**,
- download `shorts-render`.

Lewat GitHub CLI:

```bash
gh run download --name shorts-render --dir out
```

Artifact disimpan 7 hari. Download sebelum kedaluwarsa.

## 4. Kirim ke VPS

```bash
scp out/shorts.mp4 vps43:/srv/hermes/work/media/shorts.mp4
scp out/thumbnail.png vps43:/srv/hermes/work/media/thumbnail.png
```

## 5. Finishing dengan FFmpeg di VPS

Contoh tanpa subtitle:

```bash
ffmpeg -i shorts.mp4 \
  -c:v libx264 -preset veryfast -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart \
  final-shorts.mp4
```

Contoh dengan subtitle `.ass`:

```bash
ffmpeg -i shorts.mp4 \
  -vf "subtitles=captions.ass" \
  -c:v libx264 -preset veryfast -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart \
  final-shorts.mp4
```

Contoh dengan logo dan musik:

```bash
ffmpeg -i shorts.mp4 -i logo.png -i music.mp3 \
  -filter_complex "[0:v][1:v]overlay=W-w-40:40,subtitles=captions.ass[v];[0:a][2:a]amix=inputs=2:duration=first[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset veryfast -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart \
  final-shorts.mp4
```

## Render lokal (opsional)

```bash
npm ci
npx remotion browser ensure
npm run dev
```

Render dengan props:

```bash
npx remotion render Shorts out/shorts.mp4 --props=props.example.json
npx remotion still Shorts out/thumbnail.png --frame=30 --props=props.example.json
```

## Kustomisasi

- `src/Root.tsx`: ubah `defaultProps`, durasi, fps, atau ukuran.
- `src/Shorts.tsx`: ubah teks scene, warna, animasi, dan layout.
- Untuk gambar/audio, taruh di `public/` lalu gunakan `staticFile()`.
- Untuk audio, instal `@remotion/media`:

```bash
npx remotion add @remotion/media
```

## Catatan

- Workflow ini hanya `workflow_dispatch`; tidak render setiap push, agar kuota
  tidak terpakai tanpa sengaja.
- `--concurrency=2` membatasi penggunaan CPU/RAM runner.
- Jangan taruh token YouTube, OAuth secret, atau SSH key di repository.
- Artifact GitHub bukan storage permanen. Simpan master di VPS atau storage lain.
- Remotion gratis untuk individu dan perusahaan sampai 3 orang. Perusahaan lebih
  besar memerlukan lisensi Remotion.
- GitHub Actions runner standar tidak punya GPU. Untuk 3D/Blender berat, gunakan
  mesin lain.
