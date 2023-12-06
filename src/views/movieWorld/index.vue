<template>
    <div class="movie-world">
        <!-- 退出按钮 -->
        <div class="out">
            <TButton class="out-button" @touch="$router.back()">
                <img src="~@/assets/img/outCurrent.png" />
            </TButton>
        </div>
        <!-- 左侧列表 -->
        <div class="left-list">
            <ul class="list">
                <li
                    v-for="(item, index) in buttonList"
                    :key="index"
                    v-touch="
                        () => {
                            checkedNum = index;
                        }
                    "
                >
                    <LeftSidebar
                        :text="item"
                        :flag="index === checkedNum"
                    ></LeftSidebar>
                </li>
            </ul>
        </div>
        <!-- 内容展示区 -->
        <div class="content">
            <!-- 视频展示区 -->
            <div class="video-box" v-if="type === 1">
                <div
                    class="video-item"
                    v-for="(item, index) in videoCategory[checkedNum]"
                    :key="index"
                >
                    <div class="title" v-if="isUpdate">
                        {{ item.title | filterName }}
                    </div>
                    <div
                        class="video"
                        v-if="isUpdate"
                        v-touch="
                            () => {
                                videoPreview(item);
                            }
                        "
                    >
                        <img :src="item.thumbnailUrl" />
                        <div class="playing">
                            <img src="~@/assets/img/playing.png" />
                        </div>
                    </div>
                </div>
                <DefalutPage
                    v-if="!videoCategory[checkedNum].length"
                    :config="{ imgName: 'not_content', text: '暂时还没有内容' }"
                />
            </div>
            <!-- 图片展示区 -->
            <div class="img-box" v-else>
                <div
                    class="img-item"
                    v-for="(item, index) in categoryList[checkedNum]"
                    :key="index"
                >
                    <div
                        class="img"
                        v-if="isUpdate"
                        v-touch="
                            () => {
                                imgPreview(item.url);
                            }
                        "
                    >
                        <!-- <img :src="item.url[0]" /> -->
                        <OccupiedPicture
                            :url="item.url[0]"
                            :width="438"
                            :height="246"
                        />
                        <span class="text">{{ item.title | filterName }}</span>
                    </div>
                </div>
                <DefalutPage
                    v-if="!categoryList[checkedNum].length"
                    :config="{ imgName: 'not_content', text: '暂时还没有内容' }"
                />
            </div>
        </div>
        <Loading v-if="loading" />
        <!-- 内容预览区 -->
        <ContentPreview
            v-if="isPreview"
            :type="previewType"
            :url="previewVideo"
            :thumbnailUrl="previewThumbnail"
            :urlList="previewImg"
            @close="isPreview = false"
        ></ContentPreview>
    </div>
</template>

<script>
import LeftSidebar from "@/components/movieWorld/leftSidebar.vue";
import ContentPreview from "@/components/movieWorld/contentPreview.vue";
import { getBlogList } from "@/api/blog";
import DefalutPage from "@/components/publicMethods/DefalutPage.vue";
import OccupiedPicture from "@/components/publicMethods/OccupiedPicture.vue";
import TButton from "@/components/publicMethods/TButton.vue";
import Loading from "@/components/publicMethods/Loading.vue";

