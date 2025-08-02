<script setup lang="ts">
import { ref } from 'vue'
import BottomMenu from '@/components/BottomMenu.vue'
import ManagementModal from '@/components/ManagementModal.vue'

interface Ship {
  id: string
  name: string
  type: string
  status: 'online' | 'warning' | 'offline' | 'maintenance'
  location: string
  battery: number
  speed: number
}

interface Personnel {
  id: string
  name: string
  role: string
  department: string
  status: 'online' | 'busy' | 'offline'
  phone: string
  email: string
}

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  deadline: string
  priority: 'high' | 'medium' | 'low'
  progress: number
  status: 'pending' | 'in-progress' | 'completed'
}

const showModal = ref(false)
const modalType = ref('')
const modalData = ref(null)

const totalShips = ref(6)
const totalPersonnel = ref(8)
const activeTasks = ref(5)

const ships = ref<Ship[]>([
  {
    id: '001',
    name: '海巡001',
    type: '巡逻艇',
    status: 'online',
    location: '福建海域A区',
    battery: 85,
    speed: 8.5,
  },
  {
    id: '002',
    name: '海巡002',
    type: '救援船',
    status: 'warning',
    location: '福建海域B区',
    battery: 45,
    speed: 6.2,
  },
  {
    id: '003',
    name: '海巡003',
    type: '监测船',
    status: 'maintenance',
    location: '港口维修区',
    battery: 0,
    speed: 0,
  },
  {
    id: '004',
    name: '海巡004',
    type: '运输船',
    status: 'online',
    location: '福建海域C区',
    battery: 92,
    speed: 12.3,
  },
  {
    id: '005',
    name: '海巡005',
    type: '科研船',
    status: 'offline',
    location: '港口停泊区',
    battery: 68,
    speed: 0,
  },
  {
    id: '006',
    name: '海巡006',
    type: '执法船',
    status: 'online',
    location: '福建海域D区',
    battery: 78,
    speed: 15.8,
  }
])

const personnel = ref<Personnel[]>([
  {
    id: '001',
    name: '张船长',
    role: '总船长',
    department: '指挥部',
    status: 'online',
    phone: '13800138001',
    email: 'captain@ship.com',
  },
  {
    id: '002',
    name: '李工程师',
    role: '技术工程师',
    department: '技术部',
    status: 'busy',
    phone: '13800138002',
    email: 'engineer@ship.com',
  },
  {
    id: '003',
    name: '王操作员',
    role: '操作员',
    department: '操作部',
    status: 'offline',
    phone: '13800138003',
    email: 'operator@ship.com',
  },
  {
    id: '004',
    name: '陈副船长',
    role: '副船长',
    department: '指挥部',
    status: 'online',
    phone: '13800138004',
    email: 'vice.captain@ship.com',
  },
  {
    id: '005',
    name: '刘维修师',
    role: '维修技师',
    department: '维修部',
    status: 'busy',
    phone: '13800138005',
    email: 'maintenance@ship.com',
  },
  {
    id: '006',
    name: '赵调度员',
    role: '调度员',
    department: '调度中心',
    status: 'online',
    phone: '13800138006',
    email: 'dispatcher@ship.com',
  },
  {
    id: '007',
    name: '孙安全员',
    role: '安全员',
    department: '安全部',
    status: 'online',
    phone: '13800138007',
    email: 'safety@ship.com',
  },
  {
    id: '008',
    name: '周通信员',
    role: '通信员',
    department: '通信部',
    status: 'busy',
    phone: '13800138008',
    email: 'operator@ship.com',
  },
])

const tasks = ref<Task[]>([
  {
    id: '001',
    title: '海域巡逻任务',
    description: '对福建海域进行例行巡逻检查',
    assignee: '张船长',
    deadline: '2024-01-15',
    priority: 'high',
    progress: 75,
    status: 'in-progress',
  },
  {
    id: '002',
    title: '设备维护检查',
    description: '对船只设备进行定期维护和检查',
    assignee: '李工程师',
    deadline: '2024-01-20',
    priority: 'medium',
    progress: 30,
    status: 'in-progress',
  },
  {
    id: '003',
    title: '人员培训计划',
    description: '组织新员工安全操作培训',
    assignee: '王操作员',
    deadline: '2024-01-25',
    priority: 'low',
    progress: 10,
    status: 'pending',
  },
])


