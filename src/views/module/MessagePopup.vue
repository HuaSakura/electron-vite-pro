<template>
  <div class="message-popup" v-if="ifShow" @click="close">
    <div class="message-popup-content">
      <div class="message-popup-content-icon">
        <div class="icon">
          <img src="../../assets/image/loadding.gif" alt=""/>
        </div>
      </div>
      <div class="message-popup-content-text">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: "MessagePopup",
  props: {
    maskClosable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const ifShow = ref(false)
    const message = ref('')

    function operate(type: boolean, msg: string) {
      ifShow.value = type
      message.value = msg
    }

    function close(event: any) {
      if (props.maskClosable) {
        if (event.target.classList.contains('message-popup')) {
          ifShow.value = false
          message.value = ''
        }
      }
    }

    return {
      ifShow,
      message,
      operate,
      close
    }
  }
})
</script>

<style scoped lang="sass">
.message-popup
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.7)
  color: #fff
  z-index: 9999
  display: flex
  align-items: center
  justify-content: center

  .message-popup-content
    width: 60VW
    height: 28VW
    background-color: rgba(255, 255, 255, 0.8)
    border-radius: 20px

    .message-popup-content-icon
      width: 100%
      height: 50%
      display: flex
      justify-content: center
      align-items: flex-end

      .icon
        width: 122px
        height: 122px
        background-color: #3679CF
        border-radius: 46px
        display: flex
        align-items: center
        justify-content: center

        img
          width: 110px
          height: 110px

    .message-popup-content-text
      width: 100%
      height: 50%
      display: flex
      justify-content: center
      align-items: center
      font-size: 64px
      font-weight: bold
      color: #3679CF

</style>