<template>
    <div class="home-left">
        <div
            class="container"
            v-if="userInfo.realName && isInitStudentSuccess"
            v-touch="personal"
        >
            <div class="left-con">
                <div class="avatar">
                    <img
                        :src="
                            require(`@/assets/img/studentAvatar/${userInfo.avatar}.png`)
                        "
                        alt=""
                    />
                </div>
                <div class="name">
                    <span>{{ userInfo.realName }}</span>
                </div>
                <div class="nickName">
                    <span>{{ userInfo.nickName }}</span>
                </div>
                <ul class="reward">
                    <!-- <li v-for="item in userInfo.rewardList" :key="item.id">
            <img
              :src="require(`../../assets/img/medal/${item.rewardUrl}.png`)"
              alt=""
            />
            <span>{{ item.content }}</span>
          </li> -->

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
                <div class="signature">
                    <span class="title">个性签名</span>
                    <div class="sign-con">
                        <span>{{ userInfo.signature }}</span>
                    </div>
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
        <div v-else-if="isInitStudentSuccess"></div>
        <div class="fail" v-else>
            <span>获取用户信息失败！</span>
            <TButton class="btn" @touch="loginAgain">重新登录</TButton>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import TButton from "../publicMethods/TButton.vue";
export default {
    components: {
        TButton,
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo,
            isInitStudentSuccess: (state) => state.user.isInitStudentSuccess,
        }),
    },
    data() {
        return {
            quantity: "",
            position: "",
        };
    },
    created() {
        if (this.$store.getters.position) {
            this.position = this.$store.getters.position;
        } else {
            const num = Math.floor(Math.random() * 10) + 1;
            let str = "";
            if (num === 1) {
                str = "学习委员";
            } else if (num === 2) {
                str = "体育委员";
            } else if (num === 3) {
                str = "生活委员";
            } else {
                str = "学生";
            }
            this.setPosition(str);
            this.position = str;
        }
    },
    methods: {
        ...mapMutations(["setQuantity", "setPosition"]),
        ...mapActions({
            SKIP_LOGIN: "user/SKIP_LOGIN",
        }),
        personal() {
            //   alert("个人中心");
            this.$router.push({
                path: "/PersonalCenter",
            });
        },
        loginAgain() {
            this.SKIP_LOGIN();
        },
    },
};
</script>

<style lang="less" scoped>
.home-left {
    width: 321px;
    height: 342px;
    background: #ffffff;
    box-shadow: 0px 5px 12px 0px rgba(60, 128, 209, 0.1);
    border-radius: 16px;
    padding: 16px 0 16px 24px;
    position: relative;
    .container {
        width: 100%;
        height: 100%;
        .left-con {
            .avatar {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .name {
                margin-top: 10px;
                span {
                    font-size: 20px;
                    font-weight: 600;
                    color: #333333;
                }
            }
            .nickName {
                display: flex;
                align-items: center;
                height: 24px;
                span {
                    width: 130px;
                    height: 100%;
                    font-size: 16px;
                    font-weight: 400;
                    color: #666666;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .reward {
                margin-top: 10px;
                li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 6px;
                    display: flex;
                    img {
                        margin-right: 10px;
                    }
                    span {
                        width: 100px;
                        font-size: 16px;
                        font-weight: 500;
                        color: #333333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .signature {
                .title {
                    font-size: 16px;
                    font-weight: 500;
                    color: #333333;
                }
                .sign-con {
                    width: 242px;
                    height: 64px;
                    background: linear-gradient(
                        316deg,
                        rgba(255, 255, 255, 0.3) 0%,
                        rgba(65, 179, 255, 0.3) 100%
                    );
                    border-radius: 10px;
                    padding: 8px 80px 8px 8px;
                    margin-top: 8px;

                    span {
                        display: inline-block;
                        width: 154px;
                        height: 48px;
                        font-size: 16px;
                        font-weight: 400;
                        color: #0b334f;
                        line-height: 24px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
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

    .fail {
        font-size: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .btn {
            width: 80px;
            height: 40px;
            margin-top: 30px;
        }
    }
}
</style>
