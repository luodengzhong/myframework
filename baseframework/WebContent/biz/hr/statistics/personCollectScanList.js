var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	var archivesState=$('#tempArchivesState').combox('getJSONData');
	$('#state').combox({data:archivesState,checkbox:true}).combox('setValue','1');
	
	initializeGrid();
	initializeUI();
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
	
	var more=$('#toolbar_menuarchivesInfo').contextMenu({
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
			{name:"生成Word",icon:'edit',handler:function(){
				archivesInfo('word');
			}}
		],
		onSelect:function(){
			this._hideMenu();
		}
	});

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
		exportExcelHandler:function(){
			UICtrl.gridExport(gridManager);
		},
		archivesInfo:{id:'archivesInfo',text:'个人信息一览表',img:'page_user.gif',click:function(){}}
	});
	var param={state:1};
	var columns=[
	      { display: "单位名称", name: "ognName", width: 100, minWidth: 60, type: "string", align: "center"},
	      { display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "center" },		   
	      { display: "部门名称", name: "dptName", width: 100, minWidth: 60, type: "string", align: "center" },	
	      { display: "姓名", name: "staffName", witdth: 100, minWidth: 60, type: "string", align: "center"},
	      { display: "职位", name: "posName", width: 100, minWidth: 60, type: "string", align: "center" },		   
	      { display: "层级", name: "posTierTextView", width: 100, minWidth: 60, type: "string", align: "center" },
	      { display: "行政级别", name: "posLevelTextView", width: 100, minWidth: 60, type: "string", align: "center" },
	      { display: "性别", name: "sexTextView", width: 60, minWidth: 60, type: "string", align: "center"},
	      { display: "年龄", name: "age", width: 100, minWidth: 60, type: "string", align: "center" },		   
	      { display: "身高", name: "height", width: 100, minWidth: 60, type: "string", align: "center" },		   
	      { display: "到公司时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "center" },		   
	      { display: "集团工龄", name: "CWorkTime", width: 100, minWidth: 60, type: "string", align: "center" },
	      { display: "从业时间", name: "workDate", width: 100, minWidth: 60, type: "date", align: "center"},
	      { display: "从业年限", name: "workTime", width: 80, minWidth: 60, type: "string", align: "center" },		   
	      { display: "最高学历", name: "educationTextView", width: 100, minWidth: 60, type: "string", align: "center" },		   
	      { display: "毕业学校", name: "f04", width: 100, minWidth: 60, type: "string", align: "center" },		   
	      { display: "所学专业", name: "f03", width: 100, minWidth: 60, type: "string", align: "center" },
	       { display: "执业资格证", name: "jobCertificate", width: 120, minWidth: 60, type: "string", align: "center"},
	      { display: "工作经历", name: "workExperienceDetail", width: 300, minWidth: 60, type: "string", align: "center" },		   
	      { display: "人员类别", name: "staffingLevelTextView", width: 100, minWidth: 60, type: "string", align: "center" }		   
	];
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedpersonCollecyScanQuery.ajax',
		parms:param,
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

function templetScan(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	 var archivesId = row.archivesId;
	 var  staffName=row.staffName;
	 alert(archivesId);
	 parent.addTabItem({ 
				tabid: 'HRArchivesScan'+archivesId,
				text:'员工模板预览',
				url: web_app.name + '/hrSystemStatisticsAction!showTempletScanDetailByArchivesId.do?archivesId=' 
					+ archivesId
				}); 
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	onFolderTreeNodeClick();
}

function archivesInfo(type){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var archivesId=row.archivesId;
	//这里引用档案管理的字段权限
	var url=web_app.name + '/hrArchivesAction!createArchivesPdf.load?functionCode=HRArchivesMaintain&archivesId='+archivesId+'&type='+type;
	window.open(url);
}

