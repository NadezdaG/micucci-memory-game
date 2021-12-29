<template>
    <div
        class="popup"
		:class="{
			active: this.popupOpen
		}"
	>
		<div class="popup__inner">
			<span @click="closePopup()" class="popup__close">close</span>
			<h2>IT'S A MATCH!</h2>
			<img v-bind:src="image" />
			<p>
				Go and buy:
				<a
					href="{{permalink}}"
					title="{{name}}"
					target="_blank"
					>{{name}}</a
				>
			</p>
		</div>
	</div>
</template>

<script>
export default {
  name: "popup",
  props: ['id','name','permalink','image'],
  data() {
      return {
        popupOpen: false,
      }
  },

  methods: {
      openPopup() {
			this.popupOpen = true;
		},

		closePopup() {
			this.popupOpen = false;
		},
  },
};
</script>

<style lang="scss">
@use "../assets/scss/reset.scss";
@use "../assets/scss/_variables.scss";
@use "../assets/scss/_global.scss";


.popup {
	display: none;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: absolute;
	background: rgba(255, 255, 255, 0.8);
	opacity: 0;
	z-index: 0;
	top: 0;
	left: 0;

	width: 100%;
	height: 100%;
	transition: opacity 3s;
	h2 {
		text-align: center;
		padding-bottom: 1em;
	}
	p {
		margin: 0;
		padding: 1em 0 0 0;
		text-align: center;
	}
	&__close {
		position: absolute;
		top: 0;
		right: 0;
		text-transform: uppercase;
		font-size: 0.8em;
		padding: 10px 10px;
		cursor: pointer;
	}
	&__inner {
		position: relative;
		background: white;
		padding: 2em;
		max-width: 600px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		img {
			width: 400px;
			height: auto;
		}
	}
	&.active {
		display: flex;
		z-index: 100;
		opacity: 1;
	}
}
</style>
