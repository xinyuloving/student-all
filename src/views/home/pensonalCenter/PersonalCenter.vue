<template>
    <div class="personal-center" v-if="userInfo.id">
        <!-- 退出按钮 -->
        <div class="out">
            <div class="out-button" v-touch="returnPage">
                <img src="@/assets/img/outCurrent.png" />
            </div>
        </div>
        <div class="introduce">
            <div class="container">
                <div class="left-con">
                    <div class="top-left">
                        <div class="avatar">
                            <img
                                :src="
                                    require(`@/assets/img/studentAvatar/${userInfo.avatar}.png`)
                                "
                                alt=""
                            />
                        </div>
                    </div>
                    <div class="top-right">
                        <div class="name">
                            <span>{{ userInfo.realName }}</span>
                        </div>
                        <div class="grade_info">
                            <!-- <span>{{ userInfo.introduction }}</span> -->
                            <span>{{
                                `${userInfo.grade.gradeName}${userInfo.clazz.clazzName}`
                            }}</span>
                        </div>
                        <ul class="reward">
                            <li>
                                <img src="@/assets/img/medal/1.png" />
                                <span>{{ userInfo.redFlowerNum }}</span>
                            </li>
                            <!-- 职务 -->
                            <!-- <li>
                                <img src="@/assets/img/medal/2.png" />
                                <span>{{ position }}</span>
                            </li> -->
                        </ul>
                    </div>
                </div>
                <div class="mid-line"></div>
                <div class="bottom">
                    <div class="nickname">
                        <span class="title">昵称：</span>
                        <span class="con">
                            <span
                                class="share_con"
                                v-touch.prevent.stop="
                                    () => {
                                        openInputModel(1);
                                    }
                                "
                                >{{ nickName }}</span
                            >
                            <span class="tips"
                                ><span class="high_light">{{
                                    nickName ? nickName.length : 0
                                }}</span
                                >/8</span
                            >
                        </span>
                    </div>
                    <div class="signature">
                        <span class="title">个性签名：</span>
                        <span class="con">
                            <!-- <span class="share_con">{{
                                userInfo.signature
                            }}</span> -->
                            <span
                                class="share_con"
                                v-touch.prevent.stop="
                                    () => {
                                        openInputModel(2);
                                    }
                                "
                                >{{ signature }}</span
                            >
                            <span class="tips"
                                ><span class="high_light">{{
                                    signature ? signature.length : 0
                                }}</span
                                >/32</span
                            >
                        </span>
                    </div>
                    <div class="back">
                        <button v-touch="back">退出登录</button>
                    </div>
                </div>
                <div class="figure">
                    <img
                        :src="
                            require(`@/assets/img/student_figure/${userInfo.figure}.png`)
                        "
                        alt=""
                    />
                </div>
            </div>
        </div>
        <div class="medal">
            <div class="top-medal">
                <div class="decoration">
                    <span>奖章</span>
                    <ul class="list-group">
                        <li v-for="item in options" :key="item.id">
                            <img :src="item.imgUrl" alt="" />
                            <p>{{ item.content }}</p>
                        </li>
                    </ul>
                </div>
                <div class="habit">
                    <span>习惯勋章</span>
                    <div class="eye">
                        <img src="@/assets/img/medal/eyeshield.png" alt="" />
                        <p>护眼达人</p>
                    </div>
                </div>
            </div>
            <div class="bottom-evaluate">
                <span>教师评语</span>
                <div class="tea-evaluate">
                    <div class="evaluate-zhang">
                        <i>张老师：上课认真听讲,发言积极</i>
                    </div>
                    <div class="evaluate-liu"><i>刘老师：作业认真完成</i></div>
                    <div class="evaluate-xie">
                        <i>谢老师：热爱劳动，积极帮助同学</i>
                    </div>
                    <div class="evaluate-sun">
                        <i>孙老师：表现一直都很棒</i>
                    </div>
                </div>
            </div>
        </div>
        <InputModel
            :value="inputField === 1 ? nickName : signature"
            :maxlength="maxlength"
            :visible.sync="visible"
            @submit="submit"
        />
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { modifyPersonalized } from "@/api/user";
import NewComer from "@/assets/img/medal/new-comer.png";
import Study from "@/assets/img/medal/study-the-quartet.png";
import Thumb from "@/assets/img/medal/thumb-up-good.png";
import InputModel from "@/components/main/InputModel.vue";
export default {
    components: { InputModel },
    name: "PersonalCenter",
    created() {
        this.position = this.$store.getters.position;
        this.nickName = this.userInfo.nickName;
        this.signature = this.userInfo.signature;
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo,
        }),
        maxlength() {
            return this.inputField === 1 ? 8 : 32;
        },
    },
    data() {
        return {
            options: [
                { id: 1, content: "初来乍到", imgUrl: NewComer },
                { id: 2, content: "游学四方", imgUrl: Study },
                { id: 3, content: "点赞能手", imgUrl: Thumb },
            ],
            position: "",
            visible: false,
            inputField: 1, // 1 代表昵称，2 代表个性签名
            nickName: "",
            signature: "",
        };
    },
    methods: {
        ...mapMutations({
            // removeToken: "user/removeToken",
            setState: "user/setState",
        }),
        ...mapActions({
            SKIP_LOGIN: "user/SKIP_LOGIN",
        }),
        // 返回上一页
        returnPage() {
            this.$router.go(-1);
        },
        // 退出登录
        async back() {
            // this.removeToken();
            // window.WebViewJavascript.exit();
            // window.WebViewJavascript.login();
            try {
                await this.tim.logout();
            } finally {
                this.SKIP_LOGIN();
            }
        },
        async submit(value) {
            this[this.inputField === 1 ? "nickName" : "signature"] = value;
            const { nickName, signature, inputField } = this;
            try {
                const params = {
                    account: this.userInfo.studentAccount,
                    nickName,
                    personalSignature: signature,
                };
                await modifyPersonalized(params);
                const data = {
                    objKey: "userInfo",
                    key: inputField === 1 ? "nickName" : "signature",
                    value: inputField === 1 ? nickName : signature,
                };
                this.setState(data);
            } catch (error) {
                // console.log(error);
            }
        },
        openInputModel(flag) {
            this.inputField = flag;
            this.visible = true;
        },
    },
};
</script>
<style lang="less" scoped>
.personal-center {
    width: 100%;
    height: 448px;
    display: flex;
    align-items: center;
    .out {
        height: 448px;
        display: flex;
        align-items: center;
        margin-right: 20px;
        .out-button {
            width: 66px;
            height: 74px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .introduce {
        width: 557px;
        height: 387px;
        background: #ffffff;
        box-shadow: 0px 5px 12px 0px rgba(60, 128, 209, 0.1);
        border-radius: 16px;
        position: relative;
        .container {
            width: 100%;
            height: 100%;
            .left-con {
                display: flex;
                align-items: center;
                .top-left {
                    margin: 23px 21px 22px 32px;
                    .avatar {
                        width: 95.34px;
                        height: 95.34px;
                        border-radius: 50%;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                .top-right {
                    .name {
                        margin-top: 33px;
                        span {
                            font-size: 20px;
                            font-weight: 600;
                            color: #333333;
                        }
                    }
                    .grade_info {
                        display: flex;
                        // margin-top: 12px;
                        margin-top: 8px;
                        span {
                            width: 130px;
                            font-size: 16px;
                            font-weight: 400;
                            color: #666666;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .reward {
                        margin-top: 12px;
                        display: flex;
                        li {
                            display: flex;
                            align-items: center;
                            margin-bottom: 6px;
                            display: flex;
                            img {
                                width: 24px;
                                height: 24px;
                                margin-right: 10px;
                            }
                            span {
                                width: 70px;
                                font-size: 16px;
                                font-weight: 500;
                                color: #333333;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                    }
                }
            }
            .mid-line {
                width: 327px;
                height: 1px;
                background: #e7e7e7;
                margin: 0 30px 19px 32px;
            }
            .bottom {
                padding-left: 32px;
                .nickname,
                .signature {
                    // width: 327px;
                    // margin-left: 32px;
                    display: flex;
                    .title {
                        width: 90px;
                        font-size: 18px;
                        font-weight: 600;
                        color: #333333;
                        margin-right: 12px;
                    }
                    .con {
                        flex: 1;
                        // width: calc(327px - 90px - 32px);
                        display: flex;
                        .share_con {
                            width: 176px;
                            height: 34px;
                            border-radius: 4px;
                            border: 1px solid #d6d6d6;
                            font-size: 18px;
                            color: #333333;
                            line-height: 32px;
                            padding: 0 12px;
                            margin-right: 12px;
                            overflow-x: scroll;
                        }
                        .tips {
                            font-size: 16px;
                            font-weight: 400;
                            color: #333333;
                            display: flex;
                            align-items: flex-end;
                            .high_light {
                                color: #2499ff;
                            }
                        }
                    }
                }
                .nickname {
                    align-items: center;
                    height: 34px;
                }
                .signature {
                    margin-top: 12px;
                    // height: auto;
                    display: flex;
                    .con {
                        .share_con {
                            height: 118px;
                            line-height: 28px;
                        }
                    }
                    // width: 340px;
                    // margin-left: 32px;
                    // height: 50px;
                    // margin-top: 28px;
                    // display: flex;
                    // .title {
                    //     font-size: 18px;
                    //     font-weight: 600;
                    //     color: #333333;
                    // }
                    // .sign-con {
                    //     width: 242px;
                    //     height: 64px;
                    //     span {
                    //         display: inline-block;
                    //         width: 160px;
                    //         height: 48px;
                    //         font-size: 16px;
                    //         font-weight: 400;
                    //         color: #0b334f;
                    //     }
                    // }
                }
                .back {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    height: 30px;
                    margin-top: 22px;
                    button {
                        width: 92px;
                        height: 30px;
                        border-radius: 15px;
                        opacity: 1;
                        background-color: transparent;
                        border-style: none;
                        background-color: rgba(250, 109, 49, 0.2);
                        color: #f35b28;
                        font-size: 16px;
                        font-weight: 600;
                    }
                }
            }
            .figure {
                width: 170px;
                height: 314px;
                position: absolute;
                right: 7px;
                top: 14px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .medal {
        width: 581px;
        height: 387px;
        background: #ffffff;
        box-shadow: 0px 5px 12px 0px rgba(60, 128, 209, 0.1);
        border-radius: 16px;
        margin-left: 23px;
        .top-medal {
            display: flex;
            .decoration {
                margin-top: 33px;
                span {
                    margin-left: 28px;
                    //   margin-bottom: 8px;
                    font-size: 20px;
                    font-weight: 600;
                    color: #333333;
                }
                .list-group {
                    margin-top: 8px;
                    margin-left: 28px;
                    display: flex;
                    width: 360px;
                    height: 132px;
                    background: #f6f6f6;
                    border-radius: 17px;
                    align-items: center;
                    justify-content: space-around;
                    li {
                        img {
                            width: 104px;
                            height: 96px;
                        }
                        p {
                            text-align: center;
                            font-size: 16px;
                            font-weight: 400;
                            color: #333333;
                        }
                    }
                }
            }
            .habit {
                margin-top: 33px;
                margin-left: 26px;
                width: 135px;
                height: 192px;
                span {
                    //   margin-left: 28px;
                    font-size: 20px;
                    font-weight: 600;
                    color: #333333;
                }
                .eye {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 135px;
                    height: 132px;
                    margin-top: 8px;
                    background: #f6f6f6;
                    border-radius: 17px;
                    img {
                        width: 104px;
                        height: 96px;
                        margin: 9px 15px 0 16px;
                    }
                    p {
                        font-size: 16px;
                        font-weight: 400;
                        color: #333333;
                    }
                }
            }
        }
        .bottom-evaluate {
            span {
                font-size: 20px;
                font-weight: 600;
                color: #333333;
                margin-top: 22px;
                margin-left: 28px;
            }
            .tea-evaluate {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-evenly;
                align-items: flex-end;
                height: 90px;
                margin-top: 10px;
                .evaluate-zhang {
                    width: 302px;
                    height: 30px;
                    background: #eaf6ff;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 14px;
                    i {
                        font-style: normal;
                        margin-left: 16px;
                    }
                }
                .evaluate-liu {
                    width: 212px;
                    height: 30px;
                    background: #eaf6ff;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 14px;
                    i {
                        font-style: normal;
                        margin-left: 16px;
                    }
                }
                .evaluate-xie {
                    width: 302px;
                    height: 30px;
                    background: #eaf6ff;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 14px;
                    i {
                        font-style: normal;
                        margin-left: 16px;
                    }
                }
                .evaluate-sun {
                    width: 212px;
                    height: 30px;
                    background: #eaf6ff;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 14px;
                    i {
                        font-style: normal;
                        margin-left: 16px;
                    }
                }
            }
        }
    }
}
</style>
