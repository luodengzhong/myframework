var detailManagerR = null, refreshFlag = false ,infoDemandWorkData = null,infoDemandUrgentData , yesOrNo = {0:'否', 1:'是'};

var handlerArray=new Array();//处理人
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	infoDemandWorkData = $("#infoDemandWorkList").combox("getJSONData");
	infoDemandUrgentData = $("#infoDemandUrgentList").combox("getJSONData");
	enableWorkContactBill();
	/*initFunTypeName();*/ 
	initDataBox();
	initializeGrid();
	queryAskReportHandler();
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
		deleteHandler: deleteHandler
		
	});
	detailManagerR = UICtrl.grid('#maingrid', {
		columns: [ 
		{ display: "联系部门", name: "deptName",  width: 120, minWidth: 80, type: "string", align: "left" ,
			editor: { type: 'tree', required: true,data:{name : 'org',width:250,hasSearch:false,filter:'dpt',getParam:function(rowData){
				return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}}, 
            beforeChange: function(nodeData, editParm){
				var fullName = nodeData.fullName;
				editParm.record['fullName']=fullName;
			},
			
            textField:'deptName',valueField:'deptId'}
	    },	 
	    { display: "全路径", name: "fullName",  width: 200, minWidth: 80, type: "string", align: "left"},	 
	   	{ display: "对接人", name: "personName",  width: 120, minWidth: 80, type: "string", align: "left" ,
            editor: { type: 'select', required: false, data: { type: "sys", name: "orgSelect",
                getParam: function (item) {
        			var deptId=item.deptId;
                    return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm' "};//kind_id in (1,2,3) 
                },
                back: { id: "personId", personMemberName: "personName" }
            }}
        },		    	
		{ display: "事项描述", name: "description",  width: 800, minWidth: 80, type: "string", align: "left" ,
		    editor: { type: 'text',max:512, required: true}}	
		],
		dataAction : 'server',
		url: web_app.name+'/workContactFreeFlowAction!slicedQueryContactDetail.ajax?',
		//slicedQuery***
        parms: {
        	workContactId: $("#workContactId").val(),
        	pagesize:1000
        },
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
		/*detail: {height:'auto', onShowDetail: function(row, detailPanel,callback){
			var url=web_app.name+'/common/TaskExecutionList.jsp';
			Public.load(url,{procUnitId:'Approve',bizId:row.detailBizId},function(data){
				var div=$('<div></div>').css({'paddingLeft':'20px','paddingTop':'5px',overflow:'hidden'});
				div.html(data);
				$(detailPanel).append(div);
			});
        }},*/
        onLoadData :function(){
			return !($('#workContactId').val()=='');
		},
		onAfterShowData: function (data, rowindex, rowobj) {
			/*doMergeCell();*/
			onEditShowData(null);
		},			
		onBeforeEdit:function(data, rowindex, rowobj){
			/*var columnname = data.column.columnname;
			if("deptName" == columnname){
				//获取责任部门当前旧值
				deptValue = data.value;
				deptIdValue = data.record.deptId;
			}else if("funTypeName" == columnname){
				//获取职能类别当前旧值
				funValue = data.value;
				deptIdValue = data.record.deptId;
			}*/
			onEditShowData(25);
		},
		onAfterEdit:function(data, rowindex, rowobj){
			//根据当前列的宽度数，设置多方数据值
			/*var allData = detailManagerR.rows;*/
			/*var columnname = data.column.columnname;
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
			}*/
			/*deptValue = null;
			funValue = null;
			deptIdValue = null;*/
			onEditShowData(null);
		},
		onAfterChangeColumnWidth: function () {
			onEditShowData(null);
		}
        
        
	});
	/*//主审批未结束，不允许查看子流程审批记录	*/	
	/*if(3!=$("#status").val()){
		detailManagerR.options.detail = null;
	}*/
