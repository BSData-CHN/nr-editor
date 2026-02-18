import { createI18n } from 'vue-i18n'
import zhCN from '~/locales/zh-CN.json'
import enUS from '~/locales/en-US.json'

export default defineNuxtPlugin(({ vueApp }) => {
  console.log('[i18n] 初始化 Vue I18n...')
  
  const i18n = createI18n({
    legacy: true, // 使用 legacy 模式以兼容 $t
    globalInjection: true,
    locale: 'zh-CN', // 默认语言：中文
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS
    },
    silentFallbackWarn: true,
    silentTranslationWarn: true
  })

  vueApp.use(i18n)

  // 兼容原有的 $t 全局函数
  globalThis.$t = (key: string, params?: Record<string, any>) => {
    const result = (i18n.global as any).t(key, params)
    console.log(`[i18n] $t("${key}") =`, result)
    return result
  }
  
  console.log('[i18n] 初始化完成，当前语言：zh-CN')
})
