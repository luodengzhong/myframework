var gridManager = null, refreshFlag = false,archivesState=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
	initializeUI();
	initializeGrid();
	
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrArchivesManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('#state').combox({data:archivesState,checkbox:true}).combox('setValue','0,1');
	/*var more=$('#toolbar_menuarchivesInfo').contextMenu({
		width:"120px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=more.offset(),height=more.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"生成PDF",icon:'enable',handler:function(){
				archivesInfo('pdf');
			}},
			{name:"生成Word",icon:'disable',handler:function(){
				archivesInfo('word');
			}}
		],
		onSelect:function(){
			this._hideMenu();
		}
	});*/
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
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
	/*	viewHandler: function(){
			viewHandler();
		} ,*/
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
		//archivesInfo:{id:'archivesInfo',text:'个人信息一览表',img:'page_user.gif',click:function(){}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
		{ display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "层级", name: "posTierTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "行政级别", name: "posLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "人员类别", name: "staffKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "编制状态", name: "staffingLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "工资发放标识", name: "wageFlagTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "工资发放银行", name: "wageBankTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "工资卡号", name: "wageCardCode", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "离职办理", name: "isLeaveTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "试用期", name: "isProbationTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "stateTextView", width: 60, minWidth: 60, type: "string", align: "left"}	
		],
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!slicedQuery.ajax',
		parms:{state:'0,1'},
		manageType:'hrArchivesManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
//				viewHandler(data.archivesId);
		}
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
	$('#state').combox('setValue','0,1');
	onFolderTreeNodeClick();
}

function archivesInfo(type){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var archivesId=row.archivesId;
	var url=web_app.name + '/hrArchivesAction!createArchivesPdf.load?archivesId='+archivesId+'&type='+type;
	window.open(url);
}
/*function viewHandler(archivesId){
	if(!archivesId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		archivesId=row.archivesId;
	}
	var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId='+archivesId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRArchivesView'+archivesId, text: '查看人员 ', url:url});
}*/


