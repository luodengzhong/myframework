var gridManager = null, classGridManager = null,courseGridManager= null, refreshFlag = false;
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
		manageType:'hrBaseTrainManageData',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,orgKindId : "ogn,dpt"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
		});
}

function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('课堂总结');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>课堂总结');
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
		//addHandler: {id:'add',text:'添加签到记录表',img:'page_edit.gif',click:addHandler}, 
		lessonRecord:{
			id:'studentSign',
			text:'课堂记录',
			img:'action_go.gif',
			click:function(item){
				var row = gridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				var trainingClassCourseId = row.trainingClassCourseId;
				var url = web_app.name+'/trainingClassCourseAction!showUpdateTrainingSignBill.do?bizId='+trainingClassCourseId/*+'&isReadOnly=true'*/;
				parent.addTabItem({ tabid: 'studentSign'+trainingClassCourseId, text: '培训签到,课堂记录登记', url:url});
			}
		},
		saveAvgScoreHandler:{id:'saveAvgScore',text:'填写培训评估平均分',img:'action_go.gif',click:saveAvgScore}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{display: "班级名称", name: "className", width: 100, minWidth: 60, type: "string", align: "left",frozen: true},
			{display: "课程名称", name: "courseName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true},
			{display: "讲师姓名", name: "teacherName", width: 100, minWidth: 60, type: "string", align: "center",frozen: true},
			{display: "开始时间", name: "courseStartTime", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "结束时间", name: "courseEndTime", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "地点", name: "coursePlace", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "培训效果评估表", name: "num", width: 180, minWidth: 60, type: "string", align: "center",
				render: function (item){
					if(item.num==0){
		    		return '<a href="javascript:doOperation('+item.trainingClassCourseId+');" class="GridStyle">' + "发送评估表" + '</a>';
					}else{
					return '<a href="javascript:viewOperation('+item.trainingClassCourseId+');" class="GridStyle">' + "查看评估表" + '</a>'+
	    				'  ||   '+'<a href="javascript:viewIndexScoreDetail('+item.trainingClassCourseId+');" class="GridStyle">'+'查看各指标项得分'+'</a>';;
					}
				}
			},
		  {display: "跟踪培训评估进度", name: "effectProgress", width: 200, minWidth: 60, type: "string", align: "left"},
		  {display: "课程内容加权平均分", name: "courseAvgScore", width: 100, minWidth: 60, type: "string", align: "left"},
		  {display: "培训师加权平均分", name: "teacherAvgScore", width: 100, minWidth: 60, type: "string", align: "left"},
		  {display: "总分加权平均分", name: "totalAvgScore", width: 100, minWidth: 60, type: "string", align: "left"}

		],
		dataAction : 'server',
		url: web_app.name+'/trainingClassCourseAction!slicedStudentSignQuery.ajax',
		pageSize : 20,
		manageType:'hrBaseTrainManageData',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'courseStartTime',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit:true
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

function  doOperation(trainingClassCourseId){
	UICtrl.confirm('发送培训评估表需要在课程培训结束后，确定现在发送培训评估表吗?',function(){
		Public.ajax(web_app.name +'/trainingEffectEvaAction!insertTrainingEffectEvaluate.ajax',
			{trainingClassCourseId:trainingClassCourseId},function(){
			reloadGrid();
		});
	});
}


function viewOperation(trainingClassCourseId){
	parent.addTabItem({
		tabid: 'HRTrainingEffectEvalation'+trainingClassCourseId,
		text: '培训效果评估反馈列表',
		url: web_app.name + '/trainingEffectEvaAction!forwardListTrainingEffectEvaluate.do?trainingClassCourseId=' 
			+ trainingClassCourseId
	}
	);
}

//查看各指标明细得分
function  viewIndexScoreDetail(trainingClassCourseId){
	parent.addTabItem({
		tabid: 'HRviewIndexScoreDetail'+trainingClassCourseId,
		text: '培训效果评估反馈表指标明细',
		url: web_app.name + '/trainingEffectEvaAction!forwardListTrainingEffectEvaluateIndex.do?trainingClassCourseId=' 
			+ trainingClassCourseId
	}
	);
}
//填写平均分
function saveAvgScore(){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		var trainingClassCourseId = row.trainingClassCourseId;
		var isOnlineScore=row.isOnlineScore;
		if(isOnlineScore==1){
			Public.tip('该课程线上评分,不能手动录入平均分！'); return;
		}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingClassCourseAction!showUpdateAvgScore.load', 
	param:{trainingClassCourseId:trainingClassCourseId}, 
	ok: update, 
	title:'填写平均分',
	width:420,
	close: dialogClose});
		
}
//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingClassCourseAction!showInsertSign.load',width:700,height:400,title:'选择班级和课程',init:function(){
		$("#selectedClassId").val('');
		$("#selectedCourseId").val('');
		initClassGrid();
		initCourseGrid();
	},ok:function(){
		Public.ajax(web_app.name +'/trainingClassCourseAction!insertSignForm.ajax',{trainingSpecialClassId:$("#selectedClassId").val(),trainingClassCourseId:$("#selectedCourseId").val()},function(){
			reloadGrid();
		})
	}});
}


//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/trainingLessonAction!delete.ajax', {trainingLessonId:row.trainingLessonId}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'trainingLessonAction!delete.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}


//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingClassCourseAction!update.ajax',
	param:{scoreStatus:2}, 
		success : function() {
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
function initCourseGrid(){
	var tbo = UICtrl.getDefaultToolbarOptions({});
	courseGridManager = UICtrl.grid("#courseGrid", {
		columns: [
			{display: "课程名称", name: "name", minWidth: 60, type: "string", align: "left"},
			{display: "课程大纲", name: "outline", minWidth: 60, type: "string", align: "center"},
			{display: "开发讲师", name: "trainingTeacherName", minWidth: 60, type: "string", align: "center"},
			{display: "体系", name: "systemTypeTextView", minWidth: 60, type: "string", align: "center"}
		],
		dataAction: 'server',
		url: web_app.name + '/trainingCourseAction!query.ajax',
		parms: {trainingClassId: ""},
		pageSize: 20,
		width: '100%',
		height: '400',
		heightDiff: -5,
		headerRowHeight: 25,
		rowHeight: 25,
		sortName: 'trainingCourseId',
		sortOrder: 'asc',
		toolbar: tbo,
		fixedCellHeight: true,
		selectRowButtonOnly: true,
		onSelectRow: function (data,rowid,rowobj) {
			$("#selectedCourseId").val(data.trainingClassCourseId);
		}
	});
}

//初始化表格
function initClassGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
	});
	classGridManager = UICtrl.grid('#classGrid', {
		columns: [
			{display: "班级名称", name: "className",  minWidth: 60, type: "string", align: "left"},
			{display: "开班时间", name: "openTime",  minWidth: 60, type: "string", align: "center"},
			{display: "结业时间", name: "graduatedTime", minWidth: 60, type: "string", align: "center"}
		],
		dataAction : 'server',
		url: web_app.name+'/trainingSpecialClassAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '400',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'trainingSpecialClassId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onSelectRow:function(data,rowindex,rowobj){
			$("#selectedClassId").val(data.trainingSpecialClassId);
			UICtrl.gridSearch(courseGridManager,{trainingClassId: data.trainingSpecialClassId});
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			//updateHandler(data.id);
		}
	});
}
