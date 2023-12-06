import { getCourseByClass, getScheduleTime } from "@/api/school"
import moment from "moment"

const state = {
    schedule: [], // 课程表
    timeList: [], // 课表时间
    today: 0,
}

const mutations = {
    setState(state, data) {
        state[data.key] = data.value;
    },
    setActiveCourse(state, data) {
        const { today } = data;
        const todayCourseList = state.schedule[today - 1].courseList;
        const currentTime = Date.now();
        // const targetIndex = todayCourseList.findIndex(item => item.state === 1);
        // console.log(targetIndex);
        // const boolean = todayCourseList[targetIndex].time[0] > currentTime && currentTime < todayCourseList[targetIndex].time[1];

        // ---------------------------
        // let action = true; // 开关
        // for (let i = 0; i < todayCourseList.length; i++) {
        //     const e = todayCourseList[i];
        //     if (action) {
        //         if (e.state === 1) {
        //             const timeTarget = timeList.find(item => item.courseNum === e.courseNum);
        //             const boolean = currentTime > timeTarget.timeStamp[0] && currentTime < timeTarget.timeStamp[1];
        //             if (boolean) {
        //                 // break;
        //                 return;
        //             } else {
        //                 // 找下一个满足条件的课程
        //                 e.state = 0;
        //                 action = false;
        //             }
        //         }
        //     } else {
        //         console.log("action 为 false");
        //         if (e.courseNum !== "") {
        //             e.state = 1;
        //         }
        //         return;
        //     }
        // }
        // --------------------------

        // 先通过时间判断目前该上哪节课 ------------------
        // const timeTarget = timeList.find(item => currentTime > item.timeStamp[0] && currentTime < item.timeStamp[1]);
        // const activeCurrent = todayCourseList.find(item => item.state === 1);
        // if (timeTarget) {
        //     // 再比对当前state为1的课程courseNum是否与timeTarget的courseNum相同

        //     const target = todayCourseList.find(item => item.courseNum === timeTarget.courseNum); // 当前处于哪节课
        //     if (target.courseCode !== "") {
        //         if (target.state !== 1) {
        //             target.state = 1;
        //         }
        //     }

        //     // if (activeCurrent) {
        //     //     if (target.courseNum !== activeCurrent.courseNum) {
        //     //         if (target.courseCode !== "") {
        //     //             if (target.state !== 1) {
        //     //                 target.state = 1;
        //     //             }
        //     //         }
        //     //         activeCurrent.state = 0;
        //     //     }
        //     // }

        // } else {
        //     // 课间
        //     if (activeCurrent) {
        //         activeCurrent.state = 0;
        //     }
        // }
        // if (activeCurrent) {
        //     const timeCurrent = timeList.find(item => item.courseNum === activeCurrent.courseNum);
        //     if (currentTime > timeCurrent[1]) {
        //         activeCurrent.state = 0;
        //     }
        // }

        // ----------------------

        // 先找当前有没有激活的课程
        const activeIndex = todayCourseList.findIndex(item => item.state === 1);
        if (activeIndex !== -1) {
            // 判断是否还满足激活条件
            // const timeTarget = timeList.find(item => item.courseNum === todayCourseList[activeIndex].courseNum);
            // const boolean = currentTime > todayCourseList[activeIndex].timeStamp[0] && currentTime < todayCourseList[activeIndex].timeStamp[1];
            const boolean = currentTime < todayCourseList[activeIndex].timeStamp[1];
            if (!boolean) {
                // 不满足条件
                todayCourseList[activeIndex].state = 0;
                // 不满足条件的话就找下一个即将上课的课程
                // const nextGoal = activeIndex !== todayCourseList.length - 1 ? todayCourseList[activeIndex + 1] : undefined;
                // if (nextGoal) {
                //     const nextBool = nextGoal.courseCode && currentTime > nextGoal.timeStamp[0] && currentTime < nextGoal.timeStamp[1]
                //     if (nextBool) {
                //         nextGoal.state = 1;
                //     }
                // }
                for (let index = activeIndex + 1; index < todayCourseList.length; index++) {
                    const e = todayCourseList[index];
                    if (e) {
                        if (e.courseCode) {
                            if (e.state === 2) {
                                e.state = 1;
                                break;
                            }
                        } else {
                            continue;
                        }
                    }
                }
            }
            // return;
        } else {
            // 没有激活的 就判断当前时间是否有满足条件(时间对的上且courseCode !== "")的课程
            const goal = todayCourseList.find(item =>
                item.courseCode && currentTime > item.timeStamp[0] && currentTime < item.timeStamp[1]
            )
            if (goal) {
                goal.state = 1;
            }
        }











        // const targetIndex = todayCourseList.findIndex(item => item.state === 1);
        // console.log(targetIndex);
        // const boolean = todayCourseList[targetIndex].time[0] > currentTime && currentTime < todayCourseList[targetIndex].time[1];





        // -----------------------
        // const target = todayCourseList.find(item => item.state === 1);
        // if (target) {
        //     const timeTarget = state.timeList.find(item => item.courseNum === target.courseNum);


        //     const boolean = timeTarget.time[0] > currentTime && currentTime < timeTarget.time[1];
        //     if (!boolean) {
        //         target.state = 0;
        //         const nextCourse = todayCourseList.find((ele, index) => {
        //             if (index > targetIndex) {
        //                 if (ele.courseCode !== "") {
        //                     return ele;
        //                 }
        //             }
        //         })
        //         if (target) {
        //             target.state = 1;
        //         }
        //     }
        // } else {

        // }
        // ------------------------------


        // if (boolean) {
        //     return;
        // } else {
        //     todayCourseList[targetIndex].state = 0;
        //     const target = todayCourseList.find((ele, index) => {
        //         if (index > targetIndex) {
        //             if (ele.courseCode !== "") {
        //                 return ele;
        //             }
        //         }
        //     })
        //     if (target) {
        //         target.state = 1;
        //     }



        //     // 拿到当前课表的第一个非暂无的待上的课(如果今天没有的话就去下一天找)
        //     // for (let i = data.today - 1; i < state.schedule.length; i++) {
        //     //     const e = state.schedule[i];
        //     //     if (targetIndex === 7) {
        //     //         continue;
        //     //     } else {
        //     //         let target;
        //     //         if (i === data.today - 1) {
        //     //             // 今天的课
        //     //             target = e.courseList.find((ele, index) => {
        //     //                 if (index > targetIndex) {
        //     //                     if (ele.courseCode !== "") {
        //     //                         return ele;
        //     //                     }
        //     //                 }
        //     //             })
        //     //         } else {
        //     //             target = e.courseList.find(ele => ele.courseCode !== "");
        //     //         }
        //     //         if (target) {
        //     //             target.state = 1;
        //     //             break;
        //     //         } else {
        //     //             continue;
        //     //         }
        //     //     }
        //     // }
        // }
    },
    handleCurrentCourse(state, data) {
        // 处理当天的课程
        const { today, timeList } = data;
        // console.log(today, timeList);
        const todayCourseList = state.schedule[today - 1].courseList;
        // console.log(todayCourseList);
        const currentTime = Date.now();
        let switchFlag = false; // 如果没有正在上课的，那么就将即将上课的那节state标记为1
        for (let i = 0; i < timeList.length; i++) {
            const e = timeList[i];
            const target = todayCourseList.find(item => item.courseNum === e.courseNum);
            target.time = [e.startTime, e.endTime];
            target.timeStamp = e.timeStamp;
            const boolean = currentTime > e.timeStamp[0] && currentTime < e.timeStamp[1];

            if (target.courseCode) {
                if (boolean) {
                    target.state = 1;
                    switchFlag = true;
                } else {
                    if (e.timeStamp[0] > currentTime) {
                        if (!switchFlag) {
                            target.state = 1;
                            switchFlag = true;
                        } else {
                            target.state = 2;
                        }
                    }
                }
            }
        }
        // for (let i = 0; i < timeList.length; i++) {
        //     const e = timeList[i];
        //     const boolean = currentTime > e.timeStamp[0] && currentTime < e.timeStamp[1];
        //     const course = todayCourseList.find(item => item.courseNum === e.courseNum);
        //     if (course.courseCode) {
        //         if (boolean) {
        //             course.state = 1;
        //         } else {
        //             if (e.timeStamp[0] > currentTime) {
        //                 course.state = 2;
        //             }
        //         }

        //     }
        // }
    }
}

