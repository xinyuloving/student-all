<template>
    <TButton id="quiz-but" @touch="$emit('toAnswer', info.teacherPublishId)">
        <div class="quiz-item" :style="{ background: `url(${require(`../../assets/img/${background}.png`)})`}">
            <!-- 分数 -->
            <div class="score">
                <span v-if="info.score">{{info.score}}</span>
            </div>
            <!-- 试卷名 -->
            <div class="title">{{info.examPaperName}}</div>
            <!-- 第几学周 -->
            <!-- <div class="text">{{info.manyWeeks}}</div> -->
            <!-- 星期 -->
            <!-- <div class="text" v-if="info.week">星期三</div> -->
            <!-- 按钮 -->
            <div class="bottom">{{ info.answerStatus ? '查看' : '去作答' }}</div>
        </div>
    </TButton>
</template>

<script>
import TButton from '@/components/publicMethods/TButton.vue'

export default {
    name: 'QuizItem',
    components: {
        TButton
    },
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            background: ''
        }
    },
    created() {
        if (this.info.teacherPublishId !== -2) {
            this.background = this.info.answerStatus ? 'alreadyRead' : 'nonparticipant'
        } else {
            this.background = 'mistakes'
        }
    },
}
</script>

<style lang="less" scoped>
#quiz-but {
    background: transparent;
    color: #333;
    .quiz-item {
        width: 212px;
        height: 252px;
        background: url('../../assets/img/alreadyRead.png');
        position: relative;
        text-align: center;
        padding-top: 30px;
        margin-right: 15px;
        .score {
            font-size: 40px;
            font-family: HannotateSC-W7, HannotateSC;
            font-weight: normal;
            color: #F35E5E;
            height: 52.8px;
        }
        .bottom {
            color: #fff;
            position: absolute;
            bottom: 14px;
            font-size: 20px;
            left: 12px;
            line-height: 48px;
            width: 186px;
        }
        .title {
            font-size: 22px;
            margin-bottom: 10px;
            padding: 0 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .text {
            font-size: 15px;
            color: #C6C6C6;
            margin-bottom: 3px;
        }
    }
}
    
.error {
    background: url('../../assets/img/mistakes.png');
}
</style>