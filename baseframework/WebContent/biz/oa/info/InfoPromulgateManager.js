var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'infoPromulgateManage',
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
		onClick : onFolderTreeNodeClick
	});
	$('#kindName').treebox({
		name:'infoKindTree',
		changeNodeIcon:function(node){
			if(Public.isBlank(node['hasChildren'])) return;
			var url=web_app.name + "/themes/default/images/org/";
			var hasChildren=node.hasChildren;
			url += hasChildren>0?'org.gif':'dataRole.gif';
			node['nodeIcon']=url;
		},
		back:{
			text:'#kindName',
			value:'#infoKindId'
		}
	});
	
	$('#toolbar_menuupdateBizTaskQuery').comboDialog({type:'sys',name:'bizTaskQuery',
		title:'任务处理人员',width:610,checkbox:true,dataIndex:'taskId',
		getParam:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return false; }
			return {bizId:data.infoPromulgateId};
		},
		onChoose:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return false; }
			var rows=this.getSelectedRows();
			var taskIds=[];
			$.each(rows, function(i, o){taskIds.push(o['taskId'])});
			Public.ajax(web_app.name + '/oaInfoAction!deleteBizTaskById.ajax', {infoPromulgateId:data.infoPromulgateId,taskIds:taskIds.join(',')}, function(){
			});
			return true;
	    },
	    dialogOptions:{
	    	okVal:'删除任务'
	    }
   });
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('信息列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>信息列表');
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
		updateInfo:{id:'updateInfo',text:'修改',img:'page_edit.gif',click:function(){
			managerHandler();
		}},
		updateFinalize:{id:'updateFinalize',text:'定稿信息修改',img:'page_link.gif',click:function(){
			updateFinalize();
		}},
		deleteHandler: function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var status=data.status;
			if(status!=0){
				Public.tip('该信息不是草稿状态，不能执行该操作!');
				return false;
			}
			UICtrl.confirm('确定删除该条信息吗?',function(){
				Public.ajax(web_app.name + '/oaInfoAction!deleteInfoPromulgate.ajax', {infoPromulgateId:data.infoPromulgateId}, function(){
					reloadGrid();
				});
			});
		},
		saveDisableInfo:{id:'disable',text:'作废',img:'page_cross.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var status=data.status;
			if(status!=1){
				Public.tip('该信息不是发布状态，不能执行该操作!');
				return false;
			}
			UICtrl.confirm('确定作废该条信息吗?',function(){
				Public.ajax(web_app.name + '/oaInfoAction!disableInfoPromulgate.ajax', {infoPromulgateId:data.infoPromulgateId}, function(){
					reloadGrid();
				});
			});
		}},
		viewReader:{id:'viewReader',text:'阅读情况',img:'page_find.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			showInfoReaderDialog(data.infoPromulgateId);
		}},
		viewFeedback:{id:'viewFeedback',text:'反馈情况',img:'page_html.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			showInfoFeedbackDialog(data.infoPromulgateId);
		}},
		viewFeedbackStat:{id:'viewFeedbackStat',text:'反馈结果统计',img:'page_php.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			UICtrl.showFrameDialog({
				url :web_app.name + "/oaInfoAction!toFeedBackStat.do",
				param : {
					infoPromulgateId : data.infoPromulgateId
				},
				title : "信息反馈结果统计",
				width :900,
				height:getDefaultDialogHeight(),
				cancelVal: '关闭',
				ok:false,
				cancel:true
			});
		}},
		infoPersonManage:{id:'infoPersonManage',text:'处理人维护',img:'page_user.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var status=data.status;
			if(status==-1){
				Public.tip('已作废的单据不能执行修改!');
				return false;
			}
			showInfoCommonHandlerDialog(data.infoPromulgateId);
		}},
		repetCreateTask:{id:'repetCreateTask',text:'重发任务',img:'page_tree.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var status=data.status;
			if(status!=1){
				Public.tip('单据没有发布,不能执行本操作!');
				return false;
			}
			UICtrl.confirm('确定重发任务吗?',function(){
				Public.ajax(web_app.name + '/oaInfoAction!saveinfoHandlerHistory.ajax', {infoPromulgateId:data.infoPromulgateId});
			});
		}},
		saveOverTask:{id:'saveOverTask',text:'结束处理任务',img:'page_security.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var status=data.status;
			if(status!=1){
				Public.tip('单据没有发布,不能执行本操作!');
				return false;
			}
			UICtrl.confirm('确定结束处理吗?',function(){
				Public.ajax(web_app.name + '/oaInfoAction!saveOverTask.ajax', {infoPromulgateId:data.infoPromulgateId});
			});
		}},
		updateBizTaskQuery:{id:'updateBizTaskQuery',text:'任务维护',img:'page_script.gif',click:function(){}},
		updateHandler:{id:'updateDispatchNo',text:'修改文件号',img:'page_edit.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			updateDispatchNo(data);
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "类型", name: "kindName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "主题", name: "subject", width: 300, minWidth: 60, type: "string", align: "left",frozen: true,
			render: function (item) { 
				return ['<div title="',item.subject,'">',item.subject,'</div>'].join('');
			}
		},
		{ display: "公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "优先级", name: "priorityTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "定稿", name: "isFinalizeTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "反馈", name: "hasFeedBackTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "主题词", name: "keywords", width: 140, minWidth: 60, type: "string", align: "left" },	
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "生效时间", name: "effectiveTime", width: 100, minWidth: 60, type: "date", align: "left" },	
		{ display: "失效时间", name: "invalidTime", width: 100, minWidth: 60, type: "date", align: "left" },	
		{ display: "最后修改时间", name: "lastUpdateTime", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "发送人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "发送人路径", name: "fullName", width: 200, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return ['<div title="',item.fullName,'">',item.fullName,'</div>'].join('');
			}
		},
		{ display: "接收人", name: "receiverName", width: 140, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
					return ['<div title="',item.receiverName,'">',item.receiverName,'</div>'].join('');
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/oaInfoAction!slicedQueryInfoPromulgateManage.ajax',
		manageType:'infoPromulgateManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			managerHandler(data.infoPromulgateId);
		}
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

