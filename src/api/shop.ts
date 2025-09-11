import { http } from '@/http/alova'

export interface ISlideItem {
  id: number
  title: string
  image: string
  link?: string
  sort: number
  status: number
}

export interface INoticeInfo {
  id: number
  title: string
  content: string
  type: number
  status: number
  created_at: string
}

/** 获取轮播图列表 */
export function getSlidesAPI() {
  return http.Get<ISlideItem[]>('/api/v2/slide/getall', {
    meta: {
      domain: 'https://www.anahaimu.store',
      ignoreAuth: false
    }
  })
}

/** 获取公告信息 */
export function getNoticeAPI() {
  return http.Get<INoticeInfo>('/api/v2/notice/info', {
    meta: {
      domain: 'https://www.anahaimu.store',
      ignoreAuth: false
    }
  })
}

// Mock data for products (since no real API provided)
export interface IProduct {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  description?: string
  category: string
  sales: number
  colors?: string[]
  sizes?: string[]
}

export interface IOrder {
  id: string
  orderNo: string
  status: 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled'
  products: Array<{
    id: number
    name: string
    image: string
    price: number
    quantity: number
    color?: string
    size?: string
  }>
  totalAmount: number
  createTime: string
}

export interface IAddress {
  id: string
  name: string
  phone: string
  address: string
  isDefault: boolean
}

export interface IPickupItem {
  id: string
  name: string
  image: string
  status: 'pending' | 'completed'
  qrCode?: string
  pdfUrl?: string
}

// Mock API functions (replace with real APIs when available)
export function getProductsAPI(category?: string, keyword?: string) {
  // Mock implementation - replace with real API call
  const mockProducts: IProduct[] = [
    {
      id: 1,
      name: '无线蓝牙耳机',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      description: '降噪技术，高品质音响效果，续航48小时',
      category: '数码',
      sales: 1234,
      colors: ['白色', '黑色', '粉色']
    },
    {
      id: 2,
      name: '运动鞋',
      price: 599,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      description: '舒适透气设计',
      category: '服装',
      sales: 856,
      sizes: ['40', '41', '42', '43', '44']
    },
    {
      id: 3,
      name: '智能手表',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      description: '健康监测专家',
      category: '数码',
      sales: 432
    },
    {
      id: 4,
      name: '咖啡杯',
      price: 89,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
      description: '精致陶瓷材质',
      category: '家居',
      sales: 768
    }
  ]
  
  return Promise.resolve(mockProducts.filter(p => 
    (!category || category === '全部' || p.category === category) &&
    (!keyword || p.name.includes(keyword))
  ))
}

export function getOrdersAPI(status?: string) {
  const mockOrders: IOrder[] = [
    {
      id: '1',
      orderNo: '202408290001',
      status: 'pending',
      products: [{
        id: 1,
        name: '无线蓝牙耳机',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop',
        price: 299,
        quantity: 1,
        color: '白色'
      }],
      totalAmount: 299,
      createTime: '2024-08-29 10:30:00'
    },
    {
      id: '2',
      orderNo: '202408280002',
      status: 'completed',
      products: [{
        id: 2,
        name: '运动鞋',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop',
        price: 599,
        quantity: 1,
        size: '42'
      }],
      totalAmount: 599,
      createTime: '2024-08-28 15:20:00'
    }
  ]
  
  return Promise.resolve(mockOrders.filter(o => 
    !status || status === '全部' || o.status === status
  ))
}

export function getAddressesAPI() {
  const mockAddresses: IAddress[] = [
    {
      id: '1',
      name: '张三',
      phone: '138****8888',
      address: '北京市朝阳区望京街道科技园区A座1001室',
      isDefault: true
    },
    {
      id: '2',
      name: '李四',
      phone: '139****9999',
      address: '上海市浦东新区陆家嘴金融中心B座2002室',
      isDefault: false
    },
    {
      id: '3',
      name: '王五',
      phone: '137****7777',
      address: '广州市天河区珠江新城CBD中心大厦C座3003室',
      isDefault: false
    }
  ]
  
  return Promise.resolve(mockAddresses)
}

export function getPickupItemsAPI(status?: string) {
  const mockItems: IPickupItem[] = [
    {
      id: '1',
      name: '商品名称aaaaa',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
      status: 'pending',
      qrCode: 'PICKUP123456',
      pdfUrl: '/static/pickup-receipt.pdf'
    },
    {
      id: '2',
      name: '商品名称bbbbb',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
      status: 'completed'
    }
  ]
  
  return Promise.resolve(mockItems.filter(i => 
    !status || status === '全部' || i.status === status
  ))
}