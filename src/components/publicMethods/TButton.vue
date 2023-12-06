
<script>
export default {
    props: {
        btnStyle: {                 // 自定义style样式
            type: Object,
            default: () => ({})
        },
        disabled: Boolean,          // 禁用按钮
        loading: Boolean,           // 是否启用loading效果
    },

    data() {
        return {
            butOpacity: '1'
        }
    },

    watch: {
        disabled: {
            handler(val) {
                if (val || this.loading) {
                    this.butOpacity = '.5'
                } else {
                    this.butOpacity = '1'
                }
            },
            immediate:true,
        },
        loading: {
            handler(val) {
                if (val || this.disabled) {
                    this.butOpacity = '.5'
                } else {
                    this.butOpacity = '1'
                }
            },
            immediate:true,
        }
    },

    methods: {
        touchEvt(e) {
            if (this.disabled || this.loading) return;
            this.$emit('touch', e)
        }
    },

    render(h) {
        return h(
            'button',
            {
                directives: [{
                    name: 'touch',
                    value: e => this.touchEvt(e),
                }],
                on: {
                    touchstart: e => {
                        if (this.disabled || this.loading) return;
                        this.butOpacity = '.5'
                    },
                    touchend: e => {
                        if (this.disabled || this.loading) return;
                        this.butOpacity = '1'
                    },
                },
                style: {
                    ...this.btnStyle,
                    opacity: this.butOpacity
                },
                class: 't-btn'
            },
            [
                this.loading ? h('i', {
                    class: 'iconfont icon-loading'
                }) : '',
                this.$slots.default
            ]
        )
    }
}
</script>

<style lang="less" scoped>
.t-btn {
    background: #3e83f8;
    border-radius: 5px;
    color: #fff;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-loading {
        margin-right: 5px;
        font-size: inherit;
        font-weight: inherit;
        animation: rotation 2s linear infinite;
    }
}
@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>