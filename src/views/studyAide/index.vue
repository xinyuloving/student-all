<template>
    <!-- 学习助手 -->
    <div class="study-aide" v-if="previewType === -1">
        <!-- 退出按钮 -->
        <div class="out">
            <TButton class="out-button" @touch="$router.back()">
                <img src="~@/assets/img/outCurrent.png" />
            </TButton>
        </div>
        <!-- 左侧列表 -->
        <div class="left-list" v-if="isNet">
            <div class="left-list-item" v-for="(item, index) in leftList" :key="index" v-touch="() => { subUpdate(index) }">
                <LeftSidebar :text="item.name" :flag="index === checkedNum"></LeftSidebar>
            </div>
        </div>
        <!-- 右侧内容 -->
        <div class="right-content" v-if="isNet">
            <!-- 顶部导航 -->
            <div class="content-top">
                <Navigation :list="navigationList"></Navigation>
            </div>
            <div class="content-box" v-if="!isDpage">
                <StudyItem
                    @preview="preview"
                    v-for="(item, index) in coursewareList"
                    :key="index"
                    :item="item"
                ></StudyItem>
            </div>
            <DefalutPage v-else @refresh="flush" :config="DefalutPageConfig" />
        </div>
        <Loading v-show="isLoading" />
        <DefalutPage v-if="!isNet" :config="{imgName: 'not_content', text: '暂时还没有内容'}" />
    </div>
    <!-- 预览页 -->
    <ContentPreview v-else-if="previewType > -1" @out="previewType = -1" :type="previewType" :url="previewUrl" @close="previewType = -1" />
</template>

<script>

import LeftSidebar from "@/components/movieWorld/leftSidebar.vue"
import Navigation from "@/components/publicMethods/Navigation.vue"
import StudyItem from "@/components/studyAide/studyItem.vue"
import { getCoursewareList, getSubjectList } from '@/api/studyAide'
import Loading from '@/components/publicMethods/Loading.vue'
import ContentPreview from '@/components/movieWorld/contentPreview.vue'
import cos from "@/utils/cos"
import DefalutPage from '@/components/publicMethods/DefalutPage.vue'
import TButton from '@/components/publicMethods/TButton.vue'
// import Shell from '@/components/publicMethods/Shell.vue'
// import Sidebar from '@/components/publicMethods/Sidebar.vue'

export default {

    name: 'StudyAide',

    components: {
        LeftSidebar,
        Navigation,
        StudyItem,
        Loading,
        ContentPreview,
        DefalutPage,
        TButton,
        // Shell,
        // Sidebar
    },

    data() {
        return {
            checkedNum: 0,                                    // 左侧栏当前选中的索引
            leftList: [],                                     // 左侧列表数据
            navigationList: ['学习助手'],                      // 面包屑导航数据 
            previewType: -1,                                  // 是否预览
            previewUrl: "",                                   // 预览的链接
            isLoading: false,                                 // 是否显示loading效果
            studentId: this.$store.getters.studentId,         // 学生id  
            schoolCode: this.$store.getters.schoolCode,       // 学校code  
            coursewareList: [],                               // 课件列表 
            DefalutPageConfig: {
                imgName: 'not_content',
                text: '暂时还没有内容'
            },
            isDpage: false,
            isNet: true                          
        }
    },

    methods: {
        flush() {
            this.isLoading = true;
            this.getCoursewareList()
        },
        // 科目发生改变
        subUpdate(index) {
            if (this.checkedNum === index) return;
            this.checkedNum = index;
            this.isLoading = true;
            this.getCoursewareList()
        },
        // 预览
        async preview(obj) {
            try {
                // console.log(obj);
                this.isLoading = true;
                let myUrl = '';
                if (obj.type) {
                    const res = await cos.getObjectUrl({
                        type: 0,
                        key: obj.cosName,
                    })
                    myUrl = res.Url;
                } else {
                    // 获取签名
                    const res = await cos.previewTheDocument({
                        type: 0,
                        key: obj.cosName
                    });
                    myUrl = res
                }
                // console.log(myUrl);
                this.data_triggerEvent('browse');
                this.previewUrl = myUrl;
                this.previewType = obj.type;
                this.isLoading = false;
            } catch(err) {
                this.isLoading = false;
                // console.log(err);
            }
        },
        // 获取学科列表
        async getSubjectList() {
            try {
                this.isLoading = true;
                const res = await getSubjectList({
                    classCode: this.$store.getters.classCode,
                    gradeCode: this.$store.getters.gradeCode,
                    schoolCode: this.schoolCode
                })
                if (res.code === 0 && res.data.length) {
                    this.leftList = res.data;
                    this.getCoursewareList();
                    this.isNet = true;
                }else {
                    throw new Error()
                }
            } catch(err) {
                setTimeout(() => {
                    this.isLoading = false;
                    this.isNet = false;
                }, 300);
                // console.log(err);
            }
        },
        // 获取课件列表
        async getCoursewareList() {
            try {
                const { data } = await getCoursewareList({
                    classCode: this.$store.getters.classCode,
                    gradeCode: this.$store.getters.gradeCode,
                    subjectCode: this.leftList[this.checkedNum].code,
                    schoolCode: this.schoolCode
                })
                if (data && data.length) {
                    this.coursewareList = data
                    this.isDpage = false;
                } else {
                    this.DefalutPageConfig = { 
                        imgName: 'not_content',
                        text: '暂时还没有内容'
                    }
                    this.isDpage = true;
                    this.coursewareList = []
                }
                this.isLoading = false;
            } catch(err) {
                this.DefalutPageConfig = {
                    imgName: 'not_network',
                    text: '网络飞走了，刷新试试吧'
                }
                this.isDpage = true;
                setTimeout(() => {
                    this.isLoading = false;
                }, 300);
                // console.log(err);
            }
        } 
    },

    created() {
        this.getSubjectList();
        this.data_enterPage()
    },
    beforeDestroy() {
        this.data_exitPage('browseTime')
    }
}
</script>

<style lang="less" scoped>
    .study-aide {
        display: flex;
        height: 100%;
        padding-right: 28px;
        .out {
            width: 78px;
            display: flex;
            align-items: center;
            .out-button {
                width: 66px;
                height: 74px;
                background: transparent;
            }
        }
        .left-list {
            width: 182px;
            height: 395px;
            background-color: #fff;
            border-radius: 10px;
            margin-top: 29px;
            margin-right: 20px;
            padding-top: 20px;
            overflow-y: auto;
            .left-list-item {
                height: 68px;
            }
        }
        .right-content {
            flex: 1;
            margin: 29px 0;
            height: 395px;
            background-color: #fff;
            border-radius: 16px;
            padding: 8px 0 20px 35px;
            display: flex;
            flex-direction: column;
            .content-box {
                display: flex;
                flex-wrap: wrap;
                overflow-y: auto;
            }
        }
    }
    .refresh {
        width: 120px;
        height: 30px;
        background-color: #2499ff;
        color: #fff;
        border-radius: 5px;
    }
</style>