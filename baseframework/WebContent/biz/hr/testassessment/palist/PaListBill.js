var personGridManager = null, refreshFlag = false,scorePersonLevel = null;
$(document).ready(function() {
	scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
	initUI();
	initializeGrid();
});
function initUI(){
	$('#assessName').searchbox({
		type : 'sys',
		name : 'orgSelect',
		back : {
			personMemberId : '#assessId',
			name : '#assessName',
			positionName : '#assessPostionName',
			deptName : '#assessDeptName'
		},
		param : {
			a : 1,
			b : 1,
			searchQueryCondition : " org_kind_id ='psm'"
		}
	});
	$('#templetName')
			.searchbox(
					{
						type : 'hr',
						name : 'performAssessTempletSelect',
						back : {
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
//初始化表格
function initializeGrid() {
	var formId = $('#formId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
	addHandler : function() {
		addPersonHandler();
	},
	deleteHandler : function() {
		DataUtil.delSelectedRows({
			action : 'paformMakeAction!deletePerformAssessFormPerson.ajax',
			gridManager : personGridManager,
			idFieldName : 'scorePersonDetailId',
			onSuccess : function() {
				personGridManager.loadData();
			}
		});

	}

});
personGridManager = UICtrl.grid('#personMaingrid', {
	columns : [ {
		display : "评分人姓名",
		name : "scorePersonName",
		width : 130,
		minWidth : 60,
		type : "string",
		align : "left",
		editor : {
			type : 'text',
			required : true
		}

	}, {
		display : "评分人级别",
		name : "scorePersonLevel",
		width : 130,
		minWidth : 60,
		type : "string",
		align : "left",
		editor : {
			type : 'combobox',
			data : scorePersonLevel,
		},
		render : function(item) {
			return scorePersonLevel[item.scorePersonLevel];
		}
	}, {
		display : "所占权重(%)",
		name : "proportion",
		width : 130,
		minWidth : 60,
		type : "string",
		align : "left",
		editor : {
			type : 'text',
			mask : 'nnn'
		}
	} ],
	dataAction : 'server',
	url : web_app.name + '/paformMakeAction!slicePerson.ajax',
	parms : {
		formId : formId
	},
	width : '99%',
	usePager:false,
	height : 300,
	heightDiff : -10,
	headerRowHeight : 25,
	rowHeight : 25,
	toolbar : toolbarOptions,
	sortName : 'scorePersonLevel',
	sortOrder : 'asc',
	checkbox : true,
	enabledEdit : true,
	fixedCellHeight : true,
	selectRowButtonOnly : true,
	onLoadData : function() {
		return !($('#formId').val() == '');
	}

});
UICtrl.setSearchAreaToggle(personGridManager);
}
function addPersonHandler() {
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();

	UICtrl.showFrameDialog({
		title : "选择测评名单",
		url : web_app.name + "/orgAction!showSelectOrgDialog.do",
		param : selectOrgParams,
		width : 700,
		height : 400,
		ok : function() {
			showPAMakePerson(this);
		},
		close : dialogClose
	});
}

function showPAMakePerson(_self) {
	var data = _self.iframe.contentWindow.selectedData;
	if (!data)
		return;
	// scorePersonName
	var addRows = [], addRow;
	$.each(data, function(i, o) {
		// 绩效考核全部默认为上级
		addRow = $.extend({}, o);
		addRow["scorePersonId"] = o["id"];
		addRow["scorePersonName"] = o["name"];
		addRow["formId"] = $('#formId').val();
		addRows.push(addRow);
	});
	personGridManager.addRows(addRows);
	_self.close();
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(personGridManager, param);
}

//刷新表格
function reloadGrid() {
	personGridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


function getId() {
	return $("#formId").val() || 0;
}

function setId(value) {
	$("#formId").val(value);
	personGridManager.options.parms['formId'] = value;
}

function getExtendedData() {
	var personExtendedData = DataUtil.getGridData({
		gridManager : personGridManager
	});
	if (!personExtendedData) {
		return false;
	}
	return {
		personDetailData : encodeURI($.toJSON(personExtendedData))
	};
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
