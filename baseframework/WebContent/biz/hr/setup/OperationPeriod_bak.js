var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('#year').spinner({countWidth:80}).mask('nnnn');
}
function onFolderTreeNodeClick(data) {
	var html=[],organId='',fullName='';
	if(!data){
		html.push('业务处理期间');
	}else{
		organId=data.id,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>业务处理期间');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainOrganId').val(organId);
	query('#queryMainForm');
	
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		saveHandler:saveHandler,
		addHandler: function(){
			if($('#mainOrganId').val()==''){
				Public.tip('请先选择单位！');
				return;
			}
			UICtrl.addGridRow(gridManager,{year:$('#year').val()});
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "年", name: "year", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true}
			},		   
			{ display: "期间名称", name: "periodName", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true}
			},		   
			{ display: "开始日期", name: "periodBeginDate", width: 120, minWidth: 60, type: "string", align: "left",
				editor: { type: 'date',required:true}
			},		   
			{ display: "结束日期", name: "periodEndDate", width: 120, minWidth: 60, type: "string", align: "left",
				editor: { type: 'date',required:true}
			},
			{ display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedOperationPeriodQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'periodBeginDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		enabledEdit: true,
		checkbox:true,
		selectRowButtonOnly : true,
		autoAddRow:{status:0},
		onBeforeEdit:function(editParm){
			 return editParm.record['status']===0;
		},
		onLoadData :function(){
			return !($('#mainOrganId').val()=='');
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
//查询
function query(obj) {
	var param = $(obj).formToJSON();
	if(param.organId==''){
		Public.tip('请先选择单位！');
		return;
	}
	UICtrl.gridSearch(gridManager, param);
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function initPeriod(obj){
	var param = $(obj).formToJSON();
	if(param.organId==''){
		Public.tip('请先选择单位！');
		return;
	}
	Public.ajax(web_app.name + '/hrSetupAction!saveInitPeriod.ajax',param, function(){
		query();
	});
}

function saveHandler(){
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0) return false;
	Public.ajax(web_app.name +'/hrSetupAction!saveOperationPeriod.ajax',
		{
			detailData:encodeURI($.toJSON(detailData)),
			organId:$('#mainOrganId').val()
		},
		function(){
			reloadGrid();
		}
	);
}

function deleteHandler(){
	DataUtil.delSelectedRows({action:'hrSetupAction!deleteOperationPeriod.ajax',
		gridManager:gridManager,idFieldName:'periodId',
		onCheck:function(data){
			if(parseInt(data.status)!=0){
				Public.tip(data.periodName+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();
		}
	});
}