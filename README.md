# PrivacyShredder (隐私空间)

一款保护手机隐私的安全工具，提供浏览器痕迹清理、数据安全粉碎、匿名隧道访问等核心功能。采用 Apple 风格设计语言，打造丝滑流畅的交互体验。

## 功能特性

### 🧹 痕迹清理
- 浏览器历史记录、Cookie、缓存数据清理
- 剪贴板内容监控与自动清除
- DNS 缓存与系统日志清理
- Wi-Fi 连接记录管理
- 应用缓存（微信/QQ/抖音/微博/淘宝）深度清理

### 🔒 安全粉碎
- **标准擦除**：单次随机字节覆写 (1 pass)
- **深度擦除**：DoD 5220.22-M 标准 (3 passes)
- **军事级擦除**：Gutmann 算法 (35 passes)
- 紧急粉碎模式（长按触发）
- 实时进度显示与完成后报告

### 🕶 匿名隧道
- Tor 三层中继加密
- VPN (AES-256-GCM)
- SOCKS5 代理转发
- 应用级别路由控制
- 连接日志审计

### ⚙️ 其他特性
- 防截屏保护
- 伪装模式（切换应用名称）
- 定时自动清理
- 安全评分系统

## 快速预览

```powershell
cd privacy-shredder
powershell -ExecutionPolicy Bypass -File server.ps1
# 浏览器打开 http://localhost:8000
```

## UI 设计

基于 Apple Human Interface Guidelines，采用：
- SF Pro / PingFang SC 字体系统
- iOS 风格毛玻璃导航栏与标签栏
- 弹簧缓动曲线动画
- 页面滑动过渡效果
- 庆祝粒子特效
- 波纹触觉反馈

## 技术栈

- HTML5 / CSS3 / JavaScript (Vanilla)
- CSS 自定义属性（设计令牌系统）
- GPU 加速动画与过渡

## 许可证

MIT License - 详见 [LICENSE](LICENSE)