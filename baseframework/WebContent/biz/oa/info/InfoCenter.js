var accordion = null,infoKindTreeManager=null,gridManager=null,centerLayoutManager=null;
var nowInfoPromulgateId=null;
var queryParams={};
var centerMinTopHeight=5;
var infoKindData={};//信息类别树
var shortcutInfoSearchData={};//缓存自定义的查询方案
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	UICtrl.autoGroupAreaToggle();
	initializeUI();
	initInfoCenterTree();//查询类别树
	initializeGrid();
	bindEvent();
	initInfoCollectToolBar();
});
var icons={
	folder:web_app.name + "/themes/default/images/icons/folder.gif",
	drafts:web_app.name + "/themes/default/images/icons/folder_page.gif",
	sent:web_app.name + "/themes/default/images/icons/folder_go.png",
	inbox:web_app.name + "/themes/default/images/icons/folder_images.gif",
	note:web_app.name + "/themes/default/images/icons/folder_page_white.png"
}
//加载信息分类树
function initInfoCenterTree(){
	var infoKindTreeData=[];
	infoKindTreeData.push({id:'0' ,name: '个人文件夹'});
	infoKindTreeData.push({ name: '草稿箱',id:'drafts',parentId:'0', icon: icons.drafts });
	infoKindTreeData.push({ name: '已发送',id:'sent',parentId:'0', icon: icons.sent });
	var buildTree=function(data){
		var parentId=null,hasChildren=null;
		$.each(data,function(i,o){
			parentId= o['parentId'];
			hasChildren=o['hasChildren'];
			//修改显示图标
			if(parentId=='0'){
				o['icon']= icons.inbox;
			}else{
				if(hasChildren==0){
					o['icon']= icons.note;
					infoKindData[o['id']]=o['name'];
				}else{
					o['icon']= icons.folder;
				}
			}
		});
		infoKindTreeData.push.apply(infoKindTreeData,data);
		//初始化树结构
		infoKindTreeManager=UICtrl.tree('#infoKindtree',{
			data:infoKindTreeData,
			textFieldName: 'name',
			parentIDFieldName: 'parentId',
			nodeWidth: 120,
			onClick: onTreeNodeClick
		});
		//初始化类别选择框
		$('#selectViewInfoKind').combox({data:infoKindData,checkbox:true});
		$('#selectViewInfoKind').parent().find('div.ui-combox-wrap').show();
	};
	//该方法中同步查询用户自定义的查询条件
	Public.ajax(web_app.name + '/oaInfoAction!loadInfoCenterTree.ajax', {queryScheme:true,schemeKind:'info'}, function(data){
		buildTree.call(window,data.treeData);
		buildQueryScheme(data.queryScheme);//自定义查询方案
	});
}
//树节点点击事件
function onTreeNodeClick(node,obj){
	if (!$(obj).is('span')&&!$(obj).hasClass('l-checkbox')) return;
	var data=node.data,id=data.id;
	queryParams['infoKindId']=id;
	delete queryParams['queryKind'];//删除查询类别
	doQueryInfoList();
}
function initializeUI(){
	var layout=$("#layout"),bodyHeight,accordionDiff=101;
	UICtrl.layout(layout, { 
		leftWidth : 250, 
		heightDiff : -5 ,
		onHeightChanged: function(options){
			bodyHeight = layout.height();
			if (accordion && options.middleHeight - accordionDiff > 0){
                  accordion.setHeight(options.middleHeight - accordionDiff);
			}
		},
		onSizeChanged:function(){
			setTimeout(function(){gridResize();},0);
			if(centerLayoutManager){//同时改变
				centerLayoutManager._onResize.call(centerLayoutManager);
			}
		}
	});
	bodyHeight=$("#layout").height();
	accordion=UICtrl.accordion('#mainmenu',{height: bodyHeight - accordionDiff, speed: null});
	centerLayoutManager=UICtrl.layout('#centerLayout', {
		topHeight:300,
		minTopHeight:centerMinTopHeight,
		onHeightChanged:function(options){
			setTimeout(function(){gridResize();},0);
		},
		onEndResize:function(direction){
			if(direction.direction='top'){
				gridResize();
				centerLayoutManager._bulid();//重新计算显示位置
			}
		}
	});
	//修改样式增加切换按钮
	$('div.l-layout-top').css('border','0px none');
	layout.children('div.l-layout-center').css({'border':'0px none','borderRight':'1px solid #C6C6C6','borderBottom':'1px solid #C6C6C6'});
	$('#centerLayout').find('div.l-layout-drophandle-top').html('<span id="headerToggle" class="header-toggle header-toggle-top"> </span>');
	$('div.l-layout-header-inner').html('<div id="addInfoToolBar"></div>');
	$('#addInfoToolBar').toolBar([{id:'addNewInfo',name:'发布新信息',icon:'add',event:newInfo}]).css({background:'none',borderWidth:'0'});
	$("#selectDateRange").combox({
			onChange: function(item){
				dateRangeKindId = item.value;
				(dateRangeKindId == 10) ? $("#customDataRange").show() : $("#customDataRange").hide();
			}
	});
	setTimeout(function(){
		//查询条件默认不显示
		$('#titleConditionArea').find('a.togglebtn').trigger('click');
		$('#divConditionArea').hide();
	},0);
	//公司发文查询条件
	initDispatchNoQueryUI();
}

