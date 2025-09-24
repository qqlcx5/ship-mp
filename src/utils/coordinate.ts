// 坐标转换工具类
// 参考原项目的 WScoordinate.js

const PI = 3.1415926535897932384626
const A = 6378245.0 // 长半轴
const EE = 0.00669342162296594323 // 偏心率平方

/**
 * 判断是否在国内，不在国内不做偏移
 * @param lng 经度
 * @param lat 纬度
 * @returns 是否在国内
 */
function outOfChina(lng: number, lat: number): boolean {
  return (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271)
}

/**
 * 转换纬度
 * @param lng 经度
 * @param lat 纬度
 * @returns 转换后的纬度
 */
function transformLat(lng: number, lat: number): number {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
  return ret
}

/**
 * 转换经度
 * @param lng 经度
 * @param lat 纬度
 * @returns 转换后的经度
 */
function transformLng(lng: number, lat: number): number {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
  return ret
}

/**
 * WGS84转GCJ02(火星坐标系)
 * @param lng WGS84经度
 * @param lat WGS84纬度
 * @returns [GCJ02经度, GCJ02纬度]
 */
export function wgs84ToGcj02(lng: number, lat: number): [number, number] {
  if (outOfChina(lng, lat)) {
    return [lng, lat]
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLng(lng - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - EE * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI)
  dLng = (dLng * 180.0) / (A / sqrtMagic * Math.cos(radLat) * PI)
  const mgLat = lat + dLat
  const mgLng = lng + dLng
  return [mgLng, mgLat]
}

/**
 * GCJ02(火星坐标系)转WGS84
 * @param lng GCJ02经度
 * @param lat GCJ02纬度
 * @returns [WGS84经度, WGS84纬度]
 */
export function gcj02ToWgs84(lng: number, lat: number): [number, number] {
  if (outOfChina(lng, lat)) {
    return [lng, lat]
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLng(lng - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - EE * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI)
  dLng = (dLng * 180.0) / (A / sqrtMagic * Math.cos(radLat) * PI)
  const mgLat = lat - dLat
  const mgLng = lng - dLng
  return [mgLng, mgLat]
}

/**
 * GCJ02转BD09(百度坐标系)
 * @param lng GCJ02经度
 * @param lat GCJ02纬度
 * @returns [BD09经度, BD09纬度]
 */
export function gcj02ToBd09(lng: number, lat: number): [number, number] {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * PI * 3000.0 / 180.0)
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * PI * 3000.0 / 180.0)
  const bdLng = z * Math.cos(theta) + 0.0065
  const bdLat = z * Math.sin(theta) + 0.006
  return [bdLng, bdLat]
}

/**
 * BD09(百度坐标系)转GCJ02
 * @param lng BD09经度
 * @param lat BD09纬度
 * @returns [GCJ02经度, GCJ02纬度]
 */
export function bd09ToGcj02(lng: number, lat: number): [number, number] {
  const x = lng - 0.0065
  const y = lat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * PI * 3000.0 / 180.0)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI * 3000.0 / 180.0)
  const gcjLng = z * Math.cos(theta)
  const gcjLat = z * Math.sin(theta)
  return [gcjLng, gcjLat]
}

/**
 * WGS84转BD09
 * @param lng WGS84经度
 * @param lat WGS84纬度
 * @returns [BD09经度, BD09纬度]
 */
export function wgs84ToBd09(lng: number, lat: number): [number, number] {
  const gcj = wgs84ToGcj02(lng, lat)
  return gcj02ToBd09(gcj[0], gcj[1])
}

/**
 * BD09转WGS84
 * @param lng BD09经度
 * @param lat BD09纬度
 * @returns [WGS84经度, WGS84纬度]
 */
export function bd09ToWgs84(lng: number, lat: number): [number, number] {
  const gcj = bd09ToGcj02(lng, lat)
  return gcj02ToWgs84(gcj[0], gcj[1])
}

/**
 * 计算两点间距离（米）
 * @param lng1 点1经度
 * @param lat1 点1纬度
 * @param lng2 点2经度
 * @param lat2 点2纬度
 * @returns 距离（米）
 */
export function getDistance(lng1: number, lat1: number, lng2: number, lat2: number): number {
  const radLat1 = lat1 * PI / 180.0
  const radLng1 = lng1 * PI / 180.0
  const radLat2 = lat2 * PI / 180.0
  const radLng2 = lng2 * PI / 180.0
  const a = radLat1 - radLat2
  const b = radLng1 - radLng2
  const dis = 2 * Math.asin(Math.sqrt(
    Math.sin(a / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2.0) ** 2.0,
  )) * 6378137
  return dis
}
