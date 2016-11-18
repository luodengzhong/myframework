var gridManager = null,addAttentionManager = null, refreshFlag = false,owningObjectId = 0,selectTemplatePlanDialog, lastSelectedId = 0,lastTemplateSelectedId = 0,critical;
var editDialogManager=null,parentTaskId = null;
$(document).ready(function() {	
	initTab();	
	initializeGrid();
	initializeUI();
	initFileUpInput();
});

function initializeUI(){
	owningObjectId =  $('#owningObjectId').val();
	critical =  $('#critical').val();
	parentTaskId =   $('#relevanceTaskId').val();
	$('#planAuditFileList').fileList();
	var more=$('#toolbar_menuAdd').contextMenu({
		width:"100px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=more.offset(),height=more.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"新增同级",icon:'add',handler:function(){
				var row = gridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				addHandler(row.parentTaskId);
			}},
			{name:"新增子级",icon:'addchild',handler:function(){
				var row = gridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				addHandler(row.taskId);
			}},
			{name:"模板导入",icon:'download',handler:function(){
				var row = gridManager.getSelectedRow();
				var localparentTaskId=row?row.taskId:'';
				localparentTaskId = localparentTaskId?localparentTaskId:parentTaskId;
				selectTemplatePlanHandler(localparentTaskId);
			}}/*,
			{name:"外部导入",icon:'getworld',handler:openBrowse}*/
		],
		onSelect:function(){
			this._hideMenu();
		}
	});
	$('#taskKindName').treebox({
    	treeLeafOnly: true, name: 'taskKind',width:200,height:230,
    	beforeChange:function(data){
    		if(data.nodeType=='f'){
    			return false;
    		}
    		return true;
    	},
    	onChange:function(v,d){
    		$('#taskLevel').combox('setValue',d.taskLevel);
    		var subject=$('#subject').val();
    		if(subject==''){
    			$('#subject').val([$('#personMemberName').val(),'制定',d.name].join(''));
    		}
    	},
    	back:{
    		text:'#taskKindName',
    		value:'#oaTaskKindId'
    	}
    });
    
    
}
//初始化表格
function initializeGrid() {
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
		planPreviousSetHandler:{id:'planPreviousSet',text:'计划设置', click:showPlanPreviousSetHandler, img:'exit.gif'}
		
	});
	gridManager = UICtrl.grid('#maingrid', {
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
		parms:{auditId:$('#planAuditId').val(),pagesize:'1000'},
		width : '100%',
		height : '100%',
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
			return !($('#planAuditId').val()=='');
		}
	});

	$('#toolbar_menuaddNewTask').find('span').uploadButton({
		filetype:['xlsx','xls'],
		afterUpload:function(data){
			reloadGrid();
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
			return params;//flag:'false' 不添加日期目录
//			return {bizCode:'landRecommendationPicture',flag:'false'};
		}
	});
	initFileUpInput();
}

function initAddAttentionGrid(){
	addAttentionManager = UICtrl.grid('#addAttentiongrid', {
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
		url: web_app.name+'/planSetAction!queryCollectionByQuote.ajax',
		parms:{auditId:$('#planAuditId').val(),pagesize:'1000'},
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'collectionId',
		sortOrder:'asc',
//		toolbar: toolbarOptions,
		fixedCellHeight : true,
		usePager:false,
	/*	tree: {
            columnName: 'taskName',
            idField: 'taskId',
            parentIDField: 'parentTaskId'
        },*/
		selectRowButtonOnly : true,
		/*onDblClickRow : function(data, rowindex, rowobj) {
			if($('#toolbar_menuUpdate').length>0){//存在编辑按钮
				updateHandler(data.taskId);
			}else{
				viewHandler(data.taskId);
			}
		},*/
		onLoadData :function(){
			return !($('#planAuditId').val()=='');
		}
	});

}

function initTab() { 
	var businessId = $("#businessId").val();
	var businessCode = $("#businessCode").val();
	if(businessId == -99 &&businessCode == -99){
//        $("#paySituation").show(); 
	    $('#tabPage').tab().bind('click', function (e) {
	        var $clicked = $(e.target || e.srcElement);
	        if ($clicked.is('li')) {
	            var divid = $clicked.attr('divid');
	            var div = $('#' + divid);
	            $.each(['mainGridTab', 'addAttentionTab'], function (i, o) {
	                $('#' + o).hide();
	            });
	            div.show();
	            if (divid == 'mainGridTab' && !gridManager) {
	            	initializeGrid();
	            }
	            if (divid == 'addAttentionTab' && !addAttentionManager) {
	            	initAddAttentionGrid();
	            }
	        }
	    });
	    
	}
}

function getId() {
	return $("#planAuditId").val() || 0;
}

