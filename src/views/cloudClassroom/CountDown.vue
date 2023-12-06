<template>
    <div class="count-down" v-drag>
        <!-- 倒计时组件 -->
        <div
            :class="[
                'count-item',
                {
                    active: s <= 5,
                },
            ]"
        >
            <span>{{ firstItem }}</span>
        </div>
        <div
            :class="[
                'count-item',
                {
                    active: s <= 5,
                },
            ]"
        >
            <span>{{ secondItem }}</span>
        </div>
        <div class="colon">
            <span>:</span>
        </div>
        <div
            :class="[
                'count-item',
                {
                    active: s <= 5,
                },
            ]"
        >
            <span>{{ thirdItem }}</span>
        </div>
        <div
            :class="[
                'count-item',
                {
                    active: s <= 5,
                },
            ]"
        >
            <span>{{ fourthItem }}</span>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
import { insertDom } from "@/utils/util";
import drag from "@/directive/drag";
export default {
    directives: {
        drag,
    },
    data() {
        return {
            firstItem: 0,
            secondItem: 0,
            thirdItem: 0,
            fourthItem: 0,
            s: 0,
        };
    },
    computed: {
        ...mapState({
            time: (state) => state.time,
        }),
    },
    created() {
        this.firstItem = this.time[0];
        this.secondItem = this.time[1];
        this.thirdItem = this.time[2];
        this.fourthItem = this.time[3];
        this.s =
            this.firstItem * 600 +
            this.secondItem * 60 +
            this.thirdItem * 10 +
            this.fourthItem;
        // console.log(this.s);
        this.countDownTimer = setInterval(() => {
            this.s--;
            if (this.s === 0) {
                clearInterval(this.countDownTimer);
                this.setState({ key: "time", value: [] });
            }
            this.formatTime();
        }, 1000);
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
    },
    methods: {
        ...mapMutations({
            setState: "setState",
        }),
        formatTime() {
            // 将时间转换成秒
            const f = parseInt(this.s / 60); // 前两位
            const t = this.s - f * 60; // 后两位

            const str1 = f >= 10 ? `${f}` : `0${f}`;
            const str2 = t >= 10 ? `${t}` : `0${t}`;

            this.firstItem = str1[0];
            this.secondItem = str1[1];
            this.thirdItem = str2[0];
            this.fourthItem = str2[1];
        },
    },
    beforeDestroy() {
        clearInterval(this.countDownTimer);
    },
};
</script>

<style lang="less" scoped>
.count-down {
    width: 246px;
    height: 140px;
    background: #24242c;
    box-shadow: 0px 3px 12px 0px rgba(24, 22, 34, 0.6);
    border-radius: 11px;
    border: 1px solid #4d4d5d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    position: absolute;
    z-index: 9;
    // top: 50%;
    top: 170px;
    left: 50px;
    // transform: translateY(-50%);
    .count-item {
        width: 40px;
        height: 58px;
        background: #595972;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background 0.3s;
        span {
            color: #fff;
            font-size: 34px;
            font-weight: 600;
        }
    }
    .active {
        background: #d14a4e;
    }
    .colon {
        span {
            color: #fff;
            font-size: 34px;
            font-weight: 600;
        }
    }
}
</style>