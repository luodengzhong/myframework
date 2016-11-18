var gridManager, parentId;

$(function () {
    loadOrgTreeView();
    initializeGrid();
    initializateUI();
    bindEvents();

    function initializateUI() {
        UICtrl.layout("#layout", { leftWidth: 250, heightDiff: -5 });
        UICtrl.autoSetWrapperDivHeight();
    }

    function bindEvents() {
        $("#btnQuery").click(function () {
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(gridManager, params);
        });

        $("#btnReset").click(function () {
            $(this.form).formClean();
        });

        $('#toolbar_addOrgRoleKindAuthorization').comboDialog({ type: 'sys', name: 'roleKind', width: 500,
            dataIndex: 'id',
            checkbox: true,
            title: "选择角色类别",
            //打开对话框前 //onBeforeShow
            onShow: function () {
                if (!parentId) {
                    Public.errorTip("请选择组织节点。");
                    return false;
                }
                return true;
            },
            onChoose: function () {
                var rows = this.getSelectedRows();

                var roleKindIds = [];
                $.each(rows, function (i, o) {
                    roleKindIds.push(o.id);
                });

                var params = {};
                params.orgId = parentId;
                params.roleKindIds = $.toJSON(roleKindIds);

                Public.ajax(web_app.name + "/authorizationAction!insertOrgRoleKindAuthorize.ajax",
				params, function () {
				    reloadGrid();
				});
                return true;
            }
        });
    }

    function initializeGrid() {
        var imageFilePath = web_app.name + '/themes/default/images/icons/';
        var toolbarOptions = {
            items: [{ id: "addOrgRoleKindAuthorization", text: "分配", img: imageFilePath + "page_new.gif" },
			          { line: true },
			          { id: "deleteOrgRoleKindAuthorization", text: "删除", click: deleteOrgRoleKindAuthorize, img: imageFilePath + "page_delete.gif" },
			          { line: true }
			]
        };

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
			        { display: "编码", name: "roleCode", width: 140, minWidth: 60, type: "string", align: "left" },
			        { display: "角色", name: "roleName", width: 120, minWidth: 60, type: "string", align: "left" }
			        ],
            dataAction: "server",
            url: web_app.name + "/authorizationAction!loadOrgRoleKindAuthorizes.ajax",
            usePager: false,
            toolbar: toolbarOptions,
            width: "99%",
            height: "100%",
            heightDiff: -14,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onLoadData: function () {
                return !(Public.isBlank(parentId));
            }
        });
        UICtrl.setSearchAreaToggle(gridManager, false);
    }

    function deleteOrgRoleKindAuthorize() {
        var action = "authorizationAction!deleteOrgRoleKindAuthorize.ajax";
        DataUtil.del({ action: action, gridManager: gridManager, onSuccess: reloadGrid });
    }
});

function loadOrgTreeView() {
    var url = web_app.name + "/orgAction!queryOrgs.ajax";
    $('#maintree').commonTree({
        loadTreesAction: url,
        parentId: 'orgRoot',
        getParam: function (e) {
            if (e) {
                return { showDisabledOrg: 0, displayableOrgKinds: "ogn,dpt,pos,fld,prj,grp,psm" };
            }
            return { showDisabledOrg: 0 };
        },
        isLeaf: function (data) {
            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status, false);
            return data.hasChildren == 0;
        },
        onClick: treeNodeOnclick,
        IsShowMenu: false
    });
}

function treeNodeOnclick(data) {
    if (!data) {
        return;
    }
    if (data.id == 'orgRoot') {
        parentId = null;
        return;
    }

    if (parentId != data.id) {
        parentId = data.id;

        if (Public.isBlank(parentId)) {
            $('.l-layout-center .l-layout-header').html("角色授权列表");
        } else {
            $('.l-layout-center .l-layout-header').html(
					"<font style=\"color:Tomato;font-size:13px;\">["
							+ data.name + "]</font>角色授权列表");
        }

        gridManager.options.parms.orgId = parentId;
        reloadGrid();
    }
}

function reloadGrid() {
    gridManager.loadData();
}
