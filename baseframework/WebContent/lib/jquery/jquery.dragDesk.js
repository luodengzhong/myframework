/*---------------------------------------------------------------------------*\
|  title:         桌面拖动插件                                                |
|  Author:        xiexin                                                      |
|  Created:       2009-10-28                                                  |
|  LastModified:  2009-10-29                                                  |
|  需求:<link rel="stylesheet" type="text/css" href="jquery.dragDesk.css">    |
|       <script src="jquery.js" type="text/javascript"></script>              |
|       <script src="ui.mouse.js" type="text/javascript"></script>            |
|       <script src="ui.draggable.js" type="text/javascript"></script>        |
|       <script src="jquery.cookie.js" type="text/javascript"></script>       |
|  使用如:(按示例布局)                                                        |
|   $.dragDesk();                                                             |
\*---------------------------------------------------------------------------*/
(function($) {
   $.dragDeskDefaults={
		imagesDir:web_app.name+'/themes/default/ui/',//图片资源路径
		Intopacity:'0.2',
		scrollwidth:100//增加OR减少默认高度
   };
   $.dragDesk=function(){
     var div=$('.dragDesk-dragDiv');
	 if (!div.parent().length) {//创建新的DIV
	    div=$(document.createElement('div')).addClass('dragDesk-dragDiv');
		div.appendTo('body');
	 }
	 var filter={};//新的DIV中样式
	 var maskDiv='<div id="dragDeskmaskDiv" class="dragDesk-markDiv"></div>';//遮闭层
	 var configDiv="<div id='dragDeskconfig' class='dragDesk-div'>" +//对话框层
	"<div class='dragDesk-title'>" + 
	"<span class='title'></span></div>" + 
	"<div class='dragDesk-content'></div>" + 
	"<div class='dragDesk-Footer'>" + 
	"<input class='dragDesk-Button' type='button' name='ok' value='确定'/>&nbsp;&nbsp;" + 
	"<input class='dragDesk-Button' type='button' name='close' value='关闭'/>" + 
	"</div></div>";
	configDiv=$(configDiv).css({position:"absolute",display:"none",width:'300px',height:'auto',zIndex:80});
	try{configDiv.draggable({ handle: '.dragDesk-title' });}catch(e){};//设置对话框可拖动
	$("body").append(maskDiv).append(configDiv);
	var css={zIndex:70};//遮闭层样式
	if($.browser.msie){//设置过滤器
		css.filter= 'progid:DXImageTransform.Microsoft.Alpha(opacity='+($.dragDeskDefaults.Intopacity*100)+')';
		filter.filter='progid:DXImageTransform.Microsoft.Alpha(opacity=70)';
	}else{
		css.opacity=$.dragDeskDefaults.Intopacity;
		filter.opacity='0.7';
	}
	$("#dragDeskmaskDiv").css(css);
	var showConfigDiv=function(name,fn){//打开配置兑换框
	  $('.title',configDiv).html(name);
	  var w,h,de;
	  de = document.documentElement;
	  w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	  h = self.innerHeight || (de&&de.clientHeight)|| document.body.clientHeight;
	  var st=$(document).scrollTop(),sl=$(document).scrollLeft();
	  var diagtop = h/2-100+st;
	  var diagleft = w/2-100+sl;	
	  configDiv.css({"top" : diagtop,"left":diagleft});
	  if(fn)fn();//调用输入方法
	  var docHeight = Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight);
	  var docWidth = Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth);
	  $('#dragDeskmaskDiv').css({width:docWidth,height:docHeight}).show();
	  configDiv.show();
	};
	var hideConfigDiv=function(){
	   configDiv.hide();
	   $('#dragDeskmaskDiv').hide();
	};
	$('input[name="close"]',configDiv).bind('click',hideConfigDiv);//为配置兑换框设置关闭方法
	var optionMethod={};
	$.extend(optionMethod,{
	     expand:function(obj,op){//内容是否隐藏
		    var flag="false";
			op=op||'toggle';
		    if($('.dragDesk-content',this)[op]().is(':hidden')){
			    $('img',obj).attr('src',$.dragDeskDefaults.imagesDir+'collapse.gif');
				flag="hide";
			}else{
			    $('img',obj).attr('src',$.dragDeskDefaults.imagesDir+'expand.gif');
				flag="show";
			}
			$.cookie($(this).attr('id')+'_expand',flag);
		 },
         add:function(){//增加高度
		    var obj=$('.dragDesk-content',this);
		    var height=obj.height();
			height=height+parseInt($.dragDeskDefaults.scrollwidth,10);
			obj.height(height);
			optionMethod['marqueeClone'](obj);
			$.cookie($(this).attr('id')+'_height',height);
		 },
         sub:function(){//减少高度
		    var obj=$('.dragDesk-content',this);
		    var height=obj.height();
			height=height-parseInt($.dragDeskDefaults.scrollwidth,10);
			obj.height(height);
			optionMethod['marqueeClone'](obj);
			$.cookie($(this).attr('id')+'_height',height);
		 },
		 all:function(){//高度自动
		    var obj=$('.dragDesk-content',this);
			obj.height('auto');
			optionMethod['marqueeClone'](obj);
			$.cookie($(this).attr('id')+'_height','auto');
		 },
         close:function(){//关闭窗口
		    this.hide();
			$.cookie($(this).attr('id')+'_hide','hide');
		 },
		 toggle:function(op){
		    this[op]();
            $.cookie($(this).attr('id')+'_hide',op);
		 },
		 layout:function(){//保存模块位置到cookie中去
		    $('#parentTable td.dragDesk-frameTd').each(function(i,o){
			    $('.dragDesk-div',this).each(function(j,t){
                    $.cookie($(this).attr('id')+'_layout',i+','+j);//保存模块坐标 
				});
			});
		 },
         marqueeClone:function(obj){//为模块中数据滚动准备
		    var clone=$('.marquee-clone',obj);
			if(clone.length>0){
				if(obj.height()>=clone.height()){
					 clone.hide();
				}else{
					 clone.show();
				}
			}
		 }
	 });
	 var initByCookie=function(obj){//根据保存的COOKIE恢复模块状态
	     /**读取cookie中数据进行初始化**/
		 var id=$(obj).attr('id');
		 var expand=$.cookie(id+'_expand');//内容是否隐藏
		 var height=$.cookie(id+'_height');//内容显示高度
		 var hide=$.cookie(id+'_hide');//窗口是否隐藏
		 var layout=$.cookie(id+'_layout');//页面布局位置
		 if(expand){try{optionMethod['expand'].apply(obj,[$('a[id="expand"]',obj),expand]);}catch(e){};}
		 if(height){try{$('.dragDesk-content',obj).height(height);}catch(e){};}
		 if(hide){try{$(obj)[hide]();}catch(e){};}
		 if(layout){
			 var ls=layout.split(',');
			 $(obj).attr('col',ls[0]).attr('row',ls[1]);//将布局写入对象
		 }
		 id=null,expand=null,height=null,hide=null,layout=null;
	};
	 var dragDeskDivs=$('table .dragDesk-div');
	 var draging=null;
     dragDeskDivs.each(function(){//初始化窗口
	     var temp=$(this);
	     $('.dragDesk-title',this).each(function(){//给title添加事件及操作菜单
		     var option=$('.option',this);
			 if(option.length==0){
				 var html=['<span class="option">'];
				 html.push('<a href="javascript:void(0)" id="expand" title="折叠"><img src="',$.dragDeskDefaults.imagesDir,'expand.gif" border="0"/></a>');
				 html.push('<a href="javascript:void(0)" id="sub" title="减少高度"><b>▲</b></a>');
				 html.push('<a href="javascript:void(0)" id="add" title="增加高度"><b>▼</b></a>');
				 html.push('<a href="javascript:void(0)" id="all">全部</a>');
				 if($(this).attr('more')=='true'){
					 html.push('<a href="javascript:void(0)" id="more">更多</a>');
				 }
				 if($(this).attr('refresh')=='true'){
					 html.push('<a href="javascript:void(0)" id="refresh">刷新</a>');
				 }
				 //暂时屏蔽关闭功能
				 html.push('<a href="javascript:void(0)" id="close" title="关闭模块"><img src="',$.dragDeskDefaults.imagesDir,'close_x.png" border="0"/></a>');
				 html.push('</span>');
			     option=$(html.join(''));
		         $(this).append(option); 
				 $('a',option).mousedown(function(event){// 操作菜单事件响应
					 var op=$(this).attr('id');
					 if(optionMethod[op]){
						 optionMethod[op].apply(temp,[this]);
					 }
					 event.preventDefault();
					 event.stopPropagation();
					 return false;
				 });
			 }
		     $(this).bind('mousedown',function(event){//托动开始
				 if(draging) return false;
				 div.empty();
				 option.hide();
				 var parent=$(this).parents('.dragDesk-div');
				 if(parent.is('.dragDesk-draging')) return false;
				 parent.clone().prependTo(div).find('.dragDesk-content').css('overflow','hidden'); 
				 var of=parent.offset();
				 parent.addClass('dragDesk-draging');
				 draging ={//设置拖动状态
					obj:parent,
					startX:event.x||event.pageX,
					startY:event.y||event.pageY,
					containX:of.left,
					containY:of.top
				 };
				 div.css({width:parent.width(),height:parent.height(),top:of.top,left:of.left}).css(filter);
				 initFunc();//设置事件监听
				 div.show();
				 return false;
			 }).hover(function(){option.show();},function(){option.hide();});
		 });
		 try{initByCookie(this);}catch(e){}//根据保存的COOKIE恢复模块状态
	 });
	 (function(table){//根据保存的COOKIE恢复模块位置 
	    $('td.dragDesk-frameTd',table).each(function(i,o){
		     var col=$(this);
			 var rows=$('.dragDesk-div[col="'+i+'"]');
			 if(rows.length>0){
				 var childs=$.makeArray(rows).sort(function(a,b){//排序方法
					var ac=$(a).attr('row'),bc=$(b).attr('row');
					if(ac>=bc){return 1;}else{return -1;}
				 });//将模块排序返回排序后结果
				 $.each(childs,function(i,o){col.append(o);});
			 }
		});
	 })($('#parentTable'));
	var initFunc = function() { //添加鼠标事件
		$(document).bind('mouseup',onmouseup);
		$(document).bind('mousemove',onmousemove);	
		if($.browser.msie){
			$('body').bind('selectstart',noSelectStart);
			$('body').bind('select',noSelect);
		}
	};
	var noSelectStart=function(){
		return false;
	};
	var noSelect=function(){
		document.selection.empty();
	};
	function onmouseup(){//关闭鼠标事件
	    if(draging){
		   $(document).unbind('mouseup', onmouseup);
		   $(document).unbind('mousemove',onmousemove);
           if($.browser.msie){
				$('body').unbind('selectstart',noSelectStart);
			    $('body').unbind('select',noSelect);
		   }
		   var position=draging.obj.position();
		   optionMethod.layout();//保存模块位置到cookie中去
		   div.animate({//自定义动画
              opacity: 'hide',
              top: position.top,
              left: position.left
            },
            'normal',function(){//恢复拖动状态
              draging.obj.removeClass('dragDesk-draging');
			  $.each(draging,function(i,o){delete draging[i];});
		      draging=null;
			  div.hide();
			});
		}
	 };
	 function onmousemove(event){
	    if(draging){
		    var x=event.x||event.pageX;
			var y=event.y||event.pageY;
		    div.css({top:draging.containY+y-draging.startY,left:draging.containX+x-draging.startX});
			$('#parentTable td.dragDesk-frameTd').each(function(){//判断鼠标的位置
			   var p=position($(this));
			   if(x>=p.left&&x<=p.right&&y>=p.top&&y<=p.bottom){
			       var drags=$('.dragDesk-div',this).not('.dragDesk-draging');
				   $(this).append(draging.obj);
				   drags.each(function(){
					   var cp=position($(this));
					   if(x>=cp.left&&x<=cp.right&&y>=cp.top&&y<=cp.bottom){
						   draging.obj.insertBefore($(this));
						   return false;
					   }
				   });
			       return false;
			   }
			});
		}
	 };
	 var position=function(obj){//取得对象位置
	    var p=new Object();
		var o=obj.offset();
		p=$.extend({
		  right:o.left+obj.outerWidth(),
		  bottom:o.top+obj.outerHeight()
		},o);
		return p;
	 };
	 //初始还配置按钮
	 $('.dragDeskconfig span.configButton').each(function(){
	     $(this).hover(function(){
		    $(this).addClass('configButtonOver');
		 },function(){
		    $(this).removeClass('configButtonOver');
		 });
		 if($(this).is('[id="expand_arrow"]')){//展开/折叠 操作
		    $(this).click(function(){
			    var expand=$(this).attr('expand');
				expand=expand||"show";
				if(expand=="show"){
				   expand="hide";
				}else{
				   expand="show";
				}
				$(this).attr('expand',expand);
				$('img',this).attr('src',$.dragDeskDefaults.imagesDir+'expand_'+expand+'.png');
                $.cookie('expand_arrow',expand);
			    dragDeskDivs.each(function(){//调用模块对应处理方法
				   optionMethod['expand'].apply(this,[$('a[id="expand"]',this),expand]);
				});
			});
            var cexpand =$.cookie('expand_arrow');
			if(cexpand){
			   $(this).attr('expand',cexpand);
			   $('img',this).attr('src',$.dragDeskDefaults.imagesDir+'expand_'+cexpand+'.png');
			}
		 }else{//配置模块显示按钮
		    $(this).click(function(){
			    showConfigDiv('模块选项',function(){
				   var content=$('.dragDesk-content',configDiv);
				   var html='';
				   dragDeskDivs.each(function(i,o){//添加模块信息
				     var checked="checked";
					 if($(this).is(':hidden')){
					    checked="";
					 }//组合模块信息
				     html+='<li>'+(i+1)+'.<input type="checkbox" name="'+$(this).attr('id')+'" '+checked+'>&nbsp;'+$('.title',this).text()+'</li>';
				   });
				   content.html(html);
                   $('input[name="ok"]',configDiv).unbind('click').bind('click',function(){
				       $('input[type="checkbox"]',configDiv).each(function(){
					      var id=$(this).attr('name');
					      if($(this).is(':checked')){//调用模块对应处理方法
						     optionMethod['toggle'].apply($('#'+id),['show']);
						  }else{
						     optionMethod['toggle'].apply($('#'+id),['hide']);
						  }
					   });
                       hideConfigDiv();
				   });
				});
			});
		 }
	 });
   };
})(jQuery);