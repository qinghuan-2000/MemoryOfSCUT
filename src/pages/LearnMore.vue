<template>
  <!-- 头部 -->
  <Header :title="'了解更多'" @goBack="goBack" />
  <!-- <div class="header">
    <img class="arrow-back" src="/arrow-back.png" alt="back" @click="goBack" />
    <span>了解更多</span>
  </div> -->
  <!-- 选项栏 -->
  <div class="tab-container">
    <div v-for="(item, idx) in tabs" :key="item" :class="{ 'tab-active': idx === activeTab }" @click="selectTab(idx)">
      <span>{{ item }}</span>
      <div></div>
    </div>
  </div>
  <!-- 主体 -->
  <!-- 项目简介 -->
  <div class="main proj-intro" v-if="activeTab === 0">
    <img class="bg" src="/proj-intro-bg.png" alt="" />
    <p class="proj-intro-title">华园记忆</p>
    <br />
    <p>巍巍学府，山高水长，吾校吾家。</p>
    <p>求学于斯，成长于斯，华园记忆。</p>
    <br />
    <p>我们来自五湖四海，</p>
    <p>我们缘聚在华南理工大学。</p>
    <br />
    <p>生活于华园，一校三区，风景宜人。</p>
    <p>你会从何种角度欣赏五山校区古建筑的红墙绿瓦？</p>
    <p>你会将何种意义赋予大学城校区人工湖的 Z 字桥？</p>
    <p>你会以何种思索穿梭国际校区 D3 建筑的未来已来拱门？</p>
    <br />
    <p>求学于华园，文化科技，格物致知。</p>
    <p>你研究何种科学与技术，遇到哪些难题？</p>
    <p>你探讨何种文化与艺术，遇到哪些困惑？</p>
    <br />
    <p>华园数载，良师益友，相逢相知。</p>
    <p>你是否想过与校友分享生活的感悟？以何种方式。</p>
    <p>你是否想过与校友交流学科的融合？以何种项目。</p>
    <br />
    <p>我们身处互联网时代，开放共创是时代的基因。</p>
    <p>我们大胆设想，并正在开展一系列的探索实践活动：</p>
    <br />
    <p class="sub-header">创意设计</p>
    <p>我们一起发现华园风物的美丽。</p>
    <p>我们一起创作视觉文化系统。</p>
    <br />
    <p class="sub-header">数字艺术</p>
    <p>我们一起汇聚珍贵影像资料。</p>
    <p>我们一起创作数字艺术呈现方案。</p>
    <br />
    <p>我们已经落地一些示范案例。</p>
    <p>我们设计了一些华园视觉符号，转化为校园文化创意产品。</p>
    <p>我们精选了一些华园视频图像，落地为艺术文化交互装置。</p>
    <br />
    <p>我们有了笃行的方向。</p>
    <p>我们将开展更多的探索。</p>
    <p>我们给活动起了一个名字：华园记忆。</p>
    <p>华园，吾校吾家。</p>
    <p>记忆，源自于我们在华园经历的人与事，凝聚了我们华工人的情谊。</p>
    <br />
    <p>华园记忆，期待有情怀华工人共同参与，祝愿华工校友：</p>
    <p>求知求本，引领社会思想改革。</p>
    <p>求实求真，促进产业科技创新。</p>
    <br />
    <br />
    <br />
    <p class="proj-intro-footer">——02 级 计算机 陈春华 于五山华工</p>
  </div>

  <!-- 活动预告 -->
  <div class="main activity-trailer" v-if="activeTab === 1">
    <!-- <router-link to="/activity"> -->
    <div class="activity-item" v-for="item in activityList" :key="item.id">
      <img :src="item.imgSrc" alt="" />
      <div style="float: left">
        <p class="activity-title">{{ item.title }}</p>
        <p class="activity-sponsor">{{ item.sponsor }}</p>
      </div>
      <img class="miniprogram" src="/miniprogram.jpg" alt="" />
      <div style="clear: both"></div>
    </div>
    <!-- </router-link> -->
  </div>

  <!-- 团队介绍 -->
  <div class="main team-intro" v-if="activeTab === 2">
    <div>
      <!-- <p class="team-member-post">核心成员</p> -->
      <div class="team-member" v-for="(member, idx) in memberList" :key="idx">
        <img :src="member.userIcon || logoList[~~(Math.random() * 3)]" alt="" />
        <div class="team-member-info">
          <span>{{ member.name }}&nbsp;&nbsp;&nbsp;{{ member.yearOfEnroll }}{{ member.major }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{ member.contribution }}</span>
          <p>{{ member.description }}</p>
          <br />
          <p>{{ `${getYYYYMMfromDateTime(member.startAt)} - ${getYYYYMMfromDateTime(member.endAt)}` }}</p>
        </div>
      </div>
    </div>
    <!-- <div>
      <p class="team-member-post">设计团队</p>
      <div class="team-member" v-for="(member, idx) in designTeamList" :key="idx">
        <img :src="member.avatar" alt="" />
        <div class="team-member-info">
          <span>{{ member.name }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{ member.post }}</span>
          <p v-for="motto in member.mottoList" :key="motto">{{ motto }}</p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import Header from '../components/Header.vue';
