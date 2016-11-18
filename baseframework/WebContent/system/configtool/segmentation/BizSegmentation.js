var treeManager, gridManager, bizSegmentationGridManager,
 operateCfg = {}, orgId = "", bizSegmentationId = 0, segmentationKindData;

$(function () {
	
	getQueryParameters();
	
	initializeOperateCfg();
    initializateUI();
    
    loadOrgTreeView();
    loadBizSegmentation();
    loadSegmentationHandler();

    function getQueryParameters(){
    	segmentationKindData = $("#segmentationKind").combox("getFormattedData");
    }
    
    function initializeOperateCfg() {
        var path = web_app.name + '/segmentationAction!';
        operateCfg.queryOrgAction = web_app.name + '/orgAction!queryOrgs.ajax';

        operateCfg.queryBizSegmentationAction = path + 'queryBizSegmentation.ajax';
        operateCfg.saveBizSegmentationAction = path + 'saveBizSegmentation.ajax';
        operateCfg.deleteBizSegmentationAction = 'segmentationAction!deleteBizSegmentation.ajax';

        operateCfg.querySegmentationHandlerAction = path + 'querySegmentationHandler.ajax';
        operateCfg.saveSegmentationHandlerAction = path + 'saveSegmentationHandler.ajax';
        operateCfg.deleteSegmentationHandlerAction = 'segmentationAction!deleteSegmentationHandler.ajax';
    }

    /**
    * 加载业务段类别
    */
    function loadBizSegmentation() {
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(
        { addHandler: function () {
            if (!beforeAddBizSegmentationCheck()) {
                return;
            }
            UICtrl.addGridRow(bizSegmentationGridManager,
                { orgId: orgId, sequence: bizSegmentationGridManager.getData().length + 1 });
        },
            saveHandler: saveBizSegmentation,
            deleteHandler: function () {
                DataUtil.delSelectedRows({ action: operateCfg.deleteBizSegmentationAction,
                    idFieldName: "bizSegmentationId",
                    gridManager: bizSegmentationGridManager,
                    onSuccess: function () {
                        bizSegmentationGridManager.loadData();
                    }
                });
            }
        });
        bizSegmentationGridManager = UICtrl.grid("#bizSegmentationGrid", {
            columns: [
					{ display: "类别", name: "kindName", width: 200, minWidth: 60, type: "string", align: "left", 
					    editor: { type: 'combobox', data: segmentationKindData, valueField: "kindId", required: true } ,
					    render: function(item){
					    	for (var i = 0; i < segmentationKindData.length; i++){
					    	   if (segmentationKindData[i].value == item.kindId){
					    	   	return segmentationKindData[i].text;
					    	   }
					    	}
					    	return "";
					    }
					},
					{ display: "编码", name: "code", width: 200, minWidth: 60, type: "string", align: "left", editor: { type: 'text', required: true} },
					{ display: "名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left", editor: { type: 'text', required: true} },
					{ display: "排序号", name: "sequence", width: "60", minWidth: 60, type: "string", align: "left",
					    render: function (item) {
					        return "<input type='text' id='txtSequence_"
									+ item.bizSegmentationId + "' class='textbox' value='"
									+ item.sequence + "' />";
					    }
					}
					],
            dataAction: "server",
            url: operateCfg.queryBizSegmentationAction,
            toolbar: toolbarOptions,
            width: '100%',
            height: '50%',
            sortName: 'sequence',
            sortOrder: 'asc',
            heightDiff: -12,
            headerRowHeight: 25,
            rowHeight: 25,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            rownumbers: true,
            usePager: false,
            delayLoad: true,
            enabledEdit: true,
            onSelectRow: function (data, rowindex, rowobj) {
                if (bizSegmentationId == data.bizSegmentationId) {
                    return;
                }
                
                bizSegmentationId = data.bizSegmentationId;
                if (!bizSegmentationId) {
                    bizSegmentationId = 0;
                }
                
                searchSegmentationHandler();
            }
        });
    }

    function beforeAddBizSegmentationCheck() {
        if (!orgId) {
            Public.errorTip("请选择组织节点。");
            return false;
        }
        return true;
    }

    function beforeAddSegmentationHandlerCheck() {
        if (!beforeAddBizSegmentationCheck()) {
            return false;
        }
        if (!bizSegmentationId) {
            Public.errorTip("请选业务段。");
            return false;
        }
        return true;
    }

    function loadSegmentationHandler() {
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(
	        { addHandler: function () {
	            if (!beforeAddSegmentationHandlerCheck()) {
	                return;
	            }
	            UICtrl.addGridRow(gridManager,
	                { dataSourceConfig: "", segmentationId: bizSegmentationId, sequence: gridManager.getData().length + 1 });
	        },
	            saveHandler: saveSegmentationHandler,
	            deleteHandler: function () {
	                DataUtil.delSelectedRows({ action: operateCfg.deleteSegmentationHandlerAction,
	                    idFieldName: "segmentationHandlerId",
	                    gridManager: gridManager,
	                    onSuccess: function () {
	                        gridManager.loadData();
	                    }
	                });
	            }
	        });

        gridManager = $("#maingrid").ligerGrid({
            columns: [
	            { display: "描述", name: "description", width: 150, minWidth: 60, type: "string", align: "left", frozen: true,
	                editor: { type: 'text', required: true }
	            },
	            { display: "审批人类别", name: "handlerKindName", width: 100, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'select', data: { type: "bpm", name: "approvalHandlerKind", back: { code: "handlerKindCode", name: "handlerKindName", dataSourceConfig: "dataSourceConfig"} }, required: true }
	            },
	            { display: "审批人ID", name: "handlerId", width: 100, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'text', required: true }
	            },
	            { display: "审批人", name: "handlerName", width: 150, minWidth: 60, type: "string", align: "left",
	                editor: { type: "dynamic", getEditor: function (row) {
	                    var dataSourceConfig = row['dataSourceConfig'] || "";
	                    if (!dataSourceConfig) return {};
	                    return (new Function("return " + dataSourceConfig))();
	                }
	                }
	            },
	            { display: "分组号", name: "groupId", width: 100, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'spinner', required: true }
	            },
	            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'spinner', required: true }
	            }
	             ],
            dataAction: "server",
            url: operateCfg.querySegmentationHandlerAction,
            toolbar: toolbarOptions,
            width: "100%",
            height: "50%",
            sortName: 'sequence',
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

    function initializateUI() {
        UICtrl.autoSetWrapperDivHeight();
        UICtrl.layout("#layout", { leftWidth: 250,
            heightDiff: -5
        });
    }
});


