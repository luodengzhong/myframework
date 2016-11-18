var questionTypeGridManager=null,personChooseGridManager=null,personToolbar=null,selectOrgDialog=null;
$(document).ready(function() {
	UICtrl.autoGroupAreaToggle();
	initializeUI();
	initToolBar();
	initializeGrid();
	initializePersonChooseGrid();
	//查询条件可用
	setTimeout(function(){UICtrl.setEditable($('#queryPersonDiv'));},0);
});

function initializeUI(){
	var readOnly=false;
	if(!isApply()||Public.isReadOnly){
		readOnly=true;
		if(isApproving()){//已发起允许编辑附件
			readOnly=false;
		}
	}
	$('#examStartFileList').fileList({readOnly:readOnly});
	$('#examinationTypeName').searchbox({
		type: 'hr', name: 'examinationType',
		back: {
			examinationTypeId: '#examinationTypeId', 
			timeout: '#timeout',
			passingScore: '#passingScore',
			retakeNum: '#retakeNum',
			code: '#examinationTypeCode',
			name:'#examinationTypeName'
		},
		onChange:function(){
			initManualMarking();
		}
	});
	if(!isApply()){
		UICtrl.setReadOnly($('#mainTableInput'));
		UICtrl.enable($('#retakeNum'));
		UICtrl.enable($('#remark'));
		UICtrl.enable($('#isViewAnswer1'));
		UICtrl.enable($('#isNotCreateNotify1'));
		UICtrl.enable($('#timeout'));
	}
	//阅卷人选择
	$('#managerName').orgTree({
		filter:'psm',
		back:{
			text:'#managerName',
			value:'#managerId',
			id:'#managerId',
			name:'#managerName'
		}
	});
	//是否允许人工阅卷
	$('#isManualMarking1').on('click',function(){
		setTimeout(initManualMarking,0);
	});
	initManualMarking();
}
//人工阅卷 考试次数为1
function initManualMarking(){
	if(Public.isReadOnly) return;
	var manualMarking=$('#isManualMarking1').is(':checked');
	if(manualMarking){//需要人工阅卷
		UICtrl.enable($('#managerName'));
	}else{
		//不允许选择阅卷人
		UICtrl.disable($('#managerName'));
		$('#managerName').val('');
		$('#managerId').val('');
	}
}

function canEidt(){
	var examStartId=$('#examStartId').val();
	return !(examStartId=='');
}
function isApply(){
	var status=$('#status').val()+'';
	return status=='0'
}
function isApproving(){
	var status=$('#status').val()+'';
	return status=='1'
}
function isCompleted(){
	var status=$('#status').val()+'';
	return status=='3'||status=='-1'
}
function initToolBar(){
	$('#toolBar').toolBar('removeItem');
	$('#toolBar').toolBar('addItem',[
		{id:'save',name:'保存',icon:'save',event:saveExamStart},
		{line:true},
		{id:'delete',name:'删除',icon:'deleteProcessInstance',event: doDelete},
		{line:true},
		{id:'turn',name:'发起考试',icon:'turn',event:saveDoStartExam},
		{line:true}
	]);
	if(!canEidt()){
		$("#toolBar").toolBar("disable", "delete");
	 	$("#toolBar").toolBar("disable", "turn");
	}
	if(Public.isReadOnly){
		$("#toolBar").toolBar("disable", "save");
	}
	if(!isApply()||Public.isReadOnly){//已发布的考试不能再保存
		$("#toolBar").toolBar("disable", "delete");
	 	$("#toolBar").toolBar("disable", "turn");
	}
}
//保存
function saveExamStart(fn){
	var types = DataUtil.getGridData({gridManager: questionTypeGridManager});
	if(!types){
		return false;
	}
	var manualMarking=$('#isManualMarking1').is(':checked');
	var managerId=$('#managerId').val();
	if(manualMarking&&managerId==''){
		Public.tip('请选择阅卷人!');
		return;
	}
	var url= web_app.name +'/examStartAction!saveExamStart.ajax';
	$('#submitForm').ajaxSubmit({url: url,
			param:{types:encodeURI($.toJSON(types))},
			success : function(data) {
				if(!canEidt()){
					setId(data);
				}
				reloadGrid();
				if($.isFunction(fn)){
					fn.call(window,data);
				}
			}
	});
}
//发起考试
function saveDoStartExam(){
	var examStartId=$('#examStartId').val();
	UICtrl.confirm('确定发起考试吗?',function(){
		saveExamStart(function(){
			Public.ajax(web_app.name + '/examStartAction!saveDoStartExam.ajax', {examStartId:examStartId}, function(){
				UICtrl.closeAndReloadTabs("TaskCenter", null);
			});
		});
	});
}
function setId(id){
	$('#examStartId').val(id);
	$('#examStartFileList').fileList({bizId:id});
	$("#toolBar").toolBar("enable", "delete");
	$("#toolBar").toolBar("enable", "turn");
	personToolbar.setEnabled("menuAdd");
    personToolbar.setEnabled("menuDelete");
    personToolbar.setEnabled("menuSaveImp");
    personToolbar.setEnabled("menusaveChooseDept");
	questionTypeGridManager.options.parms['examStartId'] =id;
	personChooseGridManager.options.parms['examStartId'] =id;
}
function reloadGrid() {
	questionTypeGridManager.loadData();
} 
//删除
function doDelete(){
	var examStartId=$('#examStartId').val();
	if(examStartId==''){
		return;
	}
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/examStartAction!deleteExamStart.ajax', {examStartId:examStartId}, function(){
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		});
	});
}

