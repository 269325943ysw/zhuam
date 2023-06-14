// 导入处理路径的 path 核心模块
const path = require('path');
// 导入数据库操作模块
const db = require('../db/index');



// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    //将 multer 解析出来的数据进行打印
    console.log(req.body); // 文本类型的数据
    console.log(req.file); // 文件类型的数据
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！');
    // 发布文章
    // 1.整理要插入数据库的文章信息对象
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    // 2.执行 SQL 语句
    const sql = `insert into ev_articles set ?`;
    db.query(sql, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('发布文章失败！');
        // 发布文章成功
        res.cc('发布文章成功', 0);
    })
}


// 获取文章的列表数据的处理函数
exports.getArticles = (req, res) => {
    var cx = req.query.cx
    //分类查询
    if (cx == 1) {
        const sql = 'select ea.*,eb.name,ec.nickname,user_pic from ev_articles as ea left join ev_users as ec on ea.author_id=ec.id left join ev_article_cate as eb on ea.cate_id=eb.Id where ea.is_delete=0 AND ea.cate_id=?  order by ea.id desc';
        db.query(sql, req.query.cate_id, (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err);
            // SQL 语句执行成功，但是没有查询到任何数据
            if (results.length == 0) return res.cc('获取文章分类失败！');
            // 把数据响应给客户端
            res.send({
                status: 0,
                message: '获取文章信息成功！',
                data: results,
            })
        })

    }
    //全部
    if (cx == 0) {
        // 根据分类的状态，获取所有未被删除的文章列表数据
        // is_delete 为 0 表示没有被 标记为删除 的数据
        const sql = 'select ea.*,eb.name,ec.nickname,user_pic from ev_articles as ea left join ev_users as ec on ea.author_id=ec.id left join ev_article_cate as eb on ea.cate_id=eb.Id where ea.is_delete=0 order by ea.id desc';
        db.query(sql, (err, results) => {
            // 1. 执行 SQL 语句失败
            if (err) return res.cc(err);
            // 2. 执行 SQL 语句成功
            res.send(
                {
                    status: 0,
                    message: '获取文章列表成功！',
                    data: results,
                }
            )
        })
    }
    //自己的
    if (cx == 3) {
        const sql = 'select ea.*,eb.name,ec.nickname,user_pic from ev_articles as ea left join ev_users as ec on ea.author_id=ec.id left join ev_article_cate as eb on ea.cate_id=eb.Id where ea.is_delete=0 AND ea.author_id=? order by ea.id desc';
        db.query(sql, req.user.id, (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err);
            // SQL 语句执行成功，但是没有查询到任何数据
            if (results.length == 0) return res.cc('用户没有发布');
            // 把数据响应给客户端
            res.send({
                status: 0,
                message: '获取文章信息成功！',
                data: results,
            })
        })
    }
}

//根据点赞对前十篇文章进行排行
exports.getlikeList = (req, res) => {
    const sql = 'SELECT title FROM ev_articles ORDER BY like_text DESC LIMIT 10'
    db.query(sql, (err, results) => {
        // 执行 SQL 语句失败
        console.log(req
        );
        if (err) return res.cc(err);
        // 把数据响应给客户端
        res.send({
            status: 0,
            message: '获取榜单成功！',
            data: results,
        })
    })
}

// 删除文章分类的处理函数
exports.deleteArtById = (req, res) => {
    const sql = `update ev_articles set is_delete=1 where id=?`;
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章失败！');
        // 删除文章分类成功
        res.cc('删除文章成功！', 0);
    })
}

// 根据 Id 获取文章信息的处理函数
exports.getArticleById = (req, res) => {
    const sql = `select * from ev_articles where id=?`;
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章信息失败！');
        // 把数据响应给客户端

        res.send({
            status: 0,
            message: '获取文章信息成功！',
            data: results[0],
        })
    })
}


// 更新文章的处理函数
exports.updateArticleById = (req, res) => {
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！');
    // 更新文章信息
    // 1.整理要修改入数据库的文章信息对象
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
    }
    // 2.执行 SQL 语句
    const sql = `update ev_articles set ? where Id=?`;
    db.query(sql, [articleInfo, req.body.Id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新文章失败！');
        // 更新文章分类成功
        res.cc('更新文章成功！');
    })
}


