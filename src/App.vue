<template>
  <!-- <FristScreen /> -->
  <!-- <Impression /> -->
  <!-- <LearnMore /> -->
  <!-- <VisualSymbol /> -->
  <!-- <Activity /> -->
  <!-- <ResourceCard /> -->
  <!-- <ArtisticCreation /> -->
  <!-- <Header :title="华园印象" /> -->
  <router-view></router-view>
  <BGM :go="bgmState" :volume="bgmVolume" />
</template>

<script>
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import BGM from './components/BGM.vue';
// import FristScreen from './pages/FirstScreen.vue';
// import Impression from './pages/Impression.vue';
// import LearnMore from './pages/LearnMore.vue';
// import VisualSymbol from './pages/VisualSymbol.vue';
// import Activity from './pages/Activity.vue';
// import Header from './components/Header.vue';
// import ResourceCard from './components/ResourceCard.vue';
import ArtisticCreation from './pages/ArtisticCreation.vue';

export default {
  name: 'App',
  components: {
    BGM,
    // VisualSymbol,
    // ResourceCard,
    ArtisticCreation
  },
  setup() {
    // 禁止右键
    document.oncontextmenu = () => {
      return false;
    };

    // 如果是 pc 端，粗暴禁用缩放
    // onMounted(() => {
    //   if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    //     window.addEventListener(
    //       'touchstart',
    //       (e) => {
    //         if (e.touches.length >= 2) {
    //           e.preventDefault();
    //         }
    //       },
    //       { passive: false }
    //     );
    //   }
    // });

    // 屏幕无操作 delay 后重回首屏。
    const delay = 3000000;
    const router = useRouter();
    let timer;
    function countdown() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        router.push('/');
      }, delay);
    }
    onMounted(() => {
      console.log('app');
      window.addEventListener('click', countdown);
      window.addEventListener('scroll', countdown);
      window.addEventListener('touchstart', countdown);
    });
    onBeforeUnmount(() => {
      console.log('app done');
      window.removeEventListener('click', countdown);
      window.removeEventListener('scroll', countdown);
      window.removeEventListener('touchstart', countdown);
    });

    // 全局背景音乐
    const bgmState = ref(true);
    const bgmVolume = ref(1);
    const fadeSpeed = 0.02;
    const fadeInDelay = 40;
    const fadeOutDelay = 10;
    // 渐入过程中，用户操作导致暂停 bgm
    const play = () => {
      bgmState.value = true;
      bgmVolume.value = 0;
      const timer = setInterval(() => {
        if (!bgmState.value || bgmVolume.value >= 1) {
          clearInterval(timer);
        } else {
          let temp = bgmVolume.value;
          bgmVolume.value = temp + fadeSpeed > 1 ? 1 : temp + fadeSpeed;
        }
      }, fadeInDelay);
    };
    // 渐出
    const pause = () => {
      const timer = setInterval(() => {
        if (bgmVolume.value <= 0) {
          bgmState.value = false;
          clearInterval(timer);
        } else {
          let temp = bgmVolume.value;
          bgmVolume.value = temp - fadeSpeed <= 0 ? 0 : temp - fadeSpeed;
        }
      }, fadeOutDelay);
    };
    // 注入启动、停止函数 ==> 子组件可使用
    provide('globalBgmGo', play);
    provide('globalBgmPause', pause);

    window.addEventListener('click', function onWinClick() {
      play();
      window.removeEventListener('click', onWinClick);
    });
    window.addEventListener('touchstart', function onWinTouch() {
      play();
      window.removeEventListener('touchstart', onWinTouch);
    });

    return {
      bgmState,
      bgmVolume
    };
  }
  // components: {
  //   FristScreen,
  //   Impression,
  //   LearnMore,
  //   VisualSymbol,
  //   Activity,
  //   Header
  // }
};
</script>
