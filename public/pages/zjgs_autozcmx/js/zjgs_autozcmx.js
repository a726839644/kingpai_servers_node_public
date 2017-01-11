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

        $selectStatement.on('change',function () {
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
            return '+function(){var c=' + JSON.stringify(a) + ';for(var b=0;b<c.length;b++){if(b>0){zj_add()}a(c[b])}function a(e){var g;var f;var j;var h;var l;var i;var d;g=k("zj_fphm");f=k("zj_jqsbmc");j=k("zj_gmrq");h=k("zj_sbdj");l=k("zj_sbsl");i=k("zj_sbje");d=k("zj_dkse");g.value=e.zj_fphm;f.value=e.zj_jqsbmc;j.value=e.zj_gmrq;h.value=e.zj_sbdj;l.value=e.zj_sbsl;i.value=e.zj_sbje;d.value=e.zj_dkse;g.setAttribute("data-input","yes");f.setAttribute("data-input","yes");j.setAttribute("data-input","yes");h.setAttribute("data-input","yes");l.setAttribute("data-input","yes");i.setAttribute("data-input","yes");d.setAttribute("data-input","yes");d.onchange();function k(n){var o=document.getElementsByName(n);for(var m=0;m<o.length;m++){if(o[m].getAttribute("data-input")!="yes"){return o[m]}}}}}();';

            //xlsx的日期单元格转换为日期格式
            function xlsxDateParse(time) {
                return new Date(new Date(1900, 0, 0).getTime() - 1 + time * 24 * 60 * 60 * 1000);
            }
        }
    }

}(jQuery);

