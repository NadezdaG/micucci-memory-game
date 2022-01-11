	<template>
<aside>
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

			<h1>Art Memory Game</h1>
			<ul class="category">
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
            <div class="dificulty">
<input type="radio" id="simple" value="simple" v-model="dificulty">
<label for="one">Simple</label>
<br>
<input type="radio" id="medium" value="medium" v-model="dificulty">
<label for="two">Medium</label>
<br>
<input type="radio" id="hard" value="hard" v-model="dificulty">
<label for="two">Hard</label>
            </div>
            <footer>
App developed by
			<a
				href="https://gurska.dev"
				title="Nadezda Gurska web developer"
				target="_blank"
				>Nadezda G</a
			>
			for
			<a href="https://www.micucci.co.uk" title="" target="_blank"
				>Micucci</a
			>.
                </footer>
	</aside>
</template>

<script>
export default {
	name: "side",
	props: ["activeCategory","dificulty"],
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

aside {
    display:flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    > img {
        max-width: 200px;
        height:auto;
    }
    h1 {
	text-align: center;
	margin: 1em 0;
	text-transform: uppercase;
    }
    footer {
        margin-top: auto;
        justify-self: flex-end;
    }
}

ul {
	display: flex;
	list-style: none;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: center;
	padding: 0;
	margin: 0;
	gap: 1px;
    width: 100%;
	@media all and (min-width: 768px) {
		//flex-wrap: nowrap;
		//margin-top: 0;
	}
	li {
		padding: 10px;
		line-height: 1;
		text-transform: uppercase;
		font-size: 1em;
		background-color: #efefef;
		@media all and (min-width: 768px) {
			font-size: 1em;
			padding: 10px;
		}
        transition: all 1s;
		cursor: pointer;
		&:hover,
		&.active {
			background-color: #111;
			color: white;
		}
	}
}
</style>