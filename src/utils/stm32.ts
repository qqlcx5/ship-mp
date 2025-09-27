// miniprogram-usv/miniprogram/utils/STM32Com.js 适配到 TypeScript
// 假设 app.globalData.ships 存在于 Pinia store 中

import { useShipStore } from '../store/ship';

let TxBuf = new Uint8Array(20);
let RxBuf = new Uint8Array(20);
let RxLen = 0;
let RxCheckSum = 0;
let RxState = 0;
let RxCount = 0;

export function GetTxBuf(id: number, power: number, rudder: number): Uint8Array {
  const shipStore = useShipStore();
  TxBuf = 0x2C;
  TxBuf = 0x12;
  TxBuf = id;
  TxBuf = shipStore.ships[id].EnableManual ? 0 : 1; // EnableManual
  TxBuf = power;
  TxBuf = rudder;
  TxBuf = shipStore.ships[id].ForceSetZPoint ? 1 : 0; // ForceSetZPoint
  TxBuf = shipStore.ships[id].CalibINS ? 1 : 0; // CalibINS
  TxBuf = shipStore.ships[id].Observe ? 1 : 0; // Observe
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  return TxBuf;
}

export function GetEnableManual(id: number): boolean {
  const shipStore = useShipStore();
  return shipStore.ships[id].EnableManual;
}

export function SetEnableManual(id: number, enable: boolean) {
  const shipStore = useShipStore();
  shipStore.ships[id].EnableManual = enable;
}

export function SetForceSetZPoint(id: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].ForceSetZPoint = true;
}

export function SetCalibINS(id: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].CalibINS = true;
}

export function StartUpdateWayPoint(id: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].Observe = false;
  TxBuf = 0x2C;
  TxBuf = 0x12;
  TxBuf = id;
  TxBuf = 0xff;
  TxBuf = 0x05;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
}

export function UpdateWayPoint(id: number, pointid: number, lng: number, lat: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].Observe = false;
  TxBuf = 0x2C;
  TxBuf = 0x12;
  TxBuf = id;
  TxBuf = 0xff;
  TxBuf = 0x06;
  TxBuf = pointid & 0xff;
  TxBuf = (pointid >> 8) & 0xff;
  TxBuf = (lng * 1000000) & 0xff;
  TxBuf = ((lng * 1000000) >> 8) & 0xff;
  TxBuf = ((lng * 1000000) >> 16) & 0xff;
  TxBuf = ((lng * 1000000) >> 24) & 0xff;
  TxBuf = (lat * 1000000) & 0xff;
  TxBuf = ((lat * 1000000) >> 8) & 0xff;
  TxBuf = ((lat * 1000000) >> 16) & 0xff;
  TxBuf = ((lat * 1000000) >> 24) & 0xff;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
}

export function EndUpdateWayPoint(id: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].Observe = false;
  TxBuf = 0x2C;
  TxBuf = 0x12;
  TxBuf = id;
  TxBuf = 0xff;
  TxBuf = 0x07;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
}

export function AddWayPoint(id: number, pointid: number, lng: number, lat: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].Observe = false;
  TxBuf = 0x2C;
  TxBuf = 0x12;
  TxBuf = id;
  TxBuf = 0x04;
  TxBuf = pointid & 0xff;
  TxBuf = (pointid >> 8) & 0xff;
  TxBuf = (lng * 1000000) & 0xff;
  TxBuf = ((lng * 1000000) >> 8) & 0xff;
  TxBuf = ((lng * 1000000) >> 16) & 0xff;
  TxBuf = ((lng * 1000000) >> 24) & 0xff;
  TxBuf = (lat * 1000000) & 0xff;
  TxBuf = ((lat * 1000000) >> 8) & 0xff;
  TxBuf = ((lat * 1000000) >> 16) & 0xff;
  TxBuf = ((lat * 1000000) >> 24) & 0xff;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
}

export function ModifyWayPoint(id: number, pointid: number, lng: number, lat: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].Observe = false;
  TxBuf = 0x2C;
  TxBuf = 0x12;
  TxBuf = id;
  TxBuf = 0x05;
  TxBuf = pointid & 0xff;
  TxBuf = (pointid >> 8) & 0xff;
  TxBuf = (lng * 1000000) & 0xff;
  TxBuf = ((lng * 1000000) >> 8) & 0xff;
  TxBuf = ((lng * 1000000) >> 16) & 0xff;
  TxBuf = ((lng * 1000000) >> 24) & 0xff;
  TxBuf = (lat * 1000000) & 0xff;
  TxBuf = ((lat * 1000000) >> 8) & 0xff;
  TxBuf = ((lat * 1000000) >> 16) & 0xff;
  TxBuf = ((lat * 1000000) >> 24) & 0xff;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
}

export function DeleteWayPoint(id: number, pointid: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].Observe = false;
  TxBuf = 0x2C;
  TxBuf = 0x12;
  TxBuf = id;
  TxBuf = 0x06;
  TxBuf = pointid & 0xff;
  TxBuf = (pointid >> 8) & 0xff;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
}

export function DeleteAllWayPoint(id: number) {
  const shipStore = useShipStore();
  shipStore.ships[id].Observe = false;
  TxBuf = 0x2C;
  TxBuf = 0x12;
  TxBuf = id;
  TxBuf = 0x07;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
  TxBuf = 0;
}

export function ClearInstructions() {
  const shipStore = useShipStore();
  for (let i = 0; i < shipStore.ships.length; i++) {
    shipStore.ships[i].Observe = false;
  }
}

export function RemoveInstruction(id: number, cmd: number, data: number) {
  // This function's logic is not fully clear from the original JS.
  // Assuming it's for removing specific instructions based on cmd and data.
  // For now, it will be a placeholder.
  console.log(`RemoveInstruction called for ship ${id}, cmd ${cmd}, data ${data}`);
}

export function GetRealDistance(lng1: number, lat1: number, lng2: number, lat2: number): number {
  const shipStore = useShipStore();
  // Assuming getDistance is available in coordinate.ts
  return shipStore.getDistance(lng1, lat1, lng2, lat2);
}