var operateCfg = {}, bizKindId, bizId, parentId, canOperate, currProjectNodeData, prevJsonData;
$(function () {
    getQueryParameters();
    initializeOperateCfg();
    initContextMenu();
    initFlash();
    initToolBar();
});

function getQueryParameters() {
    bizKindId = Public.getQueryStringByName("bizKindId") || 0;
    bizId = Public.getQueryStringByName("bizId") || 0;
    parentId = Public.getQueryStringByName("parentId") || 0;
}

function initializeOperateCfg() {
    var actionPath = web_app.name + "/projectNodeAction!";
    operateCfg.showUpdateAction = actionPath + 'showUpdateProjectNodePage.load';
    operateCfg.showNodeDefine = actionPath + "showNodeDefinePage.do";
    operateCfg.showNodeManage = web_app.name
			+ "/nodeDefineAction!showNodeManagePage.do";
    operateCfg.insertProjectNodeByNodeDefineAction = actionPath
			+ 'insertProjectNodeByNodeDefine.ajax';
    operateCfg.insertAction = actionPath + 'insertProjectNode.ajax';
    operateCfg.updateAction = actionPath + 'updateProjectNode.ajax';
    operateCfg.updateProjectNodeGraphicTextAction = actionPath
			+ "updateProjectNodeGraphicText.ajax";
    operateCfg.deleteProjectNodeByGraphicAction = actionPath
			+ "deleteProjectNodeByGraphic.ajax";
    operateCfg.loadProjectNodeAction = actionPath + "loadProjectNode.ajax";
    operateCfg.insertNodeRelationshipAction = web_app.name
			+ "/nodeRelationshipAction!insertNodeRelationshipByGraphic.ajax";
    operateCfg.checkProjectPhaseGraphicText = web_app.name
			+ "/projectNodeMainAction!checkProjectPhaseGraphicText.ajax";
    operateCfg.updateProjectNodeId = web_app.name
			+ "/projectNodeMainAction!updateProjectNodeId.ajax";
    operateCfg.showUpdateTitle = "修改项目节点";
    operateCfg.showNodeDefineTitle = "节点选择器";

    if (bizKindId == ENodeConfigBizKind.ProjectTemplate) {
        canOperate = true;
    } else {
        canOperate = PAUtil.checkProjectOperateRight(bizId, 0, false);
    }
}

function initContextMenu() {
    // 屏蔽右击
    document.body.oncontextmenu = function () {
        return false;
    }

    var oMenu = document.getElementById("menu");
    var aLi = oMenu.getElementsByTagName("li");
    // 加载后隐藏自定义右键菜单
    oMenu.style.display = "none";
    // 菜单鼠标移入/移出样式
    for (i = 0; i < aLi.length; i++) {
        // 鼠标移入样式
        aLi[i].onmouseover = function () {
            this.className = "active"
        };
        // 鼠标移出样式
        aLi[i].onmouseout = function () {
            this.className = ""
        }
    }
}

function initFlash() {

    var flashVars = {};
    var params = {
        wmode: "opaque"
    };
    swfobject.embedSWF(web_app.name + "/pa/nodePic/brcproc.swf", 'mainflash',
			"100%", "100%", "9.0.0", "expressInstall.swf", flashVars, params);
}

