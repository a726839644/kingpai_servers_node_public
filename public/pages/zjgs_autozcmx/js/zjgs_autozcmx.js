/**
 * Created by a7268 on 2016/12/1.
 */

+function ($) {

    var $uploadExcel = $("#upload_excel");
    var $filenameSpan = $("#filename");
    var $uploadForm = $("#upload_form");
    var $selectStatement = $("#select_statement");
    var $textArea = $("#view_code");
    $uploadExcel.on("change", uploadHandler);

    function uploadHandler() {
        var path = $uploadExcel.val();
        $filenameSpan.html(path.substring(path.lastIndexOf("\\") + 1));
        $.ajax({
            url: "/parse_xlsx",
            type: "post",
            dataType: "json",
            data: new FormData($uploadForm[0]),
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {

                if (data.length == 0) {
                    alert("报表格式错误或无内容");
                    $selectStatement.html("");
                    $textArea.html("");
                }
                else {
                    viewCode(data);
                }
            },
            error: function (data, status, e) {
                console.error(e);
            }
        });
        return false;
    }

    /*
     * 创建option元素并设置值为str，然后添加到$select的最后
     */
    function createOption(str, value, $select) {
        var $option = $("<option>");
        $option.prop({
            value: value
        });
        $option.html(str);
        $select.append($option);
    }

    function viewCode(data) {
        var sheets = {};
        var codes = {};
        for (var i = 0; i < data.length; i++) {
            sheets[data[i].name] = data[i].data;
        }
        $selectStatement.html("");
        for (var name in sheets) {
            if (sheets.hasOwnProperty(name)) {
                createOption(name, name, $selectStatement);
                codes[name] = parseStatement(sheets[name]);
            }
        }

        $selectStatement.on('change', function () {
            $textArea.html(codes[$selectStatement.val()]);
        });

        $selectStatement.trigger("change");

        /*
         * 解析sheet对象，并返回解析后的对象
         * 该对象有date、qms、ncs成员对象
         */
        function parseStatement(sheet) {
            
            var code = '';
            var a = [];
            for (var i = 1; i < sheet.length; i++) {
                var o = {};
                var row = sheet[i];
                if (row[3] == null) {
                    continue;
                }
                o.zj_fphm = row[3];
                o.zj_jqsbmc = row[9];

                var date = xlsxDateParse(row[8]);
                if (date.getFullYear() < 2012) {
                    code = '请确认excel开票日期格式是否为日期格式。row = ' + i;
                    break;
                }
                else {
                    o.zj_gmrq = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                }
                o.zj_sbdj = row[4];
                o.zj_sbsl = 1;
                o.zj_sbje = row[4];
                o.zj_dkse = row[5];

                a.push(o);
            }
            return '+function(){var c=' + JSON.stringify(a) + ';var a=0;var i=[];setTimeout(function(){b()},0);function b(){if(a>0){zj_add()}if(a<c.length){a++;h(c[a-1],b)}else{if(i.length>0){alert("请检测"+i.toString()+"列的日期是否错误")}}}function h(g,e){var k;var j;var t;var l;var d;var s;var f;k=u("zj_fphm");j=u("zj_jqsbmc");t=u("zj_gmrq");l=u("zj_sbdj");d=u("zj_sbsl");s=u("zj_sbje");f=u("zj_dkse");k.value=g.zj_fphm;j.value=g.zj_jqsbmc;t.value=g.zj_gmrq;l.value=g.zj_sbdj;d.value=g.zj_sbsl;s.value=g.zj_sbje;f.value=g.zj_dkse;k.setAttribute("data-input","yes");j.setAttribute("data-input","yes");t.setAttribute("data-input","yes");l.setAttribute("data-input","yes");d.setAttribute("data-input","yes");s.setAttribute("data-input","yes");f.setAttribute("data-input","yes");if(g.zj_gmrq.indexOf("NaN")!=-1){i.push(a)}f.onchange();setTimeout(function(){e()},0);function u(o){var m=document.getElementsByName(o);for(var n=0;n<m.length;n++){if(m[n].getAttribute("data-input")!="yes"){return m[n]}}}}}();';

            //xlsx的日期单元格转换为日期格式
            function xlsxDateParse(time) {
                return new Date(new Date(1900, 0, 0).getTime() - 1 + time * 24 * 60 * 60 * 1000);
            }
        }
    }

}(jQuery);
