var treeManager, gridManager = null, refreshFlag = false, selectFunctionDialog, lastSelectedId = 0;
var ids = null;

$(document).ready(function () {
    initializeUI();
    initializeGrid();
    loadProcessManageTree();
});

function onBeforeExpand(node) {
    if (node.data.hasChildren) {
        if (!node.data.children || node.data.children.length == 0) {
            Public.ajax(web_app + "/processManageAction!loadTreeLeaf.ajax", {
                parentId: node.data.reProcdefTreeId,
                flag: 1
            }, function (data) {
                treeManager.append(node.target, data.Rows);
            });
        }
    }
}

function procNodeClick(nodeData) {
    $('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + nodeData.name + "]</font>流程列表");

    lastSelectedId = nodeData.reProcdefTreeId;
    var params = $("#queryMainForm").formToJSON();
    params.parentId = lastSelectedId;
    UICtrl.gridSearch(gridManager, params);
}

function loadProcessManageTree(){
	$('#maintree').commonTree({
        loadTreesAction: '/processManageAction!loadTreeLeaf.ajax?flag=1',
        idFieldName: 'reProcdefTreeId',
        parentIDFieldName: "parentId",
        textFieldName: "name",
        onClick: function (data) {
            if (!data)
                return;
            procNodeClick(data);
        },
        IsShowMenu: false
    });

}

function initializeUI() {    
    UICtrl.autoSetWrapperDivHeight();
    UICtrl.layout("#layout", { leftWidth: 300, heightDiff: -5 });
}

function initSelectAppModelBox() {
    $("#appModelName").searchbox(
			{ type: 'app',
			    name: 'appModelSelect',
			    getParam: function () {
			        var param = {};
			        param['searchQueryCondition'] = " and Execute_Type=5 ";
			        return param;
			    },
			    back: { appModelId: '#appModelId', modelName: '#appModelName' }
			});
}

function linkProcessToTree(key) {
    var params = {};
    var row = gridManager.getSelected();
    params["reProcdefTreeId"] = row.reProcdefTreeId;
    params["key"] = key;
    $.ajax({
        url: web_app + "/processManageAction!linkProcessToTree.ajax",
        data: params,
        dataType: "json",
        async: false,
        type: "post"
    });
}

function initComboDialog() {
    $("#toolbar_menulinkToProcess").comboDialog({ disabled: true, type: 'process', name: 'processNotLinkedToTree',
        width: 700,
        dataIndex: 'id',
        checkbox: true,
        title: "选择流程",
        onShow: function () {
            var row = gridManager.getSelected();
            if (!row) {
                Public.tip('请选择一个流程!');
                return false;
            } else if (row.hasChildren > 0) {
                Public.tip('该节点下面有子节点不能添加流程链接!');
                return false;
            }
            return true;
        },
        onChoose: function () {
            var row = this.getSelectedRow();
            if (!row) {
                Public.tip("请选择一条流程!");
                return;
            }
            linkProcessToTree(row.key);
            refreshFlag = true;
            onDialogCloseHandler();
            return true;
        }
    });
}

/**
* 得到选择的对象
*/
function getSelectedObj() {
    var rows = gridManager.getSelectedRows();

    if (!rows || rows.length != 1) {
        Public.tip("请选择一条数据。");
        return;
    }

    return rows[0];
}

function importProcUnitHandler() {
    var obj = getSelectedObj();
    if (obj == null) {
        return;
    }

    Public.ajax(web_app.name + '/processManageAction!importProcUnit.ajax', {
        parentId: obj.reProcdefTreeId, processDefinitionKey: obj.key
    }, function (data) {
        reloadGrid();
    });
}

function deployProcessHandler() {
    var obj = getSelectedObj();
    if (obj == null) {
        return;
    }

    if (obj.nodeKindId != ProcNodeKind.PROC) {
        Public.tip("请选择流程！");
        return;
    }

    deploy(obj.reProcdefTreeId);
}

// 配置
function deploy(reProcdefTreeId) {
    var html = ['<div class="ui-form" style="width:340px">'],
        fields = [
            { id: 'filePath', text: '流程文件路径', type: 'text' }
        ];
    var template = ["<dt style='width:290px'>{text}<font color='#FF0000'>*</font>&nbsp;:</dt>"];
    template.push("<dd style='width:330px'>");
    template.push("<input type='{type}' class='text' id='{id}' maxlength='300' value='{value}'/>");
    template.push("</dd>");
    $.each(fields, function (i, o) {
        html.push(template.join('').replace('{id}', o.id)
            .replace('{text}', o.text)
            .replace('{value}', o.value || '')
            .replace('{type}', o.type));
    });
    UICtrl.showDialog({
        width: 350,
        top: 150,
        title: '发布流程',
        height: 100,
        content: html.join(''),
        ok: function () {
            var fileName = $("#filePath").val();
            if (!fileName) return;
            Public.ajax(web_app.name + '/workflowAction!deploy.ajax', {
                fileName: fileName,
                reProcdefTreeId: reProcdefTreeId
            }, function (data) {
            });
        },
        close: onDialogCloseHandler
    });
}

function doMoveFunction() {
    var moveToNode = $('#movetree').commonTree('getSelected');
    var moveToId = moveToNode.reProcdefTreeId;
    if (!moveToId) {
        Public.tip('请选择移动到的节点！');
        return false;
    }

    if (moveToNode.key) {
        Public.tip('不能移动到该节点下面！');
        return false;
    }

    var params = {};
    params.parentId = moveToId;
    params.ids = $.toJSON(ids);
    Public.ajax("processManageAction!moveProcess.ajax", params, function (data) {
        reloadGrid();
        $("#maintree").commonTree('refresh');
        selectFunctionDialog.hide();
    });
}

function moveHandler() {
    ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "reProcdefTreeId"
    });
    if (!ids) {
        return;
    }

    if (!selectFunctionDialog) {
        selectFunctionDialog = UICtrl.showDialog({
            title: "移动到...",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
            init: function () {
                $('#movetree').commonTree({
                    loadTreesAction: "processManageAction!loadChildFolders.ajax",
                    idFieldName: 'reProcdefTreeId',
                    IsShowMenu: false
                });
            },
            ok: doMoveFunction,
            close: function () {
                this.hide();
                return false;
            }
        });
    } else {
        $('#movetree').commonTree('refresh');
        selectFunctionDialog.show().zindex();
    }
}

