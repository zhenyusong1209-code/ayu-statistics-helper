import { View, Text, Input, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { parseNumbers, countNumbers, getNumberAttributes, getColorClassName } from '@/utils/numberParser'
import { filterNumbers, toggleArrayItem } from '@/utils/numberFilter'
import type { FilterConditions } from '@/utils/numberFilter'
import './index.css'

type TabType = 'statistics' | 'filter' | 'complex' | 'draft' | 'pick' | 'select'

const IndexPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('statistics')
  const [inputText, setInputText] = useState('')
  const [numbers, setNumbers] = useState<number[]>([])
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  
  // 挑码筛选条件
  const [filterConditions, setFilterConditions] = useState<FilterConditions>({
    zodiacs: [],
    colors: [],
    elements: [],
    sizes: [],
    tails: [],
    animalTypes: []
  })

  // 处理输入
  const handleInputChange = (e: any) => {
    const value = e.detail.value
    setInputText(value)
    const parsedNumbers = parseNumbers(value)
    setNumbers(parsedNumbers)
  }

  // 统计数据
  const statistics = countNumbers(numbers)

  // 切换号码选中状态
  const toggleNumber = (num: number) => {
    setSelectedNumbers(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num)
      } else {
        return [...prev, num]
      }
    })
  }

  // 清空选择
  const clearSelection = () => {
    setSelectedNumbers([])
  }

  // 清空筛选条件
  const clearFilters = () => {
    setFilterConditions({
      zodiacs: [],
      colors: [],
      elements: [],
      sizes: [],
      tails: [],
      animalTypes: []
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

  // 复制筛选结果
  const copyResults = () => {
    const resultText = filteredNumbers.map(n => {
      const attrs = getNumberAttributes(n)
      return `${attrs.formatted}(${attrs.color})`
    }).join(' ')
    
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
              { key: 'statistics', label: '统计' },
              { key: 'filter', label: '筛选' },
              { key: 'complex', label: '复式' },
              { key: 'draft', label: '草稿' },
              { key: 'pick', label: '挑码' },
              { key: 'select', label: '选号' }
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
              <Text className="block text-lg font-semibold mb-2 text-gray-800">数字输入</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入数字或生肖（1-49），用空格或符号隔开"
                  placeholderClass="text-gray-400"
                  value={inputText}
                  onInput={handleInputChange}
                />
              </View>
              <Text className="text-sm text-gray-500">已识别 {numbers.length} 个有效数字</Text>
            </View>

            {/* 统计结果区 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="block text-lg font-semibold mb-4 text-gray-800">统计结果</Text>
              
              {/* 统计表格 */}
              <View className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => i * 10).map(start => (
                  <View key={start} className="flex flex-row items-center">
                    {/* 号码行 */}
                    <View className="flex flex-row justify-between flex-1">
                      {Array.from({ length: 10 }, (_, j) => start + j + 1).slice(0, 9).map(num => {
                        const count = statistics[num]
                        const attrs = getNumberAttributes(num)
                        return (
                          <View key={num} className="flex flex-col items-center flex-1">
                            <Text className="text-sm font-medium text-gray-700 mb-1">{attrs.formatted}</Text>
                            <View className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100">
                              <Text className="text-xs font-bold text-blue-600">{count > 0 ? count : '-'}</Text>
                            </View>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                ))}
              </View>

              {/* 号码属性说明 */}
              <View className="mt-6 pt-4 border-t border-gray-200">
                <Text className="block text-base font-semibold mb-3 text-gray-800">号码属性</Text>
                <View className="grid grid-cols-2 gap-2">
                  <View className="bg-gray-50 rounded-lg p-3">
                    <Text className="block text-sm font-medium text-gray-700">生肖</Text>
                    <Text className="text-xs text-gray-500 mt-1">鼠牛虎兔龙蛇马羊猴鸡狗猪</Text>
                  </View>
                  <View className="bg-gray-50 rounded-lg p-3">
                    <Text className="block text-sm font-medium text-gray-700">波色</Text>
                    <Text className="text-xs text-gray-500 mt-1">红/蓝/绿三色</Text>
                  </View>
                  <View className="bg-gray-50 rounded-lg p-3">
                    <Text className="block text-sm font-medium text-gray-700">五行</Text>
                    <Text className="text-xs text-gray-500 mt-1">金木水火土</Text>
                  </View>
                  <View className="bg-gray-50 rounded-lg p-3">
                    <Text className="block text-sm font-medium text-gray-700">大小</Text>
                    <Text className="text-xs text-gray-500 mt-1">1-24小数，25-49大数</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 筛选区 */}
        {activeTab === 'filter' && (
          <View className="bg-white rounded-xl p-4">
            <Text className="block text-lg font-semibold mb-4 text-gray-800">号码属性筛选</Text>
            
            <View className="space-y-4">
              {/* 按生肖筛选 */}
              <View>
                <Text className="block text-base font-medium mb-2 text-gray-700">按生肖</Text>
                <View className="grid grid-cols-4 gap-2">
                  {['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'].map(zodiac => (
                    <View
                      key={zodiac}
                      className="bg-blue-50 text-blue-600 rounded-lg px-3 py-2 text-center"
                    >
                      <Text className="text-sm font-medium">{zodiac}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 按波色筛选 */}
              <View>
                <Text className="block text-base font-medium mb-2 text-gray-700">按波色</Text>
                <View className="flex flex-row gap-2">
                  <View className="flex-1 bg-red-50 text-red-600 rounded-lg px-3 py-2 text-center">
                    <Text className="text-sm font-medium">红色</Text>
                  </View>
                  <View className="flex-1 bg-blue-50 text-blue-600 rounded-lg px-3 py-2 text-center">
                    <Text className="text-sm font-medium">蓝色</Text>
                  </View>
                  <View className="flex-1 bg-green-50 text-green-600 rounded-lg px-3 py-2 text-center">
                    <Text className="text-sm font-medium">绿色</Text>
                  </View>
                </View>
              </View>

              {/* 按五行筛选 */}
              <View>
                <Text className="block text-base font-medium mb-2 text-gray-700">按五行</Text>
                <View className="grid grid-cols-5 gap-2">
                  {['金', '木', '水', '火', '土'].map(element => (
                    <View
                      key={element}
                      className="bg-purple-50 text-purple-600 rounded-lg px-3 py-2 text-center"
                    >
                      <Text className="text-sm font-medium">{element}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 按大小筛选 */}
              <View>
                <Text className="block text-base font-medium mb-2 text-gray-700">按大小</Text>
                <View className="flex flex-row gap-2">
                  <View className="flex-1 bg-orange-50 text-orange-600 rounded-lg px-3 py-2 text-center">
                    <Text className="text-sm font-medium">小数 (1-24)</Text>
                  </View>
                  <View className="flex-1 bg-indigo-50 text-indigo-600 rounded-lg px-3 py-2 text-center">
                    <Text className="text-sm font-medium">大数 (25-49)</Text>
                  </View>
                </View>
              </View>

              {/* 按尾数筛选 */}
              <View>
                <Text className="block text-base font-medium mb-2 text-gray-700">按尾数</Text>
                <View className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }, (_, i) => i).map(tail => (
                    <View
                      key={tail}
                      className="bg-teal-50 text-teal-600 rounded-lg px-3 py-2 text-center"
                    >
                      <Text className="text-sm font-medium">{tail}尾</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 按家禽野兽筛选 */}
              <View>
                <Text className="block text-base font-medium mb-2 text-gray-700">按家禽野兽</Text>
                <View className="flex flex-row gap-2">
                  <View className="flex-1 bg-yellow-50 text-yellow-600 rounded-lg px-3 py-2 text-center">
                    <Text className="text-sm font-medium">家禽</Text>
                  </View>
                  <View className="flex-1 bg-pink-50 text-pink-600 rounded-lg px-3 py-2 text-center">
                    <Text className="text-sm font-medium">野兽</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 复式区 */}
        {activeTab === 'complex' && (
          <View className="bg-white rounded-xl p-4">
            <Text className="block text-lg font-semibold mb-4 text-gray-800">复式计算</Text>
            <Text className="block text-sm text-gray-500 mb-4">选择多个号码进行复式组合</Text>
            
            <View className="space-y-2">
              {Array.from({ length: 7 }, (_, i) => i * 7).map(start => (
                <View key={start} className="flex flex-row justify-between items-center py-2">
                  {Array.from({ length: 7 }, (_, j) => start + j + 1).map(num => {
                    const attrs = getNumberAttributes(num)
                    return (
                      <View
                        key={num}
                        onClick={() => toggleNumber(num)}
                        className={`flex-1 flex flex-col items-center py-2 rounded-lg cursor-pointer ${
                          selectedNumbers.includes(num) ? 'bg-blue-600' : 'bg-gray-50'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          selectedNumbers.includes(num) ? 'text-white' : 'text-gray-700'
                        }`}
                        >
                          {attrs.formatted}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>

            <View className="mt-4 pt-4 border-t border-gray-200">
              <Text className="block text-base text-gray-700">已选择 {selectedNumbers.length} 个号码</Text>
              <View className="mt-2 flex flex-row gap-2">
                <View
                  className="flex-1 bg-red-500 text-white rounded-lg py-3 text-center"
                  onClick={clearSelection}
                >
                  <Text className="text-sm font-medium">清空选择</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 草稿区 */}
        {activeTab === 'draft' && (
          <View className="bg-white rounded-xl p-4">
            <Text className="block text-lg font-semibold mb-4 text-gray-800">草稿记录</Text>
            <Text className="block text-sm text-gray-500 mb-4">记录您的选号组合，方便后续分析</Text>
            
            <View className="bg-gray-50 rounded-xl p-6 text-center">
              <Text className="text-base text-gray-400">暂无草稿记录</Text>
              <Text className="text-sm text-gray-400 mt-2">点击复式或选号保存组合</Text>
            </View>
          </View>
        )}

        {/* 挑码区 */}
        {activeTab === 'pick' && (
          <View className="space-y-4">
            {/* 筛选结果区 - 移到上方 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex flex-row justify-between items-center mb-3">
                <Text className="block text-lg font-semibold text-gray-800">
                  筛选结果
                </Text>
                <View className="flex flex-row items-center gap-2">
                  <Text className="text-sm text-gray-500">
                    共 {filteredNumbers.length} 个号码
                  </Text>
                  {filteredNumbers.length > 0 && (
                    <View
                      className="bg-blue-100 text-blue-600 rounded-lg px-3 py-1.5"
                      onClick={copyResults}
                    >
                      <Text className="text-xs font-medium">复制结果</Text>
                    </View>
                  )}
                </View>
              </View>

              <View className={`rounded-xl p-6 min-h-[120px] flex items-center justify-center ${
                filteredNumbers.length === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
              >
                {filteredNumbers.length > 0 ? (
                  <View className="grid grid-cols-7 gap-2 w-full">
                    {filteredNumbers.map(num => {
                      const attrs = getNumberAttributes(num)
                      return (
                        <View
                          key={num}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClassName(attrs.color)}`}
                        >
                          <Text className="text-sm font-bold">{attrs.formatted}</Text>
                        </View>
                      )
                    })}
                  </View>
                ) : (
                  <Text className="text-sm text-gray-400">请选择筛选条件</Text>
                )}
              </View>
            </View>

            {/* 属性选择区 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex flex-row justify-between items-center mb-4">
                <Text className="block text-lg font-semibold text-gray-800">筛选条件</Text>
                {(filterConditions.zodiacs.length > 0 ||
                  filterConditions.colors.length > 0 ||
                  filterConditions.elements.length > 0 ||
                  filterConditions.sizes.length > 0 ||
                  filterConditions.tails.length > 0 ||
                  filterConditions.animalTypes.length > 0) && (
                  <View
                    className="bg-red-100 text-red-600 rounded-lg px-3 py-1.5"
                    onClick={clearFilters}
                  >
                    <Text className="text-xs font-medium">清空筛选</Text>
                  </View>
                )}
              </View>

              <View className="space-y-3">
                {/* 生肖选择 */}
                <View>
                  <Text className="block text-sm font-medium mb-2 text-gray-700">生肖（可多选）</Text>
                  <View className="grid grid-cols-6 gap-1.5">
                    {['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'].map(zodiac => (
                      <View
                        key={zodiac}
                        onClick={() => toggleZodiac(zodiac)}
                        className={`rounded-lg px-2 py-1.5 text-center ${
                          filterConditions.zodiacs.includes(zodiac)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Text className="text-xs font-medium">{zodiac}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 波色选择 */}
                <View>
                  <Text className="block text-sm font-medium mb-2 text-gray-700">波色（可多选）</Text>
                  <View className="flex flex-row gap-2">
                    <View
                      onClick={() => toggleColor('红')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center ${
                        filterConditions.colors.includes('红')
                          ? 'bg-red-600 text-white'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <Text className="text-xs font-medium">红色</Text>
                    </View>
                    <View
                      onClick={() => toggleColor('蓝')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center ${
                        filterConditions.colors.includes('蓝')
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <Text className="text-xs font-medium">蓝色</Text>
                    </View>
                    <View
                      onClick={() => toggleColor('绿')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center ${
                        filterConditions.colors.includes('绿')
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      <Text className="text-xs font-medium">绿色</Text>
                    </View>
                  </View>
                </View>

                {/* 五行选择 */}
                <View>
                  <Text className="block text-sm font-medium mb-2 text-gray-700">五行（可多选）</Text>
                  <View className="grid grid-cols-5 gap-1.5">
                    {['金', '木', '水', '火', '土'].map(element => (
                      <View
                        key={element}
                        onClick={() => toggleElement(element)}
                        className={`rounded-lg px-2 py-1.5 text-center ${
                          filterConditions.elements.includes(element)
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        <Text className="text-xs font-medium">{element}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 大小选择 */}
                <View>
                  <Text className="block text-sm font-medium mb-2 text-gray-700">大小（可多选）</Text>
                  <View className="flex flex-row gap-2">
                    <View
                      onClick={() => toggleSize('小')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center ${
                        filterConditions.sizes.includes('小')
                          ? 'bg-orange-600 text-white'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      <Text className="text-xs font-medium">小数</Text>
                    </View>
                    <View
                      onClick={() => toggleSize('大')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center ${
                        filterConditions.sizes.includes('大')
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      <Text className="text-xs font-medium">大数</Text>
                    </View>
                  </View>
                </View>

                {/* 尾数选择 */}
                <View>
                  <Text className="block text-sm font-medium mb-2 text-gray-700">尾数（可多选）</Text>
                  <View className="grid grid-cols-5 gap-1.5">
                    {Array.from({ length: 10 }, (_, i) => i).map(tail => (
                      <View
                        key={tail}
                        onClick={() => toggleTail(tail)}
                        className={`rounded-lg px-2 py-1.5 text-center ${
                          filterConditions.tails.includes(tail)
                            ? 'bg-teal-600 text-white'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        <Text className="text-xs font-medium">{tail}尾</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 家禽野兽选择 */}
                <View>
                  <Text className="block text-sm font-medium mb-2 text-gray-700">家禽野兽（可多选）</Text>
                  <View className="flex flex-row gap-2">
                    <View
                      onClick={() => toggleAnimalType('家禽')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center ${
                        filterConditions.animalTypes.includes('家禽')
                          ? 'bg-yellow-600 text-white'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <Text className="text-xs font-medium">家禽</Text>
                    </View>
                    <View
                      onClick={() => toggleAnimalType('野兽')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center ${
                        filterConditions.animalTypes.includes('野兽')
                          ? 'bg-pink-600 text-white'
                          : 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      <Text className="text-xs font-medium">野兽</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 选号区 */}
        {activeTab === 'select' && (
          <View className="bg-white rounded-xl p-4">
            <Text className="block text-lg font-semibold mb-4 text-gray-800">选号</Text>
            <Text className="block text-sm text-gray-500 mb-4">手动选择您想要的号码组合</Text>
            
            <View className="space-y-2">
              {Array.from({ length: 7 }, (_, i) => i * 7).map(start => (
                <View key={start} className="flex flex-row justify-between items-center py-2">
                  {Array.from({ length: 7 }, (_, j) => start + j + 1).map(num => {
                    const attrs = getNumberAttributes(num)
                    return (
                      <View
                        key={num}
                        onClick={() => toggleNumber(num)}
                        className={`flex-1 flex flex-col items-center py-2 rounded-lg cursor-pointer ${
                          selectedNumbers.includes(num) ? 'bg-blue-600' : 'bg-gray-50'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          selectedNumbers.includes(num) ? 'text-white' : 'text-gray-700'
                        }`}
                        >
                          {attrs.formatted}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>

            <View className="mt-4 pt-4 border-t border-gray-200">
              <Text className="block text-base text-gray-700 mb-3">已选择 {selectedNumbers.length} 个号码</Text>
              <View className="flex flex-row gap-2">
                <View
                  className="flex-1 bg-red-500 text-white rounded-lg py-3 text-center"
                  onClick={clearSelection}
                >
                  <Text className="text-sm font-medium">清空选择</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default IndexPage