import { getMemberList } from '../service/request';
import { goBack } from '../utils/goBack';
// import activity1 from '/activity1.png';
// import activity2 from '/activity2.png';
import activity3 from '/activity3.jpg';
import core1 from '/core1.png';
import core2 from '/core2.png';
import design1 from '/design1.png';
import design2 from '/design2.png';
import daxuecheng from '/icon-daxuecheng.jpg';
import wushan from '/icon-wushan.jpg';
import guoji from '/icon-guoji.jpg';

export default {
  name: 'LearnMore',
  components: {
    Header
  },
  setup() {
    // 选项栏
    const tabs = ['项目介绍', '活动预告', '团队介绍'];
    const activeTab = ref(0);
    function selectTab(idx) {
      activeTab.value = idx;
    }

    // 活动预告
    const activityList = reactive([
      {
        id: 1,
        imgSrc: activity3,
        title: '华园记忆影像征集',
        sponsor: '详情请扫二维码'
      }
      // {
      //   id: 1,
      //   imgSrc: activity1,
      //   title: '华园记忆视觉符号设计比赛',
      //   sponsor: 'K-ICM Official'
      // },
      // {
      //   id: 2,
      //   imgSrc: activity2,
      //   title: '华园记忆老照片时光机征集',
      //   sponsor: 'K-ICM Official'
      // }
    ]);

    // 团队介绍
    const logoList = [daxuecheng, wushan, guoji];
    const memberList = ref([
      {
        name: '陈春华',
        contribution: '华园记忆创始人',
        yearOfEnroll: '02级',
        major: '计算机',
        description: '巍巍学府，山高水长，吾校吾家。 求学于斯，成长于斯，华园记忆。',
        userIcon: core1,
        startAt: '2030-12-12',
        endAt: '',
        top: 1
      },
      {
        name: '陈春华',
        contribution: '华园记忆创始人',
        yearOfEnroll: '',
        major: '',
        description: '巍巍学府，山高水长，吾校吾家。 求学于斯，成长于斯，华园记忆。',
        userIcon: core2,
        startAt: '',
        endAt: '',
        top: 2
      },
      {
        name: '陈春华',
        contribution: '华园记忆创始人',
        yearOfEnroll: '',
        major: '',
        description: '巍巍学府，山高水长，吾校吾家。 求学于斯，成长于斯，华园记忆。',
        userIcon: design1,
        startAt: '',
        endAt: '',
        top: 3
      },
      {
        name: '陈春华',
        contribution: '华园记忆创始人',
        yearOfEnroll: '',
        major: '',
        description: '巍巍学府，山高水长，吾校吾家。 求学于斯，成长于斯，华园记忆。',
        userIcon: design2,
        startAt: '',
        endAt: '',
        top: 4
      }
    ]);

    getMemberList().then((data) => {
      memberList.value = data;
    });

    function getYYYYMMfromDateTime(str) {
      if (!str) return '至今';
      let date = new Date(str);
      let yyyy = date.getFullYear();
      let mm = date.getMonth() + 1;
      return `${yyyy}年${mm}月`;
    }

    return {
      goBack: goBack(),
      tabs,
      activeTab,
      selectTab,
      activityList,
      memberList,
      logoList,
      getYYYYMMfromDateTime
    };
  }
};
</script>

