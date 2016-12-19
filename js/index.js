/**
 * Created by a7268 on 2016/11/29.
 */

+function ($) {
    var $vertical = $(".vertical-carousel");
    var $verticalBox = $vertical.find(".vertical-carousel-box");

    $(window).on('load', function () {
        bubbleAnimate($(".languages").find("a"));
        touchEvent();
        typing();
    });

    //冒出效果
    function bubbleAnimate($elts) {
        var len = $elts.length;
        var duration = 2000;
        var randoms = [];
        var animationend = whichAnimationEvent();

        function whichAnimationEvent() {        //animation结束事件
            var t;
            var el = document.createElement('fakeelement');
            var animations = {
                'animation': 'animationend',
                'OAnimation': 'oAnimationEnd',
                'MozAnimation': 'animationend',
                'WebkitAnimation': 'webkitAnimationEnd'
            };
            for (t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        }

        function addRandom() {      //随机生成不重复的位置
            var random = {};
            var count = 0;
            for (var i = 0; i < randoms.length; i++) {
                random.left = Math.random();
                random.top = Math.random();
                if (Math.abs(random.left - randoms[i].left) < 0.4) {
                    if (Math.abs(random.top - randoms[i].top) < 0.3) {
                        random.top = Math.random();
                        i = 0;
                    }
                }
                if (++count > 1000) {  //防止死机
                    console.log(count);
                    break;
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
                randoms.shift();
                addRandom();
                $elt.css({
                    left: randoms[0].left * 85 + "%",
                    top: randoms[0].top * 95 + "%",
                    color: "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")"
                });
                if (!animationend) {
                    $elt.css({
                        transform: "scale(1)",
                        opacity: 0,
                        zIndex: -2000,
                        marginTop: 1
                    });
                }
                $elt.addClass("bubbling");
            }

            function animationEnd() {
                eltCSSInit();
                $elt.removeClass("bubbling");
                setTimeout(function () {
                    bubbleAnimate($elt);
                }, 0);
            }

            eltCSSInit();

            if (animationend) {
                $elt.one(animationend, animationEnd)
            }
            else {
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
                    complete: animationEnd
                });
            }
        }

        $elts.each(function (i) {
                var $elt = $(this);
                setTimeout(function () {
                    bubbleAnimate($elt)
                }, i * 600);
            }
        )
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

    //打字效果
    function typing() {
        var $text = $(".self-tall");
        var speed = 70;
        var s = [];
        s[0] = "熟练掌握HTML5、CSS3、";
        s[1] = "JavaScript、C/C++、C#、java、jQuery、";
        s[2] = "Bootstrap、nodejs，熟练使用npm、WebStorm、Sublime Text";
        s[3] = "较强的逻辑思维与自学能力，对前端技术有着浓厚的兴趣，渴望新知识，希望在实践中不断成长。";

        var i = 0, j = 0;
        var br = "\<br\>";

        out();

        function out() {
            var text = "";
            for (var z = 0; z < j; z++) {
                text += s[z] + br;
            }
            var interval = setInterval(function () {
                if (i >= s[j].length) {
                    setTimeout(function () {
                        j++;
                        if (j < s.length) {
                            i = 0;
                            out();
                        }
                        else {
                            $(".typed-cursor").addClass("hide");
                        }
                    }, speed * 6);
                    clearInterval(interval);
                    return;
                }
                $text.html(text + s[j].substr(0, i + 1));
                i++
            }, speed);
        }
    }
}(jQuery);
