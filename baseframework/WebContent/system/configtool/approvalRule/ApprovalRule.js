var approvalRuleTree, elementGridManager = null, layoutApprovalRuleManager = null, scopeGridManager,
    layoutProc = null, handlerGridManager = null, refreshFlag = false, parentId = 0, operatorKind = {},
    elementData = [], handlerData = [], yesNoList = { 0: '否', 1: '是' }, fieldType = {}, fieldAuthority = {},
    hasPermission = false, orgId;
    
$(document).ready(function () {
    initializeUI();

    operatorKind = $("#operatorKindId").combox("getFormattedData");
    //什么地方用下面两个变量
    fieldType = $('#fieldType').combox('getJSONData');
    fieldAuthority = $('#fieldAuthority').combox('getJSONData');
    
    loadOrgTreeView();
    loadProcTreeView();
    initializeGrid();
    
    setToolBarEnabled(false);

    bindEvents();
    
    function autoSetWrapperDivHeight() {
        $('html').addClass("html-body-overflow");
        var div = $('#mainWrapperDiv'), pageSize = UICtrl.getPageSize();
        if ($.browser.msie && $.browser.version < 8) {
            div.height(pageSize.h - 10);
        }
        $('#divOrgTreeArea').height(pageSize.h - 40);
        $('#divProcTreeArea').height(pageSize.h - 50);
        $('#divApprovalRuleTreeArea').height(pageSize.h - 50);
        var str_data = 'resize-special-event';
        div.data(str_data, pageSize);
        setInterval(function () {
            var _size = UICtrl.getPageSize(), data = div.data(str_data);
            if (_size.h !== data.h) {
                if ($.browser.msie && $.browser.version < 8) {
                    div.data(str_data, _size).height(_size.h - 10);
                }
                $('#divOrgTreeArea').height(_size.h - 40);
                 $('#divProcTreeArea').height(_size.h - 50);
                $('#divApprovalRuleTreeArea').height(_size.h - 50);
            }
        }, 140);
    }

    function initializeUI() {
    	UICtrl.autoGroupAreaToggle();
        autoSetWrapperDivHeight();
        UICtrl.layout("#layout", {
            leftWidth: 200,
            heightDiff: -5,
            onSizeChanged: function () {
                layoutProc._onResize();
                reRenderGrid();
            }
        });
        layoutProc = UICtrl.layout("#layoutProc", {
            leftWidth: 200,
            heightDiff: -10,
             onSizeChanged: function () {
                 layoutApprovalRuleManager._onResize();
                 reRenderGrid();
             }
        });
        layoutApprovalRuleManager = UICtrl.layout("#layoutApprovalRule", {
            leftWidth: 240,
            heightDiff: -14,
            onSizeChanged: function () {
            	reRenderGrid();
            }
        });
        
          $('#toolBar').toolBar([
			{ id: "insert", name: '添加', icon:"add", event:  insertApprovalRule },
	        { id: "update", name: '修改', icon: "edit", event:  updateApprovalRule  },
	        { id: "delete", name: '删除', icon: 'delete',  event: deleteApprovalRule },
	        { id: "copy", name: '复制', icon: 'copy',   event: copyApprovalRule  },
	        { id: "paste", name: '粘贴', icon: 'paste', event: pasteApprovalRule },
	        { id: "move", name: '移动', icon: 'move', event: moveApprovalRule },
	        { id: "syn", name: '同步', icon: 'syn', event: synApprovalRule }
	        ]);

        if (Public.isReadOnly) {
            $('#toolBar').hide();
        }
      
    }

    function bindEvents() {
    	$("a.togglebtn").on('click', function () {
    		reRenderGrid();
    	});
    }
    
    function reRenderGrid(){
		elementGridManager.reRender();
        handlerGridManager.reRender();    		
    }
});

function checkSelectedApprovalRule() {
    try {
        var selectedNode = approvalRuleTree.getSelected();
        if (selectedNode && selectedNode.data.nodeKindId == "2") {
            return true;
        }
    } catch (e) {

    }
    Public.errorTip("请选择审批规则节点。");
    return false;
}

