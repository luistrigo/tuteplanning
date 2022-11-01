<template lang="">
    <div v-if="!player" class="card tapete">
        <CardsLogo/>
        <label>Nombre del Jugador</label>
        <input type="text" v-model="newPlayer" />
        <a
        class="btn"
        :class="newPlayer ? 'btn-primary' : 'btn-disabled'"
        @click="createPlayer"
        >Crear un jugador
        </a>
        <h5 class="player-exists">{{playerExistsMessage}}</h5>
    </div>
</template>
<script>
import { ref } from "vue";
import CardsLogo from "@/components/CardsLogo.vue"
import { useSprintStore } from "@/stores/sprint";
export default {
  name: "CreatePlayer",
  components:{CardsLogo},
  setup() {
     const store = useSprintStore();
    const newPlayer = ref("");
    const playerExistsMessage = ref("");
    const createPlayer = async () => {
      playerExistsMessage.value = "";
      if (!store.playerExists(newPlayer.value)) {
        await store.createPlayer(newPlayer.value);
      } else {
        playerExistsMessage.value = `El jugador ${newPlayer.value} ya existe, si eres tu, pide al creador de la historia que te borre para crearlo de nuevo`;
      }
    };
    return {
      newPlayer,
      playerExistsMessage,
      createPlayer,
    };
  },
};
</script>
<style lang="">
</style>