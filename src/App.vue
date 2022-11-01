<template>
<div>
    <div class="nav">
      <div>
      <h3>
          {{title_app}} 
      </h3>
      <a class="link-light" href="https://github.com/luistrigo/tuteplanning">Luis Trigo</a>
      </div>
      <a class="btn btn-primary" @click="newSprint">Nuevo sprint</a>
      <a href="https://github.com/luistrigo/tuteplanning"><img src="/images/GitHub-Mark-Light-32px.png"/></a>
    </div>
    <router-view />
</div>
</template>
<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSprintStore } from "./stores/sprint";
import { RouterView } from "vue-router";
export default {
  name: "App",
  data() {
    return {
      title_app: import.meta.env.VITE_APP_TITLE
    };
  },
  components: {
    RouterView,
  },
  setup() {
    const store = useSprintStore();
    const router = useRouter();
    let sprintId = store.getSprintId;

    const newSprint = () => {
      router.push({ name: "sprint" });
    };

    onMounted(async () => {
      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("sprint")) {
        sprintId = urlParams.get("sprint");
      }
      
      if(sprintId){
        const exist = await store.sprintExists(sprintId)
        if(exist){
          store.setSprintId(sprintId);
          router.push({name:"home"});
        }
      }else{
          router.push({name:"sprint"});
      }
    });

    return { newSprint }
  },
};
</script>