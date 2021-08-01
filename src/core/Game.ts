/*
 * @Author: CL
 * @Date: 2021-07-19 08:58:58
 * @LastEditTime: 2021-07-20 16:23:48
 * @Description: 游戏类
 * 1. 控制游戏的开始和结束
 * 2. 控制方块组的移动
 * 3. 控制触底之后该做什么{
 *   1. 切换新的方块
 *   2. 保存已经存在的小方块
 *   3. 游戏是否结束
 *   4. 消除满格的方块
 * }
 */

import { getColor } from "../utils";
import { gameW, level, nextW } from "./gameconfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { getRandomShape } from "./SquareKinds";
import { SquareRules } from "./SquareRules";
import { Direction, GameStatus, GameViewer } from "./Type";

/**
 * 游戏类
 */
export class Game{
  //一开始的游戏状态是初始化。未开始
  private _gameStatus: GameStatus = GameStatus.init;

  //当前用户操作的方块组
  private curSquareGroup?: SquareGroup;

  //下一个要操作的方块组
  private nextSquareGroup: SquareGroup;
  
  //控制方块自由下落的定时器
  private timer?: number;

  //下落的时间
  private duration: number;

  //已经存在的小方块
  private existSquare: Square[] = [];

  //游戏积分
  private _source: number = 0;

  public constructor(private viewer: GameViewer) {
    this.viewer.init(this);

    this.duration = level[0].duration;

    this.nextSquareGroup = getRandomShape({ x: 0, y: 0 }, getColor());

    this.createNext();
  }

  //访问器部分
  public get gameStatus() {
    return this._gameStatus;
  }

  /**
   * 分数发生变化的时候，游戏的难度也随之发生变化
   */
  public set source(source: number) {
    if (source < 0) return;
    this._source = source;
    this.viewer.showSource(source);

    this.setGameLevel(source);
  }

  public get source() {
    return this._source;
  }

  /**
   * 设置游戏等级
   * 1. 找到符合分数的游戏等级
   * 2. 重新设置duration
   * 3. 清除定时器
   * 4. 重新调用自由下落的方法
   */
  private setGameLevel(source: number) {
    const sourceArr = level.map(item => item.source);
    let lev: number = 0;

    sourceArr.forEach((s, i) => {
      if (source < s) {
        lev = i - 1;
        return;
      }
    })

    this.duration = level[lev].duration;
    clearInterval(this.timer);
    this.timer = undefined;
    this.autoDown();
  }

  /**
   * 游戏重新初始化
   * 1. 存在的方块数组要清空
   * 2. 当前的方块组要为undefined
   * 3. 页面上的元素要移除
   */
  private init() {
    this.existSquare.forEach(square => {
      if (square.shower) {
        square.shower.remove();
      }
    })
    this.existSquare = [];
    this.curSquareGroup = undefined;

    this.createNext();
  }

  /**
   * 创建下一个方块组
   */
  private createNext() {
    this.nextSquareGroup = getRandomShape({ x: 0, y: 0 }, getColor());

    //先要重置中心点的坐标防止图形溢出
    this.resetCenterPoint(nextW, this.nextSquareGroup);
    
    //我知道什么时候显示，却不知道怎么显示，所以把怎么显示交给外面来实现
    this.viewer.showNext(this.nextSquareGroup);
  }

  /**
   * 游戏开始的方法
   */
  public start() {
    //如果游戏就是开始状态，什么都不做
    if (this._gameStatus === GameStatus.playing) return;

    if (this._gameStatus === GameStatus.over) {
      //如果是结束状态，就要重新开始
      this.init();
    }

    this._gameStatus = GameStatus.playing;

    this.viewer.onGameStart();

    if (!this.curSquareGroup) {
      //如果当前方块没有值,那么就切换方块
      this.switchSquare();
    }

    //切换完成之后就要控制当前方块的自由下落
    this.autoDown();
  }

  /**
   * 游戏暂停
   */
  public pause() {
    //如果游戏就是暂停状态什么都不做
    if (this._gameStatus === GameStatus.pause) return;
    this._gameStatus = GameStatus.pause;
    clearInterval(this.timer);
    this.timer = undefined;

    this.viewer.onGamePause();
  }

