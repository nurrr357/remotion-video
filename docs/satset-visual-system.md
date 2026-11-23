# SatSetInfo Visual System

Aturan ini berlaku untuk semua video SatSetInfo di repo ini.

## Yang tetap

- **Karakter:** hanya `src/brand/Mascot2D.tsx`. Jangan menggambar ulang, mengganti warna, mengganti beanie, mengganti proporsi, atau memakai karakter hasil AI.
- **Tipografi:** Inter/Arial, weight 800–900 untuk headline, 700–800 untuk kicker.
- **Warna inti:** background `#05080D`, text `#F6FAFF`, muted `#A9B7C9`.
- **Aksen:** pilih satu aksen utama per video: mint `#5EE6A8`, blue `#66B7FF`, atau gold `#FFD166`.
- **Safe area:** atas 160 px, bawah 220 px, kiri 72 px, kanan 140 px.
- **Logo:** “SAT SET INFO” di kiri atas; nomor seri di kanan atas.
- **Gerak:** spring `damping 18, stiffness 90`; karakter `damping 16, stiffness 85`.

## Yang boleh berinovasi

- **Background:** particle field, wireframe orbit, grid, halftone, paper, noise, gradient, 3D explainer.
- **Material:** glass card, neon line, paper cut, metal, voxel, flat vector, translucent panel.
- **Kamera:** orbit, dolly, parallax, slow push-in.
- **Komposisi:** teks kiri, kanan, center, split-screen, full-bleed.
- **Transisi:** cut, wipe, zoom, match cut.
- **Aksen warna:** pilih satu dari palette; jangan campur tiga aksen sekaligus.
- **Scene ordering:** boleh berubah sesuai cerita.

## Batas

- Maksimal **dua teknik background** per video.
- Jangan memakai foto/logo pihak ketiga tanpa review editorial.
- Jangan memakai karakter 3D atau karakter baru sebagai pengganti maskot.
- Jangan mengubah wajah, rambut, beanie, atau kaos maskot.
- Jangan memakai `unsafe-inline` di deployment; semua CSS/JS harus external.

## Checklist sebelum render

- [ ] Karakter memakai `Mascot2D` dari `src/brand`.
- [ ] Hanya satu aksen utama.
- [ ] Teks utama berada di safe area.
- [ ] Background tidak menutupi teks.
- [ ] Hook terlihat di frame 0.
- [ ] Audio voice-over dan musik tidak clipping.
- [ ] Tidak ada karakter/logo pihak ketiga yang tidak disetujui.
