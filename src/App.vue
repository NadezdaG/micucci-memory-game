<template>
  <aside>
    <a href="https://www.micucci.co.uk/"
      ><img
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
    /></a>

    <h1>Art Memory Game</h1>
    <div
      class="hamburger"
      :class="{ active: mobileNav }"
      @click="mobileNav = !mobileNav"
    ></div>
    <div class="mobile-nav" :class="{ active: mobileNav }">
      <ul class="category">
        <li
          v-for="(value, cat) in this.categories"
          v-bind:key="cat"
          :class="{
            active: this.category == value,
          }"
        >
          <input
            type="radio"
            :id="cat"
            :value="value"
            v-model="this.category"
          />
          <label :for="cat">{{ cat }}</label>
        </li>
      </ul>
      <ul class="dificulty">
        <li
          v-for="(value, label) in this.count"
          v-bind:key="label"
          :class="{
            active: this.dificulty == label,
          }"
        >
          <input
            type="radio"
            :id="label"
            :value="label"
            v-model="this.dificulty"
          />
          <label :for="label">{{ label }}</label
          ><br />
        </li>
      </ul>
      <footer>
        App developed by
        <a
          href="https://gurska.dev"
          title="Nadezda Gurska web developer"
          target="_blank"
          >Nadezda G</a
        >
        for
        <a href="https://www.micucci.co.uk" title="" target="_blank">Micucci</a
        >.
      </footer>
    </div>
  </aside>
  <section>
    <popup
      ref="popup"
      :name="this.matchCard.name"
      :id="this.matchCard.id"
      :permalink="this.matchCard.permalink"
      :image="this.matchCard.image"
    ></popup>

    <spinner :loading="this.loading"></spinner>
    <div class="container cards" :class="this.dificulty">
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
</template>

<script>
import spinner from "./components/spinner.vue";
import popup from "./components/popup.vue";
import card from "./components/card.vue";

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const _ = require("lodash");