/*	var workContactDetailId = $("#workContactDetailId").val();
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
	}*/
}
/**
 * 合并单元格
 *//*
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
			console.log($("div", this).text());
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
*/

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

/*function yesNoRender(item, index, columnValue, columnInfo) {
    return yesOrNo[columnValue];
}*/

//添加按钮 
function addHandler() {
      UICtrl.addGridRow(	detailManagerR, { 
    	  sequence: detailManagerR.getData().length + 1,
    	  createDate: $("#fillinDate").val(), 
    	  deptName:"",
    	  deptId:""});
} 


function initDataBox(){
	$('#workContactIdAttachment').fileList();
	/*$("#funTypeName").searchbox({type : "bpm", name : "bizSegmentationByDept", 
		getParam : function() {
		    return { orgId: $("#deptId").val(), searchQueryCondition: "kind_id in (1,2) " };//kind_id in (1,2,3) 
		},
		back:{ bizSegmentationId: "#funTypeId", name: "#funTypeName" }
	});
*/
	$("#btnSelectPerson").click(function () {
		showChooseHandlerDialog();
    });
	if(UICtrl.isApplyProcUnit()){//在申请环节显示处理人选择框
		$('#chooseHandlerTd').show();
		$('#chooseHandlerTd').find('span').show();
	}
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
	var param = {};
	param['detailData']=encodeURI($.toJSON(detailData));
	if(UICtrl.isApplyProcUnit()){
		//自由流程需要选择处理人
		var handlerLength=handlerArray.length;
		if(handlerLength==0){
			//将判断移动到提交判断中
			Public.tip('请选择审批人!');
			return false;
		}
		var personsArray=new Array();
		personsArray.push.apply(personsArray,handlerArray);
		param['handlerDetailData']=encodeURI($.toJSON(personsArray));
	}
	return param;
}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function getId() {
		return $("#workContactId").val() || 0;
}

function setId(value){ 
	/*var bizId = $("#workContactDetailId").val();
	var detailBizId = $("#detailBizId").val();
	if(bizId){
		$("#workContactDetailId").val(value);
	}else if(detailBizId){
		$("#detailBizId").val(value);
	}else{*/
		$("#workContactId").val(value);
	/*}*/
	$('#workContactIdAttachment').fileList({bizId:$("#workContactId").val()});
}

function reloadGrid(){
	detailManagerR.options.parms['workContactId'] = $("#workContactId").val();/*
	detailManagerR.options.parms['workContactDetailId'] = $("#workContactDetailId").val();*/
    detailManagerR.loadData();
}

//查看子流程任务按钮 
/*function showDetailTaskDetailHandler(){
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
}*/

function enableWorkContactBill(){
	if (isApproveProcUnit()) {
		permissionAuthority['maingrid.showDetailTaskDetailHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.personName']={authority:'readwrite',type:'1'};
	}
	if(!Public.isReadOnly){
	 	setTimeout(function(){$('#workContactIdAttachment').fileList('enable');},0);
	}
}

function enableWorkContactBill(){
	if (isApproveProcUnit()) {//showDetailTaskDetailHandler  按钮事件
		permissionAuthority['maingrid.showDetailTaskDetailHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.personName']={authority:'readwrite',type:'1'};
	}
	if(!Public.isReadOnly){
	 	setTimeout(function(){$('#workContactIdAttachment').fileList('enable');},0);
	}
}

function isApproveProcUnit(){
	return procUnitId == "Approve";
}

/**
* 检查约束
* 
*/
function checkConstraints() {
	var subject=$('#title').val();
	if(subject==''){
		Public.tip('请输入标题!');
		return false;
	}
	var data =detailManagerR.getData();
	if(!data||data.length<=0){
		Public.tip('请设置事项内容!');
		return false;
	}
	if(UICtrl.isApplyProcUnit()){
		//自由流程需要选择处理人
		var handlerLength=handlerArray.length;
		if(handlerLength==0){
			Public.tip('请选择审批人!');
			return false;
		}
	}
    return true;
}

