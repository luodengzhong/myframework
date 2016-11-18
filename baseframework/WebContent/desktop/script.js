/*******************************************
title:      可拖动导航菜单
Author:      xiexin boomba1030@126.com
*******************************************/
var desk_icon=web_app.name+'/desktop/images/desktop.png';//分屏控制图标
var default_icon=web_app.name+'/desktop/images/grey.gif';//图片延迟加载默认显示图标
var default_fun_icon=web_app.name+'/desktop/images/default.png';//应用默认显示图标
$(document).ready(function(){
	/******屏幕滚动事件******/
	var rootEl=document.compatMode=='CSS1Compat'?document.documentElement:document.body;	//根元素
	var current=0,pageX1=-1,pageX2=-1;
	var positions = new Array();
	var slides=$('#slides'),menu=$('#menu');
	menu.find('ul li.menuItem:first').addClass('act').siblings().addClass('inact');
	//显示大小设置方法
	function setWidths(){
		var totWidth=0,bw=rootEl.clientWidth,bh=rootEl.clientHeight;
		$('div.slide',slides).each(function(i){
			positions[i]= totWidth;
			totWidth += bw;
			$(this).width(bw-20);
			$(this).height(bh-45);
		});
		//计算偏移量
		var pos=$('li.act',menu).prevAll('.menuItem').length;
		slides.width(totWidth).css({marginLeft:-positions[pos]+'px'});
	}
	setWidths();
	//页面大小改变后改变显示区域大小
	$(window).on('resize',setWidths);
	//window.setInterval(setWidths, 200);
	slides.bind('mousedown',function(e){
		if(e.button ==2){pageX1=-1;return false;}
		var $clicked = $(e.target || e.srcElement);
		//点击的是功能模块图标
		if($clicked.is('div.portlet')||$clicked.parents('div.portlet').length>0){
			e.preventDefault();
			return false;
		}
		pageX1=e.pageX;
		$(this).bind('mousemove',function(e){pageX2=e.pageX;});
		e.preventDefault();
	}).bind('mouseup',function(e){
		if(pageX1>0&&pageX2>0&&pageX1!=pageX2){
			//pageX>e.pageX 向右移动 pageX<e.pageX向左移动
			//current=pageX1>pageX2?current+1:current-1;
			if(pageX1>(pageX2+100)) current=current+1;
			if((pageX1+100)<pageX2) current=current-1;
			autoAdvance();
		}
		hide_op_state();
		pageX1=pageX2=-1;
		e.preventDefault();
	}).bind('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		//各个应用点击事件
		if($clicked.is('div.portlet')||$clicked.parents('div.portlet').length>0){
			var div=$clicked.is('div.portlet')?$clicked:$clicked.parents('div.portlet');
			var url=div.attr('link'),id=div.attr('id'),title=div.attr('title');
			url = web_app.name+ "/" +url;
            if (url.indexOf("?") >= 0){
            	url += "&FunctionID=" + id;
            }else{
                url += "?FunctionID=" + id;
            }
			try{parent.addTabItem({tabid:id,url:url,text:title});}catch(e){alert(e.message);}
			e.preventDefault();
			return false;
		}
	}).disableSelection();
	//menu屏幕切换菜单栏事件
	$('ul',menu).click(function(e){
		var $clicked = $(e.target || e.srcElement);
		$clicked=$clicked.is('img')?$clicked.parent():$clicked;
		if(!$clicked.is('a')) return;
		var li=$clicked.parent();
		$('li.menuItem').removeClass('act').addClass('inact');
		li.addClass('act');
		var pos = li.prevAll('.menuItem').length;
		$('div.slide:eq('+pos+')',slides).find('img.lazy').trigger("lazyLoad");
		slides.stop().animate({marginLeft:-positions[pos]+'px'},450);
		e.preventDefault();
	});
	//移动屏幕方法
	function autoAdvance(){
		var len=$('ul li a',menu).length;
		if(current < 0) current =len-1;
		if(current>len) current=1;
		$('ul li a',menu).eq(current%len).trigger('click');
	}
	/**********功能拖动事件**********/
	$("div.slide",slides).sortable({connectWith: "div.slide",
		stop:function(e,ui){
			if(!ui.item.parents('div.slide').length) return;
			updatet.addEvent(updateScreen.update,ui.item.parents('div.slide').attr('id'));
		},
		start: function( event, ui ) {
			if(!ui.item.parents('div.slide').length) return;
			init_op_state(ui.item);
		}
	});
	$('#doDelete').droppable({
		accept: "div.portlet",
		hoverClass: "op-state-delete-hover",
		drop: function( event, ui ) {
			var slide=ui.draggable.parents('div.slide');
			ui.draggable.remove();
			updatet.addEvent(updateScreen.update,slide.attr('id'));
		}
	});
	setTimeout(function(){
		$('#main_div').show();
		try{
			parent.selectTabItem('main_tab');
		}catch(e){}
	},0);
	/*********页面设置对话框初始化**************/
	manager_dialog_init();
	//设置应用图片延迟加载
	$("img.lazy",slides).lazyload({event: "lazyLoad",container:$("#gallery")});
	$('div.slide:first',slides).find('img.lazy').trigger("lazyLoad");
});
//初始化操作工具栏
function init_op_state(obj){
	$('#doDelete').appendTo(obj.parents('div.slide')).show();
}
function hide_op_state(obj){
	$('#doDelete').appendTo($('#main_div')).hide();
}
//页面设置对话框初始化
function manager_dialog_init(){
	$('#manager_show').click(function(e){
		show_manager_dialog();
		try{init_leftSystems();}catch(e){alert(e.message);}
		e.preventDefault();
	});
	$('#manager_hide').click(function(e){
		hide_manager_dialog();
		e.preventDefault();
	});
	//切换按钮
	$('#mybuttons').click(function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a')){
			var tg=$clicked.attr('href');
			if($(tg).is(':hidden')){
				$('a',this).each(function(){
					if($(this).attr('href')!=tg){
						$($(this).attr('href')).hide();
					}
					$(this).removeClass('selected');
				});
				$clicked.addClass('selected');
				$(tg).show();
			}
		}
		$('#op_message').text('');
		e.preventDefault();
	});
	//操作区域点击事件
	$('#mdcontent').click(function(e){
		$('#op_message').text('');
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.system')){//点击模块需要更新应用列表区域
			$('#leftSystems').find('a').removeClass('clicked');
			$clicked.addClass('clicked');
			init_rightFunctions($clicked.attr('id'));
		}else if($clicked.parents('div.mfun').length>0){//添加应用到屏幕
			add_function_screen($clicked.parents('div.mfun'));
		}else if($clicked.is('div.temp_screen')){//屏幕选择操作
			do_choose_screen($clicked);
		}else if($clicked.is('div.add_screen')){//添加分屏
			do_add_screen($clicked);
		}else if($clicked.is('span.deleteScreen')){//删除分屏
			do_delete_screen($clicked);
		}
		e.preventDefault();
	}).mousedown(function(e){
		 var $el = $(e.target || e.srcElement);
		 if($el.hasClass('scroll-up')){//点击向上箭头
			 scroll_leftSystems('up');
		 }else if($el.hasClass('scroll-down')){//点击向下箭头
			 scroll_leftSystems('down');
		 }
    }).mouseup(function(e){
    	scroll_leftSystems_stop();
    });
}
function show_manager_dialog(){
	init_mg_screen();
	var dialog=$('#manager_dialog'),w,h,de=document.documentElement;
	w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	h = self.innerHeight || (de&&de.clientHeight)|| document.body.clientHeight;
	var diagtop = h/2-300+eval($(document).scrollTop());
	if(diagtop<20) diagtop=20;
	var diagleft = w/2-350+eval($(document).scrollLeft());
	if(diagleft<10) diagleft=10;
	dialog.css({top : diagtop,left:diagleft,height:h-35});
	$('#mg_function').height(h-90);
	$('div.leftDiv',$('#mg_function')).height(h-90);
	$('#leftSystems').height(h-135);
	$('#rightFunctions').height(h-100);
	$('#mg_screen').height(h-90);
	$('#screenOverDiv').css({width:w+$(document).scrollLeft(),height:h+20+$(document).scrollTop()}).show();
	dialog.show();

}
var scroll_leftSystems_timer=null;
function scroll_leftSystems(type){//模块菜单滚动
	scroll_leftSystems_stop();
	var left=$('#leftSystems'),scrollTop=left.scrollTop();
	scrollTop=scrollTop+(type=='up'?-23:23);
	left.scrollTop(scrollTop);
	scroll_leftSystems_timer=setTimeout(function(){
		scroll_leftSystems(type);
	},100);
}
function scroll_leftSystems_stop(){
	if(scroll_leftSystems_timer!=null){
		clearTimeout(scroll_leftSystems_timer);
	}
	scroll_leftSystems_timer=null;
}
function init_leftSystems(){//初始化可用模块列表
	var left=$('#leftSystems'),sys=[];
	queryFunction(1,function(data){
		$.each(data,function(i,o){
			sys.push('<a href="#" hidefocus class="system" id="'+o.functionId+'">',o.title,'</a>');
		});
		left.html(sys.join(''));
		$('#mybuttons a:first').trigger('click');//默认显示应用设置
		$('#leftSystems a:first').trigger('click');
	});
}
function init_rightFunctions(id){//更新可用模块列表
	queryFunction(id,function(data){
		var right=$('#rightFunctions'),html=['<div class="mainFunctions">'];
		right.find('div.mainFunctions').removeAllNode();
		var pos=$('#menu li.act').prevAll('.menuItem').length;
		var screen=$('#slides .slide').eq(pos);
		$.each(data,function(i,o){
			if(screen.find('div[id="'+o.functionId+'"]').length>0) return;//过滤已存在的应用
			var icon=o.icon?web_app.name+o.icon:default_fun_icon;
			html.push('<div class="mfun" title="'+o.title+'" id="'+o.functionId+'" link="'+o.location+'" icon="'+icon+'">');
			html.push('<div class="mfun-header"><img class="lazy" src="'+default_icon+'"  data-original="'+icon+'" width="43" height="43"/></div>');
			html.push('<div class="mfun-content">',o.title,'</div>');
			html.push('</div>');
		});
		html.push('</div>');
		right.html(html.join(''));
		right.find("img.lazy").lazyload({container:right});
	});
}
function add_function_screen(obj){//添加应用到屏幕
	var id=obj.attr('id'),title=obj.attr('title'),link=obj.attr('link'),icon=obj.attr('icon');
	var pos=$('#menu li.act').prevAll('.menuItem').length;
	var screen=$('#slides .slide').eq(pos);
	if(screen.find('div.portlet').length>=32){
		if(!confirm("当前桌面应用将超过32个，继续添加将可能会引起新增应用无法显示和使用，确定要继续吗？？")){
			return false;
		}
	}
	if(screen.find('div[id="'+id+'"]').length>0) return;//过滤已存在的应用
	var html=['<div class="portlet" id="'+id+'" title="'+title+'" link="'+link+'">'];
	html.push('<div class="portlet-header">');
	html.push('<img src="'+icon+'" width="64" height="64"/></div>');
	html.push('<div class="portlet-content">',title,'</div>');
	html.push('</div>');
	screen.append($(html.join('')));
	obj.remove();
	$('#op_message').text('应用已添加到桌面!');
	updatet.addEvent(updateScreen.update,screen.attr('id'));
}
function init_mg_screen(){//初始化分屏设置
	var length=$('#slides div.slide').length,html=[],mg_screen=$('#mg_screen');
    mg_screen.find('div.temp_screen').remove();
	for(var i=0;i<length;i++){
		html.push("<div class='temp_screen' index='"+i+"'>");
		html.push("<span class='deleteScreen' title='删除该屏'>&nbsp;</span>");
		html.push((i+1),"</div>");
	}
	mg_screen.prepend(html.join(''));
}
function do_add_screen(obj){//添加分屏操作
	var slides=$('#slides'),length=slides.find('div.slide').length;
	if(length>9){
		Public.tip('最多只能创建10屏!');
		return false;
	}
	var html=["<div class='temp_screen' index='"+length+"'>"];
	html.push("<span class='deleteScreen' title='删除该屏'>&nbsp;</span>");
	html.push((length+1),"</div>");
	obj.before(html.join(''));
	var screen=$('<div class="slide"></div>').hide().appendTo(slides);
	$('#menu ul').append('<li class="menuItem"><a href="#" hidefocus><img src="'+desk_icon+'"/></a></li>');
	$(window).triggerHandler('resize');
	setTimeout(function(){try{screen.show();$('#menu ul li a').eq(length).trigger('click');}catch(e){}},600);
	$('#op_message').text('屏幕添加成功!');
	updatet.addEvent(updateScreen.add,screen);
}
function do_delete_screen(obj){//删除分屏
	var index=obj.parent().attr('index');
	if($('#slides div.slide').length==1){
		Public.tip('只有一个桌面,不能删除!');
		return false;
	}
	if(!confirm("删除桌面，将删除桌面全部应用模块，确定要删除吗？")){
		return false;
	}
	var screen=$('#slides div.slide:eq('+index+')'),id=screen.attr('id');
	screen.remove();
	$('#menu ul li.menuItem:eq('+index+')').remove();
	init_mg_screen();
	$(window).triggerHandler('resize');
	if($('#menu ul li a').length>0)
		$('#menu ul li a:eq(0)').trigger('click');
	$('#op_message').text('屏幕删除成功!');
	updatet.addEvent(updateScreen.del,id);
}
function do_choose_screen(obj){//选择屏幕
  var index=obj.attr('index');
  $('#menu ul li a').eq(index).trigger('click');
}
function hide_manager_dialog(){//关闭层
	$('#mg_function').hide();
	$('#mg_screen').hide();
	$('#screenOverDiv').hide();
	$('#manager_dialog').hide();
}
function queryFunction(parentId,fn){
	Public.ajax(web_app.name + "/workTableAction!queryFunction.ajax",{ parentId: parentId },fn);
}
/***********以下函数用于将页面修改保存到数据库**************/
var updatet=new updateScreen();
function updateScreen(){
	this.events=new Array();
	this.timer=null;
	this.event=null;
	this.sleep=1500;
}
$.extend(updateScreen,{
	update:'_update',
	add:'_add',
	del:'_del'
});
$.extend(updateScreen.prototype,{
	addEvent:function(event,para){
		var obj=null;
		if(this.event&&this.event.event==event&&this.event.para==para) return;
		for(var i=0;i<this.events.length;i++){
			obj=this.events[i];
			if(obj.event==event&&obj.para==para){
				return;
			}
		}
		this.events.push({event:event,para:para});
		this.run();
	},
	run:function(){
		if(this.timer) return; 
		this.event=this.events.shift();
		if(!this.event) return;
		var _serf=this,_event=this.event;
		this.timer=window.setTimeout(function(){
			try{_serf[_event.event].call(_serf,_event.para);}catch(e){_serf.event=null;}
		},this.sleep);
	},
	clearTimeout:function(){
		window.clearTimeout(this.timer);
		this.timer=null;
	},
	_ajax:function(url,param,callBack){
		var _serf=this;this.event=null;this.timer=null;
		$.ajax({type:'POST',url:url,data:param,dataType:'json',
			error:function(){
				alert('网路连接异常,请检查URL连接！');
				_serf.run();
			},
			success: function(data){
				if(data.error){
					Public.tip(data.error);
				}else{
					if(typeof callBack=='function')
						callBack.call(window,data);
				}
				_serf.run();
			}
		}); 
	},
	_update:function(para){
		var fids=[],screen=$('#'+para);
		$.each(screen.find('div.portlet'),function(){fids.push($(this).attr('id'));});
		var param={id:para,functionids:fids.join(',')};
		this._ajax(web_app.name+'/workTableAction!update.ajax',param);
	},
	_add:function(para){
		this._ajax(web_app.name+'/workTableAction!add.ajax','',function(data){
			para.attr('id',data.id);
		});
	},
	_del:function(para){
		this._ajax(web_app.name+'/workTableAction!del.ajax',{id:para});
	}
});
