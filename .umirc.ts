import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  outputPath: 'qrcode-scanner/pages',
  treeShaking: true,
  history: "hash",
  publicPath: './',
  hash: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: false,
      title: 'test',
      dll: false,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
}

export default config;
