var UICtrl = UICtrl || {};
UICtrl.convertForPhone= false;
UICtrl.entranceKind = "PC";//入口类别
UICtrl.ProcessCommand = {};
UICtrl.ProcessCommand.FINISHED = false;//流程命令结束
$(document).ready(function() {
	//判断请求是否来至手机
	UICtrl.convertForPhone=Public.getQueryStringByName("convertForPhone")==='true';
	if(Public.isReadOnly){//只读模式下修改输入框为只读
		UICtrl.setReadOnly($('body'));
	}else if(!UICtrl.isApplyProcUnit()){//不是申请环节默认为只读
		UICtrl.setReadOnly($('#jobBizBillBody'));
		UICtrl.taskExecutionListTableEnabled();
		var fileListDiv=$('div.ui-attachment-list');
		if($.fn.fileList&&fileListDiv.length>0){
			fileListDiv.each(function(){
				$(this).fileList('disable');
			})
		}
	}
	UICtrl.setPermissionField($('body'));
	UICtrl.hideNoAccessButton();
	UICtrl.initKeyDownQueryGrid();//查询界面回车执行查询
});
//处理主表上权限字段
UICtrl.setPermissionField=function($doc){
	var permission=window['permissionAuthority']||{};
	var obj=null;
	$.each(permission,function(p,o){
		if(o.type=='0'){//主集字段
			obj=$("[name='"+p+"']",$doc);
			if(o.authority=='readonly'){//只读权限
				UICtrl.disable(obj);
			}else if(o.authority=='noaccess'){//无权限
				obj.attr('noaccess',true);//添加该标志后在 $(form).formToJSON()方法中将不会取值
				if(obj.is('select')){
					$('#'+p+'_text').val('********');
				}
				UICtrl.disable(obj);
			}else if(o.authority=='readwrite'){//存在读写权限
				if(!Public.isReadOnly)
					UICtrl.enable(obj);
			}
		}
	});
};
//获取不同类别权限字段
//type 0：主集 ，1：子集 ，2：按钮
UICtrl.getPermissionField=function(authority,type){
	var fields=[],permission=window['permissionAuthority']||{};
	$.each(permission,function(p,o){
		if(o.authority==authority&&o.type==type){
			fields.push(p);
		}
	});
	return fields;
};
//隐藏没有权限的按钮
UICtrl.hideNoAccessButton=function(){
	var noAccessList=UICtrl.getPermissionField('noaccess','2');
	$.each(noAccessList,function(i,o){
		var btn=$('#'+o);//页面查找对应按钮
		if(btn.length==1){//存在且唯一
			if(btn.parent().hasClass('ui-button')){
				btn.parent().hide();
			}else{
				btn.hide();
			}
		}
	});
};
//判断当前页面是否为申请环节
UICtrl.isApplyProcUnit=function(){
	if($.isFunction(window['businessJudgmentUnit'])){
		return window['businessJudgmentUnit']();
	}
	//window['isApplyProcUnit'] 存在于 job.js
	if($.isFunction(window['isApplyProcUnit'])){
		return window['isApplyProcUnit']();
	}
	return true;
};
//判断按钮是否有权限 retrun true 无权限
//gridId 在grid的toolbar 中确定按钮权限时使用
UICtrl.checkButtonNoAccess=function(id,gridId){
	if(Public.isReadOnly){//只读模式
		return Public.testReadOnlyAttributes(id);
	}
	//gird中的按钮需要加上gridId
	if(!Public.isBlank(gridId)){
		id=gridId+'.'+id;
	}
	if(UICtrl.isApplyProcUnit()){//非审批环节
		//无权限的按钮
		var noAccessList=UICtrl.getPermissionField('noaccess','2');
		if($.inArray(id,noAccessList)>-1){//该按钮无权限
			return true;
		}
	}else{//审核环节
		if(Public.testReadOnlyAttributes(id)){//需要判断的按钮
			//有权限的按钮
			var readwriteList=UICtrl.getPermissionField('readwrite','2');
			if($.inArray(id,readwriteList)>-1){//该按钮有权限
				return false;
			}
			return true;
		}
	}
	return false;
};
//处理明细表权限字段
UICtrl.disposeGridPermissionField=function(options,gridId){
	options=options||{};
	//取子集中只读字段
	var readOnlyList=UICtrl.getPermissionField('readonly','1');
	//取子集中无访问权限字段
	var noAccessList=UICtrl.getPermissionField('noaccess','1');
	//取子集中有读写权限字段
	var readwriteList=UICtrl.getPermissionField('readwrite','1');
	var columns=options['columns'];
	if (options.enabledEdit === true) {
		if(Public.isReadOnly){//只读模式不添加事件
			options.enabledEdit=false;
		}else{
			var hasEditorField=false;
			if(UICtrl.isApplyProcUnit()){//申请环节
				hasEditorField=options.enabledEdit;
				//在申请页面控制只读数据
				if(readOnlyList.length > 0){
					//删除字段上的可写配置
					$.each(columns,function(i,o){
						if($.inArray(o.name,readOnlyList)>-1){//该字段只读
							delete o['editor'];//删除editor
						}
						if($.inArray(gridId+'.'+o.name,readOnlyList)>-1){//该字段只读
							delete o['editor'];//删除editor
						}
						if(o['editor']){//存在可写字段
							hasEditorField=true;
						}
					});
				}
			}else{//审核环节
				//在审核页面控制可写字段
				if(readwriteList.length > 0){
					$.each(columns,function(i,o){
						if($.inArray(o.name,readwriteList)==-1){//不在可写列表中
							if($.inArray(gridId+'.'+o.name,readwriteList)==-1){//不在可写列表中
								delete o['editor'];//删除editor
							}
						}
						if(o['editor']){//存在可写字段
							hasEditorField=true;
						}
					});
				}
			}
			if(hasEditorField){//存在可写字段
				//添加位置寻找方法
				var fn=options['onBeforeEdit'];
			    options['onBeforeEdit'] =function(a,b){
			    	if($.isFunction(fn)){
			    		var flag=fn.call(this,a);
			    		if(flag===false) return false;
			    	}
			    	UICtrl.GridEditorsUtil.beforeEdit.call(this,a,b);
			    };
			}else{
				options.enabledEdit=false;
			}
		}
	}
	if(noAccessList.length>0){//无权限字段需在表头中删除
		var newColumns=[];
		$.each(columns,function(i,o){
			//判读是否在数组中
			if($.inArray(o.name,noAccessList)==-1){
				if($.inArray(gridId+'.'+o.name,noAccessList)==-1){
					newColumns.push(o);
				}
			}
		});
		options['columns']=newColumns;
		/*
		 * 暂时不处理后台返回数据
		//添加无权限查询执行参数
		var parms = options['parms']||{};
		parms['permissionNoAccessList'] = noAccessList.join(',');
		options['parms']=parms;
		*/
	}
	//处理按钮
	var toolbar=options['toolbar'];
	//存在按钮
	if(!Public.isBlank(toolbar)&&!Public.isBlank(toolbar['items'])&&toolbar['items'].length>0){
		var newToolBar=[],itemId=null;
		$.each(toolbar['items'],function(i,o){
			if(!o){
				return;
			}
			itemId=Public.isBlank(o['itemId'])?o['id']:o['itemId'];
			if(Public.isBlank(itemId)){
				return;
			}
			//按钮权限判断
			if(!UICtrl.checkButtonNoAccess(itemId,gridId)){
				newToolBar.push(o);
			}
		});
		options['toolbar']['items']=newToolBar;
		if(newToolBar.length==0){
			delete options['toolbar'];
		}else{
			options['toolbar']={items:newToolBar};
		}
	}
	return options;
};
//设置为只读
UICtrl.setReadOnly=function($doc){
	$('textarea',$doc).each(function(i,o){
		UICtrl.disable(o);
	});
	$('input[type="text"]',$doc).each(function(i,o){
		UICtrl.disable(o);
	});
	$('input[type="radio"]',$doc).each(function(i,o){
		$(this).attr('disabled',true);
	});
	$('input[type="checkbox"]',$doc).each(function(i,o){
		$(this).attr('disabled',true);
	});
};
//设置为可编辑
UICtrl.setEditable=function($doc){
	$('textarea',$doc).each(function(i,o){
		UICtrl.enable(o);
	});
	$('input[type="text"]',$doc).each(function(i,o){
		UICtrl.enable(o);
	});
	$('input[type="radio"]',$doc).each(function(i,o){
		$(this).removeAttr('disabled');
	});
	$('input[type="checkbox"]',$doc).each(function(i,o){
		$(this).removeAttr('disabled');
	});
};
//任务处理输入框可用
UICtrl.taskExecutionListTableEnabled=function(){
	var table=$('table.taskExecutionListTable');
	table.find('textarea').each(function(){
		UICtrl.enable($(this));
	});
	table.find('input[type="text"]').each(function(){
		UICtrl.enable($(this));
		var name=$(this).attr('name');
		if(name.endsWith('_text')){
			$(this).attr('readonly',true);
		}
	});
};
/* 扩展$.dialog窗口外部方法 */
/*********右下角提示框**********/
UICtrl.setDialogPath=function(path){
	path=path||(web_app.name + '/themes/lhgdialog/');
	$.dialog.setting.path=path;
};

UICtrl.notice = function( options ){
	if(typeof options=='string'){
		options={content:options};
	}
	var opts = options || {},
		api, aConfig, hide, wrap, top,
		duration = opts.duration || 800;
	var event={
		init: function(here){
			api = this;
			aConfig = api.config;
			wrap = api.DOM.wrap;
			top = parseInt(wrap[0].style.top);
			hide = top + wrap[0].offsetHeight;
							
			wrap.css('top', hide + 'px')
			.animate({top: top + 'px'}, duration, function(){
				opts.init && opts.init.call(api, here);
			});
		},
		close: function(here){
			wrap.animate({top: hide + 'px'}, duration, function(){
				opts.close && opts.close.call(this, here);
				aConfig.close = $.noop;
				api.close();
			});
			return false;
		}
	};   
	var config=$.extend({
		title:'系统消息',
		left: '99%',
		top: '100%',
		width: 220, 
		time: 5,
		max: false,
		min: false,
		fixed: true,
		drag: false,
		resize: false
	},opts,event);
	UICtrl.setDialogPath();
	return $.dialog( config );
};
/***********对话框打开AJAX加载的页面*******************/
UICtrl.showDialog = function( options ){
	var opts = options || {};
	var event={
		close: function(){
			var $content = this.DOM.content,returnValue;
			if($.isFunction(opts['close'])){
				returnValue = opts['close'].call(this, $content);
			}
			return returnValue===false ? false : true;
		},
		init: function(){
			var $content=this.DOM.content;
			Public.autoInitializeUI($content);//自动初始化控件
			if($.isFunction(opts['init'])){
				opts['init'].call(this,$content);
			}
		},
		ok:opts['ok']===false?false:function () {
			var $content=this.DOM.content,returnValue;
			if($.isFunction(opts['ok'])){
				returnValue=opts['ok'].call(this,$content);
			}
			return returnValue===true?true:false;
		},
		cancel:opts['close']===false?false:function(){
			try{$.closeCombox();}catch(e){}
			try{$.datepicker.close();}catch(e){}
			return true;
		}
	};
	var config = $.extend({
		title:'系统对话框',
		lock: true,
		top:30,
		content:'',
		min:false,
		max:false,
		width:getDefaultDialogWidth(),
		resize: false,
		height:'auto'
	},opts,event);
	UICtrl.setDialogPath();
	return $.dialog( config ).focus();
};

