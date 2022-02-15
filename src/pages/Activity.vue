<template>
  <div class="container">
    <div class="back" @click="goBack"></div>
    <img src="/活动内容2.png" alt="" />
    <div class="look-copyright" @click="isShow = true"></div>
    <div class="copyright" v-show="isShow">
      <img src="/版权声明.png" alt="" />
      <div class="known" @click="isShow = false"></div>
    </div>
    <!-- <img class="" src="/popular2.png" alt="" /> -->
    <!-- <img class="close-circle" src="/Close-Circle.png" alt="关闭" @click="goBack" /> -->
  </div>
</template>

<script>
import { ref } from 'vue';
import { goBack } from '../utils/goBack';

export default {
  name: 'Activity',
  setup() {
    const isShow = ref(false);

    return {
      goBack: goBack(),
      isShow
    };
  }
};
</script>

<style scoped>
.container {
  position: relative;
  width: 1080px;
  height: 1920px;
  text-align: center;
}
.back {
  position: absolute;
  z-index: 10;
  width: 133px;
  height: 77px;
  top: 47px;
  cursor: pointer;
}
.container .look-copyright {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  width: 430px;
  height: 48px;
  top: 1246px;
  left: 60px;
  cursor: pointer;
}
.container .copyright {
  position: absolute;
  top: 350px;
  left: 100px;
}
.container .known {
  position: absolute;
  width: 653px;
  height: 88px;
  bottom: 127px;
  left: 129px;
  cursor: pointer;
}
/* .container img:nth-child(1) {
  width: 100%;
  margin-bottom: 45px;
}
.container .close-circle {
  position: absolute;
  top: 39px;
  right: 45px;
  cursor: pointer;
} */
</style>
