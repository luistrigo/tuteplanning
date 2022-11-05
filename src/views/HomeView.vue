<template>
  <div class="container">
    <div class="nav-home"></div>
    <div class="main-info">
      <div v-if="routeSprint">
        <SprintInfo />
        <New-Player v-if="!player" />
      </div>
    </div>
    <div class="main">
      <div v-if="routeSprint && stories">
        <OpenStory />
      </div>
      <div v-else>
        Aún no se ha creado una historia
      </div>
    </div>
    <div class="right-menu stories-container" v-if="player">
      <CreateStory v-if="canEditSprint" :player="newPlayer" />
      <StoriesList />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { ref as ref_db, onValue } from "firebase/database";
import { db } from "../firebase";

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
    const routeSprint = ref("");
    const newPlayer = ref("");
   
    const sprint = ref({});

    const store = useSprintStore();
    const player = computed(() => store.getPlayer);
    const stories = computed(() => store.getStories);
    newPlayer.value = player.value ? player.value : "";
    let id = store.getSprintId;

    const canEditSprint = computed(() => store.canEditSprint);

    const starCountRef = ref_db(db, "/sprints/" + id);
    onValue(starCountRef, async (snapshot) => {
      const data = snapshot.val();
      
      store.setSprint(data);
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
          const [player, data] = p;
          if (player === newPlayer.value) {
            exists = true;
            pointsdb = data.points;
          }
        });
      }

      if (!exists) {
        await store.createPlayer(newPlayer.value);
      }
      if (storyShow && pointsdb !== points) {
        store.sendVote(points);
      }
    });

    onMounted(async () => {
      if (id) {
        sprint.value = await store.sprintExists(id);
        store.setSprint(sprint.value);
        const host = import.meta.env.VITE_HOST_NAME;
        routeSprint.value = host+"?sprint=" + id;
      }
    });

    return {
      newPlayer,
      sprint,
      stories,
      routeSprint,
      player,
      canEditSprint,
    };
  },
};
</script>