function initializeGrid(){
	var toolbarOptions =false
	if(isApply()){
		toolbarOptions=UICtrl.getDefaultToolbarOptions({ 
			addHandler: function(){
				showQuestionTypeDialog();
			}, 
			deleteHandler: function(){
				DataUtil.delSelectedRows({action:'examStartAction!deleteExamStartQuestionType.ajax',
					gridManager: questionTypeGridManager,idFieldName:'startQuestionTypeId',
					onSuccess:function(){
						questionTypeGridManager.loadData();
					}
				});
			}
		});
	}
	var columns=[{ display: "题目类型", name: "examQuestionTypeName", width: 400, minWidth: 60, type: "string", align: "left"}];
	var columnObje={display: '客观题', columns:[
		{ display: "取题个数", name: "titleNumber", width: 80, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:false,mask:'nnn'}
		},
		{ display: "每题分值", name: "questionScore", width: 80, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:false,mask:'nn'}
		}
	]};
	columns.push(columnObje);
	var columnSub={display: '主观题', columns:[
		{ display: "取题个数", name: "subTitleNumber", width: 80, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:false,mask:'nnn'}
		},
		{ display: "每题分值", name: "subQuestionScore", width: 80, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:false,mask:'nn'}
		}
	]};
	columns.push(columnSub);
	columns.push({ display: "总分值", name: "totalScore", width: 80, minWidth: 60, type: "string", align: "right"});
	var examStartId=$('#examStartId').length>0?$('#examStartId').val():'';
	var param={examStartId:examStartId,pagesize:1000};
	questionTypeGridManager = UICtrl.grid('#chooseExamQuestionTypeGrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/examStartAction!slicedQueryExamStartQuestionType.ajax',
		parms:param,
		width : '99%',
		height : '180',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'startQuestionTypeId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: isApply(),
		autoAddRowByKeydown:false,
		usePager: false,
		checkbox: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return canEidt();
		},
		onAfterEdit:function(e){
			var totalScore=0,flag=false;
			var titleNumber=parseInt(e.record['titleNumber'],10),questionScore=parseInt(e.record['questionScore'],10);
			var subTitleNumber=parseInt(e.record['subTitleNumber'],10),subQuestionScore=parseInt(e.record['subQuestionScore'],10);
			if(!isNaN(titleNumber)&&!isNaN(questionScore)){//计算行总分值
				totalScore+=titleNumber * questionScore;
				flag=true;
			}
			if(!isNaN(subTitleNumber)&&!isNaN(subQuestionScore)){//计算行总分值
				totalScore+=subTitleNumber * subQuestionScore;
				flag=true;
			}
			if(flag){
				questionTypeGridManager.updateCell('totalScore', totalScore, e.record);
				computeTotalScore();//计算全部总分值
			}
		}
	});
}
//计算本次考试总分值
function computeTotalScore(){
	var datas=questionTypeGridManager.getData();
	if(datas&&datas.length>0){
		var totalScore=0;
		$.each(datas,function(i,o){
			var ts=parseInt(o['totalScore'],10);
			totalScore+=isNaN(ts)?0:ts;
		});
		$('#totalScore').val(totalScore);
	}
}
//判断选择的类别是否已存在
function checkQuestionTypeExist(examQuestionTypeId,typeFullId){
	var datas=questionTypeGridManager.getData();
	var flag=true;
	if(datas&&datas.length>0){
		$.each(datas,function(i,o){
			if(examQuestionTypeId==o['examQuestionTypeId']){
				flag=false;
				return false;
			}
			//不允许选择父级及子级节点
			if(typeFullId.indexOf(o['typeFullId'])>-1||o['typeFullId'].indexOf(typeFullId)>-1){
				flag=false;
				return false;
			}
		});
	}
	return flag;
}
function showQuestionTypeDialog(){
  	UICtrl.showDialog({
  		title: "请选择题目类别",width: 350,
        content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul></ul></div>',
        init: function (doc) {
           $('ul',doc).commonTree({
           		loadTreesAction:'examSetUpAction!loadExaminationTypeTree.ajax',
			    parentId :'0',
				idFieldName: 'examQuestionTypeId',
			    textFieldName: "name",
			    IsShowMenu:false,
				getParam:function(){
					return {status:1};//只查询启用的数据
				}
			});
       },
       ok: function(doc){
       		var chooseNode = $('ul',doc).commonTree('getSelected');
		    var examQuestionTypeId = chooseNode.examQuestionTypeId;
		    var typeFullId=chooseNode.typeFullId;
		    if (!examQuestionTypeId) {
		        Public.tip('请选择题目类别！');
		        return false;
		    }
		    //校验是否已被选择
		    if(!checkQuestionTypeExist(examQuestionTypeId,typeFullId)){
		    	 Public.tip('选择的题目类别已存在,请重新选择！');
		        return false;
		    }
		    var _self=this;
            //校验类别是否可用
			var url=web_app.name + '/examSetUpAction!checkExamQuestionTypeAuthority.ajax';
			Public.ajax(url, {examQuestionTypeId:examQuestionTypeId}, function(data){
				var flag=data['flag']+'';
				if(flag==='true'){
					var fullName=data['fullName'];
					UICtrl.addGridRow(questionTypeGridManager,{examQuestionTypeId:examQuestionTypeId,examQuestionTypeName:fullName,typeFullId:typeFullId});
					_self.close();
				}else{
					Public.errorTip('您没有使用权限!');
					return false;
				}
			});
			return false;
       }
    });
}

