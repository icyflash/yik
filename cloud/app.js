var shortId = require('shortid');
var crypto = require('crypto');
var wechat = require('wechat');

// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views', 'cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 对象
var YikMsg = AV.Object.extend('YikMsg');

// 配置
var config = {
    //微信相关配置
    wechat:{
        token: '',
        appid: '',
        encodingAESKey: ''
    },
    //域名设置，保留/s/，如果不想以/s/结尾，请在164行附近，更改相关路由
    url:'https://example.com/s/'
};

// 方法
/**
 * 添加消息
 * @param res
 * @param msg {String} - 消息内容
 * @param type {String} - 来源 微信wechat, 网页web, api
 */
function addMsg(res, msg, type){
    if (msg && msg.trim() != '') {
        var yikMsg = new YikMsg();
        var sid = shortId.generate();
        var saltstr = (new Date().getTime()) + config.wechat.token;
        var pwd = crypto.createHash('md5').update(saltstr).digest("hex").substr(0, 4);
        yikMsg.set('content', msg);
        yikMsg.set('sid', sid);
        yikMsg.set('pwd', pwd);
        yikMsg.save(null, {
            success: function () {
                switch (type){
                    case "wechat":
                        var result = '点击查看好友发给你的消息 ' + config.url + sid + ' 密码：' + pwd;
                        res.reply(result);
                        break;
                    case "api":
                        break;
                    case "web":
                    default :
                        var result = '链接 ' + config.url + sid + ' 密码：' + pwd;
                        res.render('message', {message: result});
                        break;
                }
            },
            error: function (error) {
                switch (type){
                    case "wechat":
                        res.reply("生成失败，请稍后重试")
                        break;
                    case "api":
                        break;
                    case "web":
                    default :
                        res.render('message', {message: '消息已自动删除或密码错误'});
                        break;
                }
            }
        });
    } else {
        switch (type){
            case "wechat":
                res.reply("生成失败，请稍后重试")
                break;
            case "api":
                break;
            case "web":
            default :
                res.render('message', {message: '消息已自动删除或密码错误'});
                break;
        }
    }
}


// 首页
app.get('/', function (req, res) {
    res.render('index');
});
// 操作结果显示
app.get('/message', function (req, res) {
    res.render('message', {message: "你好，一刻"});
});
// 添加消息
app.post('/add', function (req, res) {
    var msg = req.body.content;
    addMsg(res,msg,'web');
});
// 删除消息
app.post('/delete', function (req, res) {
    var query = new AV.Query(YikMsg);
    var sid = req.body.sid;
    query.equalTo("sid", sid);
    query.first({
        success: function (result) {
            if (result.get('pwd') === req.body.pwd) {
                result.destroy({
                    success: function () {
                        res.render('message', {message: '消息已删除'});
                    },
                    error: function () {
                        res.render('message', {message: '密码错误'});
                    }
                });
            } else {
                res.render('message', {message: '消息已自动删除或密码错误'});
            }
        },
        error: function (error) {
            res.render('message', {message: '消息已自动删除或密码错误'});
        }
    });
});
// 显示消息
app.post('/show', function (req, res) {
    var query = new AV.Query(YikMsg);
    var sid = req.body.sid;
    query.equalTo("sid", sid);
    query.first({
        success: function (result) {
            if (result.get('pwd') === req.body.pwd) {
                res.render('show', {message: result.get('content'), sid: sid});
            } else {
                res.render('message', {message: '消息已自动删除或密码错误'});
            }
        },
        error: function (error) {
            res.render('message', {message: '消息已自动删除或密码错误'});
        }
    });
});

app.param(function (name, fn) {
    if (fn instanceof RegExp) {
        return function (req, res, next, val) {
            var captures;
            if (captures = fn.exec(String(val))) {
                req.params[name] = captures;
                next();
            } else {
                next('route');
            }
        }
    }
});

app.param('id', /^[A-Za-z0-9-_]{7,11}$/);
// 提取消息
app.get('/s/:id', function (req, res) {
    var sid = req.params.id;
    if (sid != '') {
        res.render('get', {sid: sid});
    } else {
        res.render('message', {message: sid});
    }
});

app.use(express.query());

// 微信接口
app.use('/wechat', wechat(config.wechat).text(function (message, req, res, next) {
    var msg = message.Content;
    addMsg(res,msg,'wechat');
}).event(function (message, req, res, next) {
    if (message.Event === "subscribe") {
        res.reply("你好，一刻能帮您生成一条15分钟后自动销毁的信息，直接发送消息给我就可以啦")
    }
}).middlewarify());

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();