//允许加减签
function allowAdd() {return true;}
function showChooseHandlerDialog(){
	var params = {};
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    params = $.extend({}, params, selectOrgParams);
    UICtrl.showFrameDialog({
        title: '审批人选择',
        width: 800,
        height: 380,
        url: web_app.name + '/workflowAction!showCounterSignDialog.do',
        param: params,
        init:function(){
        	var addFn=this.iframe.contentWindow.addData;
			if($.isFunction(addFn)){//初始化已选择列表
				this.iframe.contentWindow.isInitializingData = true;
				$.each(handlerArray,function(i,d){
					addFn.call(window,d);
				});
				this.iframe.contentWindow.isInitializingData = false;
			}
        },
        ok: function(){
        	var fn = this.iframe.contentWindow.getChooseGridData;
		    var params = fn();
		    if (!params) { return;}
		    //清空数组
			handlerArray.splice(0,handlerArray.length);
			$.each(params,function(i,o){
				o['orgUnitId']=o['handlerId'];
				o['orgUnitName']=o['handlerName'];
				o['id']=o['handlerId'];
				o['name']=o['handlerName'];
				o['kindId']='handler';
				handlerArray.push(o);
			});
			//处理人列表排序
			handlerArray.sort(handlerArraySort);
			initShowDivText('handler');
			this.close();
        },
        cancelVal: '关闭',
        cancel: true
    });
}

//加载已存在的处理人信息
function queryAskReportHandler(){
	Public.ajax(web_app.name + '/workContactFreeFlowAction!queryWorkContactHandler.ajax', {bizId:getId(),procUnitId:"Approve"}, function(data){
		
		var kindId=null;
		$.each(data,function(i,d){
			/*d['orgUnitId']=d['handlerId'];
			d['orgUnitName']=d['handlerName'];
			d['id']=d['handlerId'];
			d['name']=d['handlerName'];
			d['kindId']='handler';*/
			handlerArray.push(d);
		});
		//处理人列表排序
		handlerArray.sort(handlerArraySort);
		initShowDivText('handler');
	});
}

//初始化显示
function initShowDivText(personKind){
	var personArray=window[personKind+'Array'];
	var showDiv=$('#'+personKind+'ShowDiv');
	var html=new Array();
	if(personKind=='handler'){
		html.push(UICtrl.getProcessTemplateUsersHtml(personArray));
	}else{
		$.each(personArray,function(i,o){
			html.push('<span title="',o['fullName'],'">');
			html.push(o['orgUnitName']);
			html.push('</span">;&nbsp;');
		});
	}
	showDiv.html(html.join(''));
}

function handlerArraySort(o1,o2){
	var g=o1['groupId']*100,q=o2['groupId']*100;
	var a=o1['sequence'],b=o2['sequence'];
	return (g+a)>(q+b)?1:-1
}


//清空已选择列表
function clearChooseArray(personKind){
	var personArray=window[personKind+'Array'];
	$('#'+personKind+'ShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}

//选择流程模板
function chooseProcessTemplate(){
	UICtrl.chooseProcessTemplate(function(datails,title){
		handlerArray.splice(0,handlerArray.length);
		$.each(datails,function(i,o){
			o['commonHandlerId']='';
			handlerArray.push(o);
		});
		var subject=$('#subject').val();
		if(subject==''){
			$('#subject').val(title);
			$('#editSubject').html(title);
		}
		//处理人列表排序
		handlerArray.sort(handlerArraySort);
		initShowDivText('handler');
		this.close();
	});
}

//保存流程模板
function saveProcessTemplate(){
	if(handlerArray.length==0){
		Public.tip('请选择处理人!');
		return false;
	}
	UICtrl.saveProcessTemplate(handlerArray);
}


function print(){
	printBill();
}
function printBill(){
	window.open(web_app.name + '/workContactFreeFlowAction!createPdf.load?workContactId='+ getId());	
}
