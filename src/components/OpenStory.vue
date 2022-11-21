<template lang="">
<div class="open stories tapete" v-if="sprint.stories && player">
    <Cards @selectCard="selectCard"  :points_style="sprint.cards"/>
    <ul>
      <template v-if="story.open === 1">
        <div>
            <div class="story-title">
                <div class="story-name">
                    <span v-if="!story.url">{{ story.title }}</span>
                    <a class="link-light" v-if="story.url" :href="story.url" target="_blank"> {{ story.title}}</a>
                </div>
                <div class="nav-buttons">
                <a v-if="canShowSprint" class="btn btn-primary-light" @click="showPoints(story.show)">
                    {{story.show ? t("votes_hide") : t("votes_show")}}
                </a>
                <a v-if="canShowSprint" class="btn btn-primary-light" @click="clearVotes()">
                    {{t("votes_clean")}}
                </a>
                </div>
            </div>
            <ul>
                <li
                :class="key === player ? 'myself' : ''"
                class="player"
                v-for="(player_s, key, index) in orderPlayers"
                :key="index"
                >
                <div class="player-name">{{ key }}</div>
                <div v-if="player_s.voted === 0">{{t('no')}}</div>
                <div v-if="player_s.voted === 1">
                    <span v-if="key === player">{{ points }}</span>
                    <span v-if="key !== player && !story.show">{{t('yes')}}</span>
                    <span v-if="key !== player && story.show">{{player_s.points}}</span>
                </div>
                <div class="trash-player">
                    <a @click="deletePlayer(key)" v-if="canShowSprint && key !== player">
                    <img src="/images/trash.png" style="height:30px"/>
                    </a>
                </div>
                </li>
            </ul>
        </div>
      </template>
    </ul>
         </div>
</template>
<script>
import { useSprintStore } from "@/stores/sprint";
import { computed, onMounted, ref,watch } from "vue";
import { useI18n } from "vue-i18n";
import { helperOrderBy } from "../helpers/index.js";
import Cards from "../components/Cards.vue";
export default {
  name: "OpenStory",
  components: { Cards },
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    })
    const store = useSprintStore();
    const sprint = computed(() => store.getSprint)
    const story = computed(() => store.getOpenStory)
    const player = computed(() => store.getPlayer);
    const points = ref("");
    const orderPlayers = ref([]);
    const canShowSprint = computed(() => store.canShowSprint);

    const showPoints = async (show) => {
      store.showPoints(show);
    };

    watch(story, () => {
      points.value = store.getLastVote();
    })

    
    watch(sprint, () => {
      points.value = store.getLastVote();
      orderPlayers.value = [];
      if(typeof story.value.players !== 'undefined'){
        orderPlayers.value = Object.entries(story.value.players)
        if(story.value.show === 1){
        orderPlayers.value = Object.fromEntries(helperOrderBy(Object.entries(story.value.players),[{points:'desc',name:'asc'}]))
        }else{
        orderPlayers.value = Object.fromEntries(helperOrderBy(Object.entries(story.value.players),[{name:'asc'}]))
        }
      }
    })


    const selectCard = async (card) => {
      try {
        store.setTempPoints(card);
        points.value = store.getLastVote();
        await store.sendVote(card);
      } catch (e) {
        console.log(e);
      }
    };

    const clearVotes = async() =>{
      await store.clearVotes();
    }

    const deletePlayer = async (player) => {
      try {
        await store.deletePlayer(player);
      } catch (e) {
        console.log(e);
      }
    };

    onMounted(() => {
       points.value = store.getLastVote();
       orderPlayers.value = story.value.players;
     
    });

    return {
      t,
      sprint,
      story,
      player,
      orderPlayers,
      canShowSprint,
      points,
      showPoints,
      deletePlayer,
      selectCard,
      clearVotes
    };
  },
};
</script>
<style lang="">
</style>