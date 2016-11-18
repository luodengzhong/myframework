var ClassGridManager=null, refreshFlag = false;
var dataSource={
		yesOrNo:{1:'是',0:'否'},
		changeOrCancel:{1:'课程取消',0:'课程变更'}
   };
$(document).ready(function() {

    UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	initializeCourseGrid();
	loadClassCourseTree();
});



function loadClassCourseTree(nodeData){
	nodeData = nodeData||{};
	$('#classtree').commonTree({
        loadTreesAction: '/trainingSpecialClassAction!slicedQuery.ajax',
        idFieldName: 'trainingSpecialClassId',
        textFieldName: "className",
        sortName : 'className',// 排序列名
		sortOrder : 'asc',// 排序方向
		checkbox:false,
		getParam: function(data){
        	var param = {};
        	param['classStatus'] = 2;
        	return param;
        },
        onClick: function (data) {
            if (!data)
                return;
            procNodeClick(data);
        },
        IsShowMenu: false
    });
}

function procNodeClick(nodeData){
    $('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + nodeData.className + "]</font>课程列表");
    trainingSpecialClassId = nodeData.trainingSpecialClassId;
    var params = $("#queryMainForm").formToJSON();
    params.trainingSpecialClassId = trainingSpecialClassId;
    UICtrl.gridSearch(ClassGridManager, params);
}



function initializeCourseGrid(){
	
	var trainingSpecialClassId=$("#trainingSpecialClassId").val();
	ClassGridManager = UICtrl.grid('#courseMaingrid', {
		columns: [
		{ display: "班级名称", name: "className", width: 100, minWidth: 60, type: "string", align: "center" },	
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
		{ display: "备注", name: "remark", width: 150, minWidth: 60, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/trainingClassCourseAction!slicedQuery.ajax',
		parms:{trainingSpecialClassId:$("#trainingSpecialClassId").val(),pagesize:1000},
		usePager:false,
		//enabledEdit : true,
		checkbox:true,
		width : '99%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'courseStartTime',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});

}


// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(ClassGridManager, param);
}

function getSelectData(){
     var data = ClassGridManager.getSelecteds();
    return data;
}
