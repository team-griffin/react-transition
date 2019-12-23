const path = require("path");

module.exports = ({ config, mode }) => {
  config.resolve.extensions = [ '.js', '.json', '.mjs', '.ts', '.tsx' ];
  
  config.module.rules.push(
    {
      test: /\.ts(x)?$/,
      loader: 'babel-loader',
    },
  );

  config.resolve.extensions = config.resolve.extensions.concat([ '.ts', '.tsx' ]);

  return config;
};
