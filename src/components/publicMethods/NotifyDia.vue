<template>
    <div class="notify-dia" :style="styleObj" v-if="isShow" v-touch="toNotify">
        <img src="~@/assets/img/remind.png" />
        <span>叮咚，小可爱，你有一条通知请及时查看哦</span>
    </div>
</template>

<script>
export default {
    props: {
        isShow: Boolean
    },
    data() {
        return {
            styleObj: {
                top: '-50px',
                opacity: 0
            },
            timer: null
        }
    },
    watch: {
        isShow(val) {
            if (this.$route.name === 'CloudClassroom') return this.$emit('update:isShow', false);
            if (val) {
                const timer1 = setTimeout(() => {
                    this.styleObj.top = '50px';
                    this.styleObj.opacity = 1
                    clearTimeout(timer1)
                }, 0);
                this.timer = setTimeout(() => {
                    this.leave();
                    clearTimeout(this.timer)
                }, 5000);
            }
        }
    },
    methods: {
        leave() {
            this.styleObj.top = '-50px';
            this.styleObj.opacity = 0;
            setTimeout(() => {
                this.$emit('update:isShow', false)
            }, 300);
        },
        toNotify() {
            clearTimeout(this.timer);
            this.leave();
            this.$router.push({ name: 'Notification' })
        }
    }
}
</script>

<style lang="less" scoped>
.notify-dia {
    width: 615px;
    padding: 4px 35px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0px 0px 12px 0px #D7DCDF;
    display: flex;
    align-items: center;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    transition: all .3s;
    span {
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 22px;
    }
}
</style>