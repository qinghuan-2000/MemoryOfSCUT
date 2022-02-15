// 首屏
<template>
  <!-- 头部 -->
  <div class="header">
    <div class="title">
      <p class="title-zh">华园记忆</p>
      <p class="title-en">MEMORY OF SCUT</p>
    </div>
    <div class="QR-code-container">
      <img class="QR-code-img" src="/oc-qrcode.jpg" alt="二维码" />
      <p class="QR-code-desc">扫码了解</p>
    </div>
  </div>
  <!-- 轮播图 -->
  <div class="carousel-container">
    <div class="carousel-main-container">
      <div
        class="carousel-main"
        v-for="(item, idx) in carouselArray"
        :key="idx"
        :class="{ 'carousel-main-active': idx === activeIdx }"
      >
        <!-- 图片或视频 -->
        <img
          :ref="
            (el) => {
              if (el) imgvideo[idx] = el;
            }
          "
          v-if="item.type === 'img'"
          class="carousel-img"
          :src="item.resource[0]"
          alt="轮播图"
          @error="onCarouselError"
        />
        <video
          :ref="
            (el) => {
              if (el) imgvideo[idx] = el;
            }
          "
          v-if="item.type === 'video'"
          class="carousel-img"
          :src="item.resource[0]"
          :data-mark="item.resource[0]"
          autoplay
          muted
          controls
          @ended="onVideoEnded"
        ></video>
        <!-- 相关描述 -->
        <div class="carousel-desc">
          <div class="carousel-desc-left">
            <p>{{ item.author }}</p>
            <p>{{ item.title }}</p>
          </div>
          <div class="carousel-desc-right">
            <span>{{ campusPy2Zh[item.campus] }}</span>
            <p>{{ item.dateTime.substring(0, item.dateTime.indexOf('T')) }}</p>
          </div>
          <div class="carousel-desc-icon">
            <img src="/Vector.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <!-- 进度条 -->
    <div class="carousel-pb">
      <span
        v-for="(item, idx) in carouselArray"
        :key="idx"
        :class="{ 'carousel-pb-active': idx === activeIdx }"
        @click="onPbClick(idx)"
      ></span>
    </div>
  </div>
  <!-- 卡片 -->
  <div class="card-container">
    <router-link to="/impression"><img src="/华园印象.png" alt="" /></router-link>
    <router-link to="/time-grid"><img src="/时光格子.png" alt="" /></router-link>
    <router-link to="/learn-more"><img src="/了解更多.png" alt="" /></router-link>
    <!-- <img src="/了解更多.png" alt="" @click="showUnmannedScreen" /> -->
  </div>
  <!-- 版权 -->
  <div class="footer">
    华园记忆&nbsp;&copy;&nbsp;版权所有&nbsp;2022
    <!-- <img src="/版权注解.png" alt="" /> -->
  </div>
  <!-- 无人态 -->
  <UnmannedScreen
    :visiable="usVisiable"
    :carouselArray="carouselArray"
    :carouselIdx="activeIdx"
    @close="closeUnmannedScreen"
    @onPbClick="onPbClick"
  />
</template>

<script>
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getCarouselList, getBackgroundMusic } from '../service/request';
import { onCarouselError } from '../utils/goBack';
import UnmannedScreen from './UnmannedScreen.vue';
import carouselImg1 from '/carousel-img1.png';

