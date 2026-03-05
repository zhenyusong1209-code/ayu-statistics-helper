# 手机APP开发方案

## 方案选择

### 推荐方案：Capacitor（H5 + 原生容器）

**优势：**
- ✅ 无需React Native开发环境
- ✅ 配置简单，快速上手
- ✅ 功能与当前H5版本完全一致
- ✅ 支持iOS和Android双平台
- ✅ 可以访问原生设备能力（相机、文件等）
- ✅ 一套代码，多端运行

**架构：**
```
Taro代码 → 编译为H5 → Capacitor打包 → iOS/Android原生APP
```

---

## 实施步骤

### Step 1: 安装 Capacitor 依赖

```bash
cd /workspace/projects

# 安装 Capacitor 核心包
pnpm add @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 初始化 Capacitor
npx cap init
```

### Step 2: 配置应用信息

初始化时会提示输入以下信息：
- **App Name**: 号码统计助手（或您想要的名称）
- **App ID**: com.yourcompany.numberapp（使用反向域名）
- **Web Dir**: dist-web（Taro H5编译输出目录）

### Step 3: 添加编译脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "build:app": "taro build --type h5 && npx cap sync",
    "build:android": "taro build --type h5 && npx cap sync android && npx cap open android",
    "build:ios": "taro build --type h5 && npx cap sync ios && npx cap open ios"
  }
}
```

### Step 4: 编译 H5 版本

```bash
# 编译 H5 版本
pnpm build:web

# 同步到 Capacitor 项目
npx cap sync
```

### Step 5: 添加平台支持

```bash
# 添加 Android 平台
npx cap add android

# 添加 iOS 平台（需要 macOS + Xcode）
npx cap add ios
```

### Step 6: 打包生成 APP

#### Android APP 打包

```bash
# 同步代码到 Android 项目
npx cap sync android

# 打开 Android Studio
npx cap open android

# 在 Android Studio 中：
# 1. Build → Build Bundle(s) / APK(s) → Build APK(s)
# 2. 选择 release 或 debug
# 3. 生成的 APK 在 app/build/outputs/apk/
```

#### iOS APP 打包（需要 macOS + Xcode）

```bash
# 同步代码到 iOS 项目
npx cap sync ios

# 打开 Xcode
npx cap open ios

# 在 Xcode 中：
# 1. 选择目标设备或模拟器
# 2. Product → Archive
# 3. 选择分发方式（App Store、Ad Hoc、Enterprise）
```

---

## 配置文件说明

### capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.numberapp',
  appName: '号码统计助手',
  webDir: 'dist-web',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'path/to/keystore.jks',
      keystoreAlias: 'my-key-alias',
      keystoreAliasPassword: 'alias-password',
      keystorePassword: 'keystore-password'
    }
  }
};

export default config;
```

---

## 常见问题

### Q1: APP 网络请求失败？
**A:** Android 9+ 默认禁止 HTTP 请求，需要配置网络安全：
```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

### Q2: 如何修改 APP 图标和启动页？
**A:** 使用 Capacitor Assets：
```bash
npx @capacitor/assets generate
```
准备以下图片：
- icon.png (1024x1024) - APP图标
- splash.png (2732x2732) - 启动页

### Q3: 如何访问原生设备功能？
**A:** 安装对应的 Capacitor 插件：
```bash
# 相机
pnpm add @capacitor/camera

# 文件系统
pnpm add @capacitor/filesystem

# 分享
pnpm add @capacitor/share
```

### Q4: APP 需要签名吗？
**A:**
- **Debug 版本**: 使用默认签名即可，用于测试
- **Release 版本**: 需要正式签名才能发布到应用商店

---

## 发布到应用商店

### Android (Google Play)

1. 注册 Google Play 开发者账号（$25）
2. 创建应用
3. 上传签名后的 APK 或 AAB
4. 填写应用信息
5. 提交审核

### iOS (App Store)

1. 注册 Apple Developer 账号（$99/年）
2. 在 Xcode 中配置签名和 Provisioning Profile
3. Archive 并上传到 App Store Connect
4. 填写应用信息和截图
5. 提交审核

---

## 方案对比

| 方案 | 优势 | 劣势 | 推荐度 |
|------|------|------|--------|
| **Capacitor** | 配置简单、快速上线、无需RN环境 | 性能略低于原生 | ⭐⭐⭐⭐⭐ |
| React Native | 原生性能、更接近原生体验 | 需要RN环境、配置复杂 | ⭐⭐⭐ |
| Flutter | 高性能、美观UI | 需要重写代码 | ⭐⭐ |

---

## 下一步行动

1. **确认方案**: 是否选择 Capacitor 方案？
2. **提供信息**: 应用名称、App ID
3. **环境准备**: 确认是否需要 Android Studio / Xcode
4. **开始实施**: 按照上述步骤执行

---

## 估算时间

- **配置环境**: 30分钟
- **编译打包**: 15分钟
- **Android签名**: 30分钟
- **iOS签名**: 1小时（需要Apple ID）
- **总计**: 2-3小时完成首个APP
