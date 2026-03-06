# AYU统计助手 - Vercel 永久部署指南

## 🌟 方案介绍

**Vercel** 是一个免费的前端托管平台，可以让你永久、稳定地访问你的应用。

### 优势
- ✅ **完全免费**：无任何费用
- ✅ **永久域名**：.vercel.app 域名永久有效
- ✅ **自动 HTTPS**：SSL 证书自动配置
- ✅ **全球 CDN**：访问速度快
- ✅ **自动部署**：代码更新自动部署
- ✅ **自定义域名**：可绑定自己的域名（可选）

---

## 🚀 快速开始（5分钟搞定）

### 步骤 1: 注册 Vercel 账号

1. 访问：https://vercel.com/
2. 点击 "Sign Up" 注册
3. 使用 GitHub、GitLab 或 Bitbucket 账号登录（推荐 GitHub）

### 步骤 2: 创建 GitHub 仓库

1. 访问：https://github.com/
2. 点击 "New repository"
3. 仓库名称：`ayu-statistics-helper`
4. 设置为 Public（公开）或 Private（私有）
5. 点击 "Create repository"

### 步骤 3: 上传代码到 GitHub

在项目根目录执行：

```bash
# 初始化 Git 仓库（如果还没有）
cd /workspace/projects
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "feat: 初始化 AYU统计助手项目"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/ayu-statistics-helper.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**注意**：将 `你的用户名` 替换为你的 GitHub 用户名。

### 步骤 4: 在 Vercel 部署

1. 登录 Vercel：https://vercel.com/dashboard
2. 点击 "Add New..." → "Project"
3. 选择你的 GitHub 仓库 `ayu-statistics-helper`
4. 配置如下：

   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: pnpm build:web
   Output Directory: dist-web
   ```

5. 点击 "Deploy" 按钮

6. 等待 1-2 分钟，部署完成！

### 步骤 5: 获取永久域名

部署完成后，Vercel 会给你一个永久域名：

```
https://ayu-statistics-helper.vercel.app
```

或类似的域名，这个域名**永久有效**！

---

## 🔧 详细配置说明

### 构建命令

Vercel 会自动检测并使用以下命令：

```bash
pnpm install  # 安装依赖
pnpm build:web  # 构建项目
```

### 输出目录

构建后的文件在 `dist-web/` 目录，Vercel 会自动部署这个目录。

### 环境变量（如果需要）

如果项目需要环境变量，在 Vercel 项目设置中添加：

1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加需要的环境变量

---

## 🌐 访问应用

部署完成后，你可以通过以下地址访问：

### Vercel 默认域名
```
https://ayu-statistics-helper.vercel.app
```

**特点**：
- ✅ 永久有效
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 免费使用

### 绑定自定义域名（可选）

如果你有自己的域名，可以绑定：

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名（如：`ayu.example.com`）
3. 按照提示配置 DNS 记录
4. 等待 DNS 生效（通常 10-30 分钟）

---

## 🔄 自动部署

每次你推送代码到 GitHub，Vercel 会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "feat: 新功能"
git push
```

Vercel 会自动检测到更新并重新部署，无需手动操作。

---

## 📊 域名对比

| 特性 | 开发环境域名 | Vercel 域名 |
|------|-------------|-------------|
| 永久性 | ❌ 临时 | ✅ 永久 |
| 稳定性 | ⚠️ 依赖服务 | ✅ 高可用 |
| 成本 | 免费 | 免费 |
| HTTPS | ✅ 已启用 | ✅ 已启用 |
| 全球访问 | ⚠️ 可能不稳定 | ✅ CDN 加速 |
| 自动部署 | ❌ 无 | ✅ 有 |

---

## 💡 使用技巧

### 1. 查看部署状态

访问 Vercel Dashboard 查看部署历史和状态。

### 2. 查看访问日志

在 Vercel 项目设置中可以查看访问日志。

### 3. 预览部署

每次代码更新，Vercel 会生成预览链接，可以在正式部署前测试。

### 4. 回滚版本

如果新版本有问题，可以一键回滚到之前的版本。

---

## ⚠️ 注意事项

### 限制

- 免费账户有带宽限制（100GB/月）
- 免费账户有构建次数限制（600次/月）
- 对于个人使用，这些限制完全够用

### 最佳实践

1. **定期更新**：保持依赖包更新
2. **备份代码**：代码保存在 GitHub，自动备份
3. **监控访问**：定期查看访问日志
4. **优化性能**：使用 Vercel 的性能优化功能

---

## 🆘 常见问题

### Q1: 部署失败怎么办？
**A:** 检查：
- 构建命令是否正确
- 依赖是否完整
- 查看 Vercel 的错误日志

### Q2: 如何更换域名？
**A:** 在 Vercel 项目设置中修改域名即可。

### Q3: 可以同时部署多个版本吗？
**A:** 可以！每个 GitHub 分支都会自动生成独立的预览域名。

### Q4: 免费版会收费吗？
**A:** 个人使用完全免费，Vercel 承诺永久免费用于个人项目。

### Q5: 如何删除项目？
**A:** 在 Vercel Dashboard 中选择项目，点击 Settings → Delete。

---

## 📞 技术支持

如遇到问题：
- QQ: 936181891
- Vercel 官方文档：https://vercel.com/docs

---

## 🎉 完成后你将获得

✅ 永久可访问的域名
✅ 全球 CDN 加速
✅ 自动 HTTPS 加密
✅ 自动部署功能
✅ 完全免费使用

---

**预计时间**: 5-10 分钟
**难度**: ⭐⭐ (简单)
**推荐度**: ⭐⭐⭐⭐⭐

---

**下一步**: 按照上面的步骤操作，有任何问题随时问我！
