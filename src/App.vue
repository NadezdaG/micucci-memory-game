<template>
  <aside>
    <a :href="settings.brands[brand].url" :title="settings.brands[brand].name">
      <img
        :src="'images/' + settings.brands[brand].image"
        :alt="settings.brands[brand].name"
      />
    </a>
    <h1>Memory Game</h1>
    <div
      class="hamburger"
      :class="{ active: mobileNav }"
      @click="mobileNav = !mobileNav"
    ></div>
    <div class="mobile-nav" :class="{ active: mobileNav }">
      <!-- difficulty selection ul list -->
      <ChoiceList
        :list="['easy', 'medium', 'hard']"
        :selected="settings.difficulty"
        @select="updateDifficulty"
      />

      <!-- categories selection ul list -->
      <div
        class="categories"
        v-if="
          settings.brands[brand].categories &&
          Object.keys(settings.brands[brand].categories).length > 0
        "
      >
        <ul>
          <li v-for="(id, name) in settings.brands[brand].categories" :key="id">
            <button
              @click="changeCategory(id)"
              :class="{ active: selectedCategory === id }"
            >
              {{ name }}
            </button>
          </li>
          <li>
            <button
              @click="
                selectedCategory = false;
                shuffleCards();
              "
              :class="{ active: !selectedCategory }"
            >
              All
            </button>
          </li>
        </ul>
      </div>
    </div>
  </aside>
  <section>
    <Popup
      ref="popup"
      :name="matchCard.name"
      :id="matchCard.id"
      :url="matchCard.url"
      :image="matchCard.image"
    ></Popup>
    <!-- loading -->
    <div v-if="loading" class="loading">Loading...</div>
    <!-- error -->
    <div v-if="error" class="error">
      <p>Error fetching products: {{ error }}</p>
    </div>
    <!-- cards -->

    <div v-if="!loading && !error" class="cards" :class="settings.difficulty">
      <Card
        v-for="(card, index) in memoryCards"
        :key="index"
        :card="card"
        @click="handleCardCLick(card)"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchProducts } from "./assets/js/fetchProducts.js";
const _ = require("lodash");
// import card component
import Card from "./components/Card.vue";
import Popup from "./components/Popup.vue";
import ChoiceList from "./components/ChoiceList.vue";
// vars
const loading = ref(false);
const error = ref(null);
const selectedCategory = ref(null);

let brand = ref("micucci");
const app = document.querySelector("#app");
if (app) {
  brand.value = app.getAttribute("data-brand") || "micucci";
}

const products = ref([]);

let memoryCards = ref([]);
let matchCard = ref({});
let popup = ref(null);
let mobileNav = ref(false);

let settings = ref({
  brands: {
    micucci: {
      name: "Micucci",
      url: "https://micucci.store",
      image: "micucci.jpg",
      key: "ck_c06b14c56c2518d31a1230e36eba267f788b0487",
      secret: "cs_421bbefcd8fc67a2b3d8870874842e89f70f6b42",
      categories: {
        art: 134,
        ceramics: 50,
        tableware: 41,
        lighting: 139,
      },
      showVariations: false,
    },
    bijoure: {
      name: "Bijoure",
      url: "https://bijoure.com",
      image: "bijoure.png",
      key: "ck_6455f743ae39dcc151f659bf21b90856ebea7c4a",
      secret: "cs_baf9feee3c62284a9054d08f17a95d46562df7c7",
      categories: [],
      showVariations: true,
    },
  },
  difficulty: "easy",
  count: {
    easy: 12,
    medium: 24,
    hard: 36,
  },
});

const updateDifficulty = (difficulty) => {
  console.log("Updating difficulty to:", difficulty);
  settings.value.difficulty = difficulty;
  shuffleCards();
};

const changeCategory = (category) => {
  selectedCategory.value = category;
  shuffleCards();
};

const shuffleCards = () => {
  mobileNav.value = false; // close mobile nav on shuffle
  let productsArray = _.cloneDeep(products.value);
  console.log("start shuffle", productsArray);
  // take copy of products array, dosconnected
  if (!productsArray || productsArray.length === 0) return;
  // get settings.value.count[[settings.value.difficulty]] amound of random products
  const count = settings.value.count[settings.value.difficulty] / 2;

  // filter only selected category products if selectedCategory is set
  console.log("Selected category:", selectedCategory.value);
  if (selectedCategory.value) {
    console.log("filtering", productsArray);
    productsArray = productsArray.filter((product) =>
      product.categories.includes(selectedCategory.value)
    );
    console.log("Filtered products:", productsArray);
  }
  const subArray = _.shuffle(productsArray).slice(0, count);
  const duplicatedArray = subArray.concat(_.cloneDeep(subArray));
  memoryCards.value = _.shuffle(duplicatedArray);
  console.log("shuffled cards", memoryCards.value);
};

