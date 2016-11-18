var gridManager, refreshFlag = false, nodeKindId, documentClassificationId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function () {
    initializeOperateCfg();
    bindEvents();
    loadTree();
    initializeUI();
    initializeGrid();

    function initializeOperateCfg() {
        var actionPath = web_app.name
            + "/documentClassificationAction!";
        operateCfg.queryAction = actionPath
            + 'slicedQueryDocumentClassification.ajax';
        operateCfg.queryAll = actionPath
            + "queryAllDocumentClassification.ajax";
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
                    width: 150,
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
                    align: "right"
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                parentId: -1,
                nodeKindId: ENodeKind.Data
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
    return parseInt($("#documentClassificationId").val() || 0);
}

function reloadGrid() {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}

function loadTree() {
    PACommonTree.createTree({
        loadAction: operateCfg.queryAll,
        isShowMenu: false,
        treeId: "#maintree",
        parentId: parentId,
        onClick: function (node) {
            if (!node || !node.data)
                return;
            parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
            ;
            gridManager.options.parms.fullId = node.data.fullId;
            if (node.data.nodeId == 0) {
                $('.l-layout-center .l-layout-header').html("文档类别列表");
            } else {
                $('.l-layout-center .l-layout-header')
                    .html("<font style=\"color:Tomato;font-size:13px;\">["
                        + node.data.name + "]</font>文档类别列表");
            }
            reloadGrid();
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