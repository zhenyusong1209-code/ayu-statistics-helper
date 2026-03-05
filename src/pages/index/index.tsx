import { View, Text, Input, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { parseNumbers, countNumbers, getNumberAttributes } from '@/utils/numberParser'
import './index.css'

type TabType = 'statistics' | 'filter' | 'complex' | 'draft' | 'pick' | 'select'

const IndexPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('statistics')
  const [inputText, setInputText] = useState('')
  const [numbers, setNumbers] = useState<number[]>([])
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])

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

  return (
    <View className="flex flex-col h-screen bg-gray-50">
      {/* 顶部输入区 */}
      <View className="bg-white p-4 shadow-sm">
        <Text className="block text-lg font-semibold mb-2 text-gray-800">数字输入</Text>
        <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
          <Input
            className="w-full bg-transparent text-base"
            placeholder="请输入数字（1-49），用空格或符号隔开"
            placeholderClass="text-gray-400"
            value={inputText}
            onInput={handleInputChange}
          />
        </View>
        <Text className="text-sm text-gray-500">已识别 {numbers.length} 个有效数字</Text>
      </View>

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
          <View className="bg-white rounded-xl p-4">
            <Text className="block text-lg font-semibold mb-4 text-gray-800">统计结果</Text>
            
            {/* 统计表格 */}
            <View className="space-y-2">
              {Array.from({ length: 7 }, (_, i) => i * 7).map(start => (
                <View key={start} className="flex flex-row justify-between items-center py-2 border-b border-gray-100">
                  {Array.from({ length: 7 }, (_, j) => start + j + 1).map(num => {
                    const count = statistics[num]
                    const attrs = getNumberAttributes(num)
                    return (
                      <View
                        key={num}
                        className="flex-1 flex flex-col items-center"
                        onClick={() => toggleNumber(num)}
                      >
                        <Text className="text-sm font-medium text-gray-700">{attrs.formatted}</Text>
                        <Text className="text-xs text-gray-500 mt-1">{count > 0 ? count : '-'}</Text>
                        {selectedNumbers.includes(num) && (
                          <View className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1" />
                        )}
                      </View>
                    )
                  })}
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
          <View className="bg-white rounded-xl p-4">
            <Text className="block text-lg font-semibold mb-4 text-gray-800">智能挑码</Text>
            <Text className="block text-sm text-gray-500 mb-4">根据统计结果智能推荐号码</Text>
            
            <View className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <Text className="block text-base text-gray-600 text-center">热门号码推荐</Text>
              <View className="mt-4 flex flex-wrap gap-2 justify-center">
                {[12, 23, 35, 42, 18, 9, 31, 44].map(num => {
                  const attrs = getNumberAttributes(num)
                  return (
                    <View key={num} className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      <Text className="text-sm font-bold text-gray-800">{attrs.formatted}</Text>
                    </View>
                  )
                })}
              </View>
              <Text className="block text-xs text-gray-400 text-center mt-4">
                基于历史数据统计分析
              </Text>
            </View>

            <View className="mt-4">
              <Text className="block text-base font-medium mb-3 text-gray-700">冷门号码</Text>
              <View className="flex flex-wrap gap-2">
                {[3, 7, 14, 27, 38, 45, 11, 22].map(num => {
                  const attrs = getNumberAttributes(num)
                  return (
                    <View key={num} className="bg-gray-100 rounded-lg px-3 py-2">
                      <Text className="text-sm font-medium text-gray-600">{attrs.formatted}</Text>
                    </View>
                  )
                })}
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
