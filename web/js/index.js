
$(function () {
    // 欢迎弹窗
    $(document).ready(function () {
        //模拟点击事件
        // $(".active").trigger("click");
        $(".Welcome").fadeIn();
        setTimeout(function () {
            $(".Welcome").addClass("Welcome2");
        }, 5000); // 延迟5秒执行
    });
    // 导航栏js
    $("#nav-1 a").on("click", function () {
        var position = $(this)
            .parent()
            .position();
        var width = $(this)
            .parent()
            .width();
        $("#nav-1 .slide1").css({ opacity: 1, left: +position.left, width: width });
    });
    $("#nav-1 a").on("mouseover", function () {
        var position = $(this)
            .parent()
            .position();
        var width = $(this)
            .parent()
            .width();
        $("#nav-1 .slide2")
            .css({
                opacity: 1,
                left: +position.left,
                width: width
            })
            .addClass("squeeze");
    });
    $("#nav-1 a").on("mouseout", function () {
        $("#nav-1 .slide2")
            .css({ opacity: 0 })
            .removeClass("squeeze");
    });
    var currentWidth = $("#nav-1 .nav")
        .find(".active")
        .parent("li")
        .width();
    var current = $(".nav .active").position();
    $("#nav-1 .slide1").css({ left: +current.left, width: currentWidth });

    // 导航栏内搜索框jq
    const suggestions = $('.type-ahead__suggestions');
    const input = $('.type-ahead__input');

    suggestions.on('click', (e) => {
        if ($(e.target).hasClass('match')) {
            input.val($(e.target).parent().text());
        } else {
            input.val($(e.target).text());
        }
        suggestions.addClass('hidden');
    });

    input.on('keyup', (e) => {
        if (e.code === 'Enter') return suggestions.addClass('hidden');
        const text = $(e.target).val();
        if (!text) {
            return suggestions.addClass('hidden');
        } else {
            suggestions.removeClass('hidden');
            const suggestionItems = `
			<li class="suggestion"><span class="match">${text}</span></li>
			<li class="suggestion">${highLightMatch('网页特效', text)}</li>
			<li class="suggestion">${highLightMatch('图片代码', text)}</li>
			<li class="suggestion">${highLightMatch('H5动画', text)}</li>
            `;
            suggestions.html(suggestionItems);
        };
    });

    function highLightMatch(sentence, targetText) {
        const regex = new RegExp(targetText, 'gi');
        return sentence.replace(regex, `<span class="match">${targetText}</span>`);
    }
    $('#textshuj').click(() => {

        if (($(".index_right2").offset().top) > 670) {
            $(".index_right2").css("top", -10)
        }
        else {
            $(".index_right2").css("top", + 120)
            console.log($(".index_right2").offset().top);
        }
    })
    $('#textshui').click(() => {

        if (($(".index_right2").offset().top) > 670) {
            $(".index_right2").css("top", -10)
        }
        else {
            $(".index_right2").css("top", + 120)
            console.log($(".index_right2").offset().top);
        }
    })


    // 获取页面高度改变定位方式
    $(window).scroll(function () {
        var currentPos = $(this).scrollTop();
        if (currentPos >= 463) {
            $(".index_right2").css("top", currentPos - 480)
        }
        if (currentPos >= 270) {
            $(".index_left").css("top", currentPos - 270)
        }
        if (currentPos >= 270) {
            $(".nav_box").fadeIn("hide");
            $
        } else {
            $(".nav_box").fadeOut('show');
            $(".index_right2").css("top", -7)
            $(".index_left").css("top", 0)

        }
    });

    // 点击放大缩小实现
    // var indexEdit = null
    $('.publish_box_1').on('click', '.mask', function () {
        $(this).parent().removeClass('articleImage_boz').addClass('articleImage_box');
    })
    $('.publish_box_1').on('click', '.articleImage_box', function () {
        $(this).removeClass('articleImage_box').addClass('articleImage_boz');
    })
    // 发布文章功能实现
    layui.use(function () {
        var layer = layui.layer;
        var util = layui.util;
        // 事件
        util.on('lay-on', {
            'test-skin-win10-page': function () {
                // 此处以一个简单的 Win10 风格记事本为例
                layer.open({
                    type: 1, // 页面层类型
                    skin: 'layui-layer-win10', // 2.8+
                    shade: 0.01,
                    area: ['50%', '60%'],
                    maxmin: true,
                    title: '分享欲是高级浪漫',
                    content: [
                        '<div  style="height: 100%;  overflow: hidden;" >',
                        '<iframe src="./article/art_pub.html" width="100%" height="100% frameborder="no" ></iframe>',
                        '</div>',
                    ].join('')
                });
            },
        })
    });




    // 获取用户头像名字等js
    $(function () {
        // 调用 getUserInfo 获取用户基本信息
        getUserInfo()
        var layer = layui.layer
        // 点击按钮，实现退出功能
        $('#btnLogout').on('click', function () {
            // 提示用户是否确认退出
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
                //do something
                // 1. 清空本地存储中的 token
                localStorage.removeItem('token')
                // 2. 重新跳转到登录页面
                location.href = 'logoin.html'
                // 关闭 confirm 询问框
                layer.close(index)
            })
        })
    })
    // 获取用户的基本信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                // 调用 renderAvatar 渲染用户的头像
                renderAvatar(res.data)
                // 发个文章页面
                initTable(res.data.user_pic)

            }
        })
    }
    var today = new Date();
    var d = today.getHours();
    if (0 <= d && d < 12) {
        dazhaohu = '早上好鸭'
    }
    else if (12 <= d && d <= 14) {
        dazhaohu = '中午好鸭'
    }
    else if (14 < d && d <= 18) {
        dazhaohu = '下午好鸭'
    }
    else {
        dazhaohu = '晚上好鸭！'
    }
    // 渲染用户的头像
    function renderAvatar(user) {
        // 1. 获取用户的名称
        var name = user.nickname || user.username
        // 2. 设置欢迎的文本
        $('#welcome-p').html(dazhaohu + '！&nbsp;' + name)
        // 3. 按需渲染用户的头像
        if (user.user_pic !== null) {
            // 3.1 渲染图片头像
            $('.layui-nav-img')
                .attr('src', user.user_pic)
                .show()
            $('.text-avatar').hide()

        } else {
            // 3.2 渲染文本头像
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase()
            $('.text-avatar')
                .html(first)
                .show()
        }
    }

    //左边文章分类实现
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                indddd(res.data)
            }
        })
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //渲染左侧分类
    function indddd(user) {
        // table.empty();
        for (var i = 0; i < user.length; i++) {
            var element = user[i];
            var table = $('.classification');
            var row = $('<tr></tr>');
            row.append($('<td class="iconfont icon-ic_description_file24px "></td>').attr("name", element.Id).html(element.name));
            table.append(row);
        }
        //点击向ajax发送数据,进行分类查询
        $('.classification').on('click', '.icon-ic_description_file24px', function () {
            cate_id = $(this).attr('name')
            q.cate_id = cate_id;
            q.cx = 1;
            initTable()
        })
    }
    //点击查找自己的文章实现
    $('#mi_text').click(() => {
        q.cx = 3
        initTable()
    })
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态
        cx: 0
    }
    initTable()
    // 发布文章渲染
    function initTable(user_pl) {

        // 查找用户已经点赞的文章id文章
        func1()
        function func1() {
            // 向后台请求数据
            $.ajax({
                method: 'GET',
                url: '/my/likeid',
                success: function (res) {
                    // 获取a的值用回调函数传递给func2
                    var a = res.data
                    func2(a)
                }
            })
        }
        // 查找所有文章
        function func2(a) {

            $.ajax({
                // 发送ajax
                method: 'GET',
                url: '/my/article/list',
                data: q,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('暂时没有文章哦！')
                    }
                    //创建数组容器
                    var b = []
                    //便利数组传递到容器b中
                    for (let i = 0; i < res.data.length; i++) {
                        b.push(res.data[i].Id)
                    }
                    //把字符串类型的a数据转换为int数组类型
                    var A = a.map(function (item) {
                        return parseInt(item);
                    });
                    const set1 = new Set(A);
                    const set2 = new Set(b);
                    // 找出相同的元素
                    const commonElements = Array.from(set1).reduce((acc, element) => acc.concat(set2.has(element) ? [element] : []), []);

                    // 循环向每篇写入用户头像
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].user_pl = user_pl

                    }
                    // console.log(res.data);
                    // 使用模板引擎渲染页面的数据
                    var htmlStr = template('tpl-table', res)
                    $('.publish_box_1').html(htmlStr)
                    if ($(".pl_pic").attr("src") === "") {
                        $('.pl_pic').hide()
                        $('.text_pic').show()
                    } else {
                        // 3.1 渲染图片头像
                        $('.pl_pic').show()
                        $('.text_pic').hide()
                    }
                    //便利相同的id
                    for (let i = 0; i < commonElements.length; i++) {
                        var confirm = commonElements[i]
                        // 通过data-id改变类名
                        likelike(confirm)
                    }
                    function likelike(confirm) {
                        $('.icon-dianzan').attr('class', function (index, className) {

                            var id = $(this).attr("data-id");// 获取自定义的data-id的值
                            // console.log(id);

                            if (id == confirm) { // 如果data-id的值等于你要匹配的值
                                return className.replace('textlile', 'likelike'); // 将旧类名替换为新类名

                            } else {
                                return className; // 否则返回原始类名
                            }
                        });
                        // 把类名为likelike的矢量图标进行转换
                        $('.likelike').removeClass('icon-dianzan').addClass('icon-icon');
                    }
                    //点击评论模块再次点击消失
                    $('.publish_box_1').on('click', '.commentButton', function () {
                        for (let i = 0; i < res.data.length; i++) {
                            const element = 'a' + res.data[i].Id;
                            if (element == $(this).attr('data-id')) {
                                // console.log(name);
                                if ($('#' + element).css("height") == "500px") {

                                    $('#' + element).css("height", "0px");

                                    $('#' + element).focus();

                                } else {

                                    $('#' + element).css("height", "500px");
                                    $('#' + element).focus();

                                }
                            }
                        }
                    })
                    //分享模块
                    $('.publish_box_1').on('click', '.icon-fenxiang ', function () {
                        for (let i = 0; i < res.data.length; i++) {
                            const element = 'b' + res.data[i].Id;
                            const element2 = 'd' + res.data[i].Id;
                            // 分享
                            $("." + element2).click(function () {
                                console.log(11);
                                navigator.clipboard.writeText(location.innerHTML)
                                // var url = window.location.href;
                                layer.msg('已复制到粘贴板复制即可访问！')
                            });
                            if (element == $(this).attr('data-id')) {

                                if ($('#' + element).css("height") == "40px") {
                                    $('#' + element).css("height", "0px");
                                    $('#' + element).css("width", "0px");
                                    $('#' + element).focus();

                                } else {
                                    $('#' + element).css("height", "40px");
                                    $('#' + element).css("width", "100%");
                                    $('#' + element).focus();
                                }
                            }
                        }
                    })
                    //点击表情按钮调用表情模块，再次点击消失
                    $('.publish_box_1').on('click', '.chat-button-emoj', function () {
                        for (let i = 0; i < res.data.length; i++) {
                            const element = 'e' + res.data[i].Id;
                            var el = $('#' + element).text()
                            console.log(el);
                            if (element == $(this).attr('data-id')) {
                                // console.log(name);
                                if ($('#' + element).css("height") == "160px") {
                                    $('#' + element).css("height", "0px");
                                    $('#' + element).css("border-bottom", "0px solid black");
                                    $('#' + element).focus();
                                } else {
                                    $('#' + element).css("border-bottom", "5px solid #e7eaef");
                                    $('#' + element).css("height", "160px");
                                    $('#' + element).focus();
                                }
                            }
                        }
                    })

                }

            })
        }
    }

    //点赞功能实现
    $('.publish_box_1').on('click', '.textlile', function () {
        var text = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/textlike',
            data: {
                text_id: text
            },
        })
        var color = 'rgb(255, 130, 0)'
        if ($(this).css('color') != color) {
            $(this).css('color', '#ff8200');
            $(this).removeClass('icon-dianzan').addClass('icon-icon');
            var sun = $(this).text()
            sun = parseInt(sun) + 1;
            layer.msg('点赞成功，谢谢支持！')
            $(this).text(sun);
            userlike(text)
        }
    })
    //查询用户是否点赞
    function userlike(text) {
        $.ajax({
            method: 'GET',
            url: '/my/likeid',
            data: {
                text_id: text
            },
        })
    }
    HotList()
    function HotList() {
        // 点赞热榜
        $.ajax({
            method: 'GET',
            url: '/my/article/HotList',
            success: function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    var element = res.data[i];
                    var table = $('.HotList_text_p');
                    var row = $('<div></div>');
                    row.append($('<a class="HotList_text_A"></a>').html(i + 1));
                    row.append($('<a class="HotList_text_B"></a>').eq(0).html(element.title));
                    row.append($('<a class="iconfont icon-remen"></a>'))
                    table.append(row);
                }
            }
        })
    }
    //点击刷新实现
    $('.HotList_f5').click(() => {
        // 点赞热榜
        $.ajax({
            method: 'GET',
            url: '/my/article/HotList',
            success: function (res) {

                $('.HotList_text_p').empty();
                for (var i = 0; i < res.data.length; i++) {
                    var element = res.data[i];
                    var table = $('.HotList_text_p');
                    var row = $('<div></div>');
                    row.append($('<a class="HotList_text_A"></a>').html(i + 1));
                    row.append($('<a class="HotList_text_B"></a>').eq(0).html(element.title));
                    row.append($('<a class="iconfont icon-remen"></a>'))
                    table.append(row);
                    layer.msg('已经是最新点赞榜单！')

                }
            }
        })
    });

})
