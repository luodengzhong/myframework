var gridManager, refreshFlag, operateCfg = {};
var selectMoveDialog;

var pageParam = { rootId: 1, rootParentId: 0, parentId: 0 };

$(function () {
    bindEvents();
    initializeOperateCfg();
    initializeGrid();
    loadBizManagementTypeTree();
    initializeUI();

    function initializeOperateCfg() {
        var path = web_app.name + '/managementAction!';
        operateCfg.queryTreeAction = path + 'queryBizManagementTypes.ajax';
        operateCfg.queryAction = path + 'slicedQueryBizManagementTypes.ajax';
        operateCfg.showInsertAction = path + 'showBizManagementTypeDetail.load';
        operateCfg.showUpdateAction = path + 'loadBizManagementType.load';
        operateCfg.insertAction = path + 'insertBizManagementType.ajax';
        operateCfg.updateAction = path + 'updateBizManagementType.ajax';
        operateCfg.deleteAction = path + 'deleteBizManagementType.ajax';
        operateCfg.updateSequenceAction = path + 'updateBizManagementTypeSequence.ajax';
        operateCfg.moveAction = path + 'moveBizManagementType.ajax';

        operateCfg.insertTitle = "添加业务管理权限类别";
        operateCfg.updateTitle = "修改业务管理权限类别";
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
        var toolbarparam = { addHandler: showInsertDialog, updateHandler: showUpdateDialog, deleteHandler: deleteBizManagementType, saveSortIDHandler: updateBizManagementTypeSequence, moveHandler: moveHandler };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
					{ display: "编码", name: "code", width: 200, minWidth: 60, type: "string", align: "left" },
					{ display: "名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },
					{ display: "类别", name: "kindId", width: 100, minWidth: 60, type: "string", align: "left",
					    render: function (item) {
					        return item.kindId == 0 ? '系统' : '自定义';
					    }
					},
					{ display: "节点类别", name: "nodeKindId", width: 100, minWidth: 60, type: "string", align: "left",
					    render: function (item) {
					        return item.nodeKindId == CommonNodeKind.Limb ? '分类' : '权限类别';
					    }
					},
					{ display: "排序号", name: "sequence", width: "60", minWidth: 60, type: "string", align: "left",
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
                parentId: pageParam.rootId
            },
            pageSize: 20,
            sortName: 'sequence',
            sortOrder: 'asc',
            toolbar: toolbarOptions,
            width: "100%",
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
    	UICtrl.autoSetWrapperDivHeight();
        UICtrl.layout("#layout", { leftWidth: 200, heightDiff: -5 });
    }

    function loadBizManagementTypeTree() {
        $('#maintree').commonTree({
            loadTreesAction: "/managementAction!queryBizManagementTypes.ajax",
            parentId: pageParam.rootParentId,
            isLeaf: function (data) {
                return parseInt(data.hasChildren) == 0;
            },
            onClick: function (data) {
                onTreeNodeClick(data);
            },
            IsShowMenu: false
        });
    }
});

function onTreeNodeClick(data) {
    var html = [];
    if (data.id == pageParam.rootId) {
        html.push('业务管理权限类别列表');
    } else {
        html.push('<font style="color:Tomato;font-size:13px;">[', data.name, ']</font>业务管理权限类别列表');
    }
    pageParam.parentId = data.id;
    $('.l-layout-center .l-layout-header').html(html.join(''));
    if (gridManager) {
        UICtrl.gridSearch(gridManager, { parentId: pageParam.parentId });
    }
}

function getId() {
    return parseInt($("#id").val() || 0);
}

function showInsertDialog() {
    if (pageParam.parentId == pageParam.rootParentId) {
        Public.tip('请选择类别树！');
        return;
    }

    UICtrl.showAjaxDialog({
        url: operateCfg.showInsertAction,
        title: operateCfg.insertTitle,
        param: { parentId: pageParam.parentId },
        width: 340,
        ok: doSaveBizManagementType,
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
        width: 340,
        ok: doSaveBizManagementType,
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

function doSaveBizManagementType() {
    var _self = this;
    var id = getId();

    $('#submitForm').ajaxSubmit({
        url: web_app.name + (id ? operateCfg.updateAction : operateCfg.insertAction),
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

function deleteBizManagementType() {
    DataUtil.del({ action: operateCfg.deleteAction, gridManager: gridManager, onSuccess: reloadGrid });
}

function updateBizManagementTypeSequence() {
    DataUtil.updateSequence({ action: operateCfg.updateSequenceAction, gridManager: gridManager, onSuccess: reloadGrid });
}

function onDialogCloseHandler() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}

function doMoveBizManagementType(ids) {
    var newParentNode = $('#movetree').commonTree('getSelected');
    if (newParentNode == null) {
        Public.errorTip('请选择移动到的节点。');
        return false;
    }
    var newParentId = newParentNode.id;
    if (!newParentId) {
        Public.errorTip('请选择移动到的节点。');
        return false;
    }

    if (newParentId == pageParam.parentId) {
        Public.errorTip('您选择的目标节点和源节点一样，不能移动。');
        return false;
    }

    var params = {};
    params.parentId = newParentId;
    params.ids = $.toJSON(ids);

    Public.ajax(operateCfg.moveAction, params, function (data) {
        selectMoveDialog.hide();
        reloadGrid();
    });
}

function reloadGrid() {
    $("#maintree").commonTree('refresh', pageParam.parentId);
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}

//移动
function moveHandler() {
    var ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "id"
    });

    if (!ids) {
        Public.errorTip("请选择要移动的业务管理权限类别。");
        return;
    }

    if (!selectMoveDialog) {
        selectMoveDialog = UICtrl.showDialog({
            title: "移动到...",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
            init: function () {
                $('#movetree').commonTree({
                    loadTreesAction: "/managementAction!queryBizManagementTypes.ajax",
                    idFieldName: 'id',
                    IsShowMenu: false
                });
            },
            ok: function () {
                doMoveBizManagementType.call(this, ids);
            },
            close: function () {
                this.hide();
                return false;
            }
        });
    } else {
        $('#movetree').commonTree('refresh');
        selectMoveDialog.show().zindex();
    }
}