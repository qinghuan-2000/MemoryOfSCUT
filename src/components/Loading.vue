<template>
  <div ref="container" class="loading">
    <canvas ref="cav" :width="cavWidth" :height="cavHeight"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';

const MIN_SIZE = 40;
const BETTER_SIZE = 60;
export default {
  name: 'Loading',
  props: {
    width: {
      type: Number,
      default: 60,
      validator(v) {
        return v >= MIN_SIZE;
      }
    },
    height: {
      type: Number,
      default: 60,
      validator(v) {
        return v >= MIN_SIZE;
      }
    }
  },
  setup(props) {
    const container = ref(null);
    const cav = ref(null);
    const cavWidth = ref(props.width);
    const cavHeight = ref(props.height);

    // 更新 canvas 宽高为容器宽高
    onMounted(() => {
      cavWidth.value =
        props.width || container.value.clientWidth >= MIN_SIZE ? container.value.clientWidth : BETTER_SIZE;
      cavHeight.value =
        props.height || container.value.clientHeight >= MIN_SIZE ? container.value.clientHeight : BETTER_SIZE;
    });

    const colors = ['#D14C3A', '#DAAD55', '#7F8DDA', '#000000'];
    const radius = 5;
    let dist = 30;
    const circleAngle = 2 * Math.PI;
    let startIdx = 0;
    let startAngle = 0;
    watch([cavWidth, cavHeight], ([w, h]) => {
      dist = (Math.min(cavWidth.value, cavHeight.value) - 2 * radius - 6) / 2;
    });
    function draw(ctx) {
      ctx.clearRect(0, 0, cavWidth.value, cavHeight.value);
      ctx.save();
      ctx.translate(cavWidth.value / 2, cavHeight.value / 2);
      for (let i = 0; i < 4; ++i) {
        let x = dist * Math.cos(startAngle + (i / 2) * Math.PI);
        let y = dist * Math.sin(startAngle + (i / 2) * Math.PI);
        ctx.fillStyle = colors[(startIdx + i) % colors.length];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, circleAngle);
        ctx.fill();
      }
      startAngle += 0.2;
      ctx.restore();
    }

    onMounted(() => {
      const ctx = cav.value.getContext('2d');
      setInterval(function loop() {
        draw(ctx);
      }, 40);
    });

    return { container, cav, cavWidth, cavHeight };
  }
};
</script>

<style scoped>
.loading {
  display: inline-block;
  /* width: 60px;
  height: 60px; */
}
.loading canvas {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
