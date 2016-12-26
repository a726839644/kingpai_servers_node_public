/**
 * Created by a7268 on 2016/11/8.
 */
$(function ($) {
        var $cards = $("#cards");
        var $card = $cards.find(".card");
        var $cardContent = $(".input-content");
        var $submitBtn = $(".submit-input");

        var isIE = !!window.ActiveXObject || "ActiveXObject" in window;     //是否为IE浏览器
        //IE10~11翻转bug修复
        if (isIE) {
            $(".card .card-box > div").css({
                transitionDuration: "1ms"
            })
        }

        for (var i = 0; i < 11; i++) {             //添加card
            $cards.append($card.clone());
            var clone = $cardContent.clone();
            clone.find("label").html("卡片" + (i + 2)).prop({
                "for": "card" + (i + 2)
            });
            clone.find("input").prop({
                "id": "card" + (i + 2)
            });
            $submitBtn.parent().before(clone);
        }

        $card = $cards.find(".card");
        var $inputs = $(".input-text");
        var $shuffleBtn = $(".shuffle");
        var cardsCount = $card.length;
        var hasOpen = false;                    //是否有打开的card，并存放第一个打开的card的索引
        var shuffling = false;                 //是否在洗牌

//transition结束事件
        var transitionEnd = (function transitionEnd() {
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionsend',
                'WebkitTransition': 'webkitTransitionEnd'
            };
            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        })();

//当支持transition时，在element元素的transition结束后有执行函数，否则直接执行
//argument将作为f的参数
        function transitionEndExec(f, element, argument) {
            if (transitionEnd) {
                $(element).one(transitionEnd, function () {
                    f(argument);
                });
            }
            else {
                f(argument);
            }

        }

//乱序生成[0~n)之间的整数，并返回它们
        function getRandom(n) {
            var randoms = [];
            while (randoms.length < n - 1) {
                var random = Math.floor(Math.random() * n);
                if ($.inArray(random, randoms) == -1) {
                    randoms.push(random);
                }
            }
            for (var i = 0; ; i++) {
                if ($.inArray(i, randoms) == -1) {
                    randoms.push(i);
                    break;
                }
            }
            return randoms;
        }

        $inputs.each(function (i) {
            $(this).val(localStorage["card" + i]);
        });

//阻止下拉框点击后自动隐藏
        $(".dropdown-menu").on("click", function (e) {
            e.stopPropagation();
        });

//卡片新内容更新事件
        $submitBtn.on("click", function () {
            if (confirm("确认提交新内容？")) {
                $inputs.each(function (i) {
                    localStorage["card" + i] = $(this).val();
                });
                $shuffleBtn.trigger("click");
                return false;
            }
            else {
                return false;
            }
        });

//单击翻牌
        $cards.on("click", function (e) {
            if (!shuffling) {
                var $target = $(e.target).parent();
                if ($target.prop("class").indexOf("back") != -1) {
                    $target.parent().parent().addClass("open");
                    if (hasOpen === false) {                                    //获取第一个打开的card的索引
                        $target.parent().parent().addClass("first");
                        hasOpen = $card.index($target.parent().parent());
                        var randomArray = getRandom(cardsCount);
                        var $contentBoxs = $(".content-box");
                        $contentBoxs.each(function (i) {
                            var content = localStorage["card" + randomArray[i]];
                            if (content === undefined) {
                                content = "请输入内容";
                            }
                            if (content[0] !== "<") {
                                content = "\<p class='card-content'\>" + content + "\<\/p\>";
                            } else {
                                var index = content.indexOf("\>");
                                content = content.substr(0, index) + " class='card-content'" + content.substr(index);
                            }
                            content = "\<span\>\<\/span\>" + content;
                            $(this).html(content);
                        })
                    }
                }
            }
        });

//双击已打开的card，打开所有card
        $cards.on("dblclick", function (e) {
            if ($(e.target).prop("class").indexOf("card-content") != -1 || $(e.target).parent().parent().parent().prop("class").indexOf("open") != -1) {
                $card.each(function () {
                    $(this).addClass("open");
                });
                if (hasOpen === false) {
                    hasOpen = 0;
                }
            }
        });

//洗牌事件
        $shuffleBtn.on("click", function () {
            if (!shuffling) {
                shuffling = true;
                var x = 0, y = $(window).height() - $($card).height() * 1.2;      //洗牌时所要移动到的位置
                var translateX = [], translateY = [];                             //存放每张card需要移动的距离

                $card.each(function (i) {
                    translateX[i] = x - $(this).offset().left;
                    translateY[i] = y - $(this).offset().top;
                });

                //洗牌
                (function shuffle() {
                    var randomArray = getRandom(cardsCount);                        //生成随机发牌序列
                    if (hasOpen !== false) {                                       //关闭所有card后执行收牌
                        $card.each(function () {
                            $(this).removeClass("open first")
                        });
                        transitionEndExec(gather, $card[hasOpen], 0);
                    }
                    else {
                        gather(0);
                    }
                    hasOpen = false;       //初始化hasOpen

                    //收牌
                    function gather(i) {
                        setTimeout(function () {
                            $($card[i]).css("transform", "translate(" + translateX[i] + "px," + translateY[i] + "px)");
                            $($card[i]).addClass("card-shuffle");
                            if (i < cardsCount - 1) {
                                gather(++i);
                            }
                            else {
                                transitionEndExec(function () {
                                    setTimeout(function () {
                                        deal(0);
                                    }, 50);
                                }, $card[cardsCount - 1]);
                            }
                        }, 100);
                    }

                    //发牌
                    function deal(i) {
                        setTimeout(function () {
                            $($card[randomArray[i]]).css("transform", "");
                            $($card[i]).removeClass("card-shuffle");
                            if (i < cardsCount - 1) {
                                deal(++i);
                            }
                            else {
                                transitionEndExec(function () {
                                    shuffling = false;
                                }, $card[randomArray[cardsCount - 1]]);
                            }
                        }, 100)
                    }
                })();
            }
        })
    }
    (jQuery)
)
;