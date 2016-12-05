/**
 * Created by a7268 on 2016/11/29.
 */

var windowHeight;       //浏览器窗口高度
var $body = $("body");

//自适应页的高度为浏览器可见高度
+function ($) {
    var $style = $("<style>");
    $("head").append($style);

    function setHeight() {
        var scrollScale = windowHeight;
        windowHeight = $(window).height();
        scrollScale = windowHeight / scrollScale;
        $(document).scrollTop($(document).scrollTop() * scrollScale);
        $style.html(".pager{height:" + windowHeight + "px}");
    }

    setHeight();

    $(window).on("resize", setHeight);
}(jQuery);

//skill-bubble效果
+function ($) {
    var $skill = $(".skill-bubble").find("a");
    var len = $skill.length;
    var duration = 2000;
    var randoms = [];

    function addRandom() {      //随机生成不重复的位置
        var random = {};
        random.left = Math.random();
        random.top = Math.random();
        for (var i = 0; i < randoms.length; i++) {
            if (Math.abs(random.left - randoms[i].left) < 0.1) {
                if (Math.abs(random.top - randoms[i].top) < 0.1) {
                    random.top = Math.random();
                    i = 0;
                }
            }
        }
        randoms.push(random);
    }

    for (var i = 0; i < len; i++) {
        addRandom();
    }

    function bubbleAnimate($elt) {
        function animateStep(now, fx) {     //动画每步执行命令
            if (fx.prop === "marginTop") {
                $(fx.elem).css({
                    transform: "scale(" + now + ")"
                });
            }
        }

        function eltCSSInit() {         //初始化CSS
            $elt.css({
                left: randoms[0].left * 90 + "%",
                top: randoms[0].top * 95 + "%",
                transform: "scale(1)",
                opacity: 0,
                zIndex: -1000,
                marginTop: 1,
                color: "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")"
            });
            randoms.shift();
            addRandom();
        }

        eltCSSInit();

        $elt.animate({
            zIndex: 0,
            opacity: 1,
            marginTop: 2
        }, {
            duration: duration,
            step: animateStep,
            easing: "linear",
            queue: true
        }).animate({
            zIndex: 1000,
            opacity: 0,
            marginTop: 3
        }, {
            duration: duration,
            step: animateStep,
            easing: "linear",
            queue: true,
            complete: function () {
                eltCSSInit();
                setTimeout(function () {
                    bubbleAnimate($elt);
                }, 0);
            }
        });
    }

    $skill.each(function (i) {
            var $elt = $(this);
            setTimeout(function () {
                bubbleAnimate($elt)
            }, i * 500);
        }
    )
}(jQuery);

//鼠标/触摸与导航单击了下滚翻页效果
+function ($) {
    function animating(scrollTop) {
        $body.addClass("trundle");
        $body.animate({
            scrollTop: scrollTop
        }, 500, function () {
            $body.removeClass("trundle")
        })
    }

    //滚轮事件
    $(window).on("mousewheel", function (e) {
        if (!$body.hasClass("trundle")) {
            var scrollTop = windowHeight;
            var scrollRote = $(document).scrollTop() / scrollTop;
            if (e.originalEvent.wheelDelta > 0) {
                scrollTop *= scrollRote - 1;
            }
            else {
                scrollTop *= scrollRote + 1;
            }
            animating(scrollTop);
        }
        e.stopPropagation();
    });

    //触摸事件
    $body.on("touchstart touchend", function (e) {
        if (e.type == "touchstart") {
            var touchstart = e.touches[0];
            console.log(touchstart)
        }
        if (e.type == "touchend") {
        }
    });

    //导航了单击事件
    var navLI = $("ul.navbar-nav>li");
    navLI.each(function (i) {
        $(this).prop("data-pager", i);
    });
    navLI.on("click", function (e) {
        if (!$body.hasClass("trundle")) {
            var $target = $(e.target).parent();
            if (!$target.hasClass("current")) {
                navLI.removeClass("current");
                $target.addClass("current");
                var scrollTop = $("#" + $target.prop("data-pager")).offset().top;
                animating(scrollTop);
            }
        }
    });

    //fluid按钮单击事件
    var fluid = $(".container-fluid>a");
    fluid.on("click", function () {
        animating(0);
    })
}(jQuery);