  /**
   * 控制当前方块的自由下落
   * 1. 自由下落会触底
   */
  private autoDown() {
    //如果当前的方块没有值或者当前的游戏状态不是在游戏中或者定时器有值，什么都不做
    if (this._gameStatus !== GameStatus.playing || this.timer) return;

    this.timer = setInterval(() => {

      if (this.curSquareGroup) {
        
        if (!SquareRules.move(this.curSquareGroup as SquareGroup, Direction.down, this.existSquare)) {
          //不可以往下运动,已经触底

          //触底之后要做的事情
          this.hidBottom();
        }
      }
    }, this.duration)
  }

  /**
   * 切换方块组，把下一个方块赋值给当前方块
   */
  private switchSquare() {
    this.curSquareGroup = this.nextSquareGroup;

    this.curSquareGroup.squareList.forEach(square => {
      if (square.shower) {
        square.shower.remove();
      }
    })

    this.resetCenterPoint(gameW, this.curSquareGroup);

    //要判断游戏有没有结束
    if (!SquareRules.canIMove(this.curSquareGroup.shape, this.curSquareGroup.centerPoint, this.existSquare)) {  
      //如果不能移动了，代表游戏结束，游戏结束要把游戏状态设为游戏结束, 清除定时器
      this._gameStatus = GameStatus.over;
      clearInterval(this.timer);
      this.timer = undefined;

      this.viewer.onGameOver();

      return;
    }

    this.createNext();

    //切换方块组之后，要把当前方块展示到页面上，
    this.viewer.switchSquareGroup(this.curSquareGroup);

    
  }

  /**
   * 重置中心点坐标
   * 1. 传入一个容器的逻辑宽度
   * 2. 传入一个方块组
   */
  public resetCenterPoint(width: number, squareGroup: SquareGroup) {
    const x = Math.ceil(width / 2) - 1;
    const y = 0;

    squareGroup.centerPoint = { x, y }; 

    while (squareGroup.squareList.some(square => {
      return square.point.y < 0;
    })) {
      //中心点就往下移动一格
      squareGroup.centerPoint = {
        x: squareGroup.centerPoint.x,
        y: squareGroup.centerPoint.y + 1
      }
    }
  }

  /**
   * 控制当前方块组向左
   */
  public turnLeft() {
    //如果当前方块有值并且正在游戏中
    if (this.curSquareGroup && this._gameStatus === GameStatus.playing) {
      SquareRules.move(this.curSquareGroup, Direction.left, this.existSquare);
    }
  }

  /**
   * 控制当前方块向右
   */
  public turnRight() {
    //如果当前方块有值并且正在游戏中
    if (this.curSquareGroup && this._gameStatus === GameStatus.playing) {
      SquareRules.move(this.curSquareGroup, Direction.right, this.existSquare);
    }
  }

  /**
   * 控制当前方块向下
   * 1. 玩家控制同样会触底
   */
  public turnDown() {
    //如果当前方块有值并且正在游戏中
    if (this.curSquareGroup && this._gameStatus === GameStatus.playing) {
      SquareRules.moving(this.curSquareGroup, Direction.down, this.existSquare);

      this.hidBottom();
    }
  }

  /**
   * 控制当前方块旋转
   */
  public turnRotate() {
    //如果当前方块有值并且正在游戏中
    if (this.curSquareGroup && this._gameStatus === GameStatus.playing) {
      SquareRules.rotate(this.curSquareGroup, this.existSquare);
    }
  }

  /**
   * 触底之后需要做什么
   * 1. 保存已经存在的小方块
   * 2. 处理消除
   * 3. 计算积分
   * 4. 切换方块组(切换的时候要判断游戏有没有结束)
   */
  private hidBottom() {
    this.existSquare = this.existSquare.concat(this.curSquareGroup!.squareList);

    const count = SquareRules.handleClear(this.existSquare);

    this.addSource(count);

    this.switchSquare();
  }

  /**
   * 计算积分
   * @param count 传入消除的行数 
   */
  private addSource(count: number) {
    if (count === 0) return;
    if (count === 1) {
      this.source += 5;
    } else if (count === 2) {
      this.source += 15;
    } else if (count === 3) {
      this.source += 30;
    } else if (count > 4) {
      this.source += 50;
    }
  }
}
