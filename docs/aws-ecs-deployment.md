# AWS ECS Deployment Guide

本项目默认采用 GitHub Actions + Amazon ECR + Amazon ECS Fargate 的部署方式。

## 部署前准备

1. AWS 侧资源
- 一个 ECR 仓库（用于存放镜像）
- 一个 ECS Cluster
- 一个 ECS Service（已绑定 ALB）
- 一个 ECS Task Definition Family（容器名必须和后续变量一致）

2. GitHub OIDC 与 IAM Role
- 为仓库配置 OIDC 信任的 IAM Role
- 该 Role 需要权限：
  - ecr:GetAuthorizationToken
  - ecr:BatchCheckLayerAvailability
  - ecr:CompleteLayerUpload
  - ecr:UploadLayerPart
  - ecr:PutImage
  - ecs:DescribeTaskDefinition
  - ecs:RegisterTaskDefinition
  - ecs:UpdateService
  - ecs:DescribeServices
  - iam:PassRole（用于 Task Execution Role / Task Role）

3. GitHub Secrets / Variables

Secrets:
- AWS_ROLE_TO_ASSUME: OIDC 方式使用的 IAM Role ARN

Variables:
- AWS_REGION: 例如 ap-southeast-1
- ECR_REPOSITORY: 例如 bff-layer-template
- ECS_CLUSTER: 例如 prod-bff-cluster
- ECS_SERVICE: 例如 prod-bff-service
- ECS_TASK_DEFINITION_FAMILY: 例如 bff-layer-template-task
- CONTAINER_NAME: 必须与 Task Definition 里的容器名一致

## 流程说明

工作流文件：.github/workflows/deploy-aws-ecs.yml

- main 分支 push 或手动触发时执行
- 构建 Docker 镜像并推送到 ECR
- 拉取当前 Task Definition
- 将目标容器 image 更新为新镜像
- 注册新 revision 并更新 ECS Service
- 等待服务稳定

## 环境变量注入建议

生产环境下，不建议将敏感信息写进镜像。
建议在 ECS Task Definition 中通过以下方式注入：
- 普通配置: environment
- 敏感信息: Secrets Manager 或 SSM Parameter Store + secrets

例如：
- BFF_AUTH_TOKEN
- UPSTREAM_BASE_URL
- REQUEST_TIMEOUT_MS
- RATE_LIMIT_MAX

## 回滚建议

如发布后出现问题，可执行：
1. 在 ECS 控制台选择旧 revision 回滚
2. 或使用 CLI 将 service 的 taskDefinition 指向前一个版本

## 健康检查

建议 ALB Target Group 的健康检查路径配置为：
- /api/bff/health