function bindEvent(){
	//上下显示切换 不能使用click 上层节点已绑定mousedown事件
    $('#headerToggle').on('mousedown',function(e){
    	var visible=$(this).hasClass('header-toggle-bottom');
    	var height=$('#centerLayout').height();
    	if(visible){
    		centerLayoutManager.top.height(300);
    	}else{
    		centerLayoutManager.top.height(centerMinTopHeight);
    	}
    	gridResize();
    	centerLayoutManager._bulid();//重新计算显示位置
    	$(this).addClass(!visible?'header-toggle-bottom':'header-toggle-top').removeClass(!visible?'header-toggle-top':'header-toggle-bottom');
        e.preventDefault();
		e.stopPropagation();
	    return false;
    });
    //快捷查询按钮
    $('#ui-grid-query-button').on('click',function () {
         doQueryInfoList($('#ui-grid-query-input').val());
     });
     $('#ui-grid-query-input').on('keyup',function (e) {
         var value = $(this).val();
         var k = e.charCode || e.keyCode || e.which;
         if (k == 13) {
             doQueryInfoList(value);
         }
    });
    //日期范围选择
    $('#queryDateRangeDiv').on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('input')){
    		setTimeout(doQueryInfoList,0);
    	} 
    });
    //我的任务事件绑定
	$('#myselfInfoSearch').bind('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		$('div.taskCenterChoose').removeClass('taskCenterChoose');
		if($clicked.hasClass('taskCenterSearch')){
			var schemeId=$clicked.attr('id');
			var queryKind = $clicked.attr('queryKind');
			if(schemeId&&Public.isBlank(queryKind)){//自己定义的快捷查询
				var param=shortcutInfoSearchData[schemeId];
				if(param){
					var tempParams={dispatchNoInfo:''};//这里需要对中文编码
					$.each(param,function(p,o){
						tempParams[p]=encodeURI(o);
					});
					UICtrl.gridSearch(gridManager, tempParams);
					clearPreviewInfo();
					clearQueryInput();
				}
			}else{//系统级查询
				$clicked.addClass('taskCenterChoose');
				queryParams['queryKind']=queryKind;
				delete queryParams['infoKindId'];//点击时不处理信息类别
				doQueryInfoList();
			}
		}else if($clicked.hasClass('ui-icon-trash')){//删除
			deleteQueryScheme($clicked.parent().attr('id'),$clicked.parent().text());
		}else if($clicked.hasClass('ui-icon-edit')){//编辑
			var schemeId=$clicked.parent().attr('id');
			var param=shortcutInfoSearchData[schemeId];
			$('#queryMainForm').formSet(param);
			if($('#divConditionArea').is(':hidden')){
				$('#titleConditionArea').find('a.togglebtn').trigger('click');
			}
			$('div.updateTaskQueryScheme').removeClass('updateTaskQueryScheme');
				//时间是否显示
			(param.dateRange == 10) ? $("#customDataRange").show() : $("#customDataRange").hide();
			$clicked.parent().addClass('updateTaskQueryScheme');
		}
	});
}
function reSetCenterTopHeight(){
	centerLayoutManager.top.height(300);
    gridResize();
    centerLayoutManager._bulid();//重新计算显示位置
    $(this).removeClass('header-toggle-bottom').addClass('header-toggle-top');
}
function clearQueryInput(){
	$('#ui-grid-query-input').val('');
	$('#queryDateRange1').setValue(1);
}