UICtrl.showAjaxDialog = function( options ){
	var opts = options || {};
	var url=opts['url'],param=opts['param']||{},id=opts.id;
	var event={
		close: function(){
			var $content=this.DOM.content,returnValue;
			//doSomething as general operating
			if($.isFunction(opts['close'])){
				returnValue=opts['close'].call(this,$content);
			}
			return returnValue===false?false:true;
		},
		init: function(){
			var $content=this.DOM.content;
			Public.autoInitializeUI($content);//自动初始化控件
			//doSomething as general operating
			if($.isFunction(opts['init'])){
				opts['init'].call(this, $content);
			}
		},
		ok:opts['ok']===false?false:function () {
			var $content=this.DOM.content,returnValue;
			if($.isFunction(opts['ok'])){
				returnValue=opts['ok'].call(this,$content);
			}
			return returnValue===true?true:false;
		},
		cancel:opts['close']===false?false:function(){
			try{$.closeCombox();}catch(e){}
			try{$.datepicker.close();}catch(e){}
			return true;
		}
	};
	var config = $.extend({
		title:'系统对话框',
		lock: true,
		top:30,
		cancelVal: '关闭',
		okVal:'保存',
		min:false,
		max:false,
		resize: false,
		width:getDefaultDialogWidth(),
		height:'auto'
	},opts,event);
	UICtrl.setDialogPath();
	Public.load(url,param,function(data){
		config['content']=data;
		setTimeout(function(){window[id?id:'ajaxDialog']=$.dialog( config ).focus();},0);
	});
};
/************通过IFRAME加载页面**************/
UICtrl.showFrameDialog = function(options){
	var opts = options || {};
	var url=opts['url'],param=opts['param'];
	if(!url) return;
	if(param){
		url+=(/\?/.test(url) ? '&' : '?')+ $.param(param);
	}
	
	var event={
		close: function(){
			//doSomething as general operating
			if($.isFunction(opts['close'])){
				opts['close'].apply(this,arguments);
		    }
		},
		init: function(){
			//doSomething as general operating
			if($.isFunction(opts['init'])){
				opts['init'].apply(this,arguments);
			}
		},
		ok:opts['ok']==false?false:function () {
			var returnValue;
			if($.isFunction(opts['ok'])){
				returnValue = opts['ok'].call(this);
			}
			return returnValue === true ? true : false;
		},
		cancel:!opts['cancel']?undefined:true
	};
	var config = $.extend({
		title:'系统对话框',
		content: 'url:'+url,
		width:'auto',
		height:'auto',
		min:false,
		max:false,
		resize: false,
		lock: true
		},opts,event);
	 UICtrl.setDialogPath();
	 return $.dialog( config );
};
//打开指定模板导入数据对话框
UICtrl.showAssignCodeImpDialog = function(options){
	var closeFn=options['onClose'];
	if(!closeFn) closeFn=window['reloadGrid'];
	UICtrl.showFrameDialog({
		title:options['title']||'导入数据',
		url: web_app.name + '/impExcelAction!forwardAssignCodeImpPage.do', 
		param:{serialId:options.serialId,templetCode:options.templetCode},
		width:getDefaultDialogWidth(),
		height:380,
		ok:false,
		cancel:true,
		cancelVal:'关闭',
		close: function(){
			var fn = this.iframe.contentWindow.getRefreshFlag;
			if(fn()){
				if($.isFunction(closeFn)){
					closeFn.call(window);
				}
			}
		}
	});
};

UICtrl.getDispatchNo=function(options) {
	var opts = options || {};
	var bizId=opts['bizId'],bizUrl=opts['bizUrl'];
	var title=opts['title'],isAgain=false;
	if(Public.isBlank(bizId)){
		Public.tip('请输入业务单据ID!'); 
		return;
	}
	if(Public.isBlank(bizUrl)){
		Public.tip('请输入业务单据连接!'); 
		return;
	}
	if(Public.isBlank(title)){
		Public.tip('请输入业务标题!'); 
		return;
	}
	if(opts['isAgain']===true){
		isAgain=true;
	}
	var html=['<div class="ui-form" >'];
	html.push('<dl><dt style="width:70px">发文类别&nbsp;:</dt><dd style="width:150px">');
	html.push('<input	 type="text" id="uictrlDispatchKindId" class="text"	 label="发文类别"	/>');
    html.push('</dd></dl>');
	html.push('</div>');
	var getDispatchNoDialog=UICtrl.showDialog({
		title:'获取文件编号',width:280,id:'getDispatchNoDialog',okVal:'确定',parent:opts['parent'],
		content:html.join(''),
		button: [{
			id : 'viewItem',
			name : '使用情况',
			callback:function(){
				var dispatchKindId=$('#uictrlDispatchKindId').val();
				if(Public.isBlank(dispatchKindId)){
					Public.tip('请选择发文类别!'); 
					return false;
				}
				var _selfGetNo=this;
				UICtrl.showDispatchNoList(dispatchKindId,getDispatchNoDialog,function(data){
					var dispatchBillRelevanceId=data.dispatchBillRelevanceId,_self=this;
					//通过闭包封装对话框关闭方法
					var closeDialog=function(){
						_self.close();
						_selfGetNo.close();
					};
					//重新取号(作废的编号重新使用)
					var url=web_app.name + '/dispatchManagerAction!updateDispatchNoByBillRelevanceId.ajax';
					Public.ajax(url,{dispatchBillRelevanceId:dispatchBillRelevanceId,bizId:bizId,bizUrl:bizUrl,isAgain:isAgain,title:encodeURI(title)},
						function(param){
							param['dispatchKindId']=dispatchKindId;
							param['dispatchKindName']=$('#uictrlDispatchKindId').combox('getText');
							if($.isFunction(opts.callback)){
								opts.callback.call(new closeDialog(),param);
							}
						}
					);
				});
				return false;
			}
		}],
		ok:function(){
			var _self=this;
			var dispatchKindId=$('#uictrlDispatchKindId').val();
			if(Public.isBlank(dispatchKindId)){
				Public.tip('请选择发文类别!'); 
				return false;
			}
			//后台保存文件编号
			var url=web_app.name + '/dispatchManagerAction!saveDispatchNoByKind.ajax';
			Public.ajax(url,{dispatchKindId:dispatchKindId,bizId:bizId,bizUrl:bizUrl,isAgain:isAgain,title:encodeURI(title)},
				function(param){
					param['dispatchKindId']=dispatchKindId;
					param['dispatchKindName']=$('#uictrlDispatchKindId').combox('getText');
					if($.isFunction(opts.callback)){
						opts.callback.call(_self,param);
					}
				}
			);
			return false;
		},
		init:function(){
			Public.ajax(web_app.name + '/dispatchManagerAction!queryDispatchKind.ajax',{},function(data){
				$.each(data,function(i,o){
					var nodeKind=o['nodeKind'];
					if(nodeKind=='kind'){
						o['nodeIcon']=web_app.name + "/themes/default/images/icons/icon_download.gif";
					}
				});
				var tree={url:null,dataRender:null,isLeaf:null,nodeWidth: 180,data:data,delay:function(data){return data['level']>1;}};
				$('#uictrlDispatchKindId').treebox({tree:tree,width:250,treeLeafOnly:true});
			});
		}
	});
};
//文号已使用列表
UICtrl.showDispatchNoList = function (dispatchKindId,parent,okEvent){
	var flag=$.isFunction(okEvent)?function(){
		var getChooseRow=this.iframe.contentWindow.getChooseRow;
		if($.isFunction(getChooseRow)){//初始化已选择列表
			var data=getChooseRow.call();
			if(!data) return;
			okEvent.call(this,data);
		}
		return false;
	}:false;
	UICtrl.showFrameDialog({
		url :web_app.name + "/dispatchManagerAction!forwardDispatchBillRelevance.do",
		parent:parent,
		id:'showDispatchNoList',
		param : {
			dispatchKindId : dispatchKindId
		},
		title : "文件列表",
		width :900,
		height:getDefaultDialogHeight(),
		cancelVal: '关闭',
		okVal:'获取文号',
		ok:flag,//是否允许重复获取号
		cancel:true
	});
}
//图片等比例缩放
UICtrl.autoResizeImage=function(obj,maxWidth, maxHeight) {
   var img = new Image();// 创建对象
   img.src = $(obj).attr('src');// 改变图片的src
   var isLoad=false;
   var check = function(){
		if(img.width>0 || img.height>0){// 只要任何一方大于0,表示已经服务器已经返回宽高
			setTimeout(showImg,0);
		 }
	};
	var timer = setInterval(check,40);// 定时执行获取宽高
	img.onload = function(){
		setTimeout(showImg,0);
	};
	img.onerror = function(){//图片不存在时显示默认
		/*img.width='80';
		img.height='80';
		img.onerror=null;
		$(obj).attr('src',web_app.name+'/themes/default/images/error_image.gif');
		setTimeout(showImg,0);*/
		clearInterval(timer);
		isLoad=true;
	};
	var showImg=function(){//显示区域大小
		if(isLoad) return;
		var nw=img.width,nh=img.height;
		var hRatio=maxHeight/nh,wRatio=maxWidth/nw,ratio=1;
		if(isNaN(hRatio)) hRatio=1;
		if(isNaN(wRatio)) wRatio=1;
		if (wRatio<1 || hRatio<1){
			ratio = (wRatio<=hRatio?wRatio:hRatio);
		}
		if (ratio<1){
			nw = nw * ratio;
			nh = nh * ratio;
		}
		$(obj).css({width:nw,height:nh});
		clearInterval(timer);
		isLoad=true;
	};
};
/*进度条(与jquery.dialog.js配合使用)
**@param {Object} eg.{id : 'tidy-process', content : '正在整理凭证，请耐心等待。', width : 510, height : 100, animateTime : 7000}
**注意id、content这两个属性是必填属性
**@return {Object} 
*/
UICtrl.process = function (options){
	var options = options || {};
	if(!options.id || !options.content) return false;
	var pop = $.dialog({
		title :  false,
		width : options.width || 510,
		height : options.height || 100,
		content : '<div class="mod-process" id="' + options.id + '"><p class="tip">' + options.content + '</p><div class="process"><span></span></div></div>',
		lock : true,
		cache : false,
		esc : false,
		parent: options.parent
	});

	var process = $('#' + options.id), 
		  width = (options.width || 510) - 70, 
		  timeId;
	process.css('width', width);

	function processAnimate(){
		$('.process span', process).animate({width: width},options.animateTime || 7000,function(){ $(this).css('width', 0);});
	}

	processAnimate();
	timeId = setInterval(processAnimate,options.animateTime);
	return {pop : pop, timeId : timeId};
};
UICtrl.alert = function (msg,fn){
	if(UICtrl.convertForPhone){
		window.alert(msg);
		if($.isFunction(fn)){
			fn.call(window);
		}
	}else{
		UICtrl.setDialogPath();
		$.dialog.alert(msg,function(){
		   if($.isFunction(fn)){
			   fn.call(window);
		   }
		});
	}
};
UICtrl.confirm = function (msg,ok,cancel){
	if(UICtrl.convertForPhone){
		if(window.confirm(msg)){
			if($.isFunction(ok)){
				ok.call(window);
			}
		}else{
			if($.isFunction(cancel)){
				cancel.call(window);
			}
		}
	}else{
		UICtrl.setDialogPath();
		$.dialog.confirm(msg, function(){
			if($.isFunction(ok)){
				ok.call(window);
			}
		}, function(){
			if($.isFunction(cancel)){
				cancel.call(window);
			}
		});
	}
};
UICtrl.prompt = function (msg,fn){
	UICtrl.setDialogPath();
	$.dialog.prompt(msg,function(value){
	   if($.isFunction(fn)){
		   fn.call(window,value);
	   }
	});
};
/*******ligerUI 封装**********/
UICtrl.layout = function (el,options){
	el=$(el);
	el.ligerLayout(options);
	return el.ligerGetLayoutManager();
};
UICtrl.tree = function (el,options){
	el=$(el);
	el.ligerTree(options);
	return el.ligerGetTreeManager();
};
UICtrl.grid = function (el,options){
	el=$(el);
	//为查询添加管理权限类别
	var manageType=options.manageType;
	if(!Public.isBlank(manageType)){
		var parms = options.parms||{};
		parms[Public.manageTypeParmName]=manageType;
		options.parms=parms;
	}
	options['pageSize']=UICtrl.getGridPageSize(el,options);
	options=UICtrl.disposeGridPermissionField(options,el.attr('id'));
	el.ligerGrid(options);
	return el.ligerGetGridManager();
};
//判断显示高度只增加显示数据条数
UICtrl.getGridPageSize=function(el,p){
	var height=p.height;
	if(p['usePager']===false) return p['pageSize'];
	if (typeof height == "string" && height.indexOf('%') > 0){//表格高度设置为百分比%
		var pageSize=parseInt(p.pageSize,10);
		pageSize=isNaN(pageSize)?20:pageSize;
		var rowHeight=parseInt(p.rowHeight,10);
		rowHeight=isNaN(rowHeight)?25:rowHeight;
		var h = 0,parentHeight = null,windowHeight = $(window).height();
		var gridparent = $(el).parent();
	    if (p.inWindow===false){
	    	parentHeight = gridparent.height();
	    }else{
	    	parentHeight = windowHeight;
	        parentHeight -= parseInt($('body').css('paddingTop'));
	        parentHeight -= parseInt($('body').css('paddingBottom'));
	    }
	    h = parentHeight * parseFloat(p.height) * 0.01;
	    var jobScrollTop=0;
	    if($('#jobPageCenter').length>0){
	     jobScrollTop=$('#jobPageCenter').scrollTop();
	    }
	    if(p.inWindow || gridparent[0].tagName.toLowerCase() == "body"){
	    	h -= ($(el).offset().top - parseInt($('body').css('paddingTop'))+jobScrollTop);
	    }
	    h += p.heightDiff;
	    var diff=h-pageSize*rowHeight;
	    if(diff>50){
	    	pageSize=pageSize+10
	    }
	    return pageSize;
	}
	return p['pageSize'];
};
UICtrl.accordion = function (el,options){
	el=$(el);
	el.ligerAccordion(options);
	return el.ligerGetAccordionManager();
};
UICtrl.tab = function (el,options){
	el=$(el);
	el.ligerTab(options);
	return el.ligerGetTabManager();
};

