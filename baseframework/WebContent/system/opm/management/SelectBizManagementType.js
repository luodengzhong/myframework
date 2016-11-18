var gridManager, refreshFlag, operateCfg = {};

var pageParam = { rootId: 1, rootParentId: 0, parentId: 0, multiSelect: "false" };

$(function () {
    pageParam.multiSelect = Public.getQueryStringByName("multiSelect") || "false";

    bindEvents();
    initializeOperateCfg();
    initializeUI();
    initializeGrid();
    loadBizManagementTypeTree();

    function initializeOperateCfg() {
        var path = web_app.name + '/managementAction!';
        operateCfg.queryAction = path + 'slicedQueryBizManagementTypes.ajax';
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

    function initializeUI() {
        UICtrl.layout("#layout", { leftWidth: 200, heightDiff: -5 });
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
					{ display: "编码", name: "code", width: "100", minWidth: 60, type: "string", align: "left" },
					{ display: "名称", name: "name", width: "100", minWidth: 60, type: "string", align: "left" },
					{ display: "节点类别", name: "nodeKindId", width: 100, minWidth: 60, type: "string", align: "left",
					    render: function (item) {
					        return item.nodeKindId == CommonNodeKind.Limb ? '分类' : '权限类别';
					    }
					}
					],
            dataAction: "server",
            url: operateCfg.queryAction,
            parms: {
                parentId: 0
            },
            pageSize: 20,
            sortName: 'sequence',
            sortOrder: 'asc',
            width: "99.9%",
            height: "100%",
            heightDiff: -7,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: pageParam.multiSelect == "true",
            fixedCellHeight: true,
            selectRowButtonOnly: true
        });
        UICtrl.setSearchAreaToggle(gridManager);
    }

    function loadBizManagementTypeTree() {
        $('#maintree').commonTree({
            loadTreesAction: "/managementAction!queryBizManagementTypes.ajax",
            parentId: 0,
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
        html.push('<font style="color:Tomato;font-size:13px;">[', data.name, ']</font>业务管理权限类别列');
    }
    pageParam.parentId = data.id;
    $('.l-layout-center .l-layout-header').html(html.join(''));
    if (gridManager) {
        UICtrl.gridSearch(gridManager, { parentId: pageParam.parentId });
    }
}

function getBizManagementTypeData() {
    var data;
    if (pageParam.multiSelect == "false") {
        data = gridManager.getSelected();
        if (!data) {
            Public.errorTip("请选择数据.");
            return;
        }
    } else {
        data = gridManager.getSelecteds();
        if (!data || data.length == 0) {
            Public.errorTip("请选择数据.");
            return;
        }
    }

    return data;
}