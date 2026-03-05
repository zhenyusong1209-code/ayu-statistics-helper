export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '数字统计器' })
  : { navigationBarTitleText: '数字统计器' }