UICtrl.gridSearch = function (grid, param){
	var parms = grid.options.parms;
	grid.options.parms = $.extend(true, parms, param);
	grid.options.newPage = 1;
	if (grid.isDataChanged && !confirm(grid.options.isContinueByDataChanged))
        return false;
	grid.loadData();
};
//导出
UICtrl.gridExport = function (grid, param){
	param=param||{};
	var staticName={head:'exportHead',able:'exportAble',type:'exportType'};
	var p=grid.options,jsonParam={};
	if(!grid['currentData']){
		Public.tips({type:1, content : '没有数据，无法导出！'});
		return false;
	}
	var total=parseInt(grid.currentData[p.record]);
	//总数判断
	if (isNaN(total)||total < 1){
		Public.tips({type:1, content : '没有数据，无法导出！'});
		return false;
	}
	//获取查询参数
	if (p.parms){
        var parms = $.isFunction(p.parms) ? p.parms() : p.parms;
        if (parms.length){
            $(parms).each(function (){
            	jsonParam[this.name]=this.value;
            });
        }else if (typeof parms == "object"){
            for (var name in parms){
            	jsonParam[name]=parms[name];
            }
        }
    }
	//页码
    if (p.usePager){
    	jsonParam[p.pageParmName]=p.newPage?p.newPage:1;
    	jsonParam[p.pagesizeParmName]=p.pageSize;
    }
    //排序
    if (p.sortName){
    	jsonParam[p.sortnameParmName]=p.sortName;
    	jsonParam[p.sortorderParmName]=p.sortOrder;
    }
    param=$.extend(true,jsonParam,param);
	//获取表头
	var exportHead=param[staticName.head];
	if($.isFunction(exportHead)){
		exportHead=exportHead.call(window);
	}
	//根据grid表头创建数据
	if(typeof exportHead=='undefined'){
		var _initBuildGridHeader=function(){
			var g = grid, p = grid.options,xmls=['<tables><table>'];
			for (var level = 1; level <= g._columnMaxLevel; level++){
				var columns = g.getColumns(level);           //获取level层次的列集合
	            var islast = level == g._columnMaxLevel;     //是否最末级
	            xmls.push("<row>");
	            $(columns).each(function (i, column){
	            	xmls.push(_createHeaderCol(column));
	            });
	            xmls.push("</row>");
	        }
			xmls.push('</table></tables>');
			return xmls.join('');
		};
		var _createHeaderCol=function(column){
			 if (column.issystem) return '';//系统列
		     if (column.isAllowHide == false) return '';//隐藏列
		     if (column[staticName.able]===false) return '';//定义不能导出该列
		     if (column._hide) return '';//该列被隐藏
			 var xmls=[];
			 if (column['sortField']){//存在字段转换的问题
				 xmls.push("<col field='",column['sortField'],"' ");
			 }else{
			 	 xmls.push("<col field='",column['name'],"' ");
			 }
			 if (column['__colSpan']) xmls.push("colSpan='", column['__colSpan'],"' ");
			 if (column['__rowSpan']) xmls.push("rowSpan='", column['__rowSpan'],"' ");
			 if (column['type']) xmls.push("type='", column['type'],"' ");
			 if (column['dictionary']) xmls.push("dictionary='", column['dictionary'],"' ");
			 if (column['backgroundColor']) xmls.push("backgroundColor='", column['backgroundColor'],"' ");
			 xmls.push("index='",column['columnindex'],"' ");
			 xmls.push(">",column['display'],"</col>");
	         return xmls.join('');
	    };
		exportHead=_initBuildGridHeader();
	}
	param[staticName.head]=encodeURI(exportHead);
	param[staticName.type]=param[staticName.type]||'all';
	var fileName=param.fileName?param.fileName:(p.title?p.title:'');
	UICtrl.downFileByAjax(p.url,param,fileName);
};
UICtrl.downFileByAjax=function(url,param,fileName){
	Public.ajax(url,param, function(data) {
		UICtrl.downFile({action:'/attachmentAction!downFileByTmpdir.ajax',param:{
			file:encodeURI(encodeURI(data.file)),
			fileName:encodeURI(encodeURI(fileName))
		}});
	});
};
UICtrl.downFile=function(op){
	var iframe=$('#downFile_hidden_Iframe');
	if(iframe.length==0){ 
		iframe=$('<iframe name="downFile_hidden_Iframe" style="display:none;"></iframe>').appendTo('body');
	}
	var param=op.param||{},action=op.action;
	$.each(param,function(p,o){
		action +=(action.indexOf("?") >= 0?"&":"?")+p+"=" +o;
	});
	iframe[0].src=web_app.name+action;
};
UICtrl.menu = function (options){
	var menu=$.ligerMenu(options);
	return menu;
};
/****************grid 扩展*********************/
UICtrl.GridEditorsUtil = {
    getSpinnerDataOptions: function(editor) { //获取Spinner执行参数
        var datas = {},dataOptions = "";
        if (editor.min && !isNaN(parseInt(editor.min))) {
            datas['min'] = parseInt(editor.min);
        }
        if (editor.max && !isNaN(parseInt(editor.max))) {
            datas['max'] = parseInt(editor.max);
        }
        if (editor.defaultValue && !isNaN(parseInt(editor.defaultValue))) {
            datas['default_value'] = parseInt(editor.defaultValue);
        }
        if (!$.isEmptyObject(datas)) {
            dataOptions = [" dataOptions='", $.toJSON(datas), "'"].join('');
        }
        return dataOptions;
    },
    createRadioControl: function(dataSource, name, type) { //构造radio或checkbox
        var html = ["<div class='textGrid'>"];
        var radioHtml = "<input type='" + type + "' id={id} name='{name}' value='{value}'/>&nbsp;<label for='{id}'>{label}</label>";
        if ($.isArray(dataSource)) {
            $.each(dataSource,
            function(i, o) {
                html.push(radioHtml.replace(/{id}/g, name + "_" + i).replace('{name}', name).replace('{value}', o).replace('{label}', o), '&nbsp;');
            });
        } else {
            $.each(dataSource,
            function(i, o) {
                html.push(radioHtml.replace(/{id}/g, name + "_" + i).replace('{name}', name).replace('{value}', i).replace('{label}', o), '&nbsp;');
            });
        }
        html.push("</div>");
        return html.join('');
    },
    createSelectControl: function(editor, inputHtml, gridId, rowindex) { //获取select or lookup执行html 
    	//groupId 存在代表 select 否则为lookup
        var html = [],dataOptions = $.extend({},editor.data);
        if (dataOptions.name && dataOptions.type) { //存在 name 和 type 这两个参数
        	delete dataOptions['getParam'];
            if (gridId) { //gridId 存在代表 select
                if (dataOptions.back) { //输入形式入:type:'sys',name:'extendedFieldDefine',back:{defineId:'003',fieldCname:'select'}
                	dataOptions['callBackControls'] = {};
                    $.each(dataOptions.back,function(p, o) {
                        dataOptions['callBackControls'][p] = ["#", gridId, '_', o, '_', rowindex].join('');
                    });
                    delete dataOptions['back'];
                    html.push('<div class="ui-combox-wrap">');
                    html.push(inputHtml.replace('{dataOptions}', [" dataOptions='", $.toJSON(dataOptions), "'"].join('')));
                    html.push('<span class="select">', '</span>', '</div>');
                }else{
                	return inputHtml.replace('{dataOptions}', '');
                }
            } else { //lookup
                html.push(inputHtml.replace('{dataOptions}', [" dataOptions='", $.toJSON(dataOptions), "'"].join('')));
            }
        } else {
            html.push(inputHtml.replace('{dataOptions}', ''));
        }
        return html.join('');
    },
    beforeEdit:function(a,b){//调整gird的滚动位置
    	var gridbody=this.gridbody;
        var gridWidth=gridbody.width()-20;
        var gridHeight=gridbody.height()-20;
        var sLeft=parseInt(gridbody.scrollLeft()),sTop=parseInt(gridbody.scrollTop());
        sLeft=isNaN(sLeft)?0:sLeft;
        sTop=isNaN(sTop)?0:sTop;
     	var position=$(b).position(),left=position.left,top=position.top;
     	var height=$(b).height(),width=$(b).width();
     	var isScrollLeft=true,isScrollTop=true;
     	//gridbody.get(0).scrollWidth
     	if(left>=0&&(left+width)<=gridWidth){
     		isScrollLeft=false;
     	}
     	if(isScrollLeft){
	     	this.isEditorScroll=true;
	     	if(left<0){
	     		sLeft=sLeft-Math.abs(left);
	     	}else {
	     		sLeft=sLeft+left+width-gridWidth;
	     	}
	 		sLeft=sLeft<0?0:sLeft;
	 		gridbody.scrollLeft(sLeft);
     	}
     	if(top>=0&&(top+height)<=gridHeight){
     		isScrollTop=false;
     	}
     	if(isScrollTop){
	     	this.isEditorScroll=true;
	     	if(top<0){
	     		sTop=sTop-Math.abs(top);
	     	}else {
	     		sTop=sTop+top+height-gridHeight;
	     	}
	     	sTop=sTop<0?0:sTop;
	 		gridbody.scrollTop(sTop);
     	}
    },
    getLookUpValue:function(editParm){
    	var editor=editParm['editor'];
    	var rowData=editParm.record;
    	var textField=editor['textField']||editParm.column.name;
    	var valueField=editor['valueField']||editParm.column.name;
    	if(!valueField) return {};
    	return {text:Public.isBlank(rowData[textField])?'':rowData[textField],value:Public.isBlank(rowData[valueField])?'':rowData[valueField]};
    }
};
/***扩展GRID的编辑器***/
$.ligerDefaults =$.ligerDefaults||{};
$.ligerDefaults.Grid =$.ligerDefaults.Grid||{};
$.ligerDefaults.Grid.editors=$.ligerDefaults.Grid.editors||{};
$.each(['text','combobox','spinner','date','dateTime','radio','checkbox','select','tree','dictionary','lookup','dynamic'],function(i, editorName) {
    $.ligerDefaults.Grid.editors[editorName] = {
        create: function(container, editParm) {
        	var column = editParm.column,editor = column.editor;
            if($.isFunction(editor.getEditor)){
            	editor=editor.getEditor.call(window,editParm.record);
            	if(editor===false) return null;
            }
            editor = $.extend({
                maxLength: false,
                readOnly: false,
                style: false,
                required: false,
                mask: false,
                match:false,
                onAfterInit:null,//初始化完成执行
                data: {}
            },editor);
            editParm['editor']=editor;
            var rowindex = editParm.rowindex,
            name = column.name;
            var gridId = this.id,
            gridId = gridId.replace(/\|/, '_');
            inputId = [" id='", gridId, '_', name, '_', rowindex, "'"];
            var controlType = editor.type;
            var html = [];
            var inputHtml = "<input type='text' class='{class}' {id}{required}{controlType}{maxLength}{style}{readOnly}{dataOptions}{mask}/>";
            with(editor) {
                inputHtml = inputHtml.replace("{maxLength}", maxLength ? " maxLength='" + maxLength + "'": "").replace('{style}', style ? " style='" + style + "'": "").replace('{readOnly}', readOnly ? " readOnly='true'": "").replace('{required}', required ? " required='true' label='" + column.display + "'": "").replace('{mask}', mask ? " mask='" + mask + "'": "").replace('{id}', inputId.join(''));
            }
            //处理控件类型显示 
            with(UICtrl.GridEditorsUtil) {
                switch (controlType) {
                case 'text':
                    //textbox
                    html.push(inputHtml.replace('{class}', 'textGrid').replace('{controlType}', '').replace('{dataOptions}', ''));
                    break;
                case 'dictionary':
                case 'tree':
                	var dataOptions = [" dataOptions='", $.toJSON(editor.data), "'"].join('');
                    html.push(inputHtml.replace('{class}', 'textGrid').replace('{controlType}', " "+controlType+"='true'").replace('{dataOptions}', dataOptions));
                    break;
                case 'combobox':
                    //combobox
                	var dataOptions = "";
                	if(editor.data.url&&editor.data.mode){//读取远程数据
                		dataOptions = [" dataOptions='", $.toJSON(editor.data), "'"].join('');
                	}else{
                		dataOptions = [" dataOptions='data:", $.toJSON(editor.data), "'"].join('');
                	}
                    html.push(inputHtml.replace('{class}', 'textGrid').replace('{controlType}', " combo='true'").replace('{dataOptions}', dataOptions));
                    break;
                case 'spinner':
                    //spinner
                    html.push(inputHtml.replace('{class}', 'textGrid').replace('{controlType}', " spinner='true'").replace('{dataOptions}', getSpinnerDataOptions(editor)));
                    break;
                case 'date':
                    //date
                    html.push(inputHtml.replace('{class}', 'text').replace('{controlType}', " date='true'").replace('{dataOptions}', ''));
                    break;
                case 'dateTime':
                    //dateTime
                    html.push(inputHtml.replace('{class}', 'text').replace('{controlType}', " dateTime='true'").replace('{dataOptions}', ''));
                    break;
                case 'radio':
                    //radio
                    html.push(createRadioControl(editor.data, gridId + '_' + name + '_' + rowindex, 'radio'));
                    break;
                case 'checkbox':
                    //checkbox
                    html.push(createRadioControl(editor.data, gridId + '_' + name + '_' + rowindex, 'checkbox'));
                    break;
                case 'select':
                    //select
                    html.push(createSelectControl(editor, inputHtml.replace('{class}', 'text').replace('{controlType}', " select='true'"), gridId, rowindex));
                    break;
                case 'lookup':
                    //lookup 
                    html.push(createSelectControl(editor, inputHtml.replace('{class}', 'textGrid').replace('{controlType}', " select='true'")));
                    break;
                default:
                    html.push(inputHtml.replace('{class}', '').replace('{controlType}', 'textGrid').replace('{dataOptions}', ''));
                    break;
                }
            }
            var input = $(html.join('')),_self = this;
            container.append(input);
            Public.autoInitializeUI(container);
            if($.isFunction(editor.onAfterInit)){
            	editor.onAfterInit.call(window,container);
            }
            /********/
            if(controlType=='combobox'||controlType=='select'||controlType=='lookup'||controlType=='tree'||controlType=='dictionary'){
            	var beforeChange=editor.beforeChange,beforeChangeFn=null;
            	if($.isFunction(beforeChange)){//方法
            		beforeChangeFn=function(value){
            			return beforeChange.call(window,value,editParm);
            		};
            	}
        		var getParam=editor.data.getParam,fn=null;
        		if(getParam){//存在获取参数的方法
        			if($.isFunction(getParam)){//方法
            			fn=function(row){
            				return function(){
            					return getParam.call(window,row);
            				};
            			}(editParm.record);
            		}else if($.isPlainObject(getParam)){//json对象
            			fn=function(row){
            				return function(){
            					var param={};
            					$.each(getParam,function(p,o){
                					param[p]=row[o];
                				});
                				return param;
            				};
            			}(editParm.record);
            		}
        		}
        		var options={};
        		if($.isFunction(fn)){
        			options['getParam']=fn;
        		}
        		if($.isFunction(beforeChangeFn)){
        			options['beforeChange']=beforeChangeFn;
        		}
        		//select 需要单独处理返回
                if (controlType == 'select') {
                    if (editor.data.back) {
                        $(input.find('input:first')).combox({
                            onChange: function(value) {
                                $.each(editor.data.back,function(p, o) {
                                	_self._setValueByName(editParm.record,o,value[p]);
                                    _self.updateCell(o, value[p], editParm.record);
                                });
                            },
                            beforeChange:beforeChangeFn
                        });
                    } 
                    if(!$.isEmptyObject(options)){
                    	$(input.find('input:first')).combox(options);
                    }
                }else {
                	if(!$.isEmptyObject(options)){
                		$(input[0]).combox(options);
                	}
                }
        	}
            var _applyEditor=function(chooseRow,chooseColumn){
            	var obj=_self.getCellObj(chooseRow,chooseColumn);
	        	if(obj){
	        		_self.endEdit();
		        	_self._applyEditor(obj);
	        	}
            };
            //按键事件处理 _createEditor
            $("input", container).bind("keydown.gridEditors",function(e,flag) {
            	if (e.ctrlKey) {return;};
		        if (e.keyCode === 13 || e.keyCode === 9||flag===true) {//Enter or Tab
		        	try{$.closeCombox();}catch(e){}//2014-10-30 add 处理选择框不自动清空(记录错误数据)
		        	//只寻找可以编辑的控件
		        	var editColumns=$.grep(_self.columns,function(n,i){
		        		return $.isPlainObject(n.editor);
		        	});
		        	var chooseColumn=null,chooseRow=editParm.record;
		        	var index=$.inArray(column,editColumns);//当前索引
		        	if(index==-1) return;
		        	if (e.shiftKey) {//寻找上一个
		        		if(index==0){//下一行
			        		chooseColumn=editColumns[editColumns.length-1];
			        		chooseRow= $(_self.getRowObj(chooseRow['__id'])).prev();//上一行
			                if (!chooseRow.length) return;
			                chooseRow=_self.getRow(chooseRow[0]);
			        	}else{
			        		chooseColumn=editColumns[index-1];
			        	}
		        	}else{//寻找下一个
		        		if(index==editColumns.length-1){//下一行
			        		chooseColumn=editColumns[0];
			        		chooseRow= $(_self.getRowObj(chooseRow['__id'])).next();//下一行
			                if (!chooseRow.length){
			                	var autoAddRow=_self.options.autoAddRow,autoAddRowByKeydown=_self.options.autoAddRowByKeydown;
			                	if(Public.isBlank(autoAddRowByKeydown)) {autoAddRowByKeydown=true;}
			               	 	if(autoAddRow&&autoAddRowByKeydown){//自动增加一行
			               	 		chooseRow=UICtrl.addGridRow(_self);
			               	 	}
			               	 	setTimeout(function(){//重新执行选中下一行操作
			               	 		_applyEditor(chooseRow,chooseColumn);
			               	 	},10);
			               	 	return;
			                }
			                chooseRow=_self.getRow(chooseRow[0]);
			        	}else{
			        		chooseColumn=editColumns[index+1];
			        	}
		        	}
		        	setTimeout(function(){
		        		_applyEditor(chooseRow,chooseColumn);
		        	},10);
		        }
		        e.stopPropagation();
		    });
            setTimeout(function() {//控制光标
                if (input.is('input.textGrid') && input.is(':visible')) {
                    input.select();
                } else if(input.is('div.textGrid')){
                	input.find('input:first').focus();
                } else if(input.is('div.ui-combox-wrap')){
                  	try{input.find('input:first').trigger('click.combox');}catch(e){}
                } else if(input.attr('combo')||input.attr('tree')||input.attr('dictionary')){
                	try{input.parent().find('input.ui-combox-input').trigger('click.combox');}catch(e){}
                } else{
                    container.find('input[type="text"]:visible').focus();
                }
            },10);
            return input;
        },
        getValue: function(input, editParm) {
        	var editor=editParm['editor'];
        	var _getValue=function(){
            	if (input.is('input')) {
                    return input.getValue();
                } else {
                    return $(input.find('input:first')).getValue();
                }
            };
            var afterEdit=function(){
            	setTimeout(function(){
	            	if($.isFunction(editor.onAfterEdit)){
	        			editor.onAfterEdit.call(window,editParm.record);
	        		}
            	},0);
            };
            var controlType = editor.type || 'text';
            var data={},textField=editor['textField']||editParm.column.name,valueField=editor['valueField']||editParm.column.name;
            switch (controlType) {
	            case 'text':
	            case 'spinner':
	            case 'date':
	            case 'dateTime':
	            	afterEdit();
	            	return _getValue();
	                break;
	            case 'select':
	                return editParm.record[editParm.column.name];
	                break;
	            case 'combobox':
	            case 'tree':
	            case 'dictionary':
	            case 'lookup':
	            	data[textField]=$(input[0]).combox('getText');
	            	data[valueField]=_getValue();
	                break;
	            case 'radio':
	            	data[textField]=$('input:checked', input).next('label').text();
	            	data[valueField]=_getValue();
	                break;
	            case 'checkbox':
	            	var texts = [];
	                $('input:checked', input).next('label').each(function() {
	                    texts.push($(this).text());
	                });
	                data[textField]=texts.join(',');
		            data[valueField]=_getValue();
	                break;
	            default:
	            	return _getValue();
	                break;
	        }
            if(!$.isEmptyObject(data)){
            	//setTimeout(function(){//处理关联数据
            		$.extend(editParm.record, data);
            	//},0);
            }
            afterEdit();
            return data[textField];
        },
        setValue: function(input, value, editParm) {
        	var editor=editParm['editor'];
            var controlType = editor.type || 'text';
            var data=UICtrl.GridEditorsUtil.getLookUpValue(editParm);
            switch (controlType) {
                 case 'text':
                 case 'spinner':
                 case 'date':
                 case 'dateTime':
                	 $(input[0]).setValue(value);
                     break;
                 case 'combobox':
                	 $(input[0]).combox('setValue', data.value);
                     break;
                 case 'radio':
                	 $(input.find('input:first')).setValue(data.value);
                     break;
                 case 'checkbox':
                	 $(input.find('input')).setValue(data.value);
                     break;
                 case 'select':
                	 $(input.find('input:first')).setValue(value);
                     break;
                 case 'tree':
                 case 'dictionary':
                 case 'lookup':
                	 $(input[0]).combox('setValue', {
                		 fieldValue: data.value,
                         lookUpValue: data.text
                     });
                     break;
                 default:
                	 $(input[0]).setValue(value);
                     break;
            }
        },
        resize: function(input, width, height, editParm) {
            var controlType =editParm['editor']['type'] || 'text';
            if (controlType == 'text' || controlType == 'radio' || controlType == 'checkbox') {
                var paddingWidth = parseInt(input.css('paddingLeft')) + parseInt(input.css('paddingRight'));
                var marginWidth = parseInt(input.css('marginLeft')) + parseInt(input.css('marginRight'));
                input.width(width - paddingWidth - marginWidth - 1).height(height + 1);
                if($.browser.safari||($.browser.msie && $.browser.version < 8)){
                	input.css({top:-2});
                }
            } else {
            	var diffTop=0;
            	if($.browser.safari){
                	diffTop=-1;
                }
                var ui = null;
                if (controlType == 'select') {
                    ui = input;
                } else if (controlType == 'spinner') {
                    ui = input.parent('span.ui-spinner');
                    ui.find('span.ui-spinner-arrow').height(height + 1);
                } else if (controlType == 'date' || controlType == 'dateTime') {
                    ui = input.parent('div.ui-combox-wrap');
                } else {
                    ui = input.next('div.ui-combox-wrap');
                }
                ui.css({
                    position: 'relative',
                    top: -2+diffTop,
                    left: '-1px',
                    borderColor: '#AAAAAA'
                }).width(width).height(height + 1);
            }
        },
        destroy:function(input, editParm){
        	input.removeAllNode();
        }
    };
});

