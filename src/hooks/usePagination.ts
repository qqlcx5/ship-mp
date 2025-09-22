import { ref, unref, watch } from 'vue'

interface PaginationOptions<T> {
  api: (params: any) => Promise<T[]>
  initialParams?: any
}

export function usePagination<T>(options: PaginationOptions<T>) {
  const { api, initialParams = {} } = options
  const paging = ref<any | null>(null)
  console.log(`🚀 - usePagination - paging:`, paging)

  const query = async (pageNo: number, pageSize: number) => {
    console.log(`🚀 - query - pageNo: number, pageSize: number:`, pageNo, pageSize)
    try {
      const params = {
        ...unref(initialParams),
        page: pageNo,
        limit: pageSize,
      }
      const res = await api(params)
      // @ts-expect-error 数组 或者 对象数组
      const data = Array.isArray(res) ? res : res?.list || []
      paging.value?.complete(data)
    }
    catch (err) {
      console.error(err)
      paging.value?.complete(false)
    }
  }

  const reload = () => {
    paging.value?.reload()
  }

  watch(
    () => unref(initialParams),
    () => {
      reload()
    },
    { deep: true },
  )

  return {
    paging,
    query,
    reload,
  }
}
