<template>
    <div class="head-other">
        <span class="time">{{ time }}</span>
        <span class="week">{{ week }}</span>
        <span class="date">{{ date }}</span>
    </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
export default {
    data() {
        return {
            time: moment().format("HH:mm"),
            week: moment().format("dddd"),
            date: moment().format("YYYY/MM/DD"),
        };
    },
    created() {
        setInterval(() => {
            this.getTime();
        }, 1000);
    },
    methods: {
        getTime() {
            this.time = moment().format("HH:mm");
            this.week = moment().format("dddd");
            this.date = moment().format("YYYY/MM/DD");
        },
    },
};
</script>

<style lang="less" scoped>
.head-other {
    flex: 1;
    display: flex;
    align-items: center;
    span {
        font-size: 16px;
        font-weight: 400;
        color: #333333;
    }
    .time{
        margin-right: 16px;
    }
    .week{
        margin-right: 16px;
    }
}
</style>