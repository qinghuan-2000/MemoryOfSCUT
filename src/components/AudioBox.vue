<template>
  <div class="audio-box" ref="container">
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <audio ref="audio" loop crossorigin="anonymous" v-bind="$attrs">
      <source :src="src" :type="type" />
    </audio>
  </div>
</template>

<script>
const colors = [
  [255, 255, 255], // 白
  [250, 205, 93], // 黄
  [250, 205, 93], // 黄
  [81, 140, 229], // 蓝
  [81, 140, 229], // 蓝
  [233, 85, 65], // 红
  [233, 85, 65] // 红
];
const pow = 1.2; // 控制颜色渐变，控制音量缩放的常数
const calcColor = (per, alpha = 1) => {
  const t = per * (colors.length - 1);
  const [r1, g1, b1] = colors[Math.floor(t)];
  const [r2, g2, b2] = colors[Math.ceil(t)];
  let d = t - Math.floor(t);
  if (d > 0.5) {
    d = 1 - Math.pow(1 - d, pow);
  } else {
    d = Math.pow(d, pow);
  }
  const [r, g, b] = [r1 + (r2 - r1) * d, g1 + (g2 - g1) * d, b1 + (b2 - b1) * d];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export default {
  name: 'audio-box',
  inheritAttrs: false,
  props: {
    height: {
      // canvas高度，默认为父元素高度
      // 注意，由于canvas高度是跟随父元素的，div高度不会被canvas撑开，需要在组件外部设置样式高度
      // 这么设计的原因是css写相对高度比较方便，而canvas只能使用像素，组件内部会自动调整高度和宽度
      type: Number,
      default: 0
    },
    width: {
      // canvas宽度，默认为父元素宽度
      type: Number,
      default: 0
    },
    src: String, // 音频源URL
    type: {
      // 音频MIME类型
      type: String,
      default: 'audio/mp3'
    },
    volume: {
      // 音量
      type: Number,
      default: 0.1
    },
    autoPlay: Boolean, // 是否自动播放
    fftSize: {
      // 快速傅里叶变换的参数，只能为2^n，数值越大柱状图越密集，取值范围为[32, 32768]
      type: Number,
      default: 64
    },
    // 从左到右背景高度减少(计算比例时的背景高度)的指数，1就是线性减少
    // 表现出来就是pow越大在同一音频数值下从左到右柱状图的高度越高
    pow: {
      type: Number,
      default: 0.6
    },
    // 各个柱子之间的间隔，这个参数实际上是调整柱子的宽度，即 (1-padding) * 柱宽度 为新的柱宽度，padding * 柱宽度 为间隔
    padding: {
      type: Number,
      default: 0.6
    },
    // 不透明度
    alpha: {
      type: Number,
      default: 0.5
    },
    // 柱个数
    count: {
      type: Number,
      default: 21
    }
  },
  data() {
    // 由于resize事件会短时间触发多次，需要做个防抖
    let resizing;
    const resize = () => {
      if (resizing) clearTimeout(resizing);
      resizing = setTimeout(() => {
        resizing = null;
        const el = this.$refs.container;
        if (el) {
          this.containerWidth = el.clientWidth;
          this.containerHeight = el.clientHeight;
        }
      }, 100);
    };
    return {
      resize,
      containerWidth: 0,
      containerHeight: 0
    };
  },
  computed: {
    canvasWidth() {
      return this.width || this.containerWidth;
    },
    canvasHeight() {
      return this.height || this.containerHeight;
    },
    volumeScale() {
      return Math.exp(0.1 - this.volume);
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize);
    this.resize();
    if (this.autoPlay) {
      setTimeout(() => this.play());
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize);
    this.pause();
  },
  watch: {
    volume(v) {
      const audio = this.$refs.audio;
      if (!audio) return;
      audio.volume = v;
    }
  },
  methods: {
    // 播放音频，返回Promise
    // 如果音频类型支持就会一直等待到能播放的状态开始播放并返回resolve
    // 如果音频类型不支持返回reject
    play() {
      return new Promise((resolve, reject) => {
        const canvas = this.$refs.canvas;
        const canvasCtx = canvas.getContext('2d');
        const audio = this.$refs.audio;
        if (!audio.canPlayType(this.type)) {
          return reject(new Error('Unsupported Type'));
        }
        audio.load();

        const audioCtx = new AudioContext();
        const src = audioCtx.createMediaElementSource(audio);
        const analyser = audioCtx.createAnalyser();
        src.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = this.fftSize;
        const bufferLength = analyser.frequencyBinCount; // = fftSize * 0.5
        const dataArray = new Uint8Array(bufferLength);

        // 绘制频域柱状图
        const renderFrame = () => {
          // 清除画布
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          // 获取当前时刻的频域数据
          analyser.getByteFrequencyData(dataArray);
          const len = Math.min(this.count, bufferLength);
          const maxHeight = 255 * this.volumeScale; // 考虑音量缩放后的最大柱高度
          const itemWidth = Math.round(canvas.width / len);
          const barWidth = itemWidth * (1 - this.padding); // 柱宽度
          const bars = [];
          for (let i = 0; i < len; i++) {
            const x = i * itemWidth + (itemWidth * this.padding) / 2;
            if (x >= canvas.width) break;
            const per = Math.min(
              1,
              (Math.pow(this.volumeScale, pow) * dataArray[i]) / (maxHeight * Math.pow(1 - i / bufferLength, this.pow))
            ); // 柱高度百分比
            const barHeight = Math.round(canvas.height * per); // 柱高度
            bars.push([x, canvas.height - barHeight, barWidth, barHeight]);
          }
          bars.sort((a, b) => a[3] - b[3]); // 按高度从小到大排序
          bars.forEach(([x, y, w, h], i) => {
            canvasCtx.fillStyle = calcColor(i / bars.length, this.alpha); // 根据排序结果指定颜色
            canvasCtx.fillRect(x, y, w, h);
          });
          if (audio.paused) return;
          requestAnimationFrame(renderFrame);
        };
        // 需要产生用户交互之后才能播放
        // The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page. https://goo.gl/7K7WLu
        const interact = () => {
          window.removeEventListener('click', interact);
          window.removeEventListener('touchstart', interact);
          audioCtx.resume();
        };
        window.addEventListener('click', interact);
        window.addEventListener('touchstart', interact);

        const play = () => {
          audio.volume = this.volume;
          resolve(
            audio.play().then(() => {
              requestAnimationFrame(renderFrame);
            })
          );
        };
        // 用于标记音频加载完成，可以完整播放的状态
        let canPlayFlag = false;
        const canplaythrough = () => {
          audio.removeEventListener('canplaythrough', canplaythrough);
          if (audioCtx.state === 'running') {
            // 如果此时已经有过用户交互，那么开始播放
            play();
          }
          canPlayFlag = true;
        };
        audio.addEventListener('canplaythrough', canplaythrough);
        // 用于检测用户交互完成的状态
        if (audioCtx.state !== 'running') {
          const statechange = () => {
            if (audioCtx.state !== 'running') return;
            audioCtx.removeEventListener('statechange', statechange);
            if (canPlayFlag) {
              // 如果此时已经加载完成，那么开始播放
              play();
            }
          };
          audioCtx.addEventListener('statechange', statechange);
        }
      });
    },
    // 停止播放(组件被销毁前会自动调用)
    pause() {
      this.$refs.audio.pause();
    }
  }
};
</script>

<style scoped>
.audio-box {
  overflow: hidden;
}
canvas {
  display: block;
  margin: 0 auto;
}
</style>