function initToolBar() {
    $('#toolBar').toolBar([{
        name: '切换到表格',
        event: function () {
            parent.$('#divTablePanel').show();
        }
    }, {
        name: '比较',
        event: function () {
            Public.ajax(operateCfg.checkProjectPhaseGraphicText, {
                projectNodeId: parentId
            }, function (data) {
                if (data == "true") {
                    Public.tip('验证完成，数据一致。');
                } else {
                    Public.errorTip('验证完成，数据不一致。');
                }
            });
        }
    }, {
        name: '保存',
        event: function () {
            doSaveGraphicText();
        }
    }, {
        name: '添加节点',
        event: function () {
            showInsertBatchDialog();
        }
    }, {
        name: '修改',
        event: function () {
            var data = $('#mainflash')[0].getSelectedTextTag();
            if (data != null) {
                showUpdateDialog(data.projectNodeId);
            }
        }
    }, {
        name: '删除',
        event: function () {
            deleteProjectNode();
        }
    }, {
        name: '同步ID',
        event: function () {
            updateProjectNodeId();
        }
    }, {
        name: '节点配置',
        event: function () {
            var data = $('#mainflash')[0].getSelectedTextTag();
            if (data != null) {
                showNodeManageDialog(data.projectNodeId, data.shortName
										|| data.name);
            }
        }
    }, {
        name: '添加折线点',
        event: function () {
            $('#mainflash')[0].addFoldPoint({
                x: 100,
                y: 100
            });
        }
    }, {
        name: '水平对齐',
        event: function () {
            $('#mainflash')[0].horizSelected();
        }
    }, {
        name: '垂直对齐',
        event: function () {
            $('#mainflash')[0].verticalSelected();
        }
    }]);
    var html = '<li id="lineType" class="item">'
			+ '<label><input style="height:25px;" type="radio" name="lineType" value="standard" checked="true"></input>标准箭头</label>'
			+ '<label><input style="height:25px;" type="radio" name="lineType" value="dashed"></input>虚线箭头</label>'
			+ '<label><input style="height:25px;" type="radio" name="lineType" value="bold"></input>加粗箭头</label></li>'
			+ '<li id="showFold" class="item">'
			+ '<label><input style="height:25px;" type="checkbox" name="showFold" value="bold" checked="true"></input>显示折线点</label>'
			+ '</li>';
    $('#toolBar ul').append(html);

    $('#lineType label').on('click', function (e) {
        if (e.target.nodeName.toLowerCase() == 'label') {
            e.target.firstChild.checked = true;
        }
        $('#lineType [name=lineType]').each(function () {
            if (this.checked) {
                $('#mainflash')[0].setLineType(this.value);
            }
        });
    });
    $('#showFold label').on('click', function (e) {
        var t = e.target;
        if (t.nodeName.toLowerCase() == 'label') {
            t = t.firstChild;
        }
        if (t.checked) {
            $('#mainflash')[0].showFoldPoint(true);
        } else {
            $('#mainflash')[0].showFoldPoint(false);
        }
    });
}

function flash_callback_func(etype, data) {
    if (etype == 'initFlash') {
        Public.ajax(operateCfg.loadProjectNodeAction, {
            projectNodeId: parentId,
            hasLoadGraphic: 1
        }, function (data) {
            if (data && data.graphicText) {
                prevJsonData = $.parseJSON(data.graphicText);
                if ($('#mainflash')) {
                    $('#mainflash')[0].loadImage(prevJsonData);
                    $('#mainflash')[0].showFoldPoint(true);
                }
            }
        });
        return;
    }

    if (data != null) {
        if (etype == 'rightclick') {
            currProjectNodeData = data;
            $('#menu').css('left', data.stageX);
            $('#menu').css('top', data.stageY + 28);
            $('#menu').show();
        } else if (etype == 'doubleclick') {
            showUpdateDialog(data.projectNodeId);
            // showNodeManageDialog(data.projectNodeId, data.shortName ||
            // data.name);
        } else if (etype == 'addline') {
            var oldData = prevJsonData;
            var newData = $('#mainflash')[0].saveImage();
            prevJsonData = newData;
            if (newData && newData.routes && newData.routes.length > 0) {
                var routes = [];
                for (var i = 0; i < newData.routes.length; i++) {
                    var isAdd = true;
                    if (oldData && oldData.routes && oldData.routes.length > 0) {
                        for (var j = 0; j < oldData.routes.length; j++) {
                            if (oldData.routes[j].to == newData.routes[i].to
									&& oldData.routes[j].from == newData.routes[i].from) {
                                isAdd = false;
                                break;
                            }
                        }
                    }
                    if (isAdd) {
                        routes[routes.length] = newData.routes[i];
                    }
                }

                var nodeBizKindId = ENodeBizKind.ProjectTemplateNode;
                if (bizKindId == ENodeConfigBizKind.ProjectTemplate) {
                    nodeBizKindId = ENodeBizKind.ProjectTemplateNode;
                } else if (bizKindId == ENodeConfigBizKind.Project) {
                    nodeBizKindId = ENodeBizKind.ProjectNode;
                }

                if (routes.length == 0) {
                    return;
                }
                var addParam = {
                    bizKindId: nodeBizKindId,
                    relationshipKindId: ERelationshipKind.Successor,
                    routes: routes
                };

                var params = {
                    data: $.toJSON(addParam)
                };

                Public.ajax(operateCfg.insertNodeRelationshipAction, params,
						function (data) {
						    Public.tip('添加节点关系成功');
						}, function (data) {
						    $('#mainflash')[0].loadImage(oldData);
						    prevJsonData = oldData;
						});
            }
        }
    }

}

function hideMenu() {
    $('#menu').hide();
}

function showMenu() {
    $('#menu').show();
}

