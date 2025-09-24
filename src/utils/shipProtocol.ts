import { gcj02ToWgs84, wgs84ToGcj02 } from './coordinate'
import { crcCompute } from './crc'

// 指令队列项接口
interface IInstruction {
  sendBuffer: number[]
  crc: number
  retry: number
}

// 船舶通信协议类
class ShipProtocol {
  private instructions: IInstruction[] = []
  private power = [0, 0, 0, 0, 0] // 5艘船的功率
  private rudder = [0, 0, 0, 0, 0] // 5艘船的舵角
  private forceSetZPoint = [false, false, false, false, false] // 强制设置零点
  private enableManual = [true, true, true, true, true] // 手动模式启用
  private calibINS = [false, false, false, false, false] // 校准惯导
  private index = 0

  // 获取发送缓冲区
  getTxBuffer(shipId: number, power: number, rudder: number): number[] {
    const arr: number[] = []
    let setPower = true

    // 轮询发送逻辑
    switch (this.index++) {
      case 0:
      case 2:
      case 4:
      case 6:
      case 8:
        break
      case 1:
        shipId = 0
        setPower = false
        break
      case 3:
        shipId = 1
        setPower = false
        break
      case 5:
        shipId = 2
        setPower = false
        break
      case 7:
        shipId = 3
        setPower = false
        break
      case 9:
        shipId = 4
        setPower = false
        break
      default:
        this.index = 0
        break
    }

    // 如果有待发送指令且功率舵角未变化
    if (this.power[shipId] === power && this.rudder[shipId] === rudder && this.instructions.length > 0) {
      const instruction = this.instructions[0]
      for (let i = 0; i < instruction.sendBuffer.length; i++) {
        arr.push(instruction.sendBuffer[i])
      }
      const crc = crcCompute(arr, arr.length)
      arr.push(crc & 0xFF)
      arr.push((crc >> 8) & 0xFF)
      instruction.crc = crc

      if (instruction.retry++ > 5) {
        this.instructions.shift()
      }
    }
    else {
      // 限制功率和舵角范围
      if (rudder < -100)
        rudder = -100
      if (rudder > 100)
        rudder = 100
      if (power < -100)
        power = -100
      if (power > 100)
        power = 100

      if (setPower) {
        this.power[shipId] = power
        this.rudder[shipId] = rudder
      }

      arr.push(shipId) // 船舶ID
      arr.push(0) // 功能码
      arr.push(this.power[shipId]) // 功率
      arr.push(this.rudder[shipId]) // 舵角

      let flags = 0
      if (this.forceSetZPoint[shipId])
        flags |= 0x01
      if (this.enableManual[shipId])
        flags |= 0x02
      flags |= 0x04
      if (this.calibINS[shipId])
        flags |= 0x08

      this.forceSetZPoint[shipId] = false
      this.calibINS[shipId] = false

      arr.push(flags)

      const crc = crcCompute(arr, arr.length)
      arr.push(crc & 0xFF)
      arr.push((crc >> 8) & 0xFF)
    }

    return arr
  }

  // 添加航点
  addWaypoint(shipId: number, id: number, lng: number, lat: number) {
    const result = gcj02ToWgs84(lng, lat)
    const lng1 = Math.floor(result[0] * 1000000)
    const lat1 = Math.floor(result[1] * 1000000)

    const instruction: IInstruction = {
      sendBuffer: [
        shipId, // 船舶ID
        4, // 指令码
        id & 0xFF,
        (id >> 8) & 0xFF,
        lng1 & 0xFF,
        (lng1 >> 8) & 0xFF,
        (lng1 >> 16) & 0xFF,
        (lng1 >> 24) & 0xFF,
        lat1 & 0xFF,
        (lat1 >> 8) & 0xFF,
        (lat1 >> 16) & 0xFF,
        (lat1 >> 24) & 0xFF,
      ],
      crc: 0,
      retry: 0,
    }
    this.instructions.push(instruction)
  }

