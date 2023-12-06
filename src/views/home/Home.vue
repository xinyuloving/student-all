<template>
    <div class="home">
        <!-- 首页 -->
        <!-- <Header /> -->
        <div class="con">
            <keep-alive include="HomeIndex">
                <router-view />
            </keep-alive>
        </div>
        <!-- 轮播图 -->
        <Carousel v-if="carouselShow" />
        <Eyeshield />
    </div>
</template>

<script>
import Header from "../../components/head/Header.vue";
import { mapState } from "vuex";
import Carousel from "@/components/home/carousel.vue";
import { changeStatusBar } from "@/utils/util";
import Eyeshield from "@/components/home/Eyeshield.vue";
export default {
    components: {
        Header,
        Carousel,
        Eyeshield,
    },
    computed: {
        ...mapState({
            ccl_1: (state) => state.imStore.ccl_1,
        }),
        ...mapState("carousel", ["carouselShow"]),
    },
    watch: {
        ccl_1: {
            handler(newValue) {
                if (newValue) {
                    changeStatusBar(false);
                    // this.$router.push({ name: "CloudClassroom" });
                } else {
                    if (!this.carouselShow) {
                        changeStatusBar(true);
                    }
                    // this.$router.push({ name: "ClassReport" });
                }
            },
        },
        carouselShow: {
            handler(newVal) {
                if (newVal) {
                    changeStatusBar(false);
                } else {
                    changeStatusBar(true);
                }
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less" scoped>
.home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 36px;
    .con {
        flex: 1;
        background: #f4f4f9;
        display: flex;
        flex-direction: column;
    }
}
</style>