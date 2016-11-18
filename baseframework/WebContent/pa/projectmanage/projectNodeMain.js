var projectId = 0, projectNodeId = 0, status = 0, projectStatus, statusName, nodeName, projectName, projectStatusName, operateCfg = {}, isRefresh = false;

$(function () {
    getQueryParameters();
    initializeOperateCfg();
    bindEvents();
    initializeUI();
    loadProject();
    loadProjectNode();
    loadFunctionData();
    loadDocument();

    function getQueryParameters() {
        projectId = Public.getQueryStringByName("projectId") || 0;
        projectNodeId = Public.getQueryStringByName("projectNodeId")
        || 0;
    }

    /**
     * 初始化参数配置
     */
    function initializeOperateCfg() {
        var actionPath = web_app.name + "/projectNodeMainAction!";
        operateCfg.stopProjectNodeAction = actionPath
        + "stopProjectNode.ajax";
        operateCfg.reStartProjectNodeAction = actionPath
        + "reStartProjectNode.ajax";
        operateCfg.resetProjectNodeAction = actionPath
        + "resetProjectNode.ajax";
        operateCfg.continueProjectNodeAction = actionPath
        + "continueProjectNode.ajax";
        operateCfg.pauseProjectNodeAction = actionPath
        + "pauseProjectNode.ajax";
        operateCfg.startProjectNodeAction = actionPath
        + "startProjectNode.ajax";
        operateCfg.flowOutProjectNodeAction = actionPath
        + "flowOutNode.ajax";
        operateCfg.loadProjectAction = web_app.name
        + "/projectMainAction!loadProject.ajax";
        operateCfg.loadProjectNodeAction = actionPath
        + "loadProjectNode.ajax";
        operateCfg.queryAllNodeFunctionAction = actionPath
        + "queryAllNodeFunction.ajax";
        operateCfg.queryAllNodeDocumentAction = actionPath
        + "QueryAllProjectNodeDocument.ajax";
        operateCfg.showUploadDocumentDialog = actionPath
        + "showUploadDocumentDialog.ajax";
        operateCfg.returnProjectNodeAction = actionPath
        + "returnNode.ajax";

        operateCfg.showUploadDocumentTitle = "上传文档";
    }

    function initializeUI() {

    }

    function bindEvents() {

    }
});

function startProjectNode() {
    updateProjectNodeStatus('开始', operateCfg.startProjectNodeAction);
}

function forciblyStartProjectNode() {
    forciblyUpdateProjectNodeStatus('强制开始', operateCfg.startProjectNodeAction);
}

function stopProjectNode() {
    updateProjectNodeStatus('中止', operateCfg.stopProjectNodeAction);
}

function pauseProjectNode() {
    updateProjectNodeStatus('暂停', operateCfg.pauseProjectNodeAction);
}

function continueProjectNode() {
    updateProjectNodeStatus('恢复', operateCfg.continueProjectNodeAction);
}

function reSetProjectNode() {
    isRefresh = true;
    updateProjectNodeStatus('重置', operateCfg.resetProjectNodeAction);
}

function reStartProjectNode() {
    updateProjectNodeStatus('重启', operateCfg.reStartProjectNodeAction);
}

function flowOutProjectNode() {
    updateProjectNodeStatus('流转', operateCfg.flowOutProjectNodeAction);
}

function returnProjectNode() {
    updateProjectNodeStatus('退回', operateCfg.returnProjectNodeAction);
}

function forciblyUpdateProjectNodeStatus(oper, action) {

    UICtrl.confirm('您确定' + oper + '当前项目节点吗?', function () {
        var params = {
            projectNodeId: projectNodeId,
            description: '',
            isForciblyStart: true
        };
        Public.ajax(action, params, function (data) {
            if (isRefresh) {
                location.reload();
                return;
            }
            loadProjectNode();
        });
    });
}

function updateProjectNodeStatus(oper, action) {

    UICtrl.confirm('您确定' + oper + '当前项目节点吗?', function () {
        var params = {
            projectNodeId: projectNodeId,
            description: ''
        };
        Public.ajax(action, params, function (data) {
            if (isRefresh) {
                location.reload();
                return;
            }
            loadProjectNode();
        });
    });
}

function loadProjectNode() {
    Public.ajax(operateCfg.loadProjectNodeAction, {
        projectNodeId: projectNodeId,
        hasLoadGraphic: 0
    }, function (data) {
        if (data) {
            if (data.description && data.description.length > 0) {
                $('#divProjectNodeRemark').html(data.description);
            } else {
                $('#divRemarkPanel').hide();
            }
            var html = new StringBuilder();
            status = data.status;
            statusName = data.statusName;
            nodeName = data.name;
            html.append('：');
            html.append(data.name);
            html.append('  状态：<span class="projectNodeStatus_1');
            html.append(data.status + 1);
            html.append('" style="font-size:16px;font-weight:bold;">');
            html.append(data.statusName + "</span>");
            $('#divTitle').html(html.toString());
        }
    });
}

