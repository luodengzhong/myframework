/********************************
title:      系统帮助显示对话框
Author:      xiexin
Date :      2014-06-24
*********************************/
(function($) {
	
	function helpDialog(op){
		this.options={};
		this.hasModifPermissions=false;
		this.editFlag=false;//是否处于编辑状态
		this.set(op);
		this.init();
		this.hideTimer=null;
	}
	
	$.extend(helpDialog.prototype,{
		set:function(op){
			this.options=$.extend({
				width:300,
				right:5,
				top:25,
				height:'100%',
				helpUrl:'help.do',
				loadUrl:'aboutAction!loadHelpByCode.ajax',
				saveUrl:'aboutAction!saveHelpById.ajax',
				param:{},
				getParam:null,
				onSuccessed:null,//ajax查询执行后处理方法
				delay:500
			},this.options, op||{});
		},
		init:function(){
			var dialogDiv=$('#ui_sys_help_dialog');
			if(dialogDiv.length==0){
				var _self=this;
				var html=['<div id="ui_sys_help_dialog">','<div class="help_title_bar" title="帮助">'];
				html.push('<span class="title">在线帮助</span>');
				html.push('</div>');
				html.push('<div class="help_content"></div>');
				html.push('</div>');
				dialogDiv=$(html.join('')).appendTo('body');
				dialogDiv.hover(function(){
					_self.clearTimeout();
				},function(){
					_self.hide();
				});
				dialogDiv.on('mousemove',function(e){
					var $el = $(e.target || e.srcElement);
					$(this).find('span.ui-state-hover').removeClass('ui-state-hover');
					if($el.hasClass('operating')){
						$el.addClass('ui-state-hover');
						return;
					}
					$(this).find('div.helpGroupHover').removeClass('helpGroupHover');
					var parent=$el.parents('div.helpGroup');
					if(parent.length>0){
						parent.addClass('helpGroupHover');
					}
				}).on('click',function(e){
					var url=_self.options.helpUrl;
					var $el = $(e.target || e.srcElement);
					if($el.hasClass('operating')){
						var parant=$el.parent().parent();
						_self.editDialog(parant);
						return;
					}
					var parent=$el.parents('div.helpGroup');
					if(parent.length>0){
						var id=parent.attr('id');
						url+='?helpId='+id;
					}
					window.open(web_app.name +'/' +url);
				});
			}
			this.doLoad();
		},
		show:function(){
			var opt=this.options;
			var mainDiv=$('#ui_sys_help_dialog').css({
				width:opt['width'],
				height:opt['height'],
				top:opt['top'],
				right:opt['right']
			}).show();
			var height=mainDiv.height();
			mainDiv.find('div.help_content').height(height-40);
		},
		hide:function(){
			if(this.editFlag){//编辑状态下不关闭
				this.clearTimeout();
				return;
			}
			this.hideTimer=setTimeout(function(){
				$('#ui_sys_help_dialog').slideUp("slow");
			},this.options.delay);
		},
		clearTimeout:function(){
			clearTimeout(this.hideTimer);
			this.hideTimer = null;
		},
		doLoad:function(){
			var _self=this,opt=this.options,param=opt.param;
			if($.isFunction(opt.getParam)){
				try{
					var tmp=opt.getParam.call(_self);
					if(tmp===false) return;
					param=$.extend(param,tmp);
				}catch(e){alert('参数取值函数执行错误:'+e.message);}
			}
			Public.ajax(web_app.name + '/' + opt.loadUrl, param, function (data) {
				if($.isFunction(opt.onSuccessed)){
					opt.onSuccessed.call(_self,data);
					return;
				}
				var list=data['rows'];
				_self.hasModifPermissions=((data['hasModifPermissions']+'')=='true');
				//组合数据显示
				var html=[];
				$.each(list,function(i,o){
					html.push('<div class="helpGroup" id="',o['helpId'],'" tagId="',o['tagId'],'">');
					if(!Public.isBlank(o['title'])){
						html.push('<div class="helpTitle">',o['title'],'</div>');
					}else{
						html.push('<div class="helpTitle" style="display:none;"></div>');
					}
					html.push('<div class="helpContent">',o['html'],'</div>');
					if(_self.hasModifPermissions){
						html.push('<div class="helpOperation">');
						html.push('<span class="operating">');
						html.push('<span class="ui-icon ui-icon-edit" style="margin-bottom:-2px;"></span>编辑');
						html.push('</span>','</div>');
					}
					html.push('</div>');
				});
				$('#ui_sys_help_dialog').find('div.help_content').html(html.join(''));
				_self.show();
				_self.zoomImages();
			});
		},
		editDialog:function(helpGroup){//打开编辑对话框
			var _self=this,opt=this.options,helpId=helpGroup.attr('id'),tagId=helpGroup.attr('tagId');
			var html=['<div class="ui-form">','<form method="post" action="" id="updateHelpContentForm">'];
			html.push("<div class='row'><dl>");
			html.push("<dt style='width:60px'>标&nbsp;题&nbsp;:</dt>");
			html.push("<dd style='width:520px'>");
			html.push("<input type='text' class='text' id='input-help-title' required='true' value=''/>");
			html.push("</dd>");
		    html.push("</dl></div>");
			html.push("<div class='row'><dl style='height:228px;'>");
			html.push("<dd style='width:600px;height:228px;'>");
			html.push("<textarea id='input-help-content' style='height:200px; width:600px;'></textarea>");
			html.push("</dd>");
		    html.push("</dl></div>");
			html.push('</form>');
			html.push("<div class='row'  style='text-align:right;margin-right:20px;padding-top:5px;'>");
			html.push("<input type='button' value='确 定' class='buttonGray ok'/>&nbsp;&nbsp;");
			html.push("<input type='button' value='关 闭' class='buttonGray close'/>&nbsp;&nbsp;");
			html.push("</div>");
			html.push("</div>");
			Public.dialog({
				title:'编辑帮助内容',
				content:html.join(''),
				width: 630,
				opacity:0.1,
				onClick:function($el){
					if($el.hasClass('close')){
						this.close();
					}else if($el.hasClass('ok')){//确定按钮
						var title=$('#input-help-title').val();
						var content=$("#input-help-content").val();
						var _dialog=this;
						var param={helpId:helpId,tagId:tagId};
						param['title']=Public.encode(title);
						param['content']=Public.encode(content);
						Public.ajax(web_app.name + '/' + opt.saveUrl, param, function (data) {
							if(title!=''){
								helpGroup.find('div.helpTitle').html(title).show();
							}else{
								helpGroup.find('div.helpTitle').hide();
							}
							helpGroup.find('div.helpContent').html(content);
							_dialog.close();
						});
					}
				},
				onClose:function(){
					//编辑标志修改为false
					_self.editFlag=false;
				}
			});
			$('#input-help-title').val(helpGroup.find('div.helpTitle').text());
			$('#input-help-content').val(helpGroup.find('div.helpContent').html());
			$('#input-help-content').toAreaEdit();
			this.editFlag=true;
		},
		zoomImages:function(){
			var width=$('#ui_sys_help_dialog').width(),height=$('#ui_sys_help_dialog').height();
			var imgs=$('#ui_sys_help_dialog').find('div.help_content').find('img');
			imgs.each(function(){
				var i=$(this),w=i.width(),h=i.height();
				var hRatio=(height-40)/h,wRatio=(width-20)/w,ratio=1;
				if (wRatio<1 || hRatio<1){
					ratio = (wRatio<=hRatio?wRatio:hRatio);
				}
				if (ratio<1){
					w = w * ratio;
					h = h * ratio;
				}
				i.css({width:w,height:h});
			});
		}
	});
	
	$.showHelpDialog=function(op){
		return new helpDialog(op);
	};
})(jQuery);