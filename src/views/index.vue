<template>
  <div class="index">
    <div class="index-content">
      <div class="index-content-logo">
        <img src="../assets/image/logo.png" alt=""/>
      </div>
      <div class="index-content-text">
        <span>欢迎使用自助计量终端服务</span>
      </div>
      <div class="index-content-button">
        <div class="index-content-button-img" @click="CreditCard"></div>
      </div>
    </div>
    <MessagePopup ref="MessagePopupRef" :mask-closable="true"></MessagePopup>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import MessagePopup from "./module/MessagePopup.vue";
import {initws} from "../utils/ws.ts";

export default defineComponent({
  name: "index",
  components: {
    MessagePopup
  },
  setup() {
    const router = useRouter();
    const MessagePopupRef = ref<any>(null)

    onMounted(() => {
      initws((resp: any) => {
        console.log(resp)
      })
    })

    function CreditCard() {
      RouteRedirects()
    }

    function RouteRedirects() {
      MessagePopupRef.value.operate(true, '加载中，请稍候...')
      setTimeout(() => {
        MessagePopupRef.value.operate(false, '')
        router.push({path: '/faceCollection'})
      }, 1000)
    }


    return {
      CreditCard,
      MessagePopupRef
    }
  }
})
</script>

<style scoped lang="sass">
@mixin disconnect
  display: flex
  justify-content: center
  align-items: center

.index
  width: 100vw
  height: 100vh

  .index-content
    width: 100vw
    height: 100vh
    display: flex
    flex-direction: column
    justify-content: center

    .index-content-logo
      width: 100vw
      @include disconnect

      img
        width: 165px
        height: 165px

    .index-content-text
      width: 100vw
      padding-top: 30px
      padding-bottom: 30px
      @include disconnect

      span
        font-size: 48px
        font-weight: bold

    .index-content-button
      width: 100vw
      margin-top: 80px
      @include disconnect

      .index-content-button-img
        width: 400px
        height: 220px
        background-image: url("../assets/image/cardInquire.png")
        background-size: cover

        &:active
          background-color: rgba(255, 255, 255, 0.5)
          border-radius: 20px

</style>