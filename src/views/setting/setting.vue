<template>
  <div class="setting-index">
    <div class="setting-index-content">
      <div class="setting-index-content-title">
        全局设置
      </div>
      <div class="setting-index-content-body">
        <a-form layout="horizontal" :label-col="{span: 6}" :wrapper-col="{span: 18}">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="12">
              <a-form-item label="IP地址" v-bind="validateInfos.ipAddr">
                <a-input v-model:value="modelRef.ipAddr" placeholder="请输入IP地址"/>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="12">
              <a-form-item label="端口" v-bind="validateInfos.port">
                <a-input v-model:value="modelRef.port" placeholder="请输入端口"/>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="12">
              <a-form-item label="WS地址" v-bind="validateInfos.wsAddr">
                <a-input v-model:value="modelRef.wsAddr" placeholder="请输入WS地址"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="setting-index-content-footer">
        <div class="setting-index-content-footer-button">
          <div class="setting-index-content-footer-button-save" @click.prevent="handleSubmit">
            保存
          </div>
        </div>
      </div>
    </div>
    <MessagePopup ref="MessagePopupRef" :mask-closable="false"></MessagePopup>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {Col, Form, FormItem, Input, Row} from "ant-design-vue";
import MessagePopup from "../module/MessagePopup.vue";

export default defineComponent({
  name: "setting",
  components: {
    Row,
    Col,
    Form,
    Input,
    FormItem,
    MessagePopup
  },
  setup() {
    const MessagePopupRef = ref<any>(null)

    const useForm = Form.useForm;

    const modelRef: any = reactive({
      ipAddr: '',
      port: '',
      wsAddr: ''
    });

    onMounted(() => {
      initData()
    })

    function initData() {
      Object.keys(modelRef).forEach((key) => {
        modelRef[key] = localStorage.getItem(key) ? localStorage.getItem(key) : ''
      })
    }

    const {validate, validateInfos} = useForm(
        modelRef,
        reactive({
          ipAddr: [
            {
              required: true,
              validator: (rule: any, value: any) => {
                console.log(rule)
                const reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
                if (!reg.test(value)) {
                  return Promise.reject('请输入有效IP地址');
                }
                return Promise.resolve();
              }
            },
          ],
          port: [
            {
              required: true,
              validator: (rule: any, value: any) => {
                console.log(rule)
                const reg = /^(0|[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
                if (!reg.test(value)) {
                  return Promise.reject('请输入有效端口');
                }
                return Promise.resolve();
              }
            },
          ],
          wsAddr: [
            {
              required: true,
              message: '请输入WS地址'
            },
          ],
        }),
    )

    function handleSubmit() {
      validate().then((resp: any) => {
        Object.keys(resp).forEach((key) => {
          localStorage.setItem(key, resp[key])
          console.log(localStorage.getItem(key))
        })
        messagePopup()
      })
    }

    function messagePopup() {
      MessagePopupRef.value.operate(true, '保存成功，正在重启')
      setTimeout(() => {
        MessagePopupRef.value.operate(false, '')
        window.ipcRenderer.send('win-restart')
      }, 2000)
    }

    return {
      modelRef,
      validateInfos,
      handleSubmit,
      MessagePopupRef
    }
  }
})
</script>

<style scoped lang="sass">
.setting-index
  width: 100vw
  height: 100vh
  display: flex
  align-items: center
  justify-content: center

  .setting-index-content
    width: 90vw
    height: 90vh
    background-color: rgba(255, 255, 255, 0.6)
    border-radius: 20px
    display: flex
    align-items: center
    flex-direction: column
    justify-content: center

    .setting-index-content-title
      width: 100%
      height: 10%
      color: #3a78c7
      font-size: 48px
      font-weight: bold
      text-align: center
      border-bottom: 1px solid #3a78c7

    .setting-index-content-body
      width: 100%
      height: 80%
      display: flex
      justify-content: center

      .ant-form
        margin: 20px

    .setting-index-content-footer
      width: 100%
      height: 10%
      border-top: 1px solid #3a78c7

      .setting-index-content-footer-button
        width: 100%
        height: 100%
        display: flex
        justify-content: center
        align-items: center

        .setting-index-content-footer-button-save
          width: 200px
          height: 50px
          background-color: #3a78c7
          color: #fff
          font-size: 24px
          font-weight: bold
          text-align: center
          line-height: 50px
          border-radius: 10px
          cursor: pointer

          &:active
            background-color: rgba(58, 120, 199, 0.7)
</style>