$.ligerDefaults.Grid.formatters=$.ligerDefaults.Grid.formatters||{};
$.ligerDefaults.Grid.formatters['money'] = function (value, column){
	return Public.currency(value);
};
$.ligerDefaults.Grid.formatters['date'] = function (value, column){
	if(Public.isBlank(value)) return "";
	if(value.length>10) return value.substring(0,10);
	return value;
};
$.ligerDefaults.Grid.formatters['datetime'] = function (value, column){
	if(Public.isBlank(value)) return "";
	if(value.length>16) return value.substring(0,16);
	return value;
};
UICtrl.autoInitializeGridUI=function(grid){
	var table=$('table.l-grid-body-table',grid);
	Public.autoInitializeUI(table);
};
UICtrl.setGridRowAutoHeight=function(grid){
	var div=$(grid);
	var tr1s=$('div.l-grid-body1',div).find('tr');
	var tr2s=$('div.l-grid-body2',div).find('tr');
	if(tr1s.length==0||tr2s.length==0){
		return;
	}
	$("div.l-grid-row-cell-inner",div).css("height", "auto");
	tr1s.css("height", "auto");
	tr2s.css("height", "auto");
	var tmpTr=null;
	tr1s.each(function(i){
		tmpTr=$(tr2s.get(i));
		var maxHeight=Math.max($(this).height(),tmpTr.height());
		$(this).height(maxHeight);
		tmpTr.height(maxHeight);
	});
};
UICtrl.getAddGridData=function(grid){
	 var autoAddRow=grid.options.autoAddRow,data={};
	 if(autoAddRow){
		 data={};
		 $.each(grid.columns,function(i,o){
			 if(o.name){
				 data[o.name]=''; 
			 }
		 });
	 }else{
//		 Public.tip('没有数据源!');
		 return false;
	 }
	 return $.extend(data,autoAddRow);
};
UICtrl.addGridRow=function(grid,data){
	data=data||{};
	var rowData=UICtrl.getAddGridData(grid);
    if(rowData===false) return;
    data=$.extend(rowData,data);
    setTimeout(function(){
    	grid.gridbody.scrollTop(9999);
    },0);
    grid.options.clearScroll=true;
    return grid.addRow(data,null,false);
};
/***********设置列宽度自适应***************/
//增加取字符串长度
UICtrl.getLength = function (str, maxWidth) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 8;
        else realLength += 13;
    }
    if (maxWidth > 0) {
        if (realLength > maxWidth) realLength = maxWidth;
    }
    else {
        if (realLength > 300) realLength = 300;
    }
    if (realLength < 80) realLength = 80;
    return realLength;
};
UICtrl.setGridColumnAutoWidth = function (grid) {
    var data = grid.getData();
    var columns = grid.getColumns();
    var widthList = [];
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < columns.length; j++) {
            if (columns[j].isReloadWidth) {
                widthList[columns[j].columnindex] = columns[j].width;
            }
            else {
                if (columns[j].isAutoWidth == undefined || columns[j].isAutoWidth === 1) {
                    var autoDiffWidth = 5;
                    if (columns[j].autoDiffWidth)
                        autoDiffWidth = parseInt(columns[j].autoDiffWidth);
                    var maxWidth = 0;
                    if (columns[j].maxWidth)
                        maxWidth = parseInt(columns[j].maxWidth);
                    if (columns[j].name && columns[j].type != "date" && columns[j].name != "sortID" && columns[j].name != 'status') {
                        var value = data[i][columns[j].name] || "1234567890";
                        var currColumnWidth = UICtrl.getLength(value, maxWidth) + autoDiffWidth;
                        if (widthList[columns[j].columnindex]) {
                            if (currColumnWidth > widthList[columns[j].columnindex]) {
                                widthList[columns[j].columnindex] = currColumnWidth;
                            }
                        }
                        else {
                            widthList[columns[j].columnindex] = currColumnWidth;
                        }
                    }
                }
            }
        }
    }
    for (var i = 0; i < widthList.length; i++) {
        if (widthList[i]) {
            grid.setColumnWidth(i, parseInt(widthList[i]));
        }
    }
};
//获取页面的高度、宽度
UICtrl.getPageSize=function() {
    var windowWidth, windowHeight;
    if (self.innerHeight) { // all except Explorer   
        if (document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            windowWidth = self.innerWidth;
        }
        windowHeight = self.innerHeight;
    } else {
        if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else {
            if (document.body) { // other Explorers    
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }
        }
    }
    return {w:windowWidth,h:windowHeight};
};

