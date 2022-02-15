<template>
  <div ref="bg" class="background">
    <div ref="container" class="background-inner">
      <canvas
        ref="canvas"
        :width="width"
        :height="height"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @touchstart.passive="onTouch"
        @touchmove.passive="onTouch"
        @touchend.passive="onTouch"
      ></canvas>
      <div ref="bound" class="bound">时光边界</div>
    </div>
    <div ref="refresh" class="refresh"></div>
  </div>
</template>

<script>
import Mondrian from '../utils/mondrian';
import { onTouch, matchRects, checkImgWidthHeight, checkVideoWidthHeight, randInt } from '../utils/util';
import http from '../service/http';
const state = {
  isMoving: false,
  initX: 0,
  initY: 0,
  initLeft: 0,
  isAnima: false,
  startTime: 0,
  moved: false
};
const cancels = new Set();
export default {
  name: 'background',
  props: {
    // 线宽
    lineWidth: {
      type: Number,
      default: 20
    },
    // 迭代次数
    layer: {
      type: Number,
      default: 9
    },
    imgNum: {
      type: Number,
      default: 6
    }
  },
  data() {
    // 由于resize事件会短时间触发多次，需要做防抖
    let resizing;
    const resize = () => {
      if (resizing) clearTimeout(resizing);
      resizing = setTimeout(() => {
        resizing = null;
        const el = this.$refs.container;
        if (el) {
          this.width = el.clientWidth;
          this.height = el.clientHeight;
        }
        setTimeout(() => this.load());
      }, 100);
    };
    const blur = () => (state.isMoving = false);
    const handleClick = (info, evt) => {
      if (state.moved) return;
      this.$emit('click', info, evt, this.infos);
    };
    return {
      onTouch, // touch事件转mouse事件，性能开销不大，并且能比较好适配；反过来mouse事件转touch事件就有些小问题
      resize,
      blur,
      infos: [],
      handleClick,
      width: 0,
      height: 0
    };
  },
  computed: {
    minDragHeight() {
      return this.height * 0.07;
    },
    maxDragHeight() {
      return this.height * 0.25;
    },
    refreshFixedHeight() {
      return this.height * 0.15;
    },
    bgWidth() {
      return this.$refs.bg.clientWidth;
    },
    boundWidth() {
      return this.bgWidth * 0.15;
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('blur', this.blur);
    this.resize();
    // 先把视口移到canvas中央
    this.$refs.container.style.left = `-${(this.$refs.container.clientWidth - this.bgWidth) / 2}px`;
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('blur', this.blur);
  },
  methods: {
    handleMouseDown(ev) {
      if (state.isAnima) return;
      ev.preventDefault();
      state.isMoving = true;
      requestAnimationFrame(() => {
        state.startTime = Date.now();
        const container = this.$refs.container;
        // 记录鼠标相对于canvas的位置
        state.initX = ev.pageX;
        state.initY = ev.pageY;
        state.initLeft = container.offsetLeft;
        // 显示refresh
        const refresh = this.$refs.refresh;
        const bound = this.$refs.bound;
        container.classList.remove('transition');
        refresh.classList.remove('transition');
        bound.classList.remove('transition');
      });
    },
    handleMouseMove(ev) {
      if (!state.isMoving || state.isAnima) return;
      ev.preventDefault();
      // 获取拖动的相对距离，和垂直方向的越界检查
      const left = ev.pageX - state.initX;
      let top = Math.min(Math.max(ev.pageY - state.initY, -this.maxDragHeight), this.maxDragHeight);
      // 如果移动了一定的距离，就标记是拖动，click事件中就不进行处理
      if (!state.moved && (Math.abs(left) > 1 || Math.abs(top) > 1)) {
        state.moved = true;
      }
      requestAnimationFrame(() => {
        const container = this.$refs.container;
        const refresh = this.$refs.refresh;
        // container.style.removeProperty('transition');
        // 判断是否需要显示fresh
        if (Math.abs(top) > this.minDragHeight) {
          // 确定refresh出现在上面还是下面，并减去最小高度
          if (top >= 0) {
            top -= this.minDragHeight;
            refresh.classList.remove('bottom');
            refresh.classList.add('top');
          } else {
            top += this.minDragHeight;
            refresh.classList.remove('top');
            refresh.classList.add('bottom');
          }
          if (Math.abs(top) >= this.refreshFixedHeight) {
            refresh.textContent = '松开刷新';
          } else {
            refresh.textContent = '继续拖动';
          }
          // 调整refresh透明度、高度和contain的顶部
          refresh.style.opacity = `${Math.min(Math.abs(top) / this.refreshFixedHeight, 1)}`;
          refresh.style.height = `${Math.abs(top)}px`;
          container.style.top = `${top}px`;
        } else {
          refresh.style.height = '0';
          refresh.style.opacity = `0`;
          container.style.top = '0';
        }
        // 调整container位置，允许多移动 boundWidth 的大小
        const finalLeft = Math.max(
          Math.min(state.initLeft + left, this.boundWidth),
          this.bgWidth - container.clientWidth - this.boundWidth
        );
        container.style.left = `${finalLeft}px`;
        let remainWidth;
        const bound = this.$refs.bound;
        if (finalLeft > 0) {
          // 如果碰到左边界
          remainWidth = finalLeft;
          bound.classList.remove('right');
          bound.style.removeProperty('right');
          bound.classList.add('left');
          bound.style.left = `-${remainWidth}px`;
        } else if (finalLeft < this.bgWidth - container.clientWidth) {
          // 如果碰到右边界
          remainWidth = this.bgWidth - container.clientWidth - finalLeft;
          bound.classList.remove('left');
          bound.style.removeProperty('left');
          bound.classList.add('right');
          bound.style.right = `-${remainWidth}px`;
        }
        if (remainWidth !== undefined) {
          bound.style.opacity = `${Math.min(remainWidth / this.boundWidth, 1)}`;
          bound.style.width = `${remainWidth}px`;
        }
      });
    },
    handleMouseUp(ev) {
      if (!state.isMoving || state.isAnima) return;
      ev.preventDefault();
      state.isMoving = false;
      state.isAnima = true;
      if (state.moved) {
        setTimeout(() => (state.moved = false));
      }
      requestAnimationFrame(() => {
        const left = ev.pageX - state.initX;
        const top = ev.pageY - state.initY;
        const container = this.$refs.container;
        const refresh = this.$refs.refresh;
        container.classList.add('transition');
        refresh.classList.add('transition');
        // 判断是否要刷新
        if (Math.abs(top) > this.minDragHeight + this.refreshFixedHeight) {
          // 固定refresh并加回弹动画
          refresh.textContent = '正在刷新';
          refresh.style.height = `${this.refreshFixedHeight}px`;
          container.style.top = `${Math.sign(top) * this.refreshFixedHeight}px`;
          // 刷新
          // TODO 待优化：刷新时可以有更好的显示效果，如果刷新事件太久可能需要个动画和遮罩
          setTimeout(() => {
            this.load().finally(() => {
              requestAnimationFrame(() => {
                refresh.style.height = '0';
                container.style.top = '0';
                setTimeout(() => {
                  state.isAnima = false;
                }, 200);
              });
            });
          });
        } else {
          // 如果显示了refresh，就缩回去
          refresh.style.height = '0';
          container.style.top = '0';
          setTimeout(() => {
            state.isAnima = false;
          }, 200);
        }
        if (container.offsetLeft > 0 || container.offsetLeft < this.bgWidth - container.clientWidth) {
          // 如果碰到左边界或碰到右边界
          const bound = this.$refs.bound;
          bound.classList.add('transition');
          bound.style.opacity = `0`;
          bound.style.width = `0`;
          if (container.offsetLeft > 0) {
            bound.style.left = `0`;
          } else {
            bound.style.right = `0`;
          }
        }
        // 给一个水平方向的惯性速度
        const speed = (left / (Date.now() - state.startTime)) * 200;
        container.style.left = `${Math.max(
          Math.min(container.offsetLeft + speed, 0),
          this.bgWidth - container.clientWidth
        )}px`;
      });
    },
    drawMondrian() {
      const mondrian = new Mondrian(this.$refs.canvas, this.lineWidth, this.layer);
      mondrian.draw();
      return mondrian.rects;
    },
    load() {
      cancels.forEach((f) => f());
      cancels.clear();
      const container = this.$refs.container;
      container.querySelectorAll('.grid').forEach((v) => v.parentElement.removeChild(v));
      const rects = this.drawMondrian();
      return this.getResources()
        .then((infos) => Promise.all(infos.map((info) => this.createElement(info))))
        .then((resources) => {
          console.log(resources);
          for (const {
            rect: { x, y, w, h },
            draw
          } of matchRects(resources, rects, this.lineWidth)) {
            draw(x, y, w, h);
          }
        });
    },
    getResources() {
      // TODO 待优化：需要接口返回 width, height
      return http
        .get('/timeBox/random', {
          params: {
            startAt: null,
            timeAt: null,
            top: this.imgNum,
            keyword: ''
          }
        })
        .then(({ data }) => {
          if (data.status !== 200) {
            return Promise.reject(data.msg);
          }
          const infos = data.data.map((o) => {
            o.url = o.resource[randInt(0, o.resource.length)];
            return o;
          });
          console.log('infos', (this.infos = infos));
          return infos;
        });
    },
    async createElement(info) {
      switch (info.type) {
        case 'img':
          return this.createImg(info);
        case 'video':
          return this.createVideo(info);
      }
    },
    createImg(info) {
      return new Promise((resolve, reject) => {
        const { url, title } = info;
        const container = this.$refs.container;
        const el = document.createElement('img');
        el.classList.add('grid');
        el.title = title;
        el.crossOrigin = 'anonymous';
        el.alt = title;
        el.onclick = (ev) => this.handleClick(info, ev);
        el.onmousedown = (ev) => this.handleMouseDown(ev);
        el.onmousemove = (ev) => this.handleMouseMove(ev);
        el.onmouseup = (ev) => this.handleMouseUp(ev);
        el.addEventListener('touchstart', onTouch, { passive: true });
        el.addEventListener('touchmove', onTouch, { passive: true });
        el.addEventListener('touchend', onTouch, { passive: true });
        const cancel = checkImgWidthHeight(el, (width, height) => {
          resolve({
            width,
            height,
            draw: (x, y, w, h) => {
              el.style.left = `${x}px`;
              el.style.top = `${y}px`;
              el.style.width = `${w}px`;
              el.style.height = `${h}px`;
              container.appendChild(el);
            }
          });
        });
        cancels.add(() => {
          cancel();
          reject(new Error());
        });
        el.src = url;
      });
    },
    createVideo(info) {
      return new Promise((resolve, reject) => {
        const { url, title } = info;
        const container = this.$refs.container;
        const el = document.createElement('video');
        el.classList.add('grid');
        el.title = title;
        el.crossOrigin = 'anonymous';
        el.defaultMuted = true;
        el.autoplay = true;
        el.loop = true;
        el.muted = true;
        el.onclick = (ev) => this.handleClick(info, ev);
        el.onmousedown = (ev) => this.handleMouseDown(ev);
        el.onmousemove = (ev) => this.handleMouseMove(ev);
        el.onmouseup = (ev) => this.handleMouseUp(ev);
        el.addEventListener('touchstart', onTouch, { passive: true });
        el.addEventListener('touchmove', onTouch, { passive: true });
        el.addEventListener('touchend', onTouch, { passive: true });
        const cancel = checkVideoWidthHeight(el, (width, height) => {
          resolve({
            width,
            height,
            draw: (x, y, w, h) => {
              el.style.left = `${x}px`;
              el.style.top = `${y}px`;
              el.style.width = `${w}px`;
              el.style.height = `${h}px`;
              container.appendChild(el);
            }
          });
        });
        cancels.add(() => {
          cancel();
          reject(new Error());
        });
        el.src = url;
      });
    }
  }
};
</script>

<style>
.background {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  user-select: none;
}
.background-inner {
  height: 100%;
  width: 400%;
  position: absolute;
}
.background-inner.transition {
  transition: top 0.2s ease, left 0.2s ease-out;
}
.background .grid {
  position: absolute;
  display: block;
  object-fit: cover;
  cursor: pointer;
  background: #555;
  z-index: 1;
}
.background .refresh {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  white-space: nowrap;
  letter-spacing: 1rem;
  height: 0;
}
.background .refresh.top {
  top: 0;
}
.background .refresh.bottom {
  bottom: 0;
}
.background .refresh.transition {
  transition: height 0.2s ease;
}
.background .bound {
  position: absolute;
  top: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  white-space: nowrap;
  writing-mode: vertical-lr;
  letter-spacing: 2rem;
  width: 0;
}
.background .bound.left {
  background-image: linear-gradient(to right, #ccc, #fff 75%);
}
.background .bound.right {
  background-image: linear-gradient(to left, #ccc, #fff 75%);
}
.background .bound.transition {
  transition: opacity 0.2s ease-out, width 0.2s ease-out, left 0.2s ease-out, right 0.2s ease-out;
}
</style>
