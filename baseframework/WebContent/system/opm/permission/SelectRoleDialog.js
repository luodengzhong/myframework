var gridManager, folderId = 0;

$(function () {
    initializeTree();
    initializeGrid();

    initializeUI();
    bindEvents();

    function bindEvents() {
        $("#btnQuery").click(function () {
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(gridManager, params);
        });

        $("#btnReset").click(function () {
            $(this.form).formClean();
        });
    }

    function initializeUI() {
        UICtrl.autoSetWrapperDivHeight();
        UICtrl.initDefaulLayout();
    }

    function initializeTree() {
        var url = web_app.name + "/permissionAction!queryRoleKinds.ajax";
        $('#maintree').commonTree({
            loadTreesAction: url,
            parentId: 0,
            isLeaf: function (data) {
                return data.hasChildren == 0;
            },
            onClick: onFolderTreeNodeClick,
            IsShowMenu: false
        });
    }

    function initializeGrid() {
        gridManager = UICtrl.grid("#maingrid", {
            columns: [
					{ display: "编码", name: "code", width: "100", minWidth: 60, type: "string", align: "left" },
					{ display: "名称", name: "name", width: "100", minWidth: 60, type: "string", align: "left" },
					{ display: "类别", name: "roleKindIdTextView", width: "60", minWidth: 60, type: "string", align: "center" },
                    { display: "状态", name: "status", width: "60", minWidth: 60, type: "string", align: "center",
                        render: function (item) {
                            return "<div class=" + (item.status ? "Yes" : "No") + "/>";
                        }
                    }
                     ],
            dataAction: "server",
            url: web_app.name + '/permissionAction!slicedQueryRoles.ajax',
            parms: {
                code: "",
                name: ""
            },
            pageSize: 20,
            width: "100%",
            height: "100%",
            sortName: 'sequence',
            sortOrder: 'asc',
            heightDiff: -7,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            delayLoad: true
        });

        UICtrl.setSearchAreaToggle(gridManager);
    }
});

function onFolderTreeNodeClick(data) {
    if (folderId != data.id) {
        if (!data.parentId) {
            $('.l-layout-center .l-layout-header').html("角色列表");
            folderId = 0;
        } else {
            $('.l-layout-center .l-layout-header').html(
					"<font style=\"color:Tomato;font-size:13px;\">["
							+ data.name + "]</font>角色列表");
            folderId = data.id;
        }
        if (gridManager) {
            UICtrl.gridSearch(gridManager, { folderId: folderId });
        }
    }
}

function reloadGrid() {
    UICtrl.gridSearch(gridManager, { folderId: folderId });
}

function getRoleData() {
    var data = gridManager.getSelecteds();
    if (!data || data.length == 0) {
        Public.tip("请选择数据.");
        return;
    }

    return data;
}