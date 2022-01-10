	<template>
	<header>
		<img
			src="https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-300x88.jpg"
			width="300"
			height="88"
			alt="1"
			data-zoom-image="https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-300x88.jpg"
			sizes="(min-width:780px) 50vw, 300px"
			srcset="
				https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB.jpg          2126w,
				https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-400x118.jpg   400w,
				https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-555x163.jpg   555w,
				https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-300x88.jpg    300w,
				https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-1024x302.jpg 1024w,
				https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-768x226.jpg   768w,
				https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-1536x452.jpg 1536w,
				https://www.micucci.co.uk/wp-content/uploads/2021/01/TEXT-FOR-WEB-2048x603.jpg 2048w
			"
		/>
		<div>
			<h1>Art Memory Game</h1>
			<ul>
				<li
					@click="this.$parent.changeCategory(25)"
					:class="[activeCategory == 25 ? 'active' : '']"
				>
					Art
				</li>
				<li
					@click="this.$parent.changeCategory(26)"
					:class="[activeCategory == 26 ? 'active' : '']"
				>
					Ceramics
				</li>
				<li
					@click="this.$parent.changeCategory(33)"
					:class="[activeCategory == 33 ? 'active' : '']"
				>
					Tableware
				</li>
				<li
					@click="this.$parent.changeCategory(27)"
					:class="[activeCategory == 27 ? 'active' : '']"
				>
					Lighting
				</li>
			</ul>
		</div>
	</header>
</template>
<script>
export default {
	name: "appHeader",
	props: ["activeCategory"],
	data() {
		return {};
	},

	methods: {},
};
</script>
<style lang="scss">
@use "../assets/scss/reset.scss";
@use "../assets/scss/_variables.scss";
@use "../assets/scss/_global.scss";
header {
	width: 100%;
	display: grid;
	grid-auto-rows: 1fr;
	grid-template-columns: 1fr;
	grid-template-rows: auto auto;
	grid-template-areas: "logo" "menu";
	@media all and (max-width: 767px) {
		justify-items: center;
	}
	@media all and (min-width: 768px) {
		grid-template-columns: 1fr auto;
		grid-template-rows: 1fr;
		grid-template-areas: "logo menu";
	}
	> img {
		grid-area: logo;
		max-width: 120px;
		height: auto;
	}
	> div {
		grid-area: menu;
	}
}
h1 {
	text-align: center;
	margin-bottom: 1em;
	@media all and (min-width: 768px) {
		text-align: right;
	}
	text-transform: uppercase;
}
ul {
	display: flex;
	list-style: none;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	padding: 0;
	margin: 0;
	gap: 0.5em;
	margin-top: 1em;
	@media all and (min-width: 768px) {
		flex-wrap: nowrap;
		margin-top: 0;
	}
	li {
		padding: 10px;
		line-height: 1;
		text-transform: uppercase;
		font-size: 1em;
		background-color: #efefef;
		@media all and (min-width: 768px) {
			font-size: 0.8em;
			padding: 5px 10px;
		}
		cursor: pointer;
		&:hover,
		&.active {
			background-color: #111;
			color: white;
		}
	}
}
</style>