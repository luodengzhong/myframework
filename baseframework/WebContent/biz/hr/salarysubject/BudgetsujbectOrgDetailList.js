var treeManager = null, treeBudgdetManager = null, gridManager = null, maingridBudgetSubject = null, refreshFlag = false;
var detailGridManger = null, budgetSubjectDetailGridManager = null;
var gloabGridManager = null;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeOrgDetailGrid();
	
});
function initializeUI(){
	$("#budgetsubjectPersonName").orgTree({
		// param:{searchQueryCondition:"org_kind_id
		// in('ogn','dpt')"},
		filter : 'psm',
		onChange:function(){
			if ($("#budgetsubjectPersonName").val()) {
			UICtrl.confirm('确定更新更新责任人?', function() {
				// 所需参数需要自己提取 {id:row.id}
				Public.ajax(web_app.name + '/budgetsubjectOrgAction!update.ajax',
						{
							budgetsubjectOrgId : $("#parentId").val(),
							budgetsubjectPersonName : $("#budgetsubjectPersonName")
									.val(),
							budgetsubjectPersonId : $(
									"#budgetsubjectPersonId").val()
						}, function() {
							
						});
			}, function() {
				
			});
			}
		},
		back : {
			text : "#budgetsubjectPersonName",
			value : "#budgetsubjectPersonId",
			id : "#budgetsubjectPersonId",
			name : "#budgetsubjectPersonName"
		}
	});
	
}

function initializeOrgDetailGrid(){
	var parentId=$("#parentId").val();
	var toolbarOptions = UICtrl
	.getDefaultToolbarOptions({
		addHandler : function() {
			var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
			selectOrgParams = $.extend({}, selectOrgParams, {
				selectableOrgKinds : 'dpt,psm',cascade : false
			});
			var options = {
				params : selectOrgParams,
				title : "请选择组织",
				cascade : false,
				cancel : false,
				//parent : window['showEditBudgetDetail'],
				closeHandler : function() {
				},
				confirmHandler : function() {
					var data = this.iframe.contentWindow.selectedData;
					if (data.length == 0) {
						Public.errorTip("请选择数据。");
						return;
					}
					var rows = [];
					$.each(data, function(i, o) {
						eachRow = {};
						eachRow['orgId'] = o['id'];
						eachRow['fullId'] = o['fullId'];
						eachRow['orgName'] = o['name'];
						eachRow['orgKindId'] = o['orgKindId'];
						eachRow['parentId'] = parentId;
						// eachRow['status']=1;
						rows.push(eachRow);
					});
					var url = web_app.name
							+ '/budgetsubjectOrgDetailAction!insert.ajax';
					var _self = this;
					Public.ajax(url, {
						setbookId : $("#setbookId").val(),
						detailData : encodeURI($.toJSON(rows))
					}, function(data) {
						if (data) {
							UICtrl.alert(data);
						}
						_self.close();
						budgetSubjectDetailGridManager.loadData();
					});
				}
			};
			OpmUtil.showSelectOrgDialog(options);
		},
		deleteHandler : function() {
			var rowDetail = budgetSubjectDetailGridManager
					.getSelectedRow();
			if (!rowDetail) {
				Public.tip('请选择数据！');
				return;
			}
			UICtrl
					.confirm(
							'确定删除吗?',
							function() {
								// 所需参数需要自己提取 {id:row.id}
								Public
										.ajax(
												web_app.name
														+ '/budgetsubjectOrgDetailAction!delete.ajax',
												{
													budgetsubjectOrgDetailId : rowDetail.budgetsubjectOrgDetailId
												},
												function() {
													budgetSubjectDetailGridManager
															.loadData();
													maingridBudgetSubject
															.loadData();
												});
							});
		},
		enableHandler : function(data) {
			var rowDetail = budgetSubjectDetailGridManager
					.getSelectedRow();
			if (!rowDetail) {
				Public.tip('请选择数据！');
				return;
			}
			DataUtil
					.updateById({
						action : 'budgetsubjectOrgDetailAction!updateStatus.ajax',
						gridManager : budgetSubjectDetailGridManager,
						idFieldName : 'budgetsubjectOrgDetailId',
						param : {
							status : 1,
							setbookId : $("#setbookId").val(),
							orgName : rowDetail.orgName,
							orgId : rowDetail.orgId
						},
						message : '确实要启用选中数据吗?',
						onSuccess : function() {
							budgetSubjectDetailGridManager.loadData();
						}
					});

		},
		disableHandler : function() {
			DataUtil
					.updateById({
						action : 'budgetsubjectOrgDetailAction!updateStatus.ajax',
						gridManager : budgetSubjectDetailGridManager,
						idFieldName : 'budgetsubjectOrgDetailId',
						param : {
							status : -1
						},
						message : '确实要禁用选中数据吗?',
						onSuccess : function() {
							budgetSubjectDetailGridManager.loadData();
						}
					});

		}
	});
var columns = [ {
display : "组织",
name : "orgName",
width : 110,
minWidth : 60,
type : "string",
align : "left"
} ];
columns.push({
display : "状态",
name : "status",
width : 80,
minWidth : 60,
type : "string",
align : "left",
render : function(item) {
	return UICtrl.getStatusInfo(item.status);
}
});
columns.push({
display : "组织全路径",
name : "fullName",
width : 300,
minWidth : 100,
type : "string",
align : "left"
});

var param = {
parentId : $("#parentId").val()
};
budgetSubjectDetailGridManager = UICtrl.grid('#budgetSubjectDetailGrid', {
columns : columns,
dataAction : 'server',
url : web_app.name + '/budgetsubjectOrgDetailAction!slicedQuery.ajax',
parms : param,
width : '100%',
height : '100%',
heightDiff : -5,
headerRowHeight : 25,
rowHeight : 25,
/*
 * sortName:'budgetsubjectName', sortOrder:'asc',
 */
toolbar : toolbarOptions,
autoAddRowByKeydown : false,
// checkbox: true,
fixedCellHeight : true,
selectRowButtonOnly : true
});
}