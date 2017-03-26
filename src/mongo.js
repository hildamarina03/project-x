module.exports = {
  set: db => {
    this.db = db;
  },
  get: () => {
    return this.db;
  }
}
