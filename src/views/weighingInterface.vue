<template>
  <div class="weighingInterface">
    <div class="weighingInterface-header">
      <div class="weighingInterface-header-left">
        <span>欢迎使用自助计量终端服务</span>
      </div>
      <div class="weighingInterface-header-right">
        <span>{{ date }}</span>
      </div>
    </div>
    <div class="weighingInterface-content">
      <div class="weighingInterface-content-left">
        <div class="weighingInterface-content-left-top">
          <div class="weighingInterface-content-title">
            <img src="../assets/image/icon.png" alt="">
            <span>承运人信息</span>
          </div>
          <div class="weighingInterface-content-info">
            <div class="div-from">
              <div class="div-label">姓名<span></span></div>
              <div>:</div>
              <div class="div-value">粮小宝</div>
            </div>
            <div class="div-from">
              <div class="div-label">车船号<span></span></div>
              <div>:</div>
              <div class="div-value">鲁A12345</div>
            </div>
            <div class="div-from">
              <div class="div-label">手机号<span></span></div>
              <div>:</div>
              <div class="div-value">13180000000</div>
            </div>
          </div>
          <div class="weighingInterface-content-footer">
            <div class="footer-title">
              <span>客户名称</span>
            </div>
            <div class="footer-info">
              <span>安徽省凤宝粮油食品有限公司</span>
            </div>
          </div>
        </div>
        <div class="weighingInterface-content-left-btm">
          <div class="weighingInterface-content-title">
            <img src="../assets/image/icon.png" alt="">
            <span>实时重量</span>
          </div>
          <div class="weighingInterface-content-Num">
            <div>0000000</div>
          </div>
        </div>
      </div>
      <div class="weighingInterface-content-right">
        <div class="weighingInterface-content-right-top">
          <div class="weighingInterface-content-title">
            <img src="../assets/image/icon.png" alt="">
            <span>粮食信息</span>
          </div>
          <div class="weighingInterface-content-info">
            <div class="first-div">
              <div class="first-div-label">业务单号:</div>
              <div class="first-div-value">14240710001</div>
            </div>
            <div class="second-div">
              <div class="second-div-left">
                <div class="second-div-label">业务类型:</div>
                <div class="second-div-value">入库</div>
              </div>
              <div class="second-div-right">
                <div class="second-div-label">粮食品种:</div>
                <div class="second-div-value">小麦</div>
              </div>
            </div>
            <div class="second-div">
              <div class="second-div-left">
                <div class="second-div-label">毛重(KG):</div>
                <div class="second-div-value">99000.00</div>
              </div>
              <div class="second-div-right">
                <div class="second-div-label">皮重(KG):</div>
                <div class="second-div-value">19000.00</div>
              </div>
            </div>
            <div class="second-div">
              <div class="second-div-left">
                <div class="second-div-label">扣重(KG):</div>
                <div class="second-div-value">-1000.00</div>
              </div>
              <div class="second-div-right">
                <div class="second-div-label">净重(KG):</div>
                <div class="second-div-value">79000.00</div>
              </div>
            </div>
          </div>
        </div>
        <div class="weighingInterface-content-right-btm">
          <div class="cameraDataLeft">
            <img :src="'data:image/jpg;base64,'+faceData" alt="">
          </div>
          <div class="cameraDataRight">
            <img :src="'data:image/jpg;base64,'+faceData" alt="">
          </div>
          <div class="faceData">
            <img :src="'data:image/jpg;base64,'+faceData" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="weighingInterface-footer">
      <div class="weighingInterface-footer-content">
        <div class="text">
          <ExclamationCircleFilled/>
          请核对计量数据，无误后点击确认按钮。30秒后将自动保存并返回
        </div>
        <div class="btn">
          <div class="enter-button" @click="enterFun">
            <span>确认</span>
          </div>
          <div class="exit-button" @click="exitFun">
            <span>取消</span>
          </div>
        </div>
      </div>
    </div>
    <audio id="ngmAudio" style="height: 0;width: 0;">
      <source src="../assets/music/ngm.mp3" type="audio/mpeg">
    </audio>
    <MessagePopup ref="MessagePopupRef" :mask-closable="true"></MessagePopup>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onBeforeUnmount, ref} from 'vue'