function getShipStatusText(status: string) {
  switch (status) {
    case 'online':
      return '在线'
    case 'warning':
      return '警告'
    case 'offline':
      return '离线'
    case 'maintenance':
      return '维修'
    default:
      return '未知'
  }
}

function getPersonnelStatusText(status: string) {
  switch (status) {
    case 'online':
      return '在线'
    case 'busy':
      return '忙碌'
    case 'offline':
      return '离线'
    default:
      return '未知'
  }
}

function getPriorityText(priority: string) {
  switch (priority) {
    case 'high':
      return '高优先级'
    case 'medium':
      return '中优先级'
    case 'low':
      return '低优先级'
    default:
      return '未知'
  }
}

function handleAddShip() {
  modalType.value = 'ship'
  modalData.value = null
  showModal.value = true
}

function handleShipClick(ship: Ship) {
  modalType.value = 'ship'
  modalData.value = ship
  showModal.value = true
}

function handleShipControl(ship: Ship) {
  uni.navigateTo({
    url: `/pages/manual/manual?shipId=${ship.id}`,
  })
}

function handleShipSettings(ship: Ship) {
  uni.showActionSheet({
    itemList: ['查看详情', '远程控制', '维护记录', '删除船只'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          handleShipClick(ship)
          break
        case 1:
          handleShipControl(ship)
          break
        case 2:
          uni.showToast({ title: '维护记录', icon: 'none' })
          break
        case 3:
          handleDeleteShip(ship)
          break
      }
    },
  })
}

