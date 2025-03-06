import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";

type SoundOptions = {
  loop?: boolean;
  volume?: number;
  asAlarm?: boolean;
};

export default async function playSound(
  soundFile: any,
  options: SoundOptions = { loop: false, volume: 1.0, asAlarm: false },
): Promise<Audio.Sound | null> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    });

    const { sound } = await Audio.Sound.createAsync(soundFile, {
      shouldPlay: true,
      isLooping: options.loop,
      volume: options.volume,
    });

    return sound;
  } catch (error) {
    console.error("Error playing sound:", error);
    return null;
  }
}
