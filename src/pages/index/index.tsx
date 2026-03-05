import { View, Text, Input, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { parseNumbers, countNumbers, getNumberAttributes, getColorClassName, parseZodiacs, countZodiacs, ZODIAC_TO_NUMBERS } from '@/utils/numberParser'
import { filterNumbers, toggleArrayItem } from '@/utils/numberFilter'
import type { FilterConditions } from '@/utils/numberFilter'
import './index.css'

// 十二生肖列表（选号模块自定义排序）
const ZODIAC_LIST = ['马', '蛇', '龙', '兔', '虎', '牛', '鼠', '猪', '狗', '鸡', '猴', '羊']

type TabType = 'statistics' | 'complex' | 'pick' | 'select' | 'about'

const IndexPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pick')
  const [inputText, setInputText] = useState('')
  const [numbers, setNumbers] = useState<number[]>([])
  const [zodiacs, setZodiacs] = useState<string[]>([])
  
  // 选号功能相关状态
  const [selectInputText, setSelectInputText] = useState('')
  const [selectNumbers, setSelectNumbers] = useState<number[]>([])
  const [visibleZodiacs, setVisibleZodiacs] = useState<Set<string>>(new Set()) // 控制哪些生肖的号码可见
  
  // 复式相关状态
  const [complexInputText, setComplexInputText] = useState('')
  const [complexNumbers, setComplexNumbers] = useState<number[]>([])
  const [complexZodiacs, setComplexZodiacs] = useState<string[]>([])
  const [complexType, setComplexType] = useState<number | null>(null) // 2, 3, 4, 5
  const [complexResults, setComplexResults] = useState<(number[] | string[])[]>([])
  const [isZodiacMode, setIsZodiacMode] = useState(false) // 是否为生肖模式
  
  // 挑码筛选条件
  const [filterConditions, setFilterConditions] = useState<FilterConditions>({
    zodiacs: [],
    colors: [],
    elements: [],
    sizes: [],
    tails: [],
    heads: [],
    animalTypes: [],
    oddEven: []
  })

  // 处理输入
  const handleInputChange = (e: any) => {
    const value = e.detail.value
    setInputText(value)
    
    // 同时解析数字和生肖
    const parsedNumbers = parseNumbers(value)
    const parsedZodiacs = parseZodiacs(value)
    
    setNumbers(parsedNumbers)
    setZodiacs(parsedZodiacs)
  }

  // 统计数据
  const statistics = countNumbers(numbers)
  const zodiacStatistics = countZodiacs(zodiacs)

  // 按出现次数分组号码
  const groupNumbersByCount = () => {
    const groups: Record<number, number[]> = {}
    
    // 初始化所有号码
    for (let num = 1; num <= 49; num++) {
      const count = statistics[num]
      if (!groups[count]) {
        groups[count] = []
      }
      groups[count].push(num)
    }
    
    return groups
  }

  // 按出现次数分组生肖
  const groupZodiacsByCount = () => {
    const groups: Record<number, string[]> = {}
    
    // 初始化所有生肖
    Object.entries(zodiacStatistics).forEach(([zodiac, count]) => {
      if (!groups[count]) {
        groups[count] = []
      }
      groups[count].push(zodiac)
    })
    
    return groups
  }

  const groupedNumbers = groupNumbersByCount()
  const groupedZodiacs = groupZodiacsByCount()

  // 处理选号输入
  const handleSelectInputChange = (e: any) => {
    const value = e.detail.value
    setSelectInputText(value)
    
    // 解析数字
    const parsedNumbers = parseNumbers(value)
    // 去重
    const uniqueNumbers = Array.from(new Set(parsedNumbers))
    setSelectNumbers(uniqueNumbers)
    
    // 更新可见生肖：所有被选中的生肖默认显示
    const zodiacsWithNumbers = new Set<string>()
    uniqueNumbers.forEach(num => {
      const zodiac = Object.entries(ZODIAC_TO_NUMBERS).find(([_, nums]) => nums.includes(num))?.[0]
      if (zodiac) {
        zodiacsWithNumbers.add(zodiac)
      }
    })
    setVisibleZodiacs(zodiacsWithNumbers)
  }

  // 清空选号输入
  const clearSelectInput = () => {
    setSelectInputText('')
    setSelectNumbers([])
    setVisibleZodiacs(new Set())
  }

  // 检查生肖是否被选中（是否有该生肖的号码）
  const isZodiacSelected = (zodiac: string): boolean => {
    const zodiacNumbers = ZODIAC_TO_NUMBERS[zodiac] || []
    return zodiacNumbers.some(num => selectNumbers.includes(num))
  }

  // 切换生肖号码的显示状态
  const toggleZodiacVisibility = (zodiac: string) => {
    const isSelected = isZodiacSelected(zodiac)
    const isVisible = isZodiacVisible(zodiac)
    const zodiacNumbers = ZODIAC_TO_NUMBERS[zodiac] || []
    
    if (isVisible) {
      // 当前可见，点击隐藏：从选号结果中移除该生肖的号码
      setSelectNumbers(prev => prev.filter(num => !zodiacNumbers.includes(num)))
      // 从可见集合中移除
      setVisibleZodiacs(prev => {
        const newSet = new Set(prev)
        newSet.delete(zodiac)
        return newSet
      })
    } else {
      // 当前不可见，点击显示
      if (!isSelected) {
        // 如果生肖未被选中，添加该生肖的所有号码到选号结果中
        setSelectNumbers(prev => {
          const newNumbers = [...prev]
          zodiacNumbers.forEach(num => {
            if (!newNumbers.includes(num)) {
              newNumbers.push(num)
            }
          })
          return newNumbers
        })
      }
      // 添加到可见集合
      setVisibleZodiacs(prev => {
        const newSet = new Set(prev)
        newSet.add(zodiac)
        return newSet
      })
    }
  }

  // 检查生肖号码是否可见
  const isZodiacVisible = (zodiac: string): boolean => {
    return visibleZodiacs.has(zodiac)
  }

  // 获取生肖下被选中的号码（根据可见性过滤）
  const getVisibleNumbersByZodiac = (zodiac: string): number[] => {
    if (!isZodiacVisible(zodiac)) {
      return []
    }
    // 如果生肖被选中，返回被选中的号码
    // 如果生肖未被选中但在可见集合中，返回该生肖的所有号码
    const zodiacNumbers = ZODIAC_TO_NUMBERS[zodiac] || []
    if (isZodiacSelected(zodiac)) {
      return zodiacNumbers.filter(num => selectNumbers.includes(num))
    } else {
      return zodiacNumbers
    }
  }

  // 复制选号结果（复制所有可见的号码）
  const copySelectResults = () => {
    // 收集所有可见生肖的号码
    const allVisibleNumbers = new Set<number>()
    ZODIAC_LIST.forEach(zodiac => {
      const visibleNums = getVisibleNumbersByZodiac(zodiac)
      visibleNums.forEach(num => allVisibleNumbers.add(num))
    })
    
    const resultText = Array.from(allVisibleNumbers)
      .sort((a, b) => a - b)
      .map(num => num < 10 ? `0${num}` : `${num}`)
      .join(' ')
    
    Taro.setClipboardData({
      data: resultText,
      success: () => {
        Taro.showToast({
          title: '复制成功',
          icon: 'success'
        })
      },
      fail: () => {
        Taro.showToast({
          title: '复制失败',
          icon: 'error'
        })
      }
    })
  }

  // 处理复式输入
  const handleComplexInputChange = (e: any) => {
    const value = e.detail.value
    setComplexInputText(value)
    
    // 同时解析数字和生肖
    const parsedNumbers = parseNumbers(value)
    const parsedZodiacs = parseZodiacs(value)
    
    // 去重
    const uniqueNumbers = Array.from(new Set(parsedNumbers))
    const uniqueZodiacs = Array.from(new Set(parsedZodiacs))
    
    setComplexNumbers(uniqueNumbers)
    setComplexZodiacs(uniqueZodiacs)
    
    // 改进模式判断逻辑：
    // 1. 统计输入中包含的纯数字（非生肖转换）数量
    const rawNumbers = value.split(/[\s,\s,，。、]+/)
      .map(t => parseInt(t.trim(), 10))
      .filter(n => !Number.isNaN(n) && n >= 1 && n <= 49)
    
    // 2. 判断模式：
    //    - 如果有纯数字输入 >= 2，优先使用数字模式
    //    - 否则，如果有生肖输入 >= 2，使用生肖模式
    const hasRawNumbers = rawNumbers.length >= 2
    const hasZodiacs = uniqueZodiacs.length >= 2
    
    // 优先使用数字模式（用户明确输入了数字）
    const zodiacMode = !hasRawNumbers && hasZodiacs
    setIsZodiacMode(zodiacMode)
    
    // 重置复式类型和结果
    setComplexType(null)
    setComplexResults([])
  }

  // 清空复式输入
  const clearComplexInput = () => {
    setComplexInputText('')
    setComplexNumbers([])
    setComplexZodiacs([])
    setComplexType(null)
    setComplexResults([])
    setIsZodiacMode(false)
  }

  // 计算组合数 C(n,k)
  const calculateCombination = (n: number, k: number): number => {
    if (k > n || k < 0) return 0
    if (k === 0 || k === n) return 1
    
    let result = 1
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1)
    }
    return Math.round(result)
  }

  // 生成所有组合
  const generateCombinations = (nums: number[], k: number): number[][] => {
    if (k > nums.length || k < 0) return []
    if (k === 0) return [[]]
    if (k === nums.length) return [nums]
    
    const result: number[][] = []
    
    const backtrack = (start: number, path: number[]) => {
      if (path.length === k) {
        result.push([...path])
        return
      }
      
      for (let i = start; i < nums.length; i++) {
        path.push(nums[i])
        backtrack(i + 1, path)
        path.pop()
      }
    }
    
    backtrack(0, [])
    return result
  }

  // 生成所有生肖组合
  const generateZodiacCombinations = (zodiacList: string[], k: number): string[][] => {
    if (k > zodiacList.length || k < 0) return []
    if (k === 0) return [[]]
    if (k === zodiacList.length) return [zodiacList]
    
    const result: string[][] = []
    
    const backtrack = (start: number, path: string[]) => {
      if (path.length === k) {
        result.push([...path])
        return
      }
      
      for (let i = start; i < zodiacList.length; i++) {
        path.push(zodiacList[i])
        backtrack(i + 1, path)
        path.pop()
      }
    }
    
    backtrack(0, [])
    return result
  }

  // 处理复式类型选择
  const handleComplexTypeSelect = (k: number) => {
    if (isZodiacMode) {
      // 生肖模式
      if (complexZodiacs.length < k) {
        Taro.showToast({
          title: `请输入至少${k}个生肖`,
          icon: 'none'
        })
        return
      }
      
      setComplexType(k)
      const combinations = generateZodiacCombinations(complexZodiacs, k)
      setComplexResults(combinations)
    } else {
      // 数字模式
      if (complexNumbers.length < k) {
        Taro.showToast({
          title: `请输入至少${k}个号码`,
          icon: 'none'
        })
        return
      }
      
      setComplexType(k)
      const combinations = generateCombinations(complexNumbers, k)
      setComplexResults(combinations)
    }
  }

  // 清空筛选条件
  const clearFilters = () => {
    setFilterConditions({
      zodiacs: [],
      colors: [],
      elements: [],
      sizes: [],
      tails: [],
      heads: [],
      animalTypes: [],
      oddEven: []
    })
  }

  // 复制统计结果
  const copyStatistics = (type: 'number' | 'zodiac') => {
    let text = ''
    
    if (type === 'number') {
      // 数字统计复制：只复制数字，不包含"X次："前缀
      Object.keys(groupedNumbers)
        .map(Number)
        .filter(count => groupedNumbers[count]?.length > 0)
        .sort((a, b) => a - b)
        .forEach(count => {
          const nums = groupedNumbers[count].sort((a, b) => a - b)
          text += nums.map(n => n < 10 ? `0${n}` : n).join(' ') + '\n'
        })
    } else {
      // 生肖统计复制：只复制生肖，不包含"X次："前缀
      Object.keys(groupedZodiacs)
        .map(Number)
        .filter(count => groupedZodiacs[count]?.length > 0)
        .sort((a, b) => a - b)
        .forEach(count => {
          const zodiacList = groupedZodiacs[count].sort()
          text += zodiacList.join(' ') + '\n'
        })
    }
    
    Taro.setClipboardData({
      data: text.trim(),
      success: () => {
        Taro.showToast({
          title: '复制成功',
          icon: 'success'
        })
      },
      fail: () => {
        Taro.showToast({
          title: '复制失败',
          icon: 'error'
        })
      }
    })
  }

  // 根据筛选条件获取结果
  const filteredNumbers = filterNumbers(filterConditions)

  // 切换生肖选择
  const toggleZodiac = (zodiac: string) => {
    setFilterConditions(prev => ({
      ...prev,
      zodiacs: toggleArrayItem(prev.zodiacs, zodiac)
    }))
  }

  // 切换波色选择
  const toggleColor = (color: string) => {
    setFilterConditions(prev => ({
      ...prev,
      colors: toggleArrayItem(prev.colors, color)
    }))
  }

  // 切换五行选择
  const toggleElement = (element: string) => {
    setFilterConditions(prev => ({
      ...prev,
      elements: toggleArrayItem(prev.elements, element)
    }))
  }

  // 切换大小选择
  const toggleSize = (size: string) => {
    setFilterConditions(prev => ({
      ...prev,
      sizes: toggleArrayItem(prev.sizes, size)
    }))
  }

  // 切换尾数选择
  const toggleTail = (tail: number) => {
    setFilterConditions(prev => ({
      ...prev,
      tails: toggleArrayItem(prev.tails, tail)
    }))
  }

  // 切换家禽野兽选择
  const toggleAnimalType = (type: string) => {
    setFilterConditions(prev => ({
      ...prev,
      animalTypes: toggleArrayItem(prev.animalTypes, type)
    }))
  }

  // 切换头数选择
  const toggleHead = (head: number) => {
    setFilterConditions(prev => ({
      ...prev,
      heads: toggleArrayItem(prev.heads, head)
    }))
  }

  // 切换单双选择
  const toggleOddEven = (value: string) => {
    setFilterConditions(prev => ({
      ...prev,
      oddEven: toggleArrayItem(prev.oddEven, value)
    }))
  }

  // 复制筛选结果
  const copyResults = () => {
    const resultText = filteredNumbers.map(n => {
      const attrs = getNumberAttributes(n)
      return attrs.formatted
    }).join(',')
    
    Taro.setClipboardData({
      data: resultText,
      success: () => {
        Taro.showToast({
          title: '复制成功',
          icon: 'success'
        })
      },
      fail: () => {
        Taro.showToast({
          title: '复制失败',
          icon: 'error'
        })
      }
    })
  }

  // 复制复式结果
  const copyComplexResults = () => {
    let resultText = ''
    
    if (isZodiacMode) {
      // 生肖模式：只复制生肖组合
      resultText = complexResults.map((combination) => {
        const zodiacList = combination as string[]
        return zodiacList.join(' ')
      }).join('\n')
    } else {
      // 数字模式：只复制数字
      resultText = complexResults.map((combination) => {
        const nums = combination as number[]
        return nums.map(num => num < 10 ? `0${num}` : `${num}`).join(' ')
      }).join('\n')
    }
    
    Taro.setClipboardData({
      data: resultText,
      success: () => {
        Taro.showToast({
          title: '复制成功',
          icon: 'success'
        })
      },
      fail: () => {
        Taro.showToast({
          title: '复制失败',
          icon: 'error'
        })
      }
    })
  }

  return (
    <View className="flex flex-col h-screen bg-gray-50">
      {/* 标签页 */}
      <View className="bg-white border-b border-gray-200">
        <ScrollView scrollX className="whitespace-nowrap">
          <View className="flex flex-row">
            {([
              { key: 'pick', label: '挑码' },
              { key: 'statistics', label: '统计' },
              { key: 'complex', label: '复式' },
              { key: 'select', label: '选号' },
              { key: 'about', label: '关于我们' }
            ] as { key: TabType, label: string }[]).map(tab => (
              <View
                key={tab.key}
                className={`px-4 py-3 text-base font-medium cursor-pointer ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Text className="block">{tab.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 内容区 */}
      <ScrollView className="flex-1 p-4">
        {/* 统计区 */}
        {activeTab === 'statistics' && (
          <View className="space-y-4">
            {/* 输入区 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="block text-lg font-semibold mb-2 text-gray-800">输入</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入数字或生肖（生肖可连续输入）"
                  placeholderClass="text-gray-400"
                  value={inputText}
                  onInput={handleInputChange}
                />
              </View>
              <Text className="text-sm text-gray-500">已识别 {numbers.length} 个数字，{zodiacs.length} 个生肖</Text>
            </View>

            {/* 统计结果区 - 数字统计 */}
            {numbers.length > 0 && zodiacs.length === 0 && (
              <View className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex flex-row justify-between items-center mb-4">
                  <Text className="block text-lg font-semibold text-gray-800">统计结果</Text>
                  <View
                    className="bg-blue-100 text-blue-600 rounded-lg px-3 py-1.5"
                    onClick={() => copyStatistics('number')}
                  >
                    <Text className="text-sm font-medium">复制</Text>
                  </View>
                </View>
                
                {/* 按出现次数分组展示 */}
                <View className="space-y-3">
                  {/* 0次 */}
                  {groupedNumbers[0] && groupedNumbers[0].length > 0 && (
                    <View className="flex flex-row items-start">
                      <Text className="text-sm font-medium text-gray-700 w-12">0次：</Text>
                      <View className="flex-1 flex flex-wrap gap-1.5">
                        {groupedNumbers[0].sort((a, b) => a - b).map(num => {
                          const attrs = getNumberAttributes(num)
                          return (
                            <View key={num} className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClassName(attrs.color)}`}>
                              <Text className="text-xs font-bold">{attrs.formatted}</Text>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  )}
                  
                  {/* 其他次数 */}
                  {Object.keys(groupedNumbers)
                    .map(Number)
                    .filter(count => count > 0)
                    .sort((a, b) => a - b)
                    .map(count => (
                      <View key={count} className="flex flex-row items-start">
                        <Text className="text-sm font-medium text-gray-700 w-12">{count}次：</Text>
                        <View className="flex-1 flex flex-wrap gap-1.5">
                          {groupedNumbers[count].sort((a, b) => a - b).map(num => {
                            const attrs = getNumberAttributes(num)
                            return (
                              <View key={num} className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClassName(attrs.color)}`}>
                                <Text className="text-xs font-bold">{attrs.formatted}</Text>
                              </View>
                            )
                          })}
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            )}

            {/* 统计结果区 - 生肖统计 */}
            {zodiacs.length > 0 && (
              <View className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex flex-row justify-between items-center mb-4">
                  <Text className="block text-lg font-semibold text-gray-800">统计结果</Text>
                  <View
                    className="bg-blue-100 text-blue-600 rounded-lg px-3 py-1.5"
                    onClick={() => copyStatistics('zodiac')}
                  >
                    <Text className="text-sm font-medium">复制</Text>
                  </View>
                </View>
                
                {/* 按出现次数分组展示生肖 */}
                <View className="space-y-3">
                  {/* 0次 */}
                  {groupedZodiacs[0] && groupedZodiacs[0].length > 0 && (
                    <View className="flex flex-row items-start">
                      <Text className="text-sm font-medium text-gray-700 w-12">0次：</Text>
                      <View className="flex-1 flex flex-wrap gap-2">
                        {groupedZodiacs[0].sort().map(zodiac => (
                          <Text key={zodiac} className="text-base font-medium text-gray-700">
                            {zodiac}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {/* 其他次数 */}
                  {Object.keys(groupedZodiacs)
                    .map(Number)
                    .filter(count => count > 0)
                    .sort((a, b) => a - b)
                    .map(count => (
                      <View key={count} className="flex flex-row items-start">
                        <Text className="text-sm font-medium text-gray-700 w-12">{count}次：</Text>
                        <View className="flex-1 flex flex-wrap gap-2">
                          {groupedZodiacs[count].sort().map(zodiac => (
                            <Text key={zodiac} className="text-base font-medium text-gray-700">
                              {zodiac}
                            </Text>
                          ))}
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* 复式区 */}
        {activeTab === 'complex' && (
          <View className="space-y-3">
            {/* 输入区 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="block text-lg font-semibold mb-2 text-gray-800">输入</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入2个或更多号码或生肖（生肖可连续输入，如：牛羊鸡）"
                  placeholderClass="text-gray-400"
                  value={complexInputText}
                  onInput={handleComplexInputChange}
                />
              </View>
              <Text className="text-sm text-gray-500">
                已识别 {complexNumbers.length} 个号码，{complexZodiacs.length} 个生肖
                {(complexNumbers.length >= 2 || complexZodiacs.length >= 2) && '，可以进行复式计算'}
              </Text>
            </View>

            {/* 已选号码/生肖显示 */}
            {(complexNumbers.length > 0 || complexZodiacs.length > 0) && (
              <View className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex flex-row justify-between items-center mb-3">
                  <Text className="block text-base font-semibold text-gray-800">
                    已选{isZodiacMode ? '生肖' : '号码'}
                  </Text>
                  <Text className={`text-sm ${(isZodiacMode ? complexZodiacs.length : complexNumbers.length) >= 2 ? 'text-green-600' : 'text-orange-600'}`}>
                    {(isZodiacMode ? complexZodiacs.length : complexNumbers.length) >= 2 ? '✓ 可以进行复式计算' : `至少还需要 ${2 - (isZodiacMode ? complexZodiacs.length : complexNumbers.length)} 个${isZodiacMode ? '生肖' : '号码'}`}
                  </Text>
                </View>
                {isZodiacMode ? (
                  // 生肖模式显示
                  <View className="flex flex-wrap gap-2">
                    {complexZodiacs.map(zodiac => (
                      <View key={zodiac} className="bg-blue-100 text-blue-600 rounded-lg px-3 py-2">
                        <Text className="text-base font-medium">{zodiac}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  // 数字模式显示
                  <View className="flex flex-wrap gap-2">
                    {complexNumbers.sort((a, b) => a - b).map(num => {
                      const attrs = getNumberAttributes(num)
                      return (
                        <View key={num} className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClassName(attrs.color)}`}>
                          <Text className="text-xs font-bold">{attrs.formatted}</Text>
                        </View>
                      )
                    })}
                  </View>
                )}
              </View>
            )}

            {/* 复式选项 */}
            {((!isZodiacMode && complexNumbers.length >= 2) || (isZodiacMode && complexZodiacs.length >= 2)) && (
              <View className="bg-white rounded-xl p-4 shadow-sm">
                <Text className="block text-base font-semibold mb-3 text-gray-800">复式选项</Text>
                <View className="flex flex-row gap-2">
                  {Array.from({ length: Math.min((isZodiacMode ? complexZodiacs.length : complexNumbers.length) - 1, 4) }, (_, i) => i + 2).map(k => {
                    const count = calculateCombination(isZodiacMode ? complexZodiacs.length : complexNumbers.length, k)
                    return (
                      <View
                        key={k}
                        onClick={() => handleComplexTypeSelect(k)}
                        className={`flex-1 rounded-lg px-3 py-3 text-center cursor-pointer ${
                          complexType === k
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Text className="block text-sm font-medium">复{k}</Text>
                        <Text className={`text-xs mt-1 ${complexType === k ? 'text-blue-100' : 'text-gray-500'}`}>
                          {count}组
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}

            {/* 复式结果 */}
            {complexResults.length > 0 && (
              <View className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex flex-row justify-between items-center mb-3">
                  <Text className="block text-base font-semibold text-gray-800">
                    复式结果（复{complexType}）
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                    <Text className="text-sm text-gray-500">共 {complexResults.length} 组</Text>
                    <View
                      className="bg-blue-100 text-blue-600 rounded-lg px-3 py-1.5"
                      onClick={() => copyComplexResults()}
                    >
                      <Text className="text-sm font-medium">复制</Text>
                    </View>
                  </View>
                </View>
                <View className="grid grid-cols-2 gap-3">
                  {complexResults.map((combination, index) => (
                    <View key={index} className="bg-gray-50 rounded-lg p-3">
                      <Text className="text-xs text-gray-500 mb-2 block">第{index + 1}组</Text>
                      <View className="flex flex-wrap gap-1.5">
                        {isZodiacMode ? (
                          // 生肖模式显示
                          (combination as string[]).map(zodiac => (
                            <View key={zodiac} className="bg-blue-100 text-blue-600 rounded-lg px-2 py-1">
                              <Text className="text-sm font-medium">{zodiac}</Text>
                            </View>
                          ))
                        ) : (
                          // 数字模式显示
                          (combination as number[]).map(num => {
                            const attrs = getNumberAttributes(num)
                            return (
                              <View key={num} className={`w-7 h-7 rounded-full flex items-center justify-center ${getColorClassName(attrs.color)}`}>
                                <Text className="text-xs font-bold">{attrs.formatted}</Text>
                              </View>
                            )
                          })
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 清空按钮 */}
            {complexInputText && (
              <View className="flex justify-center">
                <View
                  className="bg-red-500 text-white rounded-lg px-6 py-3"
                  onClick={clearComplexInput}
                >
                  <Text className="text-sm font-medium">清空</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* 关于我们区 */}
        {activeTab === 'about' && (
          <View className="bg-white rounded-xl p-4">
            <Text className="block text-lg font-semibold mb-4 text-gray-800">关于我们</Text>
            
            {/* 使用声明 */}
            <View className="bg-orange-50 rounded-xl p-4 mb-4">
              <Text className="block text-base font-semibold mb-2 text-orange-800">使用声明</Text>
              <Text className="block text-sm text-orange-700 leading-relaxed">
                本软件仅供学习交流，请确保您在使用本软件时遵守当地法律法规，不得用于任何违法活动！
              </Text>
            </View>
            
            {/* 更多内容（暂时不设置） */}
            <View className="bg-gray-50 rounded-xl p-6 text-center">
              <Text className="text-base text-gray-400">更多内容即将上线</Text>
              <Text className="text-sm text-gray-400 mt-2">敬请期待</Text>
            </View>
          </View>
        )}

        {/* 挑码区 */}
        {activeTab === 'pick' && (
          <View className="space-y-3">
            {/* 筛选结果区 - 仅在有结果时显示 */}
            {filteredNumbers.length > 0 && (
              <View className="bg-white rounded-xl p-3 shadow-sm">
                <View className="flex flex-row justify-between items-center mb-2">
                  <Text className="block text-base font-semibold text-gray-800">
                    筛选结果
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                    <Text className="text-xs text-gray-500">
                      {filteredNumbers.length} 个
                    </Text>
                    <View
                      className="bg-blue-100 text-blue-600 rounded-lg px-2 py-1"
                      onClick={copyResults}
                    >
                      <Text className="text-xs font-medium">复制</Text>
                    </View>
                  </View>
                </View>

                <View className="rounded-lg p-4 min-h-[80px] bg-white">
                  <View className="grid grid-cols-10 gap-1.5 w-full">
                    {filteredNumbers.map(num => {
                      const attrs = getNumberAttributes(num)
                      return (
                        <View
                          key={num}
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${getColorClassName(attrs.color)}`}
                        >
                          <Text className="text-xs font-bold">{attrs.formatted}</Text>
                        </View>
                      )
                    })}
                  </View>
                </View>
              </View>
            )}

            {/* 属性选择区 - 占70%空间 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex flex-row justify-between items-center mb-3">
                <Text className="block text-base font-semibold text-gray-800">筛选条件</Text>
                {(filterConditions.zodiacs.length > 0 ||
                  filterConditions.colors.length > 0 ||
                  filterConditions.elements.length > 0 ||
                  filterConditions.sizes.length > 0 ||
                  filterConditions.tails.length > 0 ||
                  filterConditions.heads.length > 0 ||
                  filterConditions.animalTypes.length > 0 ||
                  filterConditions.oddEven.length > 0) && (
                  <View
                    className="bg-red-100 text-red-600 rounded-lg px-2 py-1"
                    onClick={clearFilters}
                  >
                    <Text className="text-xs font-medium">清空</Text>
                  </View>
                )}
              </View>

              <View className="space-y-3">
                {/* 第一行：单双 大小 */}
                <View>
                  <View className="flex flex-row gap-2">
                    {/* 单双 */}
                    <View className="flex-1">
                      <Text className="block text-xs font-medium mb-2 text-gray-700">单双</Text>
                      <View className="flex flex-row gap-1">
                        <View
                          onClick={() => toggleOddEven('单数')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.oddEven.includes('单数')
                              ? 'bg-orange-600 text-white'
                              : 'bg-orange-50 text-orange-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">单数</Text>
                        </View>
                        <View
                          onClick={() => toggleOddEven('双数')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.oddEven.includes('双数')
                              ? 'bg-orange-600 text-white'
                              : 'bg-orange-50 text-orange-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">双数</Text>
                        </View>
                      </View>
                    </View>
                    {/* 大小 */}
                    <View className="flex-1">
                      <Text className="block text-xs font-medium mb-2 text-gray-700">大小</Text>
                      <View className="flex flex-row gap-1">
                        <View
                          onClick={() => toggleSize('大')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.sizes.includes('大')
                              ? 'bg-indigo-600 text-white'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">大数</Text>
                        </View>
                        <View
                          onClick={() => toggleSize('小')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.sizes.includes('小')
                              ? 'bg-indigo-600 text-white'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">小数</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* 第二行：波色 家野 */}
                <View>
                  <View className="flex flex-row gap-2">
                    {/* 波色 */}
                    <View className="flex-1">
                      <Text className="block text-xs font-medium mb-2 text-gray-700">波色</Text>
                      <View className="flex flex-row gap-1">
                        <View
                          onClick={() => toggleColor('红')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.colors.includes('红')
                              ? 'bg-red-600 text-white'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">红</Text>
                        </View>
                        <View
                          onClick={() => toggleColor('蓝')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.colors.includes('蓝')
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">蓝</Text>
                        </View>
                        <View
                          onClick={() => toggleColor('绿')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.colors.includes('绿')
                              ? 'bg-green-600 text-white'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">绿</Text>
                        </View>
                      </View>
                    </View>
                    {/* 家野 */}
                    <View className="flex-1">
                      <Text className="block text-xs font-medium mb-2 text-gray-700">家野</Text>
                      <View className="flex flex-row gap-1">
                        <View
                          onClick={() => toggleAnimalType('家禽')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.animalTypes.includes('家禽')
                              ? 'bg-yellow-600 text-white'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">家禽</Text>
                        </View>
                        <View
                          onClick={() => toggleAnimalType('野兽')}
                          className={`flex-1 rounded-lg px-2 py-2 text-center ${
                            filterConditions.animalTypes.includes('野兽')
                              ? 'bg-pink-600 text-white'
                              : 'bg-pink-50 text-pink-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">野兽</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* 第三行：生肖（分两行） */}
                <View>
                  <Text className="block text-xs font-medium mb-2 text-gray-700">生肖</Text>
                  <View className="space-y-1.5">
                    <View className="grid grid-cols-6 gap-1">
                      {['鼠', '牛', '虎', '兔', '龙', '蛇'].map(zodiac => (
                        <View
                          key={zodiac}
                          onClick={() => toggleZodiac(zodiac)}
                          className={`rounded-lg px-2 py-2 text-center ${
                            filterConditions.zodiacs.includes(zodiac)
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">{zodiac}</Text>
                        </View>
                      ))}
                    </View>
                    <View className="grid grid-cols-6 gap-1">
                      {['马', '羊', '猴', '鸡', '狗', '猪'].map(zodiac => (
                        <View
                          key={zodiac}
                          onClick={() => toggleZodiac(zodiac)}
                          className={`rounded-lg px-2 py-2 text-center ${
                            filterConditions.zodiacs.includes(zodiac)
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          <Text className="text-xs font-medium">{zodiac}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* 第四行：头数 */}
                <View>
                  <Text className="block text-xs font-medium mb-2 text-gray-700">头数</Text>
                  <View className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 5 }, (_, i) => i).map(head => (
                      <View
                        key={head}
                        onClick={() => toggleHead(head)}
                        className={`rounded-lg px-2 py-2 text-center ${
                          filterConditions.heads.includes(head)
                            ? 'bg-cyan-600 text-white'
                            : 'bg-cyan-50 text-cyan-700'
                        }`}
                      >
                        <Text className="text-xs font-medium">{head}头</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 第五行：尾数 */}
                <View>
                  <Text className="block text-xs font-medium mb-2 text-gray-700">尾数</Text>
                  <View className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 10 }, (_, i) => i).map(tail => (
                      <View
                        key={tail}
                        onClick={() => toggleTail(tail)}
                        className={`rounded-lg px-2 py-2 text-center ${
                          filterConditions.tails.includes(tail)
                            ? 'bg-teal-600 text-white'
                            : 'bg-teal-50 text-teal-700'
                        }`}
                      >
                        <Text className="text-xs font-medium">{tail}尾</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 第六行：五行 */}
                <View>
                  <Text className="block text-xs font-medium mb-2 text-gray-700">五行</Text>
                  <View className="grid grid-cols-5 gap-1">
                    {['金', '木', '水', '火', '土'].map(element => (
                      <View
                        key={element}
                        onClick={() => toggleElement(element)}
                        className={`rounded-lg px-2 py-2 text-center ${
                          filterConditions.elements.includes(element)
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        <Text className="text-xs font-medium">{element}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 选号区 */}
        {activeTab === 'select' && (
          <View className="space-y-4">
            {/* 输出结果板块 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex flex-row justify-between items-center mb-4">
                <Text className="block text-lg font-semibold text-gray-800">输出结果</Text>
                <View className="flex flex-row items-center gap-2">
                  {selectNumbers.length > 0 && (
                    <>
                      <View
                        className="bg-blue-100 text-blue-600 rounded-lg px-3 py-1.5"
                        onClick={copySelectResults}
                      >
                        <Text className="text-sm font-medium">复制</Text>
                      </View>
                      <View
                        className="bg-red-100 text-red-600 rounded-lg px-3 py-1.5"
                        onClick={clearSelectInput}
                      >
                        <Text className="text-sm font-medium">清空</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>

              {/* 生肖展示 - 一行展示完 */}
              <View className="grid grid-cols-12 gap-1.5">
                {ZODIAC_LIST.map(zodiac => {
                  const isSelected = isZodiacSelected(zodiac)
                  const visibleNums = getVisibleNumbersByZodiac(zodiac)
                  return (
                    <View key={zodiac} className="flex flex-col items-center">
                      {/* 生肖名称 - 可点击 */}
                      <View 
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 cursor-pointer ${
                          isSelected ? 'bg-black' : 'bg-gray-300'
                        }`}
                        onClick={() => toggleZodiacVisibility(zodiac)}
                      >
                        <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                          {zodiac}
                        </Text>
                      </View>
                      {/* 号码球 - 只显示可见的 */}
                      <View className="flex flex-wrap gap-0.5 justify-center">
                        {visibleNums.map(num => {
                          const attrs = getNumberAttributes(num)
                          return (
                            <View 
                              key={num} 
                              className={`w-4 h-4 rounded-full flex items-center justify-center ${getColorClassName(attrs.color)}`}
                            >
                              <Text className="text-xs font-bold">{attrs.formatted}</Text>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  )
                })}
              </View>
              {/* 提示文字 */}
              {selectNumbers.length > 0 && (
                <Text className="text-xs text-gray-400 mt-3 text-center">
                  点击生肖显示/隐藏号码
                </Text>
              )}
            </View>

            {/* 输入板块 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="block text-lg font-semibold mb-3 text-gray-800">输入</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入号码，支持数字或生肖"
                  placeholderClass="text-gray-400"
                  value={selectInputText}
                  onInput={handleSelectInputChange}
                />
              </View>
              <Text className="text-sm text-gray-500">
                已识别 {selectNumbers.length} 个号码
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default IndexPage
