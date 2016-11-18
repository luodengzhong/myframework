var gridManager = null, refreshFlag = false,temp_templ_id=null;
var imp_result_table_param={pageSize:20,width:'99%',height:'400',heightDiff : -5,headerRowHeight : 25,rowHeight : 25,fixedCellHeight : true,selectRowButtonOnly : true};//导入结果列表初始参数
var imp_result_table_url=web_app.name+'/impExcelAction!slicedResultQuery.ajax';//导入结果列表查询地址
var imp_log_query_manage_type='';//日志查询管理权限类型
$(document).ready(function() {
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	$('html').addClass('html-body-overflow-x');
	$("#topToolbar").toolBar({
		items : [ 
		  {name : '导入数据', id : "importdata",icon:'add'},
		  {line : true}, 
		  {name : '导出模板', id : "exporttemplet",icon:'edit',event:exportExcel},
		  {line : true},  
		  {name : '导出失败',id : "exportfail",icon:'back',event:function(){
			  doExpImpResult(false);
		  }},
		  {line : true},
		  {name : '导出成功',id : "exportsuccess",icon:'turn',event:function(){
			  doExpImpResult(true);
		  }},
		  {line : true} 
	   ]
	});
	$('#impResultTab').tab();//初始化选项卡
    $('#importdata').find('span').uploadButton({
	   param:function(){
      		var templId= $('#templId').val();
      		if(templId==''){
      			Public.tip('请选择模板!');
      			return false;
      		}
      		return {templId:templId};
      	},
    	url:web_app.name+'/impExcelAction!upload.ajax',
    	afterUpload:function(){
    		query($('#queryMainForm'));
    	}
      }
    );
    $('#chooseImptemplet').comboDialog({type:'sys',name:'impTemplet',dataIndex:'id',onChoose:function(){
    	var row=this.getSelectedRow();
    	var templId=row['id'],templetName=row['templetName'];
    	if($('#templId').val()!=templId){
    		$('#templId').val(templId);
    		$('#templetName').val(templetName);
    		//动态引入JS文件
    		impOperationJSFile(row['templetCode']);
    		query($('#queryMainForm'));
    	}
    	return true;
    }});
    $('#imp_error_title').click(function(){
    	var gm=getErrorGridManager();
    	if(gm){
    		setTimeout(function(){gm.reRender();},0);
    	}
    });
}
//动态引入JS文件
function impOperationJSFile(templetCode){
	var src=web_app.name+'/system/impTempl/js/'+templetCode+'.js';
	var head = $('head').remove('#impOperationJSFile');
    $("<script></script>").attr({src:src,type:'text/javascript',id:'impOperationJSFile'}).appendTo(head);
}

//初始化表格
function initializeGrid() {
	var toolbarOptions =getLogGridToolbarOptions();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "流水号", name: "serialId", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "文件名", name: "filename", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "导入信息", name: "message", width: 200, minWidth: 60, type: "string", align: "left" },	
			{ display: "失败数", name: "errorNbr", width: 80, minWidth: 60, type: "string", align: "right" },		   
			{ display: "成功数", name: "successNbr", width: 80, minWidth: 60, type: "string", align: "right" },	
			{ display: "操作用户", name: "personMemberName", width: 300, minWidth: 60, type: "string", align: "left" },	
			{ display: "操作时间", name: "createdate", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/impExcelAction!queryLogByTempletId.ajax',
		parms:{templId:$('#templId').val()},
		manageType:imp_log_query_manage_type,
		pageSize : 10,
		sortName:'id',
		sortOrder:'desc',
		width : '100%',
		height : '200',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			getImpMidTableHead(data.templId,data.serialId);
		},
		onLoadData :function(){
			return !($('#templId').val()=='');
		}
	});
	UICtrl.createGridQueryBtn('#maingrid','div.l-panel-topbar',function(param){
		UICtrl.gridSearch(gridManager, {param:encodeURI(param)});
	});
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


