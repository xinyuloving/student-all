<template>
    <div
        class="curriculum"
        :style="{
            backgroundImage: `url(${require(`../../assets/img/curriculum/${courseItem.imgSeries}-${courseItem.state}.png`)}`,
        }"
    >
        <span>{{ courseItem.courseName }}</span>
    </div>
</template>

<script>
export default {
    props: {
        courseItem: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style lang="less" scoped>
.curriculum {
    width: 100px;
    height: 106px;
    border-radius: 20px;
    padding: 12px;
    background-position: center center;
    background-repeat: no-repeat;
    margin: 0 13px;
    span {
        font-size: 22px;
        font-weight: 500;
        color: #ffffff;
    }
}
</style>