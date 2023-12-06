<template>
    <div class="content-preview" v-touch="touchEvent">
        <!-- 预览文档 -->
        <div class="iframe-box" v-if="type === 0">
            <iframe
                :src="url"
                frameborder="0"
                width="100%"
                height="100%"
                @load="
                    () => {
                        $emit('iframeLoad');
                    }
                "
            ></iframe>
            <TButton class="out-button" @touch="$emit('iframeLoad')">
                <img src="~@/assets/img/outCurrent.png" />
            </TButton>
        </div>
        <!-- 如果预览的是视频 -->
        <div class="video-box" v-else-if="type === 1">
            <video
                :src="url"
                autoplay="autoplay"
                controls
                v-touch.stop
                :poster="thumbnailUrl"
                controlsList="nodownload"
            ></video>
        </div>
        <!-- 预览图片 -->
        <div :class="classNames" v-else-if="type === 2">
            <img ref="img" :src="url" :style="imgStyle" @load="imgLoad"/>
        </div>
        <!-- 音频 -->
        <div class="audio-box" v-else-if="type === 3">
            <audio :src="url" autoplay controls></audio>
        </div>
        <!-- 预览的是一组图片 -->
        <div class="img-box" v-else>
            <div class="middle" ref="slide">
                <div class="carousel" :style="styleName" ref="slideChild">
                    <div
                        class="item"
                        v-for="(item, index) in urlList"
                        :key="index"
                    >
                        <img :src="item" :style="imgStyle" @load="imgLoad" />
                    </div>
                </div>
                <ul class="dot" v-if="urlList.length > 1">
                    <li
                        v-for="(item, index) in urlList.length"
                        :key="index"
                        :style="{
                            backgroundColor:
                                currentPage === index ? '#fff' : '',
                        }"
                    ></li>
                </ul>
            </div>
        </div>
        <Loading v-if="loading" v-touch.stop/>
    </div>
</template>

<script>
import slide from "@/components/mixins/slide";
import { changeStatusBar } from "@/utils/util";
import TButton from '@/components/publicMethods/TButton.vue'
import Loading from '@/components/publicMethods/Loading.vue'

export default {
    name: "ContentPreview",
    components: {
        TButton,
        Loading
    },
    mixins: [slide],
    props: {
        url: String,
        urlList: Array,
        thumbnailUrl: String,
        type: Number, // 预览文件的类型 0: 文档  1: 视频  2：图片  3：音频
    },
    data() {
        return {
            // isPlay: false,
            styleName: {
                // 储存图片的容器的样式
                width: null,
                left: null,
            },
            // timer: null,
            // imgH: '100%'
            imgStyle: {
                maxWidth: '100%',
                maxHeight: '100%'
            },
            loading: false,
            classNames: ['sola-img']
        };
    },
    created() {
        changeStatusBar(false);
        if (this.urlList) {
            this.styleName.width = this.urlList.length * 1280 + "px";
            // this.urlList.forEach((item) =>
            //     this.dotList.push({ backgroundColor: null })
            // );
        }
    },
    mounted() {
        switch (this.type) {
            case 0:
            case 1:
            case 3:
                break;
            case 2:
                this.loading = true;
                break;
            default:
                this.atlas()
                break;
        }
    },
    beforeDestroy() {
        changeStatusBar(true);
    },
    methods: {
        touchEvent() {
            // if (this.timer) {
            //     clearTimeout(this.timer);
            //     this.timer = null;
            //     this.doubleClick()
            // } else {
            //     this.timer = setTimeout(() => {
            //         this.$emit('close');
            //         clearTimeout(this.timer);
            //         this.timer = null;
            //     }, 300);
            // }
            this.$emit('close');
        },
        // doubleClick() {
        //     this.imgH = this.imgH ? null : '100%';
        // },
        imgLoad(e) {
            const w = e.target.width;
            const h = e.target.height;
            if ((h / w) > 1.5) {
                this.classNames.push('long-img')
                this.imgStyle.maxHeight = null
            } else {
                this.classNames.push('normal-img')
            }
            this.loading = false
        },
        atlas() {
            if (this.urlList.length <= 1) return this.loading = true;
            this.slide_mount();
        }
    }
};
</script>

<style lang="less" scoped>
ul {
    margin: 0;
    padding: 0;
}
.content-preview {
    width: 100vw;
    height: 100vh;
    background-color: #0e0e0e;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .iframe-box {
        height: 100%;
        width: 100%;
        text-align: center;
        position: relative;
        .out-button {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
        }
    }
    .video-box {
        height: 100%;
        text-align: center;
        position: relative;
        // img {
        //     height: 100%;
        //     object-fit: contain;
        // }
        video {
            height: 100vh;
            object-fit: contain;
        }
        video::-webkit-media-controls-enclosure {
            overflow: hidden;
        }
        // video::-webkit-media-controls-panel {
        //     width: calc(100% + 30px);
        // }
        video::-webkit-media-controls-fullscreen-button {
            display: none;
        }
    }
    .sola-img {
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .normal-img {
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    .long-img {
        overflow-y: auto;
    }
    .img-box {
        height: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .middle {
            width: 1280px;
            height: 100%;
            overflow: hidden;
            position: relative;
            .carousel {
                height: 100%;
                display: flex;
                position: absolute;
                top: 0;
                left: 0;
                transition: 0.3s linear;
                .item {
                    width: 1280px;
                    height: 100%;
                    overflow-y: auto;
                    text-align: center;
                    // display: flex;
                    // align-items: center;
                    // justify-content: center;
                    // img {
                    //     width: 100%;
                    //     object-fit: contain;
                    // }
                }
            }
            .dot {
                display: flex;
                justify-content: center;
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                li {
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    margin: 0 7px;
                    background-color: rgba(0, 0, 0, 0.5);
                }
            }
        }
        // .left,
        // .right {
        //     width: 68px;
        //     height: 68px;
        //     border-radius: 50%;
        //     img {
        //         width: 100%;
        //         height: 100%;
        //     }
        //     .rotate {
        //         transform: rotate(180deg);
        //     }
        // }
    }
}
</style>