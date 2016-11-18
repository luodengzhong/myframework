var detailManagerR = null, refreshFlag = false ,infoDemandWorkData = null,infoDemandUrgentData , yesOrNo = {0:'否', 1:'是'},deptValue= null,deptIdValue= null,funValue= null;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	infoDemandWorkData = $("#infoDemandWorkList").combox("getJSONData");
	infoDemandUrgentData = $("#infoDemandUrgentList").combox("getJSONData");
	enableWorkContactBill();
	/*initFunTypeName();*/ 
	initDataBox();
	initializeGrid();
}); 
/*function initFunTypeName(){
	$("#funTypeName").searchbox({ type:"sys", name: "orgSelect", 
		getParam: function(){
			return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'" };
		}, back:{personId: "#funTypeId", personMemberName: "#funTypeName" }
});

}*/
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		deleteHandler: deleteHandler,	
		addDetailHandler:{id:'addDetail',text:'添加同部门任务', click:addDetailHandler, img:'page_edit.gif'}/*,	
		showDetailTaskDetailHandler:{id:'showDetailTaskDetail',text:'查看子流程任务', click:showDetailTaskDetailHandler, img:'page_edit.gif'}*/
	
	});
	detailManagerR = UICtrl.grid('#maingrid', {
		columns: [ 
		{ display: "联系部门", name: "deptName",  width: 120, minWidth: 80, type: "string", align: "left" ,
			editor: { type: 'tree', required: true,data:{name : 'org',width:250,hasSearch:false,filter:'dpt',getParam:function(rowData){
				return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt')"+getNotInSQL()};
			}}, 
            beforeChange: function(nodeData, editParm){
				var fullName = nodeData.fullName;
				editParm.record['fullName']=fullName;
				editParm.record['funTypeName']="";
				editParm.record['funTypeId']="";
			},
			
            textField:'deptName',valueField:'deptId'}
	    },	 
	    { display: "全路径", name: "fullName",  width: 120, minWidth: 80, type: "string", align: "left"},	 
	   	{ display: "职能类别", name: "funTypeName",  width: 120, minWidth: 80, type: "string", align: "left" ,
                editor: { type: 'select', required: true, data: { type: "bpm", name: "bizSegmentationByDept",
                    getParam: function (item) {
                        return { orgId: item.deptId, searchQueryCondition: "kind_id in (2) " };//kind_id in (1,2,3) 
                    },
                    back: { bizSegmentationId: "funTypeId", name: "funTypeName" }
                }}
            },	
	   	{ display: "对接人", name: "personName",  width: 120, minWidth: 80, type: "string", align: "left" ,
            editor: { type: 'select', required: false, data: { type: "sys", name: "orgSelect",
                getParam: function (item) {
        			var deptId=item.deptId;
                    return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm' "};//kind_id in (1,2,3) 
                },
                back: { id: "personId", personMemberName: "personName" }
            }}
        },		    	
		{ display: "事项描述", name: "description",  width: 500, minWidth: 80, type: "string", align: "left" ,
		    editor: { type: 'text',max:1000, required: true}}	
		],
		dataAction : 'server',
		url: web_app.name+'/workContactAction!slicedQueryContactDetail.ajax?',
		//slicedQuery***
        parms: {
        	workContactId: $("#workContactId").val()
        },
		pageSize : 8,
		width : '99%',
		height : '300',
        heightDiff: -5,
		headerRowHeight : 25,
        rowHeight: "auto",
		sortName:'workContactId,sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
        usePager: false,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
		autoAddRowByKeydown:false,
      /*  rownumbers: true,*/
		detail: {height:'auto', onShowDetail: function(row, detailPanel,callback){
			var url=web_app.name+'/common/TaskExecutionList.jsp';
			Public.load(url,{procUnitId:'Approve',bizId:row.detailBizId},function(data){
				var div=$('<div></div>').css({'paddingLeft':'20px','paddingTop':'5px',overflow:'hidden'});
				div.html(data);
				$(detailPanel).append(div);
			});
        }},
        onLoadData :function(){
			return !($('#workContactId').val()=='');
		},
		onAfterShowData: function (data, rowindex, rowobj) {
			doMergeCell();
			onEditShowData(null);
		},			
		onBeforeEdit:function(data, rowindex, rowobj){
			var columnname = data.column.columnname;
			if("deptName" == columnname){
				//获取责任部门当前旧值
				deptValue = data.value;
				deptIdValue = data.record.deptId;
			}else if("funTypeName" == columnname){
				//获取职能类别当前旧值
				funValue = data.value;
				deptIdValue = data.record.deptId;
			}
			onEditShowData(25);
		},
		onAfterEdit:function(data, rowindex, rowobj){
			//根据当前列的宽度数，设置多方数据值
			var allData = detailManagerR.rows;
			var columnname = data.column.columnname;
			if("deptName" == columnname){
				//获取部门名称是当前旧值的，遍历改变grid值
				//要求旧值和当前不一样的时候才处理，否则不变化
				if(deptValue!=data.value){
					//要求旧值和当前不一样的时候才处理，否则不变化
					$.each(allData,function(i,o){
						if(deptValue == o.deptName&&deptIdValue == o.deptId){
							
							detailManagerR.updateRow(o,{
								deptName: data.value,deptId: data.record.deptId
			            });
						}
					});
				}
			}else if("funTypeName" == columnname){
				//获取职能类别是当前旧值的，遍历改变grid值
				if(funValue!=data.value){
					//要求旧值和当前不一样的时候才处理，否则不变化

					$.each(allData,function(i,o){
						if(funValue == o.funTypeName&&deptIdValue == o.deptId){
							detailManagerR.updateRow(o,{
								funTypeName: data.value,funTypeId: data.record.funTypeId
			            });
						}
					});
				}
			}
			deptValue = null;
			funValue = null;
			deptIdValue = null;
			onEditShowData(null);
		},
		onAfterChangeColumnWidth: function () {
			onEditShowData(null);
		}
        
        
	});
	/*//主审批未结束，不允许查看子流程审批记录	*/	
	if(3!=$("#status").val()){
		detailManagerR.options.detail = null;
	}
	var workContactDetailId = $("#workContactDetailId").val();
	if(!workContactDetailId){
		$('#workApprovalHistoryTable').hide();
	}else{
		detailManagerR.options.detail = null;		
		var bizId = $("#workContactId").val();
		UICtrl.grid("#workApprovalHistory", {
			columns : [ 
			            { display : "环节名称", name : "name", width : 120, minWidth : 60, type : "string", align : "left" }, 
			            { display : "机构", name : "executorOgnName", width : 80 , minWidth : 60, type : "string", align : "left" },
			            { display : "部门", name : "executorDeptName", width : 80 , minWidth : 60, type : "string", align : "left" },
	                    { display : "任务类型", name : "taskKindTextView", width : 80 , minWidth : 60, type : "string", align : "left" },
	                    { display : "执行人", name : "executorPersonMemberName", width : 80, minWidth : 60, type : "string", align : "left" },
	            		{ display : "开始时间", name : "startTime", width : 140, minWidth : 60, type : "time", align : "left" },
			            { display : "结束时间", name : "endTime", width : 140, minWidth : 60, type : "time", align : "left" },
			            { display : "耗时(小时)", name : "duration", width : 80, minWidth : 60, type : "time", align : "left" },
			            { display : "状态", name : "statusName", width : 80, minWidth : 60, type : "time", align : "left" }
			             ],
			dataAction : "server",
			url : web_app.name + "/workflowAction!queryApprovalHistoryByBizId.ajax",
			parms: {bizId: bizId},
			usePager : false,
			width : "99.8%",
			height : "20%",
			rownumbers: true,
			heightDiff: -20,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox: true,
			enabledEdit: true,
			fixedCellHeight : true,
			selectRowButtonOnly : true
		});	
	}
}
/**
 * 合并单元格
 */
