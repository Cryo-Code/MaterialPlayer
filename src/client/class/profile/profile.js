MaterialPlayer.Profile = class MaterialPlayerProfile {
	constructor() {
		this.sections = [];
		this.itemMap = {};

		this.data = {
			theme: "light",
			skin: "deep",
			color: "#ffc400",
			songs: [],
			playlists: [],
			queue: [],
			currentIndex: 0,
			lastId: 9,
			tutorial: false
		};
	}

	initialize(player) {
		this.player = player;
	}

	/**
	 * Called by player to update the sections property when data.songs/data.playlists update
	 */
	refresh() {

	}

	/**
	 * Called by MaterialPlayer.Interface after a track is complete or the user skips
	 */
	next() {

	}

	/**
	 * Called when a user clicks previous
	 */
	previous() {

	}

	/**
	 * Clear the current queue and fill it with list
	 */
	loadList(list) {

	}

	/**
	 * If this song is in the queue move to it.
	 */
	playFromQueue(item) {

	}

	/**
	 * Plays a single item (and may clear the queue)
	 */
	play(item) {

	}

	/**
	 * Called by MaterialPlayer.Interface the current item has finished playing
	 */
	ended() {
		this.next();
	}

	/**
	 * Makes an empty playlist
	 */
	createPlaylist(name) {
		this.data.playlists.push({id: ++this.data.lastId, type: "playlist", name: name, content: []})
		this.refresh();
	}

	/**
	 * Called by player when new music is added
	 */
	addFile(file) {

	}

	/**
	 * Deletes a playlist or song
	 */
	deleteItem(item) {

	}
}