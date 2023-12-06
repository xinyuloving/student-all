<template>
    <div :class="['sidebar', className]" :style="styleInfo" @scroll="listScroll">
        <div 
            :class="['sidebar-list-item', type]" 
            :style="itemStyle" 
            v-for="(item, index) in list" 
            :key="index" 
            v-touch="() => { changeIndex(index) }"
        >
            <NotifySidevarItem :notifyInfo="item" :flag="index === currentIndex" v-if="type === 'notify'"/>
            <SidebarItem :text="item[k]" :flag="index === currentIndex" v-else/>
        </div>
    </div>
</template>

<script>
import SidebarItem from './SidebarItem.vue'
import NotifySidevarItem from '../notification/notifySidevarItem.vue'

export default {
    name: 'Sidebar',

    props: {
        className: String,
        styleInfo: Object,
        itemStyle: Object,
        list: Array,
        currentIndex: Number,
        type: String,
        k: {
            type: String,
            default: () => 'name'
        }
    },

    components: {
        SidebarItem,
        NotifySidevarItem
    },

    methods: {
        changeIndex(index) {
            if (index === this.currentIndex) return;
            this.$emit('update:currentIndex', index)
        },
        listScroll(e) {
            const el = e.srcElement;
            if (el.offsetHeight + el.scrollTop >= el.scrollHeight - 50) {
                this.$emit('bottomOut')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.sidebar {
    width: 182px;
    height: 395px;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px 0;
    overflow-y: auto;
    position: relative;
    .sidebar-list-item {
        height: 68px;
    }
    .notify {
        height: 94px;
    }
    .sidebar-loading {
        position: sticky;
        left: 0;
        bottom: 0;
        height: 20px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
            animation: spin 1s linear infinite;
        }
    }
}
@keyframes spin {
    0% {}
    100% {
        transform: rotate(360deg);
    }
}
</style>