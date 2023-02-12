<template lang="">
    <div class="cards-container" >
        <div class="card-point" v-for="(card,index) in listCards" :key="index" @click="selectCard(card.value)">
            <div class="points">{{card.value}}</div>
            <img :src="card.img">
        </div>
    </div> 
</template>
<script>
import {getCardsTypes} from '../helpers/index.js'
export default {
  props: {
    points_style: {
      type: String,
      default: "fibonnaci",
    },
  },
  methods: {
    selectCard(card){
        this.$emit('selectCard',card)
    }
  },
  computed: {
    listCards() {
      const cardsTypes = getCardsTypes();
      const cardsList = typeof cardsTypes[this.points_style.toLowerCase()] ? cardsTypes[this.points_style.toLowerCase()]: cardsTypes.fibonacci;
      const list = cardsList.values.map((c)=>{
        return {value:c,img:"/cards/card.jpg"}
      })
      return list;
    },
  },
};

</script>
<style>
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20%, 2fr));
}
.card-point {
    justify-self: center;
    width: 85px;
    height: auto;
    border: 3px solid #000;
    border-radius: 10px;
    margin: 10px;
    top: 0;
    left: 0px;
    z-index: 100;
     display: flex;
  justify-content: center;
  position: relative;
  background-color: hsl(var(--clr-white));
  -webkit-box-shadow: 6px 9px 25px -10px rgba(0,0,0,0.75);
  -moz-box-shadow: 6px 9px 25px -10px rgba(0,0,0,0.75);
  box-shadow: 6px 9px 25px -10px rgba(0,0,0,0.75);
}

.card-point .points {
    min-width: 1.5em;
    text-align: center;
    margin-left: 5px;
    margin-top: 5px;
    border: 1px solid hsl(var(--clr-light-secondary));
    border-radius: 50%;
    font-size: .9em;
    line-height: 1.5em;
    background-color:hsl(var(--clr-light));
    color: hsl(var(--clr-warning));
    position: absolute;
    top:0;
    left:0;
    z-index: 100;
}

.card-point img {
  border-radius: 10px;
}

@media (max-width: 35em) {
  .cards-container {
    gap:5px
  }
  .card-point {
    width: 60px;
    height: auto;
  }
  .card-point .points {
        margin-left: -5px;
        margin-top: -5px;
  }
}
</style>