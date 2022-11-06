<template lang="">
    <div class="sprint-share card">
          <h5>{{t("sprint_share")}}</h5>
          <div class="share-url">{{ rutaHistoria }}</div>
          <div class="sprint-container">
          <h3>{{t("sprint_label")}} {{ sprint.name }}</h3>
           <div class="edit-sprint" v-if="canEditSprint">
            <div v-if="!showEdit" @click="showEditSprint()" class="edit-data"><img src="/images/edit_light.png"/></div>
            <div  v-show="showEdit" @click="cancelEditSprint()" class="edit-data"><img src="/images/cancel.png"/></div>
            <div  v-show="showEdit" @click="saveSprint()" class="edit-data"><img src="/images/save.png"/></div>
          </div>
          </div>
         
          <div v-show="showEdit">
            <label>{{t("sprint_label")}}</label>
            <input type="text" v-model="oldValue.name"/>
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

    const oldValue = ref({name:''})

    const rutaHistoria = computed(() => {
      return host+"?sprint=" + id;
    });

    const showEditSprint = () => {
     
      if(sprint.value){
        showEdit.value = true;
        oldValue.value.name = sprint.value.name
       
      }
    };
    const saveSprint = async () => {
      if(oldValue.value.name){
        showEdit.value = false;
        await store.setSprintData(oldValue.value);
      }
    };

    const cancelEditSprint =() => {
        showEdit.value = false;
        oldValue.value.name = sprint.value.name
    };

    return {
      t,
      sprint,
      rutaHistoria,
      showEdit,
      canEditSprint,
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