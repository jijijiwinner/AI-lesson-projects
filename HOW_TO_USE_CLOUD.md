# 如何启用云同步功能

## 🎯 两种使用方式

本系统支持两种数据存储方式：

### 方式1：localStorage（当前默认）
- ✅ 无需配置，开箱即用
- ✅ 数据存储在浏览器本地
- ✅ 刷新不会丢失
- ⚠️ 只能单设备使用
- ⚠️ 清除浏览器数据会丢失

### 方式2：uni-cloud 云同步（需配置）
- ✅ 数据存储在云端
- ✅ 多设备自动同步
- ✅ 永久安全存储
- ✅ 免费2GB空间
- ⚠️ 需要配置云服务空间

---

## 🚀 快速开始

### 当前状态：已集成云同步代码 ✅

所有云同步功能代码已完成，包括：
- ☑️ 云数据库服务封装
- ☑️ 云同步 Store
- ☑️ 同步状态组件
- ☑️ 设置页面
- ☑️ 数据库 Schema

### 使用步骤：

#### 步骤1：配置 uni-cloud

详细步骤请查看：[UNICLOUD_SETUP.md](./UNICLOUD_SETUP.md)

**最简单的方法：**
1. 用 HBuilderX 打开项目
2. 右键 `uniCloud-aliyun` → 创建云服务空间
3. 填入空间名称，点击创建
4. 等待创建完成

#### 步骤2：切换到云同步版本

打开 `src/pages/home/index.vue` 等页面，修改导入：

```typescript
// 原来的 localStorage 版本
import { useCourseStore } from '@/stores/course';

// 改为云同步版本
import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
```

或者全局替换（推荐）：

```bash
# 在所有 .vue 文件中替换
找到：import { useCourseStore } from '@/stores/course';
替换为：import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
```

#### 步骤3：运行并测试

```bash
npm run dev:h5
```

打开浏览器，进入"设置"页面，开启"云端同步"。

---

## 📝 需要修改的文件

如果要切换到云同步版本，需要修改以下文件的 import：

1. `src/pages/home/index.vue`
2. `src/pages/coursePackage/index.vue`
3. `src/pages/coursePackage/add.vue`
4. `src/pages/record/index.vue`
5. `src/pages/history/index.vue`

**统一修改方法：**

```typescript
// 在每个文件顶部，找到：
import { useCourseStore } from '@/stores/course';

// 改为：
import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
```

这样API保持不变，无需修改其他代码。

---

## 🔄 两个版本对比

| 功能 | localStorage版本 | 云同步版本 |
|-----|-----------------|----------|
| 数据存储 | 浏览器本地 | 云端+本地 |
| 多设备同步 | ❌ | ✅ |
| 离线使用 | ✅ | ✅ |
| 数据备份 | 需手动 | 自动云端 |
| 配置复杂度 | 简单 | 需配置 |
| 费用 | 完全免费 | 免费额度内免费 |

---

## 💡 推荐方案

### 个人使用（单设备）
👉 **直接使用 localStorage 版本**（当前默认）
- 无需配置
- 简单可靠
- 完全免费

### 家庭使用（多设备）
👉 **使用云同步版本**
- 手机和电脑数据同步
- 多人共享数据
- 数据永久保存

### 机构使用
👉 **使用云同步版本**
- 多设备协作
- 数据集中管理
- 云端备份安全

---

## 🛠️ 我来帮你切换

如果您决定使用云同步版本，我可以帮您：

1. **自动替换所有文件的 import**
2. **配置 uni-cloud**
3. **测试同步功能**

需要我现在帮您切换吗？只需回复：
- "切换到云同步" - 我会自动修改所有文件
- "保持当前" - 继续使用 localStorage 版本
- "稍后决定" - 我会提供切换脚本

---

## ❓ 常见问题

### Q1: 已有本地数据，切换后会丢失吗？

**不会！** 首次开启云同步时，会自动上传本地数据到云端。

### Q2: 可以随时关闭云同步吗？

**可以！** 在"设置"页面关闭开关即可。关闭后继续使用本地数据。

### Q3: 云同步失败怎么办？

**不影响使用！** 数据仍保存在本地，联网后会自动重试同步。

### Q4: 需要付费吗？

**个人/家庭使用完全免费！** 免费额度可用10年以上。

---

## 📞 需要帮助？

如果您需要：
- ✅ 切换到云同步版本
- ✅ 配置 uni-cloud
- ✅ 测试同步功能
- ✅ 解决同步问题

请随时告诉我！😊
