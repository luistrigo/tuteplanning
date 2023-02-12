<template>
  <div class="container">
    <div class="nav-home"></div>
    <div class="main">
      <div v-if="routeSprint">
        <SprintInfo />
        <New-Player v-if="!player" />
      </div>
      <div class="board">
      <div v-if="routeSprint && stories">
        <OpenStory />
      </div>
      <div v-else>
       {{t("no_stories")}} 
      </div>
    </div>
    </div>
   
    <div class="right-menu stories-container" v-if="player">
      <CreateStory v-if="canEditSprint" :player="player" />
      <StoriesList />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { ref as ref_db, onValue } from "firebase/database";
import { db } from "../firebase";
import { useI18n } from "vue-i18n";

import { useSprintStore } from "@/stores/sprint";
import SprintInfo from "../components/SprintInfo.vue";
import CreateStory from "../components/CreateStory.vue";
import StoriesList from "../components/StoriesList.vue";
import NewPlayer from "../components/NewPlayer.vue";
import OpenStory from "../components/OpenStory.vue";


export default {
  name: "HomeView",
  components: { CreateStory, StoriesList, SprintInfo, NewPlayer, OpenStory },
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    })
    const routeSprint = ref("");
   
    const sprint = ref({});

    const store = useSprintStore();
    const player = computed(() => store.getPlayer);
    const stories = computed(() => store.getStories);
    
    let id = store.getSprintId;

    const canEditSprint = computed(() => store.canEditSprint);

    const starCountRef = ref_db(db, "/sprints/" + id);
    onValue(starCountRef, async (snapshot) => {
      const data = snapshot.val();
      
      store.setSprint(data);

      setTimeout(function(){
        setPlayer()
      },300)
      
    });

    const setPlayer = async () =>{
      let points = "";
      const openStory = store.open();
      if (openStory && openStory.storyId) {
        points = store.getLastVote();
      } else {
        store.setTempPoints("");
        return;
      }
      
      let exists = false;
      let pointsdb = "";
      const storyShow = openStory.story.show ? openStory.story.show : false;

      if (openStory.story.players) {
        Object.entries(openStory.story.players).forEach((p) => {
          const [playerArr, data] = p;
          if (playerArr === player.value) {
            exists = true;
            pointsdb = data.points;
          }
        });
      }

      if (!exists) {
        await store.createPlayer(player.value);
      }
      if (storyShow && pointsdb !== points) {
        await store.sendVote(points);
      }
      if(!storyShow && pointsdb === "-"){
        await store.setTempPoints("");
      }
    }

    onMounted(async () => {
      if (id) {
        sprint.value = await store.sprintExists(id);
        store.setSprint(sprint.value);
        const host = import.meta.env.VITE_HOST_NAME;
        routeSprint.value = host+"?sprint=" + id;
      }
    });

    return {
      t,
      sprint,
      stories,
      routeSprint,
      player,
      canEditSprint,
    };
  },
};
</script>