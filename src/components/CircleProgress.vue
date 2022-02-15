<template>
  <div class="circle-progress">
    <canvas ref="canvas" width="70" height="70"></canvas>
    <span :style="{ color }">{{ textFunc(value / max) }}</span>
  </div>
</template>

<script>
export default {
  name: 'circle-progress',
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    lineWidth: {
      type: Number,
      default: 3
    },
    textFunc: {
      type: Function,
      default: (per) => `${Math.floor(per * 100)}%`
    },
    color: {
      type: String,
      default: '#518ce5'
    }
  },
  watch: {
    value() {
      this.draw();
    },
    max() {
      this.draw();
    },
    lineWidth() {
      this.draw();
    },
    textFunc() {
      this.draw();
    }
  },
  methods: {
    draw(cur, max) {
      requestAnimationFrame(() => {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        const x = Math.floor(canvas.width / 2);
        const y = Math.floor(canvas.height / 2);
        const per = this.value / this.max;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.arc(x, y, Math.min(x, y) - this.lineWidth, -0.5 * Math.PI, (per * 2 - 0.5) * Math.PI);
        ctx.stroke();
      });
    }
  }
};
</script>

<style>
.circle-progress {
  position: relative;
}
.circle-progress span {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font: 35px Roboto;
}
</style>
