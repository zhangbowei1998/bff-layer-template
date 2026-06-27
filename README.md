# BFF Layer Template

工业级可用的 BFF (Backend for Frontend) 模板项目，基于 Node.js + TypeScript + Express。

## 模板能力

- 标准化分层：`routes` / `services` / `middleware` / `config`
- 统一响应模型：success / error envelope
- 请求追踪：`x-request-id` 注入与结构化日志
- 接口保护：Bearer Token 鉴权 + 基础限流
- 上游聚合缓存：内存 TTL 缓存
- OpenAPI 文档：`/api/bff/openapi.json`
- AWS 部署流水线：Lambda（GitHub Actions）
- CI 质量门禁：lint + typecheck + test + build
- 容器化支持：多阶段 `Dockerfile`
- 优雅停机：`SIGINT` / `SIGTERM`

## 快速开始

```bash
pnpm install
cp .env.example .env
pnpm dev
```

默认启动地址：`http://localhost:4000`

## 常用命令

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 环境变量

- `PORT`: 服务端口，默认 `4000`
- `UPSTREAM_BASE_URL`: 上游 API 地址
- `REQUEST_TIMEOUT_MS`: 上游请求超时，默认 `5000`
- `BFF_AUTH_TOKEN`: Bearer Token，默认 `dev-bff-token`
- `RATE_LIMIT_WINDOW_MS`: 限流窗口，默认 `60000`
- `RATE_LIMIT_MAX`: 窗口内请求上限，默认 `30`
- `CACHE_TTL_MS`: 缓存时长，默认 `30000`

## API 概览

- `GET /api/bff/health`
- `GET /api/bff/users/:id/profile`（需要 `Authorization: Bearer <token>`）
- `GET /api/bff/openapi.json`

## AWS 部署

- 工作流文件：`.github/workflows/deploy-aws-lambda.yml`
- 部署说明：`docs/aws-lambda-deployment.md`

配置好 GitHub 的 `AWS_ROLE_TO_ASSUME`（Secret）以及 AWS 相关 Variables 后，
push 到 `main` 会自动触发 Lambda 发布。

## 响应模型

成功：

```json
{
  "success": true,
  "requestId": "...",
  "data": {}
}
```

失败：

```json
{
  "success": false,
  "requestId": "...",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid bearer token"
  }
}
```