UICtrl.autoSetWrapperDivHeight = function (fn) {	
	$('html').addClass("html-body-overflow");
	var pageSize = UICtrl.getPageSize();
	if($.browser.msie && $.browser.version < 8){
		$('#mainWrapperDiv').height(pageSize.h-10);
	}
	$('#divTreeArea').height(pageSize.h - 40);	
	if(fn&&$.isFunction(fn)){
		fn.call(window,pageSize);
	}
	$(window).resize(function (){
		var _size = UICtrl.getPageSize();
		if(_size.h>10){
			if($.browser.msie&&$.browser.version < 8){
				$('#mainWrapperDiv').height(_size.h-10);
			}
			$('#divTreeArea').height(_size.h - 40);
			if(fn&&$.isFunction(fn)){
				fn.call(window,_size);
			}
	    }
	});
};

//搜索区域 收缩/展开
UICtrl.setSearchAreaToggle = function (grid,doc,autoHide) {
	if(typeof doc =='undefined'){
		doc=$('#navTitle');
		autoHide=true;
	}else if(typeof doc == 'boolean'){
		autoHide=doc;
		doc=$('#navTitle');
	}
	var button=$("a.togglebtn",doc);
	var table=$('#'+button.attr('hideTable'));
	if(autoHide!==false){
		table.hide();
		button.addClass('togglebtn-down');
		if (grid) {
			grid._onResize.ligerDefer(grid, 50);
	    }
	}
	$("span.titleSpan",doc).add(button).on('click', function () {
    	table.toggle();
    	button.toggleClass('togglebtn-down');
        if (grid) {
        	try{
        		grid.reRender();
        	}catch(e){
        		grid._onResize.ligerDefer(grid, 50);
        	}
        }
    });
};
//分组收缩/展开
UICtrl.autoGroupAreaToggle = function (doc) {
	doc=doc||document;
    $("a.togglebtn",doc).on('click', function () {
    	var hideTable=$(this).attr('hideTable');
    	var hideIndex=$(this).attr('hideIndex');
    	if(!Public.isBlank(hideTable)){
    		$.each(hideTable.split(','),function(i,expr){
    			$(expr).toggle();
    		});
    	}
    	if(!Public.isBlank(hideIndex)){
    		var index=parseInt(hideIndex);
    		if(!isNaN(index)&&index>0){
    			var parent=$(this).parent().parent();
    			if(parent.is('td')){//寻找TR
    				parent=parent.parent();
    			}
    			parent.nextAll(":lt("+index+")").toggle();
    		}
    	}
    	$(this).toggleClass('togglebtn-down');
    });
};
//默认按钮定义
UICtrl.defaultToolbarOptions={
	addFolderHandler:{id:'AddFolder',text:'添加文件夹',img:'page_new.gif'},
	addHandler:{id:'Add',text:'添加',img:'page_new.gif'},
	dutyMainTainHandler:{id:'DutyMainTain',text:'报修岗位维护',img:'page_new.gif'},
	addBatchHandler:{id:'AddBatch',text:'批量添加',img:'page_extension.gif',title:'aaaaa'},
	updateHandler:{id:'Update',text:'修改',img:'page_edit.gif'},
	deleteHandler:{id:'Delete',text:'删除',img:'page_delete.gif'},
	saveSortIDHandler:{id:'SaveID',text:'保存排序号',img:'save.gif'},
	saveHandler:{id:'Save',text:'保存',img:'save.gif'},
	enableHandler:{id:'Enable',text:'启用',img:'page_tick.gif'},
	disableHandler:{id:'Disable',text:'禁用',img:'page_cross.gif'},
	moveHandler:{id:'Move',text:'移动',img:'cut.gif'},
	exportExcelHandler:{id:'ExportExcel',text:'导出Excel',img:'page_down.gif'},
	copyHandler:{id:'Copy',text:'复制新增',img:'copy.gif'},
	viewHandler:{id:'View',text:'查看',img:'page.gif'},
	saveImpHandler:{id:'SaveImp',text:'导入Excel',img:'page_up.gif'}
};
//组合页面Grid操作按钮
UICtrl.getDefaultToolbarOptions = function (options) {
    var op = options || {},items = [];
    var url=web_app.name +'/themes/default/images/icons/';
    var title='';
    $.each(op,function(p,o){
    	if(o===false) return;
    	if($.isFunction(o)&&UICtrl.defaultToolbarOptions[p]){
    		title=UICtrl.defaultToolbarOptions[p]['title']||'';
    		with (UICtrl.defaultToolbarOptions[p]){
    			items.push({ id: "menu"+id, text:text, click:o, img: url+img,itemId:p,title:title});
    			items.push({ id: "line"+id, line: true ,itemId:p});
    		}
    	}else{
    		title=o['title']||'';
    		items.push({ id: "menu"+o['id'], text:o['text'], click:o['click'], img: url+(o['img']||'save.gif'),itemId:p,title:title});
			items.push({ id: "line"+o['id'], line: true,itemId:p});
    	}
    });
    if(items.length===0){
    	return false;
    }
    return { items: items };
};
UICtrl.getTotalSummary=function(){
   return {
		render: function (suminf, column, data){
			if(!data) return'';
			if(column.type=='money'){
	    		return '<div>' + Public.currency(data.totalFields[column.name]) + '</div>';
			}else{
				return '<div>' + data.totalFields[column.name] + '</div>';
			}
		},
		align: 'right'
   };
};
UICtrl.initDefaulLayout = function(){
	UICtrl.layout("#layout", { leftWidth : 200,  heightDiff : -5 });
};

