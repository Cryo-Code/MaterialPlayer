Vue.component("item-inline", {
	template: `
		<div :class="{'item-inline card hoverable': true, 'item-song song': data.type == 'song', 'item-playlist playlist': data.type == 'playlist', 'playing': playing, 'selected': selected}">
			<img src="src/client/graphics/note.png"/>
			<div>
				<h5 @click="player.select(data)" class="item-title truncate">{{data.name}}</h5>
				<label class="item-author">{{data.author}}</label>
				<label class="item-date">{{data.date}}</label>
			</div>	
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
			this.player.playing = this.data;
			let ply = $(this.$refs.ply);

			MaterialPlayer.Animation.playBar(ply);
		}
	}
});