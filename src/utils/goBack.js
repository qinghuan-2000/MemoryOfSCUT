import { inject, onBeforeUnmount, onUnmounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import carouselImg1 from '/carousel-img1.png';

export function goBack() {
  const router = useRouter();
  return function () {
    router.back();
  };
}

// 防抖
export function debounce(fn, delay = 500) {
  let prev = 0;
  let timer = 0;
  return function (...args) {
    let now = Date.now();
    if (now - prev > delay) {
      fn.apply(this, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
    prev = now;
  };
}

// 监听滚动，触底时请求数据
export function reachBottomAndGetData(fn, delay) {
  // 触底，加载数据
  function onScroll() {
    let scrollTop = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    let scrollHeight = document.body.scrollHeight;
    // console.log(scrollTop, clientHeight, scrollHeight, Math.ceil(scrollTop + clientHeight) + 10);
    if (Math.ceil(scrollTop + clientHeight) + 1 >= scrollHeight) {
      fn.call(null);
    }
  }
  const deOnScroll = debounce(onScroll, delay);
  watchEffect((onInvalidate) => {
    window.addEventListener('scroll', deOnScroll);
    onInvalidate(() => {
      console.log('clear effect');
      window.removeEventListener('scroll', deOnScroll);
    });
  });

  // onMounted(() => {
  //   console.log('onMounted');
  //   window.addEventListener('scroll', deOnScroll);
  // });
  onBeforeUnmount(() => {
    console.log('onBeforeUnmount');
    window.removeEventListener('scroll', deOnScroll);
  });
  onUnmounted(() => {
    console.log('onUnmounted');
  });
}

// 转换日期
export function getYYYYMMDDfromDateTime(str) {
  let date = new Date(str);
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  return `${yyyy}年${mm}月${dd}日`;
}

// 图片不存在

export function onCarouselError(e) {
  e.target.src = carouselImg1;
}

export function useGlobalBgm() {
  const globalBgmGo = inject('globalBgmGo');
  const globalBgmPause = inject('globalBgmPause');
  return { globalBgmGo, globalBgmPause };
}
