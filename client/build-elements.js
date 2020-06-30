const fs = require("fs-extra");
const concat = require("concat");
// const firebase = require("firebase");
var admin = require("firebase-admin");

async function build() {
  try {
    console.log("Building..");
    const files = [
      "./dist/elements/runtime-es5.js",
      "./dist/elements/runtime-es2015.js",
      // "./dist/elements/polyfills-es5.js",
      "./dist/elements/polyfills-es2015.js",
      "./dist/elements/scripts.js",
      "./dist/elements/main-es5.js",
      "./dist/elements/main-es2015.js"
    ];
    await fs.ensureDir("elements");
    await concat(files, "elements/star-search.js");
    await fs.copyFile("./dist/elements/styles.css", "elements/star-search.css");
    await fs.copyFile("./dist/elements/index.html", "elements/index.html");
    await fs.copy("./dist/elements/assets/", "elements/assets/");
    console.log("Build Complete. Uploading..");
    await deploy();
    return;
  } catch (err) {
    throw new Error("Error", err);
  }
}

async function deploy() {
  try {
    var serviceAccount = require("./service_act.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://star-search.firebaseio.com",
      storageBucket: "star-search.appspot.com"
    });

    var bucket = admin.storage().bucket();
    const file = "elements/star-search.js";
    await bucket.upload(file, {
      destination: "cdn/star-search.js",
      metadata: {
        contentType: "text/javascript"
      }
    });
    console.log("Upload JS Complete");

    const css = "elements/star-search.css";
    await bucket.upload(css, {
      destination: "cdn/star-search.css",
      metadata: {
        contentType: "text/css"
      }
    });
    console.log("Upload CSS Complete");
  } catch (err) {
    console.log(err);
    // throw new Error(err);
  }
}

build();