//改变大小同时修改表格显示大小
function gridResize(){
	if(gridManager){
		var height=$('#centerLayout').find('div.l-layout-top').height();
		gridManager.options.height=height;//控制高度 在 _onResize 是需要引用
		gridManager._setHeight(height);
	}
	//iframe 显示大小
	if($('#iFrameBusinessDiv').length>0){
		setTimeout(function(){
			setIFrameBusinessHeight();
		},0);
	}
	//图片显示大小
	var pic=$('#showTextBodyPicture');
	if(pic.length>0){
		var maxWidth=$('#previewMainDiv').width();
		UICtrl.autoResizeImage(pic,maxWidth);
	}
}
function setIFrameBusinessHeight(){
	if($('#iFrameBusinessDiv').length>0){
		var centerHeight=$('#centerLayout').find('div.l-layout-center').height();
		var titleHeight=$('#previewTitleDiv').height();
		$('#iFrameBusinessDiv').height(centerHeight-titleHeight-10);
	}
}
function reloadGrid(){
	gridManager.loadData();
}
//初始化信息列表
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "类型", name: "kindName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "主题", name: "subject", width: 400, minWidth: 60, type: "string", align: "left",frozen: true,
			render: function (item) { 
				return ['<div title="',item.subject,'">',item.subject,'</div>'].join('');
			}
		},		   
		{ display: "编号", name: "billCode", width: 90, minWidth: 60, type: "string", align: "left" },
		{ display: "主题词", name: "keywords", width: 140, minWidth: 60, type: "string", align: "left" },	
		{ display: "状态", name: "statusTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "发布时间", name: "finishTime", width: 130, minWidth: 60, type: "datetime", align: "left" },
		{ display: "生效时间", name: "effectiveTime", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "最后修改时间", name: "lastUpdateTime", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "发送人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "发送人路径", name: "fullName", width: 200, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return ['<div title="',item.fullName,'">',item.fullName,'</div>'].join('');
			}
		},
		{ display: "接收人", name: "receiverName", width: 140, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
					return ['<div title="',item.receiverName,'">',item.receiverName,'</div>'].join('');
			}
		}
		],
		dataAction : 'server',
		url : web_app.name + '/oaInfoAction!slicedQueryInfoPromulgate.ajax',
		parms:queryParams,//默认条件
		pageSize : 20,
		width : '100%',
		height : '300',
		inWindow:false,
		headerRowHeight : 25,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onSelectRow:function(data){
			var id=data.infoPromulgateId;
			if(id!=nowInfoPromulgateId){
				nowInfoPromulgateId=id;
				//预览
				previewInfo(data.infoPromulgateId);	
			}
		},
		onDblClickRow : function(data, rowindex, rowobj,e) {
			onDblClick(data);
		}
	});
}
//执行查询
function doQueryInfoList(keywords,flag){
	if(!gridManager){
		return;
	}
	if(typeof keywords =='string'){
		queryParams['keywords']=encodeURI(keywords);
	}
	var dateRange=$('#queryDateRange1').getValue();
	queryParams['dateRange']=dateRange;
	if(flag){//是页面点击按钮
		dateRange=$('#selectDateRange').val();
		if (dateRange == 10 && (!getStartDate() || !getEndDate())){
			Public.tip("请选择开始日期和结束日期！");
			return;
		}
		clearQueryInput();
		var param = $(keywords).formToJSON();
		queryParams=$.extend(queryParams,param);
	}
	queryParams['dispatchNoInfo']='';
	UICtrl.gridSearch(gridManager, queryParams);
	//clearPreviewInfo();
	//恢复列表页
	reSetCenterTopHeight();
}
function clearPreviewInfo(){
	$('#previewInfo').html('');
	nowInfoPromulgateId=null;
	//隐藏任务收藏栏
	triggerInfoCollectToolBar(false);
}
function getStartDate (){
	return $("#editStartDate").val();
}

