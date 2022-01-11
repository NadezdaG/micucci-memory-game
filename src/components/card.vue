<template>
	<div
		class="card"
		:class="{
			matched: card.isMatched,
			flipped: card.isFlipped,
		}"
	>
		<div class="back shadow">
			<img :src="card.image" />
		</div>
		<div class="front shadow"></div>
	</div>
</template>

<script>
export default {
	name: "card",
	props: ["card"],
	data() {
		return {};
	},
};
</script>

<style lang="scss">
@use "../assets/scss/reset.scss";
@use "../assets/scss/_variables.scss";
@use "../assets/scss/_global.scss";
.card {
	position: relative;
	-webkit-perspective: 1000;
	-moz-perspective: 1000;
	-o-perspective: 1000;
	perspective: 1000;
	cursor: pointer;
	img {
		width: 100%;
		height: auto;
		max-height: 100%;
		max-width: 100%;
		object-fit: contain;
	}
	h2 {
		font-size: 0.8em;
	}
	.shadow {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	}
	.front,
	.back {
		-webkit-backface-visibility: hidden;
		-moz-backface-visibility: hidden;
		-o-backface-visibility: hidden;
		backface-visibility: hidden;
		-webkit-transition: 0.6s;
		-webkit-transform-style: preserve-3d;
		-moz-transition: 0.6s;
		-moz-transform-style: preserve-3d;
		-o-transition: 0.6s;
		-o-transform-style: preserve-3d;
		-ms-transition: 0.6s;
		-ms-transform-style: preserve-3d;
		transition: 0.6s;
		transform-style: preserve-3d;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.front {
		width: 100%;
		background: variables.$color-gold;
	}
	.back {
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		-webkit-transform: rotateY(-180deg);
		-moz-transform: rotateY(-180deg);
		-o-transform: rotateY(-180deg);
		-ms-transform: rotateY(-180deg);
		transform: rotateY(-180deg);
		position: absolute;
	}
	&.flipped .back,
	&.matched .back {
		-webkit-transform: rotateY(0deg);
		-moz-transform: rotateY(0deg);
		-o-transform: rotateY(0deg);
		-ms-transform: rotateY(0deg);
		transform: rotateY(0deg);
	}
	&.flipped .front,
	&.matched .front {
		-webkit-transform: rotateY(180deg);
		-moz-transform: rotateY(180deg);
		-o-transform: rotateY(180deg);
		-ms-transform: rotateY(180deg);
		transform: rotateY(180deg);
	}
}
</style>