function managerHandler(infoPromulgateId){
	if(!infoPromulgateId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		infoPromulgateId=row.infoPromulgateId;
	
	}
	var url=web_app.name + '/oaInfoAction!showUpdateInfoPromulgate.job?useDefaultHandler=0&infoPromulgateId='+infoPromulgateId;
	parent.addTabItem({ tabid: 'InfoPromulgateModif'+infoPromulgateId, text: '信息编辑', url:url});
}
//修改已定稿数据
function updateFinalize(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var infoPromulgateId=row.infoPromulgateId;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/oaInfoAction!forwardUpdateFinalizeInfo.load',
		param:{infoPromulgateId:infoPromulgateId},
		width:500,
		title: "修改信息",
		ok: function(){
			var _self=this;
			$('#updateFinalizeInfoForm').ajaxSubmit({url: web_app.name + '/oaInfoAction!updateFinalizeInfo.ajax',
				success : function() {
					_self.close();
					reloadGrid();
				}
			});
		}
	});
}
//修改发文号
function updateDispatchNo(data){
	var infoPromulgateId=data.infoPromulgateId;
	var dispatchNo=data.dispatchNo,dispatchSequence=data.dispatchSequence;
	var html=['<div class="ui-form">','<dl>'];
	html.push('<dt style="width:70px;">发文号&nbsp;:</dt>');
	html.push('<dd><input type="text" class="text" id="modifDispatchNo" maxlength="32" value="'+dispatchNo+'"/></dd>');
	html.push('</dl><dl>');
	html.push('<dt style="width:70px;">序号&nbsp;:</dt>');
	html.push('<dd><input type="text" class="text" id="modifDispatchSequence" maxlength="5" value="'+dispatchSequence+'"/></dd>');
	html.push('</dl></div>');
	UICtrl.showDialog({
            title: "修改发文号",
            top:100,
            width: 300,
            content:html.join(''),
            ok: function(){
            	var _self=this;
            	var modifDispatchNo=$('#modifDispatchNo').val();
            	Public.ajax(
            		web_app.name + '/oaInfoAction!updateInfoDispatchNoByManager.ajax', 
            		{infoPromulgateId:infoPromulgateId,dispatchNo:encodeURI(modifDispatchNo),dispatchSequence:$('#modifDispatchSequence').val()},
            		function(){
            			_self.close();
						reloadGrid();
            		}
            	);
            }
     });
}