function getEndDate (){
	return $("#editEndDate").val();
}
//打开信息记录
function onDblClick(data){
	var infoKindId=queryParams['infoKindId'];
	var id=data.infoPromulgateId;
	if(infoKindId=='drafts'||infoKindId=='sent'){//在草稿箱或发件箱中点击进入编辑页面
		var url=web_app.name + '/oaInfoAction!showUpdateInfoPromulgate.job?useDefaultHandler=0&infoPromulgateId='+id;
		parent.addTabItem({ tabid: 'InfoPromulgateModif'+id, text: '信息编辑', url:url});
	}else{
		var url=web_app.name + '/oaInfoAction!toHandleInfoPromulgate.job?useDefaultHandler=0&infoPromulgateId='+id;
		parent.addTabItem({ tabid: 'InfoPromulgateHandle'+id, text: '信息处理', url:url});
	}
}
//新增信息
function newInfo(){
	var url=web_app.name + '/oaInfoAction!showInsertInfoPromulgate.job';
	parent.addTabItem({ tabid: 'InfoPromulgate', text: '信息发布 ', url:url});
}
function previewInfo(id){
	//hasRead 标记需要记录阅读者信息
	$("#previewInfo").load(web_app.name + '/oaInfoAction!previewInfo.load',{infoPromulgateId:id,hasRead:true},function(){
		var showInfoAttachment=$('#showInfoAttachment');
		if(showInfoAttachment.find('div.file').length>0){
			var infoAttachment=$('#previewInfoAttachment').fileList();
			showInfoAttachment.show();
		}
		//显示任务收藏栏
		triggerInfoCollectToolBar(true);
		//调整iframe显示高度
		setIFrameBusinessSize();
		//设置图片显示大小
		setTextBodyPictureSize();
	});
}
//调整iframe显示高度
function setIFrameBusinessSize(){
	if($('#iFrameBusinessDiv').length>0){
		var converUrl=$('#iFrameBusinessURL').val();
		if($('#iFrameBusinessURL').length>0&&converUrl!=''){
			AttachmentUtil.addConvertPreviewFileIFrame($('#iFrameBusinessDiv'),converUrl);
			$("#previewInfoMainDiv").css('overflowY','hidden');
		}
		setIFrameBusinessHeight();
	}else{
		$("#previewInfoMainDiv").css('overflowY','auto');
	}
}
//设置等比例缩放图片
function setTextBodyPictureSize(){
	var pic=$('#showTextBodyPicture');
	if(pic.length>0){
		var maxWidth=$('#previewMainDiv').width();
		UICtrl.autoResizeImage(pic,maxWidth);
	}
}
//显示或隐藏标题
function toggleSubject(){
	var div=$('#toggleTitleDiv');
	var visible=div.is(':visible');
	$('#navTitleIcon').addClass(visible?'email':'emailOpen').removeClass(visible?'emailOpen':'email');
	$('#navTitleLink').toggleClass('togglebtn-down');
	div.toggle();
	setIFrameBusinessHeight();
}
//保存任务查询方案
function saveQueryScheme(obj){
	var dateRange=$('#selectDateRange').val();
	if (dateRange == 10 && (!getStartDate() || !getEndDate())){
		Public.tip("请选择开始日期和结束日期！");
		return;
	}
	var param = $(obj).formToJSON({encode:false});
	var div=$('#shortcutInfoSearch').find('div.updateTaskQueryScheme');
	var schemeId='',schemeName='';
	if(div.length>0){
		schemeId=div.attr('id');
		schemeName=div.text();
	}
	var html=['<div style="width:240px">','方案名称&nbsp;'];
	html.push('<font color=red>*</font>:&nbsp;');
	html.push('<input type="text" class="text" style="width:170px;" maxlength="30" id="querySchemeName" value="',schemeName,'">');
	html.push('</div>');
	UICtrl.showDialog({
		title:'保存查询方案',width:250,height:60,left:200,top:200,
	    content:html.join(''),
	    ok:function(){
	    	var _self=this;
	    	var name=$('#querySchemeName').val();
	    	if(name==''){
	    		Public.tip("请输入查询方案名称!");
	    		return;
	    	}
	    	var url=web_app.name + '/personOwnAction!saveQueryScheme.ajax';
	    	Public.ajax(url,{schemeId:schemeId,schemeKind:'info',name:encodeURI(name),param:encodeURI($.toJSON(param))},function(data){
	    		queryQueryScheme();
	    		_self.close();
	    	});
	    }
	});
}

/*获取任务查询方案列表*/
function queryQueryScheme(){
	var url=web_app.name + '/personOwnAction!queryQueryScheme.ajax';
	Public.ajax(url,{schemeKind:'info'},function(data){
		buildQueryScheme(data);
	});
}