// 初始化表格
function initializeGrid() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: function () {
            if (!checkSelectedApprovalRule()) return;
            UICtrl.addGridRow(elementGridManager, { sequence: elementGridManager.getData().length + 1 });
        },
        saveHandler: updateApprovalRuleElement,
        deleteHandler: function () {
            DataUtil.delSelectedRows({ action: 'approvalRuleAction!deleteApprovalRuleElement.ajax',
                gridManager: elementGridManager,
                onSuccess: function () {
                    elementGridManager.loadData();
                }
            });
        }
    });
    elementGridManager = UICtrl.grid('#elementGrid', {
        columns: [
            { display: "审批要素", name: "elementName", width: 200, minWidth: 60, type: "string", align: "left",
              editor: {
                 	type: 'select', beforeChange: function (item, editParm) {
                    var id = $('input[name="id"]', item).val();
                    var data = editParm.record;
                    if (id != data['elementCode']) {
                        data['fvalueid'] = "";
                        data['fvalue'] = "";
                        elementGridManager.reRender({ rowdata: data });
                    }
                }, data: { type: "bpm", name: "procApprovalElement", getParam: function () {
                    var procUnitId = $("#approvalRuleProcUnitId").val();
                    var proc = findProc();

                    if (!procUnitId || !proc) return false;
                    return { procKey: proc.key, procUnitId: procUnitId };
                },
                    back: { code: "elementCode", name: "elementName", dataSourceConfig: "dataSourceConfig"}
                }, required: true
                } 
            },
            { display: "操作符", name: "foperatorName", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: operatorKind, valueField: "foperator", required: true}
            },
            { display: "值ID", name: "fvalueid", width: 200, minWidth: 60, type: "string", align: "left",
                editor: { type: 'text', required: true}
            },
            { display: "值", name: "fvalue", width: 200, minWidth: 60, type: "string", align: "left",
                editor: { type: "dynamic", getEditor: function (row) {
                    var dataSourceConfig = row['dataSourceConfig'] || "";
                    if (!dataSourceConfig) return {};
                    var editor = (new Function("return " + dataSourceConfig))();
                    return editor;
                }
                }
            },
            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'spinner', min: 1, max: 100, mask: 'nnn'}
            }
        ],
        dataAction: 'server',
        url: web_app.name + '/approvalRuleAction!queryApprovalRuleElement.ajax',
        parms: {
            approvalRuleId: 0
        },
        pageSize: 20,
        width: '99%',
        height: 160,
        sortName: 'sequence',
        sortOrder: 'asc',
        headerRowHeight: 25,
        rowHeight: 25,
        usePager: false,
        toolbar: toolbarOptions,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        enabledEdit: true,
        checkbox: true,
        rownumbers: true,
        onAfterEdit: function (editParm) {
            var c = editParm.column, data = editParm.record;
            if (c.name == 'fvalue') {//启用的数据value 不能编辑
                elementGridManager.reRender({ rowdata: data });
            }
        },
        autoAddRow: { elementCode: "", foperator: "", dataSourceConfig: "" }
    });

    toolbarOptions = UICtrl.getDefaultToolbarOptions(
        { addHandler: function () {
            if (!checkSelectedApprovalRule()) return;
            UICtrl.addGridRow(handlerGridManager,
                { sequence: handlerGridManager.getData().length + 1,
                    kindId: "chief", allowAdd: 1, allowSubtract: 1, allowAbort: 0,  mustPass: 0, allowTransfer: 1, needTiming: 1
                });
        },
            saveHandler: updateApprovalRuleHandler,
            deleteHandler: function () {
                DataUtil.delSelectedRows({ action: 'approvalRuleAction!deleteApprovalRuleHandler.ajax',
                    gridManager: handlerGridManager,
                    onSuccess: function () {
                        handlerGridManager.loadData();
                    }
                });
            },
            addConfigStep: { id: 'addConfigStep', text: '配置', img: 'page_dynamic.gif', click: configStepHandler }
        });
    handlerGridManager = UICtrl.grid('#handlerGrid', {
        columns: [
            { display: "环节ID", name: "handlerKindId", width: 150, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: { type: 'text' }
            },
            { display: "描述", name: "description", width: 150, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: { type: 'text', required: true}
            },
            { display: "审批人类别", name: "handlerKindName", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'select', data: { type: "bpm", name: "approvalHandlerKind", back: { code: "handlerKindCode", name: "handlerKindName", dataSourceConfig: "dataSourceConfig"} }, required: true }
            },
             { display: "业务处理人参数", name: "bizHandlerParam", width: 100, minWidth: 60, type: "string", align: "left",
                 editor: { type: 'text' }
             },
            { display: "审批人ID", name: "handlerId", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'text', required: true}
            },
            { display: "审批人", name: "handlerName", width: 150, minWidth: 60, type: "string", align: "left",
                editor: { type: "dynamic", getEditor: function (row) {
                    var dataSourceConfig = row['dataSourceConfig'] || "";
                    if (!dataSourceConfig) return {};
                    return (new Function("return " + dataSourceConfig))();
                }
                }
            },
            { display: "分组号", name: "groupId", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'spinner', required: true}
            },
            { display: "必经节点", name: "mustPass", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: yesNoList, required: true }, render: yesNoRender
            },
            { display: "允许加签", name: "allowAdd", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: yesNoList, required: true }, render: yesNoRender
            },
            { display: "允许被减签", name: "allowSubtract", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: yesNoList, required: true }, render: yesNoRender
            },
            { display: "允许中止", name: "allowAbort", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: yesNoList, required: true }, render: yesNoRender
            },
            { display: "允许转交", name: "allowTransfer", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: yesNoList, required: true }, render: yesNoRender
            },
            { display: "是否计时", name: "needTiming", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: yesNoList, required: true }, render: yesNoRender
            },
            { display: "审批要点", name: "helpSection", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'text', required: false}
            },
            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'spinner', required: true}
            }
        ],
        dataAction: 'server',
        url: web_app.name + '/approvalRuleAction!queryApprovalRuleHandler.ajax',
        parms: {
            approvalRuleId: 0
        },
        pageSize: 20,
        width: '99%',
        height: '100%',
        sortName: 'groupId,sequence',
        sortOrder: 'asc',
        usePager: false,
        heightDiff: -20,
        headerRowHeight: 25,
        rowHeight: 25,
        toolbar: toolbarOptions,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        enabledEdit: true,
        rownumbers: true,
        checkbox: true,
        autoAddRow: { handlerKindName: "", dataSourceConfig: "", kindId: 'chief' }
    });
}

