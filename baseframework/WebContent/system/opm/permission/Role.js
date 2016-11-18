var gridManager, permissionGridManager, folderId, refreshFlag, tabHeader, roleId, operateCfg = {};

$(function () {
    tabHeader = "角色列表";
    initializeOperateCfg();
    bindEvents();
    initializeUI();
    initializeTree();
    initializeGrid();
    initializePermissionGrid();

    function bindEvents() {
        $("#btnQuery").click(function () {
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(gridManager, params);
        });
    }

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/permissionAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryRoles.ajax';
        operateCfg.showInsertAction = actionPath + 'showRoleDetail.load';
        operateCfg.showUpdateAction = actionPath + 'loadRole.load';

        operateCfg.insertAction = actionPath + 'insertRole.ajax';
        operateCfg.updateAction = actionPath + 'updateRole.ajax';
        operateCfg.deleteAction = actionPath + 'deleteRole.ajax';
        operateCfg.updateSequenceAction = actionPath
				+ "updateRoleSequence.ajax";
        operateCfg.assignFunPermissionAction = actionPath
				+ "assignFunPermission.ajax";

        operateCfg.showAssignFunctionDialogAction = actionPath
				+ "showAssignFunctionDialog.do";
        operateCfg.moveRoleAction = actionPath + "moveRole.ajax",

		operateCfg.showInsertTitle = "添加角色";
        operateCfg.showUpdateTitle = "修改角色";
    }

    function initializeUI() {
        UICtrl.autoSetWrapperDivHeight();
        UICtrl.initDefaulLayout();
        $('div.l-layout-center').css({ borderWidth: 0 });
    }

    function initializeTree() {
        $('#maintree').commonTree({
            kindId: CommonTreeKind.Role,
            onClick: onFolderTreeNodeClick,
            IsShowMenu: true
        });
    }

    function initializeGrid() {
        var toolbarparam = {
            addHandler: showInsertDialog,
            updateHandler: showUpdateDialog,
            deleteHandler: deleteRole,
            saveSortIDHandler: updateRoleSequence,
            moveHandler: moveRole
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
					{ display: "编码", name: "code", width: "80", minWidth: 60, type: "string", align: "left" },
					{ display: "名称", name: "name", width: "100", minWidth: 60, type: "string", align: "left" },
					{ display: "排序号", name: "sequence", width: "60", minWidth: 60, type: "string", align: "left",
					    render: function (item) {
					        return UICtrl.sequenceRender(item);
					    }
					},
					{ display: "类别", name: "roleKindIdTextView", width: "60", minWidth: 60, type: "string", align: "center" },
					{ display: '操作', name: "operation",width: 80, isAllowHide: false,
					    render: function (item) {
					        var roleKindId = item.roleKindId;
					        var html = ['<a href="javascript:void(null);" class="GridStyle" '];
					        html.push('roleKindId="', roleKindId, '" ');
					        html.push('roleId="', item.id, '" ');
					        html.push('roleName="', item.name, '" ');
					        html.push('>');
					        html.push(roleKindId == 'fun' ? '分配功能' : '分配提醒');
					        html.push('</a>');
					        return html.join('');
					    }
					},
					{ display: "状态", name: "status", width: "60", minWidth: 60, type: "string", align: "center",
					    render: function (item) {
					        return UICtrl.getStatusInfo(item);
					    }
					}
				],
            dataAction: "server",
            url: operateCfg.queryAction,
            parms: {
                code: "",
                name: "",
                sortname: "sequence",
                sortorder: "asc"
            },
            title: "角色列表",
            pageSize: 20,
            toolbar: toolbarOptions,
            width: '49%',
            height: "100%",
            heightDiff: -15,
            headerRowHeight: 25,
            rowHeight: 25,
            rownumbers: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowIndex, rowObj) {
                doShowUpdateDialog(data.id);
            },
            onSelectRow: function (data, rowindex, rowobj) {
                refreshPermission(data.id, data.name, data.roleKindId);
            },
            onAfterShowData: function () {
                $('#maingrid').find('a.GridStyle').each(function () {
                    var roleKindId = $(this).attr('roleKindId');
                    var roleId = $(this).attr('roleId');
                    var roleName = $(this).attr('roleName');
                    if (roleKindId == 'fun') {
                        $(this).click(function () {
                            assignFunction(roleId, roleName);
                        });
                    } else {
                        $(this).comboDialog({ title: '请选择消息提醒', type: 'sys', name: 'messageRemind',
                            checkbox: true, dataIndex: 'remindId',
                            getParam: function () { return { roleId: roleId }; },
                            onChoose: function () {
                                var rows = this.getSelectedRows();
                                if (rows.length > 0) {
                                    $('#mainRoleId').val(roleId);
                                    $('#mainrRoleKindId').val(roleKindId);
                                    var remindIds = [];
                                    $.each(rows, function (i, row) {
                                        remindIds.push(row.remindId);
                                    });
                                    Public.ajax(web_app.name + "/permissionAction!saveRoleRemind.ajax",
										{ roleId: roleId, remindIds: $.toJSON(remindIds) },
										function (data) {
										    UICtrl.gridSearch(permissionGridManager, {
										        roleId: roleId,
										        roleKindId: roleKindId,
										        param: ''
										    });
										}
									);
                                }
                                return true;
                            } 
                        });
                    }
                });
            }
        });
        UICtrl.createGridQueryBtn('#maingrid', function (param) {
            UICtrl.gridSearch(gridManager, { param: encodeURI(param) });
        });
    }

    function refreshPermission(roleId, name, roleKindId) {
        $('#permissiongrid').find(".l-panel-header-text").html("角色[<font color=Tomato>" + name + "</font>]对应功能");
        $('#mainRoleId').val(roleId);
        $('#mainrRoleKindId').val(roleKindId);
        permissionGridManager.options.parms.roleId = roleId;
        permissionGridManager.options.parms.roleKindId = roleKindId;
        permissionGridManager.loadData();
    }

    function initializePermissionGrid() {
        var toolbarOptions = UICtrl.getDefaultToolbarOptions({
            deleteHandler: function () {
                var roleKindId = $('#mainrRoleKindId').val();
                if (roleKindId == 'fun') {
                    var funcIds = DataUtil.getSelectedIds({ gridManager: permissionGridManager });
                    UICtrl.confirm('您确定删除选中数据吗?', function () {
                        Public.ajax(web_app.name + "/permissionAction!deleteRolePermission.ajax",
							{ roleId: $('#mainRoleId').val(), funcIds: $.toJSON(funcIds) },
							function (data) {
							    permissionGridManager.loadData();
							}
						);
                    });
                } else if (roleKindId == 'remind') {
                    DataUtil.del({ action: 'permissionAction!deleteRoleRemind.ajax',
                        gridManager: permissionGridManager, idFieldName: 'permissionId',
                        onSuccess: function () {
                            permissionGridManager.loadData();
                        }
                    });
                }
            }
        });
        permissionGridManager = UICtrl.grid("#permissiongrid", {
            columns: [
						{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },
						{ display: '图标', name: 'icon', width: 60, minWidth: 60, type: "string", align: "center", isAutoWidth: 0,
						    render: function (item) {
						        return DataUtil.getFunctionIcon(item.icon);
						    }
						},
 					    { display: "路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left",
 					        render: function (item) {
 					            if (item.type == 'field') {//字段权限显示连接
 					                var html = ['<a href="javascript:void(null);" class="GridStyle" '];
 					                html.push('funId="', item.id, '" ');
 					                html.push('funName="', item.name, '" ');
 					                html.push('onclick="showPermissionField(this)" ');
 					                html.push('>');
 					                html.push(item.fullName);
 					                html.push('</a>');
 					                return html.join('');
 					            }
 					            return item.fullName;
 					        }
 					    },
 					   { display: "创建人", name: "creatorName", width: 60, minWidth: 60, type: "string", align: "left" },
 					   { display: "创建日期", name: "createDate", width: 80, minWidth: 80, type: "date", align: "left" }
						],
            dataAction: "server",
            url: web_app.name + "/permissionAction!queryPermissionsByRoleId.ajax",
            pageSize: 20,
            title: "功能列表",
            width: '49%',
            height: "100%",
            heightDiff: -15,
            headerRowHeight: 25,
            rowHeight: 25,
            toolbar: toolbarOptions,
            checkbox: true,
            sortName: 'sequence',
            sortOrder: 'asc',
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onLoadData: function () {
                return !($('#mainRoleId').val() == '');
            }
        });
    }
    UICtrl.createGridQueryBtn('#permissiongrid', function (param) {
        UICtrl.gridSearch(permissionGridManager, { param: encodeURI(param) });
    });
});

