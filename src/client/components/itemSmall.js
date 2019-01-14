Vue.component("item-small", {
	template: `
		<div @contextmenu="right" :class="{'item-small card hover': true, 'item-song song': data.type == 'song', 'item-playlist playlist': data.type == 'playlist', 'playing': playing, 'selected': selected}">
			<img src="src/client/graphics/note.png"/>
			<div>
				<h5 @click="player.select(data)" class="item-title">{{data.name}}</h5>
				<label class="item-author">{{data.author}}</label>
				<label class="item-date">{{data.date}}</label>
				<a :style="'pointer-events: none; width: 200px; left: ' + mX + 'px; top: ' + mY + 'px; position: absolute; transition: opacity .3s; opacity: 0;'" class="btn-floating btn-flat waves-effect dropdown-trigger" ref="drop" :data-target="uid"></a>
				<ul :id="uid"  class='dropdown-content'>
					<li><a class="grey-text" style="cursor: default;"><i class="material-icons">playlist_add</i> Add to playlist</a></li>
					<li class="divider" tabindex="-1"></li>

					<li v-for="v in player.profile.data.playlists">
						<a @click="toggle(v)" href="#!">
							<transition name="slide-in" mode="out-in">
								<i key="add" v-if="!v.contains(data.id)" class="material-icons">list</i>
								<i key="remove" v-else class="material-icons">close</i>
							</transition>

							{{v.name}}
						</a>
					</li>

					<li class="divider" tabindex="-1"></li>
					<li><a @click="player.profile.deleteItem(data)" class="red-text"><i class="material-icons">delete</i> Delete</a></li>
				</ul>
				<button @click="play" ref="ply" class="primary-button btn-floating waves-effect waves-light" style="float: right; position: relative; right: -20px; top: -14px;"><i class="material-icons">play_arrow</i></button>
			</div>	
		</div>
	`,
	props: ["player", "list", "data"],
	data: function () {
		return {dropdown: null, uid: this.uniqueId(), mX: 0, mY: 0, show: false};
	},
	computed: {
		playing: function () {
			this.player.playing;
			return this.player.isPlaying(this.data);
		},
		selected: function () {
			this.player.selected;
			return this.player.isSelected(this.data);
		}
	},
	methods: {
		toggle: function (list) {
			if (list.contains(this.data.id)) {
				list.content.splice(list.content.indexOf(this.data.id), 1);
			}else{
				list.content.push(this.data.id);
			}

			this.player.profile.refresh();
		},
		uniqueId: function () {
			let id = Math.floor(Math.random() * 10000);
			
			if ($("#" + id).length > 0)
				return this.uniqueId;
			
			return id;
		},
		play: function () {
			this.player.playFromList(this.list, this.data);
			this.player.playing = this.data;
			let ply = $(this.$refs.ply);

			MaterialPlayer.Animation.playBar(ply);
		},
		right: function (e) {
			e.preventDefault();
			let off = $(this.$el).offset();

			this.mX = e.clientX - off.left;
			this.mY = e.clientY - off.top;
			this.show = true;
			setTimeout(() => {
				this.dropdown.open();
			}, 200);
		}
	},
	mounted: function () {
		let drop = M.Dropdown.init(this.$refs.drop, {closeOnClick: false});
		this.dropdown = drop;
	}
});