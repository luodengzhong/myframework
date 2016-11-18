var gridManager = null, refreshFlag = false,commonWageKind=null;
var yesOrNo={1:'是',0:'否'};	
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	commonWageKind=$('#commonWageKind').combox('getJSONData');
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$('#toolbar_menuAddBatch').comboDialog({type:'hr',name:'personArchiveSelect',width:635,dataIndex:'archivesId',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["organId"] = o["ognId"];
	    		addRow["organName"] = o["ognName"];
	    		addRow["deptId"] = o["dptId"];
	    		addRow["deptName"] = o["dptName"];
	    		addRow["archivesName"] = o["staffName"];
	    		addRow["isBeforeTaxes"] = 1;
	    		//addRow["executionTime"] = $('#deftEecutionTime').val();
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);
	    	return true;
    }});
	PayPublic.updateOperationPeriodByAudit(gridManager,'hRCommonWageDataAction!updateOperationPeriod.ajax');
	$('#commonWageDataFileList').fileList();
}
//初始化表格
function initializeGrid() {
	permissionAuthority['maingrid.updateOperationPeriod']={authority:'readwrite',type:'2'};
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addBatchHandler: function(){}, 
		addHandler: function(){
			//UICtrl.addGridRow(gridManager,{executionTime:$('#deftEecutionTime').val()});
			UICtrl.addGridRow(gridManager);
		},
		saveImpHandler:saveImpHandler,
		deleteHandler: deleteHandler,
		updateOperationPeriod:{id:'updateOperationPeriod',text:'修改业务期间',img:'page_component.gif'}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "序号", name: "myRownum", width: 60, minWidth: 60, type: "string", align: "center" ,frozen: true},
		{ display: "机构名称", name: "organName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true },	
		{ display: "所属一级中心", name: "centreName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "部门名称", name: "deptName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true },
		//{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },		   
		{ display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true,
			editor: { type: 'select', required: true,data: { type:"hr", name: "personArchiveSelect",width:350,
				manageType:'hRDeductManage',
				back:{
					ognId:"organId",ognName:"organName",dptId:"deptId",posId:"posId",centreName:"centreName",
					dptName:"deptName",staffName:"archivesName",posName:"posName",fullId:"fullId",
					centreId:"centreId",staffName:"archivesName",archivesId:"archivesId"}
			}}
		},	
		{ display: "是否税前", name: "isBeforeTaxes", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:yesOrNo,required: true},
			render: function (item) { 
				return yesOrNo[item.isBeforeTaxes];
			}
		},
		{ display: "金额", name: "amount", width: 120, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',required: true,mask:'positiveMoney'},
			render: function (item) { 
				return  Public.currency(item.amount);
			}
		},		   
		/*{ display: "生效时间", name: "executionTime", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'date',required: true}
		},*/
		{ display: "备注", name: "content", width: 200, minWidth: 60, type: "string", align: "left" ,
			editor: { type:'text'}
		},
		{ display: "执行期间", name: "periodName", width: 220, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/hRCommonWageDataAction!slicedQueryCommonWageDataDetail.ajax',
		parms:{auditId:$('#auditId').val()},
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		totalRender: function(data){
			if(!data) return '';
			var html=['合计:  '];
			html.push(Public.currency(data.amount));
			return html.join('');
		},
		autoAddRow:{organId:'',auditId:'',deptId:'',posId:'',centreId:'',fullId:'',isBeforeTaxes:'1'},
		onLoadData :function(){
			return !($('#auditId').val()=='');
		}
	});
	/*if($('#maingrid').find('div.l-panel-topbar').length>0){
		var html=['<div style="float:right;margin-right:10px;">默认生效时间&nbsp;:&nbsp;'];
		html.push('<input type="text" class="textGrid textDate" style="width:100px;" id="deftEecutionTime">');
		html.push('</div>');
		$('#maingrid').find('div.l-panel-topbar').append(html.join(''));
		var deftEecutionTime=$('#deftEecutionTime').val(Public.formatDate(DateUtil.getLastMonthFirstDay()));
		deftEecutionTime.datepicker().mask('9999-99-99');
	}*/
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	gridManager.options.parms['auditId'] =value;
	$('#commonWageDataFileList').fileList({bizId:value});
}
function afterSave(){
	reloadGrid();
}
/*//保存
function save() {
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/hRDeductAction!saveCompensationDeductAudit.ajax',
		param : $.extend({}, detailData),
		success : function(data) {
			if (!getId())
				setId(data);
			afterSave();
		}
	});
}*/

function checkConstraints(){
	if (gridManager.getData().length == 0){
		Public.tip("没有选择员工信息，不能提交！");
		return false;
	}
	return true;
}
function deleteHandler(){
	DataUtil.delSelectedRows({action:'hRCommonWageDataAction!deleteCommonWageDataDetail.ajax',
		gridManager: gridManager,idFieldName:'detailId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}
//导入奖罚数据
function saveImpHandler(){
	var serialId=getId();
	if(!serialId){
		Public.tip('请先保存主记录！');
		return false;
	}
		Public.tip('暂未实现！');
		return false;
	UICtrl.showAssignCodeImpDialog({title:'导入通用工资',serialId:serialId,templetCode:'hrCommonWageDataImp'});
}