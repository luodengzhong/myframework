var treeManager, gridManager, baseSegmentationTypeGridManager,
 operateCfg = {}, baseSegmentationTypeId = 0, orgId = "";

$(function () {
    initializeOperateCfg();
    initializateUI();

    loadOrgTreeView();
    loadBaseSegmentationType();
    loadBizSegmentationAuthorize();

    function initializeOperateCfg() {
        var path = web_app.name + '/segmentationAction!';
        operateCfg.queryOrgAction = web_app.name + '/orgAction!queryOrgs.ajax';

        operateCfg.queryBaseSegmentationTypeAction = path + 'slicedQueryBaseSegmentationTypes.ajax';

        operateCfg.queryBizSegmentationAuthorizeAction = path + 'queryBizSegmentationAuthorize.ajax';
        operateCfg.saveBizSegmentationAuthorizeAction = path + 'saveBizSegmentationAuthorize.ajax';
        operateCfg.deleteBizSegmentationAuthorizeAction = 'segmentationAction!deleteBizSegmentationAuthorize.ajax';
    }

    /**
    * 加载基础段类别
    */
    function loadBaseSegmentationType() {
        baseSegmentationTypeGridManager = UICtrl.grid("#baseSegmentationType", {
            columns: [
					{ display: "编码", name: "code", width: "120", minWidth: 60, type: "string", align: "left" },
					{ display: "名称", name: "name", width: "160", minWidth: 60, type: "string", align: "left" }
					],
            dataAction: "server",
            url: operateCfg.queryBaseSegmentationTypeAction,
            title: '输入编码或名称快速查询',
            width: '100%',
            height: '100%',
            sortName: 'code',
            sortOrder: 'asc',
            heightDiff: -12,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: false,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            rownumbers: true,
            usePager: true,
            pageSize: 20,
            onSelectRow: function (data, rowindex, rowobj) {
                if (baseSegmentationTypeId == data.baseSegmentationTypeId) {
                    return;
                }
                baseSegmentationTypeId = data.baseSegmentationTypeId;
                searchBizSegmentationAuthorize();
            }
        });
        UICtrl.createGridQueryBtn('#baseSegmentationType', function (param) {
            UICtrl.gridSearch(baseSegmentationTypeGridManager, { param: encodeURI(param) });
        });
    }

    function loadBizSegmentationAuthorize() {
        toolbarOptions = UICtrl.getDefaultToolbarOptions(
        { addHandler: function () {
            if (!beforeAddcheck()) {
                return;
            }
            var defaultValue = { orgId: orgId, baseSegmentationTypeId: baseSegmentationTypeId, dataSourceConfig: "", sequence: gridManager.getData().length + 1 };
            UICtrl.addGridRow(gridManager, defaultValue);
        },
            saveHandler: saveBizSegmentationAuthorize,
            deleteHandler: function () {
                DataUtil.delSelectedRows({ action: operateCfg.deleteBizSegmentationAuthorizeAction,
                    idFieldName: "bizSegmentationAuthorizeId",
                    gridManager: gridManager,
                    onSuccess: function () {
                        gridManager.loadData();
                    }
                });
            }
        });

        gridManager = $("#maingrid").ligerGrid({
            columns: [
            { display: "业务段", name: "bizSegmentationName", width: 200, minWidth: 60, type: "string", align: "left",
                editor: { type: 'select', required: false, data: { type: "bpm", name: "bizSegmentation",
                    getParam: function (e) {
                        return { orgId: orgId, searchQueryCondition: "kind_id in (1,2,3) " };
                    },
                    back: { bizSegmentationId: "bizSegmentationId", name: "bizSegmentationName" }
                }
                }
            },
            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'spinner', required: true }
            }
        ],
            dataAction: "server",
            url: operateCfg.queryBizSegmentationAuthorizeAction,
            toolbar: toolbarOptions,
            width: "100%",
            height: "100%",
            sortName: 'sequence',
            sortOrder: 'asc',
            heightDiff: -12,
            headerRowHeight: 25,
            rowHeight: 25,
            enabledEdit: true,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            rownumbers: true,
            usePager: false,
            delayLoad: true
        });
    }

    function beforeAddcheck() {
        if (!orgId) {
            Public.errorTip("请选择组织节点。");
            return false;
        }
        if (!baseSegmentationTypeId) {
            Public.errorTip("请选择基础段类别。");
            return false;
        }
        return true;
    }

    function initializateUI() {
        UICtrl.autoSetWrapperDivHeight();
        UICtrl.layout("#layout", { leftWidth: 250, heightDiff: -5 });
        $("#layout2").ligerLayout({
            leftWidth: 2 * ($(window).width() - 200) / 5,
            heightDiff: -5
        });
    }
});

function saveBizSegmentationAuthorize() {		
    var authorizeData = DataUtil.getGridData({ gridManager: gridManager });
    if (!authorizeData) {
        return false;
    }
    
    //验证重复填写业务段
    var data = gridManager.getData();
    var list = [];
    var obj;
    for (var i = 0; i < data.length; i++) {
    	obj = data[i];
        for (var j = 0; j < list.length; j++) {
            if (obj.bizSegmentationId == list[j].bizSegmentationId) {
            	Public.errorTip("业务段“" + obj.bizSegmentationName + "”重复，不能保存。");
            	return false;
            }
        }
        var item = {};
        item.bizSegmentationId = obj.bizSegmentationId;
        list.push(item);
    }

    Public.ajax(operateCfg.saveBizSegmentationAuthorizeAction,
        { data: encodeURI($.toJSON(authorizeData)) }, function () {
            gridManager.loadData();
        }
    );
}

function searchBizSegmentationAuthorize() {
    if (!orgId || !baseSegmentationTypeId) {
        return;
    }

    gridManager.options.parms.orgId = orgId;
    gridManager.options.parms.baseSegmentationTypeId = baseSegmentationTypeId;
    gridManager.loadData();
}


function loadOrgTreeView() {
    $('#orgTree').commonTree({
        loadTreesAction: operateCfg.queryOrgAction,
        parentId: 'orgRoot',
        isLeaf: function (data) {
        	data.children = [];
            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status, false);
            return parseInt(data.hasChildren) == 0;
        },
        onClick: function (data) {
            if (data && orgId != data.id) {
                $('#layout > div.l-layout-center > div.l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + data.name + "]</font>业务段授权");
                orgId = data.id;
                searchBizSegmentationAuthorize();
            }
        },
        IsShowMenu: false
    });
}