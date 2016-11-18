var gridManager, refreshFlag = false, projectId = 0, operateCfg = {}, heightDiff = 0, viewSource = '';

$(function () {
    getQueryParameters();
    initializeOperateCfg();
    bindEvents();
    initializeUI();
    initializeGrid();

    function getQueryParameters() {
        projectId = Public.getQueryStringByName("projectId") || 0;
        viewSource = Public.getQueryStringByName("viewSource")
            || 'execute';

        if (viewSource == 'execute')
            heightDiff = -8;
        else
            heightDiff = -7;
    }

    /**
     * 初始化参数配置
     */
    function initializeOperateCfg() {
        var actionPath = web_app.name + "/projectMainAction!";
        operateCfg.queryAction = actionPath
            + 'slicedQueryProjectImplementation.ajax';

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
                    display: '姓名',
                    name: 'operName',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '操作时间',
                    name: 'operTime',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '项目名称',
                    name: 'projectName',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '内容',
                    name: 'content',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '描述',
                    name: 'description',
                    width: 200,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                projectId: projectId
            },
            title: '项目执行进展情况',
            rownumbers: true,
            usePager: true,
            sortName: "operTime",
            SortOrder: "desc",
            width: '100%',
            height: '100%',
            heightDiff: heightDiff,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: false,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowindex, rowobj) {

            }
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }
});

function reloadGrid() {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}