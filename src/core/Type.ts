/*
 * @Author: CL
 * @Date: 2021-07-15 13:50:34
 * @LastEditTime: 2021-07-20 14:51:50
 * @Description: 类型，接口
 */

import { Game } from "./Game";
import { SquareGroup } from "./SquareGroup";

/**
 * 方块坐标点，你只能对整体进行修改，不能对单个的属性修改
 */
export interface Point {
  readonly x: number,
  readonly y: number
}


/**
 * 显示接口
 * 1. 这个显示接口必须要有两个方法，显示与移除
 */
export interface Display{
  show(): void,
  remove(): void
}


/**
 * 形状类型
 */
export type Shape = Point[];


/**
 * 枚举方向
 */
export enum Direction {
  left,
  right,
  down
}


/**
 * 枚举游戏状态
 */
export enum GameStatus{
  init,
  playing,
  pause,
  over
}

/**
 * 游戏展示的接口
 */
export interface GameViewer{
  /**
   * 展示下一个方块组
   * @param squareGroup 传入一个方块组 
   */
  showNext(squareGroup: SquareGroup): void

  /**
   * 切换方块组
   * @param squareGroup 传入一个方块组 
   */
  switchSquareGroup(squareGroup: SquareGroup): void

  /**
   * 游戏初始化
   * 传入一个游戏类
   */
  init(game: Game): void

  /**
   * 游戏暂停需要做些什么
   */
  onGamePause(): void

  /**
   * 游戏结束需要做些什么
   */
  onGameOver(): void

  /**
   * 游戏开始需要做些什么
   */
  onGameStart(): void

  /**
   * 展示分数
   */
  showSource(source: number): void
}
