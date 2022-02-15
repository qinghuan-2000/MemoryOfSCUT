<template>
  <div class="container" @click="$event.stopPropagation()" @touchstart="$event.stopPropagation()">
    <resource-card
      :avatar="nowItem.userIcon"
      :author="nowItem.author"
      :dateTime="nowItem.dateTime"
      :resourceList="[nowItem.resource[0]]"
      :type="nowItem.type"
      :title="nowItem.title"
      :description="nowItem.description"
      @onVideoPlay="onVideoPlay"
      @onVideoPause="onVideoPause"
      @onVideoEnded="onVideoEnded"
    />
    <div class="pb-container">
      <span
        :class="{ 'pb-item-active': idx === activeIdx }"
        v-for="(_, idx) in list"
        :key="idx"
        @click="to($event, idx)"
      ></span>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import ResourceCard from '../components/ResourceCard.vue';

export default {
  name: 'Carousel',
  props: {
    list: {
      type: Array,
      default: []
    },
    imgGoDelay: {
      type: Number,
      default: 3000
    },
    // 该时间间隔内视频还没开始播放则显示下一个
    videoWaitCD: {
      type: Number,
      default: 3000
    },
    // 视频播放暂停或结束后显示下一个的间隔
    videoGoDelay: {
      type: Number,
      default: 3000
    }
  },
  components: {
    ResourceCard
  },
  setup(props) {
    const activeIdx = ref(0);
    const nowItem = computed(() => props.list[activeIdx.value]);

    const next = () => (activeIdx.value = (activeIdx.value + 1) % props.list.length);
    const to = (e, idx) => {
      e.stopPropagation();
      activeIdx.value = idx;
      go();
    };
    let timer = null;
    const go = () => {
      timer && clearTimeout(timer);
      if (props.list[activeIdx.value].type === 'video') {
        timer = setTimeout(next, props.videoWaitCD);
      } else {
        timer = setTimeout(next, props.imgGoDelay);
      }
    };
    watch(activeIdx, () => {
      go();
    });
    onMounted(() => {
      go();
    });

    const onVideoPlay = () => {
      timer && clearTimeout(timer);
    };
    function nextFromVideo() {
      timer && clearTimeout(timer);
      timer = setTimeout(next, props.videoGoDelay);
    }

    return {
      activeIdx,
      nowItem,
      to,
      onVideoPlay,
      onVideoPause: nextFromVideo,
      onVideoEnded: nextFromVideo
    };
  }
};
</script>

<style scoped>
.container {
  display: inline-block;
  width: 100%;
  text-align: center;
}
:deep(.card) {
  padding: 0;
}
:deep(.user) {
  padding: 12px 12px 0;
}
:deep(.resource-container) {
  height: 810px;
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.info) {
  padding-left: 12px;
  padding-bottom: 12px;
}
.pb-container {
  height: auto;
  text-align: center;
  margin-top: 48px;
  /* background-color: rgba(0, 0, 0, 0.8); */
}
.pb-container span {
  display: inline-block;
  margin-left: 12px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #b8b8b8;
  cursor: pointer;
  transition: all 1s;
}
.pb-container .pb-item-active {
  width: 45px;
  background: #ffffff;
}
</style>
