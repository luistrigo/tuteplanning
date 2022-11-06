<template>
  <div>
    <div class="nav">
      <div>
        <h3>
          {{ title_app }}
        </h3>
        <a class="link-light" href="https://github.com/luistrigo/tuteplanning">
          Luis Trigo
        </a>
      </div>
      <div class="nav-menu">
        <a class="btn btn-primary" @click="newSprint">{{ t("new_sprint") }}</a>
        <select v-model="locale" @change="setLocale">
          <option value="en">en</option>
          <option value="es">es</option>
        </select>
        <a href="https://github.com/luistrigo/tuteplanning"
          ><img src="/images/GitHub-Mark-Light-32px.png"
        /></a>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSprintStore } from "./stores/sprint";
import { useLanguageStore } from "./stores/language";
import { RouterView } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "App",
  data() {
    return {
      title_app: import.meta.env.VITE_APP_TITLE,
    };
  },
  components: {
    RouterView,
  },
  setup() {
    const { t, locale } = useI18n({
      inheritLocale: true,
      useScope: "global",
    });

    const router = useRouter();
    const store = useSprintStore();
    const languageStore = useLanguageStore();
    
    //set locale from browser
    languageStore.setLocale();
    const setLocale = () => {
      //set locale from user selection
      languageStore.setLocale(locale.value);
    };

    let sprintId = store.getSprintId;

    const newSprint = () => {
      router.push({ name: "sprint" });
    };

    onMounted(async () => {
      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("sprint")) {
        sprintId = urlParams.get("sprint");
      }

      if (sprintId) {
        const exist = await store.sprintExists(sprintId);
        if (exist) {
          store.setSprintId(sprintId);
          router.push({ name: "home" });
        }
      } else {
        router.push({ name: "sprint" });
      }
    });

    return { t, setLocale, locale, newSprint };
  },
};
</script>