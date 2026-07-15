# 📱 iOS APP 打包完整指南

## 🎯 打包方式选择

本项目支持两种iOS打包方式：

| 方式 | 优点 | 缺点 | 推荐度 |
|-----|------|------|--------|
| **方式一：云打包** | 简单快速，无需配置环境 | 需要DCloud账号 | ⭐⭐⭐⭐⭐ 推荐 |
| **方式二：离线打包** | 完全自主控制 | 需要Mac、Xcode | ⭐⭐⭐ 进阶 |

---

## 🚀 方式一：云打包（推荐）

### 前置准备

#### 1. 必需的账号和证书

✅ **DCloud 账号**（免费注册）
- 访问：https://dev.dcloud.net.cn/
- 用于使用 HBuilderX 和云打包服务

✅ **Apple 开发者账号**（需付费）
- 个人：$99/年
- 企业：$299/年
- 用于发布到 App Store

⚠️ **如果只是测试**：可以使用 Apple ID 创建免费证书（仅限真机调试）

#### 2. iOS 证书和描述文件

需要准备：
- ✅ App ID
- ✅ 开发证书（Development Certificate）或发布证书（Distribution Certificate）
- ✅ 描述文件（Provisioning Profile）

---

### 步骤详解

#### 第1步：安装 HBuilderX

1. 下载 HBuilderX
   - 访问：https://www.dcloud.io/hbuilderx.html
   - 下载"正式版"（不要下载Alpha版）

2. 安装并启动

3. 登录 DCloud 账号
   - 顶部菜单：工具 → 插件安装 → 登录

#### 第2步：准备 iOS 证书（重要）

##### A. 使用 Apple 开发者账号（推荐）

1. **登录 Apple 开发者中心**
   - 访问：https://developer.apple.com/account/
   - 使用 Apple 开发者账号登录

2. **创建 App ID**
   ```
   进入：Certificates, Identifiers & Profiles
   → 点击 Identifiers
   → 点击 + 创建新的 App ID
   
   填写：
   - Description: 课程学时登记
   - Bundle ID: com.yourcompany.lessontracking
   （记住这个 Bundle ID，后面会用到）
   ```

3. **创建证书**
   ```
   → 点击 Certificates
   → 点击 + 创建证书
   
   选择类型：
   - 测试：iOS App Development
   - 发布：Apple Distribution
   
   按提示生成 CSR 文件并上传
   下载 .cer 证书文件
   双击安装到钥匙串
   ```

4. **创建描述文件**
   ```
   → 点击 Profiles
   → 点击 + 创建描述文件
   
   选择类型：
   - 测试：iOS App Development
   - 发布：App Store
   
   选择刚创建的 App ID 和证书
   下载 .mobileprovision 文件
   ```

##### B. 使用 Apple ID（免费，仅测试）

1. 在 Xcode 中添加 Apple ID
2. 自动生成开发证书
3. 仅能安装到自己的设备
4. 证书7天后过期

#### 第3步：在 HBuilderX 中配置

1. **打开项目**
   - 文件 → 打开目录 → 选择项目文件夹

2. **配置 manifest.json**
   ```
   点击 src/manifest.json
   → 可视化界面
   → App常用其他设置
   
   填写：
   - 应用名称：课程学时登记
   - 应用版本名称：1.0.0
   - 应用版本号：100
   ```

3. **配置 iOS 信息**
   ```
   → App SDK配置
   → iOS配置
   
   填写：
   - Bundle ID：com.yourcompany.lessontracking
     （必须与证书中的 App ID 一致！）
   - 应用名称：课程学时登记
   ```

#### 第4步：云打包

1. **开始打包**
   ```
   菜单：发行 → 原生App-云打包
   ```

2. **选择平台**
   ```
   勾选：仅打包 iOS
   ```

3. **填写证书信息**
   ```
   证书选择：
   ● 使用自有证书（推荐）
   
   上传文件：
   - 证书私钥：.p12 文件
   - 证书密码：创建 .p12 时设置的密码
   - 描述文件：.mobileprovision 文件
   ```

4. **配置云端证书**
   ```
   如果之前配置过证书：
   ○ 使用云端证书
   
   选择已上传的证书即可
   ```

5. **开始打包**
   ```
   点击：打包
   
   等待时间：5-15分钟
   可以在 HBuilderX 底部查看打包进度
   ```

6. **下载安装包**
   ```
   打包完成后：
   - 点击下载链接
   - 得到 .ipa 文件
   ```

#### 第5步：安装到 iOS 设备

##### A. 使用 Xcode（推荐）

1. **连接 iPhone 到 Mac**

2. **打开 Xcode**
   ```
   菜单：Window → Devices and Simulators
   ```

3. **安装 IPA**
   ```
   选择你的设备
   → 拖拽 .ipa 文件到设备列表
   → 等待安装完成
   ```

##### B. 使用第三方工具

**使用 AltStore（Mac/Windows）**
- 下载：https://altstore.io/
- 连接设备后安装 .ipa

**使用 3uTools（Windows）**
- 下载：http://www.3u.com/
- 连接设备后安装 .ipa

**使用 PP助手（Mac/Windows）**
- 下载：https://pro.25pp.com/
- 连接设备后安装 .ipa

