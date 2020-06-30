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
    await fs.ensureDir("tball");
    await concat(files, "tball/tball.js");
    await fs.copyFile("./dist/tball/styles.css", "tball/tball.css");
    // await fs.copyFile("./dist/elements/index.html", "elements/index.html");
    // await fs.copy("./dist/elements/assets/", "elements/assets/");
    console.log("Build Complete. Uploading..");
    await deploy();
    return;
  } catch (err) {
    throw new Error("Error", err);
  }
}

async function deploy() {
  try {
    admin.initializeApp({
      apiKey: "AIzaSyB8Od_Fil7cNDv4oJxoIEsPLX9zSN84i94",
      authDomain: "your-dog-here.firebaseapp.com",
      projectId: "your-dog-here",
      storageBucket: "your-dog-here.appspot.com"
    });
    var bucket = admin.storage().bucket();
    const file = "tball/tball.js";
    const metadata = {
      contentType: "text/javascript"
    };
    await bucket.upload(file, {
      destination: "cdn/stories/tball.js",
      metadata: metadata
    });
    console.log("Upload Complete");
  } catch (err) {
    throw new Error(err);
  }
}

build();
