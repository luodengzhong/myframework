/*---------------------------------------------------------------------------*\
|  title:         通用选择对话框                                                                                                                              |
|  Author:        xiexin                                                      |
|  Created:       2014-01-28                                                  |
|  Description:   集成通用树及查询列表控件，支持单选及多选                                                            |
\*---------------------------------------------------------------------------*/
(function($) {
	
	$.fn.comboDialog = function(op){
		var obj=this.data('ui-combo-dialog');
		if(!obj){
			new ComboDialog(this,op);
		}else{
			if (typeof op == "string") {
				var _self=this,value,args = arguments;
				$.each(['enable','disable','getSelectedRows','getSelectedTreeNode'],function(i,m){
					if(op==m){
						args = Array.prototype.slice.call(args, 1);
						value=obj[m].apply(obj,args);
						return false;
					}
				});
				return value;
			}else{
				obj.set(op);
			}
		}
		return this;
	};
	
	//通用选择对话框类定义
	function ComboDialog(el,op){
		this.options={};
		this.gridManager=null;//查询列表管理对象
		this.dialogManager=null;//对话框管理对象
		this.treeManager=null;//树结构管理对象
		this.kindId = null;//当前选中节点类别ID
		this.folderId='';//当前选中树节点ID
		this.columns=null;//从配置文件中读取的查询表头
		this.disabled = false;
		this.columnWidth=0;//宽度
		this.element=$(el);
		//利用onCheckRow将选中的行记忆下来，并利用isChecked将记忆下来的行初始化选中
		this.checkedCustomer=new Map();
		this.set(op);
		this.init();
		this.element.data('ui-combo-dialog',this);
	}
	ComboDialog.getDialogContent=function(){
		var html=["<div class='combo-dialog-main-div'><div style='width:1000px'>"];
		html.push("<div class='combo-dialog-left'>");
		html.push("    <div class='combo-dialog-title'>");
		html.push("        <a class='toggle'></a>");
		html.push("        <span class='combo-dialog-title-span'>类别</span><span style='clear:both;'></span>");
		html.push("    </div>");
		html.push("    <div class='combo-dialog-left-down'>");
		html.push("        <ul class='comboChooseTree'></ul>");
		html.push("    </div>");
		html.push("</div>");
		html.push("<div class='combo-dialog-toggleLeft'>");
		html.push("		<div class='combo-dialog-title'><a class='combo-dialog-toggle'></a></div>");
		html.push("</div>");
		html.push("<div class='combo-dialog-right'>");
		html.push("    <div class='combo-dialog-center'>");
		html.push("        <div class='combo-dialog-title'>");
		html.push("            <span class='combo-dialog-center-span'>列表</span>");
		html.push("        </div>");
		html.push("        <div class='combo-dialog-right-down'>");
		html.push("            <table>");
		html.push("                <tr>");
		html.push("                    <td style='width:60px'>");
		html.push("                        <span class='labelSpan'>&nbsp;关键字&nbsp;:</span>");
		html.push("                    </td>");
		html.push("                    <td style='width:120px'>");
		html.push("                        <input type='text' name='name' maxlength='30' value='' class='text keyValue' />");
		html.push("                    </td>");
		html.push("                    <td>&nbsp;&nbsp;");
		html.push("                    <input type='button' value='查 询' class='buttonGray ui-button-inner'/>");
		html.push("                    </td>");
		html.push("                </tr>");
		html.push("            </table>");
		html.push("            <div class='comboChooseGrid'></div>");
		html.push("        </div>");
		html.push("    </div>");
		html.push("</div>"); 
		html.push("</div>");
		html.push("</div>");
		return html.join('');
	};
	$.extend(ComboDialog.prototype, {
		set:function(op){
			this.options=$.extend({
				url:web_app.name+'/easySearchAction!getComboDialogConfig.ajax',//查询配置URL
				gridUrl:web_app.name+'/easySearchAction!comboGridSearch.ajax',//列表查询URL
				type:'',//类别
				name:'',//名称
				width:420,
				leftWidth:155,
				lock:true,
				parent:null,
				getParam  : null,//参数取值函数
				columnRender:{},
				manageType:null,
				dataIndex:'dataIndexRownum',
				checkIndexField:null,
				triggerEvent : 'click',//显示触发方法
				checkbox:false,//单选OR多选
				title:'请选择...',//标题
				onChoose:function(){},//确定按钮
				onClose:function(){},//取消按钮
				onInit:null,//初始化时执行
				onShow:null,//打开对话框前执行
				treeOptions:{},//树参数
				gridOptions:{}//列表参数
			},this.options, op||{});
		},
		init:function(){
			var opt=this.options,_self=this;
			this.element.on(opt.triggerEvent,function(){
				if(_self.disabled) return false;
				if($.isFunction(opt.onShow)){
					if(opt.onShow.call(window)===false){
						return false;
					}
				}
				_self.show();
				return false;
			});
		},
		initTree:function(doc){
			if(!this.kindId) return;
			var opt=this.options,_self=this;
			var treeOpts={};
			if(this.kindId=='org'){
				treeOpts={
					loadTreesAction:'orgAction!queryOrgs.ajax',
					parentId :'orgRoot',
					getParam : function(e){
						if(e){
							return {showDisabledOrg:0,orgKindId : "ogn,dpt,pos"};
						}
						return {showDisabledOrg:0};
					},
					changeNodeIcon:function(data){
						data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
					},
					IsShowMenu:false,
					onClick : function(data){
						var html=[],fullId='',fullName='';
						if(!data){
							html.push('列表');
						}else{
							fullId=data.fullId,fullName=data.fullName;
							html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>列表');
						}
						$('span.combo-dialog-center-span',doc).html(html.join(''));
						if (gridManager&&fullId!='') {
							_self.folderId=fullId;
							UICtrl.gridSearch(_self.gridManager, {folderId:fullId});
						}else{
							_self.folderId='';
							_self.gridManager.options.parms['fullId']='';
						}
					}
				};
			}else{
				treeOpts={
					kindId : _self.kindId,
					IsShowMenu : false,
					onClick:function(data,folderId){
						if(_self.kindId==folderId) folderId='';
						$('span.combo-dialog-center-span',doc).html(
								"<font style=\"color:Tomato;font-size:13px;\">["
										+ data.name + "]</font>"
										+ "列表");
						_self.folderId=folderId;
						UICtrl.gridSearch(_self.gridManager, {folderId:folderId});
					}
				};
			}
			var treeOptions=opt.treeOptions||{};
			if($.isFunction(treeOptions)){
				treeOptions=treeOptions.call(_self,doc);
			}
			treeOpts=$.extend(treeOpts,treeOptions);
			if(opt.manageType){//加入管理权限
				treeOpts['manageType']=opt.manageType;
			}
			this.treeManager=$('ul.comboChooseTree',doc).commonTree(treeOpts);
		},
		initGrid:function(doc){
			var opt=this.options,_self=this,columns=[];
			this.columnWidth=0;
			$.each(_self.columns, function(i,o){
				var width=parseInt(o.width),type=o.type,align=o.align;
				if(type=='hidden') return;
				_self.columnWidth+=(isNaN(width)?100:width);
				columns.push({ display:o.name, name:o.code, width:isNaN(width)?100:width, minWidth: 60,render:opt.columnRender[o.code]||null,type:type==''?'string':type, align:align==''?'left':align});
			});
			var param={configType:opt.type,queryName:opt.name,folderId:''};
			if(opt.manageType){//加入管理权限
				param[Public.manageTypeParmName]=opt.manageType;
			}
			if($.isFunction(opt.getParam)){
				var p=opt.getParam.call(window);
				param=$.extend({},p||{},param);
			}
			var gridOptions=opt.gridOptions||{};
			if($.isFunction(gridOptions)){
				gridOptions=gridOptions.call(this,doc);
			}
			var gridOpts=$.extend({
				dataAction : 'server',
				columns:columns,
				pageSize : 10,
				width :'100%',
				height :269,
				headerRowHeight : 25,
				rowHeight : 25,
				fixedCellHeight: true,
				selectRowButtonOnly: true,
				isChecked: function(data){
					if (typeof _self.findCheckedCustomer(data) == 'undefined')
		                return false;
		            return true;
				}, 
				onCheckRow: function(checked,data){
					 if (checked){
						 _self.addCheckedCustomer(data);
					 }else{
						 _self.removeCheckedCustomer(data);
					 }
				},
				onCheckAllRow: function(checked){
					for (var rowid in this.records){
		                if(checked){
		                	_self.addCheckedCustomer(this.records[rowid]);
		                }else{
		                	_self.removeCheckedCustomer(this.records[rowid]);
		                }
		            }
				}
			},gridOptions,{
				url:opt.gridUrl,
				checkbox:opt.checkbox,
				parms:param
			});
			var gridDiv=$('div.comboChooseGrid',doc);
			this.gridManager = UICtrl.grid(gridDiv,gridOpts);
			gridDiv.find('span.l-bar-text').hide();
			/*var rightDiv=$('div.combo-dialog-right',doc),rightDivWidth=rightDiv.width();
			if(this.columnWidth>rightDivWidth){
				rightDiv.width(this.columnWidth+10);
			}*/
		},
		addCheckedCustomer:function(data){
			var dataIndex=this.options.dataIndex;
			var dataIndexValue=data[dataIndex]||data['myRownum'];
			this.checkedCustomer.put(dataIndexValue,data);
		},
		removeCheckedCustomer:function(data){
			var dataIndex=this.options.dataIndex;
			var dataIndexValue=data[dataIndex]||data['myRownum'];
			this.checkedCustomer.remove(dataIndexValue);
		},
		findCheckedCustomer:function(data){
			var dataIndex=this.options.dataIndex;
			var dataIndexValue=data[dataIndex]||data['myRownum'];
			return this.checkedCustomer.get(dataIndexValue);
        },
		intLayout:function(doc){
			var _self=this,layoutDiv=$('div.combo-dialog-main-div',doc);
			var right=$('div.combo-dialog-right',layoutDiv);
			var leftWidth=this.options.leftWidth;
			if(_self.kindId){//存在树配置
				layoutDiv.addClass('ui-combo-dialog');
				var left=$('div.combo-dialog-left',layoutDiv),toggleLeft=$('div.combo-dialog-toggleLeft',layoutDiv);
				left.css({width:leftWidth});
				left.find('.combo-dialog-title').css({width:leftWidth});
				left.find('.combo-dialog-left-down').css({width:leftWidth});
				right.css({marginLeft:5+leftWidth});
				left.find('a').on('click',function(){
					var rw=right.width();
				    left.hide();
				    toggleLeft.show();
				    right.css({marginLeft:30,width:rw+leftWidth-25});
				    if(_self.gridManager){
				    	try{
					    	_self.gridManager.reRender();
					    }catch(e){
					    	_self.gridManager._onResize.ligerDefer(_self.gridManager, 50);
					    }
				    }
				});
				toggleLeft.find('a').on('click',function(){
					var rw=right.width();
				    left.show();
				    toggleLeft.hide();
				    right.css({marginLeft:5+leftWidth,width:rw-leftWidth+25});
				    if(_self.gridManager){
				    	try{
					    	_self.gridManager.reRender();
					    }catch(e){
					    	_self.gridManager._onResize.ligerDefer(_self.gridManager, 50);
					    }
				    }
				});
			}else{//隐藏树配置
				$('div.combo-dialog-left',doc).hide();
				$('div.combo-dialog-title',doc).hide();
			}
			right.width(this.options.width);
		},
		initButton:function(doc){
			var input=$('input.text',doc),_self=this;
			input.bind('keyup.queryForm',function(e){
				var k =e.charCode||e.keyCode||e.which;
				if(k==13){//回车
					UICtrl.gridSearch(_self.gridManager, {folderId:_self.folderId,paramValue:encodeURI(input.val())});
				}
			});
			$('input.ui-button-inner',doc).on('click',function(){
				UICtrl.gridSearch(_self.gridManager, {folderId:_self.folderId,paramValue:encodeURI(input.val())});
			});
		},
		show:function(){
			var opt=this.options,_self=this;
			_self.folderId='';
			if(!this.columns){
				Public.ajax(opt.url,{configType:opt.type,queryName:opt.name},function(data){
					_self.kindId=data['kindId'];
					_self.columns=data['columns'];
					_show();
				});
			}else{
				_show();
			}
			function _show(){
				if(_self.columns.length==0){
					tips({type:1, content : '未找到查询表头数据!'});
					return;
				}
				var dialogOpts=$.extend(opt.dialogOptions||{},{
					content:ComboDialog.getDialogContent(),
					title:opt.title,
					top:20,
					parent:opt.parent,
					lock:opt.lock,
					height:100,
					width:'auto',
					ok:function(){
						if($.isFunction(opt.onChoose)){
							return opt.onChoose.call(_self,this);
						}
					},
					close:function(){
						if($.isFunction(opt.onClose)){
							return opt.onClose.call(_self,this);
						}
					},
					init:function(doc){
						_self.checkedCustomer.clear();
						_self.intLayout(doc);
						_self.initTree(doc);
						_self.initGrid(doc);
						_self.initButton(doc);
						var width=opt.width+2;
						if(_self.kindId){
							width+=opt.leftWidth+10;
						}
						$('div.combo-dialog-main-div',doc).width(width);
						var that = this, DOM = that.DOM,
					    wrap = DOM.wrap[0],
						left = parseInt(wrap.style.left);
						left = left - width / 2;
						that.position(left,20);
						if($.isFunction(opt.onInit)){
							opt.onInit.call(_self,doc);
						}
						setTimeout(function(){
							$('div.combo-dialog-main-div',doc).show();
							$('input.keyValue',doc).focus();
						},0);
						this['gridManager']=_self.gridManager;
					}
				});
				_self.dialogManager=UICtrl.showDialog(dialogOpts);
				try{$.closeCombox();}catch(e){}
				try{$.datepicker.close();}catch(e){}
			}
		},
		getSelectedRows:function(){
			if(this.options.checkbox){
				return this.checkedCustomer.values();
			}
			return this.gridManager.getSelectedRows();
		},
		getSelectedRow:function(){
			return this.gridManager.getSelectedRow();
		},
		getSelectedTreeNode:function(){
			return this.treeManager.commonTree('getSelected');
		},
		closeDialog:function(){
			this.dialogManager.close();
		},
		enable: function() {
			this.disabled = false;
			this.element.removeAttr('disabled');
		},
		disable: function() {
			this.disabled = true;
			this.element.attr('disabled',true);
		}
	});
})(jQuery);