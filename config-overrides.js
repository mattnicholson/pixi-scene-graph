module.exports = function override(config, env) {
  //do stuff with the webpack config...

  // Fix for pixi.js js module files not being handled properly
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });

  return config;
};