function handleDeleteShip(ship: Ship) {
  uni.showModal({
    title: '删除确认',
    content: `确定要删除船只"${ship.name}"吗？`,
    success: (res) => {
      if (res.confirm) {
        const index = ships.value.findIndex(s => s.id === ship.id)
        if (index >= 0) {
          ships.value.splice(index, 1)
          totalShips.value--
          uni.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    },
  })
}

function handleAddPersonnel() {
  modalType.value = 'personnel'
  modalData.value = null
  showModal.value = true
}

function handlePersonnelClick(person: Personnel) {
  modalType.value = 'personnel'
  modalData.value = person
  showModal.value = true
}

function handleCall(person: Personnel) {
  uni.makePhoneCall({
    phoneNumber: person.phone,
  })
}

function handleMessage(person: Personnel) {
  uni.showToast({
    title: `发送消息给${person.name}`,
    icon: 'none',
  })
}

function handleAddTask() {
  modalType.value = 'task'
  modalData.value = null
  showModal.value = true
}

function handleTaskClick(task: Task) {
  modalType.value = 'task'
  modalData.value = task
  showModal.value = true
}

function handleModalSave(data: any) {
  // 处理保存逻辑
  showModal.value = false
  uni.showToast({
    title: '保存成功',
    icon: 'success',
  })
}

function handleTabChange(tab: string) {
  switch (tab) {
    case 'dashboard':
      uni.navigateTo({ url: '/pages/dashboard/dashboard' })
      break
    case 'manual':
      uni.navigateTo({ url: '/pages/manual/manual' })
      break
    case 'cruise':
      uni.navigateTo({ url: '/pages/cruise/cruise' })
      break
    case 'ai':
      uni.navigateTo({ url: '/pages/ai/ai' })
      break
  }
}
</script>

<template>
  <view class="management-container">
    <!-- 顶部状态栏 -->
    <view class="management-header">
      <view class="header-left">
        <view class="title-section">
          <text class="management-icon">⚙️</text>
          <text class="title">综合管理中心</text>
        </view>
        <view class="system-status">
          <view class="status-dot" />
          <text class="status-text">系统正常</text>
        </view>
      </view>

      <view class="management-summary">
        <text class="summary-text">船只: </text>
        <text class="accent-text">{{ totalShips }}艘</text>
        <text class="summary-separator">|</text>
        <text class="summary-text">人员: </text>
        <text class="accent-text">{{ totalPersonnel }}人</text>
        <text class="summary-separator">|</text>
        <text class="summary-text">任务: </text>
        <text class="accent-text">{{ activeTasks }}个</text>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-area" scroll-y>
      <view class="management-content">
        <!-- 并排布局容器 -->
        <view class="dual-panel-container">
          <!-- 船只管理面板 -->
          <view class="management-panel ships-panel">
            <view class="panel-header">
              <text class="panel-icon">🚢</text>
              <text class="panel-title">船只管理</text>
              <text class="panel-count">{{ totalShips }}艘</text>
              <button class="add-btn" @click="handleAddShip">
                <text class="add-icon">+</text>
              </button>
            </view>
            <view class="ships-compact-list">
              <view
                v-for="ship in ships"
                :key="ship.id"
                class="ship-compact-card"
                :class="ship.status"
                @click="handleShipClick(ship)"
              >
                <view class="ship-basic-info">
                  <view class="ship-header">
                    <text class="ship-name">{{ ship.name }}</text>
                    <view class="status-indicator" :class="ship.status" />
                  </view>
                  <text class="ship-type">{{ ship.type }}</text>
                  <text class="ship-location">{{ ship.location }}</text>
                </view>
                <view class="ship-metrics">
                  <view class="metric-item">
                    <text class="metric-label">电量</text>
                    <text class="metric-value">{{ ship.battery }}%</text>
                  </view>
                  <view class="metric-item">
                    <text class="metric-label">航速</text>
                    <text class="metric-value">{{ ship.speed }}节</text>
                  </view>
                </view>
                <view class="ship-actions">
                  <button class="action-btn control" @click.stop="handleShipControl(ship)">
                    <text class="action-icon">🎮</text>
                  </button>
                  <button class="action-btn settings" @click.stop="handleShipSettings(ship)">
                    <text class="action-icon">⚙️</text>
                  </button>
                </view>
              </view>
            </view>
          </view>

          <!-- 人员管理面板 -->
          <view class="management-panel personnel-panel">
            <view class="panel-header">
              <text class="panel-icon">👥</text>
              <text class="panel-title">人员管理</text>
              <text class="panel-count">{{ totalPersonnel }}人</text>
              <button class="add-btn" @click="handleAddPersonnel">
                <text class="add-icon">+</text>
              </button>
            </view>
            <view class="personnel-compact-list">
              <view
                v-for="person in personnel"
                :key="person.id"
                class="personnel-compact-card"
                @click="handlePersonnelClick(person)"
              >
                <view class="personnel-basic-info">
                  <view class="avatar-small">
                    <text class="avatar-text">{{ person.name.charAt(0) }}</text>
                  </view>
                  <view class="person-details">
                    <view class="person-header">
                      <text class="person-name">{{ person.name }}</text>
                      <view class="status-indicator" :class="person.status" />
                    </view>
                    <text class="person-role">{{ person.role }}</text>
                    <text class="person-department">{{ person.department }}</text>
                  </view>
                </view>
                <view class="contact-actions">
                  <button class="contact-btn call" @click.stop="handleCall(person)">
                    <text class="contact-icon">📞</text>
                  </button>
                  <button class="contact-btn message" @click.stop="handleMessage(person)">
                    <text class="contact-icon">💬</text>
                  </button>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 任务管理 -->
        <view class="tasks-section">
          <view class="section-title">
            <text class="title-icon">📋</text>
            <text class="title-text">任务管理</text>
            <button class="add-btn" @click="handleAddTask">
              <text class="add-icon">+</text>
            </button>
          </view>
          <view class="tasks-list">
            <view
              v-for="task in tasks"
              :key="task.id"
              class="task-card"
              :class="task.priority"
              @click="handleTaskClick(task)"
            >
              <view class="task-header">
                <text class="task-title">{{ task.title }}</text>
                <view class="priority-badge" :class="task.priority">
                  {{ getPriorityText(task.priority) }}
                </view>
              </view>
              <text class="task-description">{{ task.description }}</text>
              <view class="task-meta">
                <text class="task-assignee">负责人: {{ task.assignee }}</text>
                <text class="task-deadline">截止: {{ task.deadline }}</text>
              </view>
              <view class="task-progress">
                <text class="progress-label">进度: {{ task.progress }}%</text>
                <view class="progress-bar">
                  <view class="progress-fill" :style="{ width: `${task.progress}%` }" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部菜单栏 -->
    <BottomMenu
      active-tab="management"
      @tab-change="handleTabChange"
    />

    <!-- 详情弹窗 -->
    <ManagementModal
      v-if="showModal"
      :type="modalType"
      :data="modalData"
      @close="showModal = false"
      @save="handleModalSave"
    />
  </view>
</template>

<style lang="scss" scoped>
.management-container {
  width: 100vw;
  height: 100vh;
  background:
    linear-gradient(rgba(11, 20, 38, 0.85), rgba(26, 54, 93, 0.85)),
    url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=800&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}

.management-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 140rpx;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20rpx);
  padding: 16rpx 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .back-icon {
    color: white;
    font-size: 32rpx;
  }
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16rpx;

  .management-icon {
    color: #4fd1c7;
    font-size: 32rpx;
  }

  .title {
    color: white;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.system-status {
  display: flex;
  align-items: center;
  gap: 12rpx;

  .status-dot {
    width: 16rpx;
    height: 16rpx;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .status-text {
    color: #10b981;
    font-size: 24rpx;
  }
}

.management-summary {
  color: white;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;

  .summary-text {
    color: white;
  }

  .accent-text {
    color: #4fd1c7;
    font-weight: 600;
  }

  .summary-separator {
    color: rgba(255, 255, 255, 0.5);
  }
}

.content-area {
  position: absolute;
  top: 140rpx;
  left: 0;
  right: 0;
  bottom: 104rpx;
  // padding: 32rpx;
}

.management-content {
  padding: 32rpx;
  height: 100%;
}

/* 并排布局容器 */
.dual-panel-container {
  display: flex;
  gap: 24rpx;
  height: 100%;
}

.management-panel {
  flex: 1;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
  background: rgba(79, 209, 199, 0.05);
}

.panel-icon {
  font-size: 32rpx;
  color: #4fd1c7;
  margin-right: 16rpx;
}

.panel-title {
  font-size: 28rpx;
  font-weight: 600;
  color: white;
  flex: 1;
}

.panel-count {
  font-size: 24rpx;
  color: #4fd1c7;
  font-weight: 600;
  margin-right: 16rpx;
}

.add-btn {
  width: 56rpx;
  height: 56rpx;
  background: rgba(79, 209, 199, 0.2);
  border: 2rpx solid rgba(79, 209, 199, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .add-icon {
    color: #4fd1c7;
    font-size: 28rpx;
    font-weight: bold;
  }
}

/* 船只紧凑列表 */
.ships-compact-list {
  flex: 1;
  padding: 16rpx;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.ship-compact-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 20rpx;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(79, 209, 199, 0.1);
    border-color: rgba(79, 209, 199, 0.3);
    transform: translateY(-2rpx);
  }

  &.active {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }

  &.maintenance {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
  }

  &.offline {
    border-color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
  }
}

.ship-basic-info {
  margin-bottom: 12rpx;
}

.ship-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.ship-name {
  font-size: 26rpx;
  font-weight: 600;
  color: white;
}

.ship-type {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
  display: block;
  margin-bottom: 4rpx;
}

.ship-location {
  font-size: 20rpx;
  color: #4fd1c7;
  display: block;
}

.ship-metrics {
  display: flex;
  gap: 16rpx;
  margin: 12rpx 0;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 12rpx;
  background: rgba(79, 209, 199, 0.1);
  border-radius: 8rpx;
  flex: 1;
}

.metric-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4rpx;
}

.metric-value {
  font-size: 22rpx;
  font-weight: 600;
  color: #4fd1c7;
}

.ship-actions {
  display: flex;
  gap: 8rpx;
}

.action-btn {
  flex: 1;
  height: 56rpx;
  border-radius: 12rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  .action-icon {
    color: white;
    font-size: 20rpx;
  }

  &.control {
    background: rgba(79, 209, 199, 0.2);

    &:hover {
      background: rgba(79, 209, 199, 0.4);
    }
  }

  &.settings {
    background: rgba(107, 114, 128, 0.2);

    &:hover {
      background: rgba(107, 114, 128, 0.4);
    }
  }
}

/* 人员紧凑列表 */
.personnel-compact-list {
  flex: 1;
  padding: 16rpx;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.personnel-compact-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(79, 209, 199, 0.1);
    border-color: rgba(79, 209, 199, 0.3);
    transform: translateY(-2rpx);
  }
}

.personnel-basic-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
}

