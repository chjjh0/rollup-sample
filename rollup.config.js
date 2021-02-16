import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-generate-html-template'
import scss from 'rollup-plugin-scss'
import { terser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const isProd = process.env.NODE_ENV === 'production'
const extensions = ['.js', '.ts', '.tsx']

export default {
  input: 'src/index.tsx',
  output: {
    file: 'public/index.js',
    format: 'iife',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        isProd ? 'production' : 'development',
      ),
    }),
    resolve({
      extensions,
    }),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      extensions,
      exclude: /node_modules/,
      babelrc: false,
      runtimeHelpers: true,
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [
        'react-require',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        [
          '@babel/plugin-proposal-object-rest-spread',
          {
            useBuiltIns: true,
          },
        ],
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            helpers: true,
            regenerator: true,
            useESModules: false,
          },
        ],
      ],
    }),
    html({
      template: 'src/index.html',
      target: 'public/index.html',
    }),
    scss({
      output: 'public/index.css',
    }),
    isProd && terser(),
    !isProd &&
      serve({
        host: 'localhost',
        port: 3000,
        open: true,
        contentBase: ['public'],
      }),
    !isProd &&
      livereload({
        watch: 'public',
      }),
  ],
}
