<template lang="">
    <div class="card">
        <a
          class="btn btn-primary"
          @click="showNewStory = ! showNewStory"
          >+ Historia
        </a>
        <template v-if="showNewStory || !stories">
        <label>Título *</label>
        <input type="text" v-model="newStory.title"/>
        <label>Url</label>
        <input type="text" v-model="newStory.url"/>
        <a class="btn " :class="newStory.title ? 'btn-primary' : 'btn-disabled'"  @click="createStoryAction">Crear</a>
        </template>
      </div>
</template>
<script>
import { computed, ref } from "vue";
import { useSprintStore } from "@/stores/sprint";

export default {
     name: "CreateStory",
     
  setup() {
    const showNewStory = ref(false);
    const newStory = ref({ title: "", url: "" });
    const store = useSprintStore();
    const stories = computed(()=>store.getStories)
    
    const createStoryAction = async () => {
      if(newStory.value.title){
        await store.createNewStory(newStory.value)
        showNewStory.value = false;
      }
    };
    return {
      showNewStory,
      newStory,
      createStoryAction,
      stories
    };
  },
};
</script>
<style lang="">
</style>