function loadProject() {
    Public.ajax(operateCfg.loadProjectAction, {
        projectId: projectId
    }, function (data) {
        if (data) {
            projectStatus = data.phaseStatus;
            projectName = data.name;
            projectStatusName = data.phaseStatusName;
            $('#divProjectName').html(projectName);
        }
    });
}

function loadFunctionData() {
    if (projectId) {
        Public.ajax(operateCfg.queryAllNodeFunctionAction, {
            bizId: projectNodeId,
            bizKindId: ENodeBizKind.ProjectNode
        }, function (data) {
            if (!data.Rows || data.Rows.length == 0) {
                $('#divFunctionPanel').hide();
                return;
            }
            var html = new StringBuilder();
            for (var i = 0; i < data.Rows.length; i++) {
                var functionDefine = data.Rows[i].functionDefine;
                if (functionDefine) {
                    var btn = '<span class="ui-button" style="margin-right: 15px; margin-bottom: 2px;"><span class="ui-button-left"></span><span class="ui-button-right"></span><input type="button" class="ui-button-inner" onclick="execFunctionClick(\''
                        + functionDefine.code
                        + '\',\''
                        + functionDefine.name
                        + '\',\''
                        + data.Rows[i].nodeFunctionId
                        + '\',\''
                        + functionDefine.kindId
                        + '\',\''
                        + functionDefine.parameterValue
                        + '\')" value="'
                        + functionDefine.name
                        + '"></span>';

                    html.append(btn);
                }
            }
            $('#divFunctionList').html(html.toString());
        });

    }
}

function execFunctionClick(code, name, id, kindId, parameterValue) {

    if (!checkProjectStatus()) {
        return;
    }

    if (!checkNodeStatus(code)) {
        Public.errorTip(getNoRightProcessErrorMsg(name));
        return;
    }

    switch (parseInt(kindId)) {
        case EFunctionExecKind.Script :
            switch (parameterValue) {
                case 'FlowOutProjectNode' :
                    flowOutProjectNode();
                    break;
                case 'StartProjectNode' :
                    startProjectNode();
                    break;
                case 'ReStartProjectNode' :
                    reStartProjectNode();
                    break;
                case 'ReSetProjectNode' :
                    reSetProjectNode();
                    break;
                case 'ContinueProjectNode' :
                    continueProjectNode();
                    break;
                case 'PauseProjectNode' :
                    pauseProjectNode();
                    break;
                case 'StopProjectNode' :
                    stopProjectNode();
                    break;
                case 'ReturnProjectNode' :
                    returnProjectNode();
                    break;
                case 'ForciblyStartProjectNode' :  //强制启动项目节点
                    forciblyStartProjectNode();
                    break;
                default :
                    eval(parameterValue + '(' + this.projectId + ','
                    + this.projectNodeId + ')');
                    // Public.errorTip('未知的执行函数' + parameterValue);
                    break;
            }
            break;
        case EFunctionExecKind.Page :
            if (parameterValue.indexOf("?") < 0)
                parameterValue += "?";
            else
                parameterValue += "&";
            parameterValue += "projectId=" + projectId;
            parameterValue += "&projectNodeId=" + projectNodeId;
            parent.addTabItem({
                tabid: code,
                text: "项目节点[" + nodeName + "]" + name,
                url: web_app.name + "/" + parameterValue
            });
            break;
        default :
            Public.errorTip('未知的执行类型Id' + kindId);
            break;
    }
}

function checkNodeStatus(code) {
    var result = false;
    if (status == EProjectNodeStatus.UNTREATED) {
        if (code == 'StartProjectNode' || code == 'ForciblyStartProjectNode')
            result = true;
    } else if (status == EProjectNodeStatus.PROCESSING) {
        if (code != 'StartProjectNode' && code != 'ReStartProjectNode'
            && code != 'ContinueProjectNode')
            result = true;
    } else if (status == EProjectNodeStatus.COMPLATED) {
        if (code == 'ReStartProjectNode')
            result = true;
    } else if (status == EProjectNodeStatus.PAUSED) {
        if (code == "ContinueProjectNode")
            result = true;
    } else if (status == EProjectNodeStatus.ABORTED) {
        if (code == "ReStartProjectNode")
            result = true;
    }

    return result;
}

function getNoRightProcessErrorMsg(name) {
    return '当前节点执行状态为[' + statusName + ']，不能进行[' + name + ']操作.';
}

