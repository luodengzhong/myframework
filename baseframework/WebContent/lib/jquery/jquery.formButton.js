/********************************
title:      窗体底部按钮对象
Author:      xiexin
Date :      2014-03-06
*********************************/
(function($) {
	
	$.getFormButton=function(op){
		if($.isArray(op)){
			var buttons=[];
			$.each(op,function(i,o){
				//按钮权限判断
				if(!UICtrl.checkButtonNoAccess(o.id)){
					buttons.push(o);
				}
			});
			op=buttons;
		}
		if($.isArray(op)){
			if(op.length==0){
				return;
			}
		}
		var div=$('<div class="form-bar"></div>').appendTo('body');
		div.formButton(op);
		return div;
	};
	
	$.fn.formButton = function (op){
		var obj=this.data('ui_from_button');
		if(!obj){
			new formButton(this,op);
		}else{
			if (typeof op == "string") {
				var value=null,args = arguments;
				$.each(['addButton','removeButton','enable','disable'],function(i,m){
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

	function formButton(el,op){
		this.options={};
		this.element=$(el);
		this.events={};
		this.set(op);
		this.init();
		this.element.data('ui_from_button',this);
	}
	
	
	$.extend(formButton.prototype,{
		set:function(op){
			if($.isArray(op)){
				op={buttons:op};
			}
			this.options=$.extend({
				className:null,
				buttons:[],
				buttonHtml:'<input type="button" id="{id}" value="{name}" class="ui-button-inner" {disable} hidefocus/>'
			},this.options, op||{});
		},
		init:function(){
			this.element.addClass('form-bar');
			$('<div class="hold-bar"></div>').insertAfter(this.element);
			if(this.options.className) this.element.addClass(this.options.className);
			this.element.append(this.getButtonHtml(this.options.buttons));
			this.addEvent();
		},
		getButtonHtml:function(buttons){
			var html=[],ops=this.options,buttonId,_self=this;
			$.each(buttons,function(i,button){
				buttonId=button.id||'button_'+i;
				//按钮权限判断
				if(UICtrl.checkButtonNoAccess(buttonId)){
					return;
				}
				html.push('<span class="ui-button"><span class="ui-button-left"></span><span class="ui-button-right"></span>');
				html.push(ops.buttonHtml.replace('{id}',buttonId)
	                    .replace('{name}',button.name||'')
	                    .replace('{disable}',button.disable?' disabled="true"':''));
				html.push('</span>');
				if($.isFunction(button.event)){
					_self.events[buttonId]=button.event;
				}else if(typeof button.event=='string'){
					if($.isFunction(window[button.event])){
						_self.events[buttonId]=window[button.event];
					}
				}
			});
			return html.join('');
		},
		addEvent:function(){
			var _self=this;
			this.element.bind('click.fromButton',function(e){
				var $clicked = $(e.target || e.srcElement);
				if($clicked.is('input')){
					if($clicked.is(':disabled')) return;
					var id=$clicked.attr('id');
					if($.isFunction(_self.events[id])){
						return _self.events[id].call(window);
					}
				}
			});
		},
		addButton:function(buttons){
			if(!buttons) return;
			buttons=$.isArray(buttons)?buttons:[buttons];
			this.element.prepend(this.getButtonHtml(buttons));
		},
		removeButton:function(){
			if(arguments.length==0){
				this.element.find('span.ui-button').remove();
				delete this.events;
				this.events={};
			}else{
				var _self=this;
				$.each(arguments,function(i,id){
					var input=_self.element.find('input[id="'+id+'"]');
					if(input.length > 0){
						input.parent().remove();
						delete _self.events[id];
					}
				});
			}
		},
		enable: function() {
			if(arguments.length==0){
				this.element.find('input').removeAttr('disabled');
			}else{
				var _self=this;
				$.each(arguments,function(i,id){
					_self.element.find('input[id="'+id+'"]').removeAttr('disabled');
				});
			}
		},
		disable: function() {
			if(arguments.length==0){
				this.element.find('input').attr('disabled',true);
			}else{
				var _self=this;
				$.each(arguments,function(i,id){
					_self.element.find('input[id="'+id+'"]').attr('disabled',true);
				});
			}
		}
	});
	
})(jQuery);