var gridManager = null, detailGridManager =null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initDetailGrid();
});

function businessJudgmentUnit(){
	return true;
}

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
}
//初始化表格
function initializeGrid() {
	var auditId=$('#auditId').val();
	var kind=$('#kind').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [  
			{ display: "考评表名称", name: "templetName", width: 150, minWidth: 60, type: "string", align: "left",
				render : function(item) {
					return '<a href="javascript:showForm('+item.templetId+',\''+item.templetName+'\');" class="GridStyle">'+item.templetName+'</a>';
				}},		   
			{ display: "考评表编码", name: "templetCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "指标总分", name: "total", width: 60, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/assessmentauditAction!queryList.ajax',
		parms:{auditId:auditId,kind:kind},
		pageSize : 20,
		title: "待审核考评表列表",
		width : '29%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'templetCode',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#auditId').val()=='');
		},
		onSelectRow:function(data, rowindex, rowobj){
			refreshIndexGrid(data.templetId);
		},
		onSuccess:function(){
			var v=$('#mainTempletId').val();
			if(v!=''&&v!=-1){
				refreshIndexGrid(-1);
			}
		}
	});
	UICtrl.createGridQueryBtn('#maingrid',function(param){
		UICtrl.gridSearch(gridManager, {templetName:encodeURI(param)});
	});
}
function refreshIndexGrid(templetId){
	$('#mainTempletId').val(templetId);
	detailGridManager.options.parms.templetId = templetId;
	detailGridManager.loadData();
}


function showForm(evaluationId,name){
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!queryIndexForView.load', 
		param:{evaluationId:evaluationId}, 
		ok: false,
		init:function(doc){
			var div=$('#viewTempletIndexDiv').width(840);
			var height=div.height(),wh=getDefaultDialogHeight()-50;
			if(height>wh){
				div.height(wh);
			}
		},
		title:"考核表["+name+"]指标",
		width:850
	});
}
function initDetailGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler:saveIndexHandler,
		addHandler: addIndexHandler,
		updateHandler:function(){
			updateIndexHandler();
		},
		deleteHandler:deleteIndexHandler
		
	});
	detailGridManager = UICtrl.grid('#indexgrid', {
		columns: [
		    {display : "主项目",name : "mainContent",width : 100,minWidth : 60,type : "string",align : "left"},	 
			{ display: "指标名称", name: "partContent", width: 150, minWidth: 60, type: "string", align: "left" },
			{ display: "分值", name: "scoreNum", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'spinner',min:1,mask:'nnn'}
			},
			{ display: "序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'spinner',min:1,mask:'nnn',required:true}
			},
			{ display: "指标考核标准", name: "desption", width: 400, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return '<div title="'+item.desption+'">'+item.desption+'</div>';
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/performassessAction!slicedQueryPerformAssessTempletDeta.ajax',
		pageSize : 20,
		parms:{totalFields:'scoreNum'},
		width : '69%',
		height : '100%',
		heightDiff : -18,
		headerRowHeight : 25,
		rowHeight :25,
		enabledEdit: true,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#mainTempletId').val()=='');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateIndexHandler(data.detailId);
		},
		totalRender: function(data){
			var allTotal=data.totalFields['scoreNum'];
			var html=['指标分值合计: <span id="scoreNumSpan">'];
			html.push(allTotal);
			html.push('</span>');
			var pageTotal=0,scoreNum;
			$.each(data.Rows,function(i,o){
				scoreNum=parseInt(o.scoreNum,10);
				pageTotal+=isNaN(scoreNum)?0:scoreNum;
			});
			tempTotal=parseInt(allTotal,10)-pageTotal;
			return html.join('');
		},
		onAfterEdit:function(e){
			if (e.column.name == "scoreNum"){
				var totalSpan=$('#scoreNumSpan');
				var data=detailGridManager.currentData['Rows'];
				var pageTotal=0,scoreNum;
				$.each(data,function(i,o){
					scoreNum=parseInt(o.scoreNum,10);
					pageTotal+=isNaN(scoreNum)?0:scoreNum;
				});
				totalSpan.text(pageTotal+tempTotal);
			}
		}
	});
}


function addIndexHandler(){
	var templetId=$('#mainTempletId').val();
	if(templetId==''||templetId=='0'){
		Public.tip("请选择考核表!");
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showIndexTempletIndex.load', 
		param:{templetId:templetId},
		ok: insertIndex, 
		width:400,
		title:"新增考核指标"});
}
//编辑按钮
function updateIndexHandler(detailId){
	if(!detailId){
		var row = detailGridManager.getSelectedRow();
		if (!row) {Public.tip('请选择指标数据！'); return; }
		detailId=row.detailId;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showUpdateTempletIndex.load', 
		param:{detailId:detailId}, 
		width:400,
		title:"修改考核指标",
		ok: updateIndex});
}
//新增保存
function insertIndex() {
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!insertTempletIndex.ajax',
		param:{templetId:$('#mainTempletId').val()},
		success : function(data) {
			_self.close();
			reLoaddetailGrid();
		}
	});
}

//编辑保存
function updateIndex(){
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!updateTempletIndex.ajax',
		param:{templetId:$('#mainTempletId').val()},
		success : function() {
			_self.close();
			reLoaddetailGrid();
		}
	});
}
function reLoaddetailGrid(){
	detailGridManager.loadData();
	//reloadGrid();
}
function initializeBatchBtn(){
	$('#toolbar_menuAddBatch').comboDialog({type:'hr',name:'performAssessIndexSelect',width:600,dataIndex:'indexId',
		title:'请选择指标',checkbox:true,
		onShow:function(){
			var templetId=$('#mainTempletId').val();
			if(templetId==''||templetId=='0'){
				Public.tip("请选择考核表!");
				return false;
			}
			return true;
		},
		onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["indexId"] = o["indexId"];
	    		addRow["mainContent"] = o["mainContent"];
	    		addRow["partContent"] = o["partContent"];
	    		addRow["desption"] = o["desption"];
	    		addRows.push(addRow);
	    	});
	    	detailGridManager.addRows(addRows);
	    	return true;
    }});
}

//删除模板指标
function deleteIndexHandler(){
	DataUtil.delSelectedRows({action:'performassessAction!deletePerformAssessTempletDeta.ajax',
		gridManager:detailGridManager,idFieldName:'detailId',
		param:{templetId:$('#mainTempletId').val()},
		onSuccess:function(){
			reLoaddetailGrid();		  
		}
	});
}
//批量保存指标
function saveIndexHandler(){
	var detailData=DataUtil.getGridData({gridManager:detailGridManager,idFieldName:'detailId'});
	if(!detailData) return false;
	if(detailData.length==0) return;
	Public.ajax(web_app.name + "/performassessAction!savePerformAssessTempletDetail.ajax",
			{detailData:encodeURI($.toJSON(detailData)),templetId:$('#mainTempletId').val()},
			function(){
				reLoaddetailGrid();		  
			}
	);
}



