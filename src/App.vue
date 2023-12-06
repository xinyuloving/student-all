<template>
  <div id="app">
    <keep-alive exclude="CloudClassroom">
      <router-view />
    </keep-alive>
    <!-- <Eyeshield /> -->
    <TDialog :diaShow="diaShow" :closeHidden="false" :dialogClass="'drop-line'">
      {{ $store.state.user.userInfo.realName || "" }}
      同学，您的账号在其他课桌上登录，3秒后将返回登录页！
    </TDialog>
    <NotifyDia :isShow.sync="isNotify" />
    <TDialog
      :diaShow="dialogVisible"
      :dialogClass="'logout-dialog'"
      :customClass="'logout-main'"
      @close="logout"
    >
      <template v-slot:header>
        <div class="head-con">
          <span>提示！</span>
        </div>
      </template>
      <template v-slot:default>
        <div class="main-con">
          <!-- <img src="@/assets/img/setting/shutdown.png" alt="" /> -->
          <span>小可爱，你无法登录云课堂，请退出重新登录</span>
        </div>
      </template>
      <template v-slot:footer>
        <div class="footer-con">
          <TButton class="btn" @touch="logout"> 确认 </TButton>
        </div>
      </template>
    </TDialog>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { getTimUserSig } from "@/api/user";
