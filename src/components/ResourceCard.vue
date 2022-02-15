<template>
  <div class="card">
    <div class="user">
      <div class="avatar-container">
        <img class="avatar" :src="avatar" />
      </div>
      <div class="top">
        <p class="username">{{ author }}</p>
        <p class="addition">{{ getYYYYMMDDfromDateTime(dateTime) }}</p>
      </div>
    </div>
    <div class="resource-container" v-if="type === 'img'">
      <img class="resource" v-for="item in resourceList" :src="item" />
    </div>
    <div class="resource-container" v-if="type === 'video'">
      <video
        class="resource"
        v-for="item in resourceList"
        :src="item"
        autoplay
        muted
        controls
        @play="$emit('onVideoPlay', $event)"
        @pause="$emit('onVideoPause', $event)"
        @ended="$emit('onVideoEnded', $event)"
      />
    </div>
    <div class="info">
      <p class="title">{{ title }}</p>
      <p class="motto">{{ description }}</p>
    </div>
  </div>
</template>

<script>
import { getYYYYMMDDfromDateTime } from '../utils/goBack';
// import logo from '/carousel-img1.png';

export default {
  name: 'ResourceCard',
  props: {
    avatar: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    dateTime: {
      type: String,
      default: Date.now().toString()
    },
    resourceList: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '无体'
    }
  },
  emits: ['onVideoPlay', 'onVideoPause', 'onVideoEnded'],
  setup() {
    return {
      getYYYYMMDDfromDateTime
    };
  }
};
</script>

<style scoped>
.card {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  padding: 39px 33px;
  background: #ffffff;
  border-radius: 20px;
  cursor: pointer;
}
@keyframes loading {
  0% {
    background: #eee;
  }
  50% {
    background: #ddd;
  }
  100% {
    background: #eee;
  }
}
.user .avatar-container {
  float: left;
  width: 99px;
  height: 99px;
  animation: loading 3s infinite;
  margin-bottom: 36px;
  border-radius: 50%;
}
.user .avatar-container img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
img[src=''],
img:not([src]) {
  opacity: 0;
}
.user .top {
  float: left;
  margin-left: 36px;
}
.user .top .username {
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 44px;
  color: #1e1e1e;
}
.user .top .addition {
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 45px;
  color: #a4a4a4;
}
.user::after {
  content: '';
  display: block;
  clear: both;
}
.resource-container {
  width: auto;
  max-width: 100%;
  min-height: 99px;
  border-radius: 20px;
  animation: loading 3s infinite;
  font-size: 0;
  text-align: center;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}
.resource-container .resource {
  /* display: block; 消除由于 div 中放了 img 而多出来的像素 */
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 20px;
}
.resource-container .resource:not(:nth-child(1)) {
  margin-top: 30px;
}
.info {
  text-align: left;
  padding-top: 30px;
  font-style: normal;
  font-weight: normal;
  text-transform: uppercase;
}
.info .title {
  font-size: 36px;
  line-height: 48px;
  color: #010e23;
}
.info .motto {
  font-size: 24px;
  line-height: 36px;
  color: #a4a4a4;
}
</style>
