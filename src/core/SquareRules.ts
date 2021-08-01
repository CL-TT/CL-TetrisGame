/*
 * @Author: CL
 * @Date: 2021-07-16 13:52:44
 * @LastEditTime: 2021-07-19 22:37:05
 * @Description: 方块移动的规则类
 */

import { gameH, gameW } from "./gameconfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { Direction, Point } from "./Type";


/**
 * 方块移动的规则类
 * 1. 把所有的方法都写成静态的，可以直接通过类名来调用
 */
export class SquareRules {
  /**
   * 我可以移动吗
   * 1. 传给我一个形状
   * 2. 传给我一个目标点
   * 3. 传一个小方块数组
   */
  static canIMove(shape: Point[], targetPoint: Point, existSquare: Square[]): boolean {
    //1. 我先移动到目标点
    const temp = shape.map(item => {
      return {
        x: item.x + targetPoint.x,
        y: item.y + targetPoint.y
      }
    })

    let result: boolean;

    //2. 在判断每一个目标点是否在边界内,全部在则可以移动，一个不在就不可以移动
    result = temp.every(item => {
      if (item.x < 0 || item.x > gameW - 1 || item.y < 0 || item.y > gameH - 1) {
        return false;
      }
      return true;
    })

    if (!result) {
      return false;
    }

    //然后判断移动过后是否重叠，就是判断目标点是否存在于小方块的数组中
    result = temp.some(item => existSquare.some(es => es.point.x === item.x && es.point.y === item.y));

    if (result) {
      //有方块重叠了, 不可以移动
      return false;
    }

    return true;
  }


  /**
   * 移动的方法(方法的重载), 不仅要边界判断还要重叠判断
   * 1. 传一个方块组
   * 2. 传一个目标点或者方向
   * 3. 传一个小方块数组
   */
  static move(squareGroup: SquareGroup, target: Point, existSquare: Square[]): boolean
  static move(squareGroup: SquareGroup, target: Direction, existSquare: Square[]): boolean
  static move(squareGroup: SquareGroup, target: Point | Direction, existSquare: Square[]): boolean {
    //先判断他传的参数是目标点还是方向, 如果是目标点
    if (isPoint(target)) {
      //在判断是否可以移动, 不可以直接返回
      if (!this.canIMove(squareGroup.shape, target, existSquare)) return false;

      //可以移动
      squareGroup.centerPoint = { x: target.x, y: target.y };
      return true;
    } else {
      let point: Point;
      //如果是方向，先判断是哪一个方向
      if (target === Direction.left) {
        //向左运动
        point = { x: squareGroup.centerPoint.x - 1, y: squareGroup.centerPoint.y }
      } else if (target == Direction.right) {
        //向右运动
        point = { x: squareGroup.centerPoint.x + 1, y: squareGroup.centerPoint.y }
      } else {
        //向下运动
        point = { x: squareGroup.centerPoint.x, y: squareGroup.centerPoint.y + 1 }
      }

      return this.move(squareGroup, point, existSquare);
    }
  }


  /**
   * 一直移动
   * 1. 传一个方块组
   * 2. 传一个方向
   */
  static moving(squareGroup: SquareGroup, dir: Direction, existSquare: Square[]): void {
    while (this.move(squareGroup, dir, existSquare)) { };
  }

  /**
   * 方块组旋转的方法
   * 1. 传入一个方块组
   */
  static rotate(squareGroup: SquareGroup, existSquare: Square[]) {
    const newShape = squareGroup.rotateNewShape();
    //判断能不能转
    if (!this.canIMove(newShape, squareGroup.centerPoint, existSquare)) return;
    //如果可以移动
    squareGroup.squareRotate()
  }

  /**
   * 处理小方块的消除
   * 1. 传入一个已经存在的小方块的数组
   * 2. 返回消了几行
   */
  static handleClear(existSquare: Square[]): number {
    let count: number = 0;

    //得到一个方块y坐标的数组
    const yList = existSquare.map(square => square.point.y);

    const minY = Math.min(...yList);  //获取最小的y坐标
    const maxY = Math.max(...yList);  //获取最大的y坐标

    //判断每一行是否可以消除
    for (let y = minY; y <= maxY; y++){
      if (this.clearOneLine(existSquare, y)) {
        count++;
      }
    }

    return count;
  }

  /**
   * 消除一行
   * 1. 传一个存在的小方块的数组
   * 2. 传一个y坐标
   * 3. 先要判断可不可以消除
   * 4. 怎么消除(1. 从页面上移除dom元素， 从存在的数组中移除， 比这个y坐标小的都要加一)
   */
  private static clearOneLine(existSquare: Square[], y: number): boolean {
    //坐标都等于y的小方块
    const squares = existSquare.filter(square => square.point.y === y);

    if (squares.length === gameW) {
      //可以消除
      squares.forEach(square => {
        //从页面上移除dom元素
        if (square.shower) {
          square.shower.remove();
        }

        //从存在的数组中移除
        const index = existSquare.indexOf(square);
        existSquare.splice(index, 1);
      })

      //比这个y坐标小的都要加一
      existSquare.filter(square => square.point.y < y).forEach(square => {
        square.point = {
          x: square.point.x,
          y: square.point.y + 1
        }
      })

      return true
    }

    return false;
  }
}

/**
 * 类型保护的判断
 * @param obj 
 * @returns 
 */
function isPoint(obj: any): obj is Point{
  if (typeof obj.x === 'undefined') {
    return false;
  }
  return true;
} 