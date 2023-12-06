<template>
    <div class="my-assignment">
        <Shell :loading="isLoading">
            <template v-slot v-if="leftList.length">
                <Sidebar
                    :list="leftList" 
                    :currentIndex.sync="checkedNum"
                />
                <div class="right-content">
                    <!-- 顶部导航 -->
                    <div class="content-top">
                        <Navigation :list="navigationList"></Navigation>
                    </div>
                    <div class="content-box">
                        <div class="job-item" v-for="(item, index) in assignments" :key="index" v-show="item.subjectCode === subjectCode">
                            <div class="title">{{ item.title }}</div>
                            <div class="assignment-content">
                                <div class="text">{{ item.content }}</div>
                                <div class="img-box">
                                    <OccupiedPicture :height="100" :fileName="item2" v-for="(item2, index2) in item.picture" :key="index2" />
                                </div>
                            </div>
                            <div class="floor-content">发布于{{ item.date }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </Shell>
    </div>
</template>

<script>

import Navigation from "@/components/publicMethods/Navigation.vue"
import { getAssignment } from '@/api/student'
import OccupiedPicture from '@/components/publicMethods/OccupiedPicture.vue'
import { mapState } from 'vuex'
import Shell from '@/components/publicMethods/Shell.vue'
import Sidebar from '@/components/publicMethods/Sidebar.vue'

export default {

    name: 'MyAssignment',

    components: {
        Navigation,
        OccupiedPicture,
        Shell,
        Sidebar
    },

    computed: {
        ...mapState('user', ['subjects'])
    },

    data() {
        return {
            checkedNum: 0,                                    // 左侧栏当前选中的索引
            leftList: [],                                       // 左侧列表数据
            navigationList: ['我的作业'],                      // 面包屑导航数据 
            studentId: this.$store.getters.studentId,         // 学生id  
            schoolCode: this.$store.getters.schoolCode,       // 学校code  
            assignments: [],                                    // 作业列表
            subjectCode: '',
            isLoading: true
        }
    },
    watch: {
        checkedNum(val) {
            this.subjectCode = this.leftList[val].code;
            this.data_triggerEvent({ eventId: 'clickLeftBar', logValue: this.subjectCode })
        }
    },
    methods: {
        // 获取作业
        async getAssignment() {
            try {
                const { data } = await getAssignment();
                if (data.length) {
                    data.forEach(item => {
                        item.picture = item.picture && item.picture.split(',');
                        this.assignments.push(item);
                        this.subjects.forEach(i => {
                            if (item.subjectCode === i.code) this.leftList.push(i)
                        })
                    });
                    this.subjectCode = this.leftList[this.checkedNum].code
                }
                this.isLoading = false;
            } catch(err) {
                // console.log(err);
                this.isLoading = false;
            }
        }
    },
    created() {
        this.getAssignment()
    }
}
</script>

<style lang="less" scoped>
    .my-assignment {
        height: 100%;
        .right-content {
            width: 972px;
            height: 395px;
            background-color: #fff;
            border-radius: 16px;
            padding: 8px 0 20px 35px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            .content-box {
                padding: 30px 50px;
                flex: 1;
                .job-item {
                    height: 100%;
                    .title {
                        text-align: center;
                        line-height: 2;
                        font-size: 26px;
                        font-weight: 600;
                    }
                    .assignment-content {
                        .text {
                            // white-space: pre;
                            font-size: 20px;
                            // line-height: 2;
                            margin-bottom: 10px;
                        }
                        .img-box {
                            display: flex;
                            flex-wrap: wrap;
                            .occupied {
                                margin-right: 10px;
                            }
                        }
                    }
                    .floor-content {
                        font-size: 20px;
                        text-align: right;
                        margin-top: 20px;
                    }
                }
            }
        }
    }
</style>