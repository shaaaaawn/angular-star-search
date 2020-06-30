const fs = require("fs");
const files = ["cache/_stars.json", "cache/_winners.json"];

let cacheInterval = 60 * 50000000; //50 = minutes

module.exports = {
  setCacheInterval: function(interval) {
    cacheInterval = interval;
  },

  clearCache: function() {
    try {
      for (let file of files) {
        if (fs.existsSync(file)) {
          fs.unlink(file, err => {
            if (err) throw err;
          });
        }
      }
      return true;
    } catch (err) {
      throw new Error(err);
    }
  },

  writeCacheWithPath: function(path, object) {
    var pathComponents = path.split("/");
    var intermediatePath = "";

    for (var i = 0; i < pathComponents.length - 1; i++) {
      var pathComponent = pathComponents[i];
      pathComponent = pathComponent + "/";
      intermediatePath = intermediatePath + pathComponent;

      if (fs.existsSync(intermediatePath) !== true) {
        fs.mkdirSync(intermediatePath);
      }
    }

    fs.writeFile(path, JSON.stringify(object), err => {
      if (err) throw err;
      else console.log("Cache write succeeded: " + path);
    });
  },

  readCacheWithPath: function(path) {
    var shouldSendCache = false;

    if (fs.existsSync(path)) {
      var cachedTime = fs.statSync(path).ctime;

      if (new Date().getTime() / 1000.0 - cachedTime / 1000.0 < cacheInterval) {
        shouldSendCache = true;
      }
    }

    if (!shouldSendCache) return null;
    else return JSON.parse(fs.readFileSync(path, "utf8"));
  }
};
