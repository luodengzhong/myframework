var gridManager = null,afterGridManager=null, refreshFlag = false;
var dataSource={
		yesOrNo:{1:'是',0:'否'},
		changeOrCancel:{1:'课程取消',0:'课程变更'}
   };
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeAfterGrid();
});
function initializeGrid() {
	var changeApplyId=$("#changeApplyId").val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		 addBatchHandler : {
			id : 'AddBatch',
			text : '批量添加变更课程',
			img : 'page_extension.gif',
			click : addBatchChangeCourseHandler
		},
		changeTrainingCourse:{id:'updateCourse',text:'变更课程',img:'page_edit.gif',click:function(){changeTrainingCourse()}},
		closeCourseHandler: {id:'closeCourse',text:'取消课程',img:'page_delete.gif',click:function(){closeCourseHandler();}}
	});
   gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "班级名称", name: "className", width: 120, minWidth: 60, type: "string", align: "center" },		   
		{ display: "课程名称", name: "courseName", width: 100, minWidth: 60, type: "string", align: "center" },	
		{ display: "讲师姓名", name: "teacherName", width: 150, minWidth: 60, type: "string", align: "center",
		   editor: { type: 'select',   required: true, 
		            data: { type:"hr", name: "trainTeacherSelect",
			        back:{staffName: "teacherName", trainingTeacherId:"trainingTeacherId"
		           }
		}}},
		{ display: "课程时间(起)", name: "courseStartTime", width: 150, minWidth: 60, type: "string", align: "center",
		 editor: { type: 'dateTime',   required: true}},		   
		{ display: "课程时间(止)", name: "courseEndTime", width: 150, minWidth: 60, type: "string", align: "center",
		 editor: { type: 'dateTime',   required: true}},	
		{ display: "是否节假日上课", name: "isHolidays", width: 100, minWidth: 60, type: "string", align: "center",
		editor: { type:'combobox', required: true,data:dataSource.yesOrNo},
			render:function(item){
		    return dataSource.yesOrNo[item.isHolidays];
		      }},	
		{ display: "课程地点", name: "coursePlace", width: 150, minWidth: 60, type: "string", align: "center" ,
		 editor: { type: 'text',   required: true}},		   
		{ display: "备注", name: "remark", width: 150, minWidth: 60, type: "string", align: "center" ,
		 editor: { type: 'text',   required: false}}
		],
		dataAction : 'server',
		url: web_app.name+'/trainingClassCourseAction!slicedAfterChangeQuery.ajax',
		parms:{changeApplyId:changeApplyId,pagesize:1000},
		usePager:false,
		width : '99%',
		height : 200,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'trainingClassCourseId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		 onLoadData :function(){
			return !($('#changeApplyId').val()=='');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			changeTrainingCourse(data.trainingClassCourseId);
		}
	});
}

function initializeAfterGrid(){
	var trainingSpecialClassId=$("#trainingSpecialClassId").val();
	var changeApplyId=$("#changeApplyId").val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		deleteChangeTrainingCourse:{id:'deleteChangeTrainingCourse',text:'删除变更',img:'page_delete.gif',click:function(){deleteChangeTrainingCourse()}}
	});
	afterGridManager = UICtrl.grid('#afterMaingrid', {
		columns: [
		{ display: "班级名称", name: "className", width: 120, minWidth: 60, type: "string", align: "center" },		   
		{ display: "课程名称", name: "courseName", width: 100, minWidth: 60, type: "string", align: "center" },	
		{ display: "讲师姓名", name: "teacherName", width: 150, minWidth: 60, type: "string", align: "center"},
		{ display: "课程时间(起)", name: "courseStartTime", width: 150, minWidth: 60, type: "string", align: "center"},		   
		{ display: "课程时间(止)", name: "courseEndTime", width: 150, minWidth: 60, type: "string", align: "center"},	
		{ display: "是否节假日上课", name: "isHolidays", width: 100, minWidth: 60, type: "string", align: "center",
		editor: { type:'combobox', required: true,data:dataSource.yesOrNo},
			render:function(item){
		    return dataSource.yesOrNo[item.isHolidays];
		      }},	
		{ display: "课程地点", name: "coursePlace", width: 150, minWidth: 60, type: "string", align: "center" },	
		{ display: "状态", name: "isCancel", width: 100, minWidth: 60, type: "string", align: "center",
		 render:function(item){
		 	return '<font style="color:red;width:100%;height:100%;font-size:15px">'+dataSource.changeOrCancel[item.isCancel]+'</font>';
		      }},		   
		{ display: "备注", name: "remark", width: 150, minWidth: 60, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/trainingClassCourseAction!slicedAfterChangeQuery.ajax',
		parms:{changeApplyId:changeApplyId,pagesize:1000},
		usePager:false,
		//enabledEdit : true,
		width : '99%',
		height : 200,
		heightDiff : -5,
		headerRowHeight : 25,
		toolbar: toolbarOptions,
		rowHeight : 25,
		sortName:'trainingClassCourseId',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#changeApplyId').val()=='');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			//updateCourseTeacherHandler(data.trainingClassCourseId);
		}
	});
}

