<template>
    <div class="notification">
        <Shell :loading="isLoading">
            <template v-slot v-if="notifyList.length">
                <!-- 左侧列表 -->
                <Sidebar 
                    :className="'notification-sidebar'" 
                    :list="notifyList" 
                    :currentIndex.sync="currentIndex"
                    :type="'notify'"
                    @bottomOut="bottomOut"
                />
                <!-- 右侧内容 -->
                <div class="notification-con">
                    <div class="notify-box" v-if="notifyList.length">
                        <div class="notify-title">{{ notifyList[currentIndex].topic }}</div>
                        <div class="notify-con">
                            <p>{{ notifyList[currentIndex].content }}</p>
                            <div class="img-box">
                                <OccupiedPicture 
                                    v-for="(item, index) in notifyList[currentIndex].images"
                                    :key="index"
                                    :height="100"
                                    :fileName="item"
                                />
                            </div>
                        </div>
                        <div class="notify-floor">{{ notifyList[currentIndex].createTime }}</div>
                    </div>
                </div>
            </template>
        </Shell>
    </div>
</template>

<script>
import Shell from '@/components/publicMethods/Shell.vue'
import Sidebar from '@/components/publicMethods/Sidebar.vue'
import { getNotifyList } from '@/api/notify'
import OccupiedPicture from '@/components/publicMethods/OccupiedPicture.vue'

export default {
    name: 'Notification',

    components: {
        Shell,
        Sidebar,
        OccupiedPicture
    },

    watch: {
        currentIndex() {
            this.data_triggerEvent('clickLeftBar')
        }
    },

    data() {
        return {
            currentIndex: 0,
            notifyList: [],
            reqData: {
                schoolCode: this.$store.getters.schoolCode,
                clazzCode: this.$store.getters.classCode,
                gradeCode: this.$store.getters.gradeCode,
                page: 1,
                pageSize: 5
            },
            flag: true,
            isLoading: true
        }
    },
    
    methods: {
        async getNotifyList() {
            try {
                this.flag = false;
                const { data } = await getNotifyList(this.reqData)
                if (data.length) data.forEach(item => {
                    this.notifyList.push({...item, images: JSON.parse(item.images)})
                });
                if (data.length === 5) {
                    this.flag = true
                } else {
                    this.flag = false
                }
                this.isLoading = false;
            } catch(err) {
                // console.log(err);
                this.flag = true;
                this.isLoading = false;
            }
        },
        bottomOut() {
            if (!this.flag) return;
            this.flag = false;
            this.reqData.page++;
            this.getNotifyList();
            // console.log('刷新');
        }
    },

    created() {
        this.flag = false;
        this.getNotifyList()
    },
}
</script>

<style lang="less" scoped>
.notification {
    height: 100%;
    .notification-sidebar {
        width: 310px;
        height: 395px;
    }
    .notification-con {
        width: 848px;
        height: 395px;
        background-color: #fff;
        border-radius: 16px;
        .notify-box {
            width: 100%;
            height: 100%;
            padding: 40px;
            .notify-title {
                font-size: 26px;
                font-weight: 600;
                text-align: center;
                margin-bottom: 30px;
            }
            .notify-con {
                height: 230px;
                overflow-y: auto;
                p {
                    font-size: 22px;
                    color: #666;
                    text-indent: 30px;
                    margin-bottom: 10px;
                }
                .img-box {
                    display: flex;
                    flex-wrap: wrap;
                }
            } 
            .notify-floor {
                font-size: 18px;
                color: #666;
                text-align: right;
            }
        }
    }
}
</style>