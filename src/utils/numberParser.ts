import {
  getNumberZodiac,
  getNumberColor,
  getNumberElement,
  getNumberTail,
  getNumberSize,
  getNumberAnimalType
} from './numberAttributes'

// 十二生肖列表
const ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 十二生肖到数字的映射（每个生肖对应哪些数字）
export const ZODIAC_TO_NUMBERS: Record<string, number[]> = {
  '鼠': [7, 19, 31, 43],
  '牛': [6, 18, 30, 42],
  '虎': [5, 17, 29, 41],
  '兔': [4, 16, 28, 40],
  '龙': [3, 15, 27, 39],
  '蛇': [2, 14, 26, 38],
  '马': [1, 13, 25, 37, 49],
  '羊': [12, 24, 36, 48],
  '猴': [11, 23, 35, 47],
  '鸡': [10, 22, 34, 46],
  '狗': [9, 21, 33, 45],
  '猪': [8, 20, 32, 44]
}

// 数字到生肖的映射
export const NUMBER_TO_ZODIAC: Record<number, string> = {}
Object.entries(ZODIAC_TO_NUMBERS).forEach(([zodiac, nums]) => {
  nums.forEach(num => {
    NUMBER_TO_ZODIAC[num] = zodiac
  })
})

// 解析输入字符串，提取所有数字和十二生肖对应的数字
export function parseNumbers(input: string): number[] {
  if (!input.trim()) return []
  
  const numbers: number[] = []
  
  // 按分隔符分割
  const tokens = input.split(/[\s,.\n\r，。、]+/)
  
  tokens.forEach(token => {
    token = token.trim()
    if (!token) return
    
    // 尝试解析为数字
    const num = parseInt(token, 10)
    if (!Number.isNaN(num) && num >= 1 && num <= 49) {
      numbers.push(num)
      return
    }
    
    // 尝试解析为生肖
    if (ZODIAC_TO_NUMBERS[token]) {
      // 将该生肖对应的所有数字加入
      numbers.push(...ZODIAC_TO_NUMBERS[token])
    }
    
    // 其他内容自动过滤，不处理
  })
  
  return numbers
}

// 格式化数字（1 -> 01, 2 -> 02）
export function formatNumber(num: number): string {
  return num < 10 ? `0${num}` : `${num}`
}

// 统计数字出现次数
export function countNumbers(numbers: number[]): Record<number, number> {
  const counts: Record<number, number> = {}
  
  // 初始化 1-49 的计数为 0
  for (let i = 1; i <= 49; i++) {
    counts[i] = 0
  }
  
  // 统计出现的数字
  numbers.forEach(num => {
    counts[num] = (counts[num] || 0) + 1
  })
  
  return counts
}

// 从连续字符串中提取生肖（支持无分隔符连续输入）
export function parseZodiacs(input: string): string[] {
  if (!input.trim()) return []
  
  const zodiacs: string[] = []
  const chars = input.split('')
  
  chars.forEach(char => {
    if (ZODIACS.includes(char)) {
      zodiacs.push(char)
    }
  })
  
  return zodiacs
}

// 统计生肖出现次数
export function countZodiacs(zodiacs: string[]): Record<string, number> {
  const counts: Record<string, number> = {}
  
  // 初始化所有生肖计数为 0
  ZODIACS.forEach(zodiac => {
    counts[zodiac] = 0
  })
  
  // 统计出现的生肖
  zodiacs.forEach(zodiac => {
    counts[zodiac] = (counts[zodiac] || 0) + 1
  })
  
  return counts
}

// 获取数字的完整属性
export function getNumberAttributes(num: number) {
  return {
    number: num,
    formatted: formatNumber(num),
    zodiac: getNumberZodiac(num),
    color: getNumberColor(num),
    element: getNumberElement(num),
    tail: getNumberTail(num),
    size: getNumberSize(num),
    animalType: getNumberAnimalType(num)
  }
}

// 获取波色对应的颜色类名
export function getColorClassName(color: string): string {
  switch (color) {
    case '红':
      return 'bg-red-500 text-white'
    case '蓝':
      return 'bg-blue-500 text-white'
    case '绿':
      return 'bg-green-500 text-white'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}
