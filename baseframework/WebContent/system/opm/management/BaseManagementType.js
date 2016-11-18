var gridManager, refreshFlag, operateCfg = {};
$(function () {
    bindEvents();
    initializeUI();
    initializeOperateCfg();
    initializeGrid();
   
    function initializeOperateCfg() {
        var path = web_app.name + '/managementAction!';
        operateCfg.queryAction = path + 'slicedQueryBaseManagementTypes.ajax';
        operateCfg.showInsertAction = path + 'showBaseManagementTypeDetail.load';
        operateCfg.showUpdateAction = path + 'loadBaseManagementType.load';
        operateCfg.insertAction = path + 'insertBaseManagementType.ajax';
        operateCfg.updateAction = path + 'updateBaseManagementType.ajax';
        operateCfg.deleteAction = path + 'deleteBaseManagementType.ajax';
        operateCfg.updateSequenceAction = path + 'updateBaseManagementTypeSequence.ajax';
        operateCfg.moveAction = path + 'updateBaseManagementTypeFolderId.ajax';

        operateCfg.insertTitle = "添加基础管理权限类别";
        operateCfg.updateTitle = "修改基础管理权限类别";
    }

    function bindEvents() {
        $("#btnQuery").click(function () {
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(gridManager, params);
        });
        $("#btnReset").click(function () {
            $(this.form).formClean();
        });
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();
        var toolbarparam = { addHandler: showInsertDialog, updateHandler: showUpdateDialog, deleteHandler: deleteBaseManagementType, saveSortIDHandler: updateBaseManagementTypeSequence, moveHandler: moveHandler };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
					{ display: "编码", name: "code", width: 200, minWidth: 60, type: "string", align: "left" },
					{ display: "名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },
					{ display: "业务管理权限类别", name: "bizManagementTypeName", width: 160, minWidth: 60, type: "string", align: "left" },
					{ display: "排序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
					    render: function (item) {
					        return "<input type='text' id='txtSequence_"
									+ item.id + "' class='textbox' value='"
									+ item.sequence + "' />";
					    }
					},
					{ display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left" }
					],
            dataAction: "server",
            url: operateCfg.queryAction,
            parms: {
                code: "",
                name: ""
            },
            pageSize: 20,
            toolbar: toolbarOptions,
            sortName: "sequence",
            sortOrder: "asc",
            width: "99.8%",
            height: "100%",
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowIndex, rowObj) {
                doShowUpdateDialog(data.id);
            }
        });
        UICtrl.setSearchAreaToggle(gridManager);
    }

    function initializeUI() {
        UICtrl.layout("#layout", { leftWidth: 200, heightDiff: -5 });
        $('#maintree').commonTree({
            kindId: CommonTreeKind.BaseManagementType,
            onClick: onFolderTreeNodeClick
        });
    }
});

function onFolderTreeNodeClick(data, folderId) {
    var html = [];
    if (folderId == CommonTreeKind.BaseManagementType) {
        folderId = "";
        html.push('基础管理权限类别列表');
    } else {
        html.push('<font style="color:Tomato;font-size:13px;">[', data.name, ']</font>基础管理权限类别列表');
    }
    $('.l-layout-center .l-layout-header').html(html.join(''));
    $('#treeFolderId').val(folderId);
    if (gridManager) {
        UICtrl.gridSearch(gridManager, { folderId: folderId });
    }
}

function getId() {
    return parseInt($("#id").val() || 0);
}

function showInsertDialog() {
    var folderId = $('#treeFolderId').val();
    if (folderId == '') {
        Public.tip('请选择类别树！');
        return;
    }
    UICtrl.showAjaxDialog({
        title: operateCfg.insertTitle,
        width: 400,
        init: initDialog,
        url: operateCfg.showInsertAction,
        ok: doSaveBaseManagementType,
        close: onDialogCloseHandler
    });
}

function doShowUpdateDialog(id) {
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            id: id
        },
        title: operateCfg.updateTitle,
        width: 400,
        init: initDialog,
        ok: doSaveBaseManagementType,
        close: onDialogCloseHandler
    });
}

function showUpdateDialog() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip("请选择数据！");
        return;
    }
    doShowUpdateDialog(row.id);
}

function doSaveBaseManagementType() {
    var _self = this;
    var id = getId();
    var param = {};
    if (!id) {//新增时加入目录ID
        param['folderId'] = $('#treeFolderId').val();
    }
    $('#submitForm').ajaxSubmit({ url: web_app.name + (id ? operateCfg.updateAction : operateCfg.insertAction),
        param: param,
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

function deleteBaseManagementType() {
    DataUtil.del({ action: operateCfg.deleteAction, gridManager: gridManager, onSuccess: reloadGrid });
}

function updateBaseManagementTypeSequence() {
    DataUtil.updateSequence({ action: operateCfg.updateSequenceAction, gridManager: gridManager, onSuccess: reloadGrid });
}

function reloadGrid() {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}

function onDialogCloseHandler() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}

function showSelectBizManagementTypeDialog() {
    var params = { confirmHandler: onSelectBizManagementTypeHandler, closeHandler: function () { } };
    OpmUtil.showSelectBizManagementTypeDialog(params);
}

function onSelectBizManagementTypeHandler() {
    _self = this;
    var data = this.iframe.contentWindow.getBizManagementTypeData();
    if (data.nodeKindId != CommonNodeKind.Leaf) {
        Public.errorTip("请选择业务权限类别。");
        return;
    }

    $("#bizManagementTypeId").val(data.id);
    $("#bizManagementTypeName").val(data.name);

    _self.close();
}

function initDialog(doc) {
    $("#btnSelectBizManagementType").click(
	function () {
	    showSelectBizManagementTypeDialog();
	}
	);
    /*
    $('#btnSelectBizManagementType').comboDialog({type:'sys',name:'bizManagementType',lock:false,
    dataIndex:'id',
    title:'业务管理权限选择',
    onChoose:function(dialog){
    var rows=this.getSelectedRow();
    if(!rows){
    Public.tip('请选择数据!');
    return false;
    }
    $("#bizManagementTypeId").val(rows.id);
    $("#bizManagementTypeName").val(rows.name);
    return true;
    }
    });
    */
}

//移动
function moveHandler() {
    UICtrl.showMoveTreeDialog({
        gridManager: gridManager, title: '移动基础管理权限', kindId: CommonTreeKind.BaseManagementType,
        save: function (parentId) {
            DataUtil.updateById({ action: operateCfg.moveAction,
                gridManager: gridManager, param: { folderId: parentId },
                onSuccess: function () {
                    reloadGrid();
                }
            });
        }
    });
}