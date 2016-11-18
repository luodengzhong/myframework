var operateCfg = {}, projectId;
$(function () {
    getQueryParameters();
    initializeOperateCfg();
    bindEvents();
    loadProjectDocumentList();
    loadProjectData();

    function getQueryParameters() {
        projectId = parseInt(Public.getQueryStringByName("projectId")) || 0;
    }

    /**
     * 初始化参数配置
     */
    function initializeOperateCfg() {
        operateCfg.queryAllNodeDocumentForArchiveAction = web_app.name + "/projectPreviewAction!queryAllProjectNodeDocumentForArchive.ajax";
        operateCfg.loadProjectAction = "projectMainAction!loadProject.ajax";
    }

    function bindEvents() {

    }

});
/**
 * 接在项目文档
 */
function loadProjectDocumentList() {
    new Public.ajax(operateCfg.queryAllNodeDocumentForArchiveAction,
        {bizId: projectId, nodeKindId: ENodeKind.Data},
        function (data) {
            var list = data.Rows;
            if (!list) return;

            var html = new StringBuilder();
            html.append('<table class="l-table-edit" cellspacing="0" cellpadding="0" id="DocumentList" name="DocumentList" style="border-color:#1f1f1f;">');
            html.append('<tr>');
            html.append('<td class="l-table-edit-title" style="text-align: center; width: 80px;border-color:#1f1f1f;">项目阶段</td>');
            html.append('<td class="l-table-edit-title" style="text-align: center; width: 15%;border-color:#1f1f1f;">节点</td>');
            html.append('<td class="l-table-edit-title" style="text-align: center; width: 16%;border-color:#1f1f1f;">文档类别</td>');
            html.append('<td class="l-table-edit-title" style="text-align: center;border-color:#1f1f1f;">文档名称</td>');
            html.append('<td class="l-table-edit-title" style="text-align: center; width: 80px;border-color:#1f1f1f;">经办人</td>');
            html.append('<td class="l-table-edit-title" style="text-align: center; width: 140px;border-color:#1f1f1f;">经办时间</td>');
            html.append('<td class="l-table-edit-title" style="text-align: center; width: 60px;border-color:#1f1f1f;">状态</td>');
            html.append('</tr>');
            var documentName = "";
            var baseStyle = "border-color:#1f1f1f";
            for (var i = 0; i < list.length; i++) {
                var Creator = '', CreationTime = '', Status = '未处理', documentName = '', appendStyle = "";
                for (var j = 0; j < list[i].attachments.length; j++) {
                    Status = "完成";

                    CreationTime = Public.formatDate(Public.parseDate(list[i].attachments[j].createDate, "%Y-%M-%D %H:%I:%S"), "%Y-%M-%D %H:%I:%S");

                    if (list[i].attachments[j].id == 0) {
                        documentName += '<table style="width:100%;"><tr><td style="width:15px;"></td>'
                        documentName += '<td>' + list[i].attachments[j].fileName + '</td></tr></table>';
                        Creator = list[i].attachments[j].creatorName;
                        //CreationTime = list[i].attachments[j].createDate;
                        break;
                    }
                    else {
                        var title = '文件名称：' + list[i].attachments[j].fileName + '\n';
                        title += "经办人：" + list[i].attachments[j].creatorName + '\n';
                        title += "经办时间：" + CreationTime + "\n";

                        Creator = list[i].attachments[j].creatorName;
                        //CreationTime = list[i].attachments[j].createDate;

                        if (j == 0) {
                            if (list[i].attachments.length > 1) {
                                documentName = '<table style="width:100%;"><tr><td style="width:15px;"><img src="' + web_app.name + '/images/plus.png" onclick="showMoreFile(' + i + ',this)" style="margin:3px 1px 0px 1px;" /></td>'
                            }
                            else {
                                documentName += '<table><tr><td style="width:15px;"></td>'
                            }
                            documentName += '<td><a class="msg3" href="javascript:void(null);" onclick="openFile(' + list[i].projectNodeId + ',' + list[i].documentClassificationId + ',' + list[i].attachments[j].id + ',\'' + list[i].attachments[j].bizCode + '\',' + list[i].attachments[j].bizId + ')" title="' + title + '">' + list[i].attachments[j].fileName + '</a></td></tr></table>';
                        }
                        else {
                            documentName += '<table style="width:100%;display:none" class="moreStyle' + i + '"><tr><td style="width:15px;"></td>'
                            //documentName += '<td><a class="msg3" href="javascript:void(null);" title="' + title + '">' + list[i].attachments[j].fileName + '</a></td></tr></table>';
                            documentName += '<td><a class="msg3" href="javascript:void(null);" onclick="openFile(' + list[i].projectNodeId + ',' + list[i].documentClassificationId + ',' + list[i].attachments[j].id + ',\'' + list[i].attachments[j].bizCode + '\',' + list[i].attachments[j].bizId + ')" title="' + title + '">' + list[i].attachments[j].fileName + '</a></td></tr></table>';
                        }
                    }
                }

                if (i == (list.length - 1)) {
                    appendStyle = "border-color:#1f1f1f";
                } else if ((i < list.length - 1) && (list[i].name != list[i + 1].name)) {
                    appendStyle = "border-color:#1f1f1f";
                    // tempName = list[i].name;
                }
                else {
                    appendStyle = "border-left-color:#1f1f1f;border-right-color:#1f1f1f;";
                }

                html.append('<tr style="border-color:#1f1f1f">');
                html.append('<td class="l-table-edit-td" style="vertical-align:top;' + baseStyle + '">' + list[i].projectParentName + '</td>');
                html.append('<td class="l-table-edit-td" style="vertical-align:top;font-size:15px;' + baseStyle + '"> ' + list[i].name + '</td>');
                html.append('<td class="l-table-edit-td" style="' + appendStyle + '">' + list[i].documentClassificationName + '</td>');
                html.append('<td class="l-table-edit-td" style="line-height:25px;' + appendStyle + '">' + documentName + '</td> ');
                html.append('<td class="l-table-edit-td" style="' + appendStyle + '">' + Creator + '</td> ');
                html.append('<td class="l-table-edit-td" style="' + appendStyle + '">' + CreationTime + '</td> ');
                html.append('<td class="l-table-edit-td" style="' + appendStyle + '">' + Status + '</td>');
                html.append('</tr>');
            }
            html.append("</table>");
            $("#divDocumentContent").html(html.toString());
            coltogather($("#DocumentList").children().children("tr"), 0);
            coltogather($("#DocumentList").children().children("tr"), 1);
        });
}

