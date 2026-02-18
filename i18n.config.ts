import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

export default {
  legacy: false,
  globalInjection: true,
  locale: 'zh-CN', // 默认语言：中文
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
}