function renderBooleanKind(value){
   return "<div class='" + (value ? "Yes" : "No") + "'/>";
}

//初始化表格
function initializeGrid() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: showInsertChildDialog,
        updateHandler: showUpdateDialog,
        moveHandler: moveHandler,
        deleteHandler: deleteHandler,
        saveSortIDHandler: updateSequence,
        importProcUnit: { id: 'importProcUnit', text: '导入流程环节', img: 'list_packages.gif', click: importProcUnitHandler },
        linkToProcess: { id: 'linkToProcess', text: '链接流程', img: 'link.gif' },
        deployProcess: { id: 'deployProcess', text: '发布流程', img: 'page_dynamic.gif', click: deployProcessHandler }
    });

    gridManager = UICtrl.grid('#maingrid', {
        columns: [
            { display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "流程ID", name: "key", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "路径", name: "fullName", width: 200, minWidth: 60, type: "string", align: "left" },
            { display: "是否计时", name: "needTiming", width: 60, minWidth: 60, type: "string", align: "left",
               render : function(item) {
               	   return renderBooleanKind(item.needTiming);
				}
			},
            { display: "预览处理人", name: "showQueryHandlers", width: 80, minWidth: 60, type: "string", align: "left",
                           render : function(item) {
               	   return renderBooleanKind(item.showQueryHandlers);
				}
            },
            { display: "排序号", name: "sequence", width: 60, minWidth: 60, type: "int", align: "left",
                render: function (item) {
                    item.id = item.reProcdefTreeId; //只为了能够更新sequence
                    return UICtrl.sequenceRender(item);
                }
            },
            { display: "状态", name: "status", width:60, minWidth: 60, type: "string", align: "left",
			         render : function(item) {
			    	   return renderBooleanKind(item.status);
					}
			 },
            { display: "描述", name: "description", width: 190, minWidth: 60, type: "string", align: "left" }
        ],
        dataAction: 'server',
        url: web_app.name + '/processManageAction!loadChildFolders.ajax',
        parms: {
            parentId: 1
        },
        usePager: false,
        sortName: "sequence",
        SortOrder: "asc",
        toolbar: toolbarOptions,
        width: '99.8%',
        height: '100%',
        heightDiff: -13,
        headerRowHeight: 25,
        rowHeight: 25,
        checkbox: true,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        onDblClickRow: function (data, rowindex, rowobj) {
            doShowUpdateDialog(data.reProcdefTreeId);
        }
    });
    UICtrl.setSearchAreaToggle(gridManager);
    initComboDialog();
}

