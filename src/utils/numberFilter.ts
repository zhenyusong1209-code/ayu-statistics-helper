import {
  getNumberZodiac,
  getNumberColor,
  getNumberElement,
  getNumberTail,
  getNumberSize,
  getNumberAnimalType
} from './numberAttributes'
import { isSumOdd, isSumEven } from './numberParser'

// 筛选条件类型
export interface FilterConditions {
  zodiacs: string[]        // 生肖：鼠牛虎兔龙蛇马羊猴鸡狗猪
  colors: string[]         // 波色：红蓝绿
  elements: string[]       // 五行：金木水火土
  sizes: string[]          // 大小：大数小数
  tails: number[]          // 尾数：0-9
  heads: number[]          // 头数：0-4（十位数）
  animalTypes: string[]    // 家禽野兽：家禽野兽
  oddEven: string[]        // 单双：单数双数
  sumOdd: boolean          // 合单：合数为单数
  sumEven: boolean         // 合双：合数为双数
}

// 获取数字的头数（十位数）
function getNumberHead(num: number): number {
  return Math.floor(num / 10)
}

// 获取数字的单双性
function getNumberOddEven(num: number): string {
  return num % 2 === 0 ? '双数' : '单数'
}

// 检查号码是否匹配所有选中的条件
export function isNumberMatched(num: number, conditions: FilterConditions): boolean {
  const { zodiacs, colors, elements, sizes, tails, heads, animalTypes, oddEven, sumOdd, sumEven } = conditions

  // 检查生肖
  if (zodiacs.length > 0) {
    const zodiac = getNumberZodiac(num)
    if (!zodiacs.includes(zodiac)) return false
  }

  // 检查波色
  if (colors.length > 0) {
    const color = getNumberColor(num)
    if (!colors.includes(color)) return false
  }

  // 检查五行
  if (elements.length > 0) {
    const element = getNumberElement(num)
    if (!elements.includes(element)) return false
  }

  // 检查大小
  if (sizes.length > 0) {
    const size = getNumberSize(num)
    if (!sizes.includes(size)) return false
  }

  // 检查尾数
  if (tails.length > 0) {
    const tail = getNumberTail(num)
    if (!tails.includes(tail)) return false
  }

  // 检查头数
  if (heads.length > 0) {
    const head = getNumberHead(num)
    if (!heads.includes(head)) return false
  }

  // 检查家禽野兽
  if (animalTypes.length > 0) {
    const animalType = getNumberAnimalType(num)
    if (!animalTypes.includes(animalType)) return false
  }

  // 检查单双
  if (oddEven.length > 0) {
    const oddEvenValue = getNumberOddEven(num)
    if (!oddEven.includes(oddEvenValue)) return false
  }

  // 检查合单
  if (sumOdd && !isSumOdd(num)) return false

  // 检查合双
  if (sumEven && !isSumEven(num)) return false

  return true
}

// 根据筛选条件获取符合条件的号码
export function filterNumbers(conditions: FilterConditions): number[] {
  const { zodiacs, colors, elements, sizes, tails, heads, animalTypes, oddEven, sumOdd, sumEven } = conditions
  
  // 如果没有任何筛选条件，返回空数组
  if (
    zodiacs.length === 0 &&
    colors.length === 0 &&
    elements.length === 0 &&
    sizes.length === 0 &&
    tails.length === 0 &&
    heads.length === 0 &&
    animalTypes.length === 0 &&
    oddEven.length === 0 &&
    !sumOdd &&
    !sumEven
  ) {
    return []
  }
  
  const results: number[] = []
  for (let i = 1; i <= 49; i++) {
    if (isNumberMatched(i, conditions)) {
      results.push(i)
    }
  }
  return results
}

// 切换数组中的元素
export function toggleArrayItem<T>(arr: T[], item: T): T[] {
  if (arr.includes(item)) {
    return arr.filter(i => i !== item)
  } else {
    return [...arr, item]
  }
}
