<template>
  <div class="distribute">
    <!-- 内容分发 -->
    <div class="content" v-if="distributeCon.fileUrl">
      <!-- <img
        v-if="distributeCon.type === 1"
        @load="isLoading = false"
        :src="distributeCon.fileUrl"
        alt=""
      />
      <video
        v-else-if="distributeCon.type === 2"
        @loadstart="isLoading = false"
        :src="distributeCon.fileUrl"
        autoplay
        loop
        controls
        controlslist="nofullscreen nodownload"
      ></video>
      <iframe
        v-else
        :src="distributeCon.fileUrl"
        frameborder="0"
        @load="isLoading = false"
      ></iframe> -->
      <img
        v-if="distributeCon.type === 1"
        :src="distributeCon.fileUrl"
        alt=""
      />
      <video
        v-else-if="distributeCon.type === 2"
        :src="distributeCon.fileUrl"
        autoplay
        loop
        controls
        controlslist="nofullscreen nodownload"
      ></video>
      <iframe v-else :src="distributeCon.fileUrl" frameborder="0"></iframe>
    </div>
    <!-- <Loading v-if="isLoading" /> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { insertDom } from "@/utils/util";
import Loading from "@/components/publicMethods/Loading.vue";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  mounted() {
    insertDom(this.$el, this.$parent.$el);
  },
  computed: {
    ...mapState({
      distributeCon: (state) => state.cloudClassroom.distributeCon,
    }),
  },
};
</script>

<style lang="less" scoped>
.distribute {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9;
  background-color: #1b1a21;
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
    iframe,
    video {
      width: 100%;
      height: 100%;
    }
    img {
      height: 100%;
      // width: 100%;
      width: auto;
      object-fit: contain;
    }
  }
}
</style>