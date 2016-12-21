/* ========================================================================
 * Atom.js v1.0.0
 * ======================================================================== */
+function ($) {
    "use strict";

    var Atom = function (canvas, options) {
        this.canvas = canvas;
        this.ctx3d=canvas.getContent("3d");
        this.options = options;
    };

    Atom.VERSION = "1.0.0";

    Atom.DEFAULTS = {
        speed: 300,
        radius: 200,
        electron:10
    };

    Atom.prototype.pause=function () {
        
    }

}(jQuery);