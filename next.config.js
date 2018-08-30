const path = require('path')
const glob = require('glob')

module.exports = {
    webpack(config, options) {
        const { dir, defaultLoaders } = options

        // config.pageExtensions.push(".ts", ".tsx")

        config.resolve.extensions.push(".ts", ".tsx")

        config.module.rules.push(
            {
                test: /\.(ts|tsx)/,
                include: [dir],
                exclude: /node_modules/,
                use: [
                    defaultLoaders.babel,
                    {
                        loader: "awesome-typescript-loader",
                    }
                ]
            },
            {
                test: /\.(css|scss)/,
                loader: 'emit-file-loader',
                options: {
                    name: 'dist/[path][name].[ext]'
                }

            }
            ,
            {
                test: /\.css$/,
                use: ['babel-loader', 'raw-loader', 'postcss-loader']
            }
            ,
            {
                test: /\.s(a|c)ss$/,
                use: ['babel-loader', 'raw-loader', 'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['styles', 'node_modules']
                                .map((d) => path.join(__dirname, d))
                                .map((g) => glob.sync(g))
                                .reduce((a, c) => a.concat(c), [])
                        }
                    }
                ]
            }
        )
        return config
    }
}