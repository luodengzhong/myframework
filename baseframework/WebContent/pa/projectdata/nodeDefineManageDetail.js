var refreshFlag = false, operateCfg = {};

$(function () {
    initializeOperateCfg();
    // initializeUI()

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/nodeDefineAction!";
        operateCfg.showUpdateAction = actionPath
            + 'showNodeDefineManagePage.do';
        operateCfg.updateAction = actionPath + 'updateNodeDefine.ajax';

        operateCfg.showUpdateTitle = "修改节点定义";
    }

    function initializeUI() {
        UICtrl.initDefaulLayout();
    }
});

function getId() {
    return parseInt($("#nodeDefineId").val() || 0);
}

function doSaveNodeDefine() {
    var _self = this;
    var id = getId();
    $('#submitForm').ajaxSubmit({
        url: (id ? operateCfg.updateAction : operateCfg.insertAction),
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

/**
 * 选择功能点图标
 */
function chooseImg() {
    var imgUrl = '/desktop/images/functions/';
    var nowChooseImg = $('#iconUrl').val(), display = nowChooseImg == ''
        ? "none"
        : "";
    var html = ['<div id="showImgMain">'];
    html.push('<div id="showFunctionImgs"></div>');
    html.push('<div id="showChooseOk">');
    html.push('<input type="hidden" value="', nowChooseImg,
        '" id="nowChooseValue">');
    html.push('<p><img src="', web_app.name, nowChooseImg, '" style="display:',
        display, '" width="68" height="68" id="nowChooseImg"/></p>');
    html
        .push(
        '<p><input type="button" value="确 定" class="buttonGray" style="display:',
        display, '" id="nowChooseBut"/></p>');
    html.push('</div>');
    html.push('</div>');
    Public.dialog({
        title: '选择节点图片',
        content: html.join(''),
        width: 540,
        opacity: 0.1,
        onClick: function ($clicked) {
            if ($clicked.is('img')) {
                var icon = $clicked.parent().attr('icon');
                $('#nowChooseImg').attr('src',
                        web_app.name + imgUrl + icon).show();
                $('#nowChooseBut').show();
                $('#nowChooseValue').val(imgUrl + icon);
            } else if ($clicked.is('input')) {// 点击按钮
                $('#iconUrl').val($('#nowChooseValue').val());
                this.close();
            }
        }
    });
    setTimeout(function () {
        $('#showFunctionImgs').scrollLoad({
            url: web_app.name
                + '/permissionAction!getFunctionImgList.ajax',
            itemClass: 'functionImg',
            size: 20,
            scrolloffset: 70,
            onLoadItem: function (obj) {
                var imgHtml = ['<div class="functionImg" icon="', obj,
                    '">'];
                imgHtml.push('<img src="', web_app.name, imgUrl, obj,
                    '"  width="64" height="64"/>');
                imgHtml.push('</div>');
                return imgHtml.join('');
            }
        });
    }, 0);
}