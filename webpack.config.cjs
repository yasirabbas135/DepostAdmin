const path = require('path');

module.exports = {
  mode: 'development', // Set to 'production' for optimized builds
  entry: {
    linkedinContent: './src/entries/contentScript/platforms/Linkedin/linkedinContent.ts'
  },
  output: {
    filename: '[name].bundle.js', // Dynamically creates bundles for each entry
    path: path.resolve(__dirname, 'dist/assets/src/entries'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src/'),
    },
  },
  devtool: 'source-map', // Recommended for debugging during development
};