function mergeCell(columnName, $grid){
	var gridManager = $grid.ligerGetGridManager();
	var columnId = null;
	var columns = gridManager.options.columns;
	$.each(columns, function(i){
		if (this.name === columnName) {
			columnId = this.__id;
			return false;
		}
	});
	
	var i, j, k;
	i = -1;
	k = 1;
	j = "";
	x = 0;
	var cellname = "";
	var data =detailManagerR.getData();

//	console.log(columnId);
	$("td[id$='" + columnId + "']", $grid).each(function(index){
		var isequal = true;
		if(undefined ==data[i]){
			if(undefined ==data[x]){
				isequal = true;
			}else{
				isequal = false;
			}			
		}else if(undefined ==data[x]){
			isequal = false;			
		}else{
			isequal = data[i].deptId == data[x].deptId;
		}
		if (j == $("div", this).text()&&isequal) {
			/*console.log($("div", this).text());*/
			$(this).addClass("l-remove");
			k++;
			$("td[id='" + cellname + "']", $grid).attr("rowspan", k.toString());
		}
		else {
			j = $("div", this).text();
			var a = $(this);
			cellname = a.attr("id"); //得到点击处的id  
			k = 1;
			x = i;
		}
		i++;
	});
	$(".l-remove").remove();
};


function onEditShowData(hight) {
	var table=$('#maingrid');
	if(hight){
		$(".l-grid-row-cell-inner",table).css("height", hight);
	}else{
		$(".l-grid-row-cell-inner",table).css("height", "auto");
	}
	var i = 0;
	$("tr", ".l-grid2", table).each(function () {
		$($("tr", ".l-grid1", table)[i]).css("height", $(this).height());
		i++;
	});/*}*/
}

function yesNoRender(item, index, columnValue, columnInfo) {
    return yesOrNo[columnValue];
}