function yesNoRender(item, index, columnValue, columnInfo) {
    return yesNoList[columnValue];
}

function insertApprovalRule() {
   	if (!orgId) {
   		Public.errorTip("请选组织。");
	}
	if (!hasPermission){
  		Public.errorTip("您没有维护该组织的权限。");
	}
	
    if (!approvalRuleTree) {
        Public.errorTip("请选择规则节点。");
        return;
    }
    var rule = approvalRuleTree.getSelected();
    if (!rule) {
        Public.tip("请选择规则节点。");
        return;
    }
    
    if (rule.data.nodeKindId == '2') {
        Public.tip("不支持往该节点下面添加子节点。");
        return;
    }

    var procUnit = findProcUnit();
    if (!procUnit) {
        return;
    }
    if (parentId == '0') {
        Public.tip("请选择流程审批规则父节点。");
        return;
    }
    UICtrl.showAjaxDialog({
        title: "添加审批规则",
        width: 600,
        url: web_app.name + '/approvalRuleAction!showInsertApprovalRule.load',
        param: {
        	orgId: orgId,
            procKey: procUnit.key,
            procUnitId: procUnit.procUnitId,
            parentId: parentId,
            procUnitName: procUnit.name
        },
        init: initScopeDialog,
        ok: doInsertApprovalRule,
        close: dialogClose
    });
}

function getApprovalRuleId() {
    return $("#approvalRuleId").val() || 0;
}