##### C. 使用蒲公英/fir.im（内测分发）

1. **上传到蒲公英**
   ```
   访问：https://www.pgyer.com/
   注册账号
   上传 .ipa 文件
   获得下载链接
   ```

2. **手机扫码安装**
   ```
   在 Safari 中打开链接
   点击安装
   如果提示"未受信任的企业级开发者"：
   设置 → 通用 → VPN与设备管理 → 信任证书
   ```

---

## 🔧 方式二：离线打包（进阶）

### 前置要求

- ✅ Mac 电脑
- ✅ 安装 Xcode（免费）
- ✅ uni-app 离线打包SDK
- ✅ iOS 开发证书

### 步骤概览

1. 下载 uni-app iOS 离线打包 SDK
2. 用 Xcode 打开工程
3. 配置 Bundle ID 和证书
4. 将 www 目录内容复制到工程
5. 连接真机运行或打包

详细教程：https://nativesupport.dcloud.net.cn/AppDocs/usesdk/ios

---

## 📋 常见问题

### Q1: 没有 Mac 电脑可以打包吗？

**可以！** 使用云打包方式：
- 只需 HBuilderX（Win/Mac/Linux都支持）
- 只需 iOS 证书
- 无需 Mac 和 Xcode

### Q2: 没有 Apple 开发者账号怎么办？

**两个选择：**

1. **购买开发者账号**（推荐）
   - 个人：$99/年
   - 可以发布到 App Store
   - 证书永久有效

2. **使用免费 Apple ID**（测试）
   - 只能安装到自己设备
   - 证书7天过期
   - 不能发布到 App Store

### Q3: 打包报错 "证书不匹配"

**原因：**
- manifest.json 中的 Bundle ID 与证书的 App ID 不一致

**解决：**
1. 检查 manifest.json 中的 Bundle ID
2. 登录 Apple 开发者中心查看 App ID
3. 确保两者完全一致

### Q4: 安装后打不开或闪退

**可能原因：**

1. **证书问题**
   - 检查证书是否过期
   - 检查描述文件是否匹配

2. **设备未信任**
   ```
   设置 → 通用 → VPN与设备管理
   → 找到对应的企业应用
   → 点击信任
   ```

3. **代码问题**
   - 查看 HBuilderX 控制台日志
   - 使用真机调试查看错误

### Q5: 如何更新应用？

**方法1：重新打包**
1. 修改 versionName 和 versionCode
2. 重新云打包
3. 安装新的 .ipa

**方法2：发布到 App Store**
1. 打包发布版本
2. 上传到 App Store Connect
3. 提交审核
4. 用户通过 App Store 更新

### Q6: 云打包需要付费吗？

**DCloud 云打包：**
- ✅ 完全免费
- ✅ 无次数限制
- ✅ 无需付费会员

**但需要：**
- Apple 开发者账号（$99/年）

---

## 🎯 快速打包检查清单

### 打包前检查

- [ ] 已安装 HBuilderX
- [ ] 已登录 DCloud 账号
- [ ] 已准备 iOS 证书（.p12 + .mobileprovision）
- [ ] manifest.json 中的 Bundle ID 已配置
- [ ] 应用名称、版本号已填写
- [ ] 功能已测试完毕

### 打包过程

- [ ] 选择正确的证书
- [ ] Bundle ID 与证书匹配
- [ ] 打包成功，下载 .ipa
- [ ] 安装到测试设备
- [ ] 功能测试通过

### 发布准备

- [ ] 准备应用截图（多个尺寸）
- [ ] 准备应用描述和关键词
- [ ] 准备隐私政策链接
- [ ] 提交 App Store 审核

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [uni-app 云打包](https://ask.dcloud.net.cn/article/152) | 官方打包教程 |
| [iOS 证书申请](https://ask.dcloud.net.cn/article/152) | 证书详细教程 |
| [App Store 发布](https://ask.dcloud.net.cn/article/152) | 发布流程 |
| [HBuilderX 使用](https://hx.dcloud.net.cn/) | 工具使用文档 |

---

## 🎬 视频教程

**推荐观看：**
- uni-app iOS 打包教程：https://ke.qq.com/course/3169971
- iOS 证书申请教程：搜索"uni-app iOS证书"

---

## 💡 提示

### 测试建议

1. **先云打包开发版测试**
   - 使用开发证书
   - 安装到测试设备
   - 完整测试所有功能

2. **测试通过后打包发布版**
   - 使用发布证书
   - 准备发布到 App Store

### 优化建议

1. **应用图标**
   - 准备 1024x1024 图标
   - 放在 `static` 目录

2. **启动图**
   - 准备各种尺寸的启动图
   - 配置在 manifest.json

3. **应用性能**
   - 测试加载速度
   - 优化图片大小
   - 测试网络请求

---

## ✅ 总结

### 最简单的方式

1. 购买 Apple 开发者账号（$99/年）
2. 在 Apple 开发者中心申请证书
3. 使用 HBuilderX 云打包
4. 下载 .ipa 安装测试
5. 功能确认无误后发布

### 预计时间

- 首次打包：2-3小时（包括证书申请）
- 熟悉后：10-15分钟

---

**祝打包顺利！** 🎉

有任何问题随时问我！