//添加按钮 
function addHandler() {
      UICtrl.addGridRow(	detailManagerR, { 
    	  sequence: detailManagerR.getData().length + 1,
    	  createDate: $("#fillinDate").val(), 
    	  deptName:"",
    	  deptId:""});
} 
//添加按钮 
function addDetailHandler() {
	 //设置当前行和上一行部门和职能一致,也是最后一行的部门和职能
	var data =detailManagerR.getData();
	var lastdata = data[data.length-1];
	if(data.length<=0){
		return;
	}
    var row =  UICtrl.addGridRow(	detailManagerR, 
    		 {sequence: detailManagerR.getData().length + 1,
	    	  createDate: $("#fillinDate").val(),
	    	  deptName:lastdata.deptName,
	    	  deptId:lastdata.deptId,
	    	  funTypeName:lastdata.funTypeName,
	    	  funTypeId:lastdata.funTypeId});
     //设置当前行和上一行部门和职能一致
      //自动合并
//		mergeCell("deptName","funTypeName",$("#maingrid"));

//  	var row = gridManager.getSelectedRow();
//  	detailManagerR.updateRow(row,{status:0});
//      detailManagerR.updateRow(o,{
//          scorePersonLevel: scorePersonLevel,
//          proportion: proportion
//      });
      doMergeCell();
		onEditShowData(null);
	
} 

function doMergeCell(){
    var grid = $("#maingrid");
    mergeCell("deptName", grid);
    mergeCell("funTypeName", grid);
}



function initDataBox(){
	$('#workContactIdAttachment').fileList();
	$("#funTypeName").searchbox({type : "bpm", name : "bizSegmentationByDept", 
		getParam : function() {
		    return { orgId: $("#deptId").val(), searchQueryCondition: "kind_id in (1,2) " };//kind_id in (1,2,3) 
		},
		back:{ bizSegmentationId: "#funTypeId", name: "#funTypeName" }
	});
}

//删除按钮
function deleteHandler(){
    DataUtil.delSelectedRows({ action: 'workContactAction!deleteWorkContactDetail.ajax',
        gridManager: detailManagerR,idFieldName: 'workContactDetailId',
        onSuccess: function () {
            detailManagerR.loadData();
        }
    });
}

function getExtendedData(){    
	var detailData = DataUtil.getGridData({gridManager: detailManagerR});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function getId() {
	var bizId = $("#workContactDetailId").val();
	var detailBizId = $("#detailBizId").val();
	if(bizId){
		return bizId || 0;		
	}else if(detailBizId){
		return detailBizId || 0;		
	}else{
		return $("#workContactId").val() || 0;		
	}
}

function setId(value){ 
	var bizId = $("#workContactDetailId").val();
	var detailBizId = $("#detailBizId").val();
	if(bizId){
		$("#workContactDetailId").val(value);
	}else if(detailBizId){
		$("#detailBizId").val(value);
	}else{
		$("#workContactId").val(value);
	}
	$('#workContactIdAttachment').fileList({bizId:$("#workContactId").val()});
}

function reloadGrid(){
	detailManagerR.options.parms['workContactId'] = $("#workContactId").val();
	detailManagerR.options.parms['workContactDetailId'] = $("#workContactDetailId").val();
    detailManagerR.loadData();
}

//查看子流程任务按钮 
function showDetailTaskDetailHandler(){
	var row = detailManagerR.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var  bizId=row.workContactDetailId;
	//根据选择数据的状态，判断当前是否审批完成，如果非审批完成，则不允许分配任务
	//状态非3，代表流程没有处理完成
	//	if (!taskId) {Public.tip('请先分配任务！'); return; } 
	if (0==row.status||row.status==undefined) {Public.tip('请先完成发起方的审批流程！'); return; }
	 var url=web_app.name + '/workContactAction!showWorkContactDetail.job?bizId='+bizId+'&isReadOnly=true';
	 parent.addTabItem({ tabid: 'workContactDetail'+bizId, text: '审批事项', url:url});
//	 UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showCreateTaskInfo.load', param:{workContactDetailId:workContactDetailId}, init:initSerchBox, ok: saveTask, close: dialogClose});
}

function enableWorkContactBill(){
	if (isApproveProcUnit()) {
		permissionAuthority['maingrid.showDetailTaskDetailHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.personName']={authority:'readwrite',type:'1'};
	}
	if(!Public.isReadOnly){
	 	setTimeout(function(){$('#workContactIdAttachment').fileList('enable');},0);
	}
}
//允许加减签
function allowAdd() {return true;}

function isApproveProcUnit(){
	return procUnitId == "Approve";
}

function getNotInSQL(){/*
	var personId = $("#personId").val();
	if(!personId){
		personId = OpmUtil.getPersonIdFromPsmId($('#personMemberId').val());
	} AND ( DEPT_ID  is NULL OR dept_id NOT IN ('-10','2','3') )*/
	
	var depeNotInSQL = "  AND (	t.CENTER_ID IS NULL OR T .CENTER_ID NOT IN (SELECT so.CENTER_ID	FROM SA_OPORG so WHERE so.DEPT_ID IN ('-10'";
	var tabledata = detailManagerR.getData();
	$.each(tabledata, function (index, data) {
		 if (data.deptId) {
				depeNotInSQL = depeNotInSQL + ",'"+ data.deptId+"'";
            }
	});
	depeNotInSQL = depeNotInSQL+")))";
	return depeNotInSQL;
}


function print(){
	printBill();
}
function printBill(){
	window.open(web_app.name + '/workContactFreeFlowAction!createPdf.load?workContactId='+ getId());	
}
 