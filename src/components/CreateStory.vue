<template lang="">
    <div class="card">
        <a
          class="btn btn-primary"
          @click="showNewStory = ! showNewStory"
          >{{t("story_new")}}
        </a>
        <download-csv v-if="canEditSprint"
          class   = "btn btn-primary"
          :data   = "jssondata()"
          :name    = "fileName">
          {{t("download_csv")}}
      </download-csv>
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
    const stories = computed(()=>store.getStories);
    const sprint = computed(() => store.getSprint);
    const canEditSprint = computed(() => store.canEditSprint);
    
    const createStoryAction = async () => {
      if(newStory.value.title){
        await store.createNewStory(newStory.value)
        showNewStory.value = false;
        newStory.value = { title: "", url: "" };
      }
    };

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


    return {
      showNewStory,
      newStory,
      createStoryAction,
      stories,
      jssondata,
      fileName,
      canEditSprint,
      t
    };
  },
};
</script>
<style lang="">
</style>