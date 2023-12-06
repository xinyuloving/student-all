// 页面滑动处理

export default {
    data() {
        return {
            slide_domW: 0,
            slide_offsetX: 0,
            slide_initialX: 0,
            slide_childW: 0,
            slide_x: 0,
            slide_total: 0,
            slide_timer: '',
            slide_cb: null
        }
    },
    methods: {
        slide_mount(total, cb) {
            this.slide_cb = cb;
            this.slide_total = total;
            this.$refs.slideChild.style.transform = 'translateX(${0}px)';
            this.slide_domW = this.$refs.slide.offsetWidth;
            this.slide_childW = total ? total * this.slide_domW : this.$refs.slideChild.offsetWidth;
            // 监听手指触摸事件
            this.$refs.slide.addEventListener('touchstart', e => {
                clearTimeout(this.slide_timer);
                this.$refs.slideChild.style.transition = 'all 0s';
                this.slide_initialX = e.touches[0].pageX
            })
            // 监听手指滑动事件
            this.$refs.slide.addEventListener('touchmove', e => {
                this.slide_x = e.touches[0].pageX - this.slide_initialX;
                this.$refs.slideChild.style.transform = `translateX(${this.slide_offsetX + this.slide_x}px)`;
            })
            // 监听手指抬起事件
            this.$refs.slide.addEventListener('touchend', this.slide_location)
        },
        // 滑动结束后所处的位置
        slide_location(e) {
            try {
                this.$refs.slideChild.style.transition = 'all .3s';
                let x;
                if (e) {
                    x = e.changedTouches[0].pageX - this.slide_initialX + this.slide_offsetX + this.slide_x;
                } else {
                    x = this.slide_offsetX - this.slide_domW;
                }
                if (x > 0) {
                    if (this.slide_total) {
                        this.slide_offsetX = this.slide_domW;
                        let timer = setTimeout(() => {
                            this.$refs.slideChild.style.transition = 'all 0s';
                            this.slide_offsetX = -this.slide_childW + this.slide_domW;
                            this.$refs.slideChild.style.transform = `translateX(${this.slide_offsetX}px)`;
                            clearTimeout(timer);
                            timer = null;
                        }, 300);
                    } else {
                        this.slide_offsetX = 0;
                    }
                } else if (x < -this.slide_childW + this.slide_domW) {
                    if (this.slide_total) {
                        this.slide_offsetX = -this.slide_childW;
                        let timer = setTimeout(() => {
                            this.$refs.slideChild.style.transition = 'all 0s';
                            this.slide_offsetX = 0;
                            this.$refs.slideChild.style.transform = `translateX(${this.slide_offsetX}px)`;
                            clearTimeout(timer);
                            timer = null;
                        }, 300);
                    } else {
                        this.slide_offsetX = -this.slide_childW + this.slide_domW
                    }
                } else {
                    const offsetX = Math.round(x / this.slide_domW) * this.slide_domW;
                    if (offsetX > this.slide_offsetX + this.slide_domW) {
                        this.slide_offsetX = this.slide_offsetX + this.slide_domW
                    } else if (offsetX < this.slide_offsetX - this.slide_domW) {
                        this.slide_offsetX = this.slide_offsetX - this.slide_domW
                    } else {
                        this.slide_offsetX = offsetX
                    }
                }
                this.$refs.slideChild.style.transform = `translateX(${this.slide_offsetX}px)`;
                this.slide_x = null;
                this.slide_cb && this.slide_cb();
                if (this.slide_total) this.slide_autoplay()
            } catch(err) {
                // console.log(err);
            }
        },
        // 自动播放
        slide_autoplay() {
            this.slide_timer = setTimeout(() => {
                clearTimeout(this.slide_timer)
                this.slide_location();
            }, 6000);
        },
    },
    // mounted() {
    //     this.slide_mount()
    // },
    computed: {
        currentPage() {
            return -Math.round((this.slide_x + this.slide_offsetX) / this.slide_domW)
        }
    }
}