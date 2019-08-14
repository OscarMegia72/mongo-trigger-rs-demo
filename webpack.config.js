var path = require('path')
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    // main: path.resolve(__dirname, 'src/server/main.js'),
    main_vue: path.resolve(__dirname, 'src/server/main_vue.js')
  },
  output: {
      path: path.resolve(__dirname, 'src/server/public/dist'),
      filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/images/[name].[ext]',
            }
          },
        ]
      },
      {
        test: /.*\.(ttf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/fonts/[name].[ext]',
            }
          },
        ]
      }
      ,
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      },
      { 
        test: /\.less$/,
        use: [ 
          'vue-style-loader',
            'css-loader', 
            'less-loader'
        ],
      },
      
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        
      },
      
    ]
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new VueLoaderPlugin()
    
]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
