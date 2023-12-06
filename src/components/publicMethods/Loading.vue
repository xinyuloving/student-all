<template>
    <div class="loading">
        <div class="img-box">
            <img src="~@/assets/img/loading.png" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading'
}
</script>

<style lang="less" scoped>
.loading {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    img {
        animation: spin 1s linear infinite;
    }
}

@keyframes spin {
    0% {
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>