.avatar-small {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4fd1c7, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.person-details {
  flex: 1;
}

.person-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4rpx;
}

.person-name {
  font-size: 24rpx;
  font-weight: 600;
  color: white;
}

.person-role {
  font-size: 20rpx;
  color: #4fd1c7;
  display: block;
  margin-bottom: 2rpx;
}

.person-department {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.7);
  display: block;
}

.status-indicator {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;

  &.online {
    background: #10b981;
  }

  &.busy {
    background: #f59e0b;
  }

  &.offline {
    background: #6b7280;
  }
}

.contact-actions {
  display: flex;
  gap: 8rpx;
}

.contact-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  .contact-icon {
    font-size: 20rpx;
  }

  &.call {
    background: rgba(34, 197, 94, 0.2);

    .contact-icon {
      color: #22c55e;
    }

    &:hover {
      background: rgba(34, 197, 94, 0.4);
    }
  }

  &.message {
    background: rgba(59, 130, 246, 0.2);

    .contact-icon {
      color: #3b82f6;
    }

    &:hover {
      background: rgba(59, 130, 246, 0.4);
    }
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 12rpx;
  margin-bottom: 24rpx;

  .title-icon {
    font-size: 32rpx;
    color: #4fd1c7;
  }

  .title-text {
    flex: 1;
    color: white;
    font-size: 32rpx;
    font-weight: 600;
  }

  .add-btn {
    width: 64rpx;
    height: 64rpx;
    background: rgba(79, 209, 199, 0.2);
    border: 2rpx solid rgba(79, 209, 199, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .add-icon {
      color: #4fd1c7;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}

.ships-section,
.personnel-section,
.tasks-section {
  margin-bottom: 48rpx;
}

/* 船只卡片样式 */
.ships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400rpx, 1fr));
  gap: 24rpx;
}

.ship-card {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(79, 209, 199, 0.1);
    border-color: rgba(79, 209, 199, 0.5);
    transform: translateY(-4rpx);
  }

  &.warning {
    border-color: rgba(245, 158, 11, 0.5);
  }

  &.offline {
    border-color: rgba(107, 114, 128, 0.5);
  }

  &.maintenance {
    border-color: rgba(239, 68, 68, 0.5);
  }
}

