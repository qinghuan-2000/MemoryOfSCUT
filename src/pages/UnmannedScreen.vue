<template>
  <teleport to="body" v-if="visiable">
    <div class="mask"></div>
  </teleport>
  <teleport to="#app" v-if="visiable">
    <div class="modal" @click="$emit('close')">
      <div class="carousel-container">
        <carousel :list="carouselArray" />
      </div>
      <!-- 轮播图 -->
      <!-- <div class="carousel-container">
        <img
          v-if="carouselArray[carouselIdx].type === 'img'"
          :src="carouselArray[carouselIdx].resource[0]"
          alt="缘分让我们相遇"
          @error="onCarouselError"
        /> 
        <video
          v-if="carouselArray[carouselIdx].type === 'video'"
          :src="carouselArray[carouselIdx].resource[0]"
          :data-mark="carouselArray[carouselIdx].resource[0]"
          autoplay
          muted
          @ended="$emit('onVideoEnded')"
        />
      </div> -->
      <!-- 进度条 -->
      <!-- <div class="carousel-pb">
        <span
          v-for="(item, idx) of carouselArray"
          :key="item.resource[0]"
          :class="{ 'carousel-pb-active': idx === carouselIdx }"
          @click="onUsPbClick($event, idx)"
        ></span>
      </div> -->
      <!-- 手势 -->
      <div class="gesture">
        <img :src="gestureSrc" alt="" />
      </div>
      <!-- 音乐格子 -->
      <AudioBox :width="900" auto-play :src="bgm" />
    </div>
  </teleport>
</template>

<script>
import { onMounted, ref } from 'vue';
import AudioBox from '../components/AudioBox.vue';
import Carousel from '../components/Carousel.vue';
import { getBackgroundMusic } from '../service/request';
import gesture1 from '/gesture.png';
import gesture2 from '/gesture2.png';
import daoxiang from '/daoxiang.mp3';
import { onCarouselError } from '../utils/goBack';

export default {
  name: 'UnmannedScreen',
  props: ['visiable', 'carouselArray', 'carouselIdx'],
  emits: ['close', 'onVideoEnded', 'onPbClick'],
  components: {
    AudioBox,
    Carousel
  },
  setup(_, { emit }) {
    const gestures = [gesture1, gesture2];
    let now = 0;
    const gestureSrc = ref(gestures[now]);
    onMounted(() => {
      setInterval(() => {
        now = (now + 1) % gestures.length;
        gestureSrc.value = gestures[now];
      }, 1000);
    });

    const bgm = ref('');
    function getBGM() {
      getBackgroundMusic()
        .then((response) => {
          bgm.value = response.data.inactive;
        })
        .catch((error) => {
          console.log('Unmanned bgm error', error);
          bgm.value = daoxiang;
        });
    }
    getBGM();
    // function onBgmEnded(e) {
    //   console.log(e.target.getElementsByTagName('source')[0]);
    //   const source = e.target.getElementsByTagName('source')[0];
    //   getBackgroundMusic()
    //     .then((response) => {
    //       source.src = response.data.inactive;
    //     })
    //     .catch((error) => {
    //       console.log('Unmanned onBgmEnded error', error);
    //       source.src = daoxiang;
    //     })
    //     .finally(() => {
    //       e.target.play();
    //     });
    // }
    // function onBgmPlay(e) {
    //   console.log(e.target, (e.target.currentTime = 190));
    // }

    // 点击进度条
    function onUsPbClick(e, idx) {
      e.stopPropagation();
      emit('onPbClick', idx);
    }

    return {
      onCarouselError,
      gestureSrc,
      bgm,
      // onBgmEnded,
      // onBgmPlay,
      // daoxiang,
      onUsPbClick
    };
  }
};
</script>

<style scoped>
.mask {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}
.modal {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 20;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.carousel-container {
  width: 100%;
  margin-top: 201px;
}
/* .carousel-container {
  width: 1080px;
  height: 810px;
  margin-top: 27%;
    position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
} */
/* .carousel-container img,
.carousel-container video {
  width: 100%;
  height: 100%;
}
.carousel-pb {
  position: relative;
  margin-top: 50px;
  text-align: center;
}
.carousel-pb span {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: #dadada;
  border-radius: 10px;
  transition-duration: 1.5s;
  cursor: pointer;
}
.carousel-pb .carousel-pb-active {
  width: 50px;
  height: 20px;
  background: #5277bf;
  border-radius: 10px;
  cursor: pointer;
} */
/* 手势 */
.gesture {
  padding-top: 81px;
}
/* 音乐格子 */
.audio-box {
  width: 100%;
  height: 15%; /* 一定要设置高度 */
  position: absolute;
  bottom: 31px;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
