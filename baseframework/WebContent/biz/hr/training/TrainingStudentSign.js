var gridManager = null, refreshFlag = false;
var dataSource={
		yesOrNo:{1:'是',0:'否'}
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	$('#trainingStudentSignFileList').fileList();
	var  trainingClassCourseId=$('#trainingClassCourseId').val();
	 $('#trainingStudentSignFileList').fileList({bizId:trainingClassCourseId});
});
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		updateHandler: updateHandler, 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		saveHandler:saveHandler,
		syncStudentHandler:{id:'syncStudent',text:'同步学员列表',img:'page_down.gif',click:syncStudent}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
	   { display: "序号", name: "rownum", width: 50, minWidth: 50, type: "string", align: "center" },		   
		{ display: "班级名称", name: "className", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "课程名称", name: "courseName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单位名称", name: "ognName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "姓名", name: "trainingStudentName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "是否请假", name: "isLeave", width: 70, minWidth: 60, type: "string", align: "left",
			render:function(item){
		    return dataSource.yesOrNo[item.isLeave];
		     }
		 },
		{ display: "是否签到", name: "isSign", width: 70, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',required:true,data:dataSource.yesOrNo},
			render:function(item){
		    return dataSource.yesOrNo[item.isSign];
		      }
		},
	    { display: "签到时间", name: "signTime", width: 100, minWidth: 60, type: "string", align: "left",
	    editor: { type:'dateTime',required: false} },	
	    { display: "课堂表现加分", name: "lessonScore", width: 100, minWidth: 60, type: "string", align: "left",
	     editor: { type: 'spinner', mask : 'nnnnnn'}
	     },	
	    { display: "扣分", name: "attendanceScore", width: 100, minWidth: 60, type: "string", align: "left",
	     editor: { type: 'spinner',  mask:'nnnnnn'}},	
	    { display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/trainingClassCourseAction!slicedSignListQuery.ajax',
		parms:{trainingClassCourseId:$("#trainingClassCourseId").val(),pagesize:400},
		enabledEdit : true,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		usePager:false,
		checkbox:true,
		sortName:'rownum',
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



//重置表单
function resetForm(obj) {
	$(obj).formClean();
}
function save(){
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	Public.ajax(web_app.name+'/trainingClassCourseAction!saveAddAndReduce.ajax',
			    		{extendedData:$.toJSON(extendedData)},
			    		function(){
			    			reloadGrid();
			    		}
		);
}


function advance(){
	var taskId=$('#taskId').val();
	var trainingClassCourseId=$('#trainingClassCourseId').val();
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	Public.ajax(web_app.name+'/trainingClassCourseAction!saveAddAndReduce.ajax',
			    		{extendedData:$.toJSON(extendedData),taskId:taskId,trainingClassCourseId:trainingClassCourseId},
			    		function(){
			    		UICtrl.closeAndReloadTabs("TaskCenter", null);
			    		}
		);
}
function saveHandler(){
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	Public.ajax(web_app.name+'/trainingClassCourseAction!saveAddAndReduce.ajax',
			    		{extendedData:$.toJSON(extendedData)},
			    		function(){
			    			reloadGrid();
			    		});
}

//编辑按钮
function updateHandler(id){
     var trainingStudentSignIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'trainingStudentSignId' });
    if (!trainingStudentSignIds) return;
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingClassCourseAction!showUpdateSignTime.load', 
	ok: update, 
	width:400,
	close: dialogClose});
}

//编辑保存
function update(){
	 var trainingStudentSignIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'trainingStudentSignId' });
    if (!trainingStudentSignIds) return;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingClassCourseAction!updateSignData.ajax',
		param:{trainingStudentSignIds: $.toJSON(trainingStudentSignIds)},
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

function syncStudent(){
	var trainingClassCourseId=$('#trainingClassCourseId').val();
    Public.ajax(web_app.name+'/trainingClassCourseAction!syncStudent.ajax',
			    		{trainingClassCourseId:trainingClassCourseId},
			    		function(data){
			    			if(data==0){
			    				Public.tip('学员人数一致,无需同步！');
			    			}else{
			    			Public.tip('同步学员成功!');
                            reloadGrid();
			    			}
			    		});
	
	
}

