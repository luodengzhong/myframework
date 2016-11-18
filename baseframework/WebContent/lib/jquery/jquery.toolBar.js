/********************************
title:      工具栏
Author:      xiexin
Date :      2014-03-06
*********************************/
(function($) {

	$.fn.toolBar = function (op){
		var obj=this.data('ui_tool_bar');
		if(!obj){
			new toolBar(this,op);
		}else{
			if (typeof op == "string") {
				var value=null,args = arguments;
				$.each(['setCheckAccess','addItem','removeItem','enable','disable','changeEvent'],function(i,m){
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

	function toolBar(el,op){
		this.options={};
		this.element=$(el);
		this.events={};
		this.set(op);
		this.init();
		this.element.data('ui_tool_bar',this);
	}
	$.extend(toolBar.prototype,{
		set:function(op){
			if($.isArray(op)){
				op={items:op};
			}
			//根据容器上的属性判断是否需要进行权限判断
			var checkAccess=true;
			if(this.element.attr('checkAccess')=='false'){
				checkAccess=false;
			}
			this.options=$.extend({
				className:null,
				items:[],
				checkAccess:checkAccess,//是否判断权限
				titleLang:null,
				itemHtml:'<li id="{id}" title="{title}" class="item{disable}"><a href="javascript:void(0);" class="{class}"><span>{name}</span></a></li>',
				lineHtml:'<li class="line" id="{id}"></li>'
			},this.options, op||{});
		},
		init:function(){
			this.element.addClass('ui-panelBar');
			if(this.options.className) this.element.addClass(this.options.className);
			this.element.find('li').addClass('item');
			this.getUL().append(this.getItemHtml(this.options.items));
			this.addEvent();
		},
		getUL:function(){
			var ul=this.element.children('ul');
			if(!ul.length){
				ul=$('<ul/>').appendTo(this.element);
			}
			return ul;
		},
		getItemHtml:function(items){
			var html=[],ops=this.options,itemId,_self=this;
			var titleStr="";
			$.each(items,function(i,item){
				itemId=item.id||'item_'+i;
				//按钮权限判断
				if(ops.checkAccess&&UICtrl.checkButtonNoAccess(itemId)){
					return;
				}
				if(item.line){
					html.push(ops.lineHtml.replace('{id}',itemId));
				}else{
					titleStr=_self.getItemTitle(item);
					html.push(ops.itemHtml.replace('{id}',itemId)
		                    .replace('{title}',titleStr)
		                    .replace('{class}',item.icon||'add')
		                    .replace('{disable}',item.disable?' disable':'')
		                    .replace('{name}',item.name||''));
					if($.isFunction(item.event)){
						_self.events[itemId]=item.event;
					}else if(typeof item.event=='string'){
						if($.isFunction(window[item.event])){
							_self.events[itemId]=window[item.event];
						}
					}
				}
			});
			return html.join('');
		},
		addEvent:function(){
			var _self=this;
			this.element.bind('click.toolBar',function(e){
				var $clicked = $(e.target || e.srcElement);
				if($clicked.hasClass('line')){
					return;
				}
				$clicked=$clicked.is('li')?$clicked:$clicked.parents('li.item');
				if($clicked.hasClass('disable')) return;
				var id=$clicked.attr('id');
				if($.isFunction(_self.events[id])){
					return _self.events[id].call(window);
				}
			}).bind('mousemove.toolBar',function(e){
				var $clicked = $(e.target || e.srcElement);
				_self.element.find('li').removeClass('hover');
				if($clicked.hasClass('line')){
					return;
				}
				$clicked=$clicked.is('li')?$clicked:$clicked.parents('li.item');
				if($clicked.is('li')){
					$clicked.addClass('hover');
				}
			}).bind('mouseout.toolBar',function(){
				_self.element.find('li.hover').removeClass('hover');
			});
		},
		addItem:function(items,checkAccess){
			if(!items) return;
			items=$.isArray(items)?items:[{line:true},items];
			this.getUL().append(this.getItemHtml(items));
		},
		removeItem:function(){
			if(arguments.length==0){
				this.element.find('li').remove();
				delete this.events;
				this.events={};
			}else{
				var _self=this;
				$.each(arguments,function(i,itemId){
					_self.element.find('li[id="'+itemId+'"]').remove();
					delete _self.events[itemId];
				});
			}
		},
		getItemTitle:function(item){
			var titleStr="",titleLangObj=this.options['titleLang'];
			var id=item.id,title=item.title,titleLangObj;
			if(titleLangObj){
				if(title){
					titleStr=titleLangObj[title];
					if(!titleStr){
						titleStr=title;
					}
				}else if(id){
					titleStr=titleLangObj[id];
				}
				titleStr=titleStr||'';
			}else{
				titleStr=title||'';
			}
			return titleStr;
		},
		enable: function() {
			if(arguments.length==0){
				this.element.find('li').removeClass('disable');
			}else{
				var _self=this;
				$.each(arguments,function(i,itemId){
					_self.element.find('li[id="'+itemId+'"]').removeClass('disable');
				});
			}
		},
		disable: function() {
			if(arguments.length==0){
				this.element.find('li').addClass('disable');
			}else{
				var _self=this;
				$.each(arguments,function(i,itemId){
					_self.element.find('li[id="'+itemId+'"]').addClass('disable');
				});
			}
		},
		changeEvent:function(id,fn){
			this.events[id]=fn;
		},
		setCheckAccess:function(checkAccess){
			if(typeof checkAccess!='undefined'){
				this.options.checkAccess=checkAccess;
			}
		}
	});
	
})(jQuery);