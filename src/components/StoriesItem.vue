<template lang="">
    <div class="storie">
        <div class="story-name">
            <a class="link" v-if="story.url" :href="story.url" target="_blank">
                {{story.title}}
            </a>
            <span v-if="!story.url">
                {{story.title}}
            </span>
            <div class="edit-store" v-if="canEditSprint">
            <div  v-show="showEdit" @click="cancelEditStory()" class="edit-data"><img src="/images/cancel.png"/></div>
            <div  v-show="showEdit" @click="saveStory()" class="edit-data"><img src="/images/save.png"/></div>
            </div>

        </div>
        <div class="edit-story" v-show="showEdit">
          <label>{{t("story_title")}}</label>
          <input type="text" v-model="oldValue.title"/>
           <label>{{t("story_url")}}</label>
          <input type="text" v-model="oldValue.url"/>
          <label>{{t("story_score")}}</label>
          <input type="text" v-model="oldValue.score"/>
          </div>
        <div v-if="story.open===1" class="bg-accent text-white voting">{{t("story_voting")}}</div>
        <div v-if="story.open!==1 && canEditSprint">
            <a class="btn btn-primary" @click="voteAgain()">{{t("story_voteagain")}}</a>
        </div>
    </div>
    <div  class="score" v-if="canEditSprint">
      <div v-if="!showEdit" @click="showEdit = !showEdit" class="edit-score"><img src="/images/edit_light.png"/></div>
      <div class="fs-800 text-center">{{story.score ? story.score :"?"}}</div>
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


    return {t, canEditSprint, showEdit,oldValue, voteAgain, saveStory, cancelEditStory};
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
}

.score .edit-score {
  position: absolute;
  bottom: 5px;
  left: 5px;
  max-width: 15px;
  
}

.score input {
  width: 100%;
}
</style>