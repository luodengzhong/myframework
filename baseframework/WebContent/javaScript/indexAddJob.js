/*首页新建事项按钮*/
var AddJob =function(){};
AddJob.scrollLeftSystemsTimer=null;
AddJob.default_icon=web_app.name+'/desktop/images/grey.gif';//图片延迟加载默认显示图标
AddJob.default_fun_icon=web_app.name+'/desktop/images/default.png';//应用默认显示图标
//显示屏蔽层
AddJob.showScreenOver=function(){
	var screenOver=$('#add-job-screen-over');
	if(!screenOver.length){
		screenOver=$('<div id="add-job-screen-over" style="position:absolute;top:0px;left:0px;width:0;height:0;z-index:10000;display:none;"></div>').appendTo('body');
	}
	setTimeout(function(){
		screenOver.css({
			width:'100%',
			height:'100%',
			background:'#001',
			filter:'alpha(opacity=10)',
			opacity:0.1
		}).show();
	},0);
};
//打开选择呢对话框
AddJob.showDialog=function(){
	var dialog=$('#add_job_dialog');
	if(dialog.length==0){
		var html=["<div id='add_job_dialog' class='manager_dialog'>"];
		html.push("  <div class='md-title'>"); 
		html.push("    <span class='title'>新建事项</span>"); 
		html.push("    <span class='close'><a href='#' title='关闭' hidefocus id='manager_hide'>&nbsp;</a></span>"); 
		html.push("  </div>"); 
		html.push("  <div id='mdcontent' class='md-content'>"); 
		html.push("    <div id='mg_function' class='mg-function'>"); 
		html.push("      <div class='left-div'>"); 
		html.push("        <a href='#' hidefocus class='scroll-up'>&nbsp;</a>"); 
		html.push("        <div id='left_systems' class='left-systems'></div>"); 
		html.push("        <a href='#' hidefocus class='scroll-down'>&nbsp;</a>"); 
		html.push("      </div>"); 
		html.push("      <div id='right_functions' class='right-functions'></div>"); 
		html.push("    </div>"); 
		html.push("  </div>"); 
		html.push("</div>"); 
		dialog=$(html.join('')).appendTo('body');
		dialog.drag({ handle: '.md-title',opacity: 0.8,start:function(){
			dialog.addClass('ui_state_drag');
		},stop:function(){
			dialog.removeClass('ui_state_drag');
		}});
		AddJob.bindEvent();
		AddJob.initLeftSystems();
	}
	//计算显示位置
	var w,h,de=document.documentElement,leftWidth;
	w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	h = self.innerHeight || (de&&de.clientHeight)|| document.body.clientHeight;
	var diagtop = h/2-(h*0.8)/2+eval($(document).scrollTop());
	if(diagtop<40) diagtop=40;
	var diagleft = w/2-(w*0.8)/2+eval($(document).scrollLeft());
	if(diagleft<10) diagleft=10;
	h=h*0.8;
	w=w*0.8;
	leftWidth=w*0.2;
	dialog.css({top : diagtop,left:diagleft,height:h,width:w+2});
	$('#mg_function').height(h-25).width(w);
	$('div.left_div',dialog).height(h-25).width(leftWidth);
	$('a.scroll-up,a.scroll-down',dialog).width(leftWidth-5);
	$('#left_systems').height(h-70).width(leftWidth-2);
	$('#right_functions').height(h-35).width(w-leftWidth-6);
	AddJob.showScreenOver();
	dialog.show();
};
//关闭对话框
AddJob.hideDialog=function(){
	$('#add_job_dialog').hide();
	$('#add-job-screen-over').hide();
};
//绑定事件
AddJob.bindEvent=function(){
	$('#manager_hide').on('mousedown',function(e){
		AddJob.hideDialog();
		e.preventDefault();
	});
	$('#add_job_dialog').click(function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.system')){//点击模块需要更新应用列表区域
			$('#left_systems').find('a').removeClass('clicked');
			$clicked.addClass('clicked');
			AddJob.initRightFunctions($clicked.attr('id'));
		}else if($clicked.parents('div.mfun').length>0){//选择功能跳转到页面
			var parent=$clicked.parents('div.mfun');
			var link=parent.attr('link'),id=parent.attr('id'),functionName=parent.attr('functionName');
			 var url = web_app.name+ "/" +link;
             if (url.indexOf("?") >= 0){
             	url += "&functionId=" +id;
             }else{
                url += "?functionId=" + id;
            }
			addTabItem({ tabid:id, text:functionName, url: url});
			AddJob.hideDialog();
		}
		e.preventDefault();
	}).mousedown(function(e){
		 var $el = $(e.target || e.srcElement);
		 if($el.hasClass('scroll-up')){//点击向上箭头
			 AddJob.scrollLeftSystems('up');
		 }else if($el.hasClass('scroll-down')){//点击向下箭头
			 AddJob.scrollLeftSystems('down');
		 }
    }).mouseup(function(e){
    	AddJob.scrollLeftSystemsStop();
    });
};
//模块菜单滚动
AddJob.scrollLeftSystems=function(type){
	AddJob.scrollLeftSystemsStop();
	var left=$('#left_systems'),scrollTop=left.scrollTop();
	scrollTop=scrollTop+(type=='up'?-23:23);
	left.scrollTop(scrollTop);
	AddJob.scrollLeftSystemsTimer=setTimeout(function(){
		AddJob.scrollLeftSystems(type);
	},100);
};
AddJob.scrollLeftSystemsStop=function(){
	if(AddJob.scrollLeftSystemsTimer!=null){
		clearTimeout(AddJob.scrollLeftSystemsTimer);
	}
	AddJob.scrollLeftSystemsTimer=null;
};
//初始化可用模块列表
AddJob.initLeftSystems=function(){
	var left=$('#left_systems'),sys=[];
	AddJob.queryFunction(1,function(data){
		$.each(data,function(i,o){
			var icon=o.icon?web_app.name+o.icon:AddJob.default_fun_icon;
			var img='<img  src="'+icon+'" width="32" height="32"/>'
			sys.push('<a href="#" hidefocus class="system" id="'+o.functionId+'">');
			sys.push(img,'&nbsp;',o.title,'</a>');
		});
		left.html(sys.join(''));
		left.find('a:first').trigger('click');
	});
};
//查询可用的功能菜单
AddJob.queryFunction=function(parentId,fn){
	Public.ajax(web_app.name + "/workTableAction!queryJobFunction.ajax",{ parentId: parentId},fn);
};
//更新可用模块列表
AddJob.initRightFunctions=function(id){
	AddJob.queryFunction(id,function(data){
		var right=$('#right_functions'),html=['<div class="mainFunctions">'];
		right.find('div.mainFunctions').removeAllNode();
		$.each(data,function(i,o){
			var icon=o.icon?web_app.name+o.icon:AddJob.default_fun_icon;
			html.push('<div class="mfun" title="'+o.fullName+'" functionName="'+o.title+'" id="'+o.functionId+'" link="'+o.location+'" icon="'+icon+'">');
			html.push('<div class="mfun-header"><img class="lazy" src="'+AddJob.default_icon+'"  data-original="'+icon+'" width="64" height="64"/></div>');
			html.push('<div class="mfun-content">',o.title,'</div>');
			html.push('</div>');
		});
		html.push('</div>');
		right.html(html.join(''));
		right.find("img.lazy").lazyload({container:right});
	});
};
