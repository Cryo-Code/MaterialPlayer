const { ipcRenderer } = require("electron");

MaterialPlayer.FileSystemInterface = class MaterialPlayerFileSystemInterface extends MaterialPlayer.Interface {
	constructor() {
		super();
	}

	initialize(player) {
		super.initialize(player);

		this.audio = document.createElement("audio");
		document.body.appendChild(this.audio);

		this.loaded = (event, data) => {
			this.audio.src = data;
		};

		this.audio.ontimeupdate = () => {
			this.info.currentTime = this.audio.currentTime;
		};

		this.audio.ondurationchange = () => {
			this.info.duration = this.audio.duration;
		};

		this.audio.onpause = () => {
			this.info.playing = false;
		};

		this.audio.onplay = () => {
			this.info.playing = true;
		};

		this.audio.onended = () => {
			this.player.profile.ended();
		};

		// Make sure to cleanup our listener in destroy
		ipcRenderer.on("soundLoaded", this.loaded);
	}

	destroy() {
		ipcRenderer.removeListener("soundLoaded", this.loaded);
	}

	play(location) {
		this.audio.src = location;
		this.audio.play();
	}

	seek(time) {
		this.audio.currentTime = time;
	}

	setState(playing) {
		if (playing) {
			this.audio.play();
		}else{
			this.audio.pause();
		}
	}
}