function checkApprovalRuleId(id) {
    if (!id || id == 1) {
        Public.tip("无效的审批规则Id。");
        return 0;
    }
    return id;
}

function updateApprovalRule() {
    var id = getApprovalRuleId();
    if (!checkApprovalRuleId(id)) {
        return;
    }

    UICtrl.showAjaxDialog({
        title: "修改审批规则",
        width: 600,
        url: web_app.name + '/approvalRuleAction!showUpdateApprovalRule.load',
        param: { id: id },
        init: initScopeDialog,
        ok: doUpdateApprovalRule, close: dialogClose
    });
}

function dialogClose() {
    if (refreshFlag) {
        refreshFlag = false;
    }
}

function deleteApprovalRule() {
    var id = getApprovalRuleId();
    if (!checkApprovalRuleId(id)) {
        return;
    }
    var ids = [id];
    UICtrl.confirm('确定删除吗?', function () {
        Public.ajax(web_app.name + '/approvalRuleAction!deleteApprovalRule.ajax', {
            ids: $.toJSON(ids)
        }, function (data) {
            refreshApprovalRuleTree();
        });
    });
}

function refreshApprovalRuleTree() {
    var proc = findProc();
    if (!proc)
        return;

    var currentNode = approvalRuleTree.getSelected();
    var parentNode = null;
    if (currentNode) {
        if (parentId > 1) {
            parentNode = approvalRuleTree.getParent(currentNode.target);
        } else {
            parentNode = currentNode.data;
        }
        refreshNode({ manager: approvalRuleTree, queryAction: "/approvalRuleAction!queryApprovalRule.ajax",
            params: { orgId: orgId, procKey: proc.key, procUnitId: proc.procUnitId, parentId: parentId }, pNode: parentNode
        });
    }
}

function getScopeDataParam(){
	var detailData = scopeGridManager.getData();
	return {detailData: $.toJSON(detailData)};
}

function doInsertApprovalRule() {
    _self = this;
    
    $('#submitForm').ajaxSubmit({ url: web_app.name + '/approvalRuleAction!insertApprovalRule.ajax',
    	param: getScopeDataParam(),
    	success: function () {
            refreshApprovalRuleTree();
            _self.close();
        }
    });
}

function doUpdateApprovalRule() {
    _self = this;
    $('#submitForm').ajaxSubmit({ url: web_app.name + '/approvalRuleAction!updateApprovalRule.ajax',
        param: getScopeDataParam(),
    	success: function () {
            refreshApprovalRuleTree();
            _self.close();
        }
    });
}

function findProcUnit() {
    var procUnit = $('#maintree').commonTree("getSelected");
    if (procUnit) {
        return procUnit;
    }
    return null;
}

function findProc() {
    var proc = $('#maintree').commonTree("getSelected");
    if (proc) {
        return proc;
    }

    Public.tip("流程环节未找到对应的流程！");
    return null;
}

function procNodeClick(nodeData) {
    if (!nodeData){
    	return;    
    }
    
    var params = {};
    $("#approvalRuleTree").removeAllNode();
    $("#divApprovalRuleTreeArea").append($('<ul id="approvalRuleTree"></ul>'));
    parentId = 0;
    if (nodeData.hasChildren == 0) {
        params.procKey = nodeData.key;
        params.procName = nodeData.name;
        params.parentId = 0;
        params.procUnitId = nodeData.procUnitId;
        loadApprovalRuleTreeView(params);
    } else {
        refreshGrid(0);
    }
}

function setApprovalRuleTitle(approvalRule){
	var title = "审批规则信息";
    if (approvalRuleId && !Public.isBlank(approvalRule.fullName)){
    	title = "<font style='color:Tomato;'>[" + approvalRule.fullName + "]</font>" + "审批规则信息";
    }
    $("#group .titleSpan").html(title);
}

function refreshGrid(approvalRuleId) {
    elementGridManager.options.parms.approvalRuleId = approvalRuleId;
    elementGridManager.loadData();
    handlerGridManager.options.parms.approvalRuleId = approvalRuleId;
    handlerGridManager.loadData();
}

