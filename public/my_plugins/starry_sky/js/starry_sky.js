/**
 * Created by a7268 on 2016/12/27.
 * author KINGPAI
 * 星空背景图
 * 版本 0.8.0
 */
+function () {
    'use strict';

    //定义starrySky类
    var StarrySky = function (canvas, options) {
        this.c = canvas;
        this.ctx = this.c.getContext('2d');
        this.options = StarrySky.extend(StarrySky.DEFAULTS, options);
        this.keyforms = [];
        this.frame = null;
        this.width = null;
        this.height = null;
        this.leftX = null;
        this.topY = null;
        this.interval = null;

        this.init();

        var that = this;

        if(!this.options.showFrame){
            this.frame.style.display = 'none';
        }

        window.onresize = function () {
            that.setSize();
            that.initAnimate();
        };
    };

    StarrySky.DEFAULTS = {
        starColor: '#fefefe',
        starSize: 2,
        n: 50,
        showFrame:true
    };

    StarrySky.extend = function () {
        var o = {};
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (typeof arg == 'object') {
                for (var name in arg) {
                    if (arg.hasOwnProperty(name)) {
                        o[name] = arg[name];
                    }
                }
            }
        }
        return o;
    };


    StarrySky.prototype.init = function () {

        this.c.style.position = 'fixed';
        this.c.style.border = 0;
        this.c.style.background = "#080808";
        this.c.style.left = 0;
        this.c.style.top = 0;
        this.c.style.zIndex = -9999;

        this.frame = document.createElement('span');
        this.c.parentNode.insertBefore(this.frame, this.c);

        this.frame.style.position = 'fixed';
        this.frame.style.bottom = '10px';
        this.frame.style.left = '10px';
        this.frame.style.color = 'red';

        this.setSize();
        this.initAnimate();
    };

    StarrySky.prototype.setSize = function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.c.width = this.width;
        this.c.height = this.height;
        this.c.style.width = this.width + 'px';
        this.c.style.height = this.height + 'px';
        this.leftX = -this.width / 2;
        this.topY = -this.height / 2;
    };

    StarrySky.prototype.setAnimate = function (options) {
        return StarrySky.extend({
            nowX: this.randomPM() * this.leftX,
            nowY: this.randomPM() * this.topY,
            // nowX:0,
            // nowY:0,
            speedX: this.randomPM(),
            speedY: this.randomPM()
        }, options);
    };

    StarrySky.prototype.randomPM = function () {
        var random = Math.random();
        while (random < 0.1) {
            random = Math.random();
        }
        return Math.random() * (Math.random() > 0.5 ? 1 : -1);
    };

    StarrySky.prototype.initAnimate = function () {
        this.pause();
        for (var i = 0; i < this.options.n; i++) {
            this.keyforms[i] = this.setAnimate();
        }
        this.ctx.translate(this.width / 2, this.height / 2);    //定义坐标原定
        this.start();
    };

    StarrySky.prototype.start = function () {
        if (this.interval) {
            this.pause();
        }
        var that = this;
        var time = new Date().getTime();
        this.interval = setInterval(function () {
            that.nextFrame();
            that.frame.innerHTML = Math.round(1000 / (new Date().getTime() - time));
            time = new Date().getTime();
        }, 16);

    };

    StarrySky.prototype.pause = function () {
        clearInterval(this.interval);
    };

    StarrySky.prototype.nextFrame = function () {
        this.ctx.clearRect(this.leftX, this.topY, this.width, this.height);
        for (var i = 0; i < this.options.n; i++) {
            var keyform = this.keyforms[i];
            this.createStar({
                x: keyform.nowX,
                y: keyform.nowY
            });
            keyform.nowX += keyform.speedX;
            keyform.nowY += keyform.speedY;

            var option = {};
            if (keyform.nowX > -this.leftX) {
                option.nowX = -this.leftX;
            } else if (keyform.nowX < this.leftX) {
                option.nowX = this.leftX;
            } else if (keyform.nowY > -this.topY) {
                option.nowY = -this.topY;
            } else if (keyform.nowY < this.topY) {
                option.nowY = this.topY;
            }
            if (option.nowX || option.nowY) {
                this.keyforms[i] = this.setAnimate();
                // this.keyforms[i] = this.reflect(this.keyforms[i], option.nowX ? -1 : 1, option);
            }
        }
    };

    StarrySky.prototype.reflect = function (keyform, x_y, option) {
        return StarrySky.extend(keyform, {
            speedX: keyform.speedX *= x_y,
            speedY: keyform.speedY *= -x_y
        }, option);
    };

    StarrySky.prototype.createStar = function (options) {
        var size = options.starSize || this.options.starSize;
        var color = options.starColor || this.options.starColor;
        var ctx = this.ctx;

        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = color;

        // for (var i = 0; i < 1; i++) {
        ctx.beginPath();
        ctx.arc(options.x, options.y, size, 0, Math.PI * 2);
        ctx.fill();
        // }

        return this;
    };

    window.onload = function () {
        var c = document.getElementById('starry_sky');
        var starrySky = new StarrySky(c);
    }
}();