import store from "@/store"
import { mapState, mapMutations } from 'vuex'
import { uploadLogEvent, uploadLogEventList } from '@/api/phenixLog'

export const data_uploadData = (obj = {}, n = 0, res) => {

    return new Promise(async (resolve) => {
        try {
            if (n === 0)
                res = resolve;
            await uploadLogEvent(JSON.stringify(obj));
            res();
        } catch (err) {
            if (n < 2) {
                data_uploadData(obj, ++n, res)
            } else {
                res();
            }
        }
    })
}

export async function data_batchUpload(n = 0) {
    try {
        // const logEventUploadDTOList = this.$store.state.reportedData.dataList;
        const logEventUploadDTOList = store.state.reportedData.dataList;
        if (!logEventUploadDTOList.length) return;
        // console.log(logEventUploadDTOList);
        await uploadLogEventList(JSON.stringify({ logEventUploadDTOList }));
        store.commit("reportedData/setDataList");
        // this.setDataList()
    } catch (err) {
        if (n < 2) {
            data_batchUpload(++n)
        } else {
            // this.setDataList();
            store.commit("reportedData/setDataList");
        }
    }
}

export default {
    data() {
        return {
            data_enterTime: 0,
            data_dataInfo: {
                appId: 1,
                platformId: 2,
                pageId: ''
            }
        }
    },
    computed: {
        // ...mapState('user', ['studentAccount'])
        ...mapState({
            studentAccount: state => state.user.studentAccount,
            _gradeName: state => state.user.userInfo.grade.gradeName,
            _className: state => state.user.userInfo.clazz.clazzName
        })
    },
    methods: {
        ...mapMutations('reportedData', ['setDataList']),
        // 进入页面记录进入时间
        data_enterPage() {
            this.data_enterTime = new Date().getTime();
        },
        // 退出页面
        /******
         * 
         * @param {Object, String} data 事件数据 如果只有event_id可传string 否则传object
         * isBatch false --> 立即上传
         * *******/
        data_exitPage(data = {}, isBatch = false) {
            const exitTime = new Date().getTime();
            const time = exitTime - this.data_enterTime;
            if (typeof data === 'string') {
                const obj = {
                    ...this.data_dataInfo,
                    logTime: exitTime,
                    userId: this.studentAccount,
                    gradeName: this._gradeName,
                    className: this._className,
                    extraInfo: { time },
                    eventId: data,
                };
                if (isBatch) return this.setDataList(obj);
                data_uploadData(obj)
            } else {
                const obj = {
                    ...this.data_dataInfo,
                    logTime: exitTime,
                    userId: this.studentAccount,
                    gradeName: this._gradeName,
                    className: this._className,
                    extraInfo: { time },
                    ...data
                };
                if (isBatch) return this.setDataList(obj);
                data_uploadData(obj)
            }
        },
        // 事件埋点
        /******
         * 
         * @param {Object, String} data 事件数据 如果只有event_id可传string 否则传object
         * 
         * *******/
        data_triggerEvent(data = {}, isBatch = false) {
            const time = new Date().getTime();
            if (typeof data === 'string') {
                const obj = {
                    ...this.data_dataInfo,
                    logTime: time,
                    userId: this.studentAccount,
                    gradeName: this._gradeName,
                    className: this._className,
                    eventId: data,
                }
                if (isBatch) return this.setDataList(obj);
                data_uploadData(obj)
            } else {
                const obj = {
                    ...this.data_dataInfo,
                    logTime: time,
                    userId: this.studentAccount,
                    gradeName: this._gradeName,
                    className: this._className,
                    ...data
                }
                if (isBatch) return this.setDataList(obj);
                return data_uploadData(obj)
            }
        },
        // async data_uploadData(obj = {}) {
        //     try {
        //         console.log(obj);
        //     } catch (err) {
        //         console.log(err);
        //     }
        // },
        // async data_batchUpload(n = 0) {
        //     try {
        //         const logEventUploadDTOList = this.$store.state.reportedData.dataList;
        //         if (!logEventUploadDTOList.length) return;
        //         // console.log(logEventUploadDTOList);
        //         await uploadLogEventList(JSON.stringify({ logEventUploadDTOList }));
        //         this.setDataList()
        //     } catch (err) {
        //         if (n < 2) {
        //             this.data_batchUpload(++n)
        //         } else {
        //             this.setDataList()
        //         }
        //     }
        // }
    },
    created() {
        const routeName = this.$route?.name;
        switch (routeName) {
            case 'HomeIndex':
                this.data_dataInfo.pageId = 'home';
                break;
            case 'StudyAide':
                this.data_dataInfo.pageId = 'studyAide';
                break;
            case 'ClassroomTest':
                this.data_dataInfo.pageId = 'classroomTest';
                break;
            case 'movieWorld':
                this.data_dataInfo.pageId = 'movieWorld';
                break;
            case 'Notification':
                this.data_dataInfo.pageId = 'notification';
                break;
            case 'MyAssignment':
                this.data_dataInfo.pageId = 'myAssignment';
                break;
            case 'CloudClassroom':
                this.data_dataInfo.pageId = 'cloudClassroom';
                break;
            case 'ClassReport':
                this.data_dataInfo.pageId = 'classReport';
                break;
            default:
                break;
        }
    }
}