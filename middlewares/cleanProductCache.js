const {clearHash} = require('../services/cache');

const cleanProductCache = async (req, res, next) => {
    await next();

    clearHash(req.params.id);
};

module.exports = cleanProductCache;