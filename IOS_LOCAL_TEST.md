# 📱 iOS 本地测试指南（无需发布市场）

## 🎯 三种测试方案

| 方案 | 优点 | 缺点 | 推荐度 |
|-----|------|------|--------|
| **方案1：H5手机浏览器** | 最简单，0成本 | 不是原生APP | ⭐⭐⭐⭐⭐ 推荐 |
| **方案2：免费Apple ID** | 真实APP体验 | 7天过期，需要Mac | ⭐⭐⭐⭐ |
| **方案3：付费开发者** | 长期有效 | 需要$99/年 | ⭐⭐⭐ |

---

## 🚀 方案1：H5 手机浏览器测试（最简单）

### 零成本，立即可用！

#### 步骤1：启动开发服务器

```bash
cd /Users/user/Projects/AI/lession-tracking
npm run dev:h5
```

#### 步骤2：获取本地IP地址

**Mac电脑：**
```bash
# 在终端运行
ifconfig | grep "inet " | grep -v 127.0.0.1

# 输出类似：
inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

记住这个 IP：`192.168.1.100`

**或者简单方法：**
```
系统偏好设置 → 网络 → 查看IP地址
```

#### 步骤3：修改配置允许外部访问

在 `vite.config.ts` 中添加：

```typescript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',  // 添加这一行
    port: 5173,
  },
});
```

#### 步骤4：重启服务器

```bash
# 按 Ctrl+C 停止
npm run dev:h5
```

#### 步骤5：手机访问

在 iPhone Safari 中打开：
```
http://192.168.1.100:5173/
```

（将 IP 替换为你电脑的实际 IP）

### ✅ 测试功能

- ✅ 添加课程包
- ✅ 记录学时
- ✅ 查看统计
- ✅ 历史记录
- ✅ 数据持久化
- ✅ 云同步（如已配置）

### 💡 优化建议

**添加到主屏幕（像APP一样使用）：**

1. 在 Safari 中打开应用
2. 点击底部分享按钮
3. 选择"添加到主屏幕"
4. 设置图标名称
5. 完成！

现在主屏幕上有一个图标，点击就能打开，**体验接近原生APP！**

---

## 🔧 方案2：使用免费 Apple ID 测试（真实APP）

### 无需付费，但需要 Mac 电脑

#### 前置要求

- ✅ Mac 电脑
- ✅ 安装 Xcode（免费）
- ✅ iPhone 数据线
- ✅ 免费 Apple ID

#### 步骤详解

##### 第1步：下载 uni-app 离线 SDK

```
访问：https://nativesupport.dcloud.net.cn/AppDocs/download/ios
下载：iOS 离线打包SDK
解压到本地
```

##### 第2步：构建 H5 资源

```bash
cd /Users/user/Projects/AI/lession-tracking
npm run build:h5
```

构建完成后，资源在 `dist/build/h5/` 目录

##### 第3步：配置 Xcode 项目

1. **打开 Xcode 工程**
   ```
   在解压的SDK中找到：
   HBuilder-uniPluginDemo.xcodeproj
   双击打开
   ```

2. **替换 www 目录**
   ```
   将 dist/build/h5/ 的内容
   复制到 Xcode 项目的 www 目录
   ```

3. **配置 Bundle ID**
   ```
   在 Xcode 中：
   项目设置 → General → Bundle Identifier
   改为：com.yourname.lessontracking
   （可以是任意格式，只要不重复）
   ```

4. **添加 Apple ID**
   ```
   Xcode → Preferences → Accounts
   点击 + → 添加 Apple ID
   登录你的 Apple ID（免费账号）
   ```

5. **选择开发团队**
   ```
   项目设置 → Signing & Capabilities
   Team：选择你的 Apple ID
   勾选：Automatically manage signing
   ```

##### 第4步：连接 iPhone 并运行

1. **连接 iPhone**
   - 用数据线连接 Mac 和 iPhone
   - iPhone 上信任这台电脑

2. **选择设备**
   - Xcode 顶部选择你的 iPhone

3. **运行**
   - 点击 ▶️ 播放按钮
   - 或按 Cmd+R

4. **信任开发者**
   ```
   iPhone 上：
   设置 → 通用 → VPN与设备管理
   → 找到你的 Apple ID
   → 点击信任
   ```

##### 第5步：测试

应用已安装到 iPhone，可以正常使用！

### ⚠️ 注意事项

**免费 Apple ID 限制：**
- 证书 **7天后过期**
- 过期后需要重新运行一次
- 只能安装到自己的设备
- 每个 Apple ID 最多安装 **3个APP**

**解决方法：**
- 每周重新运行一次即可
- 或付费升级开发者账号

---

## 💰 方案3：付费开发者账号（长期测试）

### 如果需要长期测试

**费用：** $99/年

**优势：**
- ✅ 证书永久有效
- ✅ 可安装到多台设备
- ✅ 可分享给测试人员
- ✅ 可发布到 App Store

**流程：**
参考 [IOS_BUILD_GUIDE.md](./IOS_BUILD_GUIDE.md)

---

## 🎯 推荐方案对比

### 短期测试（1-2周）

**推荐：方案1（H5浏览器）**

优点：
- ✅ 完全免费
- ✅ 立即可用
- ✅ 无需任何配置
- ✅ 功能完全一致

操作：
```bash
npm run dev:h5
# 手机访问 http://你的IP:5173/
```

### 中期测试（1-3个月）

**推荐：方案2（免费Apple ID）**

优点：
- ✅ 真实APP体验
- ✅ 无需付费
- ✅ 测试原生功能

操作：
- 需要 Mac + Xcode
- 每周重新运行一次

### 长期使用（3个月以上）

**推荐：方案3（付费账号）**

优点：
- ✅ 长期有效
- ✅ 多设备使用
- ✅ 可分享测试

费用：
- $99/年

---

## ⚡ 最简单的测试流程

### 立即测试（5分钟）

**我强烈推荐这个方法！**

1. **启动服务器**
   ```bash
   npm run dev:h5
   ```

2. **查看电脑IP**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **手机访问**
   ```
   iPhone Safari 打开：
   http://你的IP地址:5173/
   ```

4. **添加到主屏幕**
   - Safari 底部分享按钮
   - 添加到主屏幕
   - 完成！

**现在你的 iPhone 主屏幕有一个图标，点击就能使用！**

---

## 📊 方案选择建议

### 如果你想：

**快速测试功能** → 用方案1（H5浏览器）
- 0成本，立即可用
- 功能完全一样
- 5分钟搞定

**体验真实APP** → 用方案2（免费Apple ID）
- 需要 Mac 电脑
- 真实APP体验
- 每周运行一次

**长期使用** → 用方案3（付费账号）
- $99/年
- 永久有效
- 可分享测试

**我的建议：**
1. 先用方案1测试功能
2. 如果满意，再考虑方案2或3

---

## 🔍 详细操作示例

### H5 浏览器测试（推荐）

**第1步：修改 vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',  // ← 添加这两行
    port: 5173,
  },
});
```

