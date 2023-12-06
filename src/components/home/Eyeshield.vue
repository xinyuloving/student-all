<template>
    <!-- 护眼弹框 -->
    <TDialog :diaShow.sync="isShow" :clickMaskHide="true">
        <div class="box">
            <div class="img-box">
                <img src="../../assets/img/eyeshield.png" />
            </div>
            <div class="text">小可爱，你已经观看屏幕太久了，快闭眼休息！</div>
        </div>
    </TDialog>
</template>

<script>

import TDialog from '@/components/publicMethods/TDialog.vue'

export default {
    name: 'Eyeshield',

    components: {
        TDialog
    },

    data() {
        return {
            isShow: false
        }
    },
// 1800000
    watch: {
        isShow: {
            handler(val) {
                if (val) return;
                let timer = setTimeout(() => {
                    this.isShow = true;
                    this.data_triggerEvent('eyeProtectionReminder');
                    clearTimeout(timer)
                }, 1800000);
            },
            immediate: true
        }
    },
}
</script>

<style lang="less" scoped>
    .box {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 80px;
        .text {
            font-size: 26px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
        }
        .img-box {
            position: absolute;
            top: -32px;
            left: -60px;
            img {
                width: 129.6px;
            }
        }
    }
</style>