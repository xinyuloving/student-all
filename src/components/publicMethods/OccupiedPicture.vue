<template>
    <!-- 占位图 -->
    <div class="occupied">
        <div class="occupied-picture" :style="{ width: occupiedWidth, height: occupiedHeight }" v-if="!isLoad">
            <img src="~@/assets/img/occupy/site.png" :style="{ width: siteWidth }" />
            <div class="spin-box">
                <img class="loading" src="~@/assets/img/occupy/loading.png" :style="{ width: loadingWidth }" />
            </div>
        </div>
        <img class="img-con" :src="imgSrc" v-if="imgSrc" v-show="isLoad" @error="imgErr" @load="imgLoad" :style="{ width: parseInt(width) + 'px', height: parseInt(height) + 'px' }" />
        <img class="img-con" :src="imgUrl" v-if="imgUrl" v-show="isLoad" @error="imgErr" @load="imgLoad" :style="{ width: parseInt(width) + 'px', height: parseInt(height) + 'px' }" />
    </div>
</template>

<script>
import cos from '@/utils/cos'
export default {
    name: 'OccupiedPicture',
    props: {
        width: [String, Number],            // 宽  宽和高不必都传但必传一个
        height: [String, Number],           // 高
        fileName: String,                   // 如果是腾讯云存储中的图片则需要传该图片在腾讯云中的文件名 非必传
        url: String,                        // 图片网络地址  非必传
        imgSrc: String                      // 图片本地地址  非必传
    },
    data() {
        return {
            isLoad: false,
            imgUrl: '',
            occupiedWidth: '',
            occupiedHeight: '',
            siteWidth: '',
            loadingWidth: ''
        }
    },
    methods: {
        async getUrlByCos() {
            try {
                const res = await cos.getObjectUrl({
                    type: 0,
                    key: this.fileName
                })
                this.imgUrl = res.Url
            } catch(err) {
                // console.log(err);
            }
        },
        imgLoad() {
            this.isLoad = true;
        },
        imgErr() {
            // console.log('加载失败');
        }
    },
    created() {
        if (this.width && !this.height) {
            const w = parseInt(this.width);
            this.occupiedWidth = w + 'px';
            this.occupiedHeight = w * 0.66 + 'px';
            this.siteWidth = w / 2 + 'px';
            this.loadingWidth = w / 4 + 'px'
        } else if (!this.width && this.height) {
            const h = parseInt(this.height);
            this.occupiedHeight = h + 'px';
            this.occupiedWidth = h * 1.5 + 'px';
            this.siteWidth = (h * 1.5) / 2 + 'px';
            this.loadingWidth = (h * 1.5) / 4 + 'px'
        } else if (this.width && this.height) {
            const w = parseInt(this.width);
            const h = parseInt(this.height);
            this.occupiedHeight = h + 'px';
            this.occupiedWidth = w + 'px';
            this.siteWidth = w / 2 + 'px';
            this.loadingWidth = w / 4 + 'px'
        }
        if (this.url) {
            this.imgUrl = this.url
        } else if (this.fileName) {
            this.getUrlByCos()
        }
    }
}
</script>

<style lang="less" scoped>
.occupied {
    margin-right: 10px;
    .occupied-picture {
        background-color: #e4e4e4;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .spin-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            // animation: spin 1s linear infinite;
            .loading {
                animation: spin 1s linear infinite;
            }
        }
    }
    .img-con {
        object-fit: cover;
    }
}
@keyframes spin {
    0% {
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>