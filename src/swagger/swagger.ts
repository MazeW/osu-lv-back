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
    '/api/bestScores': {
      get: {
        security: [],
        tags: ['Stats'],
        summary: 'Get best scores for all users',
        responses: {
          '200': {
            description: 'List of best scores',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    scores: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          userId: { type: 'string' },
                          mode: { type: 'string' },
                          rank: { type: 'string', nullable: true },
                          mods: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          pp: { type: 'number' },
                          ppWeighted: { type: 'number' },
                          accuracy: { type: 'number' },
                          statistics: {
                            type: 'object',
                            properties: {
                              count_100: { type: 'number' },
                              count_300: { type: 'number' },
                              count_50: { type: 'number' },
                              count_geki: { type: 'number', nullable: true },
                              count_katu: { type: 'number', nullable: true },
                              count_miss: { type: 'number' }
                            }
                          },
                          beatmapArtist: { type: 'string' },
                          beatmapTitle: { type: 'string' },
                          beatmapDifficulty: { type: 'string' },
                          beatmapUrl: { type: 'string' },
                          covers: {
                            type: 'object',
                            properties: {
                              cover: { type: 'string' },
                              'cover@2x': { type: 'string' },
                              card: { type: 'string' },
                              'card@2x': { type: 'string' },
                              list: { type: 'string' },
                              'list@2x': { type: 'string' },
                              slimcover: { type: 'string' },
                              'slimcover@2x': { type: 'string' }
                            }
                          },
                          createdAt: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '420': {
            description: 'Internal server error'
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