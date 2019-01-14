Vue.component("item", {
	template: `
		<div style="position: relative;" :class="{'item card z-depth-3': true, 'item-song song': data.type == 'song', 'item-playlist playlist': data.type == 'playlist', 'playing': playing, 'selected': selected}">
			<h1 class="item-title"><input type="text" class="browser-default inline-input" v-model="data.name"/></h1>
			<label class="item-author">{{data.author}}</label>
			<label class="item-date">{{data.date}}</label>
			
			<transition name="scale">
				<button v-if="!playing" @click="play" ref="ply" class="primary-button btn-floating btn-large waves-effect waves-light" style="float: right; position: relative; right: -40px; top: -60px;"><i class="material-icons">play_arrow</i></button>
				<h5 v-else class="active-text" style="position: absolute; right: 0; top: 0; margin: .5em;">Playing</h5>
			</transition>
		</div>
	`,
	props: ["player", "data"],
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
		play: function () {
			if (this.data.type == "playlist") {
				if (this.data.content.length > 0) {
					this.player.playFromList(this.data, this.data.content[0]);
					this.player.playing = this.data.content[0];
				}
			}else{
				this.player.profile.play(this.data);
			}

			let ply = $(this.$refs.ply);
			
			MaterialPlayer.Animation.playBar(ply);
		}
	}
});