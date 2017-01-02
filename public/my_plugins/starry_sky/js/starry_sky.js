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
        this.stars = [];
        this.frame = null;
        this.width = null;
        this.height = null;
        this.leftX = null;
        this.topY = null;
        this.interval = null;

        this.init();

        var that = this;

        if (!this.options.showFPS) {
            this.frame.style.display = 'none';
        }

        window.onresize = function () {
            that.setSize();
            that.initAnimate();
        };
    };

    StarrySky.DEFAULTS = {
        starColor: '#fefefe',
        randomColor: true,
        starSize: 2,
        n: 50,
        left: 0,
        top: 50,
        showFPS: true
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
        this.c.style.left = this.options.left;
        this.c.style.top = this.options.top;
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
        this.width = window.innerWidth - this.options.left;
        this.height = window.innerHeight - this.options.top;
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
            speedX: this.randomPM(0.2),
            speedY: this.randomPM(0.2),
            size: this.options.starSize
        }, options);
    };

    StarrySky.prototype.randomPM = function (min, max) {
        var random = Math.random();
        if (arguments.length == 1) {
            while (random < min) {
                random = Math.random();
            }
        }
        if (arguments.length == 2) {
            while (random < min || random > max) {
                random = Math.random();
            }
        }
        return Math.random() * (Math.random() > 0.5 ? 1 : -1);
    };

    StarrySky.prototype.initAnimate = function () {
        this.pause();
        for (var i = 0; i < this.options.n; i++) {
            this.stars[i] = this.setAnimate();
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
            that.frame.innerHTML = Math.min(Math.round(1000 / (new Date().getTime() - time)), 60);
            time = new Date().getTime();
        }, 16.66);

    };

    StarrySky.prototype.pause = function () {
        clearInterval(this.interval);
    };

    StarrySky.prototype.nextFrame = function () {
        this.ctx.clearRect(this.leftX, this.topY, this.width, this.height);
        for (var i = 0; i < this.options.n; i++) {
            var star = this.stars[i];
            this.createStar({
                x: star.nowX,
                y: star.nowY,
                size: star.size
            });
            star.nowX += star.speedX;
            star.nowY += star.speedY;

            var leftX = this.leftX + star.size;
            var topY = this.topY + star.size;
            if (Math.abs(star.nowX) > -leftX) {
                this.stars[i] = this.reflect(star, {speedX: 0});
                this.stars[i].nowX = this.stars[i].nowX < 0 ? leftX : -leftX;
            }
            else if (Math.abs(star.nowY) > -topY) {
                this.stars[i] = this.reflect(star, {speedX: 1, speedY: 0});
                this.stars[i].nowY = this.stars[i].nowY < 0 ? topY : -topY;
            }
            else {
                var thatStarO = this.isCollision(star, i);
                if (thatStarO) {
                    // console.log(this.stars[i]);
                    this.stars[i] = this.reflect(star, thatStarO.thatStar);
                    // console.log(this.stars[i]);
                    // console.log(this.stars[thatStarO.i]);
                    this.stars[thatStarO.i] = this.reflect(thatStarO.thatStar, star);
                    // console.log(this.stars[thatStarO.i]);
                    // this.pause();
                }
            }
        }
    };

    StarrySky.prototype.reflect = function (vector, line) {
        var rVector = vector;
        if (line.speedX == 0) {
            rVector.speedX = -vector.speedX;
        }
        else {
            /*
             * 反射处理
             * k为反射面所在线斜率斜率
             * a，b分别为反射入射线单位运动量的负值
             */
            var k = line.speedY / line.speedX;
            var a = -vector.speedX;
            var b = -vector.speedY;

            var kPow2 = Math.pow(k, 2);
            rVector.speedX = (kPow2 * a - 2 * k * b - a) / (kPow2 + 1);
            rVector.speedY = (b - kPow2 * b - 2 * k * a) / (kPow2 + 1);
        }
        return rVector;
    };

    StarrySky.prototype.isCollision = function (thisStar, n) {
        for (var i = 0; i < this.stars.length; i++) {
            if (i == n) {
                continue;
            }
            var thatStar = this.stars[i];
            var distance = Math.pow((thisStar.nowX - thatStar.nowX), 2) + Math.pow(thisStar.nowY - thatStar.nowY, 2);
            if (distance <= Math.pow(thisStar.size + thatStar.size, 2)) {
                return {
                    thatStar: thatStar,
                    i: i
                };
            }
        }
    };

    StarrySky.prototype.createStar = function (options) {
        var size = options.starSize || this.options.starSize;
        var color = options.starColor || this.options.randomColor && 'rgb(' + Math.round(Math.random() * 256) + ',' + Math.round(Math.random() * 256) + ',' + Math.round(Math.random() * 256) + ')' || this.options.starColor;
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