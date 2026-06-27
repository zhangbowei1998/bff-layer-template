# AWS Lambda Deployment Guide

本项目采用 GitHub Actions + AWS Lambda 的部署方式。

## 部署前准备

1. AWS 侧资源
- 一个 Lambda 函数（Runtime 建议 Node.js 20）
- 函数 Handler 配置为 `dist/lambda.handler`
- 触发器可选：API Gateway HTTP API

2. GitHub OIDC 与 IAM Role
- 为仓库配置 OIDC 信任的 IAM Role
- 该 Role 需要权限：
  - lambda:UpdateFunctionCode
  - lambda:GetFunction
  - lambda:GetFunctionConfiguration

3. GitHub Secrets / Variables

Secrets:
- AWS_ROLE_TO_ASSUME: OIDC 方式使用的 IAM Role ARN

Variables:
- AWS_REGION: 例如 ap-southeast-1
- LAMBDA_FUNCTION_NAME: 例如 bff-layer-template-prod

## 流程说明

工作流文件：.github/workflows/deploy-aws-lambda.yml

- main 分支 push 或手动触发时执行
- 构建 TypeScript 产物到 dist
- 打包 dist + 生产依赖为 zip
- 调用 aws lambda update-function-code 发布

## 运行配置建议

建议在 Lambda 环境变量里配置：
- UPSTREAM_BASE_URL
- REQUEST_TIMEOUT_MS
- BFF_AUTH_TOKEN
- RATE_LIMIT_WINDOW_MS
- RATE_LIMIT_MAX
- CACHE_TTL_MS

## API Gateway 集成

如果使用 API Gateway HTTP API：
- Lambda proxy integration
- 路由建议：`ANY /{proxy+}` 与 `ANY /`
- 健康检查路径可指向 `/api/bff/health`

## 回滚建议

可在 Lambda 控制台发布并切回上一个版本，或通过别名（Alias）切流。建议生产使用版本 + 别名发布策略。