<style scoped>
/* .header {
  padding: 50px 40px 50px;

  text-align: center;
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 48px;
  color: #5277bf;
}
.arrow-back {
  float: left;
  cursor: pointer;
} */
.tab-container {
  padding: 20px 115px 7px;

  display: flex;
  justify-content: space-between;
}
.tab-container div {
  cursor: pointer;
  display: inline-block;
  text-align: center;
  transition-duration: 1s;
}
.tab-container span {
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 36px;
  letter-spacing: 0.1em;
  color: #a4a4a4;
}
.tab-active span {
  color: #5277bf;
}
.tab-active div {
  width: 100%;
  height: 7px;
  background: #5277bf;
  border-radius: 20px;
}
.main {
  /* background: #f4f5f7; */
  position: absolute;
  top: 230px;
  bottom: 0;
}
/* 项目简介 */
.proj-intro {
  width: 100%;
  box-sizing: border-box;
  padding-top: 100px;
  /* padding-left: 66px; */
  /* padding: 100px 66px; */
  font-style: normal;
  font-weight: normal;
  color: #000000;
}
.proj-intro .bg {
  width: 100%;
  position: absolute;
  z-index: -10;
  opacity: 0.1;
}
.proj-intro p {
  font-size: 24px;
  line-height: 32px;
  text-align: center;
}
.proj-intro .sub-header {
  font-weight: bold;
}
.proj-intro .proj-intro-footer {
  opacity: 0.8;
}
.proj-intro .proj-intro-title {
  font-size: 36px;
  line-height: 36px;
}
/* 活动预告 */
.activity-trailer {
  width: 100%;
  box-sizing: border-box;
  padding: 55px 65px 0;
}
.activity-item {
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 66px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.2);
}
.activity-item img {
  width: 100%;
  /* height: 100%; */
}
.activity-item p {
  padding-top: 36px;
  padding-left: 45px;
}
.activity-title {
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 36px;
  text-transform: capitalize;
  color: #5277bf;
}
.activity-sponsor {
  padding-bottom: 36px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-transform: capitalize;
  color: #a0aac0;
}
.activity-item .miniprogram {
  float: right;
  width: 144px;
  height: 144px;
  padding: 12px 45px 12px;
}
/* 团队介绍 */
.team-intro {
  width: 100%;
}
.team-member-post {
  padding: 54px 0 24px 33px;
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;

  color: #404040;
}
.team-member {
  padding: 60px 50px 72px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);

  display: flex;
  align-items: center;
}
.team-member::after {
  content: '';
  display: block;
  clear: both;
}
.team-member img {
  float: left;
  width: 160px;
  height: 160px;
  border-radius: 50%;
}
.team-member-info {
  float: left;
  padding-left: 72px;
  font-style: normal;
  font-size: 36px;
  line-height: 36px;
}
.team-member-info span:nth-of-type(1) {
  display: inline-block;
  margin-bottom: 24px;
  font-weight: bold;
  color: #404040;
}
.team-member-info span:nth-of-type(2) {
  display: inline-block;
  margin-bottom: 24px;
  color: #adadae;
}
.team-member-info p {
  font-size: 24px;
  line-height: 32px;
  color: #404040;
}
</style>
