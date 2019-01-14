Vue.component("nav-item", {
	template: `
	<div @click="player.select(data)" :class="{'nav-item nav-song song': data.type == 'song', 'nav-item nav-playlist playlist': data.type == 'playlist', 'playing': playing, 'selected': selected}">
		<template v-if="data.type == 'song'">
			<span>{{data.name}}</span>
		</template>
		<template v-else-if="data.type == 'playlist'">
			<span>{{data.name}}</span>
		</template>
		<div class="play-pill"></div>
	</div>
	`,
	props: ["player", "data"],
	computed: {
		playing: function () {
			this.player.playing;
			return this.player.isPlaying(this.data);
		},
		selected: function () {
			console.log(this.player.selected);
			return this.player.isSelected(this.data);
		}
	}
});