const actions = {
    async getCourse({ commit, rootGetters }) {
        const { schoolCode, gradeCode, classCode } = rootGetters;
        const { data } = await getCourseByClass({ schoolCode, gradeCode, classCode });

        // const timeArr = [];
        // const defaultTimeList = [["8:00", "8:45"], ["9:00", "9:45"], ["10:00", "10:45"], ["11:00", "11:45"], ["14:00", "14:45"], ["15:00", "15:45"], ["16:00", "16:45"], ["17:00", "17:45"]];
        // for (let i = 1; i <= 8; i++) {
        //     if (timeList.length !== 8) {
        //         const t = timeList.find(item => item.courseNum === i);
        //         if (t) {
        //             temArr.push(t)
        //         } else {
        //             temArr.push({
        //                 courseNum: i,
        //                 startTime: defaultTimeList[i - 1][0],
        //                 endTime: defaultTimeList[i - 1][1],
        //             })
        //         }
        //     } else {
        //         break;
        //     }
        // }

        const weekList = ["一", "二", "三", "四", "五", "六", "日"];
        const defaultCourse = {
            "语文": 1,
            "数学": 2,
            "英语": 3,
            "体育": 4,
            "思想品德": 5,
            "音乐": 6,
            "美术": 7,
            "信息技术": 8,
        }
        const courseKeys = Object.keys(defaultCourse);
        const day = new Date().getDay();
        const today = day ? day : 7;
        commit("setState", { key: "today", value: today })
        const temArr = [];
        for (let i = 1; i <= 7; i++) {
            const temObj = {
                week: i,
                weekName: `星期${weekList[i - 1]}`,
                courseList: []
            }
            for (let j = 1; j <= 8; j++) {
                const t = data.find(item => item.courseNum === j);
                const defaultObj = {
                    courseNum: j,
                    courseName: "暂无",
                    teacherName: "",
                    teacherId: "",
                    courseCode: "",
                    state: 0, // 0 已经上完的课；1 正在上课；2 还未开始
                    imgSeries: 0, // 系统定义了8种课：1 --> 语文；2 --> 数学；3 --> 英语；4 --> 体育；5 --> 思想品德；6 --> 音乐； 7 --> 美术； 8 --> 信息技术； 0 --> 缺省
                }
                if (t) {
                    const courseIndex = t.infos.findIndex(ele => ele.week === i);
                    if (courseIndex !== -1) {
                        defaultObj.courseName = t.infos[courseIndex].courseName;
                        defaultObj.teacherName = t.infos[courseIndex].teacherName;
                        defaultObj.teacherId = t.infos[courseIndex].teacherId;
                        defaultObj.courseCode = t.infos[courseIndex].courseCode;
                        const imgIndex = courseKeys.findIndex(item => item.includes(t.infos[courseIndex].courseName))
                        defaultObj.imgSeries = imgIndex !== -1 ? defaultCourse[courseKeys[imgIndex]] : 0;
                        // 设置状态
                        if (i > today) {
                            defaultObj.state = 2;
                        }
                        // ----------
                        if (i === today) {
                            defaultObj.time = [];
                            defaultObj.timeStamp = [];
                        }
                        t.infos.splice(courseIndex, 1);
                    }
                } else {

                }
                temObj.courseList.push(defaultObj)
            }
            temArr.push(temObj);
        }
        commit("setState", { key: "schedule", value: temArr })
        const { data: timeList } = await getScheduleTime({ schoolCode })
        const year = moment().format("YYYY/MM/DD");
        // 将时间与课表合并
        timeList.forEach(time => {
            time.timeStamp = [new Date(year + " " + time.startTime).getTime(), new Date(year + " " + time.endTime).getTime()]
        })
        // 处理当天的课程 0 1 2
        commit("handleCurrentCourse", { today, timeList });
        // ------------
        commit("setState", { key: "timeList", value: timeList });
        window.scheduleTimer = setInterval(() => {
            // 设置当天课表的激活状态
            // 先根据当前时间判断该上是第几节课
            commit("setActiveCourse", { today })
        }, 1 * 60000)

    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}