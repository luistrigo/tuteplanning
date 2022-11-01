<template lang="">
  <div>
    <div class="closed stories" v-for="(story, key, index) in stories" :key="index">
      <StoriesItem :storyId="key" :story="story"/>
    </div>
    <download-csv v-if="canEditSprint"
          class   = "btn btn-primary"
          :data   = "jssondata()"
          :name    = "fileName">
          Descargar CSV
      </download-csv>
  </div>
</template>
<script>
import { useSprintStore } from "@/stores/sprint";

import { computed,ref } from "vue";

import StoriesItem from "@/components/StoriesItem.vue"
export default {
  components:{StoriesItem},
  setup() {
    const store = useSprintStore();
    const sprint = computed(() => store.getSprint);
    const stories = computed(() => store.getStories);
    const voteAgain = async (storyId) => {
      await store.voteAgain(storyId);
    };
    const canEditSprint = computed(() => store.canEditSprint);
    
    const fileName = computed(()=>{
      if(!sprint.value){
        return "csv_file.csv";
      }
      return sprint.value.name + ".csv"
    })

    const jssondata =()=>{
      if(!stories.value){
        return [];
      }
     const storiesArr = Object.entries(stories.value).map(s =>{
      const [key, value] = s;
        return {
          sprint: sprint.value.name,
          sprint_date:sprint.value.date,
          name: value.title,
          ulr: value.url,
          score: value.score,
          date: value.date
        }
      })
      return storiesArr
    }

    return {fileName, jssondata,canEditSprint,voteAgain,stories };
  },
};
</script>
<style lang="">
</style>