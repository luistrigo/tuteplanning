<template lang="">
<div class="open stories tapete" v-if="stories && player">
    <Cards @selectCard="selectCard"  :points_style="sprint.cards"/>
    <ul>
        <li v-for="(story, key, index) in stories" :key="index">
            <template v-if="story.open === 1">
            <div>
                <div class="story-title">
                    <div class="story-name">
                        <span v-if="!story.url">{{ story.title }}</span>
                        <a class="link-light" v-if="story.url" :href="story.url"> {{ story.title}}</a>
                    </div>
                    <a v-if="canEditSprint" class="btn btn-primary" @click="showPoints(story.show)">
                        {{story.show ? "Ocultar puntos" : "Ver Puntos"}}
                    </a>
                </div>
                <ul>
                    <li
                    :class="key === player ? 'myself' : ''"
                    class="player"
                    v-for="(player_s, key, index) in story.players"
                    :key="index"
                    >
                    <div class="player-name">{{ key }}</div>
                    <div v-if="player_s.voted === 0">?</div>
                    <div v-if="player_s.voted === 1">
                        <span v-if="key === player">{{ points }}</span>
                        <span v-if="key !== player && !story.show">si</span>
                        <span v-if="key !== player && story.show">{{player_s.points}}</span>
                    </div>
                    <div class="trash-player">
                        <a @click="deletePlayer(key)" v-if="canEditSprint && key !== player">
                        <img src="/images/trash.png" style="height:30px"/>
                        </a>
                    </div>
                    </li>
                </ul>
            </div>
            </template>
        </li>
    </ul>
         </div>
</template>
<script>
import { useSprintStore } from "@/stores/sprint";
import { computed, onMounted, ref } from "vue";
import Cards from "../components/Cards.vue";
import { getLastVote } from "../helpers/index";
export default {
  name: "OpenStory",
  components: { Cards },
  setup() {
    const store = useSprintStore();
    const sprint = computed(() => store.getSprint);
    const stories = computed(() => store.getStories);
    const player = computed(() => store.getPlayer);
    const points = ref("");
    const canEditSprint = computed(() => store.canEditSprint);

    const showPoints = async (show) => {
      store.showPoints(show);
    };

    const selectCard = async (card) => {
      try {
        store.setTempPoints(card);
        points.value = card;
        await store.sendVote(card);
      } catch (e) {
        console.log(e);
      }
    };

    const deletePlayer = async (player) => {
      try {
        await store.deletePlayer(player);
      } catch (e) {
        console.log(e);
      }
    };

    onMounted(() => {
      const openStory = store.open();
      if (openStory) {
        points.value = getLastVote(openStory.storyId);
      }
    });

    return {
      sprint,
      stories,
      player,
      canEditSprint,
      points,
      showPoints,
      deletePlayer,
      selectCard,
    };
  },
};
</script>
<style lang="">
</style>