import dayjs from "dayjs";
import {useRouter} from "vue-router";
import {ExclamationCircleFilled} from "@ant-design/icons-vue";
import MessagePopup from "./module/MessagePopup.vue";

export default defineComponent({
  name: "weighingInterface",
  components: {
    MessagePopup,
    ExclamationCircleFilled
  },
  setup() {
    const router = useRouter();
    const MessagePopupRef = ref<any>(null)

    let timer: any;
    var clickCount: number = 0;
    const date: any = ref('0000-00-00 00:00:00')

    const faceData: any = ref('')

    onMounted(() => {
      faceData.value = sessionStorage.getItem('faceData') ? sessionStorage.getItem('faceData') : ''
      getCamera()
      timer = setInterval(() => {
        date.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    })

    onBeforeUnmount(() => {
      clearInterval(timer)
      sessionStorage.removeItem('faceData')
    })

    function getCamera() {

    }

    // function Screenshot() {
    //   let video: any = document.getElementById(`video`);
    //   let canvas: any = document.createElement("canvas");
    //   video.crossOrigin = 'anonymous';
    //   canvas.width = 330;
    //   canvas.height = 360;
    //   canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    //   let imageData = canvas.toDataURL("image/jpeg", 0.2).split(',');
    //   if (imageData[1] != '') {
    //     console.log('截图成功', 'data:image/jpg;base64,' + imageData[1])
    //   }
    // }

    function enterFun() {
      clickCount++;
      if (clickCount >= 2) {
        clickCount = 0
        let audio: any = document.getElementById("ngmAudio")
        audio.volume = 0.8
        audio.play()
      } else {
        //Screenshot()
        RouteRedirects()
      }
    }

    function exitFun() {
      router.go(-1)
    }

    function RouteRedirects() {
      MessagePopupRef.value.operate(true, '加载中，请稍候...')
      setTimeout(() => {
        MessagePopupRef.value.operate(false, '')
        router.push({path: '/index'})
      }, 1000)
    }

    return {
      date,
      getCamera,
      enterFun,
      exitFun,
      faceData,
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

.weighingInterface
  width: 100vw
  height: 100vh

  .weighingInterface-header
    @include disconnect
    width: 100%
    height: 12vh

    .weighingInterface-header-left
      width: 50%
      height: 100%
      position: relative

      span
        position: absolute
        left: 8%
        bottom: 0
        font-size: 48px
        font-weight: bold

    .weighingInterface-header-right
      width: 50%
      height: 100%
      position: relative

      span
        position: absolute
        bottom: 0
        right: 8%
        font-size: 26px

  .weighingInterface-content
    @include disconnect
    width: 100%
    height: 73vh

    .weighingInterface-content-title
      display: flex
      align-items: center
      margin: 10px 20px

      span
        font-size: 26px
        font-weight: bold
        margin-left: 10px
        text-shadow: 0 0 4px rgba(26, 89, 172, 1)

    .weighingInterface-content-Num
      position: relative
      display: flex
      align-items: center
      justify-content: center
      margin: 0 20px
      color: #3A78C7
      min-height: 13vh
      border-radius: 20px
      background-color: white

      div
        position: absolute
        height: unset
        font-size: 96px
        font-weight: 700
        font-family: 'DS-DIGIT', serif

    .weighingInterface-content-left
      position: relative
      width: 35%
      height: 68vh
      display: flex
      flex-direction: column

      .weighingInterface-content-left-top
        position: relative
        width: 100%
        height: 60%
        border-radius: 20px
        background-image: url("../assets/image/cyr.png")
        background-size: cover
        background-position: center bottom
        background-repeat: no-repeat

      .weighingInterface-content-left-btm
        position: relative
        width: 100%
        height: 35%
        border-radius: 20px
        margin-top: 25px
        background-color: rgba(255, 255, 255, 0.6)

      .weighingInterface-content-info
        display: flex
        flex-direction: column
        margin-left: 30px
        margin-right: 30px

        .div-from
          width: 75%
          height: 46px
          display: flex
          align-items: flex-end
          border-bottom: 1px solid rgba(255, 255, 255, 0.4)

          div
            color: black
            font-size: 20px
            font-weight: 600

          .div-label
            width: 25%
            height: 31px
            color: black
            font-size: 20px
            font-weight: 600
            text-align: justify

            span
              padding-left: 100%
              display: inline-block

          .div-value
            width: 60%
            color: black
            font-size: 20px
            font-weight: 600
            margin-left: 20px

      .weighingInterface-content-footer
        position: absolute
        bottom: 0
        height: 100px
        margin: 0 30px

        .footer-title
          span
            font-size: 24px
            font-weight: bold
            text-shadow: 0 0 4px rgba(26, 89, 172, 1)

        .footer-info
          margin-top: 16px

          span
            color: black
            font-size: 20px
            font-weight: bold

    .weighingInterface-content-right
      position: relative
      width: 55%
      height: 68vh
      margin-left: 2%
      display: flex
      flex-direction: column

      .weighingInterface-content-right-top
        position: relative
        width: 100%
        height: 60%
        border-radius: 20px
        background-color: rgba(255, 255, 255, 0.6)

        .weighingInterface-content-info
          display: flex
          flex-direction: column
          margin: 0 30px

          .first-div
            width: 100%
            height: 46px
            display: flex
            align-items: flex-end
            border-bottom: 1px solid rgba(255, 255, 255, 0.4)

            .first-div-label
              color: black
              font-size: 20px
              font-weight: bold

            .first-div-value
              color: black
              font-size: 20px
              font-weight: bold
              margin-left: 20px

          .second-div
            display: flex
            width: 100%
            height: 46px

            .second-div-label
              color: black
              font-size: 20px
              font-weight: bold

            .second-div-value
              color: black
              font-size: 20px
              font-weight: bold
              margin-left: 20px

            .second-div-left
              width: 50%
              display: flex
              align-items: flex-end
              border-bottom: 1px solid rgba(255, 255, 255, 0.4)
              border-right: 1px solid rgba(255, 255, 255, 0.4)

            .second-div-right
              width: 50%
              display: flex
              align-items: flex-end
              padding-left: 20px
              border-bottom: 1px solid rgba(255, 255, 255, 0.4)


      .weighingInterface-content-right-btm
        display: flex
        justify-content: space-evenly
        align-items: center
        position: relative
        width: 100%
        height: 35%
        border-radius: 20px
        margin-top: 25px
        background-color: rgba(255, 255, 255, 0.6)

        .cameraDataLeft
          width: 36%
          height: 90%
          padding: 4px
          border-radius: 25px
          background-color: rgba(255, 255, 255, 0.8)

          img
            width: 100%
            height: 100%
            border-radius: 25px

        .cameraDataRight
          width: 36%
          height: 90%
          padding: 4px
          border-radius: 25px
          background-color: rgba(255, 255, 255, 0.8)

          img
            width: 100%
            height: 100%
            border-radius: 25px

        .faceData
          display: flex
          justify-content: center
          align-items: center
          width: 20%
          height: 90%
          padding: 4px
          border-radius: 25px
          background-color: rgba(255, 255, 255, 0.8)

          img
            width: 100%
            height: 100%
            border-radius: 25px


  .weighingInterface-footer
    @include disconnect
    width: 100%
    height: 15vh

    .weighingInterface-footer-content
      @include disconnect
      width: 92%
      height: 11vh
      border-radius: 20px
      background-color: rgba(255, 255, 255, 0.6)

      .text
        width: 75%
        font-size: 28px
        font-weight: bold
        margin-left: 30px

      .btn
        display: flex
        justify-content: space-evenly
        align-items: center
        width: 20%
        height: 100%

        .enter-button:active
          background-color: rgba(15, 137, 255, 0.7)
          border-radius: 15px

        .enter-button
          @include disconnect
          width: 35%
          height: 65%
          border-radius: 15px
          background-color: #0F89FF

          span
            font-size: 24px
            font-weight: bold

        .exit-button:active
          background-color: rgba(255, 142, 118, 0.7)
          border-radius: 15px

        .exit-button
          @include disconnect
          width: 35%
          height: 65%
          border-radius: 15px
          background-color: #FF8E76

          span
            font-size: 24px
            font-weight: bold
</style>