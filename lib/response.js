module.exports = {
    get headerSent () {
        return this.res.headerSent
    },
    set headerSent (val) {
        this.res.headerSent = val
    }
}