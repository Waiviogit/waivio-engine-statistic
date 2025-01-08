import envSchema from 'env-schema';
import S from 'fluent-json-schema';
import hscSchemes from './schema/hsc/index.js';
import engineHistorySchemes from './schema/engineHistory/index.js';

async function getConfig() {
  const env = envSchema({
    dotenv: true,
    schema: S.object()
      .prop('NODE_ENV', S.string().required())
      .prop('API_HOST', S.string().required())
      .prop('API_PORT', S.string().required())
      .prop('API_PREFIX', S.string().required())
      .prop(
        'LOG_LEVEL',
        S.string()
          .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
          .default('info'),
      )
      .prop('JWT_SECRET', S.string().required())
      .prop('JWT_EXPIRES_IN', S.string().required())
      .prop('JWT_ISSUER', S.string().required())
      .prop('MONGO_URI_HSC', S.string().required())
      .prop('MONGO_URI_HISTORY', S.string().required())
      .prop('HASH_SALT_ROUNDS', S.number().default(10)),
  });

  const config = {
    prefix: env.API_PREFIX,
    fastify: {
      host: env.API_HOST,
      port: env.API_PORT,
    },
    fastifyInit: {
      // trustProxy: 2,
      // disableRequestLogging: true,
      logger: {
        level: env.LOG_LEVEL,
        serializers: {
          req: (request) => ({
            method: request.raw.method,
            url: request.raw.url,
            hostname: request.hostname,
          }),
          res: (response) => ({
            statusCode: response.statusCode,
          }),
        },
      },
      bodyLimit: 1048576 * 15, // 15 mb
    },
    security: {
      jwtSecret: env.JWT_SECRET,
      jwtExpiresIn: env.JWT_EXPIRES_IN,
      jwtIssuer: env.JWT_ISSUER,
      hashSaltRounds: env.HASH_SALT_ROUNDS,
    },
    mongo: {
      hsc: {
        uri: env.MONGO_URI_HSC,
        schemes: hscSchemes,
      },
      engine_history: {
        uri: env.MONGO_URI_HISTORY,
        schemes: engineHistorySchemes,
      },
    },
  };

  return config;
}

export default getConfig;
