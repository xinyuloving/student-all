<template>
    <div class="drop-down">
        <!-- <select v-model="value">
            <option value="wo">wo</option>
            <option value="yy">yy</option>
            <option value="cc">cc</option>
            <option value="dd">dd</option>
        </select> -->
        <div class="select" v-touch="() => { opacity = 1 }">
            <span class="text">{{value}}</span>
            <ul class="options" :style="{ opacity: opacity }" v-touch.stop>
                <li v-touch="() => { select(item) }" v-for="(item, index) in list" :key="index">{{item}}</li>
            </ul>
            <span class="right"></span>
        </div>
    </div>
</template>

<script>
const myBody = document.querySelector('bofdy');
export default {
    name: 'DropDown',
    props: {
        list: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            value: '',
            opacity: 0
        }
    },
    methods: {
        select(val) {
            // console.log(myBody);
            this.value = val;
            this.$emit('valueUpdate', this.value)
        }
    },
    created() {
        this.value = this.list[0]
    }
}
</script>

<style lang="less" scoped>
ul {
    padding: 0;
    margin: 0;
}
.drop-down {
    .select {
        width: 193px;
        height: 40px;
        line-height: 40px;
        background: #FFFFFF;
        border-radius: 6px;
        border: 1px solid #BDBDBD;
        padding-left: 10px;
        position: relative;
        .text {
            max-width: 150px;
            line-height: 40px;
        }
        .right {
            border: 6px solid transparent;
            border-top: 9px solid #979797;
            border-bottom: 9px;
            position: absolute;
            top: 50%;
            margin-top: -4px;
            right: 10px;
        }
        .options {
            transition: opacity .5s;
            position: absolute;
            top: 45px;
            left: 0;
            background-color: #fff;
            border-radius: 5px;
            width: 100%;
            box-shadow: 0px 2px 10px 2px #ccc;
            li {
                line-height: 40px;
                padding: 0 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>