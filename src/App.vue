<script lang="ts">
import {defineComponent} from "vue";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "App",
  setup() {

    const router = useRouter();

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        router.push({path: '/setting'})
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        router.push({path: '/index'})
      }
    });

    return {}
  }
})
</script>

<template>
  <div class="app">
    <router-view/>
  </div>
</template>

<style scoped lang="sass">
.app
  width: 100vw
  height: 100vh
  background-image: url("./assets/image/background.png")
  background-size: cover
</style>
