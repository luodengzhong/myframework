
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var createPersonId = $("#curUserId").val();
	toolbarOptions = UICtrl.getDefaultToolbarOptions(
        { addHandler: function () {
            UICtrl.addGridRow(gridManager,
                { sequence: gridManager.getData().length + 1,
                    kindId: "chief", allowAdd: 1, allowSubtract: 1, allowAbort: 0, allowTransfer: 1, needTiming: 1
                });
        },
            saveHandler: updateTemplateHandler,
            deleteHandler: function () {
                DataUtil.delSelectedRows({ action: '/planTemplateAction!deletePlanTemplate.ajax',
                    gridManager: gridManager,idFieldName: 'planTemplateId',
                    onSuccess: function () {
                        gridManager.loadData();
                    }
                });
            }
            //configStep: { id: 'configStep', text: '配置', img: 'page_dynamic.gif', click: configStepHandler }
        });

	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "模板名称", name: "templateName", width: 100, minWidth: 60, type: "string", align: "left", 
			editor: { type: 'text', required: true}	
		},		 
		{ display: "模板描述", name: "templateDesc", width: 100, minWidth: 60, type: "string", align: "left", 
			editor: { type: 'text', required: false}	
		},	
		{ display: "功能名称", name: "functionName", width: 100, minWidth: 60, type: "string", align: "left" ,
			editor: { type: 'select', required: true,data: { type:"pt", name: "sysfunc",width:350,
				back:{
					id:"functionId",description:"functionName"
					}
			}}

		},		   
		{ display: "管理权限名称", name: "authorityName", width: 100, minWidth: 60, type: "string", align: "left" ,
			editor: { type: 'select', required: true,data: { type:"pt", name: "sysauth",width:350,
				back:{
					id:"authorityId",code:"authorityCode",name:"authorityName"
					}
			}}
		},
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" ,
			editor: { type: 'text',mask:'nn'}}		
		],		   
		
		dataAction : 'server',
		url: web_app.name+'/planTemplateAction!slicedQueryPlanTemplate.ajax',
		parms : {
			createPersonId : createPersonId
			},
		pageSize : 20,
		sortName:'sequence',
		sortOrder:'asc',
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
        rownumbers: true,
        checkbox: true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}


function updateTemplateHandler() {
    var handlerData = DataUtil.getGridData({ gridManager: gridManager });
    if (!handlerData) return false;
    Public.ajax(web_app.name + '/planTemplateAction!updatePlanTemplate.load',
        { data: encodeURI($.toJSON(handlerData)) },
        function () {
        	gridManager.loadData();
        }
    );
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
	UICtrl.showAjaxDialog({url: web_app.name + '/planTemplateAction!showInsertPlanTemplate.load', ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/planTemplateAction!showUpdatePlanTemplate.load', param:{}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/planTemplateAction!deletePlanTemplate.ajax', {}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'planTemplateAction!deletePlanTemplate.ajax',
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
	/*
	var id=$('#detailId').val();
	if(id!='') return update();
	*/
	$('#submitForm').ajaxSubmit({url: web_app.name + '/planTemplateAction!insertPlanTemplate.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/planTemplateAction!updatePlanTemplate.ajax',
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
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "planTemplateAction!updatePlanTemplateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'planTemplateAction!updatePlanTemplateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'planTemplateAction!updatePlanTemplateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