export default {
  name: 'FristScreen',
  components: {
    UnmannedScreen
  },
  setup() {
    onMounted(() => {
      document.documentElement.scrollTop = 0;
    });

    const campusPy2Zh = {
      daxuecheng: '华工大学城校区',
      wushan: '华工五山校区',
      guoji: '华工国际校区'
    };
    const carouselArray = ref([
      {
        id: '1',
        title: '巍巍学府，吾校吾家',
        author: '04级计算机 陈春华',
        dateTime: '2021/12/16',
        campus: 'daxuecheng',
        resource: [carouselImg1],
        type: 'img',
        description: '',
        userIcon: ''
      }
    ]);
    getCarouselList().then((response) => {
      carouselArray.value = response.data;
    });
    const activeIdx = ref(0);
    let timer = 0;
    function carouselGoing() {
      clearInterval(timer);
      timer = setInterval(() => {
        activeIdx.value = (activeIdx.value + 1) % carouselArray.value.length;
        if (carouselArray.value[activeIdx.value].type === 'video') {
          clearInterval(timer);
        }
      }, 3000);
      return timer;
    }
    // 点击进度条
    function onPbClick(idx) {
      activeIdx.value = idx;
      // 2s后再启动轮播
      if (carouselArray.value[activeIdx.value].type === 'img') {
        setTimeout(() => (timer = carouselGoing()), 2000);
      }
      if (carouselArray.value[activeIdx.value].type === 'video') {
        clearInterval(timer);
      }
    }
    // 视频播放结束重启轮播
    function onVideoEnded(e) {
      e.target.play();
      // console.log('onVideoEnded', e.target, e.target.play());
      // console.log(
      //   e.target.dataset['mark'] + '===' + carouselArray.value[activeIdx.value].resource,
      //   e.target.dataset['mark'] === carouselArray.value[activeIdx.value].resource[0]
      // );
      // 如果轮播为当前的视频，则需重启轮播
      if (carouselArray.value[activeIdx.value].resource[0] === e.target.dataset['mark']) {
        timer = carouselGoing();
      }
    }
    onMounted(() => {
      timer = carouselGoing();
    });

    // 无人态
    const usVisiable = ref(false);
    function showUnmannedScreen() {
      usVisiable.value = true;
    }
    function closeUnmannedScreen() {
      usVisiable.value = false;
    }
    // 启停全局背景音乐
    const globalBgmGo = inject('globalBgmGo');
    const globalBgmPause = inject('globalBgmPause');
    watch(usVisiable, (v) => {
      if (!v) {
        globalBgmGo();
      } else {
        globalBgmPause();
      }
    });

    // 倒计时 30s 进入无人态
    let countDown;
    function enterUnmannedState() {
      clearTimeout(countDown);
      countDown = setTimeout(() => {
        showUnmannedScreen();
      }, 30000);
      return countDown;
    }
    onMounted(() => {
      countDown = enterUnmannedState();
    });
    // 点击屏幕重新计时
    const refreshCd = () => (countDown = enterUnmannedState());
    window.addEventListener('click', refreshCd);
    window.addEventListener('touchstart', refreshCd);

    // 每天隔一个小时刷新轮播图
    let hourTimer = setInterval(() => {
      getCarouselList().then((response) => {
        carouselArray.value = response.data;
      });
    }, 3600000);
    onBeforeUnmount(() => clearInterval(hourTimer));

    //  TODO:可以拿到图像、视频 ref 数组
    // 后续轮播图优化
    const imgvideo = ref([]);
    onMounted(() => {
      console.log(imgvideo.value);
    });

    return {
      campusPy2Zh,
      carouselArray,
      activeIdx,
      onVideoEnded,
      onPbClick,
      usVisiable,
      showUnmannedScreen,
      closeUnmannedScreen,
      onCarouselError,
      imgvideo
    };
  }
};
</script>

<style scoped>
.header {
  overflow: hidden;
}
.title {
  float: left;
  margin-top: 107px;
  margin-left: 41px;
}
.title-zh {
  font-weight: 600;
  font-size: 96px;
  line-height: 131px;
  letter-spacing: 13px;
  color: #353535;
}
.title-en {
  font-weight: 600;
  font-size: 36px;
  line-height: 49px;
  /* or 49px */
  letter-spacing: 6px;
  color: #353535;
}
.QR-code-container {
  float: right;
  margin-top: 128px;
  margin-right: 54px;
}
.QR-code-img {
  width: 109.77px;
  height: 111.86px;
}
.QR-code-desc {
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  letter-spacing: 8px;
  color: #000000;
}
/* 轮播图 */
.carousel-container {
  position: relative;
  width: 1001px;
  margin-top: 46px;
  margin-left: 40px;
}
.carousel-main-container {
  height: 850px;
}
.carousel-main {
  position: absolute;
  border-radius: 20px;
  background-color: #ffffff;
  transition-duration: 1.5s;
  opacity: 0;
}
.carousel-main-active {
  opacity: 1;
  z-index: 1;
}
/* .carousel-container div {
  outline: none;
} */
.carousel-img {
  width: 1000px;
  height: 750px;
  cursor: pointer;
  border-radius: 20px 20px 0 0;
}
.carousel-desc {
  margin-top: 40px;
  overflow: hidden;
}
.carousel-desc-left {
  float: left;
  margin-left: 29px;
  margin-bottom: 34px;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 35px;
}
.carousel-desc-left p:nth-child(1) {
  color: #a4a4a4;
}
.carousel-desc-left p:nth-child(2) {
  color: #7c7c7c;
}
.carousel-desc-right {
  float: right;
  margin-right: 29px;
  line-height: 30px;
  color: #7c7c7c;
}
.carousel-desc-icon {
  float: right;
  width: 3%;
  height: 5%;
  margin-right: 16px;
}
.carousel-pb {
  margin-top: 100px;
  text-align: center;
}
.carousel-pb span {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: #dadada;
  border-radius: 10px;
  cursor: pointer;
  transition-duration: 1.5s;
}
.carousel-pb .carousel-pb-active {
  width: 50px;
  height: 20px;
  background: #5277bf;
  border-radius: 10px;
  cursor: pointer;
}
/* 卡片 */
.card-container {
  margin: 60px 40px 0 40px;
  display: flex;
  justify-content: space-between;
}
.card-container img {
  cursor: pointer;
}
/* 底部版权 */
.footer {
  margin: 100px auto 0;
  padding-bottom: 25px;
  text-align: center;
  font-weight: 500;
  font-size: 24px;
  line-height: 24px;
  text-transform: capitalize;
  color: #a0aac0;
}
</style>
