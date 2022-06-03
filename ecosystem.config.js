module.exports = {
  apps : [{
    name   : "iot",
    script : "./dist/app.js",
    watch: ["dist"],
    watch_delay: 5000,
  }]
}
