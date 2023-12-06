<template>
    <header>
        <!-- <HeadLogo :title="logoTitle" :logoUrl="logoUrl" /> -->
        <HeadLogo :title="logoTitle" />
        <SchoolMotto :motto="motto" />
        <HeadOther />
    </header>
</template>

<script>
import HeadLogo from "./HeadLogo.vue";
import HeadOther from "./HeadOther.vue";
import SchoolMotto from "./SchoolMotto.vue";
export default {
    components: {
        HeadLogo,
        HeadOther,
        SchoolMotto,
    },
    data() {
        return {
            logoTitle: "杭州数字实验小学",
            // logoUrl: "../../assets/img/logo.png",
            // motto: "文明自爱，自信自强",
            motto: "",
        };
    },
};
</script>

<style lang="less" scoped>
header {
    width: 100%;
    height: 32px;
    background-color: #fff;
    padding: 0 28px;
    display: flex;
    align-items: center;
}
</style>