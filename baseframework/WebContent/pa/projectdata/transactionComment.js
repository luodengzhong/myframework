var gridManager, refreshFlag = false, operateCfg = {}, transactionHandleId;

$(function () {
    initializeOperateCfg();
    getQueryParameters();
    bindEvents();
    initializeGrid();

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/transactionCommentAction!";
        operateCfg.queryAction = actionPath + "slicedQueryTransactionComment.ajax";
    }

    function getQueryParameters() {
        transactionHandleId = Public.getQueryStringByName("transactionHandleId") || 0;
    }

    function bindEvents() {
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                { display: "事务名称", name: "subject", width: 180, minWidth: 60, type: "string", align: "left" },
                { display: "内容", name: "content", width: 475, minWidth: 60, type: "string", align: "left" },
                { display: "评论人", name: "creatorName", width: 80, minWidth: 60, type: "string", align: "left" },
                { display: "评论时间", name: "createTime", width: 120, minWidth: 60, type: "string", align: "left"}
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                transactionHandleId: transactionHandleId
            },
            rownumbers: true,
            usePager: true,
            sortName: "createTime",
            SortOrder: "asc",
            width: '100%',
            height: '100%',
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowindex, rowobj) {
                doShowUpdateDialog(data.transactionHandleId);
            }
        });
    }
});


function doProjectTransactionHandle() {
    var _self = this;
    $('#submitForm').ajaxSubmit({
        url: operateCfg.updateAction,
        success: function () {
            _self.close();
        }
    });
}

function reloadGrid() {
    gridManager.loadData();
}