function initializePersonChooseGrid(){
	var toolbarOptions = false;
	if(isApply()){
		 toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
			addHandler: showChooseOrgDialog, 
			deleteHandler: deletePersonChoose,
			saveImpHandler:saveImpHandler,
			saveChooseDept:{id:'saveChooseDept',text:'按部门或岗位选择',img:'page_user.gif',click:saveChooseDept}
		});
	}
	if(isApproving()){
		toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
			addHandler: showChooseOrgDialog, 
			deleteHandler: deletePersonChoose,
			saveImpHandler:saveImpHandler,
			saveChooseDept:{id:'saveChooseDept',text:'按部门或岗位选择',img:'page_user.gif',click:saveChooseDept},
			exportExcelHandler: function(){
				UICtrl.gridExport(personChooseGridManager);
			},
			saveTurnHandler:{id:'turn',text:'生成考试任务',img:'page_next.gif',click:reStartExam}
		});
	}
	var examStartId=$('#examStartId').length>0?$('#examStartId').val():'';
	personChooseGridManager = UICtrl.grid('#personChooseGrid', {
		columns: [
		{ display: "姓名", name: "personMemberName", width: 80, minWidth: 60, type: "string", align: "left"},		   
		{ display: "路径", name: "fullName", width: 500, minWidth: 60, type: "string", align: "left"},
		{ display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "考试次数", name: "examCount", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "是否合格", name: "isQualifiedTextView", width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+(item.isQualifiedTextView?item.isQualifiedTextView:'')+"</font>";
			}
		},
		{ display: "最终分数", name: "finalScore", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "开始考试时间", name: "examStartTime", width:100, minWidth: 60, type: "date", align: "left"},
		{ display: "完成考试时间", name: "examEndTime", width: 100, minWidth: 60, type: "date", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/examStartAction!slicedQueryExamStartPerson.ajax',
		parms:{examStartId:examStartId},
		pageSize:20,
		width : '99%',
		height : '450',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'examStartPersonId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		autoAddRowByKeydown:false,
		checkbox: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return canEidt();
		}
	});
	personToolbar = personChooseGridManager.toolbarManager;
    if(!canEidt()){
    	personToolbar.setDisabled("menuAdd");
    	personToolbar.setDisabled("menuDelete");
    	personToolbar.setDisabled("menuSaveImp");
    	personToolbar.setDisabled("menusaveChooseDept");
    }
}
function deletePersonChoose(){
	var examStartId=$('#examStartId').val();
	DataUtil.delSelectedRows({action:'examStartAction!deleteExamStartPerson.ajax',
		gridManager: personChooseGridManager,idFieldName:'examStartPersonId',param:{examStartId:examStartId},
		onSuccess:function(){
			personChooseGridManager.loadData();
		}
	});
}
//重复发起考试
function reStartExam(){
	var examStartId=$('#examStartId').val();
	DataUtil.delSelectedRows({action:'examStartAction!saveReStartPersonExam.ajax',message:'您确定重新发起考试任务吗?',
		gridManager: personChooseGridManager,idFieldName:'examStartPersonId',param:{examStartId:examStartId},
		onSuccess:function(){
			personChooseGridManager.loadData();
		}
	});
}
//打开机构选择对话框
function showChooseOrgDialog(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "请选择人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if(!canEidt()){
			    Public.errorTip("主表未保存，不能添加人员!");
				return;
			}
			var ids=[],_self=this;
			$.each(data,function(i,o){
				ids.push(o['id']);
			});
			var examStartId=$('#examStartId').val();
			var url=web_app.name + '/examStartAction!saveExamStartPerson.ajax';
			Public.ajax(url, {examStartId:examStartId,ids:$.toJSON(ids)}, function(data){
				personChooseGridManager.loadData();
				//执行保存操作
				_self.close();
			});
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function queryPerson(obj){
	var param = $(obj).formToJSON();
	param['examStartId']=$('#examStartId').val();
	UICtrl.gridSearch(personChooseGridManager, param);
}
function reQueryPerson(obj){
	$(obj).formClean();
	var param = $(obj).formToJSON();
	param['examStartId']=$('#examStartId').val();
	UICtrl.gridSearch(personChooseGridManager, param);
}
function reloadPersonGrid(){
	personChooseGridManager.loadData();
}
//导入数据
function saveImpHandler(){
	var serialId=$('#examStartId').val();
	if(!serialId){
		Public.tip('请先保存主记录！');
		return false;
	}
	UICtrl.showAssignCodeImpDialog({title:'导入考试人员',onClose:reloadPersonGrid,serialId:serialId,templetCode:'hrImpExamPerson'});
}
//按部门选择人员
function saveChooseDept(){
	 var examStartId=$('#examStartId').val();
	 if(examStartId==''){
	 	return;
	 }
	 if (!selectOrgDialog) {
        selectOrgDialog = UICtrl.showDialog({
            title: "请选择机构...",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="selectOrgDialogTree"></ul></div>',
            init: function () {
                $('#selectOrgDialogTree').commonTree({
                	loadTreesAction:'orgAction!queryOrgs.ajax',
            		parentId :'orgRoot',
            		manageType:'hrExaminationManage',
            		getParam : function(e){
            			if(e){
            				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
            			}
            			return {showDisabledOrg:0};
            		},
            		changeNodeIcon:function(data){
            			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
            		},
            		IsShowMenu:false
                });
            },
            ok: function(){
            	var moveToNode = $('#selectOrgDialogTree').commonTree('getSelected');
			    var fullId = moveToNode.fullId,orgKind=moveToNode.orgKindId;
			    if (!fullId) {
			        Public.tip('请选择组织节点！');
			        return false;
			    }
			    if(orgKind=='ogn'){
			    	Public.tip('只能选择部门或岗位！');
			        return false;
			    }
				var url=web_app.name + '/examStartAction!saveExamStartPersonByOrg.ajax';
				Public.ajax(url, {examStartId:examStartId,orgFullId:fullId}, function(data){
					reloadPersonGrid();
					selectOrgDialog.hide();
				});
            },
            close: function () {
                this.hide();
                return false;
            }
        });
    } else {
        selectOrgDialog.show().zindex();
    }
}