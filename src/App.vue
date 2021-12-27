<template>
  <header>logo</header>
  <section>
    <div class="container cards">
    <div
            v-for="(card, index) in this.memoryCards"
            v-bind:key="index"
            :class="{ 'matched': card.isMatched,'flipped': card.isFlipped, 'cards__card': true}"
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
      <a href="https://www.micucci.co.uk" title="" target="_blank">Mucicci</a>.
    </div>
  </footer>
</template>

<script>
//import inputCity from "./components/inputCity.vue";
//import weatherCards from "./components/weatherCards.vue";
//import unitSelector from "./components/unitSelector.vue";
//components: { inputCity, weatherCards, unitSelector },
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const _ = require('lodash');
export default {
  name: "App",
  data() {
    return {
      cards: [],
      memoryCards: [],
      flippedCards: [],
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
      api
        .get("products", {
          per_page: 100,
          on_sale: true,
        })
        .then((response) => {
          const shuffled = response.data.sort(() => 0.5 - Math.random());

// Get sub-array of first n elements after shuffled
response.data = shuffled.slice(0, 12);
          response.data.forEach((item) => {
            this.cards.push({
              id: item.id,
              name: item.name,
              permalink: item.permalink,
              image: item.images[0]['src'],
              isFlipped: false,
              isMatched: false
            });
            
          });
          this.memoryCards = _.shuffle(this.cards.concat(_.cloneDeep(this.cards)));
          console.log(this.cards);
          console.log(this.memoryCards);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    flipCard(card){
      console.log('flip card');
      console.log(this.flippedCards.length);

      if(this.flippedCards.length < 2)
        {
          card.isFlipped = !card.isFlipped;
          this.flippedCards.push(card);
            if (this.flippedCards.length === 2)  {   
        this.match();
    } 
        } else {
          this.memoryCards.forEach(card => card.isFlipped = false);
          this.flippedCards = [];
        }
          

        },

        match() {
          
   if(this.flippedCards[0].name === this.flippedCards[1].name) {
      console.log('match');
        this.flippedCards.forEach(card => card.isMatched = true);
        this.flippedCards = [];
   } else {
     console.log('no match');
   }
        
        }
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
  height:100%;
}
.cards {
  width:100%;
  height:100%;
  display:grid;
  grid-template: repeat(3,1fr)/repeat(8,1fr);
  gap:10px;
  &__card {
    position:relative;
    -webkit-perspective: 1000;
        -moz-perspective: 1000;
        -o-perspective: 1000;
        perspective: 1000;
        cursor: pointer;
    img {
      width:100%;
      height: auto;
    }
    h2 {Font-size:0.8em;}
.shadow {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
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
        height:100%;
        overflow:hidden;
    }
    .front {
      width:100%;
      background: variables.$color-gold;
    }
    .back {
      background-color:white;
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
    &.flipped .back, &.matched .back {
          -webkit-transform: rotateY(0deg);
        -moz-transform: rotateY(0deg);
        -o-transform: rotateY(0deg);
        -ms-transform: rotateY(0deg);
        transform: rotateY(0deg);
    }
    &.flipped .front, &.matched .front {
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
        -o-transform: rotateY(180deg);
        -ms-transform: rotateY(180deg);
        transform: rotateY(180deg);
    }
  }
  
}
</style>
