import { Audio } from "expo-av";

type SoundOptions = {
  loop?: boolean;
  volume?: number;
};

export default async function playSound(
  soundFile: any,
  options: SoundOptions = {},
): Promise<Audio.Sound | null> {
  try {
    const { sound } = await Audio.Sound.createAsync(soundFile, {
      shouldPlay: true,
      isLooping: options.loop ?? false,
      volume: options.volume ?? 1.0,
    });
    return sound;
  } catch (error) {
    console.error("Error playing sound:", error);
    return null;
  }
}

export async function stopSound(sound: Audio.Sound | null): Promise<void> {
  if (sound) {
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch (error) {
      console.error("Error stopping sound:", error);
    }
  }
}
