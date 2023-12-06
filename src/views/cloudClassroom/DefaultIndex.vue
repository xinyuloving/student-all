<template>
    <div class="default-index">
        <Time />
        <div class="flower" ref="flower">
            <img src="@/assets/img/flower.png" alt="" />
            <span>{{ showFlowerNum }}</span>
        </div>
        <RaiseHand />
        <Reward
            v-if="reward"
            :floTop="floTop"
            :floLeft="floLeft"
            @updateFlowerNum="updateFlowerNum"
        />
    </div>
</template>

<script>
import Time from "@/components/main/Time.vue";
import RaiseHand from "./RaiseHand.vue";
import Reward from "./Reward.vue";
import { mapState } from "vuex";
export default {
    components: {
        Time,
        RaiseHand,
        Reward,
    },
    data() {
        return {
            showFlowerNum: 0,
        };
    },
    computed: {
        ...mapState({
            reward: (state) => state.cloudClassroom.reward,
            // flowerNum: (state) => state.cloudClassroom.flowerNum,
            rewardState: (state) => state.reportedData.reward,
        }),
        floTop() {
            return this.reward ? this.$refs.flower.offsetTop + 17 : "";
        },
        floLeft() {
            return this.reward ? this.$refs.flower.offsetLeft + 6 : "";
        },
    },
    methods: {
        updateFlowerNum() {
            // this.showFlowerNum = this.flowerNum;
            const { personal, answer, wholeClass } = this.rewardState;
            this.showFlowerNum = personal + answer + wholeClass;
        },
    },
};
</script>

<style lang="less" scoped>
.default-index {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .flower {
        // width: 76px;
        height: 34px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 0px 17px 17px 0px;
        position: absolute;
        // top: 36px;
        top: 23px;
        right: 36px;
        z-index: 0;
        display: flex;
        align-items: center;
        img {
            width: 40px;
            height: 40px;
            position: absolute;
            z-index: 2;
            top: -3px;
            left: -12px;
        }
        span {
            font-size: 26px;
            font-weight: 600;
            color: #ffffff;
            // margin-left: 36px;
            margin: 0 20px 0 36px;
        }
    }
}
</style>