import swaggerUi from 'swagger-ui-express';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'osu!LV Back API',
    version: '1.0.0',
    description: 'API for retrieving data for the landing page'
  },
  components: {
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic'
      }
    }
  },
  paths: {
    '/api/discordUserData': {
      post: {
        security: [{ basicAuth: [] }],
        tags: ['Users'],
        summary: 'Upsert user data',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  users: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        discord_id: { type: 'string' },
                        osu_id: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Users updated successfully'
          }
        }
      }
    },
    '/api/userRankings': {
      get: {
        security: [],
        tags: ['Stats'],
        summary: 'Get user rankings',
        responses: {
          '200': {
            description: 'List of user rankings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    rankings: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          countryRank: { type: 'number' },
                          osuUsername: { type: 'string' },
                          discordUsername: { type: 'string' },
                          globalRank: { type: 'number' },
                          performancePoints: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};