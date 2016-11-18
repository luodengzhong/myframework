var gridManager = null, refreshFlag = false;
$(document).ready(function() {
			UICtrl.autoSetWrapperDivHeight();
			initializeGrid();
		});
// 初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
				viewHandler : function() {
					updateHandler();
				},
				againHandler : {
					id : 'again',
					text : '重发',
					img : 'page_user.gif',
					click : function() {
						again();
					}
				},
				stopHandler : {
					id : 'stop',
					text : '中止',
					img : 'page_user.gif',
					click : function() {
						stop();
					}
				},
				saveHandler : saveHandler
			});
	gridManager = UICtrl.grid('#maingrid', {
		columns : [{
					display : "生成时间",
					name : "fillinDate",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "center"
				}, {
					display : "课程名称",
					name : "trainingCourseName",
					width : 120,
					minWidth : 60,
					type : "string",
					align : "left"
				}, {
					display : "讲师姓名",
					name : "trainingTeacherName",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "left"
				}, {
					display : "学员姓名",
					name : "trainingStudentName",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "left"
				}, {
					display : "状态",
					name : "scoreStatusTextView",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "left"
				}, {
					display : "课程得分",
					name : "courseScore",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "left",
					editor : {
						type : 'spinner',
						mask : 'nnnnnn'
					}
				}, {
					display : "讲师得分",
					name : "teacherScore",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "left",
					editor : {
						type : 'spinner',
						mask : 'nnnnnn'
					}
				}, {
					display : "总评分",
					name : "totalScore",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "left",
					editor : {
						type : 'spinner',
						mask : 'nnnnnn'
					}
				}, {
					display : "建议",
					name : "suggest",
					width : 150,
					minWidth : 60,
					type : "string",
					align : "left"
				}, {
					display : "其他收获",
					name : "otherReceiving",
					width : 150,
					minWidth : 60,
					type : "string",
					align : "left"
				}],
		dataAction : 'server',
		url : web_app.name
				+ '/trainingEffectEvaAction!slicedQueryTrainingEffectEvaluate.ajax',
		parms : {
			trainingClassCourseId : $('#trainingClassCourseId').val()
		},
		pageSize : 100,
		enabledEdit : true,
		checkbox:true,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'evaluateId',
		sortOrder : 'asc',
		toolbar : toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.evaluateId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}
// 刷新表格
function reloadGrid() {
	gridManager.loadData();
}

// 重置表单
function resetForm(obj) {
	$(obj).formClean();
}

// 编辑按钮
function updateHandler(evaluateId) {
	if (!evaluateId) {
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择数据！');
			return;
		}
		evaluateId = row.evaluateId;
	}
	parent.addTabItem({
		tabid : 'trainingEffectEvaList' + evaluateId,
		text : '学员培训效果评估明细表',
		url : web_app.name
				+ '/trainingEffectEvaAction!showUpdateTrainingEffectEvaluate.do?bizId='
				+ evaluateId
	});
}

// 编辑保存
function update() {
	$('#submitForm').ajaxSubmit({
		url : web_app.name
				+ '/trainingEffectEvaAction!updateTrainingEffectEvaluate.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

// 关闭对话框
function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function again() {
	var evaluateIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'evaluateId' });
	var trainingStudentIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'trainingStudentId' });
   	var trainingClassCourseIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'trainingClassCourseId' });
    var rows=gridManager.getSelectedRows();
	if (!evaluateIds) return;
	
		Public.ajax(web_app.name + '/trainingEffectEvaAction!again.ajax', {
					evaluateIds : $.toJSON(evaluateIds),
					trainingClassCourseIds:$.toJSON(trainingClassCourseIds),
					trainingStudentIds : $.toJSON(trainingStudentIds),
					detailData:$.toJSON(rows)
				}, function() {
					reloadGrid();
				});

}
//TODO
function stop() {
	//var rows = gridManager.getSelectedRows();

	/*if (!rows) {
		Public.tip('请选择数据！');
		return;
	}
	var scoreStatus = row.scoreStatus;
	var evaluateId = row.evaluateId;
	var trainingClassCourseId=row.trainingClassCourseId;*/
	var evaluateIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'evaluateId' });
	var scoreStatuss = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'scoreStatus' });
	var trainingClassCourseIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'trainingClassCourseId' });
    if (!evaluateIds) return;
    
    for(var i=0;i<scoreStatuss.length;i++){
	   		if(parseInt(scoreStatuss[i])==2 ){
	   			Public.tip('选择的数据中不能进行中止操作!');
	   			return false;
	   		}
	    }
	//if (scoreStatus == 1 || scoreStatus == 3) {
		Public.ajax(web_app.name + '/trainingEffectEvaAction!stop.ajax', {
					evaluateIds : $.toJSON(evaluateIds),
					trainingClassCourseIds:$.toJSON(trainingClassCourseIds)
				}, function() {
					reloadGrid();
				});
	//} else {
	//	Public.tip('不能进行中止操作！');
	//}
}
function saveHandler() {
	var extendedData = DataUtil.getGridData({
				gridManager : gridManager
			});
	Public.ajax(web_app.name + '/trainingEffectEvaAction!saveScore.ajax', {
				extendedData : $.toJSON(extendedData)
			}, function() {
				reloadGrid();
			});

}