//导出模板
function exportExcel(){
	var templId= $('#templId').val();
	var templetName='';
	if($('#templetName').length>0){
		templetName=$('#templetName').val();
	}else{
		templetName=$('#templetNameSubject').text();
	}
	if(templId==''){
		Public.tip('请选择数据模板！');
		return;
	}
	var url=web_app.name+'/impExcelAction!doExpTempl.ajax';
	Public.ajax(url,{id:templId},function(data){
		$('#imp_main_iframe_id').get(0).src=web_app.name+'/attachmentAction!downFileByTmpdir.ajax?file='+data+'&fileName='+encodeURI(encodeURI(templetName));
	});
}
function doExpImpResult(flag){
	var table=flag?$('#imp_success_grid'):$('#imp_error_grid');
	var fileName=(flag?'导入成功数据':'导入失败数据');
	var gridManager=table.ligerGetGridManager();
	if(gridManager){
		UICtrl.gridExport(gridManager,{exportType:'all',fileName:fileName});
	}else{
		alert('未执行查询无法导出！');
	}
}

//查询导入结果表头
function getImpMidTableHead(id,serialid){
	if(Public.isBlank(serialid)) return;
	var templ_id=id||$('#templId').val();
	$('#imp_success_title').trigger('click');//默认显示导入成功页面
	if(temp_templ_id==templ_id){//模板没有改变,不用重新查询表头
		doQueryImpResult(templ_id,serialid);//执行查询
		return false;
	}
	var url=web_app.name+'/impExcelAction!queryExpTempletDetail.ajax';
	Public.ajax(url,{templetId:templ_id},function(data){
		var rows=data.Rows,colModel=[];//组合表头数据
		$.each(rows,function(i,o){
			colModel.push({display: o['cellColName'], name : o['columnName'], width :100, align: 'left'});
		});
		colModel.push({display:'备注', name :'message', width :120, align: 'left'});
		var imp_success_content=$('#imp_success_content'),imp_error_content=$('#imp_error_content');
		/*********清除以前的查询数据*******************/
		$('#imp_success_tmp_div').removeAllNode();//删除全部节点
		$('#imp_error_tmp_div').removeAllNode();//删除全部节点
		imp_success_content.html('<div id="imp_success_tmp_div"><div id="imp_success_grid"></div></div>');
		imp_error_content.html('<div id="imp_error_tmp_div"><div id="imp_error_grid"></div></div>');
		/**************重新注册表结构,动态设置表头*****************/
		UICtrl.grid('#imp_success_grid',
			$.extend({},
				imp_result_table_param,
				{columns:colModel,url:imp_result_table_url,parms:{templId:templ_id,serialId:serialid,status:'1'}},
				getSuccessGridOptions()
			)
		);
		UICtrl.grid('#imp_error_grid',
			$.extend({},
				imp_result_table_param,
				{columns:colModel,url:imp_result_table_url,parms:{templId:templ_id,serialId:serialid,status:'2'}},
				getErrorGridOptions()
			)
		);
		temp_templ_id=templ_id;
		doQueryImpResult(id,serialid);//执行查询导入结果集
	});
}
function getSuccessGridManager(){
	return $('#imp_success_grid').ligerGetGridManager();
}
function getErrorGridManager(){
	return $('#imp_error_grid').ligerGetGridManager();
}
//查询结果
function doQueryImpResult(templ_id,serialid){
	if(serialid=='') return;//没有流水号不执行查询
	UICtrl.gridSearch(getSuccessGridManager(),{templId:templ_id,serialId:serialid,status:'1'});
	UICtrl.gridSearch(getErrorGridManager(),{templId:templ_id,serialId:serialid,status:'2'});
}
function getLogGridToolbarOptions(){
	return [];
}
function getSuccessGridOptions(){
	return {};
}
function getErrorGridOptions(){
	return {};
}

