MaterialPlayer.LocalProfile = class MaterialPlayerLocalProfile extends MaterialPlayer.Profile {
	constructor() {
		super();
	}

	refresh() {
		this.sections.splice(0, this.sections.length);

		let myMusic = {id: 0, display: "My Music", content: [
			{id: 3, type: "playlist", name: "All Songs", content: []}
		]};
		let playlists = {id: 1, display: "Playlists", content: []};
		let recent = {id: 2, display: "Recently Played", content: []};

		let songMap = {};

		this.itemMap[3] = myMusic.content[0];

		for (let song of this.data.songs) {
			songMap[song.id] = song;
			this.itemMap[song.id] = song;
			
			myMusic.content[0].content.push(song);

			if (this.player.selected && this.player.selected.id == song.id)
				this.player.selected = song;
		}

		for (let list of this.data.playlists) {
			list.contains = (id) => {
				return list.content.includes(id);
			};

			let plist = {id: list.id, type: "playlist", name: list.name, content: []};
			
			for (let id of list.content) {
				plist.content.push(songMap[id]);
			}

			this.itemMap[plist.id] = plist;

			playlists.content.push(plist);

			if (this.player.selected && this.player.selected.id == plist.id)
				this.player.selected = plist;
		}

		this.sections.push(myMusic);
		this.sections.push(playlists);
		this.sections.push(recent);
	}

	next() {
		if (this.data.queue.length > this.data.currentIndex + 1) {
			this.player.interface.play(this.data.queue[++this.data.currentIndex].location);
			this.player.setPlaying(this.data.queue[this.data.currentIndex]);
		}
	}

	previous() {
		if (this.data.currentIndex - 1 >= 0) {
			this.player.interface.play(this.data.queue[--this.data.currentIndex].location);
			this.player.setPlaying(this.data.queue[this.data.currentIndex]);
		}
	}

	loadList(list) {
		this.player.setCurrentList(list);

		this.data.queue.splice(0, this.data.queue.length);

		for (let item of list.content) {
			this.data.queue.push(item);
		}

		this.data.currentIndex = 0;
	}

	playFromQueue(item) {
		for (let [i, check] of this.data.queue.entries()) {
			if (check.id == item.id) {
				this.data.currentIndex = i;
				this.player.setPlaying(check);
				this.player.interface.play(check.location);

				return;
			}
		}
	}

	play(item) {
		this.data.queue.splice(0, this.data.queue.length);
		this.data.currentIndex = 0;
		this.player.setPlaying(item);
		this.player.setCurrentList(null);
		this.player.interface.play(item.location);
	}
	
	formatDate(date) {
		date = date || new Date();
		return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
	}

	deleteItem(item) {
		if (item.type == "playlist") {
			for (let [i, list] of this.data.playlists.entries())
				if (list.id = item.id)
					this.data.playlists.splice(i, 1);
			
			delete this.itemMap[item.id];
		}else{
			for (let [i, list] of this.data.songs.entries())
				if (list.id == item.id)
				this.data.songs.splice(i, 1);
			
			for (let [i, list] of this.data.playlists.entries())
				if (list.content.includes(item.id))
					list.content.splice(list.content.indexOf(item.id), 1);
			
			delete this.itemMap[item.id];
		}

		this.refresh();
	}

	addFile(file) {
		let song = {id: ++this.data.lastId, type: "song", location: file.location, name: file.name, extension: file.extension};
		
		if (file.tags) {
			if (file.tags.common) {
				let meta = file.tags.common;
				song.year = meta.year || "Unknown";
				song.name = meta.title || file.name;
				song.album = meta.album || "Unknown";
				song.author = meta.artist || "Unknown";
				song.date = meta.date ? this.formatDate(new Date(meta.date)) : this.formatDate();
				song.duration = meta.duration || "Unknown";
			}
		}

		this.data.songs.push(song);
	}
}