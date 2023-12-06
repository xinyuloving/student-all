<template>
    <div class="index">
        <!-- 首页 -->
        <div class="top">
            <span>日 新 于 博 · 尽 美 于 雅</span>
            <!-- <img src="../../assets/img/motto1.png" alt="" /> -->
        </div>
        <div class="bottom">
            <HomeLeft />
            <HomeMid />
            <HomeRight @openSetting="chengeSettingState" />
        </div>
        <!-- <DialogSetting
            :showSettingMain="showSettingMain"
            @closeSetting="closeSetting"
            v-show="showSetting"
        /> -->
        <DialogSetting
            @closeSetting="chengeSettingState"
            :showSetting="showSetting"
        />
    </div>
</template>

<script>
import DialogSetting from "@/components/home/DialogSetting.vue";
import HomeLeft from "@/components/home/HomeLeft.vue";
import HomeMid from "@/components/home/HomeMid.vue";
import HomeRight from "@/components/home/HomeRight.vue";
// let dialogTimer, mainTimer;
export default {
    name: "HomeIndex",
    components: {
        DialogSetting,
        HomeLeft,
        HomeMid,
        HomeRight,
    },
    data() {
        return {
            showSetting: false, // 控制 dialog 的消失或出现
            // showSettingMain: false, // 控制 划入样式 样式
        };
    },
    methods: {
        chengeSettingState(flag = false) {
            this.showSetting = flag;
        },
    },
};
</script>

<style lang="less" scoped>
.index {
    width: 100%;
    height: 100%;
    background: #f4f4f9;
    display: flex;
    flex-direction: column;
    // display: flex;
    // flex-direction: column;
    // position: relative;
    // .con {
    //     flex: 1;
    //     background: #f4f4f9;
    //     display: flex;
    //     flex-direction: column;
    .top {
        height: 59px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            font-size: 26px;
            font-weight: 600;
            color: #000;
        }
    }
    .bottom {
        flex: 1;
        padding: 0 28px;
        display: flex;
        justify-content: space-between;
    }
    // }
}
</style>