.ship-thumbnail {
  width: 120rpx;
  height: 80rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;

  .ship-icon {
    color: white;
    font-size: 40rpx;
  }
}

.ship-info {
  flex: 1;

  .ship-name {
    display: block;
    color: white;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
  }

  .ship-type {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
    margin-bottom: 12rpx;
  }

  .ship-location {
    display: block;
    color: #4fd1c7;
    font-size: 22rpx;
  }
}

.ship-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 8rpx;

  .status-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;

    &.online {
      background: #10b981;
    }

    &.warning {
      background: #f59e0b;
    }

    &.offline {
      background: #6b7280;
    }

    &.maintenance {
      background: #ef4444;
    }
  }

  .status-text {
    color: white;
    font-size: 20rpx;
  }
}

.ship-actions {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.action-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  .action-icon {
    font-size: 24rpx;
    color: white;
  }

  &.control {
    background: rgba(79, 209, 199, 0.2);

    &:hover {
      background: rgba(79, 209, 199, 0.4);
    }
  }

  &.settings {
    background: rgba(107, 114, 128, 0.2);

    &:hover {
      background: rgba(107, 114, 128, 0.4);
    }
  }
}

/* 人员卡片样式 */
.personnel-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.personnel-card {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(79, 209, 199, 0.1);
    border-color: rgba(79, 209, 199, 0.5);
    transform: translateY(-2rpx);
  }
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4fd1c7, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .avatar-text {
    color: white;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.personnel-info {
  flex: 1;

  .person-name {
    display: block;
    color: white;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
  }

  .person-role {
    display: block;
    color: #4fd1c7;
    font-size: 24rpx;
    margin-bottom: 4rpx;
  }

  .person-department {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 22rpx;
  }
}

.personnel-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;

  .status-indicator {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;

    &.online {
      background: #10b981;
      animation: pulse 2s infinite;
    }

    &.busy {
      background: #f59e0b;
      animation: pulse 2s infinite;
    }

    &.offline {
      background: #6b7280;
    }
  }

  .status-label {
    color: white;
    font-size: 20rpx;
  }
}

