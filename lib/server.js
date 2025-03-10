import AutoLoad from '@fastify/autoload';
import Sensible from '@fastify/sensible';
import Env from '@fastify/env';
import Cors from '@fastify/cors';
import S from 'fluent-json-schema';
import { join } from 'desm';
import models from './models/index.js';

/**
 * This is the entry point of our application. As everything in Fastify is a plugin.
 * The main reason why the entry point is a plugin as well is that we can easily
 * import it in our testing suite and add this application as a subcomponent
 * of another Fastify application. The encapsulaton system, of Fastify will make sure
 * that you are not leaking dependencies and business logic.
 * For more info, see https://www.fastify.io/docs/latest/Encapsulation/
 */
async function server(fastify, opts) {
  // The `fastify-env` plugin will expose those configuration
  // under `fastify.config` and validate those at startup.
  await fastify.register(Env, {
    schema: S.object()
      .prop('NODE_ENV', S.string().required())
      .valueOf(),
  });

  // `fastify-sensible` adds many  small utilities, such as nice http errors.
  await fastify.register(Sensible);

  await fastify.register(Cors, {
    origin: '*',
  });

  // mongo swagger redis
  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins'),
    options: { ...opts },
  });
  // mongo models
  await fastify.register(models);

  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'services'),
    dirNameRoutePrefix: false,
    options: { ...opts },
  });

  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'routes'),
    dirNameRoutePrefix: false,
    options: { ...opts },
  });
}

export default server;
