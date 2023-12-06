<template>
    <div class="time">
        <!-- 左上角的时间组件 -->
        <span class="top">{{ time }}</span>
        <span class="bottom">{{ date }}</span>
    </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
export default {
    data() {
        return {
            date: moment().format("YYYY.MM.DD  dddd"),
            time: moment().format("HH:mm"),
        };
    },
    created() {
        setInterval(() => {
            this.getTime();
        }, 1000);
    },
    methods: {
        getTime() {
            this.date = moment().format("YYYY.MM.DD dddd");
            this.time = moment().format("HH:mm");
        },
    },
};
</script>

<style lang="less" scoped>
.time {
    // height: 70px;
    position: absolute;
    top: 16px;
    left: 10px;
    display: flex;
    flex-direction: column;
    padding: 0 0 0 20px;
    justify-content: flex-end;
    span {
        color: #fff;
    }
    .top {
        font-size: 24px;
        letter-spacing: 1.3px;
        margin-bottom: 3px;
    }
    .bottom {
        font-size: 18px;
    }
}
</style>