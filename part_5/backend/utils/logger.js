const log = (type, ...params) => process.env.NODE_ENV !== 'test' && console[type](...params)

module.exports = {
  info: (...params) => log('log', ...params),
  error: (...params) => log('error', ...params),
}
