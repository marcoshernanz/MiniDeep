import { Audio } from "expo-av";

export default async function stopSound(
  sound: Audio.Sound | null,
): Promise<void> {
  if (sound) {
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch (error) {
      console.error("Error stopping sound:", error);
    }
  }
}