//关闭Tab项,如果tabid不指定，那么关闭当前显示的
UICtrl.closeCurrentTab = function (tabId) {
	if(UICtrl.convertForPhone){
		window.close();//手机端访问直接调用
	}else{
		tabId=tabId||'';
		try{parent.closeTabItem(tabId);}catch(e){}
	}
};
//关闭Tab项并且刷新父窗口
UICtrl.reloadParentTab = function(parentTabId){
	try{parent.reloadParentTab(parentTabId);}catch(e){}
};
//关闭Tab项并且刷新父窗口
UICtrl.closeAndReloadParent = function(parentTabId,tabId){
	if(UICtrl.convertForPhone){
		window.close();//手机端访问直接调用
	}else{
		tabId=tabId||parent.getCurrentTabId();
		$.each(parentTabId.split(','),function(i,o){
			UICtrl.reloadParentTab(o);
		});
		UICtrl.closeCurrentTab(tabId);
	}
};
//关闭Tab项并且刷新父窗口和首页窗口
UICtrl.closeAndReloadTabs = function(parentTabId,tabId){
	if(UICtrl.convertForPhone){
		if(UICtrl.entranceKind === "weixin"){
			window.location.href = "http://weixin.brc.com.cn:8100/weixin.do?url=TaskList_1";
		}else{
			window.close();//手机端访问直接调用
		}
	}else{
		tabId=tabId||parent.getCurrentTabId();
		if(parentTabId=='TaskCenter'){
			UICtrl.ProcessCommand.FINISHED = true;
			UICtrl.reloadParentTab('main_tab');//首页tab
		}
		UICtrl.reloadParentTab(parentTabId);
		UICtrl.closeCurrentTab(tabId);
	}
};

UICtrl.sequenceRender = function(item,idFieldName) {
	idFieldName=idFieldName||'id';
	return "<input type='text' style='margin-top:2px;' id='txtSequence_" + item[idFieldName] + "' class='textbox' value='" + item.sequence + "' />";
};

UICtrl.getStatusInfo=function(status) {
	status = $.isPlainObject(status) ? status.status:status;
    switch (parseInt(status)) {
        case -1:
            return "<div class='No' title='禁用'/>";
            break;
        case 0:
            return "<div class='tmp' title='草稿'/>";
            break;
        case 1:
            return "<div class='Yes' title='启用'/>";
            break;
    }
};

/*
键盘键
*/
var VirtualKey = {
    ALT: 18,
    BACKSPACE: 8,
    CAPS_LOCK: 20,
    COMMA: 188,
    COMMAND: 91,
    COMMAND_LEFT: 91, // COMMAND
    COMMAND_RIGHT: 93,
    CONTROL: 17,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    INSERT: 45,
    LEFT: 37,
    MENU: 93, // COMMAND_RIGHT
    NUMPAD_ADD: 107,
    NUMPAD_DECIMAL: 110,
    NUMPAD_DIVIDE: 111,
    NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106,
    NUMPAD_SUBTRACT: 109,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SHIFT: 16,
    SPACE: 32,
    TAB: 9,
    UP: 38,
    F7: 118,
    F12: 123,
    S: 83,
    WINDOWS: 91 // COMMAND 
};

/**
 * 初始化页面回车事件
 */
UICtrl.initPageEnterEvent = function (inputs, lastToId) {
    $(inputs).keypress(function (e) {
        if (e.which == VirtualKey.ENTER) {
            var newInputs = "";
            var inputList = inputs.split(',');
            for (var i = 0; i < inputList.length; i++) {
                if (inputList[i]) {
                    newInputs += inputList[i] + ':visible';
                    if (i < inputList.length - 1)
                        newInputs += ',';
                }
            }

            var inputObjects = $(newInputs);
            var index = inputObjects.index(this);

            if (e.shiftKey) {
                if (index != 0) {
                    inputObjects[index - 1].focus();
                }
            } else {
                if (index == inputObjects.length - 1) {
                    if (lastToId) {
                        $(this).trigger("blur");
                        $(lastToId).trigger("click");
                    }
                }
                else {
                    inputObjects[index + 1].focus();
                }
            }
        }
    });
};

UICtrl.showMoveTreeDialog=function(op){
	op=op||{};
	if(op.gridManager){
		var rows = op.gridManager.getSelectedRows();
		if (!rows || rows.length < 1) {
			Public.tip('请选择数据！');
			return;
		}
	}
	if(!UICtrl.moveTreeDialog){
		UICtrl.moveTreeDialog=UICtrl.showDialog({title:op.title||'移动到...',width:300,
			content:'<div style="overflow-x: hidden; overflow-y: auto; width:280px;height:250px;"><ul id="dialogMoveTree"></ul></div>',
			init:function(){
				$('#dialogMoveTree').commonTree({kindId : op.kindId,IsShowMenu : false});
			},
			ok:function(){
				var parentId=$('#dialogMoveTree').commonTree('getSelectedId');
				if(!parentId){
					Public.tip('请选择树节点！');
					return false;
				}
				var node=$('#dialogMoveTree').commonTree('getSelected');
				var flag=op.save.call(window,parentId,node);
				if(flag===false){
					return false;
				}
				UICtrl.moveTreeDialog.hide();
			},
			close: function () {
		        this.hide();
		        return false;
		    }
		});
	}else{
		$('#dialogMoveTree').commonTree('refresh');
		UICtrl.moveTreeDialog.show().zindex();
	}
};

