<template lang="">
    <div class="sprint-share card">
          <h5>{{t("sprint_share")}}</h5>
          <div class="share-url">{{ rutaHistoria }}</div>
          <div class="sprint-container">
          <h3>{{t("sprint_label")}} {{ sprint.name }}</h3>
           <div class="edit-sprint" v-if="isCreator">
            <div v-if="!showEdit" @click="showEditSprint()" class="edit-data"><img src="/images/edit_light.png"/></div>
            <div  v-show="showEdit" @click="cancelEditSprint()" class="edit-data"><img src="/images/cancel.png"/></div>
            <div  v-show="showEdit" @click="saveSprint()" class="edit-data"><img src="/images/save.png"/></div>
          </div>
          </div>
         
          <div v-show="showEdit" class="card">

            <label>{{t("sprint_label")}}</label>
            <input type="text" v-model="oldValue.name"/>
            <div class="card">
            <label class="label-checkbox" for="only_creator_edit" >
              <span :class="oldValue.only_creator_edit === '1' ? '' :'text-bold'">{{t("sprint_message_only_creator")}}</span>
               / 
              <span :class="oldValue.only_creator_edit === '1' ? 'text-bold' : ''">{{t("sprint_message_anyone")}}</span>  
              <input id="only_creator_edit" type="checkbox" true-value="1" false-value="0" v-model="oldValue.only_creator_edit">
            </label>
            <label class="label-checkbox" for="only_creator_show" >
              <span :class="oldValue.only_creator_show === '1' ? '' : 'text-bold'">{{t("sprint_message_only_creator_show")}}</span>
               / 
              <span :class="oldValue.only_creator_show === '1' ? 'text-bold' : ''">{{t("sprint_message_anyone_show")}}</span>  
              <input id="only_creator_show" type="checkbox" true-value="1" false-value="0" v-model="oldValue.only_creator_show">
            </label>
          </div>
          </div>
        </div>
</template>
<script>
import { computed, ref } from "vue";
import { useSprintStore } from "@/stores/sprint";
import { useI18n } from "vue-i18n";

export default {
 
  component: "SprintInfo",
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    })
    const store = useSprintStore();
    const sprint = computed(() => store.getSprint);
    const id = store.getSprintId;
    const host = import.meta.env.VITE_HOST_NAME;
    const showEdit = ref(false);
    const canEditSprint = computed(() => store.canEditSprint);
    const isCreator = store.isCreator();

    const oldValue = ref({name:'',only_creator_edit:'0',only_creator_show:'0'})

    const rutaHistoria = computed(() => {
      return host+"?sprint=" + id;
    });

    const showEditSprint = () => {
     
      if(sprint.value){
        showEdit.value = true;
        oldValue.value.name = sprint.value.name
        oldValue.value.only_creator_edit = sprint.value.only_creator_edit ==1 ? '1' :'0'
        oldValue.value.only_creator_show = sprint.value.only_creator_show ==1 ? '1' :'0'
       
      }
    };
    const saveSprint = async () => {
        showEdit.value = false;
        await store.setSprintData(oldValue.value);
    };

    const cancelEditSprint =() => {
        showEdit.value = false;
        oldValue.value.name = sprint.value.name
        oldValue.value.only_creator_edit = sprint.value.only_creator_edit ==1 ? '1' :'0'
        oldValue.value.only_creator_show = sprint.value.only_creator_show ==1 ? '1' :'0'
    };

    return {
      t,
      sprint,
      rutaHistoria,
      showEdit,
      canEditSprint,
      isCreator,
      showEditSprint,
      cancelEditSprint,
      saveSprint,

      oldValue
    };
  },
};
</script>
<style lang="">
</style>