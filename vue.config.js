'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const FileManagerPlugin = require("filemanager-webpack-plugin")

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9530 // dev port

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
    },

    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [
            new FileManagerPlugin({
                events: {
                    onEnd: {
                        mkdir: ['./dist'], // 新加的一句代码
                        delete: [
                            './dist/dist.zip',
                        ],
                        archive: [
                            { source: './dist', destination: './dist/dist.zip' },
                        ]
                    }
                }
            })
        ]
    },

    chainWebpack(config) {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '汇友鹿学生端'
                return args
            })
    }
}