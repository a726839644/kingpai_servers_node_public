/**
 * Created by a7268 on 2016/12/27.
 * author KINGPAI
 * 星空背景图
 * 版本 1.0.0
 */
+function () {
    'use strict';

    //定义starrySky类
    var StarrySky = function (canvas) {
        this.c = canvas;
        this.ctx = this.c.getContext('2d');

        this.initStyle();
        this.setSize();
    };


    StarrySky.prototype.initStyle = function () {
        this.c.style.position = 'fixed';
        this.c.style.margin = 0;
        this.c.style.padding = 0;
        this.c.style.border = 0;
    };

    StarrySky.prototype.setSize = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.c.width = width;
        this.c.height = height;
        this.c.style.width = width + 'px';
        this.c.style.height = height + 'px';
    };

    var star = function () {

    };
    window.onload = function () {
        var c = document.getElementById('starry_sky');
        var starrySky = new StarrySky(c);
    }
}();