const handleCardCLick = (card) => {
  // handle card click logic here
  console.log("Card clicked:", card);
  // if card is not matched, flip
  if (!card.isMatched) {
    card.isFlipped = !card.isFlipped;
    // Add logic to check for matches here
    // For example, you can check if two cards are flipped and match them
    const flippedCards = memoryCards.value.filter(
      (c) => c.isFlipped && !c.isMatched
    );
    if (flippedCards.length === 2) {
      if (flippedCards[0].id === flippedCards[1].id) {
        flippedCards.forEach((c) => (c.isMatched = true));
        matchCard.value = flippedCards[0];
        popup.value.openPopup(); // Open the popup when a match is found
        console.log("It's a match!", matchCard.value);
      } else {
        setTimeout(() => {
          flippedCards.forEach((c) => (c.isFlipped = false));
        }, 1000);
      }
    }
  }
};

onMounted(() => {
  loading.value = true;
  error.value = null;

  // load objecr from json file, brand.value
  products.value = require("./assets/jsons/" + brand.value + ".json");

  // if it's empty, fetch from API
  if (!products.value || products.value.length === 0) {
    console.log("products not found in file, fetching from API");
    // wait for fetchProducts() and then set products in localstorage

    // Get brand configuration
    const brandConfig = settings.value.brands[brand.value];

    fetchProducts(brandConfig)
      .then((fetchedProducts) => {
        products.value = fetchedProducts;
        console.log("products loaded from API", products.value);
        if (products.value) {
          localStorage.setItem(
            "lproducts" + brand.value,
            JSON.stringify(products.value)
          );
          shuffleCards();
        } else {
          throw new Error("No products found");
        }
      })
      .finally(() => {
        loading.value = false;
      })
      .catch((err) => {
        error.value = err.response?.data?.message || err.message;
        console.error("Error fetching products:", err);
      });
  } else {
    console.log("products loaded from localstorage", products.value);
    loading.value = false;
    shuffleCards();
  }
});
</script>
<style lang="scss">
@use "./assets/scss/reset.scss";
@use "./assets/scss/_variables.scss";
@use "./assets/scss/global.scss";
</style>
<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  @media all and (min-width: 769px) {
    width: 300px;
    flex-shrink: 0;
  }
  img {
    max-width: 250px;
  }
}
section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mobile-nav {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  gap: 15px;
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
    background: var(--color-black);
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
      background: var(--color-black);
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
  gap: 10px;
  width: 100%;
  &.easy {
    aspect-ratio: 3/4;
    grid-template: repeat(4, 1fr) / repeat(3, 1fr);
    @media all and (min-width: 769px) {
      aspect-ratio: 4/3;
      grid-template: repeat(3, 1fr) / repeat(4, 1fr);
    }
  }
  &.medium {
    aspect-ratio: 4/6;
    grid-template: repeat(6, 1fr) / repeat(4, 1fr);
    @media all and (min-width: 769px) {
      aspect-ratio: 6/4;
      grid-template: repeat(4, 1fr) / repeat(6, 1fr);
    }
  }
  &.hard {
    aspect-ratio: 4/8;
    grid-template: repeat(8, 1fr) / repeat(4, 1fr);
    @media all and (min-width: 769px) {
      aspect-ratio: 9/4;
      grid-template: repeat(4, 1fr) / repeat(9, 1fr);
    }
  }
}

.categories ul {
  display: flex;
  list-style: none;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin: 0;
  gap: 1px;
  width: 100%;

  button {
    padding: 10px;
    line-height: 1;
    text-transform: uppercase;
    font-size: 1em;
    background-color: var(--color-lightgrey2);
    border: none;
    transition: all 1s;
    padding: 0.5em 0.5em;
    width: 100%;
    cursor: pointer;
    &:hover,
    &.active {
      background-color: var(--color-green);
      color: white;
    }
  }
}
</style>
