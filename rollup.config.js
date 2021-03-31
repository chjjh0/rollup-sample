import pkg from "./package.json";
// plugin
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import cssbundle from "rollup-plugin-css-bundle";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".ts", ".tsx"];

export default {
  // 번들링 엔트리 파일 설정 (ReactDOM.render이 작성된 파일)
  input: "src/FloatButton/index.tsx",
  // 번들링 결과물 설정
  output: {
    file: pkg.main, // 파일명
    format: "es", // 파일포맷
    exports: "named",
  },
  // react, TS, CSS, SCSS, Emotion 등 해석을 위한 설정
  plugins: [
    // 해석할 파일의 확장자들
    resolve({
      extensions,
    }),
    // commonJS 로 작성된 경우 ES6로 바꿔 rollup이 해석가능하게 변환
    commonjs({
      include: /node_modules/,
    }),
    // 바벨 관련 설정
    babel({
      extensions,
      exclude: /node_modules/,
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      plugins: ["@emotion", ["module-resolver", { root: ["./src/"] }]],
    }),
    // cssbundle(),

    // 번들링 결과물의 html 파일 생성 설정
    // React 프로젝트에서 <div id='app'></div> 이 있는 html 파일과 동일한 역할
    // html({
    //   template: 'src/index.html', // 번들링 할 html 파일 위치
    //   target: 'public/index.html', // 번들링 결과물 경로, output 설정의 경로와 동일하게 설정
    // }),
    // 번들링 결과물의 minify 설정
    terser(),
    // devServer 설정
    // !isProd &&
    //   serve({
    //     host: 'localhost', //URL
    //     port: 3000, //포트번호
    //     open: true, //true 시 rollup.config.js에 변경이 일어나면 매번 새창으로 열림
    //     contentBase: ['public'], //devServer에 보여줄 '번들링 된 결과물'
    //   }),
    // hotReload 기능 활성화
    // public 또는 rollup.config.js에 변화가 발생하면 알아서 다시 번들링 해주고 새로고침해주는 기능
    // 이게 없으면 매번 수정 후 번들 따로 해주고 devserver 실행해주는 번거로움 발생
    // !isProd &&
    //   livereload({
    //     watch: 'public',
    //   }),
  ],
};
