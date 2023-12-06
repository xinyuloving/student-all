<template>
    <TButton id="study-item" @touch="preview(item.tencentCosName)">
        <div class="top">
            <img :src="require(`../../assets/img/studyAide/${suffix}.png`)" />
        </div>
        <div class="bottom">{{item.coursewareName}}</div>
    </TButton>
</template>

<script>
import { videoFormat, imageFormat, audioFormat, wordFormat, excelFormat} from '@/utils/fileFormat'
import TButton from '@/components/publicMethods/TButton.vue'
export default {
    name: 'StudyItem',
    components: {
        TButton
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            Ptype: -1
        }
    },
    computed: {
        suffix() {
            const suffixName = this.item.tencentCosName.slice(this.item.tencentCosName.lastIndexOf('.'));
            const reg = new RegExp(suffixName, 'gi');
            this.Ptype = 0;
            if (reg.test(videoFormat())) {
                this.Ptype = 1;
                return 'video'
            } else if (reg.test(imageFormat())) {
                this.Ptype = 2;
                return 'image'
            } else if (reg.test(audioFormat())) {
                this.Ptype = 3;
                return 'audio'
            } else if (reg.test(wordFormat())) {
                return 'docx'
            } else if (reg.test(excelFormat())) {
                return 'excel'
            } else if (suffixName === '.pptx' || suffixName === '.ppt') {
                return 'ppt'
            } else if (suffixName === '.pdf') {
                return 'pdf'
            } else {
                return 'docx'
            }
        }
    },
    methods: {
        preview(cosName) {
            this.$emit('preview', {
                cosName,
                type: this.Ptype
            })
        }
    }
}
</script>

<style lang="less" scoped>
#study-item {
    width: 152px;
    margin-right: 30px;
    background: transparent;
    flex-direction: column;
    .top {
        height: 92px;
        padding: 10px 0;
        box-sizing: content-box;
        text-align: center;
    }
    .bottom {
        height: 48px;
        text-align: center;
        font-size: 18px;
        color: #333;
        line-height: 24px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
}
</style>