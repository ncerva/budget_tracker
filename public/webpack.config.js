const config = {
  // Update the entry point
  entry: "./src/app.js",
  output: {
    // Set the path and filename for the output bundle (hint: You will need to use "__dirname")
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  mode: "development",
};

module.exports = config;
