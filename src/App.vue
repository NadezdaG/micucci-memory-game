<template>
  <popup
    ref="popup"
    :name="this.matchCard.name"
    :id="this.matchCard.id"
    :permalink="this.matchCard.permalink"
    :image="this.matchCard.image"
  ></popup>
  <appHeader :activeCategory="this.category"></appHeader>
  <section>
    <spinner :loading="this.loading"></spinner>
    <div class="container cards">
      <card
        ref="card"
        v-for="(card, index) in this.memoryCards"
        v-bind:key="index"
        :card="card"
        @click="flipCard(card)"
      >
      </card>
    </div>
  </section>

  <appFooter></appFooter>
</template>

<script>
import spinner from "./components/spinner.vue";
import popup from "./components/popup.vue";
import card from "./components/card.vue";
import appHeader from "./components/appHeader.vue";
import appFooter from "./components/appFooter.vue";

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const _ = require("lodash");

export default {
  name: "App",
  components: { spinner, popup, card, appFooter, appHeader },
  data() {
    return {
      loading: true,
      cards: [],
      memoryCards: [],
      flippedCards: [],
      matchCard: {},
      category: 25,
    };
  },
  watch: {},
  methods: {
    changeCategory(cat) {
      console.log("cat change");
      this.loading = true;
      this.category = cat;
      this.cards = [];
      this.memoryCards = [];
      this.flipperCards = [];
      this.loadCards();
      console.log(this.category);
    },
    loadCards() {
      const api = new WooCommerceRestApi({
        url: "https://www.micucci.co.uk",
        consumerKey: process.env.VUE_APP_KEY,
        consumerSecret: process.env.VUE_APP_SECRET,
        version: "wc/v3",
      });
      api
        .get("products", {
          per_page: 100,
          category: this.category,
        })
        .then((response) => {
          const shuffled = response.data.sort(() => 0.5 - Math.random());

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
          this.loading = false;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    flipCard(card) {
      if (card.isMatched === true) {
        this.matchCard = card;
        this.$refs.popup.openPopup();
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
        this.$refs.popup.openPopup();
      }
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
.cards {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template: repeat(6, 1fr) / repeat(3, 1fr);
  gap: 10px;
  @media all and (min-width: 768px) {
    grid-template: repeat(3, 1fr) / repeat(6, 1fr);
  }
}
</style>
