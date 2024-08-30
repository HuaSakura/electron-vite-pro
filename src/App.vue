<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusOutlined,
  PushpinFilled,
  PushpinOutlined
} from "@ant-design/icons-vue"
import {useMouse, useMousePressed, watchPausable} from "@vueuse/core";

export default defineComponent({
  name: "App",
  components: {
    PushpinFilled,
    MinusOutlined,
    CloseOutlined,
    PushpinOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined
  },
  setup() {
    const route = useRoute();
    const FullScreenType = ref(true as boolean);
    const TopType = ref(true as boolean);
    const titleBar = ref(null as any);
    const {pressed} = useMousePressed({target: titleBar})
    const {x, y} = useMouse({touch: false})

    onMounted(() => {
      pause()
    })

    watch(() => pressed.value, (newValue) => {
      if (newValue == true) {
        resume()
      } else if (newValue == false) {
        pause()
      }
    })

    const {pause, resume} = watchPausable(x, () => {
      console.log(x.value, y.value)
    })

    function FullScreen() {
      FullScreenType.value = !FullScreenType.value;
    }

    function TopOperation() {
      TopType.value = !TopType.value;
    }

    return {
      route,
      TopType,
      titleBar,
      FullScreen,
      TopOperation,
      FullScreenType
    }
  }
})
</script>

<template>
  <div class="app">
    <div class="window-operate">
      <div ref="titleBar" class="window-operate-left"></div>
      <div class="window-operate-right">
        <div class="window-operate-icon" @click="TopOperation">
          <PushpinOutlined v-if="TopType"/>
          <PushpinFilled v-else/>
        </div>
        <div class="window-operate-icon">
          <MinusOutlined/>
        </div>
        <div class="window-operate-icon" @click="FullScreen">
          <FullscreenOutlined v-if="FullScreenType"/>
          <FullscreenExitOutlined v-else/>
        </div>
        <div class="window-operate-icon close">
          <CloseOutlined/>
        </div>
      </div>
    </div>
    <router-view :key="route.fullPath"/>
  </div>
</template>

<style scoped lang="less">
.app {
  width: 100vw;
  height: 100vh;

  .window-operate {
    display: flex;
    top: 0;
    position: fixed;
    width: 100vw;
    height: 36px;
    z-index: 5000;

    .window-operate-left {
      width: 80%;
    }

    .window-operate-right {
      display: flex;
      width: 20%;

      &:hover {
        .window-operate-icon {
          .anticon {
            font-size: 14px;
            font-weight: bold;
            color: #eee;
          }
        }
      }

      .window-operate-icon {
        width: 25%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        .anticon {
          font-size: 14px;
          font-weight: bold;
          color: #888888;
        }

        &:hover {
          background-color: #4b4b4b;
        }

        &:active {
          background-color: #242424;
        }
      }

      .close {
        &:hover {
          background-color: #ff5d5d;
        }

        &:active {
          background-color: #FF0000;
        }
      }
    }
  }
}

</style>
