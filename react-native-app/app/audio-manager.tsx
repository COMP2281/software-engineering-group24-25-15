import { Audio } from 'expo-av';

class AudioManager {
	private static instance: AudioManager;
	private sound: Audio.Sound | null = null;
	private isMuted: boolean = false;

	private constructor() {}

	public static getInstance(): AudioManager {
		if (!AudioManager.instance) {
			AudioManager.instance = new AudioManager();
		}
		return AudioManager.instance;
	}

	public async loadAndPlayAsync(uri: string) {
		if (this.sound) {
			await this.sound.unloadAsync();
		}
		const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true, isLooping: true, volume: this.isMuted ? 0 : 1 });
		this.sound = sound;
	}

	public async toggleMute() {
		this.isMuted = !this.isMuted;
		if (this.sound) {
			await this.sound.setVolumeAsync(this.isMuted ? 0 : 1);
		}
	}

	public getMuted() {
		return this.isMuted;
	}

	public async stop() {
		if (this.sound) {
			await this.sound.stopAsync();
			await this.sound.unloadAsync();
			this.sound = null;
		}
	}
}

export default AudioManager.getInstance();