**第2步：启动服务器**

```bash
cd /Users/user/Projects/AI/lession-tracking
npm run dev:h5
```

**第3步：在同一WiFi下，iPhone访问**

```
http://192.168.1.100:5173/
```

**第4步：添加到主屏幕**

<img width="300" alt="添加到主屏幕" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/add-to-home.jpg">

完成！现在你有一个类似原生APP的应用了！

---

## ✅ 功能对比

| 功能 | H5浏览器 | 原生APP |
|------|---------|---------|
| 添加课程包 | ✅ | ✅ |
| 记录学时 | ✅ | ✅ |
| 查看统计 | ✅ | ✅ |
| 历史记录 | ✅ | ✅ |
| 数据保存 | ✅ | ✅ |
| 云同步 | ✅ | ✅ |
| 离线使用 | ⚠️ 需网络 | ✅ |
| 推送通知 | ❌ | ✅ |
| 应用图标 | ✅ | ✅ |

**结论：** 对于您的使用场景，H5版本完全够用！

---

## 🎉 开始测试

### 最简单的方式（强烈推荐）

```bash
# 1. 启动服务器
npm run dev:h5

# 2. 查看IP地址
ifconfig | grep "inet " | grep -v 127.0.0.1

# 3. iPhone Safari 访问
# http://你的IP:5173/

# 4. 添加到主屏幕
# 点击分享 → 添加到主屏幕
```

**5分钟完成，无需任何配置！** ✅

---

## 💡 进阶优化

### 让H5版本更像APP

**1. 添加 PWA 配置**

在 `src/manifest.json` 中：

```json
{
  "h5": {
    "title": "课程学时登记",
    "router": {
      "mode": "hash",
      "base": "/"
    },
    "devServer": {
      "https": false
    },
    "optimization": {
      "treeShaking": {
        "enable": true
      }
    }
  }
}
```

**2. 优化移动端体验**

- 禁止页面缩放 ✅（已配置）
- 全屏显示
- 隐藏地址栏
- 离线缓存

---

## ❓ 常见问题

### Q1: H5版本和原生APP有什么区别？

**主要区别：**
- H5需要联网使用
- 原生APP可以完全离线

**功能上：**
- 99%的功能都一样
- 您的应用主要是数据管理，H5完全够用

### Q2: 手机访问不了怎么办？

**检查：**
1. 电脑和手机在同一WiFi
2. 防火墙是否阻止了5173端口
3. IP地址是否正确

**解决：**
```bash
# Mac 临时关闭防火墙
sudo pfctl -d

# 或允许端口
sudo pfctl -f /etc/pf.conf
```

### Q3: 添加到主屏幕后打不开？

**可能原因：**
- 服务器没有运行
- IP地址变了（重启路由器）

**解决：**
- 确保 `npm run dev:h5` 在运行
- 重新获取IP地址

---

## 📞 需要帮助？

**我可以帮您：**
- ✅ 配置网络访问
- ✅ 解决连接问题
- ✅ 优化移动端体验
- ✅ 如需原生APP，协助打包

**随时告诉我！**

---

## 🎊 总结

### 推荐方案：H5 手机浏览器

**为什么：**
- ✅ 完全免费
- ✅ 5分钟搞定
- ✅ 功能完全够用
- ✅ 添加到主屏幕后体验接近APP

**操作：**
1. 修改 `vite.config.ts` 添加 `host: '0.0.0.0'`
2. 运行 `npm run dev:h5`
3. 手机访问 `http://你的IP:5173/`
4. 添加到主屏幕

**完成！** 🎉

---

**现在就开始测试吧！有问题随时问我！** 🚀