  // 开始更新航点
  startUpdateWaypoint(shipId: number) {
    const instruction: IInstruction = {
      sendBuffer: [
        shipId, // 船舶ID
        5, // 指令码
        0,
        0,
      ],
      crc: 0,
      retry: 0,
    }
    this.instructions.push(instruction)
  }

  // 更新航点
  updateWaypoint(shipId: number, id: number, lng: number, lat: number) {
    const result = gcj02ToWgs84(lng, lat)
    const lng1 = Math.floor(result[0] * 1000000)
    const lat1 = Math.floor(result[1] * 1000000)

    const instruction: IInstruction = {
      sendBuffer: [
        shipId, // 船舶ID
        6, // 指令码
        id & 0xFF,
        (id >> 8) & 0xFF,
        lng1 & 0xFF,
        (lng1 >> 8) & 0xFF,
        (lng1 >> 16) & 0xFF,
        (lng1 >> 24) & 0xFF,
        lat1 & 0xFF,
        (lat1 >> 8) & 0xFF,
        (lat1 >> 16) & 0xFF,
        (lat1 >> 24) & 0xFF,
      ],
      crc: 0,
      retry: 0,
    }
    this.instructions.push(instruction)
  }

  // 结束更新航点
  endUpdateWaypoint(shipId: number) {
    const instruction: IInstruction = {
      sendBuffer: [
        shipId, // 船舶ID
        7, // 指令码
        0,
        0,
      ],
      crc: 0,
      retry: 0,
    }
    this.instructions.push(instruction)
  }

  // 删除航点
  deleteWaypoint(shipId: number, id: number) {
    const instruction: IInstruction = {
      sendBuffer: [
        shipId, // 船舶ID
        8, // 指令码
        id & 0xFF,
        (id >> 8) & 0xFF,
      ],
      crc: 0,
      retry: 0,
    }
    this.instructions.push(instruction)
  }

  // 删除所有航点
  deleteAllWaypoints(shipId: number) {
    const instruction: IInstruction = {
      sendBuffer: [
        shipId, // 船舶ID
        9, // 指令码
        0,
        0,
      ],
      crc: 0,
      retry: 0,
    }
    this.instructions.push(instruction)
  }

  // 修改航点
  modifyWaypoint(shipId: number, id: number, lng: number, lat: number) {
    const result = gcj02ToWgs84(lng, lat)
    const lng1 = Math.floor(result[0] * 1000000)
    const lat1 = Math.floor(result[1] * 1000000)

    const instruction: IInstruction = {
      sendBuffer: [
        shipId, // 船舶ID
        11, // 指令码
        id & 0xFF,
        (id >> 8) & 0xFF,
        lng1 & 0xFF,
        (lng1 >> 8) & 0xFF,
        (lng1 >> 16) & 0xFF,
        (lng1 >> 24) & 0xFF,
        lat1 & 0xFF,
        (lat1 >> 8) & 0xFF,
        (lat1 >> 16) & 0xFF,
        (lat1 >> 24) & 0xFF,
      ],
      crc: 0,
      retry: 0,
    }
    this.instructions.push(instruction)
  }

  // 移除指令
  removeInstruction(shipId: number, cmd: number, crc: number) {
    if (this.instructions.length === 0)
      return

    const instruction = this.instructions[0]
    if (instruction.crc !== crc)
      return
    if (instruction.sendBuffer[0] !== shipId)
      return
    if (instruction.sendBuffer[1] !== cmd)
      return

    this.instructions.shift()
  }

  // 清空指令队列
  clearInstructions() {
    this.instructions = []
  }

  // 设置手动模式
  setEnableManual(shipId: number, enable: boolean) {
    this.enableManual[shipId] = enable
  }

  // 获取手动模式状态
  getEnableManual(shipId: number): boolean {
    return this.enableManual[shipId]
  }

