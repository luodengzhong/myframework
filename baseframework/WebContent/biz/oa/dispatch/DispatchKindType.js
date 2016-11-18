var gridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.dispatchKindType,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.dispatchKindType){
		parentId="";
		html.push('发文分类');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>发文分类');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#dispatchKindTypeId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{dispatchKindTypeId:parentId});
	}
}

function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveSortIDHandler: saveSortIDHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "编码", name: "code", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "类别", name: "dispatchKindTypeName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "管理组织", name: "orgUnitName", width: 120, minWidth: 60, type: "string", align: "left" },	
			{ display: "内容", name: "ruleContent", width: 200, minWidth: 60, type: "string", align: "left" },	
			{ display: "循环规则", name: "loopRuleTextView", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "最后修改时间", name: "lastUpdateDate", width: 100, minWidth: 60, type: "date", align: "left" },
			{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
				}
			},
			{ display: "当前值", name: "value", width: 60, minWidth: 60, type: "date", align: "left" },
			{ display: "选择作废数据", name: "letsChooseCancel", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return item.letsChooseCancel==1?'是':'否';
				}
			},
			{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.sequenceRender(item,'dispatchKindId');
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/dispatchManagerAction!slicedQueryDispatchKind.ajax',
		manageType:'hrDispatchManagerManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "dispatchManagerAction!updateDispatchKindSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName: "dispatchKindId", onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动类别',kindId:CommonTreeKind.dispatchKindType,
		save:function(parentId){
			DataUtil.updateById({action:'dispatchManagerAction!updateDispatchKindType.ajax',
				gridManager:gridManager,idFieldName:'dispatchKindId',param:{dispatchKindTypeId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}
