<template lang="">
    <div class="card">
        <a
          class="btn btn-primary"
          @click="showNewStory = ! showNewStory"
          >{{t("story_new")}}
        </a>
        <template v-if="showNewStory || !stories">
        <label>{{t("story_title")}}</label>
        <input type="text" v-model="newStory.title"/>
        <label>{{t("story_url")}}</label>
        <input type="text" v-model="newStory.url"/>
        <a class="btn " :class="newStory.title ? 'btn-primary' : 'btn-disabled'"  @click="createStoryAction">{{t("strory_create")}}</a>
        </template>
      </div>
</template>
<script>
import { computed, ref } from "vue";
import { useSprintStore } from "@/stores/sprint";
import { useI18n } from "vue-i18n";

export default {
     name: "CreateStory",
     
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    })
    const showNewStory = ref(false);
    const newStory = ref({ title: "", url: "" });
    const store = useSprintStore();
    const stories = computed(()=>store.getStories)
    
    const createStoryAction = async () => {
      if(newStory.value.title){
        await store.createNewStory(newStory.value)
        showNewStory.value = false;
        newStory.value = { title: "", url: "" };
      }
    };
    return {
      showNewStory,
      newStory,
      createStoryAction,
      stories,
      t
    };
  },
};
</script>
<style lang="">
</style>