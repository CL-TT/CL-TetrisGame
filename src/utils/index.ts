/*
 * @Author: CL
 * @Date: 2021-07-16 10:35:00
 * @LastEditTime: 2021-07-16 10:38:52
 * @Description: 工具方法
 */

/**
 * 获取一个min-max之间的随机数，但是取不到max
 * @param min 
 * @param max 
 * @returns 
 */
export function getRandomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 获取一个随机的颜色
 * @returns 
 */
export function getColor(): string {
  return `rgb(${getRandomNum(0, 255)}, ${getRandomNum(0, 255)}, ${getRandomNum(0, 255)})`;
}
