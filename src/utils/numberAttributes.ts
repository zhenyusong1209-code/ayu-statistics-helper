// 号码属性定义

// 生肖映射（1-49）
export const ZODIAC_MAP: Record<number, string> = {
  1: '马', 2: '蛇', 3: '龙', 4: '兔', 5: '虎', 6: '牛', 7: '鼠', 8: '猪', 9: '狗', 10: '鸡',
  11: '猴', 12: '羊', 13: '马', 14: '蛇', 15: '龙', 16: '兔', 17: '虎', 18: '牛', 19: '鼠', 20: '猪',
  21: '狗', 22: '鸡', 23: '猴', 24: '羊', 25: '马', 26: '蛇', 27: '龙', 28: '兔', 29: '虎', 30: '牛',
  31: '鼠', 32: '猪', 33: '狗', 34: '鸡', 35: '猴', 36: '羊', 37: '马', 38: '蛇', 39: '龙', 40: '兔',
  41: '虎', 42: '牛', 43: '鼠', 44: '猪', 45: '狗', 46: '鸡', 47: '猴', 48: '羊', 49: '马'
}

// 波色映射
export const COLOR_MAP: Record<number, string> = {
  1: '红', 2: '红', 3: '红', 4: '红', 5: '红', 6: '红', 7: '红',
  8: '红', 9: '红', 10: '红', 11: '红', 12: '红', 13: '红', 14: '红', 15: '红',
  16: '红', 17: '红', 18: '红', 19: '红', 20: '红', 21: '红', 22: '红', 23: '红', 24: '红',
  25: '红', 26: '红', 27: '红', 28: '红', 29: '红', 30: '红', 31: '红', 32: '红', 33: '红',
  34: '红', 35: '红', 36: '红', 37: '红', 38: '红', 39: '红', 40: '红', 41: '红', 42: '红',
  43: '红', 44: '红', 45: '红', 46: '红', 47: '红', 48: '红', 49: '红'
}

// 红色波
export const RED_NUMBERS = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
// 蓝色波
export const BLUE_NUMBERS = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
// 绿色波
export const GREEN_NUMBERS = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

// 五行映射
export const ELEMENT_MAP: Record<number, string> = {
  1: '金', 2: '木', 3: '水', 4: '火', 5: '土', 6: '金', 7: '木', 8: '水', 9: '火', 10: '土',
  11: '金', 12: '木', 13: '水', 14: '火', 15: '土', 16: '金', 17: '木', 18: '水', 19: '火', 20: '土',
  21: '金', 22: '木', 23: '水', 24: '火', 25: '土', 26: '金', 27: '木', 28: '水', 29: '火', 30: '土',
  31: '金', 32: '木', 33: '水', 34: '火', 35: '土', 36: '金', 37: '木', 38: '水', 39: '火', 40: '土',
  41: '金', 42: '木', 43: '水', 44: '火', 45: '土', 46: '金', 47: '木', 48: '水', 49: '火'
}

// 五行分类
export const ELEMENTS = {
  金: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
  木: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
  水: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
  火: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
  土: [5, 10, 15, 20, 25, 30, 35, 40, 45]
}

// 大小数
export const SMALL_NUMBERS = Array.from({ length: 24 }, (_, i) => i + 1) // 1-24
export const BIG_NUMBERS = Array.from({ length: 25 }, (_, i) => i + 25) // 25-49

// 家禽（牛羊猪鸡马狗）
export const DOMESTIC_NUMBERS = [1, 6, 8, 9, 10, 12, 13, 18, 20, 21, 22, 24, 25, 30, 32, 33, 34, 36, 37, 42, 44, 45, 46, 48, 49]
// 野兽（龙虎兔猴蛇）
export const WILD_NUMBERS = [2, 3, 4, 5, 11, 14, 15, 16, 17, 23, 26, 27, 28, 29, 35, 38, 39, 40, 41, 47]

// 获取号码的波色
export function getNumberColor(num: number): string {
  if (RED_NUMBERS.includes(num)) return '红'
  if (BLUE_NUMBERS.includes(num)) return '蓝'
  if (GREEN_NUMBERS.includes(num)) return '绿'
  return ''
}

// 获取号码的五行
export function getNumberElement(num: number): string {
  return ELEMENT_MAP[num] || ''
}

// 获取号码的生肖
export function getNumberZodiac(num: number): string {
  return ZODIAC_MAP[num] || ''
}

// 获取号码的尾数
export function getNumberTail(num: number): number {
  return num % 10
}

// 获取号码的大小
export function getNumberSize(num: number): string {
  return num <= 24 ? '小' : '大'
}

// 获取号码的家禽野兽类型
export function getNumberAnimalType(num: number): string {
  if (DOMESTIC_NUMBERS.includes(num)) return '家禽'
  if (WILD_NUMBERS.includes(num)) return '野兽'
  return ''
}
