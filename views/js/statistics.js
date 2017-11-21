/**
 * Created by atomyang on 2017-02-22
 */

function statistics_excel_download(excelName,targetId,data) {

    var $form = $('<form></form>');
    $form.attr('action', './excel_ps.php');
    $form.attr('method', 'post');
    $form.attr('target', 'ifrmProcess');
    $form.appendTo('body');

    var mode = $('<input type="hidden" name="mode" value="excel_download">');
    if (typeof excelName == 'undefined') excelName ="";
    if ($(".nav-tabs .active").length > 0 ) excelName += $(".nav-tabs .active").text().trim();
    var excel_name = $('<input type="hidden" name="excel_name" value="'+excelName+'">');

    if (typeof targetId == 'undefined') targetId = ".js-excel-data";
    if(data) {
        var html = "<style>td{mso-number-format:'\@';}</style><table border='1'>"+data+"</table>";
    } else {
        var headHtml = "";
        var rsideRowspan = $(targetId).find(".tui-grid-rside-area .tui-grid-head-area table tbody tr").length;

        $(targetId).find(".tui-grid-rside-area .tui-grid-head-area table tbody tr").each(function() {
            var lsideHeadHtml = $(targetId).find(".tui-grid-lside-area .tui-grid-head-area table tbody tr").eq($(this).index()).html();
            if(lsideHeadHtml) {
                if(rsideRowspan > 1 && $(this).index() =='0') lsideHeadHtml = lsideHeadHtml.replace(/rowspan="1"/gi, "rowspan='"+rsideRowspan+"'");
                headHtml +="<tr>"+lsideHeadHtml+$(this).html()+"</tr>";
            }
            else headHtml +="<tr>"+$(this).html()+"</tr>";
        });

        var bodyHtml = "";
        $(targetId).find(".tui-grid-lside-area .tui-grid-body-area table tbody tr").each(function() {
            var rsideBodyHtml = $(targetId).find(".tui-grid-rside-area .tui-grid-body-area table tbody tr").eq($(this).index()).html();
            bodyHtml +="<tr>"+$(this).html()+rsideBodyHtml+"</tr>";
        });

        var html = "<style>td{mso-number-format:'\@';}</style><table border='1'><tr>"+headHtml+"</tr>"+bodyHtml+"</table>";
    }

    var data = $('<input type="hidden" name="data" value="' + encodeURI(html) + '">');

    $form.append(mode).append(excel_name).append(data);
    $form.submit();

}
