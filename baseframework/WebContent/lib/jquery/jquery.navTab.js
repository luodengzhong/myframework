/********************************
title:      窗口控件
Author:      xiexin
$("#frame_center").navTab();
$("#frame_center").navTab('append','main_tab',web_app.name+'/Main.jsp','工作台','',false);
*********************************/
(function($) {

	$.fn.navTab = function (op){
		var obj=this.data('ui_navigation_tab');
		if(!obj){
			new navTab(this);
		}else{
			if (typeof op == "string") {
				var value,args = arguments;
				$.each(['append','remove','removeAll','current','setHeight'],function(i,m){
					if(op==m){
						args = Array.prototype.slice.call(args, 1);
						value=obj[m].apply(obj,args);
						return false;
					}
				});
				return value;
			}
		}
		return this;
    };

	function navTab(el){
		this.winlist = new Array();	//窗口列表
		this.maxWins = 20;			//最大窗口数
		this.currentwin = null;		//当前窗口对象
		this.padding_left_width=0;
		this.timer=null;
		this.choosewin=null;
		var $el=$(el).addClass('ui-nav-tab');
		this.tab_links=$el.find('div.ui-tab-links');
		if(!this.tab_links.length){
			this.tab_links=$('<div class="ui-tab-links"><ul></ul></div>').appendTo($el);
		}
		this.tab_links_ul=this.tab_links.find('ul');
		if(!this.tab_links_ul.length){
			this.tab_links_ul=$('<ul/>').appendTo(this.tab_links);
		}
		this.tab_content=$el.find('div.ui-tab-content');
		if(!this.tab_content.length){
			this.tab_content=$('<div class="ui-tab-content"/>').appendTo($el);
		}
		this.init();
		$el.data('ui_navigation_tab',this);
	}
	$.extend(navTab.prototype,{
		 init:function(){
			 var _self=this;
			 /*定义tabs切换事件*/
			 this.tab_links_ul.click(function(e){
				 var $clicked = $(e.target || e.srcElement);
				 if($clicked.is('a.close-win')){
					var id=$clicked.parent().attr('id');
					if(!id) return false;
					var tmp=_self.getById(id);
					if(tmp){
						_self.remove(tmp);
					}
					return false;
				 }
				 $clicked=$clicked.is('li')?$clicked:$clicked.parent();
				 if($clicked.is('li')){
					 var id=$clicked.attr('id');
					 if(!id) return false;
					 var tmp=_self.getById(id);
					 if(_self.currentwin!=null&&_self.currentwin['id']==tmp['id']){
						 return false;
					 }
					 _self.active(tmp);
					 return false;
				 }
			 });
			 /*工具栏绑定事件*/
			 this.tab_links.mousedown(function(e){
				 var $clicked = $(e.target || e.srcElement);
				 if($clicked.hasClass('scroll-left')){//左移
					 _self.titleMoveLeft();
				 }else if($clicked.hasClass('scroll-right')){//右移
					 _self.titleMoveRight();
				 }
			 }).mouseup(function(e){
				 _self.titleScrollStop();
			 });
			 try{
				 this.tab_links_ul.contextMenu({
						items:[
							{name:"关闭当前页",classes:'temp',handler:function(){
								_self.remove();
							}},
							{name:"关闭其他",handler:function(){
								_self.removeOther(_self.getById(_self.choosewin));
							}},
							{name:"关闭所有",handler:function(){
								_self.removeAll();
							}},
							{classes:'separator'},
							{name:"刷新",handler:function(){
								_self.reload(_self.getById(_self.choosewin));
							}}
						],
						onOpenMenu:function(m,e){
							var $em = $(e.target || e.srcElement);
							$em=$em.is('li')?$em:$em.parent();
							if(!$em.is('li')){
								this._hideMenu();
							}
							m.find('li.temp').removeClass('disabled');
							if(!$em.find('a.close-win').length){
								m.find('li.temp').addClass('disabled');
							}
							_self.choosewin=$em;
						}
					});
			  }catch(e){}
			  /*初始化窗口列表*/
			  this.tab_links_ul.find('li').each(function(i,o){
				 var id=$(o).attr('id');
				 if(!id) return false;
				 id=id.replace(/title_/g,'');
				 _self.winlist.push({id:id,index:_self.winlist.length+1,canDel:false});
			 });
			 if(this.winlist.length>0){//默认显示第一个
				this.active(this.winlist[0]);
			 }
			 /*动态更新容器高度及宽度*/
			 var _resize=function(){
				 _self.setScrollTool();
				 if(_self.currentwin!=null){
					_self.active(_self.currentwin);
				 }
			 };
			 $(window).on('resize', function(){
				_resize();
			 });
			 _resize();
		 },
		 getById:function(id){
			 id=typeof id=='string'?id:id.attr('id');
			 var tmp=null;
			 id=id.replace(/title_/g,'');
			 $.each(this.winlist,function(i,o){
				 if(o['id']==id){
					 tmp=o;
					 return false;
				 }
			 });
			 return tmp;
		 },
		 container:function(id){//根据ID判断窗口是否存在
			for(var i=0;i<this.winlist.length;i++){
				if(this.winlist[i].id == id){
					return i;
				}
			}
			return -1;
		 },
		 setHeight:function(height){
			 this.tab_content.height(height-this.tab_links.outerHeight());
		 },
		 showScrollTool:function(){
			 var html=['<div class="scroll-left"></div>','<div class="scroll-right"></div>'];
			 this.tab_links.append(html.join(''));
			 this.padding_left_width=this.tab_links.find('div.scroll-left').outerWidth();
		 },
		 hideScrollTool:function(){
			 this.tab_links.find('div.scroll-left,div.scroll-right').remove();
			 this.padding_left_width=0;
		 },
	     getSumWidth:function(){
			var sumWidth = 0;
            $("li",this.tab_links_ul).each(function () {
                sumWidth += $(this).width() + 2;
            });
			return sumWidth;
		 },
		 active:function(oEl){//激活窗口
			if(oEl == null){
				this.currentwin = null;
				return;
			}
			var oEl_title=$('#title_'+oEl.id),oEl_win=$('#window_'+oEl.id);
			if(this.currentwin!=null){
				var cur_title=$('#title_'+this.currentwin.id),cur_win=$('#window_'+this.currentwin.id);
				cur_title.removeClass('current');
				cur_win.hide();
			}
			oEl_title.addClass('current');
			oEl_win.show();
			this.currentwin = oEl;
			//调整显示位置
            var mainWidth = this.tab_links.width();
			var position=oEl_title.position(),width=oEl_title.width();
			var currentLeft = parseInt(this.tab_links_ul.css("left"));
			/*标签前后都在显示区域内*/
			var tempW = position.left + currentLeft - this.padding_left_width;
			if(tempW >= 0 && tempW <= mainWidth){
				tempW = tempW + width;
				if(tempW >= 0 && tempW <= mainWidth){
					return;
				}
			}
			if(position.left + width > mainWidth){
				tempW = position.left + width - mainWidth+ this.padding_left_width + 2;
				this.tab_links_ul.css({ left: -1 * tempW});
			}else{
				tempW = currentLeft + width+this.padding_left_width + 2;
				if(tempW >= this.padding_left_width + 2){
					tempW = this.padding_left_width + 2;
				}
				this.tab_links_ul.css({ left: tempW});
			}
		 },
		 //添加窗口
		 append:function(id,url,title,icon,canDel){
			if(!id) return; 
			var con = this.container(id);
			if(con>-1){
				this.active(this.winlist[con]);
				return;
			}
			if(this.maxWins>0&&this.winlist.length >= this.maxWins){
				alert("超过最大窗口数限制("+this.maxWins+"),请先关闭部分窗口.");
				return false;
			}
			canDel=canDel===false?false:true;
			icon=icon||'';
			var oEl={id:id,url:url,title:title,index:(this.winlist.length+1),icon:icon,canDel:canDel};
			this.winlist.push(oEl);  
			var _html=['<li id="title_'+id+'"><div class="left"></div><div class="right"></div>'];//创建title
			if(canDel===true){
				_html.push('<a href="##" class="close-win" hidefocus></a>');
		    }
			_html.push('<a href="##"  hidefocus>');
			if(icon&&icon!=''){
				_html.push(' <img src="'+web_app.name+icon+'" width="16" height="16" align="absMiddle" />');
			}
			_html.push(title,'</a>','</li>');
			oEl_title=$(_html.join(''));
			oEl_title.attr('title',title);
			var oEl_win=$('<div class="layout" id="window_'+id+'"><div class="ui-tab-loading" style="display:block;"></div><iframe scrolling="auto" style="width:100%;height:100%;" frameborder="0"></iframe></div>');
			var loading = $("div:first", oEl_win);
			var iframe = $("iframe:first", oEl_win);
			if (url){
                iframe.attr("name", "frame_"+id).attr("id", "frame_"+id).attr("src", url).bind('load.tab',function(){loading.hide();});
            }
			if(this.currentwin != null) {
				var cur_title=$('#title_'+this.currentwin.id),cur_win=$('#window_'+this.currentwin.id);
				cur_title.css({zIndex:this.currentwin.index}).removeClass('current');
				cur_win.hide();
			}
			this.currentwin=oEl;
			oEl_title.addClass('current');
			this.tab_links_ul.append(oEl_title);
			this.tab_content.append(oEl_win);
			oEl_title.show();
			oEl_win.show();
			var _self=this;
			setTimeout(function(){
				_self.setScrollTool();
			},0);
		 },
		 //设置tab按钮(左和右),显示返回true,隐藏返回false
         setScrollTool: function () {
            var sumWidth = this.getSumWidth();
            var mainWidth = this.tab_links.width();
            if (sumWidth > mainWidth) {
				this.tab_links_ul.animate({ left: -1 * (sumWidth - mainWidth + this.padding_left_width + 2) });
                this.showScrollTool();
            } else {
				this.tab_links_ul.animate({ left: 0 });
                this.hideScrollTool();
            }
         },
		 current:function(){
			 return this.currentwin;
		 },
		 remove:function(oEl){//删除当前窗口
			oEl=oEl||this.currentwin;
			if(oEl == null) return;
			if(oEl['canDel']==false) return;
			var cur_id=oEl.id,cur_title=$('#title_'+cur_id),cur_win=$('#window_'+cur_id);
			var temparr = new Array();
			$.each(this.winlist,function(i,o){//删除当前对象
				if(o.id!=cur_id){
					o['index']=temparr.length+1;
					temparr.push(o);
				}
			});
			this.winlist = temparr;
			cur_title.remove();
			var iframe=cur_win.find('iframe')[0];
			iframe.src='';//防止内存泄露设置url为空
			var cycleClear=function() {
				try {
					if (iframe) {
						iframe.contentWindow.document.write('');//清空iframe的内容
						iframe.contentWindow.document.clear();//避免iframe内存泄漏
						$(iframe).remove();
					}
				} catch (e) {
					setTimeout(cycleClear, 100);
				}
			};
			setTimeout(cycleClear, 100);
			cur_win.remove();
			if(this.currentwin.id==cur_id){
				this.active(this.winlist[this.winlist.length-1]);
			}
			this.setScrollTool();
			iframe=null,cur_win=null,cur_title=null;
		 },
		 removeAll:function(){//移除所有窗体
			if(this.winlist.length==0) return;
			if(!confirm("您确定要关闭所有窗体吗?")){
				return false;
			}
		    var temparr = new Array(),_self=this;
			$.each(this.winlist,function(i,o){
				if(o['canDel']==false){
					o['index']=temparr.length+1;
					temparr.push(o);
				}else{
					_self.remove(o);
				}
			});
			this.winlist=temparr;
			if(this.winlist.length>0){
				this.active(this.winlist[0]);
			}
		 },
		 titleScrollStop:function(){
			clearTimeout(this.timer);
			this.timer = null;
		},
		titleMoveRight:function(){
			this.titleMove("right",8);
			this.timer=setTimeout(function(obj){
				return function(){
					obj.titleMoveRight();
				};
			}(this),10);
		 },
		 titleMoveLeft:function(){
			this.titleMove("left",8);
			this.timer=setTimeout(function(obj){
				return function(){
					obj.titleMoveLeft();
				};
			}(this),10);
		 },
		 titleMove:function(direction,speed){
			var sLeft = parseInt(this.tab_links_ul.css("left"));
			var sumWidth = this.getSumWidth();
            var mainWidth = this.tab_links.width();
			if (isNaN(sLeft))
				sLeft = 0;
			if(direction=="right"){
				if( sLeft <= -1*(sumWidth - mainWidth + this.padding_left_width + 2)){
					this.titleScrollStop();
					return;
				}else{
					this.tab_links_ul.css({ left:sLeft-speed });
				}
			}else{
				if(sLeft >=(this.padding_left_width+2)){
					this.tab_links_ul.css({ left: this.padding_left_width+2});
					this.titleScrollStop();
					return;
				}else{
					this.tab_links_ul.css({ left: sLeft+speed });
				}
			}
		 },
		 reload: function (oEl){
			 if(!oEl) return;
			 var _win=$('#window_'+oEl.id);
			 var loading = $("div.ui-tab-loading", _win);
	         var iframe = $("iframe:first", _win);
	         var url = $(iframe).attr("src");
	         this.active(oEl);
	         setTimeout(function(){
	        	 loading.show();
	        	 iframe.attr("src", url).unbind('load.tab').bind('load.tab', function(){
	        		 loading.hide();
	             });
	         },0);
	     },
	     removeOther:function(oEl){//移除其他窗体
	    	 if(!oEl) return;
			 if(this.winlist.length==0) return;
			 if(!confirm("您确定要关闭其他窗体吗?")){
			 	return false;
			 }
			 var temparr = new Array(),_self=this;
			 $.each(this.winlist,function(i,o){
				if(o['canDel']==false||o['id']==oEl['id']){
					o['index']=temparr.length+1;
					temparr.push(o);
				}else{
					_self.remove(o);
				}
			 });
			 this.winlist=temparr;
			 this.active(oEl);
		}
	});
	
})(jQuery);