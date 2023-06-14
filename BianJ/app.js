// 导入 express 模块
const express = require('express')
const cors = require('cors')

// 创建 express 的服务器实例
const app = express()

//导入解析表单的中间件
var bodyParser = require('body-parser');
// 解析 application/json
app.use(bodyParser.json());
// 解析 url编码
app.use(bodyParser.urlencoded({ extended: true }));
const joi = require("joi")

// 将 cors 注册为全局中间件,解决跨域问题
app.use(cors())

//在路由之前封装
app.use((req, res, next) => {
    //status,默认值是表示失败的情况
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })

    }

    next()
})

//在路由之前配置tiken中间件

// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

//开启静态资源访问
app.use('/uploads/', express.static('./uploads/'))
// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// write your code here...
//解析表单数据，注意：这个中间件只能解决
app.use(express.urlencoded({ extended: false }))

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)

// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)

// 导入并使用文章路由模块
const articleRouter = require('./router/article');
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter);

// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    //身份验证失败后
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    //不允许两次res.cc
    res.cc(err)
})


// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
})