function getId() {
    return parseInt($("#id").val() || 0);
}

function showInsertDialog() {
    if (!folderId || folderId == 0) {
        Public.tip("请选择父节点!");
        return;
    }
    UICtrl.showAjaxDialog({
        url: operateCfg.showInsertAction,
        title: operateCfg.showInsertTitle,
        param: {
            folderId: folderId
        },
        width: 450,
        ok: doSaveRole,
        close: onDialogCloseHandler
    });
}

function doShowUpdateDialog(id) {
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        title: operateCfg.showUpdateTitle,
        param: {
            id: id
        },
        width: 450,
        ok: doSaveRole,
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

function doSaveRole() {
    var _self = this;
    var id = getId();
    if (!id) {
        $("#folderId").val(folderId);
        //$("#roleKindId").val(roleKindId);
    }
    $('#submitForm').ajaxSubmit({
        url: (id ? operateCfg.updateAction : operateCfg.insertAction),
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

function deleteRole() {
    DataUtil.del({
        action: operateCfg.deleteAction,
        gridManager: gridManager,
        onSuccess: reloadGrid
    });
}

function updateRoleSequence() {
    DataUtil.updateSequence({
        action: operateCfg.updateSequenceAction,
        gridManager: gridManager,
        onSuccess: reloadGrid
    });
}

function assignFunction(id, name) {
    roleId = id;
    /*UICtrl.showFrameDialog({
    url : operateCfg.showAssignFunctionDialogAction,
    param : {
    roleId : roleId
    },
    title : "角色[" + name + "]分配功能",
    width : 650,
    height : 400,
    ok : doAssignFunction,
    close : onDialogCloseHandler
    });*/
    parent.addTabItem({ tabid: 'assignFunction' + id, text: "角色[" + name + "]分配功能", url: operateCfg.showAssignFunctionDialogAction + '?roleId=' + roleId });
}

function onDialogCloseHandler() {

}
//保存授权该方法已停用
function doAssignFunction() {
    var data = this.iframe.contentWindow.selectedData;
    if (!data)
        return;
    var _self = this;
    var functionIds = new Array();
    for (var i = 0; i < data.length; i++) {
        if (data[i].id)
            functionIds[functionIds.length] = data[i].id;
    }

    var params = {};
    params.roleId = roleId;
    params.functionIds = $.toJSON(functionIds);
    Public.ajax(operateCfg.assignFunPermissionAction, params, function () {
        _self.close();
    });
}

function onFolderTreeNodeClick(data) {
    if (folderId != data.id) {
        if (!data.parentId) {
            $('#maingrid').find(".l-panel-header-text").html(tabHeader);
            folderId = 0;
        } else {
            $('#maingrid').find(".l-panel-header-text").html(
					"<font style=\"color:Tomato;font-size:13px;\">["
							+ data.name + "]</font>" + tabHeader);
            folderId = data.id;
        }
        if (gridManager) {
            UICtrl.gridSearch(gridManager, {
                folderId: folderId
            });
        }
    }
}

function refreshFolderTree() {
    loadFolderTree({
        kindId: CommTreeKind.Role,
        onClick: onFolderTreeNodeClick
    });
}

function reloadGrid() {
    UICtrl.gridSearch(gridManager, {
        folderId: folderId
    });
}

function moveRole() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择要移动的数据!');
        return;
    }

    UICtrl.showFrameDialog({
        url: web_app.name + '/configurationAction!showCommonTreeDialog.do',
        param: {
            kindId: CommonTreeKind.Role
        },
        width: 350,
        height: 400,
        ok: doMoveRole,
        close: onDialogCloseHandler
    });

}

function doMoveRole() {
    var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
    var data = fn();
    if (!data.parentId) {
        Public.tip("不能移动到根节点！");
        return;
    }
    if (folderId == data.id) {
        Public.tip("移动的源节点和目标节点相同！");
        return;
    }
    var ids = DataUtil.getSelectedIds({
        gridManager: gridManager
    });
    if (!ids)
        return;

    var _self = this;
    var params = {};
    params.folderId = data.id;
    params.ids = $.toJSON(ids);
    Public.ajax(operateCfg.moveRoleAction, params, function () {
        refreshFlag = true;
        _self.close();
    });
}

function onDialogCloseHandler() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}

function showPermissionField(obj) {
    var id, name;
    id = $(obj).attr('funId');
    name = $(obj).attr('funName');
    UICtrl.showFrameDialog({
        url: web_app.name + "/system/opm/permissionField/showPermissionField.jsp",
        param: { functionFieldGroupId: id },
        title: name,
        width: 650,
        height: 400,
        cancelVal: '关闭',
        ok: false,
        cancel: true
    });
}