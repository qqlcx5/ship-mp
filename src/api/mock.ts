// Mock 数据接口

export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  sales: number
  specs?: Array<{
    name: string
    options: string[]
    selected: string
  }>
}

export interface Order {
  id: string
  status: 'pending' | 'shipping' | 'completed' | 'cancelled'
  statusText: string
  statusColor: string
  items: Array<{
    id: number
    name: string
    image: string
    spec: string
    price: number
    quantity: number
  }>
  totalAmount: number
  createTime: string
}

export interface Address {
  id: number
  name: string
  phone: string
  address: string
  isDefault: boolean
}

export interface Pickup {
  id: number
  name: string
  image: string
  status: 'pending' | 'completed'
  statusText: string
  statusColor: string
  pickupCode: string
  location: string
  createTime: string
  items?: Array<{
    name: string
    image: string
  }>
  documents?: Array<{
    name: string
    size: string
    url: string
  }>
  expireTime?: string
}

// Mock 数据
export const mockProducts: Product[] = [
  {
    id: 1,
    name: '无线蓝牙耳机',
    description: '高品质音响效果，降噪技术，续航48小时',
    price: 299.00,
    originalPrice: 399.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop'
    ],
    category: 'digital',
    sales: 1234,
    specs: [
      { name: '颜色', options: ['白色', '黑色', '粉色'], selected: '白色' }
    ]
  },
  {
    id: 2,
    name: '运动鞋',
    description: '舒适透气设计，适合各种运动场景',
    price: 599.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop',
    category: 'clothing',
    sales: 856
  },
  {
    id: 3,
    name: '智能手表',
    description: '健康监测专家，全天候陪伴',
    price: 1299.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop',
    category: 'digital',
    sales: 432
  },
  {
    id: 4,
    name: '咖啡杯',
    description: '精致陶瓷材质，品味生活',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&h=150&fit=crop',
    category: 'home',
    sales: 678
  }
]

export const mockOrders: Order[] = [
  {
    id: '202408290001',
    status: 'pending',
    statusText: '待付款',
    statusColor: '#f59e0b',
    items: [
      {
        id: 1,
        name: '无线蓝牙耳机',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop',
        spec: '颜色：白色',
        price: 299.00,
        quantity: 1
      }
    ],
    totalAmount: 299.00,
    createTime: '2024-08-29 10:30:00'
  },
  {
    id: '202408280002',
    status: 'completed',
    statusText: '已完成',
    statusColor: '#10b981',
    items: [
      {
        id: 2,
        name: '运动鞋',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop',
        spec: '尺码：42',
        price: 599.00,
        quantity: 1
      }
    ],
    totalAmount: 599.00,
    createTime: '2024-08-28 14:20:00'
  }
]

export const mockAddresses: Address[] = [
  {
    id: 1,
    name: '张三',
    phone: '138****8888',
    address: '北京市朝阳区望京街道科技园区A座1001室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****9999',
    address: '上海市浦东新区陆家嘴金融中心B座2002室',
    isDefault: false
  },
  {
    id: 3,
    name: '王五',
    phone: '137****7777',
    address: '广州市天河区珠江新城CBD中心大厦C座3003室',
    isDefault: false
  }
]

export const mockPickups: Pickup[] = [
  {
    id: 1,
    name: '商品名称A',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
    status: 'pending',
    statusText: '待取件',
    statusColor: '#f59e0b',
    pickupCode: 'PK001',
    location: '快递柜A-01',
    createTime: '2024-08-29 10:30:00',
    items: [
      {
        name: '商品名称a',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop'
      },
      {
        name: '商品名称b',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop'
      }
    ],
    documents: [
      {
        name: '取件凭证.pdf',
        size: '245 KB',
        url: '#'
      }
    ],
    expireTime: '2024-09-05 23:59:59'
  },
  {
    id: 2,
    name: '商品名称B',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
    status: 'completed',
    statusText: '已取件',
    statusColor: '#10b981',
    pickupCode: 'PK002',
    location: '快递柜B-05',
    createTime: '2024-08-28 14:20:00'
  }
]

// Mock API 函数
export const mockApi = {
  // 商品相关
  getProducts: (category?: string, keyword?: string): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = mockProducts
        if (category && category !== 'all') {
          result = result.filter(p => p.category === category)
        }
        if (keyword) {
          result = result.filter(p =>
            p.name.includes(keyword) || p.description.includes(keyword)
          )
        }
        resolve(result)
      }, 500)
    })
  },

  getProductDetail: (id: number): Promise<Product | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id)
        resolve(product || null)
      }, 300)
    })
  },

  // 订单相关
  getOrders: (status?: string): Promise<Order[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = mockOrders
        if (status && status !== 'all') {
          result = result.filter(o => o.status === status)
        }
        resolve(result)
      }, 500)
    })
  },

  // 地址相关
  getAddresses: (): Promise<Address[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAddresses)
      }, 300)
    })
  },

  // 取件相关
  getPickups: (status?: string): Promise<Pickup[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = mockPickups
        if (status && status !== 'all') {
          result = result.filter(p => p.status === status)
        }
        resolve(result)
      }, 500)
    })
  },

  getPickupDetail: (id: number): Promise<Pickup | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pickup = mockPickups.find(p => p.id === id)
        resolve(pickup || null)
      }, 300)
    })
  }
}
