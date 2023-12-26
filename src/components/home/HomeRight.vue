<template>
    <div class="home-right">
        <div class="right-top">
            <i></i>
            <span>应用工具</span>
            <span>&nbsp;&nbsp;&nbsp;IM: {{ isOnIM() ? 'on' : 'off' }}</span>
        </div>
        <div class="right-bottom">
            <swiper
                :options="rightSwiperOption"
                class="right-swiper"
                ref="rightSwiper"
            >
                <swiper-slide v-for="item in tools" :key="item.id">
                    <ul class="slide-con">
                        <li
                            class="list"
                            v-for="ele in item.toolList"
                            :key="ele.id"
                            v-touch="
                                () => {
                                    toolItemTouch(item.id, ele.id);
                                }
                            "
                        >
                            <TButton class="item-but">
                                <img
                                    :src="
                                        require(`../../assets/img/tools/${ele.imgUrl}.png`)
                                    "
                                />
                            </TButton>
                            <span>{{ ele.content }}</span>
                        </li>
                    </ul>
                </swiper-slide>
                <div
                    class="swiper-pagination pagination"
                    slot="pagination"
                ></div>
            </swiper>
        </div>
    </div>
</template>

<script>
// 引入插件
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import TButton from "@/components/publicMethods/TButton.vue";
export default {
    components: {
        swiper,
        swiperSlide,
        TButton,
    },
    inject: ['isOnIM'],
    data() {
        return {
            rightSwiperOption: {
                loop: false,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true, //允许分页点击跳转
                },
            },
            tools: [
                // 分页的 做成计算属性，点击后去原数组找对应的 item，不这样做的话，就在方法中传两个id
                {
                    id: 1,
                    toolList: [
                        {
                            id: 1,
                            imgUrl: "1",
                            content: "学习助手",
                        },
                        {
                            id: 2,
                            imgUrl: "2",
                            content: "随堂测试",
                        },
                        {
                            id: 3,
                            imgUrl: "3",
                            content: "图文中国",
                        },
                        {
                            id: 4,
                            imgUrl: "4",
                            content: "影像世界",
                        },
                    ],
                },
                {
                    id: 2,
                    toolList: [
                        {
                            id: 1,
                            imgUrl: "8",
                            content: "通知",
                        },
                        {
                            id: 2,
                            imgUrl: "6",
                            content: "我的作业",
                        },
                        // {
                        //     id: 3,
                        //     imgUrl: "7",
                        //     content: "课堂报告",
                        // },
                        {
                            id: 4,
                            imgUrl: "9",
                            content: "设置",
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        toolItemTouch(itemId, eleId) {
            // 工具栏每项的点击事件
            // console.log(itemId);
            if (itemId === 1 && eleId === 1) {
                // 1 -- 1 代表 学习助手按钮
                this.$router.push({ path: "/studyAide" });
            } else if (itemId === 1 && eleId === 2) {
                // 1 -- 2 代表 随堂测试按钮
                this.$router.push({ path: "/classroomTest" });
            } else if (itemId === 1 && eleId === 3) {
                // 1 -- 3 代表 图文中国按钮
                this.$router.push({ path: "/movieWorld", query: { type: 0 } });
            } else if (itemId === 1 && eleId === 4) {
                // 1 -- 4 代表 影像世界按钮
                this.$router.push({ path: "/movieWorld", query: { type: 1 } });
            } else if (itemId === 2 && eleId === 1) {
                // 2 -- 1 代表 通知按钮
                this.$router.push({ path: "/notification" });
            } else if (itemId === 2 && eleId === 2) {
                // 2 -- 2 代表 我的作业按钮
                this.$router.push({ path: "/myAssignment" });
            } else if (itemId === 2 && eleId === 3) {
                // 2 -- 3 代表 课堂报告按钮
                this.$router.push({ path: "/classReport" });
            } else if (itemId === 2 && eleId === 4) {
                // 2 -- 4 代表 设置按钮
                this.$emit("openSetting", true);
            }
        },
    },
};
</script>

<style lang="less" scoped>
.home-right {
    width: 220px;
    height: 342px;
    background: #ffffff;
    box-shadow: 0px 5px 12px 0px rgba(60, 128, 209, 0.1);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    touch-action: none;
    .right-top {
        width: 100%;
        display: flex;
        align-items: center;
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
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
        }
    }
    .right-bottom {
        width: 100%;
        flex: 1;
        padding-top: 20px;
        .right-swiper {
            width: 100%;
            height: 100%;
            .swiper-wrapper {
                perspective: 3000;
                backface-visibility: hidden;
                .slide-con {
                    height: 225px;
                    width: 100%;
                    padding: 0 6px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-content: space-between;
                    .list {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        width: 82px;
                        height: 104px;
                        .item-but {
                            background: transparent;
                        }
                        img {
                            width: 82px;
                            height: 82px;
                        }
                        span {
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #333333;
                            width: 100%;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
            .pagination {
                bottom: 0;
            }
        }
    }
}
</style>