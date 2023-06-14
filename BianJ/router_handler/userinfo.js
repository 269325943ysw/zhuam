//导入数据库模块
const db = require("../db/index")

//获取用户基本的处理函数
exports.getUserInfo = (req, res) => {
    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc('获取用户信息失败！')

        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0],
        })
    })
}


// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    const sql = `update ev_users set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')

        // 修改用户信息成功
        return res.cc('修改用户基本信息成功！', 0)
    })

}

// 重置密码的处理函数
exports.updatePassword = (req, res) => {
    // 定义根据 id 查询用户数据的 SQL 语句
    const sql = `select * from ev_users where id=?`

    // 执行 SQL 语句查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 检查指定 id 的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在！')

        // 在头部区域导入 bcryptjs 后，
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        const bcrypt = require('bcryptjs')

        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        // 定义更新用户密码的 SQL 语句
        const sql = `update ev_users set password=? where id=?`

        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        // 执行 SQL 语句，根据 id 更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')

            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })
    })

}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic=? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')

        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
    })
}
//点赞数据处理
exports.likeArticles = (req, res) => {
    const sql = 'select like_text from ev_articles where id=?'
    db.query(sql, req.query.text_id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章信息失败！');
        // 把数据响应给客户端
        var shu = results[0].like_text
        var num = parseInt(shu);
        var shuu = num + 1
        const sql = 'update ev_articles set like_text=? where id=?'
        db.query(sql, [shuu, req.query.text_id], () => {
            const sql = 'select like_text from ev_articles where id=?'
            db.query(sql, req.query.text_id, (err, results) => {
                res.send({
                    status: 0,
                    message: '点赞成功',
                    data: results[0],
                })
            })
        })

    })

}

// 用户点赞信息
exports.likeArticleById = (req, res) => {
    if (req.query.text_id != null) {
        // 如果不为空执行这条
        const sql = `select like_id from ev_users where id=?`;
        // 查询
        db.query(sql, req.user.id, (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err);
            // SQL 语句执行成功，但是没有查询到任何数据
            if (results.length !== 1) return res.cc('没有点赞数据');
            // 把数据响应给客户端
            var id = results[0].like_id
            var newlike_id = id + ',' + req.query.text_id
            //插入
            const sql = 'update ev_users set like_id=? where id=?'
            db.query(sql, [newlike_id, req.user.id], () => {

            })
        })
    }
    //为空执行这条
    else {
        const sql = `select like_id from ev_users where id=?`;
        db.query(sql, req.user.id, (err, results) => {
            let arr = results[0].like_id.split(",");

            res.send({
                status: 0,
                message: '获取点赞数据成功',
                data: arr,
            })
        })
    }
}
