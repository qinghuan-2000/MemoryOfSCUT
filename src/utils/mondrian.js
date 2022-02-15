// https://maxhalford.github.io/blog/mondrian/
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Rectangle {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  get x() {
    return this.min.x;
  }

  get y() {
    return this.min.y;
  }

  get w() {
    return this.max.x - this.min.x;
  }

  get h() {
    return this.max.y - this.min.y;
  }

  draw(ctx) {
    ctx.moveTo(this.min.x, this.min.y);
    ctx.lineTo(this.max.x, this.min.y);
    ctx.lineTo(this.max.x, this.max.y);
    ctx.lineTo(this.min.x, this.max.y);
    ctx.lineTo(this.min.x, this.min.y);
  }

  split(xPad, yPad, depth, limit, ctx, rects) {
    // ctx.clearRect(this.min.x, this.min.y, this.max.x, this.max.y);
    ctx.fillStyle = randColor();
    ctx.fillRect(this.min.x, this.min.y, this.max.x, this.max.y);
    this.draw(ctx);
    if (depth === limit) {
      // Check the level of recursion
      if (rects) {
        rects.push(this);
      }
      return;
    }
    // Check the rectangle is enough large and tall
    if (this.w < 2 * xPad || this.h < 2 * yPad) {
      return;
    }

    // If the rectangle is wider than it's height do a left/right split
    let r1, r2;
    if (this.w > this.h) {
      const x = randInt(this.min.x + xPad, this.max.x - xPad);
      r1 = new Rectangle(this.min, new Point(x, this.max.y));
      r2 = new Rectangle(new Point(x, this.min.y), this.max);
      // Else do a top/bottom split
    } else {
      const y = randInt(this.min.y + yPad, this.max.y - yPad);
      r1 = new Rectangle(this.min, new Point(this.max.x, y));
      r2 = new Rectangle(new Point(this.min.x, y), this.max);
    }

    // Split the sub-rectangles
    r1.split(xPad, yPad, depth + 1, limit, ctx, rects);
    r2.split(xPad, yPad, depth + 1, limit, ctx, rects);
  }
}
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a) + a);
}
const colors = ['white', 'white', 'black', 'red', 'blue', 'yellow'];
function randColor() {
  return colors[randInt(0, colors.length)];
}
export default class Mondrian {
  constructor(canvas, lineWidth = 8, limit = 10) {
    this.canvas = canvas;
    this.lineWidth = lineWidth;
    this.limit = limit;
  }

  draw(xPad, yPad) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    xPad = xPad || Math.floor(width * 0.07);
    yPad = yPad || Math.floor(height * 0.07);
    xPad = yPad = Math.min(xPad, yPad);
    const ctx = this.canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = this.lineWidth;
    const rootRect = new Rectangle(new Point(0, 0), new Point(width, height));
    this.rects = [];
    rootRect.split(xPad, yPad, 0, this.limit, ctx, this.rects);
    ctx.stroke();
  }
}