export default {
    // 组件名
    name: "MovieWorld",
    // 注册子组件
    components: {
        LeftSidebar,
        ContentPreview,
        DefalutPage,
        OccupiedPicture,
        TButton,
        Loading,
    },
    filters: {
        filterName(key) {
            if (key.indexOf("1^_^2") !== -1) return key.split("1^_^2")[1];
            return key;
        },
    },
    // 组件数据
    data() {
        return {
            buttonList: [], // 左侧列表信息
            checkedNum: 0, // 左侧列表当前点击的id
            reqConfig: {
                // 获取数据所需的配置
                page: 1,
                pageSize: 999,
                schoolCode: this.$store.getters.schoolCode // 学校code 
            },
            isPreview: false, // 是否预览
            previewThumbnail: "", // 要预览的视频封面链接
            previewVideo: "", // 要预览的视频链接
            previewImg: [], // 要预览的图片链接
            type: null, // 用于判断当前页的显示内容 0.图文中国  1.影像世界
            categoryList: [[], [], [], [], []], // 图片数据
            videoCategory: [[], [], [], [], []], // 视频数据
            isUpdate: true, // 判断是否更新
            previewType: -1,
            loading: false,
        };
    },
    methods: {
        // 获取列表数据
        async getBlogList() {
            try {
                this.loading = true;
                const { data } = await getBlogList(this.reqConfig);
                const videoList = data.filter((item) => item.type === 1);
                const imgList = data.filter((item) => item.type === 2);
                // 处理图片数据
                imgList.forEach((item) => {
                    item.url = JSON.parse(item.url);
                    const classify = item.title.split("1^_^2")[0];
                    if (classify === this.buttonList[0]) {
                        this.categoryList[0].push(item);
                    } else if (classify === this.buttonList[1]) {
                        this.categoryList[1].push(item);
                    } else if (classify === this.buttonList[2]) {
                        this.categoryList[2].push(item);
                    } else if (classify === this.buttonList[3]) {
                        this.categoryList[3].push(item);
                    } else if (classify === this.buttonList[4]) {
                        this.categoryList[4].push(item);
                    }
                });
                // 处理视频数据
                videoList.forEach((item) => {
                    const classify = item.title.split("1^_^2")[0];
                    if (classify === this.buttonList[0]) {
                        this.videoCategory[0].push(item);
                    } else if (classify === this.buttonList[1]) {
                        this.videoCategory[1].push(item);
                    } else if (classify === this.buttonList[2]) {
                        this.videoCategory[2].push(item);
                    } else if (classify === this.buttonList[3]) {
                        this.videoCategory[3].push(item);
                    } else if (classify === this.buttonList[4]) {
                        this.videoCategory[4].push(item);
                    }
                });
                this.loading = false;
            } catch (err) {
                this.loading = false;
                this._msg("请求超时，请重试！");
            }
        },
        // 视频预览
        videoPreview(item) {
            // console.log(item);
            // window.WebViewJavascript.gotoPlayVideo(item.url);
            this.previewThumbnail = item.thumbnailUrl;
            this.previewVideo = item.url;
            this.previewImg = [];
            this.previewType = 1;
            this.isPreview = true;
        },
        // 图片预览
        imgPreview(url) {
            // console.log(url);
            this.previewThumbnail = "";
            this.previewVideo = "";
            this.previewImg = url;
            this.previewType = -1;
            this.isPreview = true;
        },
        // 返回上一页
        retreat() {
            this.$router.go(-1);
        },
    },
    created() {
        this.type = parseInt(this.$route.query.type);
        if (this.type === 0) {
            // this.buttonList = ['美丽家乡', '青春风采', '自然地理', '文化经典', '中华美食']
            this.buttonList = [
                "学校风采",
                "特色课程",
                "百科知识",
                "艺术生活",
                "人物故事",
            ];
        } else {
            // this.buttonList = ['学校风采', '特色课程', '百科知识', '艺术生活', '人物故事']
            this.buttonList = [
                "光影记忆",
                "印象中国",
                "健康安全",
                "融媒中心",
                "校园风采",
            ];
        }
        this.getBlogList();
    },
    watch: {
        // 当切换分类时触发
        checkedNum() {
            this.isUpdate = false;
            setTimeout(() => {
                this.isUpdate = true;
            }, 10);
        },
        isPreview(val) {
            const logValue = this.type + 1 + "";
            if (val) {
                this.data_enterPage();
                this.data_triggerEvent({ eventId: "browseContent", logValue });
            } else {
                this.data_exitPage({ eventId: "browseConTime", logValue });
            }
        },
    },
};
</script>

<style lang="less" scoped>
ul {
    margin: 0;
    padding: 0;
}
.movie-world {
    height: 100%;
    display: flex;
    position: relative;
    .text-hint {
        padding: 5px 10px;
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 3px;
        color: #fff;
    }
    .out {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 12px;
        .out-button {
            width: 66px;
            height: 74px;
            background: transparent;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .left-list {
        width: 182px;
        height: 100%;
        padding: 28px 0;
        box-sizing: border-box;
        margin-right: 20px;
        .list {
            width: 100%;
            padding: 26px 0;
            height: 391px;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: 10px;
            li {
                height: 68px;
            }
        }
    }
    .content {
        width: 972px;
        height: 100%;
        padding: 28px 0;
        box-sizing: border-box;
        .video-box {
            width: 100%;
            height: 391px;
            border-radius: 16px;
            background-color: #fff;
            box-sizing: border-box;
            padding: 20px 49px 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            overflow-y: auto;
            .video-item {
                margin-bottom: 20px;
                .title {
                    margin-bottom: 8px;
                    font-size: 18px;
                    color: #333333;
                }
                .video {
                    width: 427px;
                    height: 240px;
                    position: relative;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .playing {
                        width: 40px;
                        height: 40px;
                        position: absolute;
                        bottom: 12px;
                        right: 12px;
                    }
                }
            }
        }
        .img-box {
            height: 391px;
            border-radius: 16px;
            background-color: #fff;
            box-sizing: border-box;
            padding: 20px 34px 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            overflow-y: auto;
            .img-item {
                width: 438px;
                height: 246px;
                margin-bottom: 20px;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 5px 8px 3px #ccc;
                .img {
                    height: 100%;
                    position: relative;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .text {
                        position: absolute;
                        left: 8px;
                        bottom: 8px;
                        font-size: 20px;
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>