  // 设置强制零点
  setForceSetZPoint(shipId: number) {
    this.forceSetZPoint[shipId] = true
  }

  // 设置校准惯导
  setCalibINS(shipId: number) {
    this.calibINS[shipId] = true
  }

  // 计算两点间距离（米）
  getRealDistance(lng1: number, lat1: number, lng2: number, lat2: number): number {
    const radLat1 = lat1 * Math.PI / 180.0
    const radLng1 = lng1 * Math.PI / 180.0
    const radLat2 = lat2 * Math.PI / 180.0
    const radLng2 = lng2 * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = radLng1 - radLng2
    const dis = 2 * Math.asin(Math.sqrt(
      Math.sin(a / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2.0) ** 2.0,
    )) * 6378137
    return dis
  }

  // 解析接收到的数据
  parseReceivedData(data: ArrayBuffer): any {
    if (data.byteLength < 5)
      return null

    const view = new DataView(data)
    const arr: number[] = []
    for (let i = 0; i < view.byteLength - 2; i++) {
      arr.push(view.getInt8(i))
    }

    const calcCrc = crcCompute(arr, arr.length)
    const recCrc = view.getInt16(view.byteLength - 2, false) & 0xFFFF
    if (calcCrc !== recCrc)
      return null

    const shipId = view.getUint8(0)
    const functionCode = view.getUint8(1)

    const result: any = {
      shipId,
      functionCode,
      status: {
        localOK: (view.getInt8(2) & 0x02) !== 0,
        remoteOK: (view.getInt8(2) & 0x04) !== 0,
        usvOnline: (view.getInt8(2) & 0x08) !== 0,
      },
    }

    switch (functionCode) {
      case 0: // 位置数据
        {
          const lat = view.getInt32(6, true) / 1000000.0
          const lng = view.getInt32(10, true) / 1000000.0
          const coords = wgs84ToGcj02(lng, lat)
          result.position = {
            latitude: coords[1],
            longitude: coords[0],
            rotate: view.getInt16(4, true) / 10.0,
          }
        }
        break
      case 1: // PLOS数据
        {
          const lat = view.getInt32(14, true) / 1000000.0
          const lng = view.getInt32(10, true) / 1000000.0
          const coords = wgs84ToGcj02(lng, lat)
          result.plos = {
            latitude: coords[1],
            longitude: coords[0],
          }
          result.batteryVoltage = view.getInt16(8, true) / 10.0
        }
        break
      case 2: // 功率数据
        {
          const lat = view.getInt32(14, true) / 1000000.0
          const lng = view.getInt32(10, true) / 1000000.0
          const coords = wgs84ToGcj02(lng, lat)
          result.plos = {
            latitude: coords[1],
            longitude: coords[0],
          }
          result.power = view.getInt16(8, true)
        }
        break
      case 3: // 速度数据
        {
          const lat = view.getInt32(14, true) / 1000000.0
          const lng = view.getInt32(10, true) / 1000000.0
          const coords = wgs84ToGcj02(lng, lat)
          result.plos = {
            latitude: coords[1],
            longitude: coords[0],
          }
          result.speedKnot = view.getInt16(4, true) / 10.0
          result.runningTime = view.getInt16(8, true)
        }
        break
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        // 指令确认
        this.removeInstruction(shipId, functionCode, view.getInt16(4))
        break
      case 0xFF: // 特殊指令
        result.specialCommand = {
          subCommand: view.getUint8(2),
        }
        if (view.getUint8(2) === 6) {
          // 航点更新
          const lng = view.getInt32(7) / 1000000.0
          const lat = view.getInt32(11) / 1000000.0
          const coords = wgs84ToGcj02(lng, lat)
          result.waypoint = {
            id: view.getInt16(5),
            latitude: coords[1],
            longitude: coords[0],
          }
        }
        break
    }

    return result
  }
}

// 导出单例
export const shipProtocol = new ShipProtocol()
