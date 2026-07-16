// 复用 HappyMask 的扫描线种子填充算法
// 适配为 Web 环境

class Point {
  constructor(public x: number = 0, public y: number = 0) {}
}

class Stack<T> {
  private items: T[] = [];

  push(element: T) {
    this.items.push(element);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number = 255
  ) {}

  isSame(other: Color): boolean {
    return (
      Math.abs(this.r - other.r) < 20 &&
      Math.abs(this.g - other.g) < 20 &&
      Math.abs(this.b - other.b) < 50
    );
  }
}

/**
 * 扫描线种子填充算法
 * @param pixels - ImageData.data
 * @param w - 宽度
 * @param h - 高度
 * @param oldColor - 点击点的原始颜色
 * @param newColor - 填充颜色
 * @param startX - 点击点X
 * @param startY - 点击点Y
 */
export function fillColor(
  pixels: Uint8ClampedArray,
  w: number,
  h: number,
  oldColor: Color,
  newColor: Color,
  startX: number,
  startY: number
) {
  const stack = new Stack<Point>();
  stack.push(new Point(startX, startY));

  function needFillPixel(index: number): boolean {
    return (
      Math.abs(pixels[index] - oldColor.r) < 20 &&
      Math.abs(pixels[index + 1] - oldColor.g) < 20 &&
      Math.abs(pixels[index + 2] - oldColor.b) < 50
    );
  }

  function fillLineLeft(x: number, y: number): number {
    let count = 0;
    while (x >= 0) {
      const index = (y * w + x) * 4;
      if (needFillPixel(index)) {
        pixels[index] = newColor.r;
        pixels[index + 1] = newColor.g;
        pixels[index + 2] = newColor.b;
        pixels[index + 3] = newColor.a;
        count++;
        x--;
      } else {
        break;
      }
    }
    return count;
  }

  function fillLineRight(x: number, y: number): number {
    let count = 0;
    while (x < w) {
      const index = (y * w + x) * 4;
      if (needFillPixel(index)) {
        pixels[index] = newColor.r;
        pixels[index + 1] = newColor.g;
        pixels[index + 2] = newColor.b;
        pixels[index + 3] = newColor.a;
        count++;
        x++;
      } else {
        break;
      }
    }
    return count;
  }

  function findSeedInNewLine(y: number, left: number, right: number) {
    const begin = y * w + left;
    const end = y * w + right;
    let hasSeed = false;

    for (let i = end; i >= begin; i--) {
      const index = i * 4;
      if (needFillPixel(index)) {
        if (!hasSeed) {
          const rx = i % w;
          stack.push(new Point(rx, y));
          hasSeed = true;
        }
      } else {
        hasSeed = false;
      }
    }
  }

  while (!stack.isEmpty()) {
    const seed = stack.pop()!;
    const count1 = fillLineLeft(seed.x, seed.y);
    const left = seed.x - count1 + 1;
    const count2 = fillLineRight(seed.x + 1, seed.y);
    const right = seed.x + count2;

    if (seed.y - 1 >= 0) {
      findSeedInNewLine(seed.y - 1, left, right);
    }
    if (seed.y + 1 < h) {
      findSeedInNewLine(seed.y + 1, left, right);
    }
  }
}

export function hexToRgb(hex: string): Color {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return new Color(
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    );
  }
  return new Color(0, 0, 0);
}

export { Color };
