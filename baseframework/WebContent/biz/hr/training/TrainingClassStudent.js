var gridManager = null, refreshFlag = false,archivesState=null;
var addGroupButton = [{
		id : 'devbtn',
		name : '新增分组',
		callback : addGroupHandler
}];
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler,
		saveImpHandler:saveImpHandler,
		groupedHandler:{id:'groupedHandler',text:'分组',img:'list_extensions.gif',click:function(){
			UICtrl.showAjaxDialog({url: web_app.name + '/trainingStudentGroupAction!showGrouped.load',
			param:{trainingSpecialClassId:$("#trainingSpecialClassId").val()},
			ok: grouped, 
			close: dialogClose,
			button:addGroupButton,
			title:"分组",
			width:400});
		}},
		assignLeaderHandler:{id:'assignLeader',text:'指定为组长',img:'page_user.gif',click:assignLeader},
		deleteHandler:{id:'deleteHandler',text:'移除学员',img:'page_delete.gif',click:deleteHandler},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
            { display: "班级", name: "className", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "组名", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "学员姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "单位名称", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "岗位名称", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "行政级别", name: "posLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "状态", name: "state", width: 100, minWidth: 60, type: "string", align: "left" ,
            render:function(item){
                return archivesState[item.state];
            }
            },
            { display: "联系电话", name: "phoneNumber", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "学分", name: "gainCredit", width: 80, minWidth: 60, type: "number", align: "left"},
            { display: "课堂表现得分", name: "gainShowScore", width: 100, minWidth: 60, type: "number", align: "left"}
        ],
		dataAction : 'server',
		url: web_app.name+'/trainingClassStudentAction!slicedQuery.ajax',
        parms:{trainingSpecialClassId:$("#trainingSpecialClassId").val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'classStudentId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onDblClickRow : function(data, rowindex, rowobj) {
			//updateHandler(data.id);
		},
		groupColumnName:'trainingStudentGroupId',groupRender: function (trainingStudentGroupId,groupdata){
			if(!trainingStudentGroupId){
				return ' 未分组';
			}
			return " 组名:"+groupdata[0].name+ " &nbsp; &nbsp; &nbsp; &nbsp; &nbsp"+"  组长:"+groupdata[0].leader;
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

function addGroupHandler(){
	var clazzId=$("#trainingSpecialClassId").val();
   	var url = web_app.name+'/trainingStudentGroupAction!forwardList.do?trainingSpecialClassId='+clazzId;
		 parent.addTabItem({tabid:'studentGroupHandler'+clazzId,text:'班级分组管理',url:url});
}

function assignLeader(){
	var row = gridManager.getSelectedRow();
   if (!row) {Public.tip('请选择数据！'); return; }
   var staffName=row.staffName;
   var trainingStudentId=row.trainingStudentId;
   var trainingStudentGroupId=row.trainingStudentGroupId;
   if(!trainingStudentGroupId){
   		Public.tip('请先分组，后指定组长'); return;
   	}
   UICtrl.confirm('确定指定'+staffName+'为组长吗?',function(){
   	
   Public.ajax(web_app.name + "/trainingClassStudentAction!assignLeader.ajax",
   {staffName:staffName,trainingStudentId:trainingStudentId,trainingStudentGroupId:trainingStudentGroupId}, 
   function () {
		reloadGrid();
	})
	});
}
function grouped() {
	var groupId = $("#trainingStudentGroup").val();
	var rows = gridManager.getSelectedRows();
	var addRows = [], addRow;
	$.each(rows, function (i, o) {
		addRow = {};
		addRow['classStudentId'] = o["classStudentId"];
		addRow["trainingGroupId"] = groupId;
		addRows.push(addRow);
	});
	Public.ajax(web_app.name + "/trainingClassStudentAction!saveGroup.ajax", {"groupedUsers": $.toJSON(addRows)}, function () {
		reloadGrid();
	})
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
//添加按钮 
function addHandler() {
    $("#toolbar_menuAdd").comboDialog({type:'hr',name:'personArchiveSelect',width:635,
        dataIndex:'archivesId',
        checkbox:true,onChoose:function(){
            var rows=this.getSelectedRows();
            var addRows = [], addRow;
            $.each(rows, function(i, o){
                addRow = {};
                addRow['trainingSpecialClassId']=$("#trainingSpecialClassId").val();
                addRow["archivesId"]=o["archivesId"];
                addRow["archivesName"] = o["staffName"];
                addRows.push(addRow);
            });
            Public.ajax(web_app.name+"/trainingClassStudentAction!insert.ajax", {trainingSpecialClassId:$("#trainingSpecialClassId").val(),users:$.toJSON(addRows)},function(retVal){
               reloadGrid();
            });
            return true;
        }});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'trainingClassStudentAction!delete.ajax',
		gridManager:gridManager,idFieldName:'classStudentId',
		onCheck:function(data){
		 },
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingClassStudentAction!update.ajax',
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

//批量导入培训员工
function saveImpHandler(){
	var serialId=$("#trainingSpecialClassId").val();
	if(!serialId){
		Public.tip('未找到对应班级id！');
		return false;
	}
	UICtrl.showAssignCodeImpDialog({title:'导入培训员工数据',serialId:serialId,templetCode:'impTrainingClassStudents'});
}

