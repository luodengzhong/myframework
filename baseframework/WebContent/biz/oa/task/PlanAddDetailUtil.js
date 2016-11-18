var gridManager = null, refreshFlag = false,owningObjectId = 0,selectTemplatePlanDialog, lastSelectedId = 0,lastTemplateSelectedId = 0,critical = 0,planMainId = 0;
var editDialogManager=null;
function initializeAddUI(){
	owningObjectId =  $('#owningObjectId').val();
	critical =  $('#critical').val();
	var more=$('#toolbar_menuAdd').contextMenu({
		width:"100px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=more.offset(),height=more.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"新增同级",icon:'next',handler:function(){
				var row = gridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				addHandler(row.parentTaskId);
			}},
			{name:"新增子级",icon:'paste',handler:function(){
				var row = gridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				addHandler(row.taskId);
			}},
			{name:"模板导入",icon:'next',handler:function(){
				var row = gridManager.getSelectedRow();
				var parentTaskId=row?row.taskId:'';
				selectTemplatePlanHandler(parentTaskId);
			}}/*,
			{name:"外部导入",icon:'paste',handler:openBrowse}*/
		],
		onSelect:function(){
			this._hideMenu();
		}
	});
}
//初始化表格
function initializeAddGrid() {
	planMainId = getId();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler:function(){
			viewHandler();
		},
		addHandler: function(){
			addHandler();
		}, 
		addNewTask:{id:'addNewTask',text:'导入新增',img:'icon_package_get.gif'},
		updateHandler: function(){
			updateHandler();
		},
		saveCopyNew:{id:'saveCopyNew',text:'复制新增',img:'copy.gif',click:function(){
			saveCopyNew();
		}},
		deleteHandler: deleteHandler,
		saveUp:{id:'saveUp',text:'上移',img:'page_up.gif',click:function(){
			updateSequenceTask(true);
		}},
		saveDown:{id:'saveDown',text:'下移',img:'page_down.gif',click:function(){
			updateSequenceTask(false);
		}},
		saveUpGrade:{id:'saveUpGrade',text:'升级',img:'page_prev.gif',click:function(){
			updateGradeTask(true);
		}},
		saveDownGrade:{id:'saveDownGrade',text:'降级',img:'page_next.gif',click:function(){
			updateGradeTask(false);
		}},
		planPreviousSetHandler:{id:'planPreviousSet',text:'计划设置', click:showPlanPreviousSetHandler, img:'page_edit.gif'}
		
	});
	var pageType =  $('#pageType').val();
	var pageHight = '160';
	if(pageType&& 2== pageType){
		pageHight = '97.5%';
	}	
	gridManager = UICtrl.grid('#addmaingrid', {
		columns: [	     
			{ display: "序号", name: "myRownum", width:40, minWidth: 40, type: "string", align: "center"},
			{ display: "计划名称", name: "taskName", width: 350, minWidth: 60, type: "string", align: "left"},		 
			{ display: "计划级别", name: "taskLevelTextView", width: 60, minWidth: 60, type: "string", align: "left" },	
			{ display: "计划周期", name: "planningCycleTextView", width: 70, minWidth: 60, type: "string", align: "left" },	
			{ display: "计划类别", name: "taskKindName", width: 120, minWidth: 60, type: "string", align: "left" },		   
			{ display: "开始时间", name: "startDate", width: 100, minWidth: 60, type: "string", align: "left"},		   
			{ display: "结束时间", name: "finishDate", width: 100, minWidth: 60, type: "string", align: "left"},
			{ display: "责任人", name: "ownerName", width:100, minWidth: 60, type: "string", align: "left" },		 
			{ display: "责任部门", name: "dutyDeptName", width: 120, minWidth: 60, type: "string", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/planAuditAction!slicedQueryPlanAuditDetail.ajax',
		parms:{auditId:planMainId,pagesize:'1000'},//计划调整，计划审批，使用同一种查询途径和存储方式，
		width : '99.8%',
		height : pageHight,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		usePager:false,
		tree: {
            columnName: 'taskName',
            idField: 'taskId',
            parentIDField: 'parentTaskId'
        },
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			if($('#toolbar_menuUpdate').length>0){//存在编辑按钮
				updateHandler(data.taskId);
			}else{
				viewHandler(data.taskId);
			}
		},
		onLoadData :function(){
			planMainId = getId();
			return !(planMainId=='');
		}
	});
	$('#toolbar_menuaddNewTask').find('span').uploadButton({
		filetype:['xlsx','xls'],
		afterUpload:function(data){
			reloadAddGrid();
		},
		backurl:'planAuditAction!getProjectFile.ajax',
		beforChoose:function(){		
			if(!getId()){
				Public.tip("请先执行保存操作!");
				return false;
			}
		},
		param:function(){	
			if(!getId()){
				Public.tip("请先执行保存操作!");
				return false;
			}
			if(!parentTaskId){
				parentTaskId = $('#relevanceTaskId').val();
				if(!parentTaskId){
					parentTaskId = 0;
				}
			}
			var owningObjectId = $("#owningObjectId").val()||0;  
			var params = $("#submitForm").formToJSON();
			params.owningObjectId = owningObjectId; 
			params.planTaskId = $('#relevanceTaskId').val();	
			params.planAuditId =getId()||0;					
			return params;//flag:'false' 不添加日期目录
//			return {bizCode:'landRecommendationPicture',flag:'false'};
		}
	});
	initFileUpInput();
	if(pageType&& 2== pageType){
	    UICtrl.setSearchAreaToggle(gridManager);
	}	
}



