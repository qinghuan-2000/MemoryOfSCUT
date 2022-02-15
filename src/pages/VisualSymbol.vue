<template>
  <!-- 头部 -->
  <Header :title="'视觉符号'" @goBack="goBack" />
  <!-- <div class="header">
    <img class="arrow-back" src="../assets/arrow-back.png" alt="back" @click="goBack" />
    <span>视觉符号</span>
  </div> -->
  <!-- 主体 -->
  <div class="card-container">
    <resource-card
      v-for="({ userIcon, author, dateTime, resource, type, title, description }, idx) in symbolList"
      :key="idx"
      :avatar="userIcon"
      :author="author"
      :dateTime="dateTime"
      :resourceList="resource"
      :type="type"
      :title="title"
      :description="description"
    />
    <!-- <div class="card" v-for="symbol in symbolList" :key="symbol.resource[0]">
      <div class="user">
        <img class="avatar" :src="symbol.userIcon" alt="" />
        <div class="top">
          <p class="username">{{ symbol.author }}</p>
          <p class="addition">{{ getYYYYMMDDfromDateTime(symbol.dateTime) }}</p>
        </div>
      </div>
      <img class="resource" :src="symbol.resource[0]" alt="" />
      <div class="info">
        <p class="title">{{ symbol.title }}</p>
        <p class="motto">{{ symbol.description }}</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import { ref } from 'vue';
import Header from '../components/Header.vue';
import { goBack, getYYYYMMDDfromDateTime } from '../utils/goBack';
import { getList } from '../service/request';
import ResourceCard from '../components/ResourceCard.vue';

export default {
  name: 'VisualSymbol',
  components: {
    Header,
    ResourceCard
  },
  setup() {
    const campusPy2Zh = {
      daxuecheng: '大学城校区',
      wushan: '五山校区',
      guoji: '国际校区'
    };
    const symbolList = ref([]);
    getList('/api/viconList').then((response) => {
      console.log('/api/viconList', response.data);
      symbolList.value = response.data;
    });

    console.log('VisualSymbol');

    return {
      goBack: goBack(),
      getYYYYMMDDfromDateTime,
      campusPy2Zh,
      symbolList
    };
  }
};
</script>

<style scoped>
/* 主体 */
.card-container {
  padding: 0 40px 40px;
  background-color: #eeeeee;
}
.card {
  margin-top: 45px;
}
/* .card {
  width: 100%;
  margin-top: 45px;
  box-sizing: border-box;
  padding: 54px 33px 0;
  background: #ffffff;
  border-radius: 20px;
  cursor: pointer;
}
.card .resource {
  width: 100%;
  border-radius: 20px;
}
.user .avatar {
  float: left;
  margin-bottom: 36px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
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
.info {
  padding-bottom: 39px;
  text-align: left;
  font-style: normal;
  font-weight: normal;
  text-transform: uppercase;
}
.info .title {
  padding-top: 48px;
  padding-bottom: 12px;
  font-size: 36px;
  line-height: 36px;
  color: #010e23;
}
.info .motto {
  padding-left: 60px;
  font-size: 24px;
  line-height: 34px;
  color: #a4a4a4;
} */
</style>
