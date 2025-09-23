import type { MaybeRef } from 'vue'
import { reactive, unref } from 'vue'

interface ShareOptions {
  title: MaybeRef<string>
  path: MaybeRef<string>
  imageUrl?: MaybeRef<string | undefined>
  query?: MaybeRef<string | undefined>
}

/**
 * 微信分享 - 返回一个包含分享参数的对象
 * @param {ShareOptions} options - 分享参数
 */
export function useShare(options: ShareOptions) {
  const shareOptions = reactive({
    title: unref(options.title),
    path: unref(options.path),
    imageUrl: unref(options.imageUrl),
    query: unref(options.query),
  })

  return {
    shareOptions,
  }
}
