<template lang="">
  <div>
    <div class="closed stories" v-for="(story, key, index) in order_stories" :key="key">
      <StoriesItem :storyId="key" :story="story"/>
    </div>
    <download-csv v-if="canEditSprint"
          class   = "btn btn-primary"
          :data   = "jssondata()"
          :name    = "fileName">
          {{t("download_csv")}}
      </download-csv>
  </div>
</template>
<script>
import { useSprintStore } from "@/stores/sprint";
import { useI18n } from "vue-i18n";
import { computed,ref } from "vue";
import { query, orderBy, limit } from "firebase/firestore"; 

import StoriesItem from "@/components/StoriesItem.vue"
export default {
  components:{StoriesItem},
  setup() {
    const { t, locale } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    })
    const store = useSprintStore();
    const sprint = computed(() => store.getSprint);
    const stories = computed(() => store.getStories);
    const voteAgain = async (storyId) => {
      await store.voteAgain(storyId);
    };
    const canEditSprint = computed(() => store.canEditSprint);

    const order_stories = computed(()=> {
      if(stories.value){
        const order = Object.fromEntries(Object.entries(stories.value)
          .sort(([,a],[,b]) => {
          return ((a.date.toLowerCase()< b.date.toLowerCase()) ? 1 : ((a.date.toLowerCase() > b.date.toLowerCase()) ? -1 : 0));
          }))
          
        return order
      }
      return [];
    });
    
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

    return {t,fileName, jssondata,canEditSprint,voteAgain,order_stories };
  },
};
</script>
<style lang="">
</style>