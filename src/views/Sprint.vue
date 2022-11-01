<template>
  <div class="container">
    <div class="nav-home">
    <div class="card md tapete">
        <CardsLogo/>
      <div v-if="!player" class="player-name">
        <label>Nombre del Jugador *</label>
        <input type="text" v-model="newPlayer" />
      </div>
      <div v-if="player" class="player-name">
      <label>Nombre del Jugador</label>
      <span class="player-name-span">{{player}}</span>
      </div>
      <div class="player-name">
        <label for="">Nombre del Sprint *</label>
        <input type="text" v-model="sprint.name">
      </div>
      <div class="player-name">
        <label for="">Tipo de cartas</label>
        <select v-model="sprint.cards">
          <option v-for="(types,key) in cardsTypes" :key="key" :value="key">
            {{types.title}} <small>({{types.values.join(",")}})</small>
          </option>
        </select>
      </div>
      <div class="player-name">
        <label for="only_creator_edit" >{{sprint.only_creator_edit==1 ? 'Solo tu puedes crear historias, mostrar ocultar las cartas, editar los puntos' : 'Cualquiera puede crear historias, mostrar ocultar las cartas, editar los puntos'}}
          <input id="only_creator_edit" type="checkbox" true-value="1" false-value="0" v-model="sprint.only_creator_edit">
        </label>
      </div>
      <a class="btn" :class="newPlayer && sprint.name ? 'btn-primary' : 'btn-disabled'" @click="createSprint"
        >Crear un sprint</a
      >
    </div>
    <div v-if="sprintId" class="card md">
      <h2>Tienes un sprint creado</h2>
      <span>{{sprintId}}</span>
      <a class="btn btn-primary" @click="gotoSprint">
        Ir al sprint
      </a> 
    </div>
  </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {getCardsTypes} from "@/helpers/index.js"

import { useSprintStore } from "@/stores/sprint";
import CardsLogo from "@/components/CardsLogo.vue"

export default {
  name: "Sprint",
  components: {CardsLogo},
  setup() {
    const sprint = ref({
      name: '',
      cards:'fibonacci',
      only_creator_edit: 1,
    })
    const newPlayer = ref("");
    const router = useRouter();
    const store = useSprintStore();
    const player = store.getPlayer;
    const sprintId = store.getSprintId;
    const cardsTypes = getCardsTypes();

    newPlayer.value = player ? player :'';

    const createSprint = async () => {
      
      if (!newPlayer.value) {
        return;
      }

      if(!sprint.value.name){
        return;
      }

      if(!sprint.value.cards){
        return;
      }
      try{
        await store.createSprint(sprint.value, newPlayer.value);
        router.push({name:"home"});
      }catch(e){
        console.log(e);
      }
    };

    const gotoSprint = ()=>{
       router.push({name:"home"});
    }
    
    return {
      newPlayer,
      player,
      sprintId,
      sprint,
      cardsTypes,
      createSprint,
      gotoSprint,
    };
  },
  
};
</script>