function doBatchSaveProjectNode() {
    if (!this.iframe || !this.iframe.contentWindow)
        return;

    var data = this.iframe.contentWindow.getSelectedData();
    if (!data)
        return;

    // 调用批量添加节点方法
    var nodeDefineIds = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].nodeDefineId)
            nodeDefineIds[nodeDefineIds.length] = data[i].nodeDefineId;
    }

    var params = {
        bizId: bizId,
        bizKindId: bizKindId,
        parentId: parentId,
        nodeDefineIds: $.toJSON(nodeDefineIds)
    };

    var _self = this;
    Public.ajax(operateCfg.insertProjectNodeByNodeDefineAction, params,
			function (data) {
			    var data = data.Rows;
			    for (var i = 0; i < data.length; i++) {
			        var textWidth = 120
			        if (data[i].shortName.length > 8) {
			            textWidth += Math.ceil((data[i].shortName.length - 8) / 2) * 30;
			        }
			        $('#mainflash')[0].addTextTag({
			            // 节点数据属性
			            projectNodeId: data[i].projectNodeId,
			            nodeDefineId: data[i].nodeDefineId,
			            name: data[i].name,
			            shortName: data[i].shortName,
			            code: data[i].code,
			            iconUrl: data[i].iconUrl,
			            sequence: data[i].sequence,
			            description: data[i].description,

			            // 节点图形属性
			            uuid: data[i].projectNodeId,
			            text: data[i].shortName || data[i].name,
			            x: 250,
			            y: 100 + i * 49,
			            border: "2 #808080",
			            color: '#000000',
			            background_color: '#F0FFFF,#ffffff',
			            font_size: '14px',
			            width: textWidth,
			            height: 45,
			            icon: data[i].iconUrl
										? (web_app.name + data[i].iconUrl)
										: '',
			            iconWidth: 30,
			            iconHeight: 30,
			            iconX: -60,
			            iconY: -20
			        });
			    }

			    setPrevJsonData();

			    _self.close();
			});
}

function onDialogCloseHandler() {

}

function setPrevJsonData() {
    prevJsonData = $('#mainflash')[0].saveImage();
}

function getId() {
    return parseInt($("#projectNodeId").val() || 0);
}

function showInsertBatchDialog() {
    if (!canOperate) {
        PAUtil.tipNoRightOperate();
        return;
    }

    UICtrl.showFrameDialog({
        url: operateCfg.showNodeDefine,
        title: operateCfg.showNodeDefineTitle,
        param: {},
        width: PAUtil.dialogWidth,
        height: PAUtil.dialogHeight,
        ok: doBatchSaveProjectNode,
        close: onDialogCloseHandler
    });
    return;
}

function showUpdateDialogForContextMenu() {
    hideMenu();
    showUpdateDialog(currProjectNodeData.projectNodeId);
}

function showUpdateDialog(projectNodeId) {

    if (bizKindId == ENodeConfigBizKind.Project
			&& !PAUtil.checkProjectOperateRight(bizId, projectNodeId, true)) {
        PAUtil.tipNoRightOperate();
        return;
    }

    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            id: projectNodeId
        },
        title: operateCfg.showUpdateTitle,
        width: 400,
        ok: doSaveProjectNode,
        close: onDialogCloseHandler
    });
}

function doSaveProjectNode() {
    var _self = this;
    var id = getId();
    $('#submitForm').ajaxSubmit({
        url: (id ? operateCfg.updateAction : operateCfg.insertAction),
        success: function (data) {
            updatePorjectNodeJson(data)
            _self.close();
        }
    });
}

function doSaveGraphicText() {
    var graphicText = $('#mainflash')[0].saveImage();
    var params = {
        projectNodeId: parentId,
        graphicText: $.toJSON(graphicText)
    };
    Public.ajax(operateCfg.updateProjectNodeGraphicTextAction, params,
			function (data) {
			    Public.tip('保存成功');
			});
}

function showNodeManageDialogForContextMenu() {
    hideMenu();
    showNodeManageDialog(currProjectNodeData.projectNodeId,
			currProjectNodeData.shortName || currProjectNodeData.name);
}

