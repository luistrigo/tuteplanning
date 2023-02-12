<template lang="">
  <div>
    <div class="closed stories" v-for="(story, key, index) in order_stories" :key="key">
      <StoriesItem :storyId="key" :story="story"/>
    </div>
  </div>
</template>
<script>
import { useSprintStore } from "@/stores/sprint";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

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

    return {t,canEditSprint,voteAgain,order_stories };
  },
};
</script>
<style lang="">
</style>