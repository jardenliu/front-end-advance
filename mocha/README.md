# mocha进阶
> 学习记录梳理

## 安装

全局安装：
```bash
$ npm installl mocha  -g
```

项目依赖安装：
```bash
$ npm install  mocha -D
```

设置测试脚本：`package.json`内设置
```javascript
"scripts":{
    "test": "mocha"
}
```

运行测试
```bash
$ npm test
```

## 示例
从`test`文件夹顺序查看