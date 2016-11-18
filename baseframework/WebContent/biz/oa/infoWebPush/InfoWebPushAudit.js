var gridManager = null, refreshFlag = false,manageType='InfoWebPushManage';
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
		manageType:manageType,
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
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('申请列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>申请列表');
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
		viewHandler:function(){
			viewHandler();
		},
		updateHandler:updateHandler,
		saveSortIDHandler:{id:'SaveID',text:'保存优先集',img:'save.gif',click:saveSortIDHandler},
		enableHandler: enableHandler,
		disableHandler: disableHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "标题", name: "subject", width: 250, minWidth: 60, type: "string", align: "left" },	
		{ display: "状态", name: "isUsed", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.isUsed);
			}
		},
		{ display: "预览信息", name: "test", width: 50, minWidth: 30, type: "string", align: "left",
             render: function (item) { 
					return '<a href="##" class="GridStyle" onclick="previewInfo('+item.infoPromulgateId+')">预览</a>';
			}
        },
        { display: "信息单号", name: "infoBillCode", width: 100, minWidth: 60, type: "string", align: "left"},
		{ display: "信息状态", name: "infoStatusTextView", width: 60, minWidth: 60, type: "string", align: "left"},
		{ display: "开始时间", name: "effectiveTime", width: 90, minWidth: 60, type: "date", align: "left" },
		{ display: "结束时间", name: "invalidTime", width: 90, minWidth: 60, type: "date", align: "left" },
		{ display: "优先级", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'webPushAuditId');
			}
		},
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/infoWebPushAuditAction!slicedQuery.ajax',
		manageType:manageType,
		parms:{status:3},
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
		checkbox:true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.webPushAuditId);
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

function viewHandler(webPushAuditId){
	if(!webPushAuditId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		webPushAuditId=row.webPushAuditId;
	}
	var url=web_app.name + '/infoWebPushAuditAction!showUpdate.job?bizId='+webPushAuditId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'infoWebPush'+webPushAuditId, text: '查看弹屏申请', url:url});
}

function updateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var webPushAuditId=row.webPushAuditId;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/infoWebPushAuditAction!doUpdate.load', 
		title:'编辑类别',
		param:{webPushAuditId : webPushAuditId},
		width:700,
		init:function(){
			initQueryInfoPushRange();
		},
		ok: function(){
			var _self=this;
			$('#submitForm').ajaxSubmit({url: web_app.name + '/infoWebPushAuditAction!update.ajax',
				param:{detailData:encodeURI($.toJSON(personArray))},
				success : function(data) {
					_self.close();
					reloadGrid();
				}
			});
		}
	});
}
//弹屏范围选择
var personArray=new Array();
function initQueryInfoPushRange(){
	var id=$('#webPushAuditId').val();
	if(id==''){
		return;
	}
	clearChooseArray();
	Public.ajax(web_app.name + '/infoWebPushAuditAction!queryInfoPushRange.ajax', {webPushAuditId:id}, function(data){
		$.each(data,function(i,d){
			personArray.push(d);
		});
		initShowDivText();
	});
	$('#modifInfoSubject').searchbox({type:'oa',name:'queryInfoPromulgate',back:{infoPromulgateId:'#modifInfoPromulgateId',billCode:'#modifInfoBillCode',subject:'#modifInfoSubject'}});
}
function showChooseOrgDialog(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm,system';
	var options = { params: selectOrgParams,title : "选择组织",parent:window['ajaxDialog'],
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			//清空数组
			personArray.splice(0,personArray.length);
			var flag=true
			$.each(data,function(i,o){
				o['orgUnitId']=o['id'];
				o['orgUnitName']=o['name'];
				o['kindId']='infoPushRange';
				personArray.push(o);
			});
			if(!flag) return false;
			initShowDivText();
			this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}
function initShowDivText(){
	var showDiv=$('#pushRangeShowDiv');
	var html=new Array(),fullId=null;
	$.each(personArray,function(i,o){
		html.push('<span title="',o['fullName'],'">');
		html.push(o['name']);
		html.push('</span">;');
	});
	showDiv.html(html.join(''));
}
//清空已选择列表
function clearChooseArray(){
	$('#pushRangeShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}
function saveSortIDHandler(){
	var action = "infoWebPushAuditAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'webPushAuditId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'infoWebPushAuditAction!updateIsUsed.ajax',
		gridManager: gridManager,idFieldName:'webPushAuditId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'infoWebPushAuditAction!updateIsUsed.ajax',
		gridManager: gridManager,idFieldName:'webPushAuditId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

//预览
function previewInfo(id){
	var url=web_app.name + '/oaInfoAction!toHandleInfoPromulgate.job?useDefaultHandler=0&isReadOnly=true&infoPromulgateId='+id;
	parent.addTabItem({ tabid: 'previewInfo'+id, text: '信息预览', url:url});
}