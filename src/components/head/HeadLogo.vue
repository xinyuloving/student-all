<template>
    <div class="head-logo">
        <!-- <img :src="logoUrl" alt="" /> -->
        <img src="../../assets/img/logo.png" alt="" />
        <span>{{ title }}</span>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "杭州数字实验小学",
        },
        // logoUrl: {
        //     type: String,
        //     default: "",
        // },
    },
};
</script>

<style lang="less" scoped>
.head-logo {
    font-size: 20px;
    width: 224px;
    display: flex;
    align-items: center;
    img {
        width: 21px;
        height: 21px;
        margin-right: 9px;
    }
    span {
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        font-family: PingFangSC-Regular, PingFang SC;
    }
}
</style>