function buildQueryScheme(data){
	var div=$('#shortcutInfoSearch'),length=data.length;
	var updateQueryScheme=div.find('div.updateTaskQueryScheme'),schemeId='';
	if(updateQueryScheme.length>0){
		schemeId=updateQueryScheme.attr('id');
	}
	div[length>0?'show':'hide']();
	shortcutInfoSearchData={};
	var style='',className='',html=[];
	$.each(data,function(i,o){
		style='';
		className='taskCenterSearch';
		if(i==length-1){
			style='style="border: 0px;"';
		}
		if(schemeId==o.schemeId){//选中样式处理
			className+=' updateTaskQueryScheme';
		}
		html.push('<div class="',className,'" id="',o.schemeId,'" ',style, '>');
		html.push('<span class="ui-icon-trash" title="删除"></span>');
		html.push('<span class="ui-icon-edit" title="编辑"></span>');
		html.push(o.name);
		html.push('</div>');
		shortcutInfoSearchData[o.schemeId]=$.evalJSON(o.param);
	});
	div.html(html.join(''));
}

//删除查询方案
function deleteQueryScheme(schemeId, name){
	UICtrl.confirm('您确定删除<font color=red>['+name+']</font>吗?',function(){
		Public.ajax(web_app.name + '/personOwnAction!deleteQueryScheme.ajax', {schemeId:schemeId}, function(){
			queryQueryScheme();
		});
	});
}
//信息收藏工具栏
function initInfoCollectToolBar(){
	$('#infoCollectToolBar').toolBar([
	     {id:'collect',name:'收藏',icon:'collect', event:function(){
	     	var id=$('#previewInfoPromulgateId').val();
	     	if(Public.isBlank(id)){
	     		return;
	     	}
	     	Public.ajax(web_app.name + '/personOwnAction!insertInfoCollect.ajax',{ infoId: id }, function(){
					Public.successTip("收藏任务信息成功！");
			});
	     }},
	     {line:true},	 
	     {id:'deleteCollect',name:'取消收藏',icon:'un_collect', event:function(){
	     	var id=$('#previewInfoPromulgateId').val();
	     	if(Public.isBlank(id)){
	     		return;
	     	}
	     	UICtrl.confirm("您是否要取消收藏当前的信息？", function() {	
			       Public.ajax(web_app.name + '/personOwnAction!deleteInfoCollect.ajax', 
					{ infoId: id}, 
					function(){
						Public.successTip("您已成功取消收藏当前任务！");
						if($('#myselfCollectqueryKind').hasClass('taskCenterChoose')){
							reloadGrid();
						}
					});
			});
	     }}
	 ]);
	 //响应滚动条时间让toolbar移动
	 $('#previewInfoMainDiv').on('scroll',function(){
	 	 var scrollTop = $(this).scrollTop();
	 	 $('#infoCollectToolBar').css({top:scrollTop+2});
	 });
}
//隐藏或显示信息收藏工具栏
function triggerInfoCollectToolBar(flag){
	$('#infoCollectToolBar').css({top:2})[flag?'show':'hide']();
}
//初始化公司发文查询UI
function initDispatchNoQueryUI(){
	$.each(['yearBegin','yearEnd'],function(i,o){
		$('#'+o).spinner({countWidth:60}).mask('9999');
	});
	$.each(['dispatchNoBegin','dispatchNoEnd'],function(i,o){
		$('#'+o).spinner({countWidth:60}).mask('9999',{number:true});
	});
	$('#selectDispatchKindName').treebox({
		width:200,
		name:'dispatchKindChoose',
		treeLeafOnly:true,
		changeNodeIcon:function(node){
			var kindId=node.kindId;
			var url=web_app.name + "/themes/default/images/org/";
			url += kindId=='ogn'?'org.gif':'dataRole.gif';
			node['nodeIcon']=url;
		},
		beforeChange:function(node){
			var kindId=node.kindId;
			if(kindId=='ogn'){
				return false;
			}
		},
		back:{text:'#selectDispatchKindName',value:'#dispatchKindId'}
	});
}
//根据公司发文搜索
function doQueryInfoByDispatchNo(form){
	var  param = $(form).formToJSON();
	gridManager.options.parms ={};
	UICtrl.gridSearch(gridManager, {dispatchNoInfo:$.toJSON(param)});
}