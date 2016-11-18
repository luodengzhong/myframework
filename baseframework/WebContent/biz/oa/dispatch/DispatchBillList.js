var gridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 230,heightDiff : -5});
	Public.ajax(web_app.name + '/dispatchManagerAction!queryDispatchKind.ajax', {}, function(data){
		$.each(data,function(i,o){
			var nodeKind=o['nodeKind'];
			if(nodeKind=='kind'){
				o['icon']=web_app.name + "/themes/default/images/icons/icon_download.gif";
			}
		});
		UICtrl.tree('#maintree',{
			data:data,
			textFieldName: 'name',
			parentIDFieldName: 'parentId',
			nodeWidth: 220,
			delay:function(data){//默认只展开1级
				return data['level']>1;
			},
			onClick: function(node){
				var data=node.data,nodeKind=data['nodeKind'];
				if(nodeKind=='kind'){
					var dispatchKindId=data.id,dispatchKindName=data.name;
					$('#dispatchKindId').val(dispatchKindId);
					var html='<font style="color:Tomato;font-size:13px;">['+dispatchKindName+']</font>文件列表';
					$('.l-layout-center .l-layout-header').html(html);
					UICtrl.gridSearch(gridManager,{dispatchKindId:dispatchKindId});
				}
			}
		});
	});
	
	
	/*$('#divTreeArea').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a')){
			var dispatchKindId=$clicked.attr('id');
			var dispatchKindName=$.trim($clicked.text());
			$('#dispatchKindId').val(dispatchKindId);
			var html='<font style="color:Tomato;font-size:13px;">['+dispatchKindName+']</font>文件列表';
			$('.l-layout-center .l-layout-header').html(html);
			UICtrl.gridSearch(gridManager,{dispatchKindId:dispatchKindId});
			$('div.divChoose',this).removeClass('divChoose');
			$clicked.parent().addClass('divChoose');
		}
	});*/
	//默认选中低一个类别
	setTimeout(function(){
		var kinds=$('a.GridStyle',$('#divTreeArea'));
		if(kinds.length>0){
			$(kinds[0]).trigger('click');
		}
	},0);
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler:{id:'Add',text:'文件取号',img:'page_new.gif',click:addHandler},
		updateHandler: function(){
			updateHandler();
		},
	    enableHandler:{id:'Enable',text:'启用',img:'page_tick.gif',click:enableHandler},
	    disableHandler:{id:'Disable',text:'作废',img:'page_cross.gif',click:disableHandler},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "序号", name: "sequence", width: 40, minWidth:30, type: "string", align: "center",frozen: true },	
		{ display: "文号", name: "dispatchNo", width: 160, minWidth: 60, type: "string", align: "left",frozen: true },		   
		{ display: "标题", name: "title", width: 300, minWidth: 60, type: "string", align: "left",
			render: function (item) {
				var bizId=item.bizId;
				if(Public.isBlank(bizId)){
					return ['<div title="',item.title,'">',item.title,'</div>'].join('');
				}else{
					return ['<a title="',item.title,'" class="GridStyle" href="javascript:openWindow(\'',item.bizUrl,'\',\'',item.title,'\',',item.bizId,',\'',item.fullId,'\');">',item.title,'</a>'].join('');
				}
			}
		},
		{ display: "状态", name: "statusTextView", width: 50, minWidth: 30, type: "string", align: "left",
			render: function (item) {
				var status=item.status,color='red';
				color=status==1?'green':'red';
				return ['<font color="',color,'">',item.statusTextView,'</font>'].join('');
			}
		},
		{ display: "单位", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "岗位", name: "positionName", width: 60, minWidth: 60, type: "string", align: "left" },		 
		{ display: "取号人", name: "personMemberName", width: 60, minWidth: 60, type: "string", align: "left" },	
		{ display: "创建时间", name: "createDate", width: 80, minWidth: 60, type: "datetime", align: "left" },		   
		{ display: "文件存放处", name: "depositary", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "备注", name: "remark", width: 120, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/dispatchManagerAction!slicedQueryDispatchBillRelevance.ajax',
		parms:{dispatchKindId:$('#dispatchKindId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'dispatchBillRelevanceId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#dispatchKindId').val()=='');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.dispatchBillRelevanceId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	param['sequencegt']='';
	param['sequencelt']='';
	param['sequenceeq']='';
	var sequenceSymbol=param['sequenceSymbol'];
	if(sequenceSymbol!=''){
		var sequence=param['sequence'];
		if(sequence!=''){
			param['sequence'+sequenceSymbol]=sequence;
		}
	}
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

function openWindow(url,title,bizId,fullId){
	Public.authenticationManageType('dispatchViewManage',fullId,function(flag){
		if(flag){
			parent.addTabItem({ tabid: 'dispatchBill'+bizId, text:title, url:web_app.name+'/'+url});
		}else{
			Public.errorTip('您没有查看权限!');
		}
	});
}

function addHandler(){
	var dispatchKindId=$('#dispatchKindId').val();
	if(dispatchKindId==''){
		Public.tip('请选择文件号类别！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		title:'文件取号',
		url: web_app.name + '/dispatchManagerAction!forwardDispatchBillDetail.load',
		width:650,
		ok: save
	});
}

function updateHandler(dispatchBillRelevanceId){
	if(!dispatchBillRelevanceId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		dispatchBillRelevanceId=row.dispatchBillRelevanceId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/dispatchManagerAction!loadDispatchBillDetail.load', 
		title:'编辑文件信息',
		param:{dispatchBillRelevanceId:dispatchBillRelevanceId},
		width:650,
		init:function(){
			var tr=$('#showDispatchNoTr').show();
			if(!$('#toolbar_menuDelete').length){//不存在编辑按钮
				var dispatchNo=$('input[name="dispatchNo"]',tr);
				var sequence=$('input[name="sequence"]',tr);
				UICtrl.disable(dispatchNo);
				UICtrl.disable(sequence);
			}
		},
		ok: update,
		button: [{
			id : 'viewItem',
			name : '重新取号',
			callback:function(){
				var dispatchBillRelevanceId=$('#dispatchBillRelevanceId').val();
				var bizId=$('#detailBizId').val();
				var title=$('#detailTitle').val();
				var bizUrl=$('#detailBizUrl').val();
				var status=$('#detailStatus').val();
				if(status!=1){
					Public.tip('已作废的单据不能重新取号！'); 
					return false;
				}
				var ajaxDialog=this;
				UICtrl.getDispatchNo({bizId:bizId,bizUrl:bizUrl,title:title,
					isAgain:true,parent:window['ajaxDialog'],
					callback:function(param){
						var _self=this;
						//禁用当前单据
						DataUtil.updateById({ action: 'dispatchManagerAction!updateDispatchNoStatus.ajax',
							gridManager: gridManager,idFieldName:'dispatchBillRelevanceId',param:{status:-1},
							onSuccess:function(){
								reloadGrid();	
								_self.close();//关闭取号对话框
								ajaxDialog.close();//关闭编辑对话框
							}
						});	
					}
			    });
				return false;
			}
		}]
	});
}

function save(){
	var dispatchKindId=$('#dispatchKindId').val();
	if(dispatchKindId==''){
		Public.tip('请选择文件号类别！'); 
		return;
	}
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/dispatchManagerAction!saveDispatchNoByKind.ajax',
		param:{dispatchKindId:dispatchKindId},
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}
function update(){
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/dispatchManagerAction!updateDispatchBillRelevance.ajax',
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}
//启用
function enableHandler(){
	DataUtil.updateById({ action: 'dispatchManagerAction!updateDispatchNoStatus.ajax',
		gridManager: gridManager,idFieldName:'dispatchBillRelevanceId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'dispatchManagerAction!updateDispatchNoStatus.ajax',
		gridManager: gridManager,idFieldName:'dispatchBillRelevanceId',param:{status:-1},
		message: '确实要作废选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var dispatchBillRelevanceId=row.dispatchBillRelevanceId;
	UICtrl.confirm( '您确定删除选中数据吗?', function() {
		Public.ajax(web_app.name + '/dispatchManagerAction!deleteDispatchBillRelevance.ajax', {dispatchBillRelevanceId:dispatchBillRelevanceId}, function(data) {
				reloadGrid();	
		});
	});
}