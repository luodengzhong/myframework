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
		html.push('督导师列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>督导师列表');
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
		addHandler:{id:'addTeacher',text:'添加员工督导师',img:'page_new.gif',click:function(){
				addTeacher();
			}
		},
		updateHandler: function(){
			updateHandler();
		},
		//viewHandler:viewHandler,
		sendTeacherPlanHandler:{id:'sendTeacherPlan',text:'发送新员工试用期督导情况表',img:'page_next.gif',click:function(){
				sendTeacherPlan();
			}
		},
	   updateTeacherPlanTimesHandler:{id:'updateTeacherPlanTimes',text:'次数变更',img:'page_edit.gif',click:function(){
				updateTeacherPlanTimes();
			}
		},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
		
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位名称", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "中心名称", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门名称", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位名称", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "督导师姓名", name: "teacherName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "督导师路径", name: "fullName", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工入职时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "已推送督导情况表次数", name: "sendTimes", width: 140, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/entryCheckAction!slicedTeacherQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'updateDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id,data.sendTimes);
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




//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function addTeacher(){
	UICtrl.showAjaxDialog({url: web_app.name + '/entryCheckAction!showInsertTeacher.load', 
		ok: saveTeacher, 
		width:500,
		title:"新增员工督导师",
		init:initDialog,
		close: dialogClose});
}

function saveTeacher(){

	var id=$('#id').val();
	if(id!='') return updateTeacher();
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/entryCheckAction!insertArchivesTeacher.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#id').val(data);
			refreshFlag = true;
		}
	});
}
function initDialog(){
	$('#staffName').searchbox({ type:"hr", name: "resignationChoosePerson",
			back:{
				staffName:"#staffName",archivesId:"#archivesId"
			    }});

	$('#teacherName').searchbox({type:'sys',name:'orgSelect',
			back:{id:'#teacherId',name:'#teacherName'},
			getParam:function(){
				var param={a:1,b:1},condition=["org_kind_id ='psm'  and instr(full_id, '.prj') = 0"];
				param['searchQueryCondition']=condition.join('');
				return param;
			}
	    });
			    		    
}

//编辑按钮
function updateHandler(id,sendTimes){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	    sendTimes=row.sendTimes;
	}
	if(sendTimes>0){
	 Public.tip('若要修改督导师请走督导师变更流程！'); return;	
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/entryCheckAction!showUpdateTeacher.load', 
		param:{id:id}, 
		width:500,
		title:"修改员工督导师",
		ok: updateTeacher, 
		init:initDialog,
		close: dialogClose});
}


function updateTeacher(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/entryCheckAction!updateArchivesTeacher.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

function sendTeacherPlan(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var staffName=row.staffName;
	var teacher=row.teacherName;
	var sendTimes=row.sendTimes;
	if(sendTimes==3){
		Public.tip('发送督导情况计划表超过三次！'); return;
	}
	var teacherPlanId=row.teacherPlanId;
	Public.ajax(web_app.name + '/teacherPlanAction!createThreeTableData.ajax',
	 {teacherPlanId:teacherPlanId,staffName:staffName,teacher:teacher,sendTimes:sendTimes+1},
	 function(){
	 	reloadGrid();
	 }
	);
}
function updateTeacherPlanTimes(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var teacherPlanId=row.teacherPlanId;
	var sendTimes=row.sendTimes;
	var value=null;
	if(!teacherPlanId){
		Public.tip('不能增加次数！'); return;
	}
	if(sendTimes<3){
		value=sendTimes+1;
	}else{
		value=sendTimes-1;
	}
	Public.ajax(web_app.name + '/teacherPlanAction!updateTeacherPlanTimes.ajax',
	{teacherPlanId:teacherPlanId,sendTimes:value},
	 function(){
	 	reloadGrid();
	 }
	);

}

function viewHandler(){
	Public.ajax(web_app.name + '/teacherPlanAction!startSecondTeacherPlan.ajax',
	 function(){
	 	reloadGrid();
	 }
	);
}
