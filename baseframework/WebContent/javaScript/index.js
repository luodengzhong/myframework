﻿var tab=null,treeManager=null,layoutmanager;
$(document).ready(function() {
	initializeUI();
    loadCurrTime();
    initFunctionMenu();
    countInfoWebPush();//查询是否存在弹屏信息
    getCNDate();
    UICtrl.setDialogPath();
});

//读取操作员权限
function initFunctionMenu(){
	//var functionId=Public.getQueryStringByName("moduleId");
	var functionId=$("#moduleId").val();
	//加载顶级菜单
	var menus=$('#functionNavigation');
	var divMenus = $('#divFunctionNavigation');
	var taskCenterButtons=$('#indexTaskCenterButtons');
	var initScrollWidth = 0; 
	divMenus.css({"float":"left","overflow":"hidden"});
	Public.ajax(web_app.name + "/menu.ajax",{parentId:1},function (data) {
		//默认添加任务中心菜单
		var html=['<li id="taskCenterIndex" class="selected"><a href="javascript:void(null);" hidefocus>任务中心</a></li>'];
		$.each(data,function(i,o){
			html.push('<li id="',o.id,'" mapId="',o.operationMapId,'"><a href="javascript:void(null);" hidefocus>',o.name,'</a></li>');
		});
		 //初始化主菜单
		menus.html(html.join(''));
		if(!menus.find('li.selected').length){
			$('li:first',menus).addClass('selected');
		}
		functionId=$('li.selected',menus).attr('id');
		menus.functionMenu({callBack:function(li){
			var id=li.attr('id'),mapId=li.attr('mapId');
			if(id=='taskCenterIndex'){
				$('#tree_ul').attr('parentId',id).empty();
				taskCenterButtons.show();
			}else{
				//加载权限树
				loadFunctionTreeView(id);
				//隐藏任务中心按钮
				taskCenterButtons.hide();
				//加载业务导图
				showOperationMap(mapId,li.text());
			}
			layoutmanager.setLeftCollapse(false);
	    }});
		//首页按钮权限控制
		Public.ajax(web_app.name + "/menu.ajax",{parentId:2},function (data) {
			$.each(data,function(i,o){
				$('#'+o.code).addClass('hasFun');
			});
			//右边快捷导航
			$('#mainHeadNavUl > li').downMenu();
		});
		//加载权限树
		//functionId&&loadFunctionTreeView(functionId);
		
		$(window).resize(function(){
			initScroll();
		});
		var menusWidth=0;
		menus.find('li').each(function(){
			menusWidth+=$(this).width()+10;
		});
		menus.width(menusWidth);
		initScroll();
		$('#btnLeft').click(function(){
			divMenus.scrollLeft(divMenus.scrollLeft()-65);
		});
		$('#btnRight').click(function(){
			divMenus.scrollLeft(divMenus.scrollLeft()+65);
		});
	});
	
}
//打开业务导图
function showOperationMap(mapId,name){
	if(Public.isBlank(mapId)){
		return;
	}
	var url=web_app.name + '/operationMapAction!previewChart.do?operationMapId='+mapId;
	parent.addTabItem({ tabid: 'operationMapView'+mapId, text: '['+name+']业务导图', url:url});
}
// 窗口大小改变时初始化菜单栏左右滚动
function initScroll(){
	var menus=$('#functionNavigation');
	var divMenus = $('#divFunctionNavigation');
	var indexWidth=$('#indexNavigation').width();
	var rightWidth=$('#indexOtherNavigation').width();
	var menusWidth = menus.width();
	if ((menusWidth +  rightWidth+ 100) > indexWidth){
		$('#btnLeft').css({"display":"inline"});
		$('#btnRight').css({"display":"inline"});
	}else{
		$('#btnLeft').css({"display":"none"});
		$('#btnRight').css({"display":"none"});
	}
	// 改变菜单栏div宽度，同时菜单栏ul宽度不能随之改变
	var divMenusWidth=indexWidth - rightWidth - 90;
	divMenus.width(divMenusWidth);
	divMenus.css({"height":"26px"});
}

