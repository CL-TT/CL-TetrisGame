/*
 * @Author: CL
 * @Date: 2021-07-16 13:56:48
 * @LastEditTime: 2021-07-20 14:57:40
 * @Description: 游戏的一些配置
 */

//游戏的界面是一个15x20的长方形界面

//游戏面板
export const gameW: number = 15;
export const gameH: number = 20;

//下一块方块组的面板
export const nextW: number = 6;
export const nextH: number = 6;

//游戏等级
export const level = [
  { level: 1, source: 0, duration: 1200 },
  { level: 2, source: 100, duration: 1000 },
  { level: 3, source: 300, duration: 800 },
  { level: 4, source: 500, duration: 600 },
  { level: 5, source: 1000, duration: 400 },
  { level: 6, source: 2000, duration: 200 },
]
