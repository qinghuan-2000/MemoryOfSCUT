<template>
  <!-- 头部 -->
  <Header :title="'艺术创作'" @goBack="goBack" />
  <!-- 刷新 -->
  <div ref="refresh" class="refresh"><Loading /></div>
  <!-- 列表 -->
  <div class="container" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
    <resource-card
      v-for="({ userIcon, author, dateTime, resource, type, title, description }, idx) in creationList"
      :key="author + title + idx"
      :avatar="userIcon"
      :author="author"
      :dateTime="dateTime"
      :resourceList="resource"
      :type="type"
      :title="title"
      :description="description"
    />
    <!-- <div class="card" v-for="item in creationList" :key="item.resource[0]">
      <img v-for="pic in item.resource" :src="pic" alt="" />
    </div> -->
  </div>
  <!-- 到底提示 -->
  <div class="footer">{{ footerText }}</div>
</template>

<script>
import { ref } from 'vue';
import { goBack, reachBottomAndGetData } from '../utils/goBack';
import { getList } from '../service/request';
import Header from '../components/Header.vue';
import Loading from '../components/Loading.vue';
import ResourceCard from '../components/ResourceCard.vue';

export default {
  components: { Header },
  name: 'ArtisticCreation',
  components: {
    Header,
    Loading,
    ResourceCard
  },
  setup() {
    let pageIdx = 1;
    const creationList = ref([]);
    const footerText = ref('');

    getList('/api/paintingList', { params: { offset: pageIdx, limit: 20 } }).then((response) => {
      if (response.data.length > 0) {
        pageIdx++;
      }
      creationList.value = response.data;
    });

    // 下拉刷新
    const refresh = ref(null);
    const NEED_PULL = 70;
    const MAX_PULL = 120;
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
      getList('/api/paintingList', { params: { offset: pageIdx, limit: 20 } })
        .then((response) => {
          if (response.data.length > 0) {
            pageIdx++;
          }
          creationList.value = [...response.data, ...creationList.value];
        })
        .finally(() => {
          isLoading = false;
          refresh.value.removeAttribute('style');
        });
    }

    // 监听滚动条
    reachBottomAndGetData(function cb() {
      footerText.value = '加载中...';
      getList('/api/paintingList', { params: { offset: pageIdx, limit: 20 } }).then((response) => {
        if (response.data.length === 0) {
          footerText.value = 'GirlFriend myLove = new Beauty(ONLY_ONE);';
        } else {
          pageIdx++;
        }
        creationList.value = [...creationList.value, ...response.data];
      });
    }, 500);

    return {
      goBack: goBack(),
      refresh,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      creationList,
      footerText
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
.container {
  padding: 10px 45px;
  background-color: #eeeeee;
}
.card {
  margin-top: 45px;
}
/* .card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 100px;
  padding-bottom: 0;
  margin-bottom: 40px;
  background-color: #ffffff;
}
.card img {
  display: inline-block;
  width: 100%;
  margin-bottom: 100px;
} */
.footer {
  color: #5277bf;
  font-size: 36px;
  line-height: 36px;
  text-align: center;
  padding-bottom: 36px;
  background: #eeeeee;
}
</style>
