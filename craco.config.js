module.exports = {
  plugins: [
    {
      plugin: require('craco-less'),
    },
  ],
  webpack: {
    configure: webpackConfig => {
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        include: /node_modules[\\/]@babel[\\/]runtime-corejs2[\\/]helpers[\\/]esm/,
        resolve: {
          fullySpecified: false,
        },
      });

      return webpackConfig;
    },
  },
};