function coltogather(willcheck, colnum) {
    var alltext = [], togotherNum = [], oldnum = [], id = 1, lasttext = null, rmflag = 1;
    //逐列的数据进行扫描,得到里面的不重复的数据,以及各个数据的数目,然后将依据此结果进行设置rowspan属性
    willcheck.each(function () {
        var _rmnum = this.getAttribute('rmnum');
        if (!_rmnum) _rmnum = 0;
        var trdom = jQuery('td:eq(' + (colnum - _rmnum) + ')', this)
        var text = jQuery(trdom).text();
        //如果上一行记录文本为空,说明是第一行
        if (lasttext == null) {
            lasttext = text;
        } else {
            //如果当前行和上一行记录一样,说明要进行合并,合并的单元格数目就加1
            if (lasttext != text) {
                togotherNum.push(id);
                lasttext = text;
                id = 1;
            } else {
                id++;
            }
        }

    });
    togotherNum.push(id);
    //复制allnum数组中的数据到oldnum数组
    jQuery.each(togotherNum, function (i, n) {
        oldnum[i] = n;
    });
    var index = 0, len = togotherNum.length;
    //逐行进行处理,设置指定列的rowspan属性,以及将要合并的单元格remove!
    willcheck.each(function () {
        // 得到一个属性表示该行已经被移除了几个td
        var _rmnum = this.getAttribute('rmnum');
        if (!_rmnum)
            _rmnum = 0;
        var tddom = jQuery('td:eq(' + (colnum - _rmnum) + ')', this)
        if (togotherNum[index] == oldnum[index]) {
            tddom.attr('rowSpan', togotherNum[index]);
            if (togotherNum[index] > 1)
                togotherNum[index] = togotherNum[index] - 1;
            else
                index++;
        } else {
            if (togotherNum[index] == 0) {
                index++;
                tddom.attr('rowSpan', togotherNum[index]);
            } else {
                tddom.remove();
                if (--togotherNum[index] == 0) {
                    index++;
                }
            }
            // 移除了td之后,要在tr里面添加一个属性标示已经移除的td的数目
            if (_rmnum == 0) {
                jQuery(this).attr('rmnum', 1);
            } else {
                jQuery(this).attr('rmnum', 1 + _rmnum * 1);
            }
        }
    });
    //清空数组
    alltext = null;
    togotherNum = null;
    oldnum = null;
}

function showMoreFile(rowNumber, el) {
    $('.moreStyle' + rowNumber).toggle();

    if ($(el).attr('src').indexOf("minus.png") > 0)
        $(el).attr("src", "../../lib/icons/12X12/plus.png");
    else
        $(el).attr("src", "../../lib/icons/12X12/minus.png");
}

function openFile(projectNodeId, documentClassificationId, id, bizCode, bizId) {
    if (!PAUtil.checkDocumentResourceRight(projectNodeId, documentClassificationId, EProjectPermissionKind.Resources)) {
        Public.tip("对不起，您无权查看此文件！");
        return;
    }
    AttachmentUtil.onOpenViewFile(id, bizCode, bizId);
}

function loadProjectData() {
    Public.ajax(operateCfg.loadProjectAction, {
        projectId: projectId
    }, function (data) {
        var titleName = "文档及资料";
        if (data) {
            titleName = data.name + titleName;
        }
        $('#divDocumentTitle').html(titleName);
    });
}