/*---------------------------------------------------------------------------*\
|  title:         滑动选择菜单                                                |
|  Author:        xiexin                                                      |
|  Created:       2014-01-07                                                  |
|  LastModified:  2014-12-07                                                  |
|  需求:<link rel="stylesheet" type="text/css" href="ui.css">                 |
|       <script src="jquery.js" type="text/javascript"></script>              |
|  使用如:                                                                    |
|   $('#nav').spasticNav();                                                   |
\*---------------------------------------------------------------------------*/
(function($) {

	$.fn.functionMenu=function(options){
		this.addClass('ui-spastic-nav');
		return this.each(function() {
			var _self=this;
			$(this).find('li').on('click',function(e){
				$('li', _self).removeClass('selected').removeClass('hover');
				$(this).addClass('selected');
				if($.isFunction(options.callBack)){
					options.callBack.call(window,$(this));
				}
				e.preventDefault();
				e.stopPropagation();
				return false;
			}).hover(function(){
				$(this).addClass('hover');
			},function(){
				$(this).removeClass('hover');
			});
			
		});
	};
	
	$.fn.spasticNav = function(op){
		return this.each(function() {
			var obj=$.data(this,'spasticNav');
			if(!obj){
				new spasticNav(this,op);
			}else{
				if (typeof op == "string") {
					var _self=$(this);
					$.each(['positions'],function(i,m){
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
	
	function spasticNav(el,op){
		var $el=$(el);
		this.options={};
		this.disabled = false;
		this.timer = null;
		this.blob=null;
		this.set(op);
		this.init($el);
		$el.data('spasticNav',this);
	}
	$.extend(spasticNav.prototype, {
		set:function(op){
			this.options=$.extend({
				overlap : 10,
				speed : 300,
				reset : 1000,
				color : '#27315F',
				easing : 'easeOutExpo',
				callBack:null
			},this.options, op||{});
		},
		clearTimeout:function(){
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		},
		init:function($el){
			$el.addClass('ui-spastic-nav');
			var blob_html = [ '<div class="ui-spastic-nav-blob">' ];
			//blob_html.push('<span></span>');
			blob_html.push('</div>');
			this.blob = $(blob_html.join('')).appendTo('body');
			this.positions($el);
			this.addEvent($el);
		},
		addEvent:function($el){
			var _self=this,options=this.options;
			$('li:not(li.blob)', $el).hover(function() {
				_self.clearTimeout();
				_self.blob.show().animate({
					left : $(this).offset().left,
					top : $(this).offset().top - options.overlap / 2,
					width : $(this).width()
				}, {
					duration : options.speed,
					easing : options.easing,
					queue : false
				});
				$el.find('li').removeClass('hover');
				if(!$(this).hasClass('selected')){
					$(this).addClass('hover');
				}
			}, function() {
				var _obj=$(this);currentPageItem = $('li.selected', $el);
				if(!currentPageItem.length) {
					_self.blob.hide();
					return;
				}
				_self.timer = setTimeout(function() {
					var offset=currentPageItem.offset();
					_self.blob.animate({
						width : currentPageItem.outerWidth(),
						left : offset.left,
						top : offset.top - options.overlap / 2
					}, options.speed);
					_obj.removeClass('hover');
				}, options.reset);

			}).on('click', function(e) {
				$('li', $el).removeClass('selected').removeClass('hover');
				$(this).addClass('selected');
				if($.isFunction(options.callBack)){
					options.callBack.call(_self,$(this));
				}
				e.preventDefault();
				e.stopPropagation();
				return false;
			});
		},
		positions:function($el){
			this.clearTimeout();
			var currentPageItem = $('li.selected', $el),options=this.options,_self=this;
			$el.find('li').removeClass('hover');
			if(currentPageItem.length>0){
				var offset=currentPageItem.offset();
				setTimeout(function(){
					_self.blob.css({
						width : currentPageItem.outerWidth(),
						height : currentPageItem.outerHeight() + options.overlap,
						left : offset.left,
						top : offset.top - options.overlap / 2,
						backgroundColor : options.color
					}).show();
				},0);
			}else{
				this.blob.hide();
			}
		}
	});
	
	/******主页下拉菜单*******/
	$.fn.downMenu=function(){
		return this.each(function() {
			var flag=false;
			//判断是否有权限控制显示
			if($(this).hasClass('hasFun')){
				flag=true;
			}else{
				var length=$(this).find('li.hasFun').length;
				if(length >0){
					flag=true;
				}
			}
			$(this)[flag?'show':'hide']();
			var _self=this,_timer=null;
			var _show=function(){
				 var ul=$('ul', _self);
				 if(ul.length>0){
					 var ulId=$(_self).attr('ulId');
					 if(!ulId) {
						 ulId='UL'+new Date().getTime()+"_"+Math.round(Math.random()*10000);
						 $(_self).attr('ulId',ulId);
					 }
					 var offset=$(_self).offset(),height=$(_self).height()+2;
					 var cloneUl=ul.clone().prependTo("body");
					 cloneUl.attr('id',ulId).addClass('popmenuUl').css({top:offset.top+height,left:offset.left}).show();
					 cloneUl.hover(function() {$(_self).attr('hover',true);},function() {$(_self).removeAttr('hover');_hide();});
				 }
				 $(_self).children('a:first').addClass("hov");
			};
			var _hide=function(){
				_timer=setTimeout(function(){
					var hover=$(_self).attr('hover');
					if(hover){
						return;
					}
					var ulId=$(_self).attr('ulId');
					if(ulId){
						$('#'+ulId).remove();
					}
					$(_self).children('a:first').removeClass("hov");
					$(_self).removeAttr('hover');
				},100);
			};
			$(this).hover(function() {_show();}, function() {_hide();});
		});
	};

})(jQuery);