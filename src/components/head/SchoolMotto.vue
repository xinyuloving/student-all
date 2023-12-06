<template>
    <div class="school-motto">
        <!-- 中间部分的校训 -->
        <span>{{ motto }}</span>
    </div>
</template>

<script>
export default {
    props: {
        motto: {
            type: String,
            default: "富强、文明、民主、和谐（校规、校训）",
        },
    },
};
</script>

<style lang="less" scoped>
.school-motto {
    width: 754px;
    height: 100%;
    display: flex;
    align-items: center;
    span {
        font-size: 16px;
        font-weight: 400;
        color: #333333;
    }
}
</style>