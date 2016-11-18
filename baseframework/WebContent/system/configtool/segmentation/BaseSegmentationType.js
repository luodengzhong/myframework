var gridManager, refreshFlag, operateCfg = {}, detailGridManager;

$(function () {
    bindEvents();
    initializeOperateCfg();
    initializeGrid();
    initializeUI();

    function initializeOperateCfg() {
        var path = web_app.name + '/segmentationAction!';
        operateCfg.queryAction = path + 'slicedQueryBaseSegmentationTypes.ajax';
        operateCfg.showInsertAction = path + 'showInsertBaseSegmentationType.load';
        operateCfg.showUpdateAction = path + 'showUpdateBaseSegmentationType.load';
        operateCfg.insertAction = path + 'insertBaseSegmentationType.ajax';
        operateCfg.updateAction = path + 'updateBaseSegmentationType.ajax';
        operateCfg.deleteAction = path + 'deleteBaseSegmentationType.ajax';
        operateCfg.updateSequenceAction = path + 'updateBaseSegmentationTypeSequence.ajax';
        operateCfg.moveAction = path + 'updateBaseSegmentationTypeFolderId.ajax';

        operateCfg.querySegmentationHandlerAction = path + 'querySegmentationHandler.ajax';
        operateCfg.deleteSegmentationHandlerAction = 'segmentationAction!deleteSegmentationHandler.ajax';

        operateCfg.insertTitle = "添加基础段类别";
        operateCfg.updateTitle = "修改基础段类别";
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
        var toolbarparam = { addHandler: showInsertDialog, updateHandler: showUpdateDialog, deleteHandler: deleteBaseSegmentationType, saveSortIDHandler: updateBaseSegmentationTypeSequence, moveHandler: moveHandler };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
					{ display: "编码", name: "code", width: 200, minWidth: 60, type: "string", align: "left" },
					{ display: "名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },
					{ display: "排序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
					    render: function (item) {
					        return "<input type='text' id='txtSequence_"
									+ item.baseSegmentationTypeId + "' class='textbox' value='"
									+ item.sequence + "' />";
					    }
					}
					],
            dataAction: "server",
            url: operateCfg.queryAction,
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
                doShowUpdateDialog(data[getIdFieldName()]);
            }
        });
        UICtrl.setSearchAreaToggle(gridManager);
    }

    function initializeUI() {
        UICtrl.layout("#layout", { leftWidth: 200, heightDiff: -5 });
        
        $('#maintree').commonTree({
            kindId: CommonTreeKind.BaseSegmentationType,
            onClick: onFolderTreeNodeClick
        });
    }
});

function initDetailDialog() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions(
	        { addHandler: function () {
	            UICtrl.addGridRow(detailGridManager,
	                { dataSourceConfig: "", sequence: detailGridManager.getData().length + 1 });
	        },
	            deleteHandler: function () {
	                DataUtil.delSelectedRows({ action: operateCfg.deleteSegmentationHandlerAction,
	                    idFieldName: "segmentationHandlerId",
	                    gridManager: detailGridManager,
	                    onSuccess: function () {
	                        detailGridManager.loadData();
	                    }
	                });
	            }
	        });

    detailGridManager = $("#detailGrid").ligerGrid({
        columns: [
	            { display: "描述", name: "description", width: 150, minWidth: 60, type: "string", align: "left", frozen: true,
	                editor: { type: 'text', required: true }
	            },
	            { display: "审批人类别", name: "handlerKindName", width: 100, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'select', data: { type: "bpm", name: "approvalHandlerKind", back: { code: "handlerKindCode", name: "handlerKindName", dataSourceConfig: "dataSourceConfig"} }, required: true }
	            },
	            { display: "审批人ID", name: "handlerId", width: 100, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'text', required: true }
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
	                editor: { type: 'spinner', required: true }
	            },
	            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'spinner', required: true }
	            }
	             ],
        dataAction: "server",
        url: operateCfg.querySegmentationHandlerAction,
        parms:{ segmentationId:  $('#baseSegmentationTypeId').val()  },
        toolbar: toolbarOptions,
        width: "100%",
        height: "300",
        sortName: 'sequence',
        heightDiff: -12,
        headerRowHeight: 25,
        rowHeight: 25,
        enabledEdit: true,
        checkbox: true,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        rownumbers: true,
        usePager: false,
        onLoadData: function () {
            return !($('#baseSegmentationTypeId').val() == '');
        }
    });
}

function onFolderTreeNodeClick(data, folderId) {
    var html = [];
    if (folderId == CommonTreeKind.BaseSegmentationType) {
        folderId = "";
        html.push('基础段类别列表');
    } else {
        html.push('<font style="color:Tomato;font-size:13px;">[', data.name, ']</font>基础段类别列表');
    }
    $('.l-layout-center .l-layout-header').html(html.join(''));
    $('#treeFolderId').val(folderId);
    if (gridManager) {
        UICtrl.gridSearch(gridManager, { folderId: folderId });
    }
}

function getId() {
    return parseInt($("#baseSegmentationTypeId").val() || 0);
}

function showInsertDialog() {
    var folderId = $('#treeFolderId').val();
    if (!folderId || folderId == CommonTreeKind.BaseSegmentationType) {
        Public.tip('请选择类别树！');
        return;
    }

    UICtrl.showAjaxDialog({
        title: operateCfg.insertTitle,
        param: {
            folderId: folderId
        },
        width: 600,
        init: initDetailDialog,
        url: operateCfg.showInsertAction,
        ok: doSaveBaseSegmentationType,
        close: onDialogCloseHandler
    });
}

function doShowUpdateDialog(id) {
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            baseSegmentationTypeId: id
        },
        title: operateCfg.updateTitle,
        width: 600,
        init: initDetailDialog,
        ok: doSaveBaseSegmentationType,
        close: onDialogCloseHandler
    });
}

function showUpdateDialog() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip("请选择数据！");
        return;
    }
    doShowUpdateDialog(row[getIdFieldName()]);
}

function doSaveBaseSegmentationType() {
    var _self = this;
    var id = getId();
    var params = {};
    if (!id) {//新增时加入目录ID
        params.folderId = $('#treeFolderId').val();
    }
    var detailData = DataUtil.getGridData({ gridManager: detailGridManager });
    params.detailData = $.toJSON(detailData);
    $('#submitForm').ajaxSubmit({ url: web_app.name + (id ? operateCfg.updateAction : operateCfg.insertAction),
        param: params,
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

function getIdFieldName() {
    return "baseSegmentationTypeId";
}

function deleteBaseSegmentationType() {
    DataUtil.del({ action: operateCfg.deleteAction, idFieldName: getIdFieldName(), gridManager: gridManager, onSuccess: reloadGrid });
}

function updateBaseSegmentationTypeSequence() {
    DataUtil.updateSequence({ action: operateCfg.updateSequenceAction, gridManager: gridManager, idFieldName: getIdFieldName(), onSuccess: reloadGrid });
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

//移动
function moveHandler() {
    UICtrl.showMoveTreeDialog({
        gridManager: gridManager, title: '移动基础段', kindId: CommonTreeKind.BaseSegmentationType,
        save: function (parentId) {
            DataUtil.updateById({ action: operateCfg.moveAction,
                gridManager: gridManager, param: { folderId: parentId },
                idFieldName: getIdFieldName(),
                onSuccess: function () {
                    reloadGrid();
                }
            });
        }
    });
}