//刷新表格
function reloadAddGrid() {
	planMainId = getId();
	gridManager.options.parms['auditId'] = planMainId;
	gridManager.loadData();
} 

//添加按钮 
function addHandler(parentTaskId) {
	if(!getId()){
		Public.tip("请先执行保存操作!");
		return false;
	}
	
	if(!parentTaskId){
		parentTaskId = $('#parentTaskId').val();
		/*if(!parentTaskId){
			parentTaskId = $('#planTaskId').val();
			if(!parentTaskId){
				parentTaskId = 0;
			}
		}*/
	}
	planMainId = getId();
	parentTaskId=parentTaskId?parentTaskId:'';
	showEditDialog("/planAuditAction!showInsertPlanAuditDetail.do",{auditId:planMainId,parentTaskId:parentTaskId,taskLevel:$('#taskLevel').val(),owningObjectId:owningObjectId,critical:critical ,managerType:$('#managerType').val() });
}
//编辑按钮
function updateHandler(taskId){
	if(!taskId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		taskId=row.taskId;
	}
	showEditDialog("/planAuditAction!showUpdatePlanAuditDetail.do",{taskId:taskId});
}
//复制新增
function saveCopyNew(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	planMainId = getId();
	var taskId=row.taskId;
	showEditDialog("/planAuditAction!showCopyNewtDetail.do",{auditId:planMainId,taskId:taskId});
}
//打开编辑对话框
function showEditDialog(action,param){
	editDialogManager=UICtrl.showFrameDialog({
		url :web_app.name + action,
		param : param,
		title : "编辑计划",
		width :900,
		height:getDefaultDialogHeight()-20,
		cancelVal: '关闭',
		okVal: '保存',
		ok:function(){
			var saveHandler = this.iframe.contentWindow.saveHandler;
			if($.isFunction(saveHandler)){
				saveHandler.call(this,$('#relevanceTaskId').val());
			}
			return false;
		},
		cancel:true,
		close:function(){
			reloadAddGrid();
		}
	});
}
//打开人员选择对话框
function showSelectOrgDialog(options){
	//打开多层窗口都使用遮罩层时使用
	if(editDialogManager){
		options['parent']=editDialogManager;
		options['closeHandler']=function(){
			editDialogManager.focus();
		};
	}
	OpmUtil.showSelectOrgDialog(options);
}
//打开管理者(下游评价人)选择框
function showManagerDialog(options){
	if(editDialogManager){
		options['parent']=editDialogManager;
		options['close']=function(){
			editDialogManager.focus();
		};
	}
	UICtrl.showFrameDialog(options);
}
//查看
function viewHandler(taskId){
	if(!taskId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		taskId=row.taskId;
	}
	UICtrl.showFrameDialog({
		url :web_app.name + "/planAuditAction!showUpdatePlanAuditDetail.do?isReadOnly=true",
		param : {taskId:taskId},
		title : "查看计划",
		width :900,
		height:getDefaultDialogHeight()-20,
		cancelVal: '关闭',
		ok:false,
		cancel:true
	});
}
//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/planAuditAction!deletePlanAuditDetail.ajax', {taskId:row.taskId}, function(){
			reloadAddGrid();
		});
	});
}
//升级flag=true 降级 flag=false
function updateGradeTask(flag){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var taskId=row.taskId;
	var sequence=row.sequence;
	var parentTaskId=row.parentTaskId;
	if(flag&&Public.isBlank(parentTaskId)){//升级时判断是否存在父亲ID
		Public.tip('已是顶级任务不能升级！'); 
		return;
	}
	planMainId = getId();
	UICtrl.confirm('确定要执行'+(flag?'升级':'降级')+'操作吗?',function(){
		Public.ajax(web_app.name + '/planAuditAction!updateGradeTask.ajax',
			{taskId:row.taskId,flag:flag,sequence:sequence,parentTaskId:parentTaskId,auditId:planMainId},
			function(){
				reloadAddGrid();
			}
		);
	});
}
//上移flag=true 下移 flag=false
function updateSequenceTask(flag){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var taskId=row.taskId;
	var sequence=row.sequence;
	var parentTaskId=row.parentTaskId;
	planMainId = getId();
	Public.ajax(web_app.name + '/planAuditAction!updateSequenceTask.ajax',
		{taskId:row.taskId,flag:flag,sequence:sequence,parentTaskId:parentTaskId,auditId:planMainId},
		function(){
			reloadAddGrid();
		}
	);
}
/************选择模板计划树，导入计划***************/
//选择模板计划树，导入计划
function selectTemplatePlanHandler(parentTaskId) {
	if(!getId()){
		Public.tip("请先执行保存操作!");
		return false;
	}
  if (!selectTemplatePlanDialog) {
  	selectTemplatePlanDialog = UICtrl.showDialog({
          title: "导入计划根节点。",
          width: 350,
          content: '<div style="overflow-x: hidden; overflow-y: auto;margin-top:0px; width: 620px;height:250px;"><table style="width: 99%;vertical-align:top;"><tr><td style="vertical-align:top;">	<ul id="selectPlanTemplatetree"></ul></td><td style="vertical-align:top;">	<ul id="selectTemplatePlantree"></ul></td></tr></table></div>',
          init: function () {
              $("#orgTree").ligerTree({ checkbox: false });
              $('#selectPlanTemplatetree').commonTree({
          		loadTreesAction : "/templateAction!queryPlanTemplateByParent.ajax",
          		idFieldName: 'planTemplateId',
                  parentIDFieldName: "parentId",
                  textFieldName: "name",
          		onClick : function(data) {
          			if (data && lastTemplateSelectedId != data.planTemplateId) {
          				lastTemplateSelectedId = data.planTemplateId;
          				lastSelectedId = 0;
          				Public.ajax(web_app.name + "/templateAction!queryTemplatePlanByParent.ajax", {
								planTemplateId:lastTemplateSelectedId
							}, function (data) {
								treeManager = $("#selectTemplatePlantree").ligerTree({
							        data: data.Rows,
									idFieldName: 'templatePlanId',
							        parentIDFieldName: "parentId",
							        textFieldName: "name",
							        checkbox: false,
							        iconFieldName: "icon",
							        btnClickToToggleOnly: true,
							        nodeWidth: 180,
									getParam : function(){
										return {planTemplateId:lastTemplateSelectedId};
									},
									IsShowMenu : false
							    });
							}); 
          			}
          		},
          		IsShowMenu : false
          	});
              $('#selectTemplatePlantree').commonTree({
          		loadTreesAction : "/templateAction!queryTemplatePlanByParent.ajax",
          		idFieldName: 'templatePlanId',
                  parentIDFieldName: "parentId",
                  textFieldName: "name",
          		onClick : function(data) {
          			if (data && lastSelectedId != data.templatePlanId) {
          				lastSelectedId = data.templatePlanId;
          			}
          		},	
          		getParam : function(){
          			return {planTemplateId:lastTemplateSelectedId};
          		},
          		IsShowMenu : false
          	});/*
          	$("#maintree").commonTree('refresh',$('#planTemplateId').val());
          	lastTemplateSelectedId = $('#planTemplateId').val()*/
          },
          ok: function () {
        	  doSelect(parentTaskId);
          },
          close: function () {
              this.hide();
              return false;
          }
      });
  } else {
      $('#selectPlanTypetree').commonTree('refresh');
      selectTemplatePlanDialog.show().zindex();
  }
}

