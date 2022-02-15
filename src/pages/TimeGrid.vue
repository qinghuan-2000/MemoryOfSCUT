<template>
  <div class="time-grid">
    <div ref="back" class="btn-back" @click="handleBack">&lt;</div>
    <!-- 右下角二维码 -->
    <img class="miniprogram" src="/miniprogram.jpg" alt="" />
    <div class="description" :class="{ hide: hideAnimation }" v-if="showDesc">
      <div class="description-inner">
        <h1 style="margin-top: 36px; position: absolute; top: 112px">时光格子</h1>
        <p>时光爬上格子，格子珍藏记忆。</p>
        <p>蒙德里安艺术格子由数字艺术算法生成。</p>
        <p>您可以左右移动，探寻珍藏的影像。</p>
        <p>你可以下拉刷新，生成全新的格子。</p>
        <circle-progress
          v-show="!hideAnimation"
          :value="descCount"
          :max="maxCount"
          :textFunc="textFunc"
        ></circle-progress>
      </div>
    </div>
    <!-- 监听click事件，这个click是指格子中的元素(如果有)被点击时产生的事件 -->
    <background @click="handleClick"></background>
  </div>
</template>

<script>
import Background from '../components/Background.vue';
import CircleProgress from '../components/CircleProgress.vue';
import {} from '../utils/util';
import { goBack } from '../utils/goBack';

const TICK = 100;
export default {
  components: {
    Background,
    CircleProgress
  },
  emits: ['onBGClick'],
  setup() {
    return {
      handleBack: goBack()
    };
  },
  data() {
    // 设置5s后无操作自动半透明按钮
    let operating;
    const operate = () => {
      operating && clearTimeout(operating);
      const back = this.$refs.back;
      back && back.classList.remove('fade');
      operating = setTimeout(() => {
        back && back.classList.add('fade');
      }, 5e3);
    };
    return {
      operate,
      showDesc: true,
      hideAnimation: false,
      descCount: 0,
      maxCount: 5e3 / TICK // 5000ms
    };
  },
  mounted() {
    window.addEventListener('mousedown', this.operate);
    window.addEventListener('mousemove', this.operate);
    window.addEventListener('mouseup', this.operate);
    window.addEventListener('touchstart', this.operate);
    window.addEventListener('touchmove', this.operate);
    window.addEventListener('touchend', this.operate);
    setTimeout(() => {
      this.operate();
      this.showDescription();
    });
  },
  beforeUnmount() {
    window.removeEventListener('mousedown', this.operate);
    window.removeEventListener('mousemove', this.operate);
    window.removeEventListener('mouseup', this.operate);
    window.removeEventListener('touchstart', this.operate);
    window.removeEventListener('touchmove', this.operate);
    window.removeEventListener('touchend', this.operate);
  },
  methods: {
    // handleBack() {
    //   // TODO 返回按钮被点击
    //   console.log('handleBack');
    // },
    handleClick(obj, ev, infos) {
      // TODO 背景格子中的元素被点击
      // console.log('handleClick', obj, ev);
      this.$emit('onBGClick', obj, ev, infos);
    },
    showDescription() {
      this.showDesc = true;
      this.hideAnimation = false;
      this.descCount = this.maxCount;
      const timer = setInterval(() => {
        this.descCount--;
        if (this.descCount <= 0) {
          clearInterval(timer);
          this.hideAnimation = true;
          setTimeout(() => (this.showDesc = false), 1e3);
        }
      }, TICK);
    },
    textFunc() {
      return `${Math.round((this.descCount * TICK) / 1e3)}s`;
    }
  }
};
</script>

<style>
.time-grid {
  width: 100%;
  height: 100%;
  position: relative;
}
.time-grid canvas {
  height: 100%;
  width: 100%;
}
.time-grid .btn-back {
  background: #f7f7f7;
  border-radius: 0 12px 10px 0;
  width: 204px;
  height: 102px;
  opacity: 0.9;
  /* 使用 fixed 定位的元素默认漂浮于原来位置，且不随容器滚动而移动，使用 margin 可使元素相对于容器固定位置。 */
  position: fixed;
  margin-top: 75px;
  /* position: absolute;
  left: 0;
  top: 75px; */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  font-weight: bolder;
  user-select: none;
  cursor: pointer;
  z-index: 1000;
}
.time-grid .btn-back:not(.fade) {
  opacity: 0.9;
}
.time-grid .btn-back.fade {
  opacity: 0.4;
  transition: opacity 2s linear;
}
.time-grid .miniprogram {
  width: 144px;
  height: 144px;
  position: absolute;
  z-index: 3000;
  margin-left: calc(1080px - 144px - 36px);
  margin-top: calc(1920px - 144px - 36px);
  /* border-radius: 20px; */
}
.time-grid .description {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  transition: all 0.5s ease-in-out;
  z-index: 100;
}
.time-grid .description-inner {
  position: relative;
  width: 684px;
  height: 864px;
  background: rgba(228, 232, 241, 0.8);
  border-radius: 30px;
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 101;
  font-family: Inter;
  pointer-events: initial;
}
.hide {
  animation: hide 1s 1;
  animation-fill-mode: forwards;
}
@keyframes hide {
  from {
    opcity: 1;
  }
  to {
    opacity: 0;
  }
}
.time-grid .description-inner h1 {
  font-size: 48px;
  line-height: 58px;
  font-weight: bold;
  color: #111;
}
.time-grid .description-inner p {
  font-size: 36px;
  line-height: 60px;
  color: #292929;
}
.time-grid .description-inner .circle-progress {
  position: absolute;
  bottom: 20px;
  left: auto;
  right: auto;
}
</style>