//b变更

function changeTrainingCourse(trainingClassCourseId){
	var changeApplyId=$('#changeApplyId').val();
	if(!changeApplyId){
		Public.tip('请先点击保存按钮！'); return;
	}
	if(!trainingClassCourseId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		trainingClassCourseId=row.trainingClassCourseId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingClassCourseAction!showUpdate.load', 
	param:{trainingClassCourseId:trainingClassCourseId,changeApplyId:changeApplyId}, 
	ok: update, 
	title:'变更培训课程信息',
	width:420,
	close: reloadAfterGrid()});
}

function deleteChangeTrainingCourse(){
	var row = afterGridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var classCourseChangeId=row.classCourseChangeId;
	UICtrl.confirm('确定删除变更课程吗?',function(){
		Public.ajax(web_app.name + '/trainingChangeApplyAction!deleteChangeTrainingCourse.ajax', 
			{classCourseChangeId:classCourseChangeId}, function(){
			reloadAfterGrid();
		});
	});
}
//取消按钮
function closeCourseHandler(){
	var row = gridManager.getSelectedRow();
	var changeApplyId=$('#changeApplyId').val();
	if (!row) {Public.tip('请选择数据！'); return; }
	var trainingSpecialClassId=$('#trainingSpecialClassId').val();
	UICtrl.confirm('确定取消课程吗?',function(){
		Public.ajax(web_app.name + '/trainingChangeApplyAction!cancelCourse.ajax', 
			{trainingClassCourseId:row.trainingClassCourseId,changeApplyId:changeApplyId}, function(data){
			setId(data);
			reloadAfterGrid();
		});
	});
}

function addBatchChangeCourseHandler(){
	var changeApplyId=$('#changeApplyId').val();
	UICtrl.showFrameDialog({
	url: web_app.name + '/trainingChangeApplyAction!showBeSelectClassCourse.do', 
	param:{changeApplyId:changeApplyId},
	 ok: batchChangeApply, 
	 width: 850,
     height: 400,
	title:"批量选择变更课程"});
}

function batchChangeApply(){
	var fn = this.iframe.contentWindow.getSelectData;
	var data=fn();
	 	var addRows = [], addRow;
	    $.each(data, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["trainingSpecialClassId"] = o["trainingSpecialClassId"];
	    		addRow["trainingSpecialClassId"] = o["trainingSpecialClassId"];
	    		addRow["className"] = o["className"];
	    		addRow["courseName"] = o["courseName"];
	    		addRow["teacherName"] = o["teacherName"];
	    		addRow["courseStartTime"] = o["courseStartTime"];
	    		addRow["courseEndTime"] = o["courseEndTime"];
	    		addRow["isHolidays"] = o["isHolidays"];
	    		addRow["coursePlace"] = o["coursePlace"];
	    		addRow["remark"] = o["remark"];
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);
	    	return true;
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function reloadAfterGrid(){
	afterGridManager.loadData();
}
function getId() {
	return $("#changeApplyId").val() || 0;
}

function setId(value){
	$("#changeApplyId").val(value);
	gridManager.options.parms['changeApplyId'] =value;
	afterGridManager.options.parms['changeApplyId'] =value;

}

function getExtendedData(){
	var extendedData = DataUtil.getGridData({gridManager: gridManager});
	if(!extendedData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(extendedData))};
}
//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingChangeApplyAction!update.ajax',
		success : function(data) {
			setId(data);
			reloadAfterGrid();
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
