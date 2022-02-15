<template>
  <!-- 头部 -->
  <Header :title="'华园印象'" @goBack="goBack" />
  <!-- 刷新 -->
  <div ref="refresh" class="refresh"><Loading /></div>
  <!-- 卡片 -->
  <div @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
    <div class="card-container">
      <p>创意设计</p>
      <router-link to="/visual-symbol"><img src="/visual-sign.png" alt="" /></router-link>
      <router-link to="/artistic-creation"><img src="/artistic-creation.png" alt="" /></router-link>
      <router-link to="/learn-more"><img src="/more.png" alt="" /></router-link>
    </div>
    <!-- 珍藏影像 -->
    <div class="collection-container">
      <p class="collection-title">珍藏影像</p>
      <div class="collection-type-container">
        <div
          class="collection-type"
          @click="changeType('video')"
          :class="{ 'collection-type-active': type === 'video' }"
        >
          短视频
        </div>
        <div class="collection-type" @click="changeType('img')" :class="{ 'collection-type-active': type === 'img' }">
          图像
        </div>
      </div>
      <!-- 影像内容 -->
      <div class="collection-item" v-for="item in content" :key="item.author + item.title">
        <div class="collection-item-header">
          <img class="collection-item-avatar" :src="item.userIcon" alt="" />
          <div class="collection-item-userinfo">
            <p class="collection-item-name">{{ item.author }}</p>
            <p class="collection-item-addition">{{ getYYYYMMDDfromDateTime(item.dateTime) }}</p>
          </div>
        </div>
        <div class="collection-item-main">
          <div class="collection-item-video" @scroll="onHidden">
            <video v-if="item.type === 'video'" :src="item.resource[0]" @play="onVideoPlay" controls></video>
            <img v-if="item.type === 'img'" :src="item.resource[0]" alt="avatar" />
          </div>
          <div class="collection-item-info">
            <p class="collection-item-info-title">{{ item.title }}</p>
            <p class="collection-item-info-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="collection-item">
      <div class="collection-item-header">
        <img class="collection-item-avatar" src="../assets/logo.png" alt="" />
        <div class="collection-item-userinfo">
          <p class="collection-item-name">996级神学 班竹伯伯</p>
          <p class="collection-item-addition">1996年2曰29日</p>
        </div>
      </div>
      <div class="collection-item-main">
        <div class="collection-item-video">
          <img src="../assets/carousel-img1.png" alt="" />
        </div>
        <div class="collection-item-info">
          <p class="collection-item-info-title">《华园记忆宣传片》</p>
          <p class="collection-item-info-desc">巍巍学府，山高水长，吾校吾家。求学于斯，成长于斯，华园记忆。</p>
        </div>
      </div>
    </div> -->
  </div>
  <!-- 到底提示 -->
  <div class="footer">{{ footerText }}</div>
</template>

<script>
import { ref, watch } from 'vue';
import Header from '../components/Header.vue';
import Loading from '../components/Loading.vue';
import { reachBottomAndGetData, goBack, getYYYYMMDDfromDateTime, useGlobalBgm } from '../utils/goBack';
import { getList } from '../service/request';

