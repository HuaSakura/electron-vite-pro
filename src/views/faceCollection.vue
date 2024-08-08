<template>
  <div class="faceCollection">
    <div class="faceCollection-header">
      <div class="faceCollection-header-left">
        <span>欢迎使用自助计量终端服务</span>
      </div>
      <div class="faceCollection-header-right">
        <span>{{ date }}</span>
      </div>
    </div>
    <div class="faceCollection-content">
      <div class="faceCollection-content-left">
        <div class="faceCollection-content-title">
          <img src="../assets/image/icon.png" alt="">
          <span>承运人信息</span>
        </div>
        <div class="faceCollection-content-userinfo">
          <img src="../assets/image/user.png" alt="">
          <div class="faceCollection-content-userinfo-content">
            <span>粮小宝</span>
            <span style="font-size: 18px;color: white;">业务类型: 入库</span>
          </div>
        </div>
        <div class="faceCollection-content-info">
          <div class="div-from">
            <div class="div-label">运输工具<span></span></div>
            <div>:</div>
            <div class="div-value">汽车</div>
          </div>
          <div class="div-from">
            <div class="div-label">车船号<span></span></div>
            <div>:</div>
            <div class="div-value">鲁A12345</div>
          </div>
          <div class="div-from">
            <div class="div-label">联系电话<span></span></div>
            <div>:</div>
            <div class="div-value">13180000000</div>
          </div>
          <div class="div-from">
            <div class="div-label">详细地址<span></span></div>
            <div>:</div>
            <div class="div-value">山东省济南市历下区</div>
          </div>
        </div>
        <div class="faceCollection-content-footer">
          <div class="footer-title">
            <span>客户名称</span>
          </div>
          <div class="footer-info">
            <span>安徽省凤宝粮油食品有限公司</span>
          </div>
        </div>
      </div>
      <div class="faceCollection-content-right">
        <div class="faceCollection-content-title">
          <img src="../assets/image/icon.png" alt="">
          <span>人脸采集</span>
        </div>
        <div class="faceCollection-content-camera">
          <div class="camera-content">
            <div class="camera-content-video">
              <div class="camera-content-border">
                <video id="video" autoplay @click="getCamera"></video>
              </div>
            </div>
          </div>
          <div class="button-content">
            <div class="enter-button" @click="enterFun">
              <span>确认</span>
            </div>
            <div class="exit-button" @click="exitFun">
              <span>取消</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="faceCollection-footer">
      <div class="faceCollection-footer-content">
        <div class="faceCollection-footer-content-text" id="dqxx">
          <QrcodeOutlined/>
          读取信息
        </div>
        <div class="faceCollection-footer-content-text" id="rlcj">
          <UserOutlined/>
          人脸采集
        </div>
        <div class="faceCollection-footer-content-text" id="clwd">
          <RocketOutlined/>
          车辆稳定
        </div>
        <div class="faceCollection-footer-content-text" id="xxqr">
          <FileSearchOutlined/>
          信息确认
        </div>
        <div class="faceCollection-footer-content-text" id="jlwc">
          <FileProtectOutlined/>
          计量完成
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
import {defineComponent, onMounted, onBeforeUnmount, ref, onBeforeMount} from 'vue'
import dayjs from "dayjs";
import {useRouter} from "vue-router";
import MessagePopup from "./module/MessagePopup.vue";
import {
  QrcodeOutlined,
  UserOutlined,
  RocketOutlined,
  FileSearchOutlined,
  FileProtectOutlined
} from "@ant-design/icons-vue";

