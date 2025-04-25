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
                          stats: {
                            type: 'object',
                            properties: {
                              countryRank: { type: 'number' },
                              globalRank: { type: 'number' },
                              performancePoints: { type: 'number' }
                            }
                          },
                          user: {
                            type: 'object',
                            properties: {
                              country: { type: 'string' },
                              username: { type: 'string' },
                              osuId: { type: 'string' },
                              discordId: { type: 'string' },
                              deleted: { type: 'boolean' },
                              discordName: { type: 'string' },
                              discordUsername: { type: 'string' },
                              discordAvatar: { type: 'string' },
                              createdAt: { type: 'string', format: 'date-time' },
                              updatedAt: { type: 'string', format: 'date-time' }
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
    },
    '/api/triggerSync': {
      post: {
        security: [{ basicAuth: [] }],
        tags: ['Stats'],
        summary: 'Trigger user stats sync',
        responses: {
          '202': {
            description: 'Sync started'
          },
          '429': {
            description: 'Sync already in progress'
          }
        }
      }
    }
  }
};