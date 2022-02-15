<template>
  <!-- 时光格子 -->
  <div class="tg-container">
    <TimeGrid @onBGClick="showMask" />
    <!-- 右下角二维码 -->
    <!-- <img class="miniprogram" src="/miniprogram.jpg" alt="" /> -->
  </div>
  <teleport to="body" v-if="isMaskShow">
    <div class="mask" @click="isMaskShow = false"></div>
  </teleport>
  <teleport to="#app" v-if="isMaskShow">
    <div class="modal">
      <carousel :list="list" />
      <!-- <img v-if="info.type === 'img'" :src="info.url" />
      <video v-if="info.type === 'video'" :src="info.url" controls autoplay></video> -->
    </div>
  </teleport>
</template>

<script>
import { ref } from 'vue';
import TimeGrid from './TimeGrid.vue';
import BGM from '../components/BGM.vue';
import Carousel from '../components/Carousel.vue';

export default {
  name: 'TimeGridContainer',
  components: {
    TimeGrid,
    BGM,
    Carousel
  },
  setup() {
    const isMaskShow = ref(false);
    const info = ref({});
    const list = ref([]);
    function showMask(obj, e, infos) {
      if (!obj.url) return;
      info.value = obj;
      // 将点击的图片放到第一
      let idx = infos.findIndex((item) => item.resource[0] === obj.resource[0]);
      list.value = [infos[idx], ...infos.filter((_, i) => i !== idx)];
      console.log(obj, infos);
      isMaskShow.value = true;
    }

    return {
      showMask,
      isMaskShow,
      info,
      list
    };
  }
};
</script>

<style scoped>
.tg-container {
  width: 1080px;
  height: 1920px;
  margin: 0 auto;
  position: relative;
}
.mask {
  position: fixed;
  z-index: 2000;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}
.modal {
  position: absolute;
  z-index: 2001;
  top: 20%;
  width: 1080px;
  height: 810px;
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.pb-container) {
  margin-top: 48px;
}
/* .modal img,
.modal video {
  width: 100%;
  height: 100%;
} */
</style>
