module.exports = (modules, data = {}) => {
  for (let module of modules) {
    module(data)
  }
}