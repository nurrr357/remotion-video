"""Generate a simple, royalty-free ambient bed for the demo.

This is intentionally minimal: four soft chords, slow tremolo, fade in/out.
Replace public/music.mp3 with a licensed track for a real production.
"""
from __future__ import annotations

import math
import struct
import wave
from pathlib import Path

SAMPLE_RATE = 44_100
DURATION = 30.0
CHORD_SECONDS = 7.5
CHORDS = [
    (220.00, 261.63, 329.63),  # Am
    (174.61, 220.00, 261.63),  # F
    (261.63, 329.63, 392.00),  # C
    (196.00, 246.94, 293.66),  # G
]
MASTER = 0.24
FADE = 2.0


def envelope(t: float) -> float:
    if t < FADE:
        return t / FADE
    if t > DURATION - FADE:
        return max(0.0, (DURATION - t) / FADE)
    return 1.0


def chord_at(t: float) -> tuple[float, float, float]:
    index = min(int(t // CHORD_SECONDS), len(CHORDS) - 1)
    current = CHORDS[index]
    nxt = CHORDS[min(index + 1, len(CHORDS) - 1)]
    local = t - index * CHORD_SECONDS
    # 0.8 s crossfade at the end of each chord.
    if local > CHORD_SECONDS - 0.8:
        mix = (local - (CHORD_SECONDS - 0.8)) / 0.8
        return tuple(a * (1 - mix) + b * mix for a, b in zip(current, nxt))
    return current


def main() -> None:
    output = Path(__file__).resolve().parent.parent / "public" / "music.wav"
    output.parent.mkdir(parents=True, exist_ok=True)
    frames = int(SAMPLE_RATE * DURATION)
    with wave.open(str(output), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        for i in range(frames):
            t = i / SAMPLE_RATE
            chord = chord_at(t)
            tremolo = 0.78 + 0.22 * math.sin(2 * math.pi * 0.12 * t)
            sample = 0.0
            for freq in chord:
                sample += math.sin(2 * math.pi * freq * t)
                sample += 0.35 * math.sin(2 * math.pi * freq * 2 * t)
            sample = (sample / 6.0) * MASTER * tremolo * envelope(t)
            wav.writeframes(struct.pack("<h", int(max(-1.0, min(1.0, sample)) * 32767)))
    print(output)


if __name__ == "__main__":
    main()
