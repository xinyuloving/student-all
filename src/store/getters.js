const getters = {
    token: state => state.user.token,
    studentId: state => state.user.studentId,
    IMSdkState: state => state.imStore.IMSdkState,
    groupId: state => state.imStore.groupId,
    studentList: state => state.cloudClassroom.studentList,
    // quantity: state => state.staticData.quantity,
    position: state => state.staticData.position,
    answerList: state => state.classroomTest.answerList,
    schoolCode: state => state.user.schoolCode,
    gradeCode: state => state.user.userInfo.grade.gradeCode,
    classCode: state => state.user.userInfo.clazz.clazzCode,
    imID: state => state.user.userInfo.im_id
}
export default getters
