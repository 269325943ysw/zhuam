// 导入 express
const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入文章的路由处理函数模块
const article_handler = require('../router_handler/article');
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入文章的验证模块
const { add_article_schema, delete_article_schema } = require('../schema/article');
const { get_article_schema, update_article_schema } = require('../schema/article');

// 注意：使用 express.urlencoded() 中间件无法解析 multipart/form-data 格式的请求体数据。
// 导入解析 formdata 格式表单数据的包
const multer = require('multer');
// 导入处理路径的核心模块
const path = require('path');
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') });


// 发布新文章的路由
// 注意：在当前的路由中，先后使用了两个中间件：
//      先使用 multer 解析表单数据
//      再使用 expressJoi 对解析的表单数据进行验证
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
//      将文件类型的数据，解析并挂载到 req.file 属性中
//      将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle);

// 获取文章的列表数据的路由
router.get('/list', article_handler.getArticles);
// 榜单信息
router.get('/HotList', article_handler.getlikeList);


// 删除文章的路由
router.get('/delete/:id', expressJoi(delete_article_schema), article_handler.deleteArtById);


// 根据 Id 获取文章详情 的路由
router.get('/:id', expressJoi(get_article_schema), article_handler.getArticleById);



// 更新文章的路由
router.post('/edit', upload.single('cover_img'), expressJoi(update_article_schema), article_handler.updateArticleById);



// 向外共享路由对象
module.exports = router;