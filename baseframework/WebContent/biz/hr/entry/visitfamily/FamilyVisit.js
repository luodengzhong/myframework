var gridManager = null, detailGridManager=null,   refreshFlag = false;
var residenceKind=null;
var sex=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	residenceKind=$('#residenceKind').combox('getJSONData');
	sex=$('#sex').combox('getJSONData');
});
function initializeUI(){
	  UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseRecruitData',
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
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {

	var html=[],fullId='',fullName='';
	if(!data){
		html.push('家访回执列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>家访回执列表');
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
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		specialFamilyVisitHandler:{id:'specialFamilyVisitHandler',text:'特殊家访申请',img:'page_settings.gif',click:function(){
			specialFamilyVisitHandler();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "被访人姓名", name: "name", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "被访人入司时间", name: "employDate", width: 120, minWidth: 60, type: "date", align: "left" },		   
		{ display: "被访人岗位", name: "pos", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "被访人所在部门", name: "dept", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "被访人地址", name: "visitAddress", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "居住房屋性质", name: "houseProperty", width: 120, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:residenceKind},
			render: function (item) { 
				return residenceKind[item.houseProperty];
			} },		   
		{ display: "家访记录", name: "visitRecord", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "家访时间", name: "visitTime", width: 120, minWidth: 60, type: "date", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/visitfamilyAction!slicedQueryFamilyVisit.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.visitId);
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
}

function specialFamilyVisitHandler(){
	parent.addTabItem({ 
		tabid: 'HRSpecialFamilyVisitApply',
		text: '特殊家访申请',
		url: web_app.name + '/specialFamilyVisitAction!forwardBill.job' 
		}); 
}


//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/visitfamilyAction!showInsertFamilyVisit.load', 
		title:"新增家访回执单",
		init:initDialog,
		width:400,
		ok: insert, close: dialogClose});
}
function initDialog(doc){
	
	$('#familyVistFileList').fileList();
	var visitId=$('#visitId').val();
	var dtoolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function() {
			UICtrl.addGridRow(detailGridManager);
	       }, 
	       deleteHandler: function(){
				DataUtil.delSelectedRows({action:'visitfamilyAction!deleteVisitMember.ajax',
					gridManager:detailGridManager,idFieldName:'visitMemberId',
					onSuccess:function(){
						detailGridManager.loadData();
					}
				});
	          
		}
		
	});
	detailGridManager = UICtrl.grid('#marginDetailId', {
		columns: [
		{ display: "成员姓名", name: "name", width: 100, minWidth: 60, type: "string", align: "left",editor: { type: 'text',required:true} },		   
		{ display: "与本人关系", name: "familyRelation", width: 100, minWidth: 60, type: "string", align: "left",editor: { type: 'text'} },		   
		{ display: "联系方式", name: "familyPhone", width: 100, minWidth: 60, type: "string", align: "left",editor: { type: 'text'} },		   
		{ display: "工作单位", name: "familyFirm", width: 100, minWidth: 60, type: "string", align: "left",editor: { type: 'text'} },		   
		{ display: "家庭成员职业", name: "occupation", width: 100, minWidth: 60, type: "string", align: "left", editor: { type: 'text'}},		   
		{ display: "性别", name: "sex", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:sex},
			render: function (item) { 
				return sex[item.sex];
			}},		   
		{ display: "年龄", name: "age", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',mask:'nn'} },
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" ,
				editor: { type: 'text',mask:'nn'}}		   
		],
		    dataAction : 'server',
			url: web_app.name+'/visitfamilyAction!slicedQueryVisitMember.ajax',
			  parms : {
				  visitId : visitId
				},
			width : '100%',
			sortName:'sequence',
			sortOrder:'asc',
			height : '100%',
			heightDiff : -60,
			headerRowHeight : 25,
			rowHeight : 25,
			toolbar: dtoolbarOptions,
			enabledEdit: true,
			usePager: false,
			checkbox: true,
			fixedCellHeight: true,
			autoAddRow:{status:0},
			selectRowButtonOnly: true,
			onLoadData :function(){
				return !($('#visitId').val()=='');
			}
			});
}
//编辑按钮
function updateHandler(visitId){
	if(!visitId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		visitId=row.visitId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/visitfamilyAction!showUpdateFamilyVisit.load', 
		param:{visitId:visitId},
		title:"修改家访回执表单",
		init:initDialog,
		width:400,
		ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/visitfamilyAction!deleteFamilyVisit.ajax',
				{visitId:row.visitId}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'visitfamilyAction!deleteFamilyVisit.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}

//新增保存
function insert() {
	var visitMemberId=$('#visitMemberId').val();
	if(visitMemberId!='') return update();
	var detailData=DataUtil.getGridData({gridManager:detailGridManager});
	if(!detailData)  return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/visitfamilyAction!insertFamilyVisit.ajax',
		param:{detailData:encodeURI($.toJSON(detailData))},
		success : function(id) {
			$('#visitMemberId').val(id);
			detailGridManager.options.parms['visitId']=id;
			detailGridManager.loadData();
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	var detailData=DataUtil.getGridData({gridManager:detailGridManager});
	if(!detailData)  return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/visitfamilyAction!updateFamilyVisit.ajax',
		param:{detailData:encodeURI($.toJSON(detailData))},
		success : function() {
			refreshFlag = true;
		}
	});
}

function upLoad(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请先选择家访回执单！'); return; }
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