import sendMessage from "@/utils/sendMessage";
// import Eyeshield from "@/components/home/Eyeshield.vue";
import { receptionHeartbeat, exitCloudClassromm } from "@/utils/heartbeat";
import TDialog from "@/components/publicMethods/TDialog.vue";
import { loginPhenix } from "@/api/phenixLog";
import NotifyDia from "@/components/publicMethods/NotifyDia.vue";
import TButton from "@/components/publicMethods/TButton.vue";
import { createStudentIM } from "@/utils/util";
// import { report } from "@/utils/reportInJSFile";
export default {
  name: "App",
  created() {
    // this.setToken("7b492714-764d-4d1e-9149-6ca5db437b08"); // 部署线上应当注释
    this.setToken(window.WebViewJavascript.getToken()); // 部署线上不可注释
    // this.handleBattery(); // 注释
    // console.log(window.WebViewJavascript.getToken());
    this.initListener(); // 不可注释
    this.initStudent(); // 不可注释
    window.giveGroupInfoToJS = this.giveGroupInfoToJS;
  },
  components: {
    // Eyeshield,
    TDialog,
    NotifyDia,
    TButton,
  },
  data() {
    return {
      diaShow: false,
      isNotify: false,
      dialogVisible: false,
    };
  },
  methods: {
    ...mapMutations({
      setState: "imStore/setState",
      setToken: "user/setToken",
    }),
    ...mapActions({
      setMessage: "imStore/setMessage",
      SKIP_LOGIN: "user/SKIP_LOGIN",
      getStudentInfo: "user/getUserInfo",
      getCourse: "classInfo/getCourse",
    }),
    initListener() {
      // 监听事件
      this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate);
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate);
      // // 收到新消息的监听
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
      this.tim.on(
        this.TIM.EVENT.CONVERSATION_LIST_UPDATED,
        this.onUpdateConversationList
      );
      this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList);
      this.tim.on(this.TIM.EVENT.ERROR, this.onError);
      this.tim.on(this.TIM.EVENT.NET_STATE_CHANGE, this.checkoutNetState);
      this.tim.on(this.TIM.EVENT.KICKED_OUT, this.offline);
      console.log("初始化监听完成");
    },
    onReadyStateUpdate({ name }) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      // event.name - TIM.EVENT.SDK_READY
      const SdkStatus = name === this.TIM.EVENT.SDK_READY ? true : false;
      this.setState({ key: "IMSdkState", value: SdkStatus });
      // console.log("更新状态");
    },
    onReceiveMessage({ data: messageList }) {
      // 收到新消息的处理函数
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
      // console.log("收到新消息", messageList);
      // "@TIM#SYSTEM" 表示 群系统消息
      // if (messageList[0].conversationID !== "@TIM#SYSTEM") {
      //     this.setMessage(messageList[0].payload);
      // }
      for (let i = 0; i < messageList.length; i++) {
        const e = messageList[i];
        // if (e.payload.description === "heartbeat_OK")
        //     receptionHeartbeat((data) => {
        //         this._msg(data);
        //     });
        // // 如果群组解散则退出云课堂
        // if (
        //     e.conversationID === "@TIM#SYSTEM" &&
        //     e.payload.operationType === 5
        // )
        //     exitCloudClassromm(e);
        // if (e.conversationID !== "@TIM#SYSTEM" && e.payload.data !== "heartbeat" && e.payload.data !== 'in_cloudChassroom') {
        //     // this._msg(e.payload.extension);
        //     this.setMessage(e);
        // }
        if (e.conversationID === "@TIM#SYSTEM") {
          switch (e.payload.operationType) {
            case 5:
              exitCloudClassromm(e);
              break;
            default:
              break;
          }
        } else {
          switch (e.payload.data) {
            case "heartbeat":
              this.setState({
                key: "heartbeatFailTimes",
                value: 0,
              });
              receptionHeartbeat((data) => {
                // this._msg(data);
                console.log(data);
              });
              break;
            case "cloudClassroom":
              this.setMessage(e);
              break;
            case "NOTIFY":
              this.isNotify = true;
              break;
            default:
              break;
          }
        }
      }
    },
    onUpdateConversationList(event) {
      // 会话列表更新 的处理函数
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      // event.data - 存储 Conversation 对象的数组 - [Conversation]
      // console.log("会话列表更新");

      // console.log(event);
    },
    onUpdateGroupList(event) {
      // 群组列表更新
      // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
      // event.name - TIM.EVENT.GROUP_LIST_UPDATED
      // event.data - 存储 Group 对象的数组 - [Group]
      // console.log("群组列表更新");
      // console.log(event);
    },
    onError({ data }) {
      // SDK内部出错
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // event.name - TIM.EVENT.ERROR
      // event.data.code - 错误码
      // event.data.message - 错误信息
      // if (data.message !== "Network Error") {
      //     this.$store.commit("showMessage", {
      //         message: data.message,
      //         type: "error",
      //     });
      // }
      // console.log("sdk 出错");

      // console.log(data);
    },
    onNetStateChange(event) {
      // 网络监测
      //  网络状态发生改变（v2.5.0 起支持）。
      // event.name - TIM.EVENT.NET_STATE_CHANGE
      // event.data.state 当前网络状态，枚举值及说明如下：
      //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
      //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
      //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
      // console.log("网络出错");

      this.checkoutNetState(event.data.state);
      // console.log(event);
    },
    checkoutNetState(state) {
      switch (state) {
        case this.TIM.TYPES.NET_STATE_CONNECTED:
          this.setState({ key: "netWorkInfo", value: "已接入网络" });
          return { message: "已接入网络", type: "success" };
        case this.TIM.TYPES.NET_STATE_CONNECTING:
          this.setState({
            key: "netWorkInfo",
            value: "当前网络不稳定",
          });
          return { message: "当前网络不稳定", type: "warning" };
        case this.TIM.TYPES.NET_STATE_DISCONNECTED:
          this.setState({
            key: "netWorkInfo",
            value: "当前网络不可用",
          });
          return { message: "当前网络不可用", type: "error" };
        default:
          this.setState({
            key: "netWorkInfo",
            value: "未知网络原因",
          });
          return "";
      }
    },
    offline(e) {
      // im被踢
      if (e.data.type === this.TIM.TYPES.KICKED_OUT_MULT_ACCOUNT) {
        this.setState({ key: "loginInfo", value: "多实例登录" });
        this.diaShow = true;
        setTimeout(() => {
          this.SKIP_LOGIN();
        }, 3000);
      } else if (e.data.type === this.TIM.TYPES.KICKED_OUT_MULT_DEVICE) {
        this.setState({ key: "loginInfo", value: "多终端登录" });
        this.diaShow = true;
        setTimeout(() => {
          this.SKIP_LOGIN();
        }, 3000);
      } else if (e.data.type === this.TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED) {
        this.setState({ key: "loginInfo", value: "签名过期" });
      } else {
        this.setState({ key: "loginInfo", value: "未知原因离线" });
      }
      // this._msg('im账号异地登录，3秒后将跳转至登录页！');
    },
    async handleBattery() {
      // 获取电池对象
      const battery = await navigator.getBattery();
      console.log(battery);
      console.log("电池充电状态：", battery.charging);
      console.log("电量水平： ", battery.level * 100 + "%");
      console.log("电池充电时间：" + battery.chargingTime + " seconds");
      console.log("电池放电时间" + battery.dischargingTime + " seconds");

      battery.addEventListener("chargingchange", function () {
        console.log("电池充电状态：", battery.charging);
      });

      battery.addEventListener("levelchange", function () {
        console.log("电量水平： ", battery.level * 100 + "%");
      });

      battery.addEventListener("chargingtimechange", function () {
        console.log("电池充电时间：" + battery.chargingTime + " seconds");
      });

      battery.addEventListener("dischargingtimechange", function () {
        console.log("电池放电时间" + battery.dischargingTime + " seconds");
      });

      const network = navigator.connection;
      console.log(network);
    },
    // 将群组信息传给js
    async giveGroupInfoToJS(obj) {
      try {
        // this._msg(obj);
        // 如果已经登录
        if (this.$store.getters.studentId) {
          let groupAndSn = JSON.parse(obj);
          if (!groupAndSn.sn) return;
          // if (!groupAndSn.teacherIM) return this.giveGroupInfoToJS(window.WebViewJavascript.getGroudID());
          // 加入群组
          this.tim
            .joinGroup({
              groupID: groupAndSn.groupID,
            })
            .then(() => {
              this.sendMessageToTeacher(groupAndSn);
              // this._msg("加入成功");
              this.setState({
                key: "groupId",
                value: groupAndSn.groupID,
              });
            })
            .catch((imError) => {
              // this._msg(JSON.stringify(imError));
              if (imError.code == 2801) {
                this._msg("加入教室失败，请求超时！");
              } else if (imError.code === 2662) {
                this._msg("加入教室失败，匿名用户！");
                // this.loginIM(this.$store.getters.studentId)
              } else {
                // this._msg(JSON.stringify(imError));
                this.sendMessageToTeacher(groupAndSn);
              }
            });
          // 向群组中发送一条信息
          return "giveGroupInfoToJS_OK!";
        } else {
          // 未登录时
          // this._msg("NOT_LOGIN!!!");
          return;
        }
      } catch (err) {
        // this._msg(err);
        console.log(err);
      }
    },
    async sendMessageToTeacher(groupAndSn) {
      try {
        this.setState({
          key: "teacherIM",
          value: groupAndSn.teacherIM,
        });
        const userInfo = this.$store.state.user.userInfo;
        const studentInfo = JSON.stringify({
          ...groupAndSn,
          id: userInfo.id,
          im_id: userInfo.im_id,
          name: userInfo.realName,
          flowerNum: 0,
          gender: userInfo.gender,
          studentAccount: userInfo.account,
          classInfo: {
            gradeCode: userInfo.grade.gradeCode,
            classCode: userInfo.clazz.clazzCode,
            className: userInfo.grade.gradeName + userInfo.clazz.clazzName,
            clazzName: userInfo.clazz.clazzName,
            gradeName: userInfo.grade.gradeName,
          },
        });
        // 获取学生信息
        await sendMessage({
          to: groupAndSn.groupID,
          // conversationType: this.TIM.TYPES.CONV_C2C,
          content: "JOIN_CCL_OK",
          mesType: "in_cloudChassroom",
          extension: studentInfo,
        });
        // for (let i = 0; i < 40; i++) {
        //     sendMessage({
        //         to: groupAndSn.groupID,
        //         // to: groupAndSn.teacherIM,
        //         // conversationType: this.TIM.TYPES.CONV_C2C,
        //         content: "JOIN_CCL_OK",
        //         mesType: "in_cloudChassroom",
        //         extension: studentInfo,
        //         // priority: groupAndSn.priorityLevel || 'Normal'
        //     }).then(() => {
        //
        //     }).catch(() => {
        //         this._msg('发送消息失败')
        //     })
        // }
      } catch (err) {
        // this._msg(err);
        // timer = setTimeout(() => {
        //     this.sendMessageToTeacher(groupAndSn);
        //     clearTimeout(timer)
        // }, 100);
      }
    },
    async initStudent() {
      // 在app中初始化所需的数据
      try {
        const { id, gender } = await this.getStudentInfo();
        // 登录埋点系统
        try {
          const { data } = await loginPhenix();
          window.localStorage.setItem("Phenix-Token", data);
          this.data_triggerEvent({
            pageId: "login",
            eventId: "loginSuccess",
            logValue: gender,
          });
        } catch (error) {
          // console.log(error);
        }

        // const params = {
        //     userId: `1000${id}`,
        // };
        // const { data } = await getTimUserSig(params);
        // // 登录 im
        // await this.tim.login({
        //     userID: `1000${id}`,
        //     userSig: data,
        // });
        this.loginIM(id);

        // this.giveGroupInfoToJS(window.WebViewJavascript.getGroudID());
      } catch (error) {
        // console.log(error);
        // this._msg(JSON.stringify(error) + "初始化错误");
      }
      try {
        await this.getCourse();
      } catch (error) {
        // console.log(error);
      }
    },
    async loginIM(id, n = 0) {
      try {
        const userIMId = createStudentIM(id);
        const params = {
          // userId: `1000${id}`,
          userId: userIMId,
        };
        const { data } = await getTimUserSig(params);
        // 登录 im
        await this.tim.login({
          //   userID: `1000${id}`,
          userID: userIMId,
          userSig: data,
        });
        this.giveGroupInfoToJS(window?.WebViewJavascript?.getGroudID());
        // this.giveGroupInfoToJS(
        //     JSON.stringify({
        //         groupID: "temp_mession_00011499",
        //         sn: "BD2021100032", // 正式
        //         // groupID: "temp_mession_000147119",
        //         // sn: "STZ1A11A120349",
        //     })
        // );
        // this.giveGroupInfoToJS(
        //   JSON.stringify({
        //     groupID: "temp_mession_000148122",
        //     sn: "STZ1A11A120803",
        //   })
        // );
      } catch (err) {
        console.log("登录im失败---> ", err);
        if (n < 4) {
          this.loginIM(data, ++n);
        } else {
          this.dialogVisible = true;
          // MessageBox.alert("登录im失败，请退出重新登录", "提示", {
          //     confirmButtonText: "确定",
          //     type: "error",
          //     callback: () => {
          //         removeToken();
          //         location.reload();
          //     },
          // });
        }
      }
    },
    logout() {
      // console.log("退出登录");
      this.dialogVisible = false;
      this.SKIP_LOGIN();
    },
  },
  // beforeDestroy() {
  //     this.tim
  //         .logout()
  //         .then(() => {
  //             console.log("登出 im 成功");
  //         })
  //         .catch(() => {
  //             console.log("登出 im 失败");
  //         });
  // },
};
</script>
<style lang="less" scoped>
#app {
  // width: 100%;
  // height: 100%;
  height: 480px;
  width: 1280px;
  /deep/.drop-line {
    .t-dialog-main {
      width: 400px;
      height: 200px;
      .t-dialog-con {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        font-weight: 600;
        line-height: 1.5;
        text-align: center;
      }
    }
  }
  .logout-dialog {
    background: rgba(0, 0, 0, 0.4);
    .logout-main {
      width: 400px;
      height: 244px;
      background: #f8f8fb;
      border-radius: 12px;
      padding: 0;
      overflow: hidden;
      .t-dialog-head {
        height: 26px;
        border-bottom: 1px solid #e2e4e6;
        .icon-cuo {
          top: 16px;
          right: 17px;
          font-size: 24px;
          color: #b1b1b1;
          transform: none;
        }
      }
      .t-dialog-con {
        .main-con {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          // img {
          //     width: 55px;
          //     height: 55px;
          //     margin-bottom: 16px;
          // }
          span {
            font-size: 20px;
            font-weight: 600;
            color: #333333;
            line-height: 28px;
          }
        }
      }
      .footer-con {
        width: 100%;
        height: 53px;
        // background: #f8f8fb;
        border-radius: 0px 0px 16px 16px;
        border-top: 1px solid #e2e4e6;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .btn {
          font-size: 20px;
          font-weight: 400;
          width: 20%;
          height: 80%;
          background: #2499ff;
        }
      }
    }
  }
}
</style>
