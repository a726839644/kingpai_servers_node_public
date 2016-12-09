/**
 * Created by a7268 on 2016/11/29.
 */

+function ($) {
    var windowHeight;       //浏览器窗口高度
    var $body = $("body");
    var $vertical = $(".vertical-carousel");
    var $verticalBox = $vertical.find(".vertical-carousel-box");

    $(window).ready(function () {
        setPageHeight();
        bubbleAnimate($(".skill-bubble").find("a"));
        urlToItem();
        touchEvent();
    });

    //自适应页的高度为浏览器可见高度
    function setPageHeight() {

        function setHeight() {
            windowHeight = $(window).height();
            $verticalBox.css({//修正位置
                transform: "translateY(-" + windowHeight * parseInt($verticalBox.find(".active").prop("id")) + "px)"
            });
            $vertical.attr("data-item-height", windowHeight);
        }

        setHeight();

        $(window).on("resize", setHeight);
    };

    //冒出效果
    function bubbleAnimate($elts) {
        var len = $elts.length;
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
                    zIndex: -2000,
                    marginTop: 1,
                    color: "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")"
                });
                randoms.shift();
                addRandom();
            }

            eltCSSInit();

            $elt.animate({
                zIndex: -1000,
                opacity: 1,
                marginTop: 1.5
            }, {
                duration: duration,
                step: animateStep,
                easing: "linear",
                queue: true
            }).animate({
                zIndex: 0,
                opacity: 0,
                marginTop: 2.5
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

        $elts.each(function (i) {
                var $elt = $(this);
                setTimeout(function () {
                    bubbleAnimate($elt)
                }, i * 500);
            }
        )
    }

    //根据url转到指定item
    function urlToItem() {
        var id = window.location.href.split("#")[1];
        if (id) {
            $vertical.vertical_carousel(parseInt(id));
        }
    }

    //touch事件
    function touchEvent() {
        $(document)
            .on("touch.kp.top", function () {
                $vertical.vertical_carousel("prev");
            })
            .on("touch.kp.down", function () {
                $vertical.vertical_carousel('next');
            });
    }
}(jQuery);