function doSelect(parentTaskId) {
  parentTaskId = parentTaskId?parentTaskId:'';
  var selectPlanNode = $('#selectTemplatePlantree').commonTree('getSelected');
  var selectTemplateNode = $('#selectPlanTemplatetree').commonTree('getSelected');
  var owningObjectId =  $('#owningObjectId').val();
  var params = {};
  if (!selectPlanNode||!selectPlanNode.templatePlanId) {
	  if (!selectTemplateNode||!selectTemplateNode.planTemplateId) {
	      Public.tip('请选择导入的模板或者模板计划！');
	      return false;
	  }
	  params.planTemplateId = $.toJSON(selectTemplateNode.planTemplateId);
  }else{
	  params.templatePlanId = $.toJSON(selectPlanNode.templatePlanId);
  }
  params.auditId=getId();
  params.parentTaskId=parentTaskId;
  params.critical = critical;
  params.managerType = $('#managerType').val();
  params.owningObjectId=owningObjectId?owningObjectId:'';
  Public.ajax("planAuditAction!savePlanAuditDetailByTemplatePlan.ajax", params, function (data) {
	  reloadAddGrid();
      selectTemplatePlanDialog.hide();
  });
}


//计划设置按钮 打开新页面设置成果以及指引文档
function showPlanPreviousSetHandler(){
	var auditId=getId();
	if (!auditId) {Public.tip('请先执行保存操作!'); return; }
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择计划数据！'); return; }

	var auditId = getId();
	var taskId=row.taskId;
	 
	var url=web_app.name + '/planAuditAction!showPlanPreviousSet.do?auditId='+auditId+'&taskId='+taskId+'&owningObjectId='+owningObjectId;
	parent.addTabItem({ tabid: 'taskPlanSet', text: '任务设置', url:url});
}

