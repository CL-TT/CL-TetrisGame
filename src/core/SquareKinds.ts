/*
 * @Author: CL
 * @Date: 2021-07-16 10:04:07
 * @LastEditTime: 2021-07-19 20:08:39
 * @Description: 方块的形状
 * 
 * 1. 让每一个方块形状去继承方块组合，
 */

import { getRandomNum } from "../utils";
import { SquareGroup } from "./SquareGroup";
import { Point, Shape } from "./Type";

// L形组合
class LShape extends SquareGroup {
  public constructor(centerPoint: Point, color: string) {
    super(
      [{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }],
      centerPoint,
      color
    );
  }
}

//土字形组合
class TShape extends SquareGroup {
  public constructor(centerPoint: Point, color: string) {
    super(
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }],
      centerPoint,
      color
    )
  }
}

//i字形组合
class IShape extends SquareGroup{
  public constructor(centerPoint: Point, color: string) {
    super(
      [{ x: 0, y: -1 },{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 }],
      centerPoint,
      color
    )
  }

  public squareRotate() {
    super.squareRotate();

    this.isClock = !this.isClock;
  }
}

//一字型组合
class OneShape extends SquareGroup{
  public constructor(centerPoint: Point, color: string) {
    super(
      [{ x: -1, y: 0 },{ x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 }],
      centerPoint,
      color
    )
  }

  public squareRotate() {
    super.squareRotate();

    this.isClock = !this.isClock;
  }
}

//z字形组合
class ZShape extends SquareGroup{
  public constructor(centerPoint: Point, color: string) {
    super(
      [{ x: -1, y: -1 },{ x: 0, y: -1 },{ x: 0, y: 0 },{ x: 1, y: 0 }],
      centerPoint,
      color
    )
  }

  public squareRotate() {
    super.squareRotate();

    this.isClock = !this.isClock;
  }
}

//s字形组合
class SShape extends SquareGroup{
  public constructor(centerPoint: Point, color: string) {
    super(
      [{ x: -1, y: 0 },{ x: 0, y: 0 },{ x: 0, y: -1 },{ x: 1, y: -1 }],
      centerPoint,
      color
    )
  }

  public squareRotate() {
    super.squareRotate();

    this.isClock = !this.isClock;
  }
}

//正方形组合, 不旋转的，重写旋转后得到形状的方法
class RectShape extends SquareGroup{
  public constructor(centerPoint: Point, color: string) {
    super(
      [{ x: 0, y: 0 },{ x: 1, y: 0 },{ x: 0, y: 1 },{ x: 1, y: 1 }],
      centerPoint,
      color
    )
  }

  public rotateNewShape(): Shape {
    return this.shape;
  }

  public squareRotate() {
    super.squareRotate();
  }
}





const arr = [
  TShape,
  LShape,
  IShape,
  OneShape,
  SShape,
  ZShape,
  RectShape
]

/**
 * 获取一个随机的类型
 */
export function getRandomShape(centerPoint: Point, color: string): SquareGroup {
  const len = arr.length;

  const index = getRandomNum(0, len);

  const shape = arr[index];

  return new shape(centerPoint, color);
}
