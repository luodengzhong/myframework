var treeManager, eventGridManager, refreshFlag = false, nodeKindId, eventDefineId = 0,
    lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function () {
    initializeOperateCfg();
    bindEvents();
    loadTree();
    initializeUI();
    initializeGrid();


    function initializeOperateCfg() {
        var actionPath = web_app.name + "/variableDefineAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryVariableDefine.ajax';
        operateCfg.queryAll = actionPath + "queryAllVariableDefine.ajax";
    }

    function initializeUI() {
        UICtrl.initDefaulLayout();
    }

    function bindEvents() {
        $("#btnQuery").click(function () {
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(eventGridManager, params);
        });
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();

        eventGridManager = UICtrl.grid("#maingrid", {
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
                    align: "left"
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
            selectRowButtonOnly: true
        });

        UICtrl.setSearchAreaToggle(eventGridManager);
    }
});

function getId() {
    return parseInt($("#eventDefineId").val() || 0);
}

function onDialogCloseHandler() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}

function reloadGrid() {
    reloadGrid2();
}

function reloadGrid2() {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(eventGridManager, params);
}

function loadTree() {
    PACommonTree.createTree({
        loadAction: operateCfg.queryAll,
        treeId: "#maintree",
        parentId: parentId,
        idFieldName: 'eventDefineId',
        title: '变量定义分类',
        isShowMenu: false,
        onClick: function (node) {
            if (!node || !node.data)
                return;
            parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
            eventGridManager.options.parms.fullId = node.data.fullId;

            if (node.data.nodeId == 0) {
                $('.l-layout-center .l-layout-header').html("事务定义列表");
            } else {
                $('.l-layout-center .l-layout-header')
                    .html("<font style=\"color:Tomato;font-size:13px;\">["
                        + node.data.name
                        + "]</font>事务定义列表");
            }
            reloadGrid2();
        },
        onFormInit: function () {
            $('#url').parent().parent().hide();
            $('#kindId1').parent().parent().hide();
        }
    });
}

function getSelectedData() {
    var data = eventGridManager.getSelecteds();
    if (!data || data.length == 0) {
        parent.Public.tip("请选择数据.");
        return;
    }

    return data;
}