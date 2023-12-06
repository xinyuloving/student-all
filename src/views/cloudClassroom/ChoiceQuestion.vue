<template>
    <div class="choice-question">
        <!-- 选择题答题器 -->
        <div
            :class="['main', { 'main-dis': buttonDis }]"
            :style="{
                padding: options.length > 4 ? '57px 100px' : '0 26px',
                justifyContent:
                    options.length > 4 ? 'space-between' : 'space-around',
                alignItems: options.length > 4 ? '' : 'center',
            }"
        >
            <div class="row" v-for="(e, i) in formatOptions" :key="i">
                <TopicOptions
                    v-for="item in e"
                    :item="item"
                    :key="item.content"
                    :proportion="options.length <= 4 ? 1 : 2"
                />
            </div>
        </div>
        <div
            :class="[
                'bottom',
                {
                    'submit-style': submitActive === 1,
                    'button-dis': buttonDis,
                },
            ]"
            v-touch="handleSubmit"
        >
            <span>{{
                submitState === 0
                    ? "提交答案"
                    : submitState === 1
                    ? "提交成功"
                    : "提交超时"
            }}</span>
        </div>
    </div>
</template>

<script>
import TopicOptions from "@/components/main/TopicOptions.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("cloudClassroom");
import { insertDom } from "@/utils/util";
export default {
    components: {
        TopicOptions,
    },
    created() {
        // 时长埋点
        this.data_enterPage();
    },
    computed: {
        ...mapState({
            options: (state) => state.choice.options,
            submitActive: (state) => state.choice.submitActive,
            buttonDis: (state) => state.choice.buttonDis,
            submitState: (state) => state.choice.submitState,
        }),
        formatOptions() {
            return this.options.length > 4
                ? [this.options.slice(0, 4), this.options.slice(4)]
                : [this.options];
        },
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
    },
    methods: {
        ...mapActions({
            choiceSubmit: "choice/choiceSubmit",
        }),
        handleSubmit() {
            // 点击提交按钮后完成埋点
            this.choiceSubmit({
                buriedPointCb: () => {
                    // 埋点函数
                    this.data_exitPage(
                        {
                            eventId: "answerTime",
                            logValue: "2",
                        },
                        true
                    );
                    // console.log("选择题的时长埋点执行完成！ --------->");
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
.choice-question {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 9;
    display: flex;
    overflow: hidden;
    background-color: #1b1a21;
    .main {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        // align-items: center;
        transition: all 0.5s;
        .row {
            // width: auto;
            display: flex;
            // justify-content: space-between;
            justify-content: flex-start;
            align-items: center;
        }
    }
    .main-dis {
        transform: translateX(94px);
    }
    .bottom {
        width: 188px;
        height: 100%;
        background: #535378;
        transition: all 0.5s;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            font-size: 36px;
            font-weight: 500;
            color: #ffffff;
        }
    }
    .submit-style {
        background: #2499ff;
    }
    .button-dis {
        transform: translateX(100%);
    }
}
</style>