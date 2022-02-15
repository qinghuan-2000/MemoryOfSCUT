<template>
  <audio ref="audio" :volume="volume" autoplay></audio>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';
import { getBackgroundMusic } from '../service/request';
import daoxiang from '/daoxiang.mp3';

export default {
  name: 'BGM',
  props: {
    // 是否播放
    go: {
      type: Boolean,
      default: true
    },
    volume: {
      type: Number,
      default: 0.5
    }
  },
  setup(props) {
    const audio = ref(null);

    let tryTime = 0;
    function getMusic() {
      tryTime++;
      // 垫底
      if (tryTime > 3) {
        tryTime = 0;
        audio.value.src = daoxiang;
        if (props.go) audio.value.play();
        return;
      }
      getBackgroundMusic()
        .then((response) => {
          audio.value.src = response.data.active;
          if (props.go) audio.value.play();
          tryTime = 0;
        })
        .catch((error) => {
          console.log('BGM error', tryTime, error);
          getMusic();
        });
    }
    getMusic();

    onMounted(() => {
      // 音乐结束时重新获取
      audio.value.addEventListener('ended', getMusic);
    });

    watch(toRef(props, 'go'), (v) => {
      // console.log('watch go');
      if (!v) audio.value.pause();
      else audio.value.play();
    });

    onBeforeUnmount(() => {
      audio.value && audio.value.pause();
    });

    return {
      audio
    };
  }
};
</script>

<style scoped>
audio {
  width: 0;
}
</style>
