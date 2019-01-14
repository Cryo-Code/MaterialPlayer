Vue.component("side-nav", {
	template: `
	<div>
		<div v-for="(v, i) in player.profile.sections" :key="v.id" class="section">
			<label class="section-display">{{v.display}}</label>
			<div class="section-group">
				<nav-item v-for="c in v.content" :player="player" :data="c" :key="c.id"/>
			</div>
		</div>
	</div>
	`,
	props: ["player"]
});