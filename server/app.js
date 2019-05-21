

const express = require('express');
const app = express();


var httpProxy = require('http-proxy');
// 新建一个代理 Proxy Server 对象
var proxy = httpProxy.createProxyServer({});
var router = express.Router();

var env = process.env.SIT

// const DEV = 'http://172.16.200.110:30111';
// const SIT = 'http://172.16.200.112:30111';
// const UAT = 'http://47.106.46.65:30111';
// const PRD = 'http://120.78.25.128:30111';

let allRouter = router.all('/*', (req, res) => {
  if (req.url == '/gateway/get') {
    res.json({
      code: '0000',
      msg: null,
      data:env
    })
  } else {
    proxy.web(req, res, { target: env });
  }
});
app.use(express.static('./dist'));



app.use('', allRouter);





// 监听端口
app.listen(5001);
// http://127.0.0.1:5001
console.log('success listen at port:5001......');