UICtrl.enable=function(input) {
	var $input=$(input),className='textReadonly';
	if($input.isRequired()){
		$input.parents('td').prev('td').find('font').show();
		$input.parents('dd').prev('dt').find('font').show();
	}
	if($input.is('textarea')){
		className='textareaReadonly';
	}
	if($input.is(':hidden')){
		var obj=$input.data('ui-combox');
		if(obj){
			$input.combox('enable');
		}
		if($input.is('[type="hidden"]')){
		    return;
		}
	}
	var td=$input.parent('td.edit');
	if(td.length>0){
		td.removeClass('disable');
	}
	if($input.hasClass('ui-combox-input')){
		var obj=$input.data('ui-combox-obj');
		if(obj){
			obj.enable();
		}
	}
	var obj=$input.data('spinner');
	if(obj){
		$input.spinner('enable');
	}
	if($input.hasClass("ui-datepicker-disable")||$input.parent().hasClass("ui-datepicker-disable")){
		$input.datepickerEnable();
	}
	$input.removeAttr('readonly').removeClass(className);
	if($input.is(':radio')||$input.is(':checkbox')){
		$input.removeAttr('disabled');
	}
};
UICtrl.disable=function(input) {
	var $input=$(input),className='textReadonly';
	if($input.isRequired()||$input.hasClass('ui-combox-required')){//清除红色*号
		$input.parents('td').prev('td').find('font').hide();
		$input.parents('dd').prev('dt').find('font').hide();
	}
	if($input.is('textarea')){
		className='textareaReadonly';
		if(!$input.parents('div.ui_content').length){
			$input.textareaAutoHeight();
		}
	}
	if($input.is(':hidden')){
		var obj=$input.data('ui-combox');
		if(obj){
			$input.combox('disable');
			return;
		}
	    if($input.is('[type="hidden"]')){
	    	return;
	    }
	}
	var td=$input.parent('td.edit');
	if(td.length>0){
		td.addClass('disable');
	}
	if($input.hasClass('ui-combox-input')){
		var obj=$input.data('ui-combox-obj');
		if(obj){
			obj.disable();
		}
	}
	var obj=$input.data('spinner');
	if(obj){
		$input.spinner('disable');
	}
	if($input.hasClass("ui-datepicker")||$input.parent().hasClass("ui-datepicker")){
		$input.datepickerDisabled();
	}
	$input.attr('readonly',true).addClass(className);
};

//回车查询事件
UICtrl.onKeyDownListener = function(event, obj){
	var keyCode = event.charCode||event.keyCode||event.which;
	if (keyCode == VirtualKey.ENTER) {
		var param = $(obj).formToJSON();
		UICtrl.gridSearch(gridManager, param);
	}
};

UICtrl.bindEnterEvent = function(){
	$('input:text:first').focus();
	var $inp = $('input:text');
	$inp.bind('keydown', function (event) {
		var keyCode = event.charCode || event.keyCode || event.which; 
	    if (keyCode == VirtualKey.ENTER) {
	    	event.preventDefault();
	        var nextIndex = $inp.index(this) + 1;
	        $(":input:text:eq(" + nextIndex + ")").focus().click();
	    }
	});
};

//UICtrl.bindEvents = function(){
//	$('input:text:first').focus();
//	var $inp = $('input.text,input.ui-button-inner');
//	$inp.bind('keydown', function (event) {
//		var keyCode = event.charCode||event.keyCode||event.which;; 
//	    if (keyCode == VirtualKey.ENTER) {
//	    	event.preventDefault();
//	        var nxtIdx = $inp.index(this) + 1;//debugger;
//	        var $now = $inp.get(nxtIdx);
//	        $now.focus().click();
////	        $(":input.text:eq(" + nxtIdx + ")").focus().click();
////	        $('input#ye').focus().click();
//	    }
//	});
//};

//控制多选
UICtrl.checkSelectedRows = function(gridManager){
	var rows = gridManager.getSelectedRows();
	if (rows.length == 0) {
		Public.tip('请选择数据！');
		return false;
	} else if (rows.length > 1) {
		Public.tip("只能对一条数据进行处理！");
		return false;
	}
	return rows[0];
};
//创建查询输入框
UICtrl.createQueryBtn=function(el,event){
	var html=['<div class="ui-grid-query-div">'];
	html.push('<input type="text" class="ui-grid-query-input">');
	html.push('<span class="ui-grid-query-button" title="查询"></span>');
	html.push('</div>');
	var div=$(html.join('')).appendTo(el);
	var button=div.find('span.ui-grid-query-button');
	button.on('click',function(){
		if($.isFunction(event)){
			event.call(window,div.find('input').val());
		}
	});
	div.find('input').bind('keyup.queryForm',function(e){
		var k =e.charCode||e.keyCode||e.which;
		if(k==13){//回车
			if($.isFunction(event)){
				event.call(window,div.find('input').val());
			}
		}
	});
};
//在grid上创建查询按钮
UICtrl.createGridQueryBtn=function(grid,title,event){
	if($.isFunction(title)){
		event=title;
		title='div.l-panel-header';
	}
	if($(grid).find(title).length>0){
		UICtrl.createQueryBtn($(grid).find(title),event);
	}
};
//查询界面回车执行查询
UICtrl.initKeyDownQueryGrid=function(){
	var form=$('#queryMainForm');
	if($.isFunction(window['query'])&&form.length>0){
		form.bind('keyup.queryForm',function(e){
			var k =e.charCode||e.keyCode||e.which;
			if (e.ctrlKey) {
				return;
			}
			if(k==13){//回车
				window['query'](form);
			}
		});
	}
};

/**
 * 合并单元格
 */