export default {
  name: "App",
  components: { spinner, popup, card },
  data() {
    return {
      mobileNav: false,
      loading: true,
      categories: {
        art: 134,
        ceramics: 50,
        tableware: 41,
        lighting: 139,
        glassware: 94,
      },
      memoryCards: [],
      flippedCards: [],
      matchCard: {},
      category: 74,
      count: {
        simple: 6,
        medium: 12,
        hard: 18,
      },
      dificulty: "hard",
    };
  },
  watch: {
    dificulty() {
      this.reloadCards();
    },
    category() {
      this.reloadCards();
    },
  },
  methods: {
    loadData(category) {
      const api = new WooCommerceRestApi({
        url: "https://www.micucci.store",
        consumerKey: "ck_c06b14c56c2518d31a1230e36eba267f788b0487",
        consumerSecret: "cs_421bbefcd8fc67a2b3d8870874842e89f70f6b42",
        version: "wc/v3",
      });
      api
        .get("products", {
          per_page: 100,
          category: category,
        })
        .then((response) => {
          const arr = [];
          response.data.forEach((item) => {
            arr.push({
              id: item.id,
              name: item.name,
              permalink: item.permalink,
              image: item.images[0]["src"],
              isFlipped: false,
              isMatched: false,
            });
          });
          localStorage.setItem("memoryCards-" + category, JSON.stringify(arr));
          this.shuffleMemoryCards(arr);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    reloadCards() {
      this.mobileNav = false;
      this.loading = true;
      this.memoryCards = [];
      this.flippedCards = [];
      this.matchCard = {};
      this.loadCards();
    },

    shuffleMemoryCards(array) {
      array = array.slice(0, this.count[this.dificulty]);
      this.memoryCards = _.shuffle(array.concat(_.cloneDeep(array)));
      this.loading = false;
    },

    loadCards() {
      if (localStorage.getItem("memoryCards-" + this.category)) {
        let tempArray = JSON.parse(
          localStorage.getItem("memoryCards-" + this.category) || "[]"
        );
        this.shuffleMemoryCards(tempArray);
      } else {
        this.loadData(this.category);
      }
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
.mobile-nav {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  position: relative;

  @media all and (min-width: 769px) {
    justify-self: start;
  }
  @media all and (max-width: 768px) {
    z-index: 3;
    background: white;
    top: 00px;
    width: 80%;
    padding: 15px;
    height: auto;
    position: absolute;
    transform: translateX(-100vw);
    transition: transform 1.2s;
    &.active {
      transform: translateX(0%);
    }
  }
}
.hamburger {
  display: none;
  @media all and (max-width: 768px) {
    top: 40px;
    display: inline-block;
    right: 30px;
    transition: 0.5s;
    position: absolute;
    width: 20px;
    height: 2px;
    background: variables.$color-black;
    z-index: 3;
    cursor: pointer;

    &:before {
      top: -7px;
    }

    &:after {
      top: 7px;
    }
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 20px;
      height: 2px;
      background: variables.$color-black;
      transition: 0.5s;
    }

    &.active {
      background: rgba(0, 0, 0, 0);
    }

    &.active:before {
      top: 0;
      transform: rotate(135deg);
    }

    &.active:after {
      top: 0;
      transform: rotate(225deg);
      box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
    }
  }
}
.cards {
  display: grid;
  position: relative;
  grid-template: repeat(6, 1fr) / repeat(6, 1fr);
  aspect-ratio: 6/6;
  gap: 10px;
  width: 100%;
  height: auto;

  &.hard {
    grid-template: repeat(8, 1fr) / repeat(4, 1fr);
    width: 100%;
    aspect-ratio: unset;
    height: 100%;
    @media all and (min-width: 769px) {
      grid-template: repeat(6, 1fr) / repeat(6, 1fr);
      width: auto;
      aspect-ratio: 1/1;
      height: 90vh;
    }
  }
  //@media all and (min-width: 769px), (max-width: 768px) and (orientation: landscape) {
  &.simple {
    grid-template: repeat(4, 1fr) / repeat(3, 1fr);
    aspect-ratio: 3/4;
    width: auto;
    height: 100%;
    @media all and (min-width: 769px) {
      grid-template: repeat(3, 1fr) / repeat(4, 1fr);
      aspect-ratio: 4/3;
      width: 100%;
      height: auto;
    }
  }
  &.medium {
    grid-template: repeat(6, 1fr) / repeat(4, 1fr);
    aspect-ratio: 4/6;
    width: autp;
    height: 100%;
    @media all and (min-width: 769px) {
      grid-template: repeat(4, 1fr) / repeat(6, 1fr);
      aspect-ratio: 6/4;
      width: 100%;
      height: auto;
    }
  }
}

aside {
  display: grid;
  grid-template: auto auto 1fr / auto;
  justify-items: center;
  justify-content: center;
  > img {
    max-width: 200px;
    height: auto;
  }
  h1 {
    text-align: center;
    margin: 1em 0;
    text-transform: uppercase;
  }
  footer {
    margin-top: auto;
    justify-self: flex-end;
    @media all and (max-width: 768px) {
      margin-top: 20px;
    }
  }
}

ul.dificulty {
  width: 100%;
  display: grid;
  list-style: none;
  padding: 0;
  margin: 1em 0 0;
  grid-template: auto / 1fr 1fr 1fr;
  justify-items: stretch;

  li {
    background-color: #efefef;
    cursor: pointer;
    transition: all 1s;
    padding: 0.2em 0.5em;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.8em;
    &:hover,
    &.active {
      background-color: #111;
      color: white;
    }

    input {
      display: none;
    }
  }
}
label {
  cursor: pointer;
  display: inline-block;
  width: 100%;
}
ul.category {
  display: flex;
  list-style: none;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin: 0;
  gap: 1px;
  width: 100%;

  li {
    padding: 10px;
    line-height: 1;
    text-transform: uppercase;
    font-size: 1em;
    background-color: #efefef;
    transition: all 1s;
    padding: 0.5em 0.5em;
    cursor: pointer;
    &:hover,
    &.active {
      background-color: #111;
      color: white;
    }

    input {
      display: none;
    }
  }
}
</style>
