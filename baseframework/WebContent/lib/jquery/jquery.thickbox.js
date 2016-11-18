/*********************************************************
title:     弹出层显示图片，根据图片及窗口大小调整显示比例
Author:      xiexin
使用:   $.thickbox({imgURL:url});
**********************************************************/
(function($) {
    var JThickbox=function(options) {
		options=$.extend({
			isScreen:true,//是否显示遮罩
			screenColor:'#001',    //遮罩透明色
			screenAlpha:0.1,    //遮罩透明度
			width:300,
			height:200,
			doChange:false,
			onClick:false,
			isChange:false,
			html:'',
			imgURL:'',
			isImg:true//是否用于显示图片
		},options||{});
		this.init(options);
	};
    $.extend(JThickbox.prototype, {
		init : function(options) {
			this.options = options;
			if(this.options.isImg&&this.options.html==''&&this.options.imgURL!=''){
				this.options.html='<img  src="'+this.options.imgURL+'"/>';
			}
			this.div=$('#thickbox_main_div');
			if(this.div.length>0) $.thickboxClose();
			var html = ['<div class="ui-thickbox" id="thickbox_main_div">',
						'<span class="icon_close" title="关闭" id="thickbox_icon_close"></span>',
						'<span class="nav prev" title="上一张"></span>',
						'<span class="nav next" title="下一张"></span>',
					    '<div class="content">',
						this.options.html,
						'</div></div>'];
			this.div = $(html.join('')).appendTo('body');
			var self = this;
			if(this.options.isChange){this.div.add($('span.nav',this.div)).hover(function(){$(this).addClass('hover');},function(){$(this).removeClass('hover');});}
			this.div.bind('click',function(e){
				var $clicked = $(e.target || e.srcElement);
				if($clicked.hasClass('icon_close')){
					self.remove();
				}else if($clicked.hasClass('nav')){
					if($.isFunction(self.options.doChange)){
						self.options.doChange.call(window,$clicked.hasClass('next'));
					}
				}
				if($.isFunction(self.options.onClick)){
					self.options.onClick.call(self,e);
				}
				e.preventDefault();
				e.stopPropagation();
				return false;
			});
			this.show();
		},
		show:function(){
			var screenOver=$('#Jquery_ScreenOver');
			if(!screenOver.length){
				screenOver=$('<div id="Jquery_ScreenOver" style="position:absolute;top:0px;left:0px;width:0;height:0;z-index:1000;display:none;"></div>').appendTo('body');
			}
			var d = $(document),w=d.width(),h=d.height(),mt=d.scrollTop(),ml=d.scrollLeft();
			var rootEl=document.compatMode=='CSS1Compat'?document.documentElement:document.body;	//根元素
			if(this.options.isImg){//判断图片大小是否操作显示区域,修改显示大小(按比例调整)
				var tw = rootEl.clientWidth-80,th = rootEl.clientHeight-100;//显示区域大小
				var _obj=this;
				var img = new Image();// 创建对象
				img.src = this.options.imgURL;// 改变图片的src
				var isLoad=false;
				var check = function(){
				    if(img.width>0 || img.height>0){// 只要任何一方大于0,表示已经服务器已经返回宽高
				    	setTimeout(showImg,0);
				    }
				};
				var set = setInterval(check,40);// 定时执行获取宽高
				img.onload = function(){
					setTimeout(showImg,0);
				};
				img.onerror = function(){//图片不存在时显示默认
					img.width='80';
					img.height='80';
					img.onerror=null;
					_obj.div.find('img').attr('src',web_app.name+'/themes/default/images/error_image.gif');
					setTimeout(showImg,0);
				};
				var showImg=function(){//显示区域大小
					if(isLoad) return;
					var nw=img.width,nh=img.height;
					var hRatio=th/nh,wRatio=tw/nw,ratio=1;
					if (wRatio<1 || hRatio<1){
						ratio = (wRatio<=hRatio?wRatio:hRatio);
					}
					if (ratio<1){
						nw = nw * ratio;
						nh = nh * ratio;
					}
					_obj.div.find('img').css({width:nw,height:nh});
					var diagtop = (h-nh+mt)/2-40,diagleft = (w-nw+ml)/2-20;
					if(diagtop<20) diagtop=20;
					_obj.div.css({width:nw+10,height:nh+10,top:diagtop,left:diagleft}).show();
					clearInterval(set);
					isLoad=true;
				};
			}else{
				var width=this.options.width,height=this.options.height;
		        var diagtop = (h-height+mt)/2-20,diagleft = (w-width+ml)/2-20;
				this.div.css({width:width,height:height,top:diagtop,left:diagleft}).show();
			}
			if(this.options.isScreen){
				screenOver.css({
					width:(rootEl.scrollWidth==0?rootEl.clientWidth:rootEl.scrollWidth)+'px',
					height:(rootEl.scrollHeight==0?rootEl.clientHeight:rootEl.scrollHeight)+'px',
					background:this.options.screenColor,
					filter:'alpha(opacity='+(this.options.screenAlpha*100)+')',
					opacity:this.options.screenAlpha
				}).show();
			}
		},
		remove : function() {
			this.div.unbind('click');
			this.div.remove();
			$('#Jquery_ScreenOver').hide();
			this.div = null;
		}
	});
	$.thickbox = function(options){
		return new JThickbox(options);
	};
	$.thickboxClose = function(){
		$('#thickbox_icon_close').trigger('click');
	};
})(jQuery);