export default {
  name: 'Impression',
  components: {
    Header,
    Loading
  },
  setup() {
    let pageIdx = 1;
    const type = ref('video');
    const content = ref([]);
    const footerText = ref('');

    function getCollection() {
      const params = {
        offset: pageIdx,
        limit: 5
      };

      footerText.value = '加载中...';

      function getData() {
        if (type.value === 'video') {
          return getList('/api/vclipList', { params });
        }
        if (type.value === 'img') {
          return getList('/api/vphotoList', { params });
        }
      }
      return getData().then((response) => {
        let data = response.data;
        if (data.length === 0) {
          footerText.value = 'GirlFriend myLove = new Beauty(ONLY_ONE);';
        } else {
          pageIdx++;
        }
        return data;
      });
    }
    getCollection().then((data) => (content.value = [...data]));

    function changeType(v) {
      type.value = v;
      pageIdx = 1;
      getCollection().then((data) => (content.value = [...data]));
    }

    // 触底，加载数据
    reachBottomAndGetData(() => {
      getCollection().then((data) => (content.value = [...content.value, ...data]));
    }, 500);

    // 下拉刷新
    const refresh = ref(null);
    const NEED_PULL = 80;
    const MAX_PULL = 130;
    let startMouseY;
    let mDiff;
    let isClick = false;
    let isLoading = false;
    function onMouseDown(e) {
      if (window.screenTop > 0 || isLoading) return;
      isClick = true;
      startMouseY = e.pageY;
      refresh.value.classList.remove('transition-height');
    }
    function onMouseMove(e) {
      if (!isClick) return;
      mDiff = e.pageY - startMouseY;
      if (mDiff < 0) {
        startMouseY = e.pageY;
        mDiff = 0;
      } else if (mDiff >= MAX_PULL) {
        mDiff = MAX_PULL;
        startMouseY = e.pageY - MAX_PULL;
      }
      requestAnimationFrame(() => {
        refresh.value.style.height = `${mDiff}px`;
      });
    }
    function onMouseUp() {
      if (!isClick) return;
      let temp = mDiff;
      mDiff = 0;
      isClick = false;
      refresh.value.classList.add('transition-height');

      if (temp < NEED_PULL) {
        refresh.value.removeAttribute('style');
        return;
      }

      isLoading = true;
      getCollection()
        .then((data) => {
          content.value = [...data, ...content.value];
        })
        .finally(() => {
          isLoading = false;
          refresh.value && refresh.value.removeAttribute('style');
        });
    }

    // 播放第二个视频时，停止上一次播放的视频
    let nowPlayingTarget = ref(null);
    function onVideoPlay(e) {
      if (nowPlayingTarget.value && nowPlayingTarget.value != e.target) {
        nowPlayingTarget.value.pause();
      }
      nowPlayingTarget.value = e.target;

      // 视频离开可视区域时停止播放
      let observer = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio === 0) {
          e.target.pause();
        }
      });
      observer.observe(e.target);
      function clean(type) {
        return function cb(event) {
          console.log(type);
          observer.disconnect();
          if (nowPlayingTarget.value == event.target) {
            nowPlayingTarget.value = null;
          }
          e.target.removeEventListener(type, cb);
        };
      }
      e.target.addEventListener('pause', clean('pause'));
      e.target.addEventListener('ended', clean('ended'));
    }

    // 视频播放时，暂停全局 bgm。
    // 视频暂停或结束时,播放全局 bgm。
    const { globalBgmGo, globalBgmPause } = useGlobalBgm();
    watch(nowPlayingTarget, (v) => {
      console.log(v);
      if (v == null) {
        globalBgmGo();
      } else {
        globalBgmPause();
      }
    });

    return {
      goBack: goBack(),
      content,
      footerText,
      type,
      changeType,
      getYYYYMMDDfromDateTime,
      refresh,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onVideoPlay
    };
  }
};
</script>

<style scoped>
.refresh {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;
  text-align: center;
}
.transition-height {
  transition: height 1s ease;
}
.card-container {
  width: 1080px;
  height: 544px;

  background: #f4f5f7;
  border-radius: 20px;

  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;
  color: #5277bf;
}
.card-container p {
  padding: 33px 55px 25px;
}
.card-container img {
  margin-left: 39px;
  cursor: pointer;
}
.card-container img:nth-of-type(1) {
  margin-left: 55px;
}
.collection-container {
  margin-top: 30px;
  padding-bottom: 20px;
  background: #f4f5f7;
  border-radius: 20px 20px 0 0;
}
.collection-title {
  padding: 40px 55px 20px;

  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;
  color: #5277bf;
}
.collection-type-container {
  overflow: hidden;
  padding-left: 55px;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 29px;
}
.collection-type-container::after {
  content: '';
  display: block;
  clear: both;
}
.collection-type,
.collection-type-active {
  margin-right: 26px;
  cursor: pointer;
}
.collection-type {
  float: left;
  padding: 14px 35px;

  color: #000000;
  background: #e4e8f1;
  mix-blend-mode: normal;
  border-radius: 4px;
}
.collection-type-active {
  float: left;
  padding: 14px 35px;

  color: #1e1e1e;
  background: rgb(82, 119, 191, 0.2);
  mix-blend-mode: normal;
  border-radius: 4px;
}
.collection-item {
  width: 999px;
  /* height: 881px; */
  margin: 32px auto;
  background: #ffffff;
  border-radius: 20px;
}
.collection-item-header {
  padding: 52px 0 37px 37px;
  display: flex;
  align-items: center;
}
.collection-item-avatar {
  cursor: pointer;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.collection-item-userinfo {
  cursor: pointer;
  display: inline-block;
  margin-left: 35px;
}
.collection-item-name {
  font-size: 36px;
  line-height: 44px;
  color: #1e1e1e;
}
.collection-item-addition {
  font-size: 24px;
  line-height: 29px;
  color: #a4a4a4;
}
.collection-item-main {
  padding: 0 32px;
}
.collection-item-video {
  cursor: pointer;
  width: 100%;
  border-radius: 25px;
  /* 设置 overflow 之前，圆角 border-radius 不生效 */
  /* 。。。 */
  overflow: hidden;
}
.collection-item-main video,
.collection-item-main img {
  width: 100%;
  height: auto;
}
.collection-item-info {
  padding: 50px 0;
}
.collection-item-info-title {
  cursor: pointer;
  font-size: 36px;
  line-height: 36px;
  text-transform: uppercase;
  color: #010e23;
}
.collection-item-info-desc {
  cursor: pointer;
  font-size: 24px;
  line-height: 60px;
  text-transform: uppercase;
  color: #a4a4a4;
}
.footer {
  color: #5277bf;
  font-size: 36px;
  line-height: 36px;
  text-align: center;
  padding-bottom: 36px;
  background: #f4f5f7;
}
</style>
