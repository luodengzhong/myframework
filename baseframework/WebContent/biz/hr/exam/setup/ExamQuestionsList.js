var gridManager = null,refreshFlag = false,examQuestionsItemGridManager=null,selectMoveDialog=null;
var yesorno={1:'是',0:'否'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 250,heightDiff : -5});
	
	$('#maintree').commonTree({
		loadTreesAction:'examSetUpAction!loadExaminationTypeTree.ajax',
		parentId :'0',
		idFieldName: 'examQuestionTypeId',
        textFieldName: "name",
		IsShowMenu:false,
		getParam:function(){
			return {status:1};//只查询启用的数据
		},
		changeNodeIcon:function(data){
			var url=web_app.name + "/themes/default/images/org/";
			var hasChildren=data.hasChildren;
			var status=data.status;
			url += hasChildren>0?'org':'dataRole';
			url += status>0?'.gif':'-disable.gif';
			data['nodeIcon']=url;
		},
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	if(data){
		var examQuestionTypeId=data.examQuestionTypeId;
		var typeFullId=data.typeFullId,typeName=data.name;
		//校验类别是否可用
		checkExamQuestionTypeAuthority(examQuestionTypeId,function(){
			changeTitle(typeName);
			$('#examQuestionTypeId').val(examQuestionTypeId);
			var showChildren=$('#showChildren1').is(':checked')?'1':'0';
			UICtrl.gridSearch(gridManager,{typeFullId:typeFullId,examQuestionTypeId:examQuestionTypeId,showChildren:showChildren});
		});
	}
}
//题目类别使用权限验证
function checkExamQuestionTypeAuthority(examQuestionTypeId,fn){
	var url=web_app.name + '/examSetUpAction!checkExamQuestionTypeAuthority.ajax';
	Public.removeTips();
	Public.ajax(url, {examQuestionTypeId:examQuestionTypeId}, function(data){
		var flag=data['flag']+'';
		if(flag==='true'){
			fn.call(window);
		}else{
			Public.errorTip('您没有使用权限!');
			return false;
		}
	});
}
//改变现实的表头
function changeTitle(title){
	var html=[];
	if(title){
		html.push('<font style="color:Tomato;font-size:13px;">[',title,']</font>');
	}
	html.push('题目信息');
	$('div.l-layout-center div.l-layout-header').html(html.join(''));
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		copyHandler:copyHandler,
		saveImpHandler:saveImpHandler,
		exportExcelHandler: function(){
				UICtrl.gridExport(gridManager);
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#mainGrid', {
		columns: [	   
		{ display: "题目名称", name: "itemName", width: '500', minWidth: 60, type: "string", align: "left"},
		{ display: "题目类型", name: "itemTypeTextView", width: '60', minWidth: 40, type: "string", align: "left"},
		//{ display: "默认分数", name: "score", width: '80', minWidth: 60, type: "string", align: "left"},
		{ display: "所属类别", name: "name", width: '100', minWidth: 60, type: "string", align: "left"},
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/examSetUpAction!slicedQueryExamQuestions.ajax',
		width : '99.5%',
		height : '100%',
		heightDiff : -10,
		pageSize : 20,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'examQuestionsId',
		sortOrder:'asc',
		enabledEdit: true,
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data);
		},
		onLoadData :function(){
			return !($('#examQuestionTypeId').val()=='');
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

var dialogButton = [
	{id : 'saveAndnew',name : '保存并新增',
	callback :function(){
		saveExamQuestions(function(){
			reloadGrid();
			examQuestionsItemGridManager.isDataChanged=false;
			UICtrl.gridSearch(examQuestionsItemGridManager,{questionsId:'-1'});
			$('#submitForm').formClean();
		});
		return false;
	}},
	{id : 'saveAndclose',name : '保存并关闭',
	callback :function(){
		var _self=this;
		saveExamQuestions(function(){
			refreshFlag = true;
		    _self.close();
		});
		return false;
	}}
];

function addHandler(){
	var examQuestionTypeId=$('#examQuestionTypeId').val();
	if(examQuestionTypeId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/examSetUpAction!showInsertExamQuestions.load',
		title: "添加题目",
		ok: saveExamQuestions, 
		close: dialogClose,
		width:800, 
		init:initDetailPage,
		button:dialogButton
	});
}

function updateHandler(data){
	if(!data){
		data = gridManager.getSelectedRow();
		if (!data) {Public.tip('请选择数据！'); return; }
	}
	var examQuestionsId=data.examQuestionsId;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/examSetUpAction!showUpdateExamQuestions.load', 
		title: "修改题目",
		param:{examQuestionsId:examQuestionsId},width:800,
		ok: saveExamQuestions, close: dialogClose,init:initDetailPage,
		button:dialogButton
	});
}
//保存
function saveExamQuestions(fn) {
	var detailData=DataUtil.getGridData({gridManager:examQuestionsItemGridManager});
	if(!detailData) return false;
	if(!checkExamQuestionsItem()) return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/examSetUpAction!saveExamQuestions.ajax',
		param:{questionsTypeId:$('#examQuestionTypeId').val(),detailData:encodeURI($.toJSON(detailData))},
		success : function(id) {
			$('#examQuestionsId').val(id);
			$('#examQuestionPicFileList').fileList({bizId:id});
			if($.isFunction(fn)){
				fn.call(window,id);
			}else{
				examQuestionsItemGridManager.options.parms['questionsId']=id;
				examQuestionsItemGridManager.loadData();
				refreshFlag = true;
			}
		}
	});
}
function copyHandler(){
	var data = gridManager.getSelectedRow();
	if (!data) {Public.tip('请选择数据！'); return; }
	var examQuestionsId=data.examQuestionsId;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/examSetUpAction!showUpdateExamQuestions.load', 
		title: "复制新增题目",width:800,
		param:{copyNewExamQuestionsId:examQuestionsId,isCopyNew:1},
		ok: saveExamQuestions, close: dialogClose,
		init:function(doc){
			//初始化表格
			initDetailPage();
			//将主键置空
			var itemName=$('#itemName').val();
			$('#examQuestionsId').val('');
			$('#itemName').val('复制新增'+itemName);
		},
		button:dialogButton
	});
}
function deleteHandler(){
	DataUtil.del({action:'examSetUpAction!deleteExamQuestions.ajax',
		gridManager:gridManager,idFieldName:'examQuestionsId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'examSetUpAction!updateExamQuestionsStatus.ajax',
		gridManager: gridManager,idFieldName:'examQuestionsId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'examSetUpAction!updateExamQuestionsStatus.ajax',
		gridManager: gridManager,idFieldName:'examQuestionsId', param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function moveHandler(){
	var ids = DataUtil.getSelectedIds({gridManager: gridManager, idFieldName: "examQuestionsId"});
    if (!ids) {
    	Public.tip('请选择数据！');
        return;
    }
    if (!selectMoveDialog) {
        selectMoveDialog = UICtrl.showDialog({
            title: "移动到...",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
            init: function () {
               $('#movetree').commonTree({
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
            ok: function(){
            	doMove(ids);
            },
            close: function () {
                this.hide();
                return false;
            }
        });
    } else {
        selectMoveDialog.show().zindex();
    }
}
function doMove(ids){
	var moveToNode = $('#movetree').commonTree('getSelected');
	 if (!moveToNode) {
        Public.tip('请选择移动到的节点！');
        return false;
    }
    var moveToId = moveToNode.examQuestionTypeId;
    var params = {questionsTypeId:moveToId,ids:$.toJSON(ids)};
    Public.ajax("examSetUpAction!moveExamQuestions.ajax", params, function (data) {
        reloadGrid();
        selectMoveDialog.hide();
    });
}

//关闭编辑框刷新列表
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function initDetailPage(){
	$('#examQuestionPicFileList').fileList({filetype:'gif|jpg|jpeg|png|bmp'.split('|')});//只允许上传图片
	$('#detailItemType').combox({onTrigger:function(data){
		var isSubjective=$('#isSubjective1').getValue();
		if(isSubjective==0){
			return [{"text":"多项选择","value":"checkbox"},{"text":"单项选择","value":"radio"},{"text":"不定项选择","value":"checkbox1"}]
		}else{
			return [{"text":"主观回答","value":"text"}];
		}
	}});
	$('#isSubjective1').parent().on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('input')){
    		setTimeout(function(){
    			var isSubjective=$('#isSubjective1').getValue();
    			if(isSubjective==0){
    				$('#detailItemType').combox('setValue','');
    			}else{
    				$('#detailItemType').combox('setValue','text');
    			}
    		},0);
    	} 
    });
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			UICtrl.addGridRow(examQuestionsItemGridManager,{isCorrect:0});
		}, 
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'examSetUpAction!deleteExamQuestionsItem.ajax',
				gridManager:examQuestionsItemGridManager,idFieldName:'examQuestionsItemId',
				onSuccess:function(){
					examQuestionsItemGridManager.loadData();
				}
			});
		}
	});
	var examQuestionsId=$('#examQuestionsId').val();
	if(examQuestionsId==''){//复制新增的数据需要查询明细
		examQuestionsId=$('#copyNewExamQuestionsId').val();
	}
	var param={questionsId:examQuestionsId};
	param[gridManager.options['pagesizeParmName']]=1000;
	examQuestionsItemGridManager = UICtrl.grid('#examQuestionsItemGrid', {
		columns: [
		{ display: "描述", name: "description", width: 550, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:true,maxLength:'220'}
		},		   
		{ display: "正确答案", name: "isCorrect", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:yesorno,required: true},
			render: function (item) { 
				return yesorno[item.isCorrect];
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/examSetUpAction!slicedQueryExamQuestionsItem.ajax',
		parms:param,
		width : '99.8%',
		height : '200',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'examQuestionsItemId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		autoAddRowByKeydown:false,
		usePager: false,
		checkbox: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !(examQuestionsId=='');
		},
		onAfterShowData:function(){
			var flag=$('#examQuestionsId').val()=='';
		    if(flag){//复制新增的数据
		    	var g=examQuestionsItemGridManager;
		    	//清除标志
		    	for (var rowid in g.records){
	               delete g.records[rowid]['examQuestionsItemId'];
	               delete g.records[rowid]['questionsId'];
	               g.records[rowid]['__status']='add';
	            }
		    }
		}
	});
}
//根据题目类型校验题目答案是否合法
function checkExamQuestionsItem(){
	var itemType=$('#itemType').val();
	var datas=examQuestionsItemGridManager.getData();
	if(datas&&datas.length>0){
		var isCorrectNum=0;
		$.each(datas,function(i,o){
			if(parseInt(o['isCorrect'],0)===1){
				isCorrectNum++;
			}
		});
		if(isCorrectNum==0){
			Public.tip('请确定题目的正确答案！');
			return false;
		}
		if(itemType=='radio'&&isCorrectNum>1){
			Public.tip('单选类型的题目只允许有一个正确答案,请确认！');
			return false;
		}
	}
	return true;
}

//导入数据
function saveImpHandler(){
	var examQuestionTypeId=$('#examQuestionTypeId').val();
	if(examQuestionTypeId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAssignCodeImpDialog({title:'导入考试题目',onClose:reloadGrid,serialId:examQuestionTypeId,templetCode:'hrImpExamQuestions'});
}