function saveBizSegmentation() {
    var bizSegmentationdata = DataUtil.getGridData({ gridManager: bizSegmentationGridManager });
    if (!bizSegmentationdata) {
        return false;
    }

    Public.ajax(operateCfg.saveBizSegmentationAction,
        { data: encodeURI($.toJSON(bizSegmentationdata)) }, function () {
            bizSegmentationGridManager.loadData();
        }
    );
}

function saveSegmentationHandler() {
    var handlerData = DataUtil.getGridData({ gridManager: gridManager });
    if (!handlerData) {
        return false;
    }

    Public.ajax(operateCfg.saveSegmentationHandlerAction,
        { data: encodeURI($.toJSON(handlerData)) }, function () {
            gridManager.loadData();
        }
    );
}

function searchBizSegmentation(orgName) {
    $('#layout2').find('div.l-layout-center').find('div.l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + orgName + "]</font>业务段");
    bizSegmentationGridManager.options.parms.orgId = orgId;
    bizSegmentationGridManager.loadData();
}

function searchSegmentationHandler() {
    gridManager.options.parms.orgId = orgId;
    gridManager.options.parms.segmentationId = bizSegmentationId;
    gridManager.loadData();
}

function loadOrgTreeView() {
    $('#orgTree').commonTree({
        loadTreesAction: operateCfg.queryOrgAction,
        parentId: 'orgRoot',
        isLeaf: function (data) {
            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status, false);
            return parseInt(data.hasChildren) == 0;
        },
        onClick: function (data) {
            if (data && orgId != data.id) {
                $('#layout > div.l-layout-center > div.l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + data.name + "]</font>处理人管理");
                orgId = data.id;
                bizSegmentationId = 0;
                searchBizSegmentation();
                searchSegmentationHandler();
            }
        },
        IsShowMenu: false
    });
}
/*
function reloadGrid() {
UICtrl.gridSearch(gridManager);
}
*/