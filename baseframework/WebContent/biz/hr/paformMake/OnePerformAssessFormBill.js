var gridManager = null,  refreshFlag = false;
var templetIdFull = null;
$(document).ready(function() {
	scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');

	initUI();
	initializeGridManager();
	templetIdFull = $('#templetId').val();
	//调用job.js中方法删除多余按钮
	removeToolBarItem(['deleteProcessInstance','back','transfer','counterSign','assist','makeACopyFor','abort','taskCollect','showChart','showApprovalHistory']);
});
function initUI() {
	$('#assessName').searchbox({
		type : 'sys',
		name : 'orgSelect',
		back : {
			personMemberId : '#assessId',
			name : '#assessName',
			positionName : '#assessPostionName',
			deptName : '#assessDeptName'
		},
		onChange:function(){
			var assessId = $('#assessId').val();
			if(assessId!=''){
				var url=web_app.name+'/paformMakeAction!queryArchive.ajax';
				Public.ajax(url,{assessId:assessId},function(data){
					$('#tableInput').find('input').val('');
					$.each(data,function(p,o){
						if(p=='sex'){
						$('#'+p).val(o).combox('setValue');
						}else{
							$('#'+p).val(o);
						}
					});
					
				});
				
			
			}
			

		},
		param : {
			a : 1,
			b : 1,
			searchQueryCondition : " org_kind_id ='psm' and instr(full_id, '.prj') = 0 "
		}
	});
	$('#templetName')
			.searchbox(
					{
						type : 'hr',
						name : 'performAssessTempletSelect',
						onChange : function(values) {

							if (values.templetId != templetIdFull) {
								templetIdFull = values.templetId;
								var datas = gridManager.getAdded();
								$.each(datas, function(i, o) {
									gridManager.deleteRow(o);
								});
								gridManager.deletedRows = null;
								var templetId = $('#templetId').val();
								if (templetId != '') {
									var url = web_app.name
											+ '/performassessAction!slicedQueryPerformAssessTempletDeta.ajax';
									Public.ajax(url, {
										templetId : templetId
									}, function(data) {
										gridManager.addRows(data.Rows);
									});
								}
							}
							return true;
						},
						back : {
							paType:'#paType',
							templetId : '#templetId',
							templetName : '#templetName'
						}
					});
	
	 var $el=$('#assessPosName');
		$el.orgTree({filter:'pos',
			getParam:function(){
				var  root='orgRoot';
			  return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in('ogn','dpt','pos')"};
			},
			back:{
				text:$el,
				value:'#assessPosId',
				id:'#assessPosId'
			}
		});

	
}
// 初始化表格
function initializeGridManager() {
	var formId = $('#formId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler : addHandler,
		deleteHandler : function() {
			DataUtil.delSelectedRows({
				action : 'paformMakeAction!deletePerformAssessFormIndex.ajax',
				gridManager : gridManager,
				idFieldName : 'indexDetailId',
				onSuccess : function() {
					gridManager.loadData();
				}
			});

		}

	});
	gridManager = UICtrl.grid('#maingrid', {
		columns : [ {
			display : "序号",
			name : "sequence",
			width : 60,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}
		}, {
			display : "主项目",
			name : "mainContent",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true
			}
		}, {
			display : "指标名称",
			name : "partContent",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true
			}
		}, {
			display : "指标要求",
			name : "desption",
			width : 650,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true
			}
		} ],
		dataAction : 'server',
		url : web_app.name
				+ '/paformMakeAction!slicedQueryPerformAssessFormIndex.ajax',
		parms : {
			formId : formId
		},
		usePager:false,
		width : '99%',
		height : 400,
		heightDiff : -5,
		enabledEdit : true,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'sequence',
		sortOrder : 'asc',
		toolbar : toolbarOptions,
		checkbox : true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData : function() {
			return !($('#formId').val() == '');
		}

	});
	UICtrl.setSearchAreaToggle(gridManager);
}


// 刷新表格
function reloadGrid() {
	gridManager.loadData();
}

// 添加按钮
function addHandler() {

	var templetId = $('#templetId').val();
	UICtrl.showAjaxDialog({
		url : web_app.name
				+ '/paformMakeAction!showInsertPerformAssessFormIndex.load',
		param : {
			templetId : templetId
		},
		ok : insertFormIndex,
		width : 350,
		title : '新增考核指标',
		close : dialogClose
	});
}

// 新增保存 考核表的指標
function insertFormIndex() {
	$('#submitForm')
			.ajaxSubmit(
					{
						url : web_app.name
								+ '/paformMakeAction!insertPerformAssessFormIndex.ajax',
						success : function(data) {
							// 將新增的数据add到gridManager中
							gridManager.addRows(data);
							refreshFlag = true;

						}
					});
}

function insertForm() {
	var extendedData = getExtendedData();
	if (extendedData === false) {
		return;
	}
	alert($.toJSON(extendedData));
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/paformMakeAction!insertOnePerformAssessForm.ajax',
		param : $.extend({}, extendedData),
		success : function(data) {
			$('#formId').val(data);
			gridManager.options.parms['formId'] = data;
			refreshFlag = true;
		}
	});
}

function submitForm(){
	var extendedData = getExtendedData();
	if (extendedData === false) {
		return;
	}
	alert($.toJSON(extendedData));
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/paformMakeAction!submitPerformAssessForm.ajax',
		param : $.extend({}, extendedData),
		success : function(data) {
			//关闭窗口
			UICtrl.closeAndReloadTabs("TaskCenter", null);

		}
	});
}


function getExtendedData() {
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	if (!extendedData) {
		return false;
	}
	return {
		detailData : encodeURI($.toJSON(extendedData))
	};
}

// 关闭对话框
function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}


 function save() { 
	 insertForm();
	 }
 
 function advance(){
	 submitForm();
 }
