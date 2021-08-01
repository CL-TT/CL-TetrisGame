/*
 * @Author: CL
 * @Date: 2021-07-15 13:46:17
 * @LastEditTime: 2021-07-15 15:34:26
 * @Description: 方块类
 * 
 * 1. 方块的坐标
 * 2. 方块的颜色
 * 3. 方块如何去展示
 * 
 * 方块的坐标可能其他类也会用到，所以把坐标的约束做成接口
 * 
 * 所有的属性都变成私有属性， 想设值和访问的话全部做成访问器模式
 */

import { Point, Display } from './Type';

/**
 * 方块类
 * 1. 方块的坐标
 * 2. 方块的颜色
 */
export class Square{
  //显示者
  private _shower?: Display

  public constructor(private _point: Point, private _color: string) {
    this._point = _point;
    this._color = _color;
  }

  /**
   * 一改变坐标就要重新显示
   */
  public set point(point: Point) {
    this._point = point;

    if (this._shower) {
      //如果显示者存在的话，就调用显示方法
      this._shower.show();
    }
  }

  public get point() {
    return this._point;
  }

  public set shower(shower) {
    this._shower = shower;
  }

  public get shower() {
    return this._shower;
  }

  public set color(val: string) {
    this._color = val;
  }

  public get color() {
    return this._color
  }
}