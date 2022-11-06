<template lang="">
    <div class="card tapete">
        <CardsLogo/>
        <label>{{t("player_name")}}</label>
        <input type="text" v-model="newPlayer" />
        <a
        class="btn"
        :class="newPlayer ? 'btn-primary' : 'btn-disabled'"
        @click="createPlayer"
        >{{t("player_create")}}
        </a>
        <h5 class="player-exists">{{playerExistsMessage}}</h5>
    </div>
</template>
<script>
import { ref } from "vue";
import CardsLogo from "@/components/CardsLogo.vue"
import { useSprintStore } from "@/stores/sprint";
import { useI18n } from "vue-i18n";
export default {
  name: "NewPlayer",
  components:{CardsLogo},
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    })
     const store = useSprintStore();
    const newPlayer = ref("");
    const playerExistsMessage = ref("");
    const createPlayer = async () => {
      playerExistsMessage.value = "";
      if (!store.playerExists(newPlayer.value)) {
        await store.createPlayer(newPlayer.value);
      } else {
        playerExistsMessage.value = t("player_exists",{"name":newPlayer.value});
      }
    };
    return {
      t,
      newPlayer,
      playerExistsMessage,
      createPlayer,
    };
  },
};
</script>
<style lang="">
</style>