var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	$('html').addClass('html-body-overflow');
	$("#topToolbar").toolBar({
		items : [ 
		  {name : '导入数据', id : "importdata",icon:'add'},
		  {line : true}, 
		  {name : '导出模板', id : "exporttemplet",icon:'edit',event:exportExcel},
		  {line : true},  
		  {name : '导出失败数据',id : "exportfail",icon:'back',event:function(){
			  doExpImpResult(false);
		  }},
		  {line : true},
		  {name : '删除临时数据',id : "deleteTempData",icon:'delete',event:function(){
		  	 UICtrl.confirm('您确定执行该操作吗?',function(){
				  Public.ajax(web_app.name+'/impExcelAction!deleteTempData.ajax',{templId:$('#templId').val(),serialId:$('#serialId').val()},function(data){
				  		query();//刷新列表
				  });
			  });
		  }},
		  {line : true}
	   ]
	});
    $('#importdata').find('span').uploadButton({
	   param:function(){
      		var templId= $('#templId').val();
      		var serialId= $('#serialId').val();
      		if(templId==''){
      			Public.tip('请选择模板!');
      			return false;
      		}
      		return {templId:templId,serialId:serialId};
      	},
    	url:web_app.name+'/impExcelAction!upload.ajax',
    	afterUpload:function(){
    		query();
    		refreshFlag=true;
    	}
     });
}

//导出模板
function exportExcel(){
	var templId= $('#templId').val();
	var templetName=$('#templetName').val();
	if(templId==''){
		Public.tip('请选择数据模板！');
		return;
	}
	var url=web_app.name+'/impExcelAction!doExpTempl.ajax';
	Public.ajax(url,{id:templId},function(data){
		$('#imp_main_iframe_id').get(0).src=web_app.name+'/attachmentAction!downFileByTmpdir.ajax?file='+data+'&fileName='+encodeURI(encodeURI(templetName));
	});
}
//动态加载导入表格
function initializeGrid(){
	var url=web_app.name+'/impExcelAction!queryExpTempletDetail.ajax';
	var templ_id=$('#templId').val();
	Public.ajax(url,{templetId:templ_id},function(data){
		var rows=data.Rows,colModel=[];//组合表头数据
		$.each(rows,function(i,o){
			colModel.push({display: o['cellColName'], name : o['columnName'], width :100, align: 'left'});
		});
		colModel.push({display:'状态', name :'statusTextView', width :60, align: 'left'});
		colModel.push({display:'备注', name :'message', width :120, align: 'left'});
		initGrid(colModel);
	});
}
function initGrid(columns){
	var templ_id=$('#templId').val();
	var serialId=$('#serialId').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/impExcelAction!slicedResultQuery.ajax',
		parms:{templId:templ_id,serialId:serialId},//查询导入失败数据
		pageSize:20,
		width:'99%',
		height:'345',
		headerRowHeight : 25,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}
function query(){
	if(gridManager){
		UICtrl.gridSearch(gridManager, {});
	}
}
//导出失败数据
function doExpImpResult(flag){
	if(gridManager){
		UICtrl.gridExport(gridManager,{exportType:'all',fileName:'导入失败数据',status:2});
	}else{
		alert('未执行查询无法导出！');
	}
}
function getRefreshFlag(){
	return refreshFlag;
}