<template>
    <!-- 缺省页 -->
    <div class="defalut-page">
        <div class="occupy-img">
            <img :style="{ width: w + 'px' }" :src="require(`@/assets/img/occupy/${config.imgName ? config.imgName : 'not_content'}.png`)" />
        </div>
        <div class="text-content">{{ config.text ? config.text : '暂时还没有内容' }}</div>
        <div class="floor" v-if="config.imgName === 'not_network'">
            <TButton class="refresh" @touch="$emit('refresh')">立即刷新</TButton>
        </div>
    </div>
</template>

<script>
import TButton from './TButton.vue'
export default {
    name: 'DefalutPage',

    components: {
        TButton
    },

    props: {
        config: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            w: 0,
        }
    },

    mounted() {
        const w = document.querySelector('.defalut-page').offsetWidth;
        this.w = parseInt(w / 6.5);
    }
}
</script>

<style lang="less" scoped>
.defalut-page {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text-content {
        color: #666;
        margin-bottom: 20px;
    }
    .floor {
        .refresh {
            width: 120px;
            height: 30px;
            border-radius: 5px;
        }
    }
}
</style>