function showNodeManageDialog(nodeId, name) {
    var nodeBizKindId = ENodeBizKind.ProjectTemplateNode;

    if (bizKindId == ENodeConfigBizKind.Project
			&& !PAUtil.checkProjectOperateRight(bizId, nodeId, true)) {
        PAUtil.tipNoRightOperate();
        return;
    }

    var url = "";
    if (bizKindId == ENodeConfigBizKind.ProjectTemplate) {
        nodeBizKindId = ENodeBizKind.ProjectTemplateNode;
        url = operateCfg.showNodeManage + '?bizId=' + nodeId + '&bizKindId='
				+ nodeBizKindId;
    } else if (bizKindId == ENodeConfigBizKind.Project) {
        nodeBizKindId = ENodeBizKind.ProjectNode;
        url = operateCfg.showNodeManage + '?bizId=' + nodeId + '&bizKindId='
				+ nodeBizKindId;
        url += '&projectId=' + bizId;
    }

    top.addTabItem({
        tabid: 'NodeManage' + nodeId,
        text: '[' + name + ']节点管理',
        url: url
    });
}

function deleteProjectNode() {
    if (!canOperate) {
        PAUtil.tipNoRightOperate();
        return;
    }

    var oldData = $('#mainflash')[0].saveImage();
    $('#mainflash')[0].delSelected();
    var newData = $('#mainflash')[0].saveImage();

    if (oldData) {
        var projectNodeIds = [];
        if (oldData.textTags && oldData.textTags.length > 0) {
            for (var i = 0; i < oldData.textTags.length; i++) {
                var isDel = true;
                if (newData && newData.textTags && newData.textTags.length > 0) {
                    for (var j = 0; j < newData.textTags.length; j++) {
                        // if(equal(oldData.textTags[i],newData.textTags[j]))
                        if (oldData.textTags[i].uuid == newData.textTags[j].uuid) {
                            isDel = false;
                            break;
                        }
                    }
                }
                if (isDel) {
                    projectNodeIds[projectNodeIds.length] = oldData.textTags[i].uuid;
                }
            }
        }

        var routes = [];
        if (oldData.routes && oldData.routes.length > 0) {
            for (var i = 0; i < oldData.routes.length; i++) {
                var isDel = true;
                if (newData && newData.routes && newData.routes.length > 0) {
                    for (var j = 0; j < newData.routes.length; j++) {
                        // if(equal(oldData.routes[i],newData.routes[j]))
                        if (oldData.routes[i].to == newData.routes[j].to
								&& oldData.routes[i].from == newData.routes[j].from) {
                            isDel = false;
                            break;
                        }
                    }
                }
                if (isDel) {
                    routes[routes.length] = oldData.routes[i];
                }
            }
        }

        var delParam = {
            projectNodeIds: projectNodeIds,
            routes: routes
        };

        var params = {
            data: $.toJSON(delParam)
        };

        Public.ajax(operateCfg.deleteProjectNodeByGraphicAction, params,
				function (data) {
				    Public.tip('删除成功');
				    prevJsonData = newData;
				}, function (data) {
				    $('#mainflash')[0].loadImage(oldData);
				    prevJsonData = oldData;
				});

    }
}

function updatePorjectNodeJson(node) {
    var data = $('#mainflash')[0].saveImage();
    if (data && data.textTags && data.textTags.length > 0) {
        for (var i = 0; i < data.textTags.length; i++) {
            if (data.textTags[i].projectNodeId == node.projectNodeId) {

                var textWidth = 120
                if (node.shortName.length > 8) {
                    textWidth += Math.ceil((node.shortName.length - 8) / 2) * 30;
                }
                data.textTags[i].projectNodeId = node.projectNodeId;
                data.textTags[i].nodeDefineId = node.nodeDefineId;
                data.textTags[i].name = node.name;
                data.textTags[i].shortName = node.shortName;
                data.textTags[i].code = node.code;
                data.textTags[i].iconUrl = node.iconUrl;
                data.textTags[i].sequence = node.sequence;
                data.textTags[i].description = node.description;

                data.textTags[i].icon = node.iconUrl
						? (web_app.name + node.iconUrl)
						: "";
                data.textTags[i].uuid = node.projectNodeId;
                data.textTags[i].text = node.shortName || node.name;
                data.textTags[i].width = textWidth;
                data.textTags[i].iconWidth = 30;
                data.textTags[i].iconHeight = 30;
                data.textTags[i].iconX = -60;
                data.textTags[i].iconY = -20;
            }
        }
    }
    prevJsonData = data;
    $('#mainflash')[0].loadImage(data);
}

function updateProjectNodeId() {
    Public.ajax(operateCfg.updateProjectNodeId, {
        projectNodeId: parentId 
    }, function (data) {
        if (data && data.graphicText) {
            prevJsonData = $.parseJSON(data.graphicText);
            if ($('#mainflash')) {
                $('#mainflash')[0].loadImage(prevJsonData); 
            }
        }
    }); 
}

// 选择功能点图标
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
        title: '选择功能图片',
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