function loadApprovalRuleTreeView(options) {
    if (approvalRuleTree) {
        approvalRuleTree.clear();
        approvalRuleTree = null;
    }

    Public.ajax(web_app.name + "/approvalRuleAction!queryApprovalRule.ajax", {
    	orgId: orgId, 
        procKey: options.procKey,
        parentId: options.parentId,
        procName: options.procName,
        procUnitId: options.procUnitId
    }, function (data) {
        approvalRuleTree = $("#approvalRuleTree").ligerTree({
            data: data.Rows,
            idFieldName: "id",
            parentIDFieldName: "parentId",
            textFieldName: "name",
            checkbox: false,
            iconFieldName: "icon",
            btnClickToToggleOnly: true,
            nodeWidth: 180,
            isLeaf: function (data) {
                data.children = [];
                return data.hasChildren == 0;
            },
            onBeforeExpand: onApprovalRuleTreeBeforeExpand,
            onClick: function (node) {
                if (!node || !node.data)
                    return;
                var approvalRule = node.data;
                parentId = node.data.id;
                $("#approvalRuleProcKey").val(approvalRule.procKey);
                $("#approvalRuleId").val(approvalRule.id);
                $("#approvalRuleProcId").val(approvalRule.procId);
                $("#approvalRuleProcName").val(approvalRule.procName);
                $("#approvalRuleProcUnitId").val(approvalRule.procUnitId);
                $("#approvalRuleProcUnitName").val(approvalRule.procUnitName);
                $("#approvalRuleName").val(approvalRule.name);
                $("#approvalRulePriority").val(approvalRule.priority);
                $("#createTime").val(approvalRule.createTime);
                $("#creatorName").val(approvalRule.creatorName);
                $("#lastUpdateTime").val(approvalRule.lastUpdateTime);
                $("#lastUpdaterName").val(approvalRule.lastUpdaterName);
                $("#scopeNames").val(approvalRule.scopeNames);
                $("#approvalRuleRemark").val(approvalRule.remark);
                $("input[name='nodeKindId'][value=" + approvalRule.nodeKindId + "]").attr("checked", true);
                $("input[name='status'][value=" + approvalRule.status + "]").attr("checked", true);
                
                refreshGrid(parentId);
                setApprovalRuleTitle(approvalRule); 
            }
        });
    });
}

function onApprovalRuleTreeBeforeExpand(node) {
    if (node.data.hasChildren) {
        if (!node.data.children || node.data.children.length == 0) {
            parentId = node.data.id;
            var proc = findProc();
            Public.ajax(web_app + "/approvalRuleAction!queryApprovalRule.ajax", {
                orgId: orgId,
                procKey: proc.key,
                procUnitId: proc.procUnitId,
                parentId: parentId
            }, function (data) {
                approvalRuleTree.append(node.target, data.Rows);
            });
        }
    }
}

function checkItemDuplicate(grid, idFieldName, nameFiledName, message) {
    grid.endEdit();
    var data = grid.getData();
    var ids = [];
    var id;
    for (var i = 0; i < data.length; i++) {
        id = parseInt(data[i][idFieldName]);
        if ($.inArray(id, ids) > -1) {
            Public.tip(message + "[" + data[i][nameFiledName] + "]重复。");
            return false;
        }
        ids.push(id);
    }
    return true;
}

function updateApprovalRuleElement() {
    if (!checkItemDuplicate(elementGridManager, "elementCode", "elementName", "审批要素")) return;

    var elementData = DataUtil.getGridData({ gridManager: elementGridManager });
    if (!elementData) return false;

    Public.ajax(web_app.name + '/approvalRuleAction!updateApprovalRuleElement.ajax',
        { approvalRuleId: parentId, data: encodeURI($.toJSON(elementData)) },
        function () {
            elementGridManager.loadData();
        }
    );
}

function updateApprovalRuleHandler() {
    var handlerData = DataUtil.getGridData({ gridManager: handlerGridManager });
    if (!handlerData) return false;
    Public.ajax(web_app.name + '/approvalRuleAction!updateApprovalRuleHandler.ajax',
        { approvalRuleId: parentId, data: encodeURI($.toJSON(handlerData)) },
        function () {
            handlerGridManager.loadData();
        }
    );
}