//文件导入绑定事件
function initFileUpInput(){
	$('#upload').on('change',changeFileInput);
}
//文件选择后处理
function changeFileInput(){
	var _fnm = $('#upload').val();
	var _length = _fnm.length;
	var _idx = _fnm.lastIndexOf(".");
	if(_idx!=-1&&_idx<_length){
		var _hz = _fnm.substring(_idx+1,_length);
		if(_hz.toLowerCase()!='mpp'&&_hz.toLowerCase()!='xls'&&_hz.toLowerCase()!='xlsx')
			fileUploadErr('所选文件格式不为Project或者excl文件，请重新选择！');
		else{
			fileUpLoad();
		}
	}else
		fileUploadErr('所选文件格式不为Project或者excl文件，请重新选择！');
}

function fileUpLoad() {
	var _owningObjectId = $("#owningObjectId").val()||0;
	var _critical = $("#critical").val()||0;
	var _planAuditId = getId()||0;
	var params = $("#submitForm").formToJSON();	
	$.ajaxFileUpload({
		//url : 'biz/oa/task/PlanAuditFileUp.jsp', 
		url : 'planAuditAction!getProjectFile.do?owningObjectId=' + 
			_owningObjectId+"&critical="+_critical+"&planAuditId="+_planAuditId,
		secureuri : false, 							// 是否需要安全协议，一般设置为false
		fileElementId : 'upload', 					// 文件上传域的ID，必须为upload，拦截器已过滤附件，只能用upload关联；
		dataType : 'text', 	
		data : params, 	
		success : function(data, status) 			// 服务器成功响应处理函数
		{

			var _len = data.length;
			var _idx = data.indexOf('Exception')
			/*vvar _json = data.substring(_idx,_len);
			ar _bakData = $.parseJSON(_json).data;
			var _json = data.substring(_idx,_len); 
			var _bakData = $.parseJSON(_json).data; 
			
			var _num = _bakData.length;
			for(_i=0;_i<_num;_i++)
				UICtrl.addGridRow(gridManager,_bakData[_i]);
			*/
			if(_idx== -1){
			reloadAddGrid();
			}else{
			alert(data);
			}
		
		},
		error : function(data, status, e)			// 服务器响应失败处理函数
		{
			alert(data);
		}
	});
	initFileUpInput();
}

// 文件选择错误处理
function fileUploadErr(_msg){
	UICtrl.alert(_msg,function(){
		var _newFile = '<input type="file" id="upload" '
			+'name="upload" style="display:none;"/>';
		$("#upload").replaceWith(_newFile);
		initFileUpInput();
	});
}

//绑定按钮文件选择框
function openBrowse() {
	if(!getId()){
		Public.tip("请先执行保存操作!");
		return false;
	}
	
	var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false;
	if(ie){
		document.getElementById("upload").click();
	} else {
		var evenClick = document.createEvent("MouseEvents");
		evenClick.initEvent("click", true, true);
		document.getElementById("upload").dispatchEvent(evenClick);
	}
} 
