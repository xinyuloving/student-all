<template>
    <div class="home-mid">
        <div class="mid-top">
            <i></i>
            <span>我的课表</span>
        </div>
        <div class="mid-bottom">
            <div class="week">
                <!-- <span>{{ course[midActiveIndex].week }}</span> -->
                <span>{{
                    schedule.length ? schedule[midActiveIndex].weekName : ""
                }}</span>
            </div>
            <div class="course">
                <div class="swiper-father">
                    <div class="time-tag">
                        <div class="tag-item">
                            <span>上午</span>
                        </div>
                        <div class="tag-item">
                            <span>下午</span>
                        </div>
                    </div>
                    <!-- <swiper
                        :options="midSwiperOption"
                        class="swiper"
                        ref="midSwiper"
                        @slideChange="slideChange"
                    >
                        <swiper-slide v-for="item in course" :key="item.id">
                            <div class="slide-con">
                                <div class="slide-li">
                                    <Curriculum
                                        v-for="ele in item.am"
                                        :key="ele.id"
                                        :courseItem="ele"
                                    />
                                </div>
                                <div class="slide-li">
                                    <Curriculum
                                        v-for="ele in item.pm"
                                        :key="ele.id"
                                        :courseItem="ele"
                                    />
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper> -->
                    <swiper
                        :options="midSwiperOption"
                        class="swiper"
                        ref="midSwiper"
                        @slideChange="slideChange"
                    >
                        <template v-if="schedule.length">
                            <swiper-slide
                                v-for="item in schedule"
                                :key="item.week"
                            >
                                <div class="slide-con">
                                    <Curriculum
                                        v-for="ele in item.courseList"
                                        :key="ele.courseNum"
                                        :courseItem="ele"
                                    />

                                    <!-- <div class="slide-li">
                                        <Curriculum
                                            v-for="ele in item.am"
                                            :key="ele.id"
                                            :courseItem="ele"
                                        />
                                    </div>
                                    <div class="slide-li">
                                        <Curriculum
                                            v-for="ele in item.pm"
                                            :key="ele.id"
                                            :courseItem="ele"
                                        />
                                    </div> -->
                                </div>
                            </swiper-slide>
                        </template>
                        <template v-else>
                            <swiper-slide>
                                <div class="slide-con">
                                    <Curriculum
                                        v-for="ele in 8"
                                        :key="ele"
                                        :courseItem="{
                                            imgSeries: '0',
                                            state: '2',
                                            courseName: '',
                                        }"
                                    />
                                </div>
                            </swiper-slide>
                        </template>
                    </swiper>
                    <div
                        class="
                            swiper-button-prev
                            icon-arrowleftb
                            iconfont
                            my-icon
                        "
                        slot="button-prev"
                    ></div>
                    <div
                        class="
                            swiper-button-next
                            icon-arrowrightb
                            iconfont
                            my-icon
                            icon-right
                        "
                        slot="button-next"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 引入插件
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import Curriculum from "../main/Curriculum.vue";
import { mapState } from "vuex";
export default {
    components: {
        swiper,
        swiperSlide,
        Curriculum,
    },
    data() {
        return {
            midSwiperOption: {
                loop: false,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            },
            midActiveIndex: 0, // 当前课表激活页的索引
            // today: 0, // 从0开始，0 表示周一，6表示周日
        };
    },
    computed: {
        ...mapState({
            schedule: (state) => state.classInfo.schedule,
            today: (state) => state.classInfo.today - 1,
        }),
        midSwiper() {
            return this.$refs.midSwiper.swiper;
        },
    },
    mounted() {
        // if (this.today !== -1) this.midActiveIndex = this.today;
        // const today = new Date().getDay();
        // this.today = today ? today - 1 : 6;
        // if (this.schedule.length) {
        //     this.midActiveIndex = this.today;
        //     this.midSwiper.slideTo(this.midActiveIndex, 1000, false);
        // }
    },
    watch: {
        "schedule.length": {
            handler() {
                this.$nextTick(() => {
                    // current swiper instance
                    this.midActiveIndex = this.today;
                    this.midSwiper.slideTo(this.midActiveIndex, 1000, false);
                });
            },
        },
    },
    methods: {
        slideChange() {
            this.midActiveIndex = this.midSwiper.activeIndex; // 滚动到的 slide 的索引
        },
    },
};
</script>

<style lang="less" scoped>
.home-mid {
    width: 650px;
    height: 342px;
    background: #ffffff;
    box-shadow: 0px -5px 12px 0px rgba(60, 128, 209, 0.1);
    border-radius: 16px;
    padding: 20px;
    // display: flex;
    // flex-direction: column;
    touch-action: none;
    .mid-top {
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        i {
            width: 4px;
            height: 20px;
            background: linear-gradient(313deg, #42c2f9 0%, #028efe 100%);
            border-radius: 2px;
            margin-right: 8px;
            margin-top: 2px;
        }
        span {
            font-size: 20px;
            font-weight: 600;
            color: #333333;
        }
    }
    .mid-bottom {
        width: 100%;
        // flex: 1;
        height: calc(100% - 24px);
        // display: flex;
        // flex-direction: column;
        .week {
            width: 100%;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                font-size: 20px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #333333;
            }
        }
        .course {
            // flex: 1;
            height: calc(100% - 20px);
            // padding-top: 16px;
            .swiper-father {
                width: 100%;
                height: 100%;
                position: relative;
                .time-tag {
                    position: absolute;
                    top: 0;
                    left: 35px;
                    // width: 56px;
                    padding-top: 25px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .tag-item {
                        height: 106px;
                        display: flex;
                        align-items: center;
                        span {
                            font-size: 16px;
                            font-weight: 600;
                            color: #333333;
                            // margin-top: 31px;
                        }
                    }
                }
                .swiper {
                    width: 510px;
                    height: 100%;
                    margin: 0 70px;
                    .swiper-wrapper {
                        perspective: 3000;
                        backface-visibility: hidden;
                        // -webkit-perspective: 3000;
                        // -webkit-backface-visibility: hidden;
                        .slide-con {
                            width: 100%;
                            height: 100%;
                            padding-top: 25px;
                            // padding: 0 20px;
                            // margin: 0 10px 0 0;
                            display: flex;
                            flex-wrap: wrap;
                            // flex-direction: column;
                            // justify-content: space-between;

                            align-content: space-between;

                            // .slide-li {
                            //     width: 100%;
                            //     height: 106px;
                            //     display: flex;
                            //     justify-content: space-between;
                            // }
                        }
                    }
                }
                .swiper-button-prev,
                .swiper-button-next {
                    background-image: none;
                    height: 100%;
                    top: 0;
                    margin-top: 0;
                }

                .my-icon {
                    font-size: 40px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    // color: rgba(58, 140, 253);
                    color: #3a8cfd;
                    z-index: 1;
                }

                .icon-right {
                    justify-content: flex-start;
                }
            }
        }
    }
}
</style>