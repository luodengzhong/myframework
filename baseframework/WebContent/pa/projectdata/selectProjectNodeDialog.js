var gridManager, refreshFlag = false, nodeKindId, projectNodeId = 0, bizKindId = 0, bizId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function () {
    getQueryParameters();
    initializeOperateCfg();
    bindEvents();
    loadTree();
    initializeUI();
    initializeGrid();

    function getQueryParameters() {
        bizKindId = $('#bizKindId').val();
        bizId = $('#bizId').val();
        parentId = bizId;
    }

    /**
     * 初始化参数配置
     */
    function initializeOperateCfg() {
        var actionPath = web_app.name + "/projectNodeAction!";
        operateCfg.queryAction = actionPath
            + 'slicedQueryProjectNode.ajax';
        operateCfg.queryAll = actionPath + "queryAllProjectNode.ajax";
    }

    function initializeUI() {
        UICtrl.initDefaulLayout();
    }

    function bindEvents() {
        $("#btnQuery").click(function () {
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(gridManager, params);
        });
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                {
                    display: '编码',
                    name: 'code',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '名称',
                    name: 'name',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '简称',
                    name: 'shortName',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '图标',
                    name: 'iconUrl',
                    width: 60,
                    minWidth: 60,
                    type: "string",
                    align: "center",
                    isAutoWidth: 0,
                    render: function (item) {
                        if (item.iconUrl)
                            return DataUtil
                                .getFunctionIcon(item.iconUrl);
                        else
                            return "";
                    }
                },
                {
                    display: '启动方式',
                    name: 'startModeName',
                    sortName:"startMode",
                    width: 70,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '执行次数',
                    name: 'executionNum',
                    width: 80,
                    minWidth: 60,
                    type: "string",
                    align: "right"
                },
                {
                    display: '时限(天)',
                    name: 'timeLimit',
                    width: 80,
                    minWidth: 60,
                    type: "string",
                    align: "right"
                },
                {
                    display: '描述',
                    name: 'description',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: "排序号",
                    name: "sequence",
                    width: 60,
                    minWidth: 60,
                    type: "int",
                    align: "left"

                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                parentId: -1,
                nodeKindId: ENodeKind.Data,
                bizKindId: bizKindId,
                bizId: bizId
            },
            rownumbers: true,
            usePager: true,
            sortName: "sequence",
            SortOrder: "asc",
            width: '100%',
            height: '100%',
            heightDiff: -7,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowindex, rowobj) {

            }
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }
});

function getId() {
    return parseInt($("#projectNodeId").val() || 0);
}

function reloadGrid() {
    reloadGrid2();
}

function reloadGrid2() {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}

function loadTree() {
    PACommonTree.createTree({
        loadAction: operateCfg.queryAll,
        treeId: "#maintree",
        parentId: parentId,
        idFieldName: 'projectNodeId',
        bizKindId: bizKindId,
        bizId: bizId,
        title: '项目节点分类',
        isShowMenu: false,
        onClick: function (node) {
            if (!node || !node.data)
                return;
            parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
            gridManager.options.parms.fullId = node.data.fullId;

            if (node.data.nodeId == bizId) {
                $('.l-layout-center .l-layout-header').html("项目节点列表");
            } else {
                $('.l-layout-center .l-layout-header')
                    .html("<font style=\"color:Tomato;font-size:13px;\">["
                        + node.data.name + "]</font>项目节点列表");
            }
            reloadGrid2();
        }
    });
}

function getSelectedData() {
    var data = gridManager.getSelecteds();
    if (!data || data.length == 0) {
        parent.Public.tip("请选择数据.");
        return;
    }

    return data;
}