export default defineComponent({
  name: "faceCollection",
  components: {
    MessagePopup,
    UserOutlined,
    QrcodeOutlined,
    RocketOutlined,
    FileSearchOutlined,
    FileProtectOutlined
  },
  setup() {
    const router = useRouter();
    const MessagePopupRef = ref<any>(null)

    let timer: any;
    let videoStream: any;
    var clickCount: number = 0;
    const date: any = ref('0000-00-00 00:00:00')

    const dqxx: any = ref(null)
    const rlcj: any = ref(null)
    const clwd: any = ref(null)
    const xxqr: any = ref(null)
    const jlwc: any = ref(null)

    onBeforeMount(() => {
      getCamera()
    })

    onMounted(() => {
      getDocument()
      timer = setInterval(() => {
        date.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    })

    onBeforeUnmount(() => {
      clearInterval(timer)
      removeCamera()
      removeDocument()
    })

    function getDocument() {
      dqxx.value = document.getElementById('dqxx')
      rlcj.value = document.getElementById('rlcj')
      clwd.value = document.getElementById('clwd')
      xxqr.value = document.getElementById('xxqr')
      jlwc.value = document.getElementById('jlwc')
    }

    function removeDocument() {
      dqxx.value = null
      rlcj.value = null
      clwd.value = null
      xxqr.value = null
      jlwc.value = null
    }

    async function getCamera() {
      try {
        const stream: any = await navigator.mediaDevices.getUserMedia({video: true});
        const video: any = document.getElementById('video');
        video.srcObject = stream;
        videoStream = stream;
      } catch (err) {
        console.log(err);
      }
    }

    function removeCamera() {
      if (videoStream) {
        videoStream.getTracks().forEach(function (track: any) {
          track.stop();
        });
      }
    }

    function Screenshot() {
      let video: any = document.getElementById(`video`);
      let canvas: any = document.createElement("canvas");
      video.crossOrigin = 'anonymous';
      canvas.width = 420;
      canvas.height = 600;
      var centerX = video.videoWidth / 2;
      var startX = centerX - canvas.width / 2;
      var startY = 0;
      let ctx = canvas.getContext('2d');
      var width = canvas.width;
      var height = canvas.height;
      ctx.drawImage(video, startX, startY, width, height, 0, 0, width, height);
      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('张三', 170, 530);
      ctx.fillText('13180003231', 110, 570);
      let imageData = canvas.toDataURL("image/jpeg", 0.2).split(',');
      if (imageData[1] != '') {
        //console.log('截图成功', 'data:image/jpg;base64,' + imageData[1])
        sessionStorage.setItem('faceData', imageData[1])
        rlcj.value.style.color = '#3A78C7'
      }
    }

    function enterFun() {
      clickCount++;
      if (clickCount >= 2) {
        clickCount = 0
        let audio: any = document.getElementById("ngmAudio")
        audio.volume = 0.8
        audio.play()
      } else {
        Screenshot()
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
        router.push({path: '/weighingInterface'})
      }, 1000)
    }

    return {
      date,
      getCamera,
      enterFun,
      exitFun,
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

.faceCollection
  width: 100vw
  height: 100vh

  .faceCollection-header
    @include disconnect
    width: 100%
    height: 12vh

    .faceCollection-header-left
      width: 50%
      height: 100%
      position: relative

      span
        position: absolute
        left: 8%
        bottom: 0
        font-size: 48px
        font-weight: bold

    .faceCollection-header-right
      width: 50%
      height: 100%
      position: relative

      span
        position: absolute
        bottom: 0
        right: 8%
        font-size: 26px

  .faceCollection-content
    @include disconnect
    width: 100%
    height: 73vh

    .faceCollection-content-title
      display: flex
      align-items: center
      margin: 10px 20px

      span
        font-size: 26px
        font-weight: bold
        margin-left: 10px
        text-shadow: 0 0 4px rgba(26, 89, 172, 1)

    .faceCollection-content-left
      position: relative
      width: 35%
      height: 68vh
      border-radius: 20px
      background-image: url("../assets/image/left.png")
      background-size: cover
      background-position: center bottom
      background-repeat: no-repeat

      .faceCollection-content-userinfo
        display: flex
        height: 86px
        margin: 20px

        .faceCollection-content-userinfo-content
          display: flex
          flex-direction: column
          justify-content: center
          margin-left: 30px
          margin-right: 30px

          span
            font-size: 22px
            font-weight: 600
            color: black

      .faceCollection-content-info
        display: flex
        flex-direction: column
        margin-left: 30px
        margin-right: 30px

        .div-from
          display: flex
          margin-top: 15px
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

      .faceCollection-content-footer
        position: absolute
        bottom: 0
        height: 100px
        margin-left: 30px
        margin-right: 30px

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

    .faceCollection-content-right
      width: 55%
      height: 68vh
      margin-left: 2%
      border-radius: 20px
      background-color: rgba(255, 255, 255, 0.6)

      .faceCollection-content-camera
        display: flex
        width: 100%
        height: 60vh

        .camera-content
          display: flex
          justify-content: center
          align-items: flex-start
          width: 60%
          height: 100%

          .camera-content-video
            width: 85%
            height: 95%
            border-radius: 20px
            background-color: rgba(255, 255, 255, 0.8)

            .camera-content-border
              position: relative
              overflow: hidden
              width: 94%
              height: 94%
              border-radius: 20px
              margin: 3%

              video
                top: 50%
                left: 50%
                width: 600px
                height: 450px
                position: absolute
                transform: translate(-50%, -50%)

        .button-content
          display: flex
          flex-direction: column
          justify-content: space-around
          align-items: center
          width: 40%
          height: 100%

          .enter-button:active
            background-color: rgba(15, 137, 255, 0.7)
            border-radius: 15px

          .enter-button
            @include disconnect
            width: 60%
            height: 30%
            border-radius: 15px
            background-color: #0F89FF

            span
              font-size: 48px
              font-weight: bold

          .exit-button:active
            background-color: rgba(255, 142, 118, 0.7)
            border-radius: 15px

          .exit-button
            @include disconnect
            width: 60%
            height: 30%
            border-radius: 15px
            background-color: #FF8E76

            span
              font-size: 48px
              font-weight: bold

  .faceCollection-footer
    @include disconnect
    width: 100%
    height: 15vh

    .faceCollection-footer-content
      width: 92%
      height: 11vh
      border-radius: 20px
      display: flex
      align-items: center
      justify-content: space-evenly
      background-color: rgba(255, 255, 255, 0.6)

      .faceCollection-footer-content-text
        display: flex
        align-items: center
        font-size: 24px
        font-weight: bold
</style>