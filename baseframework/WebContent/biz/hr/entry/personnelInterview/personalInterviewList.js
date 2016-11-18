var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
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
		html.push('员工面谈记录');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>员工面谈记录');
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
	var invType=$('#invType').val();
		//离职面谈
	var  toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler:function(){
			viewHandler();
		},
		updateHandler:{id:'update',text:'修改面谈人',img:'page_edit.gif',click:function(){
			updateHandler();
		}},
		stopHandler:{id:'stop',text:'中止',img:'action_stop.gif',click:function(){
			stop();
		}},
		againHandler:{id:'again',text:'重发',img:'action_refresh_blue.gif',click:function(){
			again();
		}}
		
		});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "面谈人", name: "speakPersonMemberName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 150, minWidth: 60, type: "string", align: "left" },
		{ display: "面谈时间", name: "invTime", width: 120, minWidth: 60, type: "date", align: "left" },
		{ display: "面谈内容", name: "invContent", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }	,
		{ display: "面谈类型", name: "resInvTypeTextView", width: 180, minWidth: 60, type: "string", align: "left" },	   
		{ display: "任务生成时间", name: "fillinDate", width: 120, minWidth: 60, type: "date", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/personalInterviewAction!slicedQuery.ajax',
		parms:{invType:invType},
		manageType:'hrArchivesManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'invTime',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.id);
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
}

function stop(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var id=row.id;
	var status=row.status;
	var speakPersonMemberId=row.speakPersonMemberId;
	//中止 
	Public.ajax(web_app.name + '/personalInterviewAction!stop.ajax', {
			id : id,
			status : 5,
			speakPersonMemberId:speakPersonMemberId
		}, function() {
			reloadGrid();
		});
	
}

function again(){
	
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var id=row.id;
	var status=row.status;
	var speakPersonMemberId=row.speakPersonMemberId;
	var staffName=row.staffName;
	Public.ajax(web_app.name + '/personalInterviewAction!again.ajax', {
			id : id,
			status : 1,
			staffName:staffName,
			speakPersonMemberId : speakPersonMemberId
		}, function() {
			reloadGrid();
		});
}

function  updateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var id=row.id;
	var staffName=row.staffName;
	var status=row.status;
	if(status!=5){
		Public.tip('请先点击中止按钮！'); return;
	}

	 var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	 
	 UICtrl.showFrameDialog({
			title : "选择面谈人",
			url : web_app.name + "/orgAction!showSelectOrgDialog.do",
			param : selectOrgParams,
			width : 700,
			height : 400,
			ok : function() {
				 updateInterviewPerson(this,id,staffName);
			},
			close : this.close()
		});
}

function  updateInterviewPerson(_self,id,staffName){
	var data = _self.iframe.contentWindow.selectedData;
	if (data.length!=1){
		Public.tip("请选择一个面谈人");
		return;
	}
		
	Public.ajax(web_app.name + "/personalInterviewAction!updateInvPerson.load",
			{id:id,staffName:staffName,status:0,data:$.toJSON(data)}, function() {
				reloadGrid();
				_self.close();
			});
}

//编辑按钮
function viewHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	
	parent.addTabItem({ 
		tabid: 'HRpersonalInterview'+id,
		text: '员工面谈记录',
		url: web_app.name + '/personalInterviewAction!showUpdate.job?bizId=' 
			+ id+'&isReadOnly=true'
		}); 
}




