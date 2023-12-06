<template>
    <div class="navigation">
        <span v-touch="() => { $router.push({path: '/'}) }">首页</span>
        <span v-for="(item, index) in list" :key="index"> &gt; {{item}}</span>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    props: {
        list: {
            type: Array,
            required: true
        }
    }
}
</script>

<style lang="less" scoped>
.navigation {
    font-size: 14px;
    color: #c6c6c6;
}
</style>