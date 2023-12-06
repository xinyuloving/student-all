<template>
    <div class="sidebar-item" :style="myStyle">
        <div class="backdrop" :style="{ opacity: opacity }"></div>
        {{text}}
    </div>
</template>

<script>
export default {
    name: 'SidebarItem',
    props: {
        text: {
            type: String,
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
    }
}
</script>

<style lang="less" scoped>
.sidebar-item {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: 24px;
    color: #333333;
    transition: all .3s;
    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 8px;
        height: 100%;
        border-radius: 5px;
        background: linear-gradient(313deg, #42C2F9 0%, #028EFE 100%);
        transition: all .3s;
    }
}
</style>