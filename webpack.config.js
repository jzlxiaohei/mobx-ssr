const path = require("path");
const webpack = require("webpack");
const devEnv = process.env.NODE_ENV !== 'production';
const autoprefixer = require('autoprefixer');

const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  })
];

if (!devEnv) {
  plugins.unshift(new webpack.optimize.UglifyJsPlugin({
    output: { comments: false },
    compress: { warnings: false }
  }));
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoErrorsPlugin());
}


const entries = {
  main: ['./src/main.js']
};


if (devEnv) {
  for (var i in entries) {
    entries[i].unshift('webpack-hot-middleware/client?reload=false')
  }
}

const config = {

  entry: entries,
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: '',
    filename: devEnv ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js', //
    libraryTarget: 'umd',
  },
  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    },
    'react-addons-css-transition-group': {
      root: [
        'React',
        'addons',
        'CSSTransitionGroup'
      ],
      commonjs: 'react-addons-css-transition-group',
      commonjs2: 'react-addons-css-transition-group',
      amd: 'react-addons-css-transition-group'
    },
    'react-addons-perf': {
      root: [
        'React',
        'addons',
        'Perf'
      ],
      commonjs: 'react-addons-perf',
      commonjs2: 'react-addons-perf',
      amd: 'react-addons-perf'
    },
    'react-router': {
      root: 'ReactRouter',
      commonjs: 'react-router',
      commonjs2: 'react-router',
      amd: 'react-router',
    }
  },
  module: {
    // preLoaders: [
    //   {
    //     test: /\.(js|jsx)$/,
    //     include: path.join(__dirname, 'src/app'),
    //     loader: 'eslint-loader'
    //   }
    // ],
    loaders: [
      {
        test: /\.css$/,
        loader: devEnv ? 'style-loader!css-loader' : 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.scss$/,
        loader: devEnv ? 'style-loader!css-loader!sass-loader?outputStyle=expanded' : 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel?cacheDirectory=true']
      }
    ]
  },

  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx',
      '.css',
      '.scss'
    ],
    alias: {
      utils: __dirname + '/src/app/utils',
      components: __dirname + '/src/app/components',
      infra: __dirname + '/src/app/infrastructure',
      models: __dirname + '/src/app/models',
    }
  },
  plugins: plugins,
  postcss: function () {
    return [autoprefixer];
  }
};

if (devEnv) {
  config.devtool = "#eval-source-map";
  config.debug = true;
  config.cache = true;
}

module.exports = config;