.contact-actions {
  display: flex;
  gap: 12rpx;
}

.contact-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  .contact-icon {
    font-size: 24rpx;
  }

  &.call {
    background: rgba(34, 197, 94, 0.2);

    .contact-icon {
      color: #22c55e;
    }

    &:hover {
      background: rgba(34, 197, 94, 0.4);
    }
  }

  &.message {
    background: rgba(59, 130, 246, 0.2);

    .contact-icon {
      color: #3b82f6;
    }

    &:hover {
      background: rgba(59, 130, 246, 0.4);
    }
  }
}

/* 任务卡片样式 */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.task-card {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 32rpx;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(79, 209, 199, 0.1);
    border-color: rgba(79, 209, 199, 0.5);
    transform: translateY(-2rpx);
  }

  &.high {
    border-color: rgba(239, 68, 68, 0.5);
  }

  &.medium {
    border-color: rgba(245, 158, 11, 0.5);
  }

  &.low {
    border-color: rgba(16, 185, 129, 0.5);
  }
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;

  .task-title {
    color: white;
    font-size: 28rpx;
    font-weight: 600;
  }
}

.priority-badge {
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: 600;

  &.high {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  &.medium {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }

  &.low {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
}

.task-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
  line-height: 1.5;
  margin-bottom: 16rpx;
  display: block;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;

  .task-assignee,
  .task-deadline {
    color: rgba(255, 255, 255, 0.7);
    font-size: 22rpx;
  }
}

.task-progress {
  .progress-label {
    color: #4fd1c7;
    font-size: 22rpx;
    margin-bottom: 8rpx;
    display: block;
  }

  .progress-bar {
    width: 100%;
    height: 8rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4rpx;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(to right, #4fd1c7, #10b981);
      border-radius: 4rpx;
      transition: width 0.3s ease;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dual-panel-container {
    flex-direction: column;
    gap: 16rpx;
  }
  
  .management-panel {
    min-height: 400rpx;
  }
  
  .management-content {
    padding: 16rpx;
  }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .management-header {
    height: 120rpx;
    padding: 12rpx 24rpx;
  }

  .content-area {
    top: 120rpx;
    bottom: 100rpx;
  }

  .dual-panel-container {
    flex-direction: row;
    gap: 16rpx;
  }

  .management-content {
    padding: 16rpx;
  }

  .ships-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
  }

  .ship-card {
    padding: 24rpx;
  }

  .personnel-card,
  .task-card {
    padding: 24rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .management-header {
    height: 160rpx;
    flex-direction: column;
    gap: 16rpx;
    padding: 24rpx 32rpx;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .management-summary {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .content-area {
    top: 160rpx;
    bottom: 120rpx;
  }

  .dual-panel-container {
    flex-direction: column;
    gap: 20rpx;
  }

  .management-content {
    padding: 24rpx 16rpx;
  }

  .ships-grid {
    grid-template-columns: 1fr;
    gap: 20rpx;
  }

  .ship-card {
    flex-direction: column;
    text-align: center;
    gap: 16rpx;
  }

  .ship-actions {
    flex-direction: row;
    justify-content: center;
  }

  .personnel-card {
    flex-direction: column;
    text-align: center;
    gap: 16rpx;
  }

  .contact-actions {
    justify-content: center;
  }
}
</style>