function clearDetailKey(data) {
    $.each(data, function (i, o) {
        delete o["approvalRuleId"];
        delete o["id"];
    });
}

function copyApprovalRule() {
    elementData = elementGridManager.getData();
    clearDetailKey(elementData);
    handlerData = handlerGridManager.getData();
    clearDetailKey(handlerData);
    Public.tip("您已成功复制规则。");
}

function pasteApprovalRule() {
    if (!checkSelectedApprovalRule()) {
        return;
    }

    elementGridManager.appendRange(elementData);
    handlerGridManager.appendRange(handlerData);
    Public.tip("您已成功粘贴规则。");
}

function moveApprovalRule() {
    try {
        var selectedNode = approvalRuleTree.getSelected();
        if (!selectedNode || selectedNode.data.parentId == 0) {
            Public.errorTip("请选择审批规则节点。");
            return;
        }
    } catch (e) {

    }

    //if (!selectMoveDialog) {
        //selectMoveDialog = 
        UICtrl.showDialog({
            title: "移动到...",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
            init: function () {
                var procUnit = findProcUnit();
                //var url = "approvalRuleAction!queryApprovalRule.ajax?orgId=" + orgId + "procKey=" + procUnit.key + "&procName=" + encodeURI(encodeURI(procUnit.name)) + "&procUnitId=" + procUnit.procUnitId;
                var url = "approvalRuleAction!queryApprovalRule.ajax";
                $('#movetree').commonTree({
                    loadTreesAction: url,      
                    getParam: function(e){
                    	return { orgId: orgId,  procKey:  procUnit.key, procName: encodeURI(procUnit.name), procUnitId: procUnit.procUnitId };
                    },
                    IsShowMenu: false
                });
            },
            ok: doMoveApprovalRule,
            close: function () {
                this.hide();
                return false;
            }
        }
        )
    //} else {
    //    $('#movetree').commonTree('refresh');
    //    selectMoveDialog.show().zindex();
    //}
}

function doMoveApprovalRule() {
	var _self = this;
    var newParentId = $('#movetree').commonTree('getSelectedId');
    if (!newParentId) {
        Public.errorTip("请选择需要移动节点。");
        return;
    }

    var currentNode = approvalRuleTree.getSelected();
    var currentParentId = currentNode.data.parentId;
    if (currentParentId == newParentId) {
        Public.errorTip("没有更新父节点，不能移动。");
        return;
    }

    var params = {};
    params.newParentId = newParentId;
    params.id = currentNode.data.id;

    if (params.newParentId == params.id) {
        Public.errorTip("父、子节点相同，不能移动。");
        return;
    }

    Public.ajax("approvalRuleAction!moveApprovalRule.ajax", params, function (data) {
        //selectMoveDialog.hide();
    	_self.close(); 
    	procNodeClick(treeManager.commonTree("getSelected"));
        Public.tip("您已成功移动审批规则。");
    });
}

function synApprovalRule() {
    var proc = findProc();
    if (proc == null || proc.key == null || proc.nodeKindId == ProcNodeKind.FOLDER) {
        Public.errorTip("请选择需同步的流程节点。");
        return;
    }

    if (parentId == 0){
        Public.errorTip("请选需同步的审批规则。");
        return;
    }
    
    var msg = proc.name;
    if (parentId > 1){
    	var selectedNode = approvalRuleTree.getSelected();
    	msg += "\\" + selectedNode.data.name;
    }
    msg = "同步操作将同步流程“" + msg + "”下的审批规则数据，您是否确定同步？";
    
    UICtrl.confirm(msg, function () {
        Public.ajax(web_app.name + '/approvalRuleAction!synApprovalRule.ajax',
            { orgId: orgId, procKey: proc.key, approveRuleId: parentId },
            function (data) {
                if (data.returnCode != 0) {
                    Public.errorTip(data.returnMessage);
                } else {
                    Public.tip("您已成功同步流程审批规则。");
                }
            }
        );
    });
}

