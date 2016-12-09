/**
 * Created by KINGPAI on 2016/12/8.
 * 触摸滑动事件 1.0.0
 */


+function ($) {
    'use strict';

    var Touch = function (options) {
        this.options = options;
        this.$target = $(this.options.touchTarget);
        this.startTouches = null;
        this.changeTouches = null;
        this.trigger = false;

        this.$target
            .on("touchstart.kp.touch", $.proxy(this.start, this))
            .on("touchmove.pk.touch", function (e) {
                e.preventDefault();
            });
    };

    Touch.VERSION = "1.0.0";

    Touch.DEFAULTS = {
        touchTarget: document
    };

    Touch.prototype.start = function (e) {
        this.startTouches = e.changedTouches;

        this.$target.one("touchend.kp.touch", $.proxy(this.end, this));
    };

    Touch.prototype.end = function (e) {
        this.changeTouches = e.changedTouches;
        var moveX = this.changeTouches[0].clientX - this.startTouches[0].clientX;
        var moveY = this.changeTouches[0].clientY - this.startTouches[0].clientY;
        var that = this;

        function event(direction) {
            var touchEvent = $.Event("touch.kp." + direction, {
                target: that.$target[0],
                startTouches: that.startTouches,
                changeTouches: that.changeTouches
            });
            that.$target.trigger(touchEvent);
        }

        if (Math.abs(moveX) > Math.abs(moveY)) {
            if (moveX > 20) {
                return event("right");
            }
            else if (moveX < -20) {
                return event("left");
            }
        }
        else {
            if (moveY > 30) {
                return event("top");
            }
            else if (moveY < -30) {
                return event("down");
            }
        }
    };


    var Plugin = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("kp.touch");
            var options = $.extend({}, Touch.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data) {
                $this.data("kp.touch", new Touch(options));
            }
        })
    };

    var old = $.fn.Touch;

    $.fn.Touch = Plugin;
    $.fn.Touch.Constructor = Touch;


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.vertical_carousel.noConflict = function () {
        $.fn.vertical_carousel = old;
        return this
    };

    $(window).on("load", function () {
        $("body").each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        })
    });

}(jQuery);