function loadDocument() {
    Public.ajax(operateCfg.queryAllNodeDocumentAction, {
        bizId: projectNodeId,
        bizKindId: ENodeBizKind.ProjectNode
    }, function (data) {
        if (!data.Rows || data.Rows.length == 0) {
            $('#tdDocument').hide();
            $('#divDocumentPanel').hide();
            return;
        }
        var html = new StringBuilder();
        html.append('<table cellpadding="0" cellspacing="0" class="l-table-edit">');
        html.append('<tr><td class="l-table-edit-title" style="width: 40px;">序号</td>');
        html.append('<td class="l-table-edit-title" style="width: 200px;">文档类别</td>');
        html.append('<td class="l-table-edit-title">文档名称</td>');
        html.append('<td class="l-table-edit-title" style="width: 60px;">操作</td></tr>');

        for (var i = 0; i < data.Rows.length; i++) {
            var url = new StringBuilder();
            if (data.Rows[i].attachmentList) {
                for (var j = 0; j < data.Rows[i].attachmentList.length; j++) {

                    var title = '文件名称：'
                        + data.Rows[i].attachmentList[j].fileName
                        + '\n';
                    title += "经办人："
                    + data.Rows[i].attachmentList[j].creatorName
                    + '\n';
                    title += "经办时间："
                    + data.Rows[i].attachmentList[j].createDate
                    + "\n";

                    url.append('<div style="height: 20px; line-height: 20px; float: left; padding: 2px;">');
                    url.append('<ul>');
                    url.append('<li style="float: left; list-style: none;">'
                    + '<a class="msg3" href="javascript:void(null);" onclick="openFile('
                    + projectNodeId
                    + ','
                    + data.Rows[i].attachmentList[j].documentClassificationId
                    + ','
                    + data.Rows[i].attachmentList[j].id
                    + ',\''
                    + data.Rows[i].attachmentList[j].bizCode
                    + '\','
                    + data.Rows[i].attachmentList[j].bizId
                    + ')" title="'
                    + title
                    + '">'
                    + data.Rows[i].attachmentList[j].fileName
                    + '</a>' + '</li>');
                    url.append('<li style="float: left; list-style: none; padding-top: 3px;">');

                    url.append('<div class="toolDeleteStyle" title="删除" onclick="deleteAttachment('
                    + data.Rows[i].attachmentList[j].id
                    + ')">');
                    url.append('</div>');

                    url.append('</li>');
                    url.append('</ul>');
                    url.append('</div>');
                }
            }

            html.append('<tr><td class="l-table-edit-td">' + (i + 1)
            + '</td>');
            var required = "";
            if (data.Rows[i].documentClassification
                && data.Rows[i].documentClassification.hasUpload == 1) {
                required = " <font style='color:red;'>*</font>";
            }
            html.append('<td class="l-table-edit-td">'
            + data.Rows[i].name + required + '</td>');
            html.append('<td class="l-table-edit-td">' + url.toString()
            + '</td>');
            html.append('<td class="l-table-edit-td"><span class="ui-button" style="margin-bottom: 7px;"><span class="ui-button-left"></span><span class="ui-button-right"></span><input type="button" class="ui-button-inner" value="上传" onclick="showUploadDocumentDialog('
            + data.Rows[i].nodeDocumentId
            + ')"></span></td>');
            html.append('</tr>');
        }
        html.append('</table>');
        $('#tdDocument').html(html.toString());
    });
}

function showUploadDocumentDialog(nodeDocumentId) {
    if (!checkProjectStatus()) {
        return;
    }

    if (!checkProjectNodeStatus('上传文件'))
        return;

    $.uploadDialog({
        title: '上传文件', param: {attachmentCode: nodeDocumentId, bizId: nodeDocumentId, bizCode: projectNodeId, isMore: 1}, backurl: 'doSave', afterUpload: function (data) {
            loadDocument();
        }
    });


    /*UICtrl.showAjaxDialog({
     url: operateCfg.showUploadDocumentDialog,
     title: operateCfg.showUploadDocumentTitle,
     param: {
     bizId: nodeDocumentId
     },
     init: function () {
     $('#NodeDocumentList').fileList();
     },
     width: 400,
     ok: doSaveNodeDocument,
     close: loadDocument
     });*/
}

function checkProjectStatus() {
    var result = true;
    if (projectStatus != EProjectStatus.Construction) {
        Public
            .errorTip("[" + projectName + "]状态为" + projectStatusName
            + "不能操作");
        result = false;
    }

    return result;
}

function checkProjectNodeStatus(action) {
    var result = true;
    if (status != EProjectNodeStatus.PROCESSING) {
        Public.errorTip(getNoRightProcessErrorMsg(action));
        result = false;
    }

    return result;
}

function doSaveNodeDocument() {
    var _self = this;
    _self.close();
}

function deleteAttachment(id) {
    if (!checkProjectNodeStatus('删除文件'))
        return;
    UICtrl.confirm("此操作不能回退，确信要删除当前数据吗？", function () {
        Public.ajax(web_app.name
        + '/attachmentAction!doDelete.ajax?a=1', {
            id: id,
            isCheck: true
        }, function (data) {
            loadDocument();
        });
    });
}

function openFile(projectNodeId, documentClassificationId, id, bizCode, bizId) {
    /***************************************************************************
     * if (!PAUtil.checkDocumentResourceRight(projectNodeId,
     * documentClassificationId)) { Public.tip("对不起，您无权查看此文件！"); return; }
     **************************************************************************/
    AttachmentUtil.onOpenViewFile(id, bizCode, bizId);
}