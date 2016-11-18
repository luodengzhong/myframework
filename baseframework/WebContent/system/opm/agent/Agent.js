var gridManager, refreshFlag, operateCfg = {}, detailGridManager;

$(function () {
    initializeUI();
    bindEvents();
    initializeOperateCfg();
    initializeGrid();

    function initializeOperateCfg() {
        var path = web_app.name + '/agentAction!';
        operateCfg.queryAction = path + 'slicedQueryAgents.ajax';
        operateCfg.showInsertAction = path + 'showInsertAgent.load';
        operateCfg.showUpdateAction = path + 'showUpdateAgent.load';
        operateCfg.insertAction = path + 'insertAgent.ajax';
        operateCfg.updateAction = path + 'updateAgent.ajax';
        operateCfg.deleteAction = path + 'deleteAgent.ajax';
        
        operateCfg.queryAgentProcsAction = path + 'slicedQueryAgentProcs.ajax';
        operateCfg.deleteAgentProcAction = 'agentAction!deleteAgentProc.ajax';

        operateCfg.insertTitle = "添加代理";
        operateCfg.updateTitle = "修改代理";
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
        var toolbarparam = { addHandler: showInsertDialog, updateHandler: showUpdateDialog, deleteHandler: deleteAgent };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
					{ display: "创建人", name: "creatorName", width: 80, minWidth: 60, type: "string", align: "left" },
					{ display: "创建时间", name: "createDate", width: 150, minWidth: 60, type: "datetime", align: "left" },
					{ display: "委托人", name: "orgName", width: 80, minWidth: 60, type: "string", align: "left" },
					{ display: "代理人", name: "agentName", width: 80, minWidth: 60, type: "string", align: "left" },
					{ display: "开始时间", name: "startDate", width: 150, minWidth: 60, type: "datetime", align: "left" },
					{ display: "结束时间", name: "finishDate", width: 150, minWidth: 60, type: "datetime", align: "left" },
					{ display: "代理方式", name: "procAgentKindName", width: 60, minWidth: 60, type: "string", align: "center",
					render : function(item) {
						if (item.procAgentKindId == 1){
							return "全部";
						}else{
							return "自定义流程";
						}
					}
					},
					{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "center",
					render : function(item) {
							return "<div class='" + (item.status ? "Yes" : "No" ) + "'/>";							
						}}
					],
            dataAction: "server",
            url: operateCfg.queryAction,
            pageSize: 20,
            toolbar: toolbarOptions,
            sortName: "startDate",
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
                doShowUpdateDialog(data);
            }
        });
        UICtrl.setSearchAreaToggle(gridManager);
    }

    function initializeUI() {
        UICtrl.autoSetWrapperDivHeight();
    }
});

function initSelectOrgTree($el, backOption) {
    $el.orgTree({ filter: 'psm', back: backOption, onChange: function (values, data) {
        $('#orgFullId').val(data.fullId);
        $('#orgFullName').val(data.fullName);
    }
    });
}

function initDetailDialog() {
    $OrgName = $("#orgName");
    $OrgName.orgTree({ filter: 'psm', back: { text: $OrgName, value: '#orgId' }, onChange: function (values, data) {
        $('#orgFullId').val(data.fullId);
        $('#orgFullName').val(data.fullName);
    }
    });

    $AgentName = $("#agentName");
    $AgentName.orgTree({ filter: 'psm', back: { text: $AgentName, value: '#agentId'} });

    var toolbarOptions = UICtrl.getDefaultToolbarOptions(
	        { addHandler: function () {
	            UICtrl.showFrameDialog({
	                url: web_app.name + '/processManageAction!showSelectProcDialog.do',
	                param: { flag:1, includeProcUnit: 0 },
	                title: "选择流程",
	                width: 500,
	                height: 400,
	                ok: doSelectedProc,
	                cancelVal: '关闭',
	                cancel: true
	            });
	        },
	            deleteHandler: function () {
	                DataUtil.delSelectedRows({ action: operateCfg.deleteAgentProcAction,
	                    idFieldName: "id",
	                    gridManager: detailGridManager,
	                    onSuccess: function () {
	                        detailGridManager.loadData();
	                    }
	                });
	            }
	        });

    detailGridManager = $("#detailGrid").ligerGrid({
        columns: [
	            { display: "流程ID", name: "procId", width: 150, minWidth: 60, type: "string", align: "left", hide: true },
	            { display: "流程名称", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left" }
	             ],
        dataAction: "server",
        url: operateCfg.queryAgentProcsAction,
        parms: { agentId: getId() },
        toolbar: toolbarOptions,
        width: "100%",
        height: 250,
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
        //pageSize: 20,
        //usePager: true,
        onLoadData: function () {
            return !($('#id').val() == '');
        }
    });
}

function doSelectedProc() {
    var fn = this.iframe.contentWindow.getSelectedObj;
    var rows = fn();
    if (!rows) {
        return;
    }

    var _self = this;
   
    $.each(rows, function (i, o) {
        detailGridManager.addRow({ procId: o.reProcdefTreeId, fullName: o.fullName });
    });

    _self.close();
}

function getId() {
    return parseInt($("#id").val() || 0);
}

function showInsertDialog() {
    UICtrl.showAjaxDialog({
        title: operateCfg.insertTitle,
        width: 600,
        init: initDetailDialog,
        url: operateCfg.showInsertAction,
        ok: doSaveAgent,
        close: onDialogCloseHandler
    });
}

function doShowUpdateDialog(row) {
	var operator = ContextUtil.getOperator();
    var personId = operator["id"];    
    var isOtherCreate = row.orgId.indexOf(personId + "@") == -1;
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            id: row.id
        },
        title: operateCfg.updateTitle,
        width: 600,
        init: initDetailDialog,
        ok: isOtherCreate ? false : doSaveAgent,
        close: onDialogCloseHandler
    });
}

function showUpdateDialog() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip("请选择数据！");
        return;
    }
    doShowUpdateDialog(row);
}

function doSaveAgent() {
    var _self = this;
    var id = getId();
    var params = {};

    var detailData = detailGridManager.getData();// ;DataUtil.getGridData({ gridManager: detailGridManager });
    params.detailData = $.toJSON(detailData);
    $('#submitForm').ajaxSubmit({ url: web_app.name + (id ? operateCfg.updateAction : operateCfg.insertAction),
        param: params,
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

/**
 *  验证创建人
 */
function checkCreator(rows, operateKind){
	var operator = ContextUtil.getOperator();
    var personId = operator["id"];
    
    var row;
    for (var i = 0, len = rows.length; i < len;  i++){
    	row = rows[i];
    	if (!row.orgId.contains(personId)){
    		Public.errorTip("您不能" + operateKind + "“" +  row.orgName  + "”" + "创建的代理。" );
    		return false;
    	}
    }    
    return true;
}

function deleteAgent() {
	if (!checkCreator(gridManager.getSelectedRows(), "删除")){
		return;
	};
    DataUtil.del({ action: operateCfg.deleteAction, idFieldName: "id", gridManager: gridManager, onSuccess: reloadGrid });
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