function setId(value){
	$("#planAuditId").val(value);
	gridManager.options.parms['auditId'] =value;
	$('#planAuditFileList').fileList({bizId:value});
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
function addHandler(parentTaskId) {
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
	parentTaskId=parentTaskId?parentTaskId:'';
	showAddDialog("/planAuditAction!showInsertPlanAuditDetail.do",{auditId:$('#planAuditId').val(),parentTaskId:parentTaskId,taskLevel:$('#taskLevel').val(),owningObjectId:owningObjectId,critical:critical ,managerType:$('#managerType').val() ,taskKindId:$('#oataskKindId').val() });
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
	var taskId=row.taskId;
	showEditDialog("/planAuditAction!showCopyNewtDetail.do",{auditId:$('#planAuditId').val(),taskId:taskId});
}
//打开编辑对话框
function showAddDialog(action,param){
	editDialogManager=UICtrl.showFrameDialog({
		url :web_app.name + action,
		param : param,
		title : "新建计划",
		width :900,
		height:getDefaultDialogHeight()-20,
		cancelVal: '关闭',
		button: addedButton,
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
			reloadGrid();
		}
	});
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
			reloadGrid();
		}
	});
}
var addedButton = [{
	id : 'saveInsert',
	name : '保存新增',
	callback : function(){
		var savenewHandler = this.iframe.contentWindow.savenewHandler;
		if($.isFunction(savenewHandler)){
			savenewHandler.call(this,$('#relevanceTaskId').val());
		}
		return false;
	}
}];

//打开人员选择对话框
function showSelectOrgDialog(options){
	//打开多层窗口都使用遮罩层时使用
	options['parent']=editDialogManager;
	options['closeHandler']=function(){
		editDialogManager.focus();
	};
	OpmUtil.showSelectOrgDialog(options);
}
//打开管理者(下游评价人)选择框
function showManagerDialog(options){
	options['parent']=editDialogManager;
	options['close']=function(){
		editDialogManager.focus();
	};
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
			reloadGrid();
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
	UICtrl.confirm('确定要执行'+(flag?'升级':'降级')+'操作吗?',function(){
		Public.ajax(web_app.name + '/planAuditAction!updateGradeTask.ajax',
			{taskId:row.taskId,flag:flag,sequence:sequence,parentTaskId:parentTaskId,auditId:$('#planAuditId').val()},
			function(){
				reloadGrid();
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
	Public.ajax(web_app.name + '/planAuditAction!updateSequenceTask.ajax',
		{taskId:row.taskId,flag:flag,sequence:sequence,parentTaskId:parentTaskId,auditId:$('#planAuditId').val()},
		function(){
			reloadGrid();
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

function doSelect(parentId) {
  var localparentTaskId = parentId?parentId:parentTaskId?parentTaskId:'';
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
  params.auditId=$('#planAuditId').val();
  params.parentTaskId=localparentTaskId;
  params.critical = critical;
  params.managerType = $('#managerType').val();
  params.taskKindId = $('#oataskKindId').val();
  params.owningObjectId=owningObjectId?owningObjectId:'';
  Public.ajax("planAuditAction!savePlanAuditDetailByTemplatePlan.ajax", params, function (data) {
      selectTemplatePlanDialog.hide();
	  reloadGrid();
  });
}


//计划设置按钮 打开新页面设置成果以及指引文档
function showPlanPreviousSetHandler(){
	var auditId = $("#planAuditId").val();
	if (!auditId) {Public.tip('请先执行保存操作!'); return; }
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择计划数据！'); return; }

	var auditId = $("#planAuditId").val();
	var taskId=row.taskId;
	 
	var url=web_app.name + '/planAuditAction!showPlanPreviousSet.do?auditId='+auditId+'&taskId='+taskId+'&owningObjectId='+owningObjectId;
	parent.addTabItem({ tabid: 'taskPlanSet', text: '任务设置', url:url});
}

//文件导入绑定事件
function initFileUpInput(){
	$('#upload').on('change',changeFileInput);
	setTimeout(function(){
		$('#planAuditFileList').fileList('enable');
	},0);
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
	var _planAuditId = $("#planAuditId").val()||0;
	var _taskKindId = $('#oataskKindId').val();
	var _managerType = $('#managerType').val();
	var _planTaskId = $('#relevanceTaskId').val();
	var params = $("#submitForm").formToJSON();
	$.ajaxFileUpload({
		//url : 'biz/oa/task/PlanAuditFileUp.jsp', 
		url : 'planAuditAction!getProjectFile.do?owningObjectId=' + 
			_owningObjectId+"&critical="+_critical+"&planAuditId="+_planAuditId+"&taskKindId="+_taskKindId+"&managerType="+_managerType+"&planTaskId="+_planTaskId,
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
			reloadGrid();
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

function openPlanSource(){
	var businessUrl=$('#businessUrl').getValue();	
	var url=web_app.name + '/'+businessUrl;
	parent.parent.addTabItem({ tabid: 'viewTaskSource', text: '任务来源源单据', url:url});	
}