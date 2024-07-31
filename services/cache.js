const mongoose = require('mongoose');
const Redis = require('ioredis');

const client = process.env.REDIS_URL 
    ? new Redis(REDIS_URL)
    :new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    });

const exec = mongoose.Query.prototype.exec;

/**
 *
 * @returns {mongoose.Query}
 */
// *** This is a cache function that we are adding to the mongoose.Query.prototype ***
mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name,
        })
    );

    // +[1] see if we have a value for 'key' in redis
    const cacheValue = await client.hget(this.hashKey, key);

    // +[2] if we do, return that
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        console.log('Response from Redis');
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }
    // +[3] otherwise, issue the query and store the result in redis

    const result = await exec.apply(this, arguments);
    await client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 1000);

    console.log('Response from MongoDB');
    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    },
};