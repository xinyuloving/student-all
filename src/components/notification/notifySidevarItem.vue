<template>
    <div class="notify-sidevar-item" :style="myStyle">
        <div class="backdrop" :style="{ opacity: opacity }"></div>
        <div class="item-box">
            <!-- <span class="sign"></span> -->
            <div class="item-top">
                <span class="teacher-name">{{ notifyInfo.topic | topicFilter }}：</span>
                <span class="time">{{ notifyInfo.createTime }}</span>
            </div>
            <div class="item-bot">{{ notifyInfo.content }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotifySidevarItem',

    props: {
        notifyInfo: {
            type: Object,
            required: true
        },
        flag: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            myStyle: {
                color: '#333333',
                backgroundColor: '#fff'
            },
            opacity: 0
        }
    },
    watch: {
        flag: {
            immediate: true,
            handler() {
                if (this.flag) {
                    this.myStyle.color = '#0E98FD';
                    this.myStyle.backgroundColor = '#DAF0FF';
                    this.opacity = 1
                } else {
                    this.myStyle.color = '#333333';
                    this.myStyle.backgroundColor = '#fff';
                    this.opacity = 0
                }
            }
        }
    },

    filters: {
        topicFilter(val) {
            if (val.length > 4) {
                return val.slice(0, 3) + '...'
            } else {
                return val
            }
        }
    }
}
</script>

<style lang="less" scoped>
.notify-sidevar-item {
    height: 100%;
    padding: 20px;
    display: flex;
    position: relative;
    font-size: 24px;
    color: #333333;
    transition: all .3s;
    &::after {
        content: '';
        width: 90%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 5%;
        background: #F1F1F1;
    }
    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 100%;
        border-radius: 5px;
        background: linear-gradient(313deg, #42C2F9 0%, #028EFE 100%);
        transition: all .3s;
    }
    .item-box {
        display: flex;
        flex-direction: column;
        height: 100%;
        flex: 1;
        line-height: 1.5;
        .item-top {
            display: flex;
            justify-content: space-between;
        }
        .sign {
            width: 8px;
            height: 8px;
            position: absolute;
            top: 30px;
            left: 6px;
            border-radius: 50%;
            background: #FF7468;
        }
        .teacher-name {
            font-size: 20px;
            font-weight: 500;
        }
        .item-bot {
            width: 270px;
            font-size: 18px;
            color: #666;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .time {
            font-size: 16px;
            color: #666;
        }
    }
}
</style>