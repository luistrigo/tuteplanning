<template lang="">
    <div class="storie">
        <div class="story-name" v-show="!showEdit">
            <a class="link" v-if="story.url" :href="story.url" target="_blank">
                {{story.title}}
            </a>
            <span v-if="!story.url">
                {{story.title}}
            </span>
        </div>
        <div class="edit-story" v-show="showEdit">
          <label>{{t("story_title")}}</label>
          <input type="text" v-model="oldValue.title"/>
           <label>{{t("story_url")}}</label>
          <input type="text" v-model="oldValue.url"/>
          <label>{{t("story_score")}}</label>
          <input type="text" v-model="oldValue.score"/>
          <div class="edit-story-buttons" v-if="canEditSprint">
            <div @click="cancelEditStory()" class="btn btn-primary-light">{{t("cancel")}}</div>
            <div @click="saveStory()" class="btn btn-primary">{{t("save")}}</div>
            </div>
          </div>
        <div v-if="story.open===1" class="bg-accent text-white voting">{{t("story_voting")}}</div>
        <div v-if="story.open!==1 && canShowSprint">
            <a class="btn btn-primary" @click="voteAgain()">{{t("story_voteagain")}}</a>
        </div>
    </div>
    <div  class="score" v-if="canEditSprint">
      <div class="fs-800 text-center">{{story.score ? story.score :"?"}}</div>
      <div v-if="!showEdit" @click="showEdit = !showEdit" class="edit-data btn btn-primary"><img src="/images/edit_light.png"/></div>
    </div>
    <div  class="score" v-if="!canEditSprint">
      <div class="fs-800 text-center">{{story.score ? story.score :"?"}}</div>
    </div>
</template>
<script>
import { useSprintStore } from "@/stores/sprint";
import { ref,computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "StoriesItem",
  props: {
    story: Object,
    canEditSprint: Boolean,
    storyId: String,
  },
  setup(props) {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    })
    const store = useSprintStore();
    const showEdit = ref(false);
    const canEditSprint = computed(() => store.canEditSprint);
    const canShowSprint = computed(() => store.canShowSprint);
    const oldValue = ref( {
      title: props.story.title,
      url: props.story.url,
      score:props.story.score
    })

    const voteAgain = async () => {
      await store.voteAgain(props.storyId);
    };

    const saveStory = async () => {
      if(oldValue.value.title){
        showEdit.value = false;
        await store.setScore(props.storyId, oldValue.value.score);
        await store.setStory(props.storyId, oldValue.value);
      }
    };

    const cancelEditStory = () => {
        showEdit.value = false;
        oldValue.value.title = props.story.title
        oldValue.value.url = props.story.url
        oldValue.value.score = props.story.score
    };


    return {t, canEditSprint,canShowSprint, showEdit,oldValue, voteAgain, saveStory, cancelEditStory};
  },
};
</script>
<style>


.score {
  position: relative;
  padding: 5px;
  background-color: hsl(var(--clr-dark-secondary));
  color: hsl(var(--clr-white));
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.score .edit-score {
  text-align: center;
}

.score input {
  width: 100%;
}
</style>