function getId() {
    return parseInt($("#reProcdefTreeId").val() || 0);
}

//弹出新增对话框
function showInsertChildDialog() {
    var node = $('#maintree').commonTree('getSelected');
    if (!node) {
        Public.tip('请选择左侧父节点!');
        return;
    }
    if (node.key) {
        Public.tip('节点已经链接到流程，不能再添加子结点！');
        return;
    }
    UICtrl.showAjaxDialog({
        title: "添加子节点",
        param: {
            parentId: node.reProcdefTreeId
        },
        init: function () {
            initSelectAppModelBox();
        },
        width: 410,
        url: web_app.name
            + '/processManageAction!showInsertChild.load',
        ok: doSaveChild,
        close: onDialogCloseHandler
    });
}

//弹出修改对话框
function showUpdateDialog() {
    var row = UICtrl.checkSelectedRows(gridManager);
    if (row) {
        doShowUpdateDialog(row.reProcdefTreeId);
    }
}

//进行修改操作
function doShowUpdateDialog(reProcdefTreeId) {
    UICtrl.showAjaxDialog({
        title: "修改子节点",
        url: web_app.name + '/processManageAction!showUpdateChild.load',
        param: {
            reProcdefTreeId: reProcdefTreeId
        },
        init: function () {
            initSelectAppModelBox();
        },
        width: 410,
        ok: doSaveChild,
        close: onDialogCloseHandler
    });
}

//进行新增、修改操作
function doSaveChild() {
    var _self = this;
    var treeId = getId();
    $('#submitForm').ajaxSubmit({
        url: web_app.name + (treeId ? '/processManageAction!updateChild.ajax' : '/processManageAction!insertChild.ajax'),
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

//删除节点 
function deleteHandler() {
    var rows = gridManager.getSelectedRows();
    if (rows.length > 1) {
        Public.tip("只能选择一条数据进行删除！");
        return;
    }

    var param = {};
    if (rows[0]) {
        param.reProcdefTreeId = rows[0].reProcdefTreeId;
    }

    var action = "processManageAction!delete.ajax";
    DataUtil.del({
        action: action,
        param: param,
        idFieldName: 'reProcdefTreeId',
        gridManager: gridManager,
        onSuccess: function () {
            refreshFlag = true;
            onDialogCloseHandler();
        }
    });
}

//更新排序号
function updateSequence() {
    var action = "processManageAction!updateSequence.ajax";
    DataUtil.updateSequence({
        action: action,
        idFieldName: "reProcdefTreeId",
        gridManager: gridManager,
        onSuccess: reloadGrid
    });
}

// 查询
function query(obj) {
    var param = $(obj).formToJSON();
    UICtrl.gridSearch(gridManager, param);
}

function reloadGrid() {
    $("#maintree").commonTree('refresh', lastSelectedId);
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}

//重置表单
function resetForm(obj) {
    $(obj).formClean();
}

//关闭对话框
function onDialogCloseHandler() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}


