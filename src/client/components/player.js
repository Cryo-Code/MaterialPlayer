Vue.component("player", {
	template: `
	<div @select="select" :class="theme">
		<div class="nav-container">
			<nav>
				<a class="brand-logo"><img src="src/client/graphics/logo.png" style="max-width: 64px;" /></a>
			</nav>
		</div>
		<div ref="fab" id="menu" class="fixed-action-btn" :style="'transition: .3s;' + ((player.playing !== null) ? 'bottom: 140px;' : '')">
			<a class="btn-floating btn-large primary-button">
				<i class="large material-icons">menu</i>
			</a>
			<ul>
				<li><a class="btn-floating blue tooltipped" data-position="left" data-tooltip="Open help"><i class="material-icons">help</i></a></li>
				<li><a href="#editSettings" class="btn-floating blue tooltipped modal-trigger" data-position="left" data-tooltip="Open settings"><i class="material-icons">settings</i></a></li>
				<li><a href="#createPlaylist" class="btn-floating green tooltipped modal-trigger" data-position="left" data-tooltip="Create playlist"><i class="material-icons">playlist_add</i></a></li>
				<li><a @click="pickMusic(true)" class="btn-floating green tooltipped" data-position="left" data-tooltip="Add music folder"><i class="material-icons">create_new_folder</i></a></li>
				<li><a @click="pickMusic(false)" class="btn-floating green tooltipped" data-position="left" data-tooltip="Add music"><i class="material-icons">add</i></a></li>
			</ul>
		</div>

		<div ref="createPlaylist" id="createPlaylist" class="modal" style="max-width: 300px">
			<div class="modal-content center">
				<h4>New Playlist</h4>
				<div class="input-field col s6">
					<input id="playlist-name" type="text" class="validate" v-model="cPlaylistName">
					<label for="playlist-name">Playlist name</label>
				</div>
			</div>
			<div class="modal-footer">
				<a @click="createPlaylist" class="modal-close waves-effect waves-green btn-flat right">Create</a>
				<a @click="clearInput" class="modal-close waves-effect waves-red btn-flat left">Cancel</a>
			</div>
		</div>

		<div ref="editSettings" id="editSettings" class="modal" style="max-width: 600px; min-height: 882px;">
			<div class="modal-content center">
				<h4><i class="material-icons">settings</i> Settings</h4>
				<div class="input-field col s12">
					<select v-model="color">
						<option value="#ee6e73">Default Orange</option>
						<option value="#8e24aa">Purple</option>
						<option value="#d81b60">Pink</option>
						<option value="#e53935">Red</option>
						<option value="#5e35b1">Deep Purple</option>
						<option value="#3949ab">Indigo</option>
						<option value="#1e88e5">Blue</option>
						<option value="#039be5">Light Blue</option>
						<option value="#00acc1">Cyan</option>
						<option value="#00897b">Teal</option>
						<option value="#43a047">Green</option>
						<option value="#7cb342">Light Green</option>
						<option value="#ffa000">Amber</option>
						<option value="#ff9100">Orange</option>
						<option value="#f4511e">Deep Orange</option>
						<option value="#757575">Grey</option>
						<option value="#546e7a">Blue Grey</option>
					</select>
					<label>Color</label>
				</div>
				<br><br>
				<div class="input-field col s12">
					<select v-model="player.profile.data.theme">
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
					<label>Theme</label>
				</div>
				<br><br>
				<div class="input-field col s12">
					<select v-model="player.profile.data.skin">
						<option value="deep">Deep</option>
						<option value="flat">Flat</option>
					</select>
					<label>Skin</label>
				</div>
			</div>
			<div class="modal-footer">
				<a @click="clearInput" class="modal-close waves-effect waves-red btn-flat right">Close</a>
			</div>
		</div>

		<div class="main-container">
			<div class="side-nav">
				<side-nav :player="player"/>
			</div>
			<div class="main-area">
				<div class="main" style="overflow-y: auto; overflow-x: hidden;">
					<div class="container" style="position: relative; height: 100%;">
						<transition name="slide-in">
							<div style="position: absolute; width: 100%;" :key="player.selected" v-if="player.selected !== null">
								<item :player="player" :data="selected" />
								<div class="list-container" v-if="selected.type == 'playlist'">
									<transition-group name="item-list" tag="div">
										<item-small v-for="v in selected.content" :player="player" :list="selected" :data="v" :key="v.id" />
									</transition-group>
									<transition name="fade">
										<div v-if="playIndex != -1" :style="'top: ' + (playIndex * 81.5) + 'px'" class="play-marker">
											<div :style="'height: ' + playTime + '%'" class="time"></div>
										</div>
									</transition>
								</div>
							</div>
							<div v-else style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
								<img src="src/client/graphics/headphones.png" style="filter: brightness(50%); opacity: .1;">
								<h4 style="opacity: .2;">Material Player</h4>
							</div>
						</transition>
					</div>
				</div>
				<div id="bar" :class="{'bar': true}">
					<div class="bar-sub">
						<div class="bar-left">
							<item-inline v-if="player.playing !== null" style="margin: 2em; margin-right: 0; width: 100%;" :player="player" :data="player.playing"/>
						</div>
						<div class="bar-mid">
							<button @click="previous()" class="btn-floating bar-button"><span><i class="material-icons">skip_previous</i></span></button>
							<button @click="toggle()" class="btn-floating btn-large bar-button">
								<span>
									<transition name="fade" mode="out-in">
										<i key="play" v-if="!playing" class="material-icons">play_arrow</i>
										<i key="pause" v-else class="material-icons">pause</i>
									</transition>
								</span>
							</button>
							<button @click="next()" class="btn-floating bar-button"><span><i class="material-icons">skip_next</i></span></button>
						</div>
						<div class="bar-right">

						</div>
					</div>
					<div class="bar-track" ref="barTrack" @click="seekTo" @mousemove="seekTo"><div :style="'width: ' + playTime + '%'" class="time-track"></div></div>
				</div>
			</div>
		</div>
		<div ref="tapTarget" class="tap-target" data-target="menu">
			<div class="tap-target-content white-text">
				<h5>Action menu</h5>
				<p>Use this to add music, create playlists, edit settings, and view help.</p>
				<div class="center"><button @click="closeTap()" class="btn-flat waves-effect waves-light white-text">Got it</button></div>
			</div>
		</div>
	</div>
	`,
	props: ["player"],
	data: () => {
		return {
			cPlaylistName: "",
			color: "#ffc400"
		}
	},
	watch: {
		color: function () {
			this.player.profile.data.color = this.color;
			this.updateColor();
		}
	},
	computed: {
		selected: function () {
			this.player.sections;

			if (this.player.selected !== null) {
				return this.player.profile.itemMap[this.player.selected];
			}

			return null;
		},
		playing: function () {
			return this.player.interface.info.playing;
		},
		playTime: function () {
			return (this.player.interface.info.currentTime / this.player.interface.info.duration) * 100;
		},
		playIndex: function () {
			this.player.playing;

			if (this.player.selected != null && this.selected.type == "playlist" && this.player.playing) {
				for (let [i, v] of this.selected.content.entries())
					if (v.id == this.player.playing.id)
						return i;
			}
			
			return -1;
		},
		theme: function () {
			return this.player.profile.data.theme + " " + this.player.profile.data.skin;
		}
	},
	methods: {
		lighten: function (color, percent) {
			var num = parseInt(color.substr(1), 16),
			amt = Math.round(2.55 * percent),
			R = (num >> 16) + amt,
			B = (num >> 8 & 0x00FF) + amt,
			G = (num & 0x0000FF) + amt;

			return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
		},
		seekTo: function (e) {
			if (e.type != "mousemove" || e.buttons == 1) {
				let track = $(this.$refs.barTrack);
				track.children().css("transition", "0s");
				let xPos = e.clientX - track.offset().left;
				this.player.interface.seek((xPos / track.width()) * this.player.interface.info.duration);
				track.children().css("transition", "");
			}
		},
		next: function () {
			this.player.profile.next();
		},
		previous: function () {
			this.player.profile.previous();
		},
		toggle: function () {
			this.player.interface.setState(!this.player.interface.info.playing);
		},
		select: function () {
			console.log(arguments);
		},
		closeTap: function () {
			this.tapTarget.close();
			this.tapTarget.destroy();
		},
		clearInput: function () {
			this.cPlaylistName = "";
		},
		createPlaylist: function () {
			this.player.profile.createPlaylist(this.cPlaylistName);

			this.clearInput();
		},
		pickMusic: function (folder) {
			this.player.pickMusic(folder);
		},
		updateColor: function () {
			document.documentElement.style.setProperty("--primary-color", this.player.profile.data.color);
			document.documentElement.style.setProperty("--primary-hover", this.lighten(this.player.profile.data.color, -20));
			document.documentElement.style.setProperty("--primary-track", this.lighten(this.player.profile.data.color, 20));
			return this.player.profile.data.color;
		}
	},
	mounted: function () {
		M.FloatingActionButton.init(this.$refs.fab);

		if (!this.player.profile.data.tutorial) {
			this.tapTarget = M.TapTarget.init(this.$refs.tapTarget);
			this.tapTarget.open();

			this.player.profile.data.tutorial = true;
		}

		$('.tooltipped').tooltip();
		$('.modal').modal();
		$('select').formSelect();

		this.updateColor();

		this.color = this.player.profile.data.color;
	}
});