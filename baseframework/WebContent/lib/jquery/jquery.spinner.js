/*---------------------------------------------------------------------------*\
|  title:         上下点击框                                                                                                                                 |
|  Author:        xiexin                                                      |
|  Created:       2013-12-05                                                  |
|  LastModified:  2013-12-06                                                  |
|  需求:<link rel="stylesheet" type="text/css" href="ui.css">                  |
|       <script src="jquery.js" type="text/javascript"></script>               |
|  使用如:                                                                     |
|  $('#pp1').tooltip({content: '<span class="loading">加载中...</span>'});     |
\*---------------------------------------------------------------------------*/
(function($) {
	$.fn.spinner = function(op){
		return this.each(function() {
			var obj=$.data(this,'spinner');
			if(!obj){
				new spinner($(this),op);
			}else{
				if (typeof op == "string") {
					var _self=$(this);
					$.each(['enable','disable'],function(i,m){
						if(op==m){
							obj[m].call(obj,_self);
							return false;
						}
					});
				}else{
					obj.set(op);
				}
			}
		}); 
	};
	function spinner($el,op){
		this.options={};
		this.set(op);
		this.disabled = false;
		this.timer = null;
		this.init($el);
		$el.data('spinner',this);
	}
	$.extend(spinner.prototype, {
		set:function(op){
			this.options=$.extend({
				step    : 1,//默认步长
				min     : null,//最小值
				max     : null,//最大值
				countWidth: false,
				onUp    : function($el){
					var _step=this.options.step;
					var value=parseInt($el.val().replace(/_/i,''),10);
					value=isNaN(value)?_step:value+_step;
					value=this.options.doCheck.call(this,value);
					//$el.val(value).focus();
					$el.val(value);
				},
				onDown  : function($el){
					var _step=this.options.step;
					var value=parseInt($el.val().replace(/_/i,''),10);
					value=isNaN(value)?-_step:value-_step;
					value=this.options.doCheck.call(this,value);
					//$el.val(value).focus();
					$el.val(value);
				},
				doCheck : function(value){//格式化value
					var max=parseInt(this.options.max,10),min=parseInt(this.options.min,10);
					if(!isNaN(max)&&value > max){
						value=max;
					}
					if(!isNaN(min)&&value < min){
						value=min;
					} 
					if($.isFunction(this.options.doFormat)){
						value=this.options.doFormat.call(this,value);
					}
					return value;
				},
				doFormat:null,
				default_value:0//默认值
			},this.options, op||{});
		},
		init:function($el){
			var html=['<span class="ui-spinner">','<span class="ui-spinner-arrow">'];
			html.push('<span class="ui-spinner-arrow-up"></span>','<span class="ui-spinner-arrow-down"></span>');
			html.push('</span>','</span>');
			var spinner_wrap=$(html.join('')).insertAfter($el);
			$el.addClass("text").prependTo(spinner_wrap);
			this.resize($el);
			var _self=this;
			/*spinner_wrap.bind('click.spinner',function(e){
				var $clicked = $(e.target || e.srcElement);
				if($clicked.hasClass('ui-spinner-arrow-up')){
					_self.onClick($el,true);
				}else if($clicked.hasClass('ui-spinner-arrow-down')){
					_self.onClick($el,false);
				}
				_self.stop();
			});*/
			spinner_wrap.bind('mousedown.spinner',function(e){
				var $e = $(e.target || e.srcElement);
				if($e.hasClass('ui-spinner-arrow-up')){
					 _self.up($el);
				 }else if($e.hasClass('ui-spinner-arrow-down')){
					 _self.down($el);
				 }
			}).bind('mouseup.spinner',function(e){
				_self.stop();
			});
			if($el.is(':disabled')||$el.is('[readonly]')){
				this.disable($el);
			}
			spinner_wrap.find('span.ui-spinner-arrow-up,span.ui-spinner-arrow-down').hover(function(){$(this).addClass('ui-spinner-arrow-hover');},function(){$(this).removeClass('ui-spinner-arrow-hover');});
		},
		resize:function($el,size){
			var countWidth=this.options.countWidth;
			size=size||{width:$el.outerWidth(),height:25};
			if (isNaN(size.width)) {
				size.width = $el.outerWidth();
			}
			if (isNaN(size.height)) {
				size.height = $el.outerHeight()+1;
			}
			var spinner_wrap=$el.parent(),spinner_arrow = spinner_wrap.find(".ui-spinner-arrow");
			var _tmp = $("<div style=\"display:none\"></div>").insertBefore(spinner_wrap);
			spinner_wrap.hide().appendTo("body");
			spinner_wrap.height(size.height - (spinner_wrap.outerHeight() - spinner_wrap.height()));
			if(countWidth){
				spinner_wrap.width(size.width - (spinner_wrap.outerWidth() - spinner_wrap.width()));
				$el.width(spinner_wrap.width() - spinner_arrow.outerWidth()-($el.outerWidth() - $el.width()));
			}
			$el.css( {height : (spinner_wrap.height()-1) + "px",lineHeight : (spinner_wrap.height()-1) + "px"});
			spinner_arrow.height(spinner_wrap.height()-(spinner_arrow.outerHeight() - spinner_arrow.height()));
			spinner_arrow.find("span").height(spinner_arrow.height() / 2);
			spinner_wrap.show().insertAfter(_tmp);
			_tmp.remove();
		},
		stop:function(){
			clearTimeout(this.timer);
			this.timer = null;
		},
		up:function($el){
			this.onClick($el,true);
			this.timer=setTimeout(function(obj){
				return function(){
					obj.up($el);
				};
			}(this),150);
		},
		down:function($el){
			this.onClick($el,false);
			this.timer=setTimeout(function(obj){
				return function(){
					obj.down($el);
				};
			}(this),150);
		},
		onClick:function($el,flag){
			if(this.disabled) return;
			if ($el.val()=='') {
				var defaultValue=this.options.default_value;
				if(typeof this.options.default_value=='function')
					defaultValue=defaultValue.call(window);
				$el.val(defaultValue);
			}
			this.options[flag?'onUp':'onDown'].call(this,$el);
		},
		enable: function($el) {
			this.disabled = false;
			var td=$el.parent().parent('td.edit');
			if(td.length>0){
				td.removeClass('disable');
			}
			$el.removeAttr('readonly').removeClass('textReadonly');
			$el.next('span').show();
		},
		disable: function($el) {
			this.disabled = true;
			var td=$el.parent().parent('td.edit');
			if(td.length>0){
				td.addClass('disable');
			}
			$el.attr('readonly',true).addClass('textReadonly');
			$el.next('span').hide();
		}
	});
})(jQuery);