function initializeUI() {
	var layout=$("#layout");
	var windowWidth = $(window).width();
	var leftWidth= windowWidth*0.15;
	if(leftWidth<200) leftWidth=200;
	//初始化布局
    layoutmanager =UICtrl.layout(layout,{
		topHeight:32, leftWidth: leftWidth, height: '100%',
		heightDiff:-6, allowTopResize:false,
	    onSizeChanged:function(){
	    	var middleHeight=$('#indexCenter').height();
	    	 $('#menuTree').height(middleHeight-38);
			 if (tab){
	        	tab.setHeight(middleHeight - 1);
	        }
	    }
    });
    var bodyHeight=$('#indexCenter').height();
    $('#menuTree').height(bodyHeight-38);
     //添加左侧锁定图标
    var leftLayoutHeader=layout.find('div.l-layout-left').find('div.l-layout-header');
    var isLeftLocked=$.cookie('index-layout-header-lock')==='true';
    var lockLeftDiv=$('<div id="index-layout-header-lock" title="锁定菜单栏" class="'+(isLeftLocked?'l-layout-header-lock':'l-layout-header-open-lock')+'"></div>').appendTo(leftLayoutHeader);
    lockLeftDiv.on('click.lock',function(){
    	isLeftLocked=$(this).hasClass('l-layout-header-lock');
    	if(isLeftLocked){
    		$(this).addClass('l-layout-header-open-lock').removeClass('l-layout-header-lock');
    	}else{
    		$(this).addClass('l-layout-header-lock').removeClass('l-layout-header-open-lock');
    	}
    	$.cookie('index-layout-header-lock',!isLeftLocked);
    });
    //初始化选项卡菜单
    tab=UICtrl.tab("#frameCenter",{ height: bodyHeight,
    	onAfterSelectTabItem:function(id){
	    	var item=$("li[tabid=" + id + "]", this.tab.links.ul);
	    	//调整显示位置
	        var mainWidth = this.tab.links.width();
			var position=item.position(),width=item.width();
			var currentLeft = parseInt(this.tab.links.ul.css("left"));
			var btnWitdth = $(".l-tab-links-left", this.tab.links).width();
			//标签前后都在显示区域内
			var tempW = position.left + currentLeft - btnWitdth;
			if(tempW >= 0 && tempW <= mainWidth){
				tempW = tempW + width;
				if(tempW >= 0 && tempW <= mainWidth){
					return;
				}
			}
			if(position.left + width > mainWidth){
				tempW = position.left + width - mainWidth+ btnWitdth + 2;
				this.tab.links.ul.css({ left: -1 * tempW});
			}else{
				tempW = currentLeft + width+btnWitdth + 2;
				if(tempW >= btnWitdth + 2){
					tempW = btnWitdth + 2;
				}
				this.tab.links.ul.css({ left: tempW});
			}
	    },
	    onAfterRemoveTabItem:function(tabId){
	    	if(tabId.startsWith('openByMainTab')){
	    		tab.selectTabItem('main_tab');
	    	}
	    }
    });
    //添加默认页面
    addTabItem({ tabid: 'main_tab', text: '首页 ', url: web_app.name+'/homePageAction.do',showClose:false });
    addTabItem({ tabid: 'work_table', text: '我的桌面 ', url: web_app.name+'/workTableAction!query.do',showClose:false });
  	initToShowMainTab();//默认显示首页
    //上下显示切换
    $('#headerToggle').on('click',function(){
    	var indexHead=$('#indexHead');
    	var visible=indexHead.is(':visible');
    	indexHead.toggle();
    	if(visible){
    		$(this).addClass('header-toggle-bottom').removeClass('header-toggle-top');
    		layoutmanager.top.height(32);
    	}else{
    		$(this).addClass('header-toggle-top').removeClass('header-toggle-bottom');
    		layoutmanager.top.height(102);
    	}
    	layoutmanager._bulid();//重新计算显示位置
    });
}
function initToShowMainTab(){
	 $('#frameCenter').find('li').each(function(){//默认显示首页
    	if($(this).attr('tabid')=='main_tab'){
    		$(this).addClass('l-selected');
    	}else{
    		$(this).removeClass('l-selected');
    	}
    });
}
//添加标签页
function addTabItem(options){
	var leftLockDiv=$('#index-layout-header-lock'),tabid=options.tabid;
	var leftLock=leftLockDiv.hasClass('l-layout-header-lock');
	if(tabid=='main_tab'||tabid=='work_table'||tabid=='TaskCenter'){
		leftLock=true;//不自动影藏菜单栏
	}
	if(!leftLock){//自动关闭左侧菜单栏
		layoutmanager.setLeftCollapse(true);
	}
	tab.addTabItem(options);
}
function selectTabItem(tabid){
	tab.selectTabItem(tabid);
}
function addUserNodeTab(){
	addTabItem({ tabid: 'user_nodes_tab', text: '便签 ', url: web_app.name+'/personOwnAction!toMainPage.do'});
}
function addUserCalendarTab(){
	addTabItem({ tabid: 'user_calendar_tab', text: '日程安排 ', url: web_app.name+'/personOwnAction!toCalendarPage.do'});
}
function getCurrentTabId() {
     return $("#frameCenter > .l-tab-content > .l-tab-content-item:visible").attr("tabid");
}
function closeTabItem(tabid) {
    if (!tabid||tabid=='') {
        tabid = $("#frameCenter > .l-tab-content > .l-tab-content-item:visible").attr("tabid");
    }
    if (tab) {
        tab.removeTabItem(tabid);
    }
}
function reloadParentTab(parentTabId){
	try {
        var iframe = window.frames[parentTabId];
        if (tab) {
            tab.selectTabItem(parentTabId);
        }
        if (iframe && iframe.reloadGrid) {
            iframe.reloadGrid();
        }else if (tab) {
            tab.reload(parentTabId);
        }
    }
    catch (e) { }
}

