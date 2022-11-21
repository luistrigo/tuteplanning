<template>
  <div class="container">
    <div class="nav-home">
    <div class="card md tapete">
        <CardsLogo/>
      <div v-if="!player" class="player-name">
        <label>{{t("player_name")}} *</label>
        <input type="text" v-model="newPlayer" />
      </div>
      <div v-if="player" class="player-name">
      <label>{{t("player_name")}}</label>
      <span class="player-name-span">{{player}}</span>
      </div>
      <div class="player-name">
        <label for="">{{t("sprint_name")}} *</label>
        <input type="text" v-model="sprint.name">
      </div>
      <div class="player-name">
        <label for="">{{t("sprint_cards_type")}}</label>
        <select v-model="sprint.cards">
          <option v-for="(types,key) in cardsTypes" :key="key" :value="key">
            {{types.title}} <small>({{types.values.join(",")}})</small>
          </option>
        </select>
      </div>
      <div class="player-name">
        <label for="only_creator_edit" >{{sprint.only_creator_edit==1 ? t("sprint_message_only_creator") : t("sprint_message_anyone")}} 
          <input id="only_creator_edit" type="checkbox" true-value="1" false-value="0" v-model="sprint.only_creator_edit">
        </label>
        <!--
        <label for="only_creator_show" >{{sprint.only_creator_show==1 ? t("sprint_message_only_creator_show") : t("sprint_message_anyone_show")}} 
          <input id="only_creator_show" type="checkbox" true-value="1" false-value="0" v-model="sprint.only_creator_show">
        </label>
        -->
      </div>
      <a class="btn" :class="newPlayer && sprint.name ? 'btn-primary' : 'btn-disabled'" @click="createSprint"
        >{{t("sprint_create")}}</a
      >
    </div>
    <div v-if="sprintId" class="card md">
      <h2>{{t("sprint_created")}}</h2>
      <span>{{sprintId}}</span>
      <a class="btn btn-primary" @click="gotoSprint">
        {{t("sprint_goto")}}
      </a> 
    </div>
  </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {getCardsTypes} from "@/helpers/index.js"

import { useSprintStore } from "@/stores/sprint";
import CardsLogo from "@/components/CardsLogo.vue"

export default {
  name: "Sprint",
  components: {CardsLogo},
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    })
    const sprint = ref({
      name: '',
      cards:'fibonacci',
      only_creator_edit: 1,
      only_creator_show: 1,
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
        sprint.value.only_creator_edit = sprint.value.only_creator_edit === '0' ? 0 : 1; 
        sprint.value.only_creator_show = sprint.value.only_creator_show === '0' ? 0 : 1; 
        await store.createSprint(sprint.value, newPlayer.value);

        await store.createNewStory({title:sprint.value.name +"_01" ,url:""});
        router.push({name:"home"});
      }catch(e){
        console.log(e);
      }
    };

    const gotoSprint = ()=>{
       router.push({name:"home"});
    }
    
    return {
      t,
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
