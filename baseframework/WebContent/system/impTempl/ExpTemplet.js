var gridManager = null, refreshFlag = false,detailGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		kindId : CommonTreeKind.ExpTemplet,
		onClick : onFolderTreeNodeClick
	});
}

function  onFolderTreeNodeClick(data,folderId){
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.ExpTemplet){
		parentId="";
		html.push('模板列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>模板列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler,
		updateHandler:function (){
			updateHandler();
		}, 
		deleteHandler: deleteHandler,
		enableHandler:enableHandler,
		disableHandler:disableHandler,
		moveHandler:moveHandler,
		expTempletbtn:{id:'expTempletbtn',text:'导出模板',click:exportExcelHandler,img:'page_down.gif'}
     });
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "模板名称", name: "templetName", width: 200, minWidth: 60, type: "string", align: "left" },	
		{ display: "模板编码", name: "templetCode", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "表名称", name: "tableName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "存储过程名", name: "procedureName", width: 200, minWidth: 60, type: "string", align: "left" },
		{display: "模板状态", name: "sts", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return getStatusInfo(item.sts);
			}
		},
		{ display: "备注", name: "description", width: 300, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/impExcelAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		},
		onAfterShowData : function() {
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

function reloadDetailGrid(){
	detailGridManager.loadData();
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//添加按钮 
function addHandler() {
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		alert("请选择模板类型!");
		return false ;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/impExcelAction!showInsert.load',
		ok: insert, close: dialogClose,width:750,init:initDetailDialog,title:'新增模板'
	});
}

//初始化明细表
function initDetailDialog(doc){
	var templetId=$('#templetIdDetail').length>0?$('#templetIdDetail').val():'';
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
	       addHandler: function() {
				UICtrl.addGridRow(detailGridManager);
	       },
	       deleteHandler: function(){
				DataUtil.delSelectedRows({action:'impExcelAction!deleteTempletDetail.ajax',
					gridManager:detailGridManager,idFieldName:'templetCompId',
					onSuccess:function(){
						detailGridManager.loadData();
					}
				});
	          },
	        enableHandler: enableHandlerComp,
	  		disableHandler: disableHandlerComp
	      });
	
	detailGridManager=UICtrl.grid('#exptempletid',{
		columns:[
	        {display: 'EXCEL列名', name : 'cellColName', width :170, sortable : false, align: 'left',editor: { type: 'text',required:true}},
	        {display: 'EXCEL列号', name : 'cellColNbr', width : 120, sortable : false, align: 'center',editor: { type:'spinner',required:true,min:1,max:100,mask:'nnn'}},
	        {display: '中间表列名', name : 'columnName', width : 150, sortable : false, align: 'left',editor: { type: 'text',required:true,maxLength:30}},
	        {display: '列说明', name : 'columnDescription', width : 150, sortable : true, align: 'left',editor: { type: 'text'}},
	        { display: "状态", name: "sts", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.sts);
				} 
	         }
        ],
        parms : {
        	templetId : templetId
		},
        dataAction : 'server',
		url: web_app.name+'/impExcelAction!queryExpTempletDetailByTempletId.ajax',
		width : 721,
		sortName:'cellColNbr',
		sortOrder:'asc',
		height : '100%',
		heightDiff : -60,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		usePager: false,
		checkbox: true,
		fixedCellHeight: true,
		selectRowButtonOnly: true,
		autoAddRow:{status:0},
		onLoadData :function(){
			return !($('#templetIdDetail').val()=='');
		}});
}


//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/impExcelAction!showUpdate.load', 
		param:{id:id}, 
		init : initDetailDialog,
		ok: update,
		width:750,
		title:'修改模板',
		close: dialogClose});
	
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'impExcelAction!deleteTemplet.ajax',
		gridManager:gridManager,
		onCheck:function(data){
			if(parseInt(data.sts)!=0){
				Public.tip('模板'+data.templetName+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});

}

//新增保存
function insert() {
	var id=$('#templetIdDetail').val();
	if(id!='') return update();
	var detailData=DataUtil.getGridData({gridManager:detailGridManager});
	if(!detailData)  return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/impExcelAction!insertTemplet.ajax',
		param:{parentId:$('#treeParentId').val(),detailData:encodeURI($.toJSON(detailData))},
		success : function(id) {
			$('#templetIdDetail').val(id);
			detailGridManager.options.parms['templetId']=id;
			detailGridManager.loadData();
			refreshFlag = true;
		}
	});
}



//修改按钮状态
function intModifPageButton(){
	$('#doExpTemplButton').attr('disabled',false);
	$('#adddtlbutton').attr('disabled',false);
}

//编辑保存
function update(){
	var detailData=DataUtil.getGridData({gridManager:detailGridManager,idFieldName:'templetCompId'});
	if(!detailData) return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/impExcelAction!updateTemplet.ajax',
		param:{detailData:encodeURI($.toJSON(detailData))},
		success : function() {
			refreshFlag = true;
			detailGridManager.loadData();
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

//导出模板
function exportExcelHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据模板！'); return; }
	var templetName=row.templetName;
	var url=web_app.name+'/impExcelAction!doExpTempl.ajax';
	Public.ajax(url,{id:row.id},function(data){
		$('#imp_main_iframe_id').get(0).src=web_app.name+'/attachmentAction!downFileByTmpdir.ajax?file='+data+'&fileName='+encodeURI(encodeURI(templetName));
	});
}

function getStatusInfo(sts) {
    switch (parseInt(sts)) {
        case -1:
            return "<div class='No' title='禁用'/>";
            break;
        case 0:
            return "<div class='tmp' title='草稿'/>";
            break;
        case 1:
            return "<div class='Yes' title='启用'/>";
            break;
    }
}

//启用模板
function enableHandler(){
	DataUtil.updateById({ action: 'impExcelAction!updateTempletStatus.ajax',
		gridManager: gridManager, param:{sts:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

//禁用模板
function disableHandler(){
	DataUtil.updateById({ action: 'impExcelAction!updateTempletStatus.ajax',
		gridManager: gridManager, param:{sts:-1},
		message:'确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//移动
function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,kindId:CommonTreeKind.ExpTemplet,
		save:function(parentId){
			DataUtil.updateById({action:'impExcelAction!moveTemplet.ajax',
				gridManager:gridManager,param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}

//启用
function enableHandlerComp(){
	DataUtil.updateById({ action: 'impExcelAction!updateTempletCompStatus.ajax',
		gridManager: detailGridManager,idFieldName:'templetCompId', param:{sts:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadDetailGrid();	
		}
	});		
}
//禁用
function disableHandlerComp(){
	DataUtil.updateById({ action: 'impExcelAction!updateTempletCompStatus.ajax',
		gridManager: detailGridManager,idFieldName:'templetCompId',param:{sts:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadDetailGrid();	
		}
	});		
}
