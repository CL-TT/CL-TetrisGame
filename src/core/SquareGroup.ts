/*
 * @Author: CL
 * @Date: 2021-07-15 22:08:16
 * @LastEditTime: 2021-07-18 23:05:39
 * @Description: 方块组类
 * 
 * 1. 一组一组的方块
 * 2. 先确定一个中心点，然后根据中心点计算出其他方块的相对坐标， 注意这里的坐标都不是实际的坐标
 * 3. 想要旋转，肯定是让方块组去旋转，不同的形状又有不同的旋转方式，所以这里不同的方式让每一个子类自己去实现
 */

import { Shape, Point } from './Type';

import { Square } from './Square';

/**
 * 方块组类
 * 1. 传一个这个方块组的形状， 形状是由坐标点的数组构成
 * 2. 传一个中心点
 * 3. 传一个颜色
 * 4. 想要改变方块组的位置，改变中心点就可以了
 * 5. 方块组可以旋转，旋转改变的就是形状，并且有些形状可以改变有些不可以改变
 */
export class SquareGroup {
  //定义一个方块类型的数组, 只读属性
  private readonly _squareList: Square[] = [];

  //是否是顺时针
  protected isClock: boolean = true; 

  public constructor(
    private _shape: Shape,
    private _centerPoint: Point,
    private color: string
  ) {
    const arr: Square[] = [];
    //形状里有几个坐标，就有几个方块
    this._shape.forEach(item => {
      //创建一个方块
      const sq = new Square(
        { x: item.x + this._centerPoint.x, y: item.y + this._centerPoint.y },
        this.color
      );

      arr.push(sq);
    });

    this._squareList = arr;
  }

  /**
   * 设置小方块新的坐标位置
   * 根据中心点坐标和形状
   */
  private setNewPoint() {
    this._shape.forEach((item, i) => {
      this._squareList[i].point = { x: item.x + this._centerPoint.x, y: item.y + this._centerPoint.y }
    })
  }

  /**
   * 旋转得到一个新的形状
   * 顺时针 (x, y) => (-y, x)
   * 逆时针 (x, y) => (y, -x)
   */
  public rotateNewShape(): Shape {
    if (this.isClock) {
      //如果是顺时针
      return this._shape.map(item => {
        return {
          x: -item.y,
          y: item.x
        }
      })
    } else {
      //如果是逆时针
      return this._shape.map(item => {
        return {
          x: item.y,
          y: -item.x
        }
      })
    }
  }

  /**
   * 方块组的形状改变，这里有很多情况，所以可以子类自己去实现具体的旋转
   */
  public squareRotate() {
    //得到一个新的形状
    const newShape = this.rotateNewShape();
    
    this._shape = newShape;

    //然后改变每一个具体的小方块的坐标
    this.setNewPoint();
  }

  /**
   * 改变中心点坐标，就要重新计算每一个方块的位置
   */
  public set centerPoint(point: Point) {
    this._centerPoint = point;

    this._shape.forEach((item, i) => {
      this._squareList[i].point = { x: item.x + this._centerPoint.x, y: item.y + this._centerPoint.y }
    })
  }

  public get centerPoint() {
    return this._centerPoint;
  }

  public get squareList() {
    return this._squareList;
  }

  public get shape() {
    return this._shape;
  }
}
