<template>
    <!-- 首次进入首页时的轮播图 -->
    <div class="display-area" ref="slide">
        <div :class="className" ref="slideChild">
            <div class="carousel-item" v-for="(item, index) in images" :key="index">
                <OccupiedPicture :url="item" :width="1280" :height="480" />
            </div>
        </div>
        <!-- <div class="carousel" ref="slideChild">
            <div class="carousel-item" v-for="(item, i) in imgList" :key="i">
                <OccupiedPicture :imgSrc="require(`@/assets/img/${item}`)" :width="1280" :height="480" />
            </div>
        </div> -->
        <div class="to-home" v-touch="toHome">
            <i class="iconfont icon-home_light"></i>
        </div>
        <div class="floor-tag">
            <div class="tag-item" v-for="(i, index) in total" :key="index" :style="{ background: currentPage === index ? '#fff' : null}"></div>
            <!-- <div class="tag-item" v-for="(i, index) in n" :key="index" :style="{ background: currentPage === index ? '#fff' : null}"></div> -->
        </div>
    </div>
</template>

<script>

import slide from '@/components/mixins/slide'
import { mapMutations, mapState } from 'vuex'
import OccupiedPicture from '@/components/publicMethods/OccupiedPicture.vue'
import TButton from '@/components/publicMethods/TButton.vue'

export default {
    name: 'HomeCarousel',

    mixins: [slide],

    components: {
        OccupiedPicture,
        TButton
    },

    data() {
        return {
            // isShow: false,
            // imgList: ['carousel_3.png', 'carousel_0.png', 'carousel_1.png', 'carousel_2.png', 'carousel_3.png', 'carousel_0.png'],
            // n: 4,
            className: ['carousel']
        }
    },

    computed: {
        ...mapState('carousel', ['images', 'total']),
    },

    methods: {
        ...mapMutations('carousel', ['closeCarousel']),
        toHome() {
            this.data_exitPage('bannerTime');
            this.closeCarousel()
        },
        bannerSlide() {
            this.data_triggerEvent('banner')
        }
    },

    mounted() {
        this.data_enterPage();
        if (this.total > 1) {
            this.slide_mount(this.total, this.bannerSlide);
            this.slide_autoplay();
            this.className.push('carousel-slide')
        }
        // if (this.n) {
        //     this.slide_mount(this.n);
        //     this.slide_autoplay();
        //     console.log('加载完成');
        // }
    },
}
</script>

<style lang="less" scoped>
.display-area {
    position: fixed;
    width: 1280px;
    height: 480px;
    z-index: 1000;
    overflow: hidden;
    background-color: rgba(0, 0, 0, .7);
    top: 0;
    .floor-tag {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        padding: 10px 0;
        .tag-item {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            margin: 0 5px;
            background: rgba(255, 255, 255, .5);
        }
    }
    .to-home {
        position: absolute;
        top: 0;
        left: 0;
        width: 90px;
        height: 90px;
        background-color: rgba(0, 0, 0, .5);
        border-radius: 0 0 90px 0;
        padding: 17px 0 0 17px;
        .iconfont {
            font-size: 40px;
            color: #fff;
        }
    }
    .carousel {
        height: 100%;
        display: flex;
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
        .carousel-item {
            width: 1280px;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .carousel-slide {
        position: absolute;
        left: -1280px;
        top: 0;
    }
}
</style>