UICtrl.mergeCell = function(columnName, $grid){
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
	
	$("td[id$='" + columnId + "']", $grid).each(function(index){
		if (j == $("div", this).text()) {
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

/**
 * 对树表添加级别选择按钮，可按级别进行收缩。注册在onAfterShowData事件中
 * @param {} grid
 * @param {} btnPrefix 按钮ID的前缀
 */
UICtrl.addLevelFilterButton=function(grid, btnPrefix){	
	if(!btnPrefix){
		btnPrefix = "Level";
	}
	
	$("> .l-toolbar-item[toolbarid^='" + btnPrefix + "']", grid.toolbarManager.toolBar).remove();
	
    var totalLevel = 0;
    for (var j = 0; j < grid.rows.length; j++) {
        if (totalLevel < grid.rows[j].__level) {
            totalLevel = grid.rows[j].__level;
        }
    }
    btns = new Array();
    for (var j = 1; j <= totalLevel; j++) {
        btns[j] = {
            id: btnPrefix + j, img: 'themes/default/images/icons/function.gif', text: j, click: function () {
                for (var i = 0; i < grid.rows.length; i++) {
                    if (grid.rows[i].__level == 1) {
                        grid.collapse(grid.rows[i]);
                        grid.expand(grid.rows[i]);                       
                    }
                }
                for (var i = 0; i < grid.rows.length; i++) {
                    if (grid.rows[i].__level == parseInt(this.text)) {
                        grid.collapse(grid.rows[i]);
                    }
                }
                $('body').resize();
            }
        };
        grid.toolbarManager.addItem(btns[j]);
    }
};
/********************选择流程模板*******************/
UICtrl.chooseProcessTemplate=function(fn){
	var ownerProcessTemplates={};
	Public.ajax(web_app.name + "/configurationAction!queryUserProcessTemplate.ajax",{},function(data){
		var height=0,length=data.length;
		height=length*30+30;
		if(height>400){
			height=400;
		}
		var html = ['<div style="height:'+height+'px;overflow-x:hidden;overflow-y:auto;position: relative;" >','<table class="tableInput" id="processTemplateTable">'],handlerGroupId=null;
		html.push('<thead><tr class="table_grid_head_tr">');
		html.push('<th style="width:20%;">模板名称</th>');
		html.push('<th style="width:63%;">包含人员</th>');
		html.push('<th style="width:17%;">操&nbsp;作</th>');
		html.push('</tr></thead>');
		$.each(data, function(i, o){
			handlerGroupId=o['handlerGroupId'];
			ownerProcessTemplates[handlerGroupId]=o;
			html.push('<tr style="min-height:25px;">');
			html.push('<td class="disable" style="text-align:center;">',o['name'],'</td>');
			html.push('<td class="disable" style="text-align:left;">');
			html.push(UICtrl.getProcessTemplateUsersHtml(o.details));//组合组织信息显示
			html.push('</td>');
			html.push('<td class="disable" style="text-align:left;"><div class="operating">');
			html.push('<a href="javascript:void(null);" class="GridStyle choose" id="',handlerGroupId,'" title="',o['name'],'"><span class="ui-icon ui-icon-down">&nbsp;</span>选择</a>&nbsp;');
			html.push('<a href="javascript:void(null);" class="GridStyle edit" id="',handlerGroupId,'"><span class="ui-icon ui-icon-edit">&nbsp;</span>编辑</a>&nbsp;');
			html.push('</div></td>');
			html.push('</tr>');
        });
		html.push('</table>','</div>');
		var options={
			title:'流程模板选择',content:html.join(''),width: 625,opacity:0.1,height:height,
			onClick:function($el){
				if($el.is('a.GridStyle')){
					if($el.hasClass('edit')){
						parent.addTabItem({ tabid: 'controlPanel', text: '控制面板 ', url: web_app.name+'/personOwnAction!forwardUsercontrol.do?codeId=setProcessTemplates'});
						this.close();
					}else if($el.hasClass('choose')){
						var handlerGroupId=$el.attr('id'),title=$el.attr('title');
						var processTemplatesObject=ownerProcessTemplates[handlerGroupId];
						if(processTemplatesObject){
							var details=processTemplatesObject['details'];
							if($.isFunction(fn)){
								fn.call(this,details,title)
							}
						}
					}
			    }
			}
		};
		Public.dialog(options);
		var tableHeight=$('#processTemplateTable').height()+20;
		if(tableHeight>height){
			if(tableHeight>400){
				tableHeight=400;
			}
			$('#processTemplateTable').parent().height(tableHeight);
		}
	});
};
UICtrl.getProcessTemplateUsersHtml=function(details){
	var html=[],groupId=0;
	$.each(details,function(i,d){
		if(groupId==0){
			html.push('[');
			groupId=d['groupId'];
		}
		if(groupId!=d['groupId']){
			html.push('][');
			groupId=d['groupId'];
		}
		html.push('<span title="',d['fullName'],'" style="word-break:keep-all;">');
		html.push('<img src="',OpmUtil.getOrgImgUrl('psm',d['status']),'" width="16" height="16"/>');
		html.push(d['name']);
		html.push('</span>;&nbsp;');
	});
	if(groupId!=0){
		html.push(']')
	}
	return html.join('');
};
//保存流程模板
UICtrl.saveProcessTemplate=function(details){
	var handlerArray=new Array();
	$.each(details,function(i,o){
		o['commonHandlerId']='';
		handlerArray.push(o);
	});
	Public.ajax(web_app.name + "/configurationAction!queryUserProcessTemplate.ajax",{},function(data){
		var height=0,length=data.length;
		height=length*30+30;
		if(height>400){
			height=400;
		}
		var html = ['<div style="height:'+height+'px;overflow-x:hidden;overflow-y:auto;position: relative;" >','<table class="tableInput" id="processTemplateTable">'],handlerGroupId=null;
		html.push('<thead><tr class="table_grid_head_tr">');
		html.push('<th style="width:20%;">模板名称</th>');
		html.push('<th style="width:65%;">包含人员</th>');
		html.push('<th style="width:15%;">操&nbsp;作</th>');
		html.push('</tr></thead>');
		$.each(data, function(i, o){
			handlerGroupId=o['handlerGroupId'];
			html.push('<tr style="min-height:25px;">');
			html.push('<td class="disable" style="text-align:center;">',o['name'],'</td>');
			html.push('<td class="disable" style="text-align:left;">');
			html.push(UICtrl.getProcessTemplateUsersHtml(o.details));//组合组织信息显示
			html.push('</td>');
			html.push('<td class="disable" style="text-align:left;"><div class="operating">');
			html.push('<a href="javascript:void(null);" class="GridStyle" id="',handlerGroupId,'"><span class="ui-icon ui-icon-edit">&nbsp;</span>覆盖模板</a>&nbsp;');
			html.push('</div></td>');
			html.push('</tr>');
        });
		html.push('</table>','</div>');
		html.push('<div style="text-align:right;padding-right: 15px;padding-top:5px;">');
		html.push('<input type="button" value="新建模板" class="buttonGray ui-button-inner"/>');
		html.push('<input type="button" value="维护模板" class="buttonGray ui-button-modif"/>');
		html.push('<input type="button" value="取 消" class="buttonGray ui-button-close"/>');
		html.push('</div>');
		var options={
			title:'保存流程模板',content:html.join(''),width: 625,opacity:0.1,height:height,
			onClick:function($el){
				var handlerGroupId='',_self=this;
				if($el.is('input.ui-button-close')){
					this.close();
				}
				if($el.is('a.GridStyle')){
					handlerGroupId=$el.attr('id');
					if(window.confirm('确定覆盖模板吗?')){
						var param={handlerGroupId:handlerGroupId,detailData:encodeURI($.toJSON(handlerArray))};
						Public.ajax(web_app.name + "/configurationAction!saveUserProcessTemplate.ajax",param,function(data){
							_self.close();
						});
					}
			   }
			   if($el.is('input.ui-button-inner')){
			   		UICtrl.doProcessTemplate({handlerArray:handlerArray});
			   		this.close();
			   }
			   if($el.is('input.ui-button-modif')){
			   		parent.addTabItem({ tabid: 'controlPanel', text: '控制面板 ', url: web_app.name+'/personOwnAction!forwardUsercontrol.do?codeId=setProcessTemplates'});
			   		this.close();
			   }
			}
		};
		Public.dialog(options);
		var tableHeight=$('#processTemplateTable').height()+20;
		if(tableHeight>height){
			if(tableHeight>400){
				tableHeight=400;
			}
			$('#processTemplateTable').parent().height(tableHeight);
		}
	});
};
//打开新增流程模板对话框
UICtrl.doProcessTemplate=function(op){
	var groupId=op['groupId'],handlerArray=op['handlerArray'];
	var id='',name='',sequence=1;
	if(window['processTemplatesMaxSequence']) sequence=processTemplatesMaxSequence+1;
	if(groupId&&window['processTemplates']&&processTemplates[groupId]){
		var group=processTemplates[groupId];
		id=groupId;
		sequence=group['sequence'];
		name=group['name'];
	}
	var html=['<form method="post" action="" id="submitProcessTemplateForm"><div class="ui-form">'];
	html.push('<dl>');
	html.push('<dt style="width:70px">排序号<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd><input type="text" name="sequence" id="groupSequence" class="text" required="true" label="序号" value="',sequence,'" spinner="true" mask="nnnn"></dd>');
	html.push('</dl>');
	html.push('<dl>');
	html.push('<dt style="width:70px">名称<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd><input type="text" name="name" id="groupName" class="text" required="true" label="名称" value="',name,'"></dd>');
	html.push('</dl>');
	html.push('</div></form>');
	UICtrl.showDialog({title:'流程模板',width:300,top:150,
		content:html.join(''),
		ok:function(){
			var param=$('#submitProcessTemplateForm').formToJSON();
			if(!param) return false;
			param['handlerGroupId']=id;
			param['groupKind']='users';
			if(handlerArray){
				param['detailData']=encodeURI($.toJSON(handlerArray));
			}
			Public.ajax(web_app.name + "/configurationAction!saveUserProcessTemplate.ajax",param,function(data){
				if($.isFunction(op['callBack'])){
					op['callBack'].call(window);
				}
			});
			return true;
		}
   });
};

UICtrl.setRequired = function($el){
	$el.find(".edit input").attr("required",true);
	$el.find(".title span").each(function(i){
		var text = $(this).text();
		text = text.replace(":","<font color=\"#FF0000\">*</font>:");
		$(this).html(text);
	});
};
/***********系统资源选择**************/
UICtrl.initChooseResourceDialog = function(el,op){
	var inputParams =$.extend({
		parentId: "1",
		checkbox:false ,
		searchQueryCondition:false,
		checkIndexField:null,
		onChoose:false,
		onShow:false,
		orgChoose:true,
		manageType:null
	},op||{});
	var $el=$(el),span,input;
	if($el.is('input')){
		input=$el;
	}
	span=$el.next('span');
	if(span.length>0){
		$el=span;
		/*input.bind('keyup.queryComboDialog',function(e){
			var k =e.charCode||e.keyCode||e.which;
			var value=$(this).val();
			input.attr('queryComboDialog',true);
			if(k==13&&!Public.isBlank(value)){//回车
				$el.trigger('click');
			}
		});*/
		input.bind('click.queryComboDialog',function(e){
			$el.trigger('click');
		});
	}
	var resourceKindMap ={
		project:{name:"项目",color:'#C1232B'},
		stage:{name:"分期",color:'#B5C334'},
		building:{name:"楼栋",color:'#FCCE10'},
		floor:{name:"楼层",color:'#E87C25'},
		room:{name:"房间",color:'#27727B'}
	}
	$el.comboDialog({type:'masterdata',name:'mdResourceSelectByTree',title:'请选择资源 ...',width:670,leftWidth:230,
		checkbox:inputParams.checkbox,dataIndex:'id',checkIndexField:inputParams.checkIndexField,
		manageType:inputParams.manageType,
		onShow:inputParams.onShow,
		columnRender:{
			resourceKindId:function(item){
				var resourceKindId=item.resourceKindId,color,name,html=[];
				var resourceKind=resourceKindMap[resourceKindId];
				if(resourceKind){
					color=resourceKind['color'],name=resourceKind['name'];
					html.push('<font color="',color,'">',name,'</font>');
				}
				return html.join('');
			}
		},
		onInit:function(doc){
			$('span.combo-dialog-title-span',doc).html('资源目录');
			$('span.combo-dialog-center-span',doc).html('资源列表');
			var html=["<input type='button' value='清 空' class='buttonGray' id='clearResourceSelectByTree'/>"];
			html.push('&nbsp;','<span style="color:#666">级联查询，多个关键词请用空格分开；</span>');
			$('input.buttonGray',doc).after(html.join(''));
			$('input.keyValue',doc).parent().width(200);
			var _self=this;
			$('#clearResourceSelectByTree').on('click',function(e){
				$('span.combo-dialog-center-span',doc).html('资源列表');
				$('input.keyValue',doc).val('');
				try{
					_self.folderId='';
					_self.gridManager.options.parms['folderId']='';
					_self.gridManager.options.parms['paramValue']='';
				}catch(e){
				}
			});
			/*if(input){
				var queryComboDialog= input.attr('queryComboDialog');
				if(queryComboDialog){
					$('input.keyValue',doc).val(input.val());
					$('input.ui-button-inner',doc).trigger('click');
				}
				input.removeAttr('queryComboDialog');
			}*/
			//添加公司查询条件
			if(inputParams.orgChoose){
				var orgHtml=['<font style="color:#990000;">','公司/项目&nbsp;:&nbsp;','</font>'];
				orgHtml.push('<input id="mdResourceOrgQuery" type="text" class="text combox_button textSearch" style="width:130px;height:21px;">');
				$('span.combo-dialog-title-span',doc).html(orgHtml.join(''));
				$('#mdResourceOrgQuery').searchbox({type:'masterdata',name:'mdResourceOrgQuery',
					manageType:inputParams.manageType,
					getOffset:function(){
						var of=$('#mdResourceOrgQuery').offset(),_height=$('#mdResourceOrgQuery').outerHeight();
						return {top:of.top+_height+1,left:of.left};
					},
					onChange:function(o){
						inputParams.parentId=o['projectId'];
						_self['branchOrgId']=o['id'];
						$('ul.comboChooseTree',doc).removeAllNode();
						$('div.combo-dialog-left-down',doc).html("<ul class='comboChooseTree'></ul>");
						_self.initTree(doc);
					},
					back:{id:'',name:'#mdResourceOrgQuery',projectId:''}
				});
			}
		},
		getParam:function(){
			var searchQueryCondition=inputParams.searchQueryCondition;
			if(searchQueryCondition){
				if($.isFunction(searchQueryCondition)){
					searchQueryCondition = searchQueryCondition.call(window);
				}
				return {searchQueryCondition:searchQueryCondition};
			}
			return {};
		},
		gridOptions:function(){
			var _self=this;
			return {
				delayLoad :true,//默认先不查询
				onDblClickRow:function(data){//双击事件
					var flag=true;
					if($.isFunction(inputParams.onChoose)){
						flag=inputParams.onChoose.call(_self);
					}
					if(flag){
						_self.closeDialog();
					}
				}
			};
		},
		treeOptions:function(doc){//资源树
			var _self=this;
			var vParentId=inputParams.parentId;
			if($.isFunction(vParentId)){
				vParentId=vParentId.call(window);
			}
			if(!vParentId||vParentId==''){
				vParentId='1';//默认为1
			}
			return {
				loadTreesAction:'treeViewAction!root.ajax',
				parentId :vParentId,
				manageType:inputParams.manageType,
				getParam : function(e){
					var param={treeViewMappingName:"mdProjectResource"};
					var orgId=_self['branchOrgId'];
					var searchQueryCondition=[" resource_kind_id <> 'room'"];
					if(!Public.isBlank(orgId)){
						searchQueryCondition.push(" and branch_org_id=:branchOrgId");
						param['branchOrgId']=orgId;
					}
					param['searchQueryCondition']=searchQueryCondition.join('');
					return param;
				},
				IsShowMenu:false,
				onClick : function(data){
					var html=[],id=data.id,fullName=data.mdFullName,resourceKindId=data.resourceKindId;
					//if(resourceKindId=='floor'){
						_self.folderId=id;
						UICtrl.gridSearch(_self.gridManager, {folderId:id});
					//}else{
						//
					//}
					if(fullName==''){
						html.push('资源列表');
					}else{
						html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>资源列表');
					}
					$('span.combo-dialog-center-span',doc).html(html.join(''));
				}
			};
		},
		onChoose:function(){
			if($.isFunction(inputParams.onChoose)){
				return inputParams.onChoose.call(this);
			}
	    	return true;
    	}
    });
};