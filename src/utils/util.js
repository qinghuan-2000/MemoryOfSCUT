export function randInt(a, b) {
  return Math.floor(Math.random() * (b - a) + a);
}

export function onMouse(evt) {
  evt.preventDefault();
  let type = null;
  switch (evt.type) {
    case 'mousedown':
      type = 'touchstart';
      break;
    case 'mousemove':
      type = 'touchmove';
      break;
    case 'mouseup':
      type = 'touchend';
      break;
  }
  const touch = new Touch({
    identifier: 0,
    target: evt.target,
    clientX: evt.clientX,
    clientY: evt.clientY,
    screenX: evt.screenX,
    screenY: evt.screenY,
    pageX: evt.pageX,
    pageY: evt.pageY
  });
  const newEvt = new TouchEvent(type, {
    bubbles: true,
    cancelable: true,
    view: evt.target.ownerDocument.defaultView,
    detail: 0,
    ctrlKey: evt.ctrlKey,
    shiftKey: evt.shiftKey,
    altKey: evt.altKey,
    metaKey: evt.metaKey,
    touches: [touch],
    targetTouches: [touch],
    changedTouches: [touch]
  });
  evt.target.dispatchEvent(newEvt);
}
let touchingIdentifier = null;
export function onTouch(evt) {
  // evt.preventDefault();
  // if (evt.touches.length > 1) return;
  // if (evt.type === 'touchend' && evt.touches.length > 0) return;
  const touch = touchingIdentifier !== null ? [...evt.changedTouches].find(({ identifier }) => identifier === touchingIdentifier) : evt.changedTouches[0];
  if (!touch) return;
  let type = null;
  switch (evt.type) {
    case 'touchstart':
      type = 'mousedown';
      touchingIdentifier = touch.identifier;
      break;
    case 'touchmove':
      type = 'mousemove';
      break;
    case 'touchend':
      type = 'mouseup';
      touchingIdentifier = null;
      break;
  }
  // const {clientX, clientY, screenX, screenY, pageX, pageY} = evt.changedTouches[0];
  const { clientX, clientY, screenX, screenY, pageX, pageY } = touch;
  const newEvt = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: evt.target.ownerDocument.defaultView,
    detail: 0,
    ctrlKey: evt.ctrlKey,
    shiftKey: evt.shiftKey,
    altKey: evt.altKey,
    metaKey: evt.metaKey,
    clientX,
    clientY,
    screenX,
    screenY,
    pageX,
    pageY
  });
  evt.target.dispatchEvent(newEvt);
}

export function drawHtmlToCanvas(x, y, w, h, html, ctx) {
  const data = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${html}</div></foreignObject></svg>`;
  const img = new Image();
  const svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svg);
  img.onload = function () {
    ctx.drawImage(img, x, y);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

export function matchRects(imgs, rects, lineWidth = 0) {
  const half = lineWidth / 2;
  // 先按图片大小从大到小排序
  imgs.sort((a, b) => b.width * b.height - a.width * a.height);
  for (const img of imgs) {
    const { width, height } = img;
    const frac = width / height;
    rects = rects
      .filter((r) => !r.img) // 去掉已经选好的
      .sort((a, b) => {
        // 计算两者宽高比与图片宽高比的差的绝对值，越小的越好
        const t = Math.abs(a.w / a.h - frac) - Math.abs(b.w / b.h - frac);
        // t是两个绝对值的差，小于0说明a好，否则说明b好
        if (Math.abs(t) < 0.2 && Math.random() < 0.8) {
          // 如果t较小，则有可能选择宽度高度乘积更大的一个
          return a.width * a.height - b.width * b.height;
        }
        return t;
      });
    if (!rects.length) break;
    rects[0].img = img;
    const { x, y, w, h } = rects[0];
    img.rect = { x: Math.floor(x + half - 1), y: Math.floor(y + half - 1), w: Math.ceil(w - lineWidth + 1), h: Math.ceil(h - lineWidth + 1) };
  }
  const ret = imgs.filter((v) => v.rect);
  console.log(ret);
  return ret;
}

export function checkImgWidthHeight(img, cb) {
  let interval = setInterval(() => {
    if (img.width > 0 || img.height > 0) {
      interval && clearInterval(interval);
      interval = null;
      cb(img.width, img.height);
    }
  }, 20);
  return () => {
    interval && clearInterval(interval);
    interval = null;
  };
}

export function checkVideoWidthHeight(video, cb) {
  let interval = setInterval(() => {
    if (video.videoWidth > 0 || video.videoWeight > 0) {
      interval && clearInterval(interval);
      interval = null;
      cb(video.videoWidth, video.videoWeight);
    }
  }, 20);
  return () => {
    interval && clearInterval(interval);
    interval = null;
  };
}
