// 加速度计工具类
// 用于手机倾斜控制船舶舵角

export interface IAccelerometerData {
  x: number
  y: number
  z: number
}

export interface IAccelerometerCallbacks {
  onAccelerometerChange?: (rudder: number) => void
}

class AccelerometerManager {
  private callbacks: IAccelerometerCallbacks = {}
  private isListening = false
  private lastRudder = 0

  // 设置回调函数
  setCallbacks(callbacks: IAccelerometerCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  // 开始监听加速度计
  startAccelerometer() {
    if (this.isListening) {
      return
    }

    this.isListening = true

    uni.onAccelerometerChange((res) => {
      const rudder = this.calculateRudder(res.y)

      // 只有变化超过阈值才触发回调
      if (Math.abs(rudder - this.lastRudder) > 2) {
        this.lastRudder = rudder
        this.callbacks.onAccelerometerChange?.(rudder)
      }
    })

    uni.startAccelerometer({
      interval: 'normal', // 监听频率，有 game、ui、normal 之分
      success: () => {
        console.log('加速度计启动成功')
      },
      fail: (err) => {
        console.error('加速度计启动失败:', err)
        this.isListening = false
      },
    })
  }

  // 停止监听加速度计
  stopAccelerometer() {
    if (!this.isListening) {
      return
    }

    this.isListening = false

    uni.stopAccelerometer({
      success: () => {
        console.log('加速度计停止成功')
      },
      fail: (err) => {
        console.error('加速度计停止失败:', err)
      },
    })
  }

  // 根据加速度计Y轴数据计算舵角
  private calculateRudder(yValue: number): number {
    // 将加速度计数据转换为舵角
    // yValue 范围大约是 -1 到 1
    // 舵角范围是 -100 到 100

    let result = 0
    const value = yValue * 100

    // 设置死区，避免小幅抖动
    if (value < -15 || value > 15) {
      result = value
    }

    // 调整死区
    if (result < 0) {
      result = result + 15
    }
    else if (result > 0) {
      result = result - 15
    }

    // 放大系数并取反（因为舵角方向相反）
    result = -(result * 3)

    // 限制范围
    if (result < -100)
      result = -100
    if (result > 100)
      result = 100

    return Math.round(result)
  }

  // 获取监听状态
  get isActive(): boolean {
    return this.isListening
  }
}

// 导出单例
export const accelerometerManager = new AccelerometerManager()
