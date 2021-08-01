/*
 * @Author: CL
 * @Date: 2021-07-15 14:52:02
 * @LastEditTime: 2021-07-19 13:54:46
 * @Description: 显示方块类
 * 
 * 1. 为了以后更好的扩展，你这个显示到底显示在哪个地方，可以是控制台，页面，等等
 * 2. 只能你这个类去实现这个显示接口，具体怎么去显示，你类中自己完成
 */

import { Display } from '../core/Type';

import { Square } from '../core/Square';

import $ from 'jquery';

import pageConfig from './pageconfig';

/**
 * 控制台显示方块的类
 * 1. 必须传一个方块
 */
export class DisplaySquareForConsole implements Display {
  public constructor(private _square: Square) {
    this._square = _square;
  }

  show(): void {
    console.log('显示坐标和属性', this._square.point, this._square.color);
  };
  
  remove(): void {

  };
}

/**
 * 页面显示方块类
 * 1. 传一个方块
 */
export class DisplaySquareForPage implements Display{
  private dom?: JQuery<HTMLElement>    //dom元素

  /**
   * 需要传两个属性
   * @param square 一个是哪一个方块
   * @param container 一个是装方块的容器
   */
  public constructor(private square: Square, private container: JQuery<HTMLElement>) {}

  /**
   * 1. 先看有没有这个dom元素，没有就创建一个
   * 2. 如果已经有这个dom元素, 一定是坐标改变的时候
   */
  show(): void{
    if (!this.dom) {
      this.dom = $('<div></div>').css({
        width: pageConfig.width,
        height: pageConfig.height,
        backgroundColor: this.square.color,
        position: 'absolute',
        left: this.square.point.x * pageConfig.width + 'px',
        top: this.square.point.y * pageConfig.height + 'px'
      })

      this.container.append(this.dom);
    } else {
      this.dom.css({
        left: this.square.point.x * pageConfig.width + 'px',
        top: this.square.point.y * pageConfig.height + 'px'
      })
    }
  }

  remove(): void{
    this.dom?.remove();
  }
}
