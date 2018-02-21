const { PORT = 5000 } = process.env;

require('./src/server').listen(PORT)
  .then(() => console.info(`[api] runing on localhost:${ PORT }`));
