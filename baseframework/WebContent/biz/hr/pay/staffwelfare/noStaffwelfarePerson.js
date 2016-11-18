var gridManager = null,queryType=null;
var impOrganId=null,impSerialId=null;
Public.tip.topDiff=10;
var manageType='hrAccumulationFundImp';
$(document).ready(function() {
	impOrganId = Public.getQueryStringByName("impOrganId");
	impSerialId = Public.getQueryStringByName("impSerialId");
	queryType=Public.getQueryStringByName("queryType");
	initializeUI();
	initializeGrid();
});
function initializeUI(){
	$('#year').val(new Date().getFullYear());
	if(queryType=='socialSecurity'){
		$('#impyesorno').parent().prev().html('是否购买社保:');
		manageType='hrSocialImp';
	}
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:manageType,
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		var year=$('#year');
		if(year.length>0){
			var y=year.val();
			if(y!=''){
				return {paramValue:y};
			}
		}
	},back:{periodId:'#impPeriodId',yearPeriodName:'#periodName'}});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		var param = $('#queryMainForm').formToJSON();
		if(!param) return;
		param['impFullId']=fullId;
		UICtrl.gridSearch(gridManager,param);
	}else{
		gridManager.options.parms['impFullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var url= web_app.name+'/staffWelfareAction!slicedQueryNoProvidentFundPerson.ajax';
	if(queryType=='socialSecurity'){
		url= web_app.name+'/staffWelfareAction!slicedQueryNoSocialSecurityPerson.ajax';
	}
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	var columns= [
	   { display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	   { display: "单位", name: "ognName", width: 130, minWidth: 60, type: "string", align: "left" },		   
	   { display: "中心", name: "centreName", width: 130, minWidth: 60, type: "string", align: "left" },		   
	   { display: "部门", name: "dptName", width: 130, minWidth: 60, type: "string", align: "left" },		   
	   { display: "岗位", name: "posName", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "行政级别", name: "posLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" }
	];
	if(queryType=='socialSecurity'){
		columns.push({ display: "是否购买社保", name: "yesornoTextView", width: 80, minWidth: 60, type: "string", align: "left" });
	}else{
		columns.push({ display: "是否购买公积金", name: "yesornoTextView", width: 80, minWidth: 60, type: "string", align: "left" });
	}
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url:url,
		parms:{impOrganId:impOrganId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'sequence',
		sortOrder:'asc',
		heightDiff : -15,
		headerRowHeight : 25,
		toolbar: toolbarOptions,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#impPeriodId').val()=='');
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
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
	onFolderTreeNodeClick();
}