import {
  getNumberZodiac,
  getNumberColor,
  getNumberElement,
  getNumberTail,
  getNumberSize,
  getNumberAnimalType
} from './numberAttributes'

// 解析输入字符串，提取所有数字
export function parseNumbers(input: string): number[] {
  if (!input.trim()) return []
  
  // 支持空格、逗号、句号、点、换行等分隔符
  const numbers = input
    .split(/[\s,.\n\r，。、]+/)
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(s => parseInt(s, 10))
    .filter(n => !Number.isNaN(n) && n >= 1 && n <= 49)
  
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
