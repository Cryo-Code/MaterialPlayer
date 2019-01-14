MaterialPlayer.Player = class MaterialPlayer {
	constructor(el, intf, profile) {
		this.element = el;
		this.interface = intf;
		this.profile = profile;

		this.profiles = {main: profile};

		this.playing = null;
		this.currentList = null;
		this.selected = null;
		this.dataInitialized = false;

		this.vue = null;
	}

	initialize() {
		this.vue = new Vue({
			el: this.element,
			data: {
				player: this
			}
		});

		this.initializeData();

		console.log("Material player initialized");
	}

	setCurrentList(cList) {
		this.currentList = cList;
	}

	setPlaying(item) {
		this.playing = item;
	}

	isPlaying(item) {
		return (this.playing ? this.playing.id == item.id : false)
				|| (this.currentList ? this.currentList.id == item.id : false);
	}

	isSelected(item) {
		return (this.selected ? this.selected.id == item.id : false);
	}

	select(item) {
		if (this.selected && this.selected == item.id) {
			this.selected = null;
			return;
		}
		
		this.selected = item.id;
	}

	playFromList(list, item) {
		if (!(this.currentList && this.currentList.id == list.id)) {
			this.currentList = list;
			this.profile.loadList(list); // Loads the list into our queue
		}

		this.profile.playFromQueue(item); // Moves to this item
	}

	pickMusic(folder) {
		let data = ipcRenderer.sendSync("pickMusic", folder);

		for (let file of data) {
			this.profile.addFile(file);
		}

		this.profile.refresh();
	}

	writeFile(name, data) {
		return ipcRenderer.sendSync("writeFile", name, data);
	}

	readFile(name) {
		return ipcRenderer.sendSync("readFile", name);
	}

	saveProfiles() {
		this.writeFile("profiles.json", JSON.stringify(Object.keys(this.profiles)));

		for (let name in this.profiles) {
			let profile = this.profiles[name];
			
			this.writeFile(name + ".json", JSON.stringify(profile.data, null, "	"));
		}
	}

	initializeData() {
		if (this.dataInitialized)
			return;

		this.profile.initialize(this);
		this.interface.initialize(this);
		this.dataInitialized = true;
	}

	loadProfiles() {
		this.initializeData();

		let profiles = this.readFile("profiles.json");

		if (profiles) {
			profiles = JSON.parse(profiles);

			for (let name of profiles) {
				let profile = this.readFile(name + ".json");

				if (profile) {
					this.profiles[name] = JSON.parse(profile);

					if (name == "main") {
						this.profile.data = this.profiles.main;
						this.profiles.main = this.profile;
						this.profiles.main.refresh();
					}
				}
			}
		}
	}
}