function setToolBarEnabled(value){
	 if (Public.isReadOnly){
		 return;
	 }
	
	var enableValue = value ? "enable" : "disable";
	$("#toolBar").toolBar(enableValue, "insert");
	$("#toolBar").toolBar(enableValue, "update");
	$("#toolBar").toolBar(enableValue, "delete");
	$("#toolBar").toolBar(enableValue, "paste");
	$("#toolBar").toolBar(enableValue, "move");
	$("#toolBar").toolBar(enableValue, "syn");
	
	var toolbarManager =  elementGridManager.toolbarManager;
	if (value){
		toolbarManager.setEnabled("menuAdd");
		toolbarManager.setEnabled("menuSave");
		toolbarManager.setEnabled("menuDelete");
	}else{
		toolbarManager.setDisabled("menuAdd");
		toolbarManager.setDisabled("menuSave");
		toolbarManager.setDisabled("menuDelete");
	}
	
	var toolbarManager =  handlerGridManager.toolbarManager;
	if (value){
		toolbarManager.setEnabled("menuAdd");
		toolbarManager.setEnabled("menuSave");
		toolbarManager.setEnabled("menuDelete");
		toolbarManager.setEnabled("menuaddConfigStep");
	}else{
		toolbarManager.setDisabled("menuAdd");
		toolbarManager.setDisabled("menuSave");
		toolbarManager.setDisabled("menuDelete");
		toolbarManager.setDisabled("menuaddConfigStep");		
	}
}

function loadOrgTreeView() {
    $('#orgTree').commonTree({
        loadTreesAction: web_app.name + '/orgAction!queryOrgs.ajax',
        parentId: '',
        getParam: function (e) {
            if (e) {
                return { showDisabledOrg: 0, displayableOrgKinds: "ogn" };
            }
            return { showDisabledOrg: 0 };
        },
        manageType: 'procApprovalRule',
        isLeaf: function (data) {
            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status, false);
        },
        onClick: function (data) {
        	orgId = data.id;
        	hasPermission = data.managerPermissionFlag;
        	setToolBarEnabled(hasPermission);
        	procNodeClick(treeManager.commonTree("getSelected"));
        },
        IsShowMenu: false
    });
}

function showSelectOrgDialog(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	selectOrgParams['selectableOrgKinds']='ogn';
	selectOrgParams['displayableOrgKinds'] = "ogn";
	var options = { params: selectOrgParams,title : "选择组织机构",
		confirmHandler: function(){
			var rows = this.iframe.contentWindow.selectedData;
			if (rows.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}

		    $.each(rows, function (i, o) {
		    	scopeGridManager.addRow({ orgId: o.id, fullName: o.fullName });
		    });

			this.close();
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function initScopeDialog(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions(
	        { addHandler: showSelectOrgDialog,
	         deleteHandler: function () {
	                DataUtil.delSelectedRows({ action: "approvalRuleAction!deleteApprovalRuleScope.ajax",
	                    idFieldName: "id",
	                    gridManager: scopeGridManager,
	                    onSuccess: function () {
	                    	scopeGridManager.loadData();
	                    }
	                });
	            }
	        });
	
	scopeGridManager = $("#scopeGrid").ligerGrid({
	    columns: [
	            { display: "组织名称", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left" }
	             ],
	    dataAction: "server",
	    url: web_app.name + '/approvalRuleAction!queryApprovalRuleScope.ajax',
	    parms: { approvalRuleId: getApprovalRuleId() },
	    toolbar: toolbarOptions,
	    width: "100%",
	    height: 180,
	    sortName: 'fullName',
	    sortOrder: "asc",
	    heightDiff: -12,
	    headerRowHeight: 25,
	    rowHeight: 25,
	    enabledEdit: true,
	    checkbox: true,
	    fixedCellHeight: true,
	    selectRowButtonOnly: true,
	    rownumbers: true,
	    onLoadData: function () {
	        return  getApprovalRuleId() > 0;
	    }
	});
}
