/*
 * @Author: CL
 * @Date: 2021-07-19 13:49:37
 * @LastEditTime: 2021-07-20 14:52:10
 * @Description: 游戏展示类
 */

import { SquareGroup } from "../core/SquareGroup";
import { GameStatus, GameViewer } from "../core/Type";
import { DisplaySquareForPage } from "./DisplaySquare";
import $ from 'jquery';
import { Game } from "../core/Game";
import { gameH, gameW, nextH, nextW } from "../core/gameconfig";
import squareSize from './pageconfig';

export class GameView implements GameViewer{
  /**
   * 展示下一个方块组
   * @param squareGroup 
   */
  showNext(squareGroup: SquareGroup): void {
    squareGroup.squareList.forEach(square => {
      square.shower = new DisplaySquareForPage(square, $('.next-square'));
      square.shower.show();
    })
  }

  /**
   * 切换方块组
   * 1. 先把之前的方块组移除掉
   * 2. 在创建新的方块组
   * @param squareGroup 
   */
  switchSquareGroup(squareGroup: SquareGroup): void {
    squareGroup.squareList.forEach(square => {
      square.shower!.remove();
      square.shower = new DisplaySquareForPage(square, $('.game'));
      square.shower.show();
    })
  }

  /**
   * 游戏的初始化
   */
  init(game: Game) {
    //初始化游戏界面
    this.initView();

    //初始化键盘监听
    this.initEvent(game);
  }

  /**
   * 游戏暂停需要做什么
   * 1. 需要展示一个模态框展示游戏暂停
   */
  onGamePause() {
    $('.msg-wrap').css({
      opacity: 1
    });

    $('.msg-info').text('游戏暂停');
  }

  /**
   * 游戏结束需要做什么
   * 1. 需要展示一个模态框展示游戏结束
   */
  onGameOver() {
    $('.msg-wrap').css({
      opacity: 1
    });

    $('.msg-info').text('游戏结束');
  }

  /**
   * 游戏开始要做什么
   */
  onGameStart() {
    $('.msg-wrap').css({
      opacity: 0
    })
  }

  /**
   * 展示分数
   * 1. 传给我一个分数
   */
  showSource(source: number) {
    $('.span-source').text(source);
  }

  /**
   * 初始化游戏界面
   */
  private initView() {
    $('#app').css({
      width: (gameW + nextW) * squareSize.width,
      height: (gameH) * squareSize.height
    })

    $('.game').css({
      width: gameW * squareSize.width,
      height: gameH * squareSize.height
    })

    $('.next-square').css({
      width: nextW * squareSize.width,
      height: nextH * squareSize.height
    })
  }

  /**
   * 初始化键盘事件
   */
  private initEvent(game: Game) {
    $(document).on('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        //向下操作
        game.turnDown();
      } else if (e.key === 'ArrowLeft') {
        //向左移动
        game.turnLeft();
      } else if (e.key === 'ArrowRight') {
        //向右移动
        game.turnRight();
      } else if (e.key === 'ArrowUp') {
        //旋转操作
        game.turnRotate();
      } else if (e.key === ' ') {        
        if (game.gameStatus === GameStatus.playing) {
          //如果游戏正在进行中，那么就让其暂停
          game.pause();
        } else {
          //其他情况，就启动游戏
          game.start();
        }
      }
    })
  }
}
