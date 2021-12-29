<template>
	<div
		:class="{
			active: this.popupOpen,
			popup: true,
		}"
	>
		<div class="popup__inner">
			<span @click="closePopup()" class="popup__close">close</span>
			<h2>IT'S A MATCH!</h2>
			<img v-bind:src="this.matchCard.image" />
			<p>
				Go and buy:
				<a
					href="{{this.matchCard.permalink}}"
					title="{{this.matchCard.name}}"
					target="_blank"
					>{{ this.matchCard.name }}</a
				>
			</p>
		</div>
	</div>
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
			class="lazyloaded"
			data-ll-status="loaded"
		/>
		<h1>Art Memory Game</h1>
	</header>
	<section>
		<div class="container cards">
			<div
				v-for="(card, index) in this.memoryCards"
				v-bind:key="index"
				:class="{
					matched: card.isMatched,
					flipped: card.isFlipped,
					cards__card: true,
				}"
				@click="flipCard(card)"
			>
				<div class="back shadow">
					<img v-bind:src="card.image" />
				</div>
				<div class="front shadow"></div>
			</div>
		</div>
	</section>

	<footer>
		<div class="container">
			App developed by
			<a
				href="https://gurska.dev"
				title="Nadezda Gurska web developer"
				target="_blank"
				>Nadezda G</a
			>
			for
			<a href="https://www.micucci.co.uk" title="" target="_blank"
				>Mucicci</a
			>.
		</div>
	</footer>
</template>

<script>
//import inputCity from "./components/inputCity.vue";
//import weatherCards from "./components/weatherCards.vue";
//import unitSelector from "./components/unitSelector.vue";
//components: { inputCity, weatherCards, unitSelector },
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const _ = require("lodash");
export default {
	name: "App",
	data() {
		return {
			cards: [],
			memoryCards: [],
			flippedCards: [],
			popupOpen: false,
			matchCard: {
				id: "id",
				name: "name",
				permalink: "permalink",
				image: "src",
			},
		};
	},
	watch: {},
	methods: {
		loadCards() {
			const api = new WooCommerceRestApi({
				url: "https://www.micucci.co.uk",
				consumerKey: "ck_b9dcaa7190a78f23d97090a6327ccf6acddb091f",
				consumerSecret: "cs_22f9fc28327467195bcbeff7ce65c65ccd82dc97",
				version: "wc/v3",
			});
			api.get("products", {
				per_page: 100,
				on_sale: true,
			})
				.then((response) => {
					const shuffled = response.data.sort(
						() => 0.5 - Math.random()
					);

					// Get sub-array of first n elements after shuffled
					response.data = shuffled.slice(0, 9);
					response.data.forEach((item) => {
						this.cards.push({
							id: item.id,
							name: item.name,
							permalink: item.permalink,
							image: item.images[0]["src"],
							isFlipped: false,
							isMatched: false,
						});
					});
					this.memoryCards = _.shuffle(
						this.cards.concat(_.cloneDeep(this.cards))
					);
					console.log(this.cards);
					console.log(this.memoryCards);
				})
				.catch((error) => {
					console.log(error.response.data);
				});
		},

		flipCard(card) {
			if (card.isMatched===true) {
				this.matchCard = card;
				this.openPopup();
				return;
			}
			if (this.flippedCards.length < 2) {
				card.isFlipped = !card.isFlipped;
				this.flippedCards.push(card);
				if (this.flippedCards.length === 2) {
					this.match();
				}
			} else {
				this.memoryCards.forEach((card) => (card.isFlipped = false));
				this.flippedCards = [];
			}
		},

		match() {
			if (this.flippedCards[0].name === this.flippedCards[1].name) {
				this.matchCard = this.flippedCards[0];
				this.flippedCards.forEach((card) => (card.isMatched = true));
				this.flippedCards = [];

				console.log("match", this.matchCard);
				this.openPopup();
			}
		},

		openPopup() {
			this.popupOpen = true;
		},

		closePopup() {
			this.popupOpen = false;
		},
	},
	mounted: function () {
		this.loadCards();
	},
};
</script>

<style lang="scss">
@use "./assets/scss/reset.scss";
@use "./assets/scss/_variables.scss";
@use "./assets/scss/_typography.scss";
@use "./assets/scss/_global.scss";
section {
	height: 100%;
}
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
.cards {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template: repeat(6, 1fr) / repeat(3, 1fr);
	gap: 10px;
	@media all and (min-width: 768px) {
		grid-template: repeat(3, 1fr) / repeat(6, 1fr);
	}
	&__card {
		position: relative;
		-webkit-perspective: 1000;
		-moz-perspective: 1000;
		-o-perspective: 1000;
		perspective: 1000;
		cursor: pointer;
		img {
			width: 100%;
			height: auto;
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
}
</style>
