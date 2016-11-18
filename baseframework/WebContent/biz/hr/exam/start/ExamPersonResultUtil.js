
function viewTaskHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var examStartPersonId=row.examStartPersonId;
	var html=['<div>','<div id="personExamTaskGrid"></div>','</div>'];
	UICtrl.showDialog({title:'考试记录',width:600,top:50,height:300,
		content:html.join(''),ok:false,
		init:function(){
		 	UICtrl.grid('#personExamTaskGrid', {
				columns: [
				    { display: "姓名", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left",
				    	render: function (item) { 
							return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+item.personMemberName+"</font>";
						}
				    },	
					{ display: "是否合格", name: "isQualifiedTextView", width: 80, minWidth: 60, type: "string", align: "left",
						render: function (item) { 
							return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+(item.isQualifiedTextView?item.isQualifiedTextView:'')+"</font>";
						}
					},
					{ display: "最终分数", name: "finalScore", width: 80, minWidth: 60, type: "string", align: "left"},
					{ display: "开始考试时间", name: "examStartTime", width:100, minWidth: 60, type: "date", align: "left"},
					{ display: "完成考试时间", name: "examEndTime", width: 100, minWidth: 60, type: "date", align: "left"},
					{ display: "状态", name: "personStatusTextView", width: 80, minWidth: 60, type: "string", align: "left"},
					{ display: "查看", name: "personStatus", width: 80, minWidth: 60, type: "string", align: "left",
						render: function (item) { 
							var personStatus=item.personStatus;
							if(personStatus=='3'){
								return "<a href='javascript:forwardQuestionAnswerList("+item.examPersonTaskId+");' class='GridStyle'>查看</a>";
							}
							return "";
						}
					}
				],
				dataAction : 'server',
				url: web_app.name+'/examStartAction!slicedQueryExamPersonTask.ajax',
				parms:{examStartPersonId:examStartPersonId},
				pageSize : 20,
				width : '100%',
				height :280,
				heightDiff : -15,
				headerRowHeight : 25,
				rowHeight : 25,
				sortName:'examPersonTaskId',
				sortOrder:'desc',
				fixedCellHeight : true,
				selectRowButtonOnly : true
			});
		}
   });
}

function forwardQuestionAnswerList(examPersonTaskId){
	var url= web_app.name +'/examTaskAction!forwardQuestionAnswerList.do?examPersonTaskId='+examPersonTaskId;
	parent.addTabItem({ tabid: 'QuestionAnswerList'+examPersonTaskId, text: '查看个人考卷 ', url:url});
}