function reloadTabById(parentTabId){
	try {
        var iframe = window.frames[parentTabId];
        if (iframe && iframe.reloadGrid) {
            iframe.reloadGrid();
        }else if (tab) {
            tab.reload(parentTabId);
        }
    }
    catch (e) { }
}

function loadCurrTime() {
    var years, months, dates, days;
    var hours, minutes, seconds;
    with (new Date()){
    	years = getFullYear() + "年";
    	months = (getMonth() + 1) + "月";
    	dates = getDate() + "日";
    	days = "星期"+"日一二三四五六".charAt(getDay());
    	hours = getHours();
    	minutes = getMinutes();
    	seconds = getSeconds();
    }
    if (hours == 0) {
        hours = "00:";
    } else if (hours < 10) {
        hours = "0" + hours + ":";
    } else {
        hours = hours + ":";
    }
    if (minutes < 10) {
        minutes = "0" + minutes + ":";
    } else {
        minutes = minutes + ":";
    }
    if (seconds < 10) {
        seconds = "0" + seconds + " ";
    } else {
        seconds = seconds + " ";
    }
    $('#spanDate').html([years , months , dates,'&nbsp',days].join(''));
    $('#spanTime').html([hours , minutes , seconds].join(''));
    window.setTimeout(arguments.callee, 1000);
}

function loadFunctionTreeView(parentId) {
	var treeUI=$("#tree_ul"),pId=treeUI.attr('parentId');
	if(parentId==pId) return;
	UICtrl.tree("#tree_ul",{
		url:web_app.name + "/menu.ajax",
		param:{parentId: parentId},
        parentIDFieldName: 'parentId',
        textFieldName: "name",
        iconFieldName: "nodeIcon",
        nodeWidth: 180,
        isLeaf: function (data) {
        	data.children = [];
        	data.nodeIcon=DataUtil.changeFunctionIcon(data.icon);
            return data.hasChildren == 0;
        },
        onSelect: function (node) {
        	if (node.data) {
        		if(node.data.url){
	                var url = web_app.name+ "/" +node.data.url;
	                if (url.indexOf("?") >= 0){
	                    url += "&functionId=" + node.data.id;
	                }else{
	                    url += "?functionId=" + node.data.id;
	                }
	                addTabItem({ tabid: node.data.code, text: node.data.description, url:url});  
        		}else{
        			showOperationMap(node.data.operationMapId,node.data.name);
        		}
            }
        },
        delay: function(e){
            return { url: web_app.name + "/menu.ajax",parms:{parentId: e.data.id} };
        },
        onSuccess:function(){
        	treeUI.attr('parentId',parentId);
        }
    });
}

//登出
function doLogout(){
	window.location.href = web_app.name +'/logout.do';
}

//打开任务中心
function showTaskCenter(taskKind){
	var tabId='TaskCenter';
	try {
		if (tab) {
			var iframe = window.frames[tabId];
			if(iframe){
				tab.selectTabItem(tabId);
				if(iframe.reloadTaskGrid){
					iframe.reloadTaskGrid(taskKind);
				}
			}else{
				var url=web_app.name+'/workflowAction!forwardTaskCenter.do?viewTaskKind='+taskKind;
				addTabItem({ tabid: 'TaskCenter', text: '任务中心 ', url: url});
			}
        }
    } catch (e) { }
}
//打开新建事项对话框
function showAddJob(){
	AddJob.showDialog();
}
//打开信息中心
function showInfoCenter(){
	 var url = web_app.name + '/oaInfoAction!forwardInfoCenter.do';
	addTabItem({ tabid: 'InfoCenter', text: '信息中心 ', url: url});
}
//打开计划中心
function showPlanTaskCenter(){
	 var url = web_app.name + '/planTaskManagerAction!showInsertPlan.do ';
	addTabItem({ tabid: 'OAPlanManger', text: '我的计划 ', url: url});
}
//查询弹屏信息
function countInfoWebPush(){
	/*Public.ajax(web_app.name + '/infoWebPushAuditAction!countInfoWebPush.ajax',{}, function(data){
		 var count=parseInt(data,10);
		 if(!isNaN(count)&&count>0){//存在弹屏信息
		 	//打开弹屏窗口
		 	window.open(web_app.name + '/infoWebPushAuditAction!forwardWebPush.do');
		 }
	});*/
}

function afterSwitchOperator(){
	window.location.href = web_app.name +'/Index.jsp';
}