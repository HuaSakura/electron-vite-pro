<template>
  <div class="index">
    <div class="index-left">

    </div>
    <div class="index-right">

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';

export default defineComponent({
  name: "index",
  setup() {
    //@ts-ignore
    const router = useRouter();
    const MessagePopupRef = ref<any>(null)

    onMounted(() => {

    })

    function CreditCard() {

    }

    return {
      CreditCard,
      MessagePopupRef
    }
  }
})
</script>

<style scoped lang="less">
.index{
  width: 100vw;
  height: 100vh;
  background-color: #343434;

  .index-left{
    width: 7.6vw;
    height: 100vh;
    background-color: #191919;
  }
}

</style>