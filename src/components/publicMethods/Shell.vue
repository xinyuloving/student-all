<template>
    <div class="shell">
        <!-- 退出按钮 -->
        <div class="out">
            <TButton class="out-button" @touch="$router.back()">
                <img src="~@/assets/img/outCurrent.png" />
            </TButton>
        </div>
        <div class="slot-box">
            <slot>
                <DefalutPage />
            </slot>
        </div>
        <Loading v-if="loading"/>
    </div>
</template>

<script>
import TButton from '@/components/publicMethods/TButton.vue'
import DefalutPage from './DefalutPage.vue'
import Loading from './Loading.vue'

export default {
    name: 'Shell',

    components: {
        TButton,
        DefalutPage,
        Loading
    },

    props: {
        loading: {
            type: Boolean,
            default: () => false
        }
    },
}
</script>

<style lang="less" scoped>
.shell {
    display: flex;
    height: 100%;
    .out {
        width: 78px;
        display: flex;
        align-items: center;
        .out-button {
            background: transparent;
        }
    }
    .slot-box {
        flex: 1;
        height: 100%;
        padding: 29px 28px 0 0;
        display: flex;
        justify-content: space-between;
    }
}
</style>