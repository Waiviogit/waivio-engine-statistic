import fp from 'fastify-plugin';
import mongoose from 'mongoose';

async function fastifyMongoDb(fastify, options, next) {
  try {
    const { mongo } = options;
    const hscDB = await mongoose.connect(mongo.hsc.uri);
    fastify.log.info('hsc db connected');
    const engineHistoryDB = await mongoose.createConnection(mongo.engine_history.uri, {
      maxPoolSize: 300,
      socketTimeoutMS: 60000,
    });
    fastify.log.info('engine_history db connected');

    for (const wM of mongo.hsc.schemes) hscDB.model(wM.name, wM.schema, wM.collection);
    for (const sM of mongo.engine_history.schemes) {
      engineHistoryDB.model(sM.name, sM.schema, sM.collection);
    }

    fastify
      .decorate('hscDB', hscDB)
      .addHook('onClose', async (instance, done) => {
        await hscDB.connection.close(false);
        delete instance.hscDB;
        done();
      });

    fastify
      .decorate('engineHistoryDB', engineHistoryDB)
      .addHook('onClose', async (instance, done) => {
        await engineHistoryDB.connection.close(false);
        delete instance.engineHistoryDB;
        done();
      });

    next();
  } catch (err) {
    next(err);
  }
}

export default fp(fastifyMongoDb, { name: 'fastify-mongoDb' });
