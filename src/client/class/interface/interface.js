MaterialPlayer.Interface = class MaterialPlayerInterface {
	constructor() {
		this.info = {
			duration: 0,
			currentTime: 0,
			playing: false
		};
	}

	initialize(player) {
		this.player = player;
	}

	play(track) {

	}

	unpause() {
		this.setState(true);
	}

	pause() {
		this.setState(false);
	}

	setState(playing) {

	}

	seek(time) {

	}

	duration() {
		return this.info.duration;
	}

	currentTime() {
		return this.info.currentTime;
	}

	playing() {
		return this.info.playing;
	}

	next() {

	}

	previous() {

	}
}