// src/docs/openapi.ts
// 如果你装了 @types/swagger-ui-express / openapi-types，可以加上类型：
// import { OpenAPIV3 } from 'openapi-types';
// export const openapiSpec: OpenAPIV3.Document = { ... };

const openapiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Express Todo API',
    version: '1.0.0',
    description:
      '一个基于 Node.js + Express + MongoDB + JWT + RBAC 的待办事项系统 API。\n' +
      '所有成功响应均为统一结构：{ success, code, message, data }，\n' +
      '错误响应为：{ success, code, message }。',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '本地开发环境',
    },
  ],
  tags: [
    { name: 'Auth', description: '用户注册 / 登录 / Token 管理' },
    { name: 'Todos', description: '待办任务管理（需要登录）' },
    { name: 'Projects', description: '项目 / 列表管理（需要登录）' },
    { name: 'Settings', description: '用户个人设置（需要登录）' },
    { name: 'Activity', description: '用户活动日志（需要登录）' },
    { name: 'Admin', description: '管理员功能（需要 admin 角色）' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // ===== 基础响应结构 =====
      BaseSuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          code: {
            type: 'integer',
            description: '业务状态码，0 表示成功',
            example: 0,
          },
          message: { type: 'string', example: 'OK' },
        },
      },
      BaseErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          code: {
            type: 'integer',
            description: 'HTTP 状态码或业务错误码',
            example: 400,
          },
          message: { type: 'string', example: '错误信息' },
        },
      },

      // ===== 通用实体 =====
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '664b53d1f6d8e1a5a6f2c0b1' },
          username: { type: 'string', example: 'alice' },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            description: '短期访问令牌（约 15 分钟）',
          },
          refreshToken: {
            type: 'string',
            description: '长期刷新令牌（约 7 天）',
          },
        },
      },
      Todo: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6650f4c9d3c8b0f3a25a1b2c' },
          title: { type: 'string', example: '学习 TypeScript' },
          completed: { type: 'boolean', example: false },
          userId: { type: 'string', example: '664b53d1f6d8e1a5a6f2c0b1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: '工作' },
          description: {
            type: 'string',
            nullable: true,
            example: '与公司相关的任务',
          },
          color: {
            type: 'string',
            nullable: true,
            example: '#FF0000',
          },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UserSettings: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          language: { type: 'string', example: 'zh-CN' },
          timezone: { type: 'string', example: 'Asia/Shanghai' },
          notifications: {
            type: 'object',
            properties: {
              email: { type: 'boolean', example: false },
              inApp: { type: 'boolean', example: true },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ActivityItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          type: {
            type: 'string',
            description: '活动类型',
            example: 'todo_created',
          },
          message: {
            type: 'string',
            example: '创建了任务：学习 TypeScript',
          },
          meta: {
            type: 'object',
            additionalProperties: true,
            nullable: true,
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // ===== 请求体 Schemas =====
      RegisterRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            minLength: 3,
            maxLength: 20,
            example: 'alice',
          },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 100,
            example: '123456',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'alice' },
          password: { type: 'string', example: '123456' },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      LogoutRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      CreateTodoRequest: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: '学习 TypeScript' },
        },
      },
      UpdateTodoRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: '学习 TypeScript（已更新）',
          },
          completed: { type: 'boolean', example: true },
        },
      },
      CreateProjectRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: '工作项目' },
          description: {
            type: 'string',
            nullable: true,
            example: '与公司相关的任务',
          },
          color: {
            type: 'string',
            nullable: true,
            example: '#FF0000',
          },
        },
      },
      UpdateProjectRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: '更新后的项目名称' },
          description: { type: 'string', nullable: true },
          color: { type: 'string', nullable: true, example: '#00FF00' },
        },
      },
      UpdateSettingsRequest: {
        type: 'object',
        properties: {
          language: { type: 'string', example: 'zh-CN' },
          timezone: { type: 'string', example: 'Asia/Shanghai' },
          notifications: {
            type: 'object',
            properties: {
              email: { type: 'boolean' },
              inApp: { type: 'boolean' },
            },
          },
        },
      },
    },
    responses: {
      ErrorResponse: {
        description: '通用错误响应',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BaseErrorResponse',
            },
          },
        },
      },
    },
  },

  paths: {
    // ======================= Auth =========================
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: '用户注册',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '注册成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
          '409': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: '用户登录',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '登录成功，返回 accessToken 和 refreshToken',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/AuthTokens',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: '获取当前登录用户信息',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '返回当前用户基本信息',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: '使用 refreshToken 刷新 accessToken',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RefreshTokenRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '返回新的 accessToken',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            accessToken: { type: 'string' },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: '注销，废弃 refreshToken',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LogoutRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '注销成功',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BaseSuccessResponse',
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    // ======================= Todos =========================
    '/todos': {
      get: {
        tags: ['Todos'],
        summary: '获取当前用户的所有 Todo',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '返回当前用户的 Todo 列表',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Todo' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
      post: {
        tags: ['Todos'],
        summary: '创建 Todo',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateTodoRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Todo' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    '/todos/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Todo ID',
          schema: { type: 'string' },
        },
      ],
      get: {
        tags: ['Todos'],
        summary: '获取单个 Todo',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '获取成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Todo' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/ErrorResponse' },
          '404': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
      put: {
        tags: ['Todos'],
        summary: '更新 Todo',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTodoRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Todo' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
          '404': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
      delete: {
        tags: ['Todos'],
        summary: '删除 Todo',
        security: [{ BearerAuth: [] }],
        responses: {
          '204': { description: '删除成功，无返回体' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
          '404': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    // ======================= Projects =========================
    '/projects': {
      get: {
        tags: ['Projects'],
        summary: '获取当前用户的项目列表',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '获取成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Project' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
      post: {
        tags: ['Projects'],
        summary: '创建项目',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateProjectRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Project' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    '/projects/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: '项目 ID',
        },
      ],
      get: {
        tags: ['Projects'],
        summary: '获取单个项目详情',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '获取成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Project' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/ErrorResponse' },
          '404': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
      put: {
        tags: ['Projects'],
        summary: '更新项目',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateProjectRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Project' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
          '404': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
      delete: {
        tags: ['Projects'],
        summary: '删除项目',
        description: '删除项目，同时会把该项目下 Todo 的 projectId 置为空',
        security: [{ BearerAuth: [] }],
        responses: {
          '204': { description: '删除成功' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
          '404': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    // ======================= Settings =========================
    '/settings/me': {
      get: {
        tags: ['Settings'],
        summary: '获取当前用户的设置',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '获取成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/UserSettings',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
      put: {
        tags: ['Settings'],
        summary: '更新当前用户的设置',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateSettingsRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/UserSettings',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ErrorResponse' },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    // ======================= Activity =========================
    '/activity/me': {
      get: {
        tags: ['Activity'],
        summary: '获取当前用户活动列表',
        description: '默认返回最近 20 条活动，可通过 limit 控制。',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 20,
            },
            description: '返回的最大活动条数',
          },
        ],
        responses: {
          '200': {
            description: '获取成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/ActivityItem',
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },

    // ======================= Admin =========================
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: '获取所有用户列表（管理员）',
        description: '需要 admin 角色',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '获取成功',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/BaseSuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/User' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/ErrorResponse' },
          '403': { $ref: '#/components/responses/ErrorResponse' },
        },
      },
    },
  },
} as const;

export default openapiSpec;