/*---------------------------------------------------------------------------*\
|  title:         下拉选项卡控                                                |
|  Author:        xiexin                                                      |
|  Created:       2013-12-31                                                  |
|  LastModified:  2014-01-03                                                  |
|  需求:<link rel="stylesheet" type="text/css" href="jquery.tooltip.css">     |
|       <script src="jquery.js" type="text/javascript"></script>              |
|  使用如:                                                                    |
| $('#bbbbb').combox({data:[[1,'a'],[2,'b'],[3,'c'],['4','d']]});             |
| $('#ccccc').combox({data:[{value:'1',text:'a'},{value:'2',text:'b'}]});     |
| $('#ccccc').searchbox({type:'sys',name:'extendedFieldDefine',valueIndex:'defineId',textIndex:'fieldCname'});//lookup方式
| $('#testTree').treebox({treeLeafOnly:true,treeViewMappingName:'org'});      |
| $('#testdictionary').remotebox({ dictionary:'degree', lookUpValue:'高中' }); |
| type:'sys',name:'extendedFieldDefine',checkbox:true,valueIndex:'#main_createby',checkboxIndex:'defineId',callBackControls:{fieldCname:'#main_sourcetable',fieldEname:'#main_createbyname',defineId:'#main_createby'}    |
\*---------------------------------------------------------------------------*/
(function($) {
	//命名空间
    var ComboxNamespace={
    	pageSize:'pageSize',
    	searchConfigType:'configType',
    	searchQueryName:'queryName',//快捷查询名称
    	paramValue:'paramValue',//快捷查询参数
    	intPage:'intPage',//快捷查询页码
    	treeViewMappingName:'treeViewMappingName',//树查询名称
    	searchQueryCondition:'searchQueryCondition',//快捷查询条件名称
    	manageType:'sys_Manage_Type',//管理权限参数名称
    	searchUrl: '/easySearchAction.load',
    	treeUrl:'/treeViewAction!root.ajax',
    	treeChildrenUrl:'/treeViewAction!children.ajax',
    	dictionaryUrl:'/easySearchAction!dictionary.ajax',
    	defaultSelected:function(val){
			var opts = this.options;
			val=val||{};
			//为lookUp 字段赋值
			if(opts.callBackControls.text&&!Public.isBlank(val.lookUpValue)){
				$(opts.callBackControls.text).val(val.lookUpValue);
			}
			if(opts.callBackControls.value&&!Public.isBlank(val.fieldValue)){
				$(opts.callBackControls.value).val(val.fieldValue);
			}
			return false;
		}
    };
    
	$.fn.combox = function(op){
		var obj=this.data('ui-combox');
		if(!obj){
			new combox(this,op);
		}else{
			if (typeof op == "string") {
				var value=null,args = arguments;
				$.each(['enable','disable','getText','setValue','setText','getFormattedData','getJSONData','setData'],function(i,m){
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
	
	$.fn.searchbox = function(op){
		if (typeof op == "string") {
			return this.combox.call(this,arguments);
		}
		op=op||{};
		var param = {};
		param[ComboxNamespace['searchQueryName']]=op.name;//查询名称
		param[ComboxNamespace['pageSize']]=op.pageSize?op.pageSize:8;//页面显示数据条数
		param[ComboxNamespace['searchConfigType']]=op.type;//查询类别
		if(typeof op.param =='object'){//查询默认参数
			param=$.extend(param,op.param);
		}
		op=$.extend({
			url  : ComboxNamespace.searchUrl,//默认查询地址
			mode : 'search',
			queryDelay:1000,
			maxHeight:300,
			showToolbar:true,
			onDefaultSelected:ComboxNamespace.defaultSelected
		},op);
		op['param']=param;
		return this.combox(op);
	};
	
	$.fn.treebox = function(op){
		if (typeof op == "string") {
			return this.combox.call(this,arguments);
		}
		op=op||{};
		var param = {};	
		param[ComboxNamespace['treeViewMappingName']]=op.name||'';//查询名称
		if(typeof op.param =='object'){//查询默认参数
			param=$.extend(param,op.param);
		}
		if(op.manageType){
			param[ComboxNamespace['manageType']]=op.manageType;
		}
		var tree={
			url:web_app.name+ComboxNamespace.treeUrl,
		    idFieldName : 'id',
			parentIDFieldName : 'parentId',
			textFieldName : "name",
			iconFieldName : "nodeIcon",
			dataRender:function(data){
				if(data['Rows']){
					if(data.isAjax===false){//判断是否是AJAX
						this.options.delay=true;
					}
					this.options.idFieldName=data.idFieldName;
					this.options.parentIDFieldName=data.parentIDFieldName;
					this.options.textFieldName=data.textFieldName;
					tree.idFieldName=data.idFieldName;
					tree.parentIDFieldName=data.parentIDFieldName;
					tree.textFieldName =data.textFieldName;
				}
				return data['Rows']||data;
			},
			isLeaf : function(data) {
				if($.isFunction(op.changeNodeIcon)){
					op.changeNodeIcon.call(window,data);
				}
				return parseInt(data.hasChildren) == 0;
			},
			delay: function(e){
		        return { url:web_app.name+ComboxNamespace.treeChildrenUrl,parms:{treeParentId : e.data[this.options.idFieldName]}};
		    },
		    checkbox: op.checkbox||false	
		};
		var needAuth=op.needAuth===false?false:true;
		var beforeChange=op.beforeChange;
		delete op.beforeChange;
		op=$.extend({
			mode : 'tree',
			height:250,
			maxHeight:250,
			queryDelay:1000,
			showToolbar:true,
			searchName :false,//快捷查询名称
			searchType :false,//快捷查询类别
			hasSearch  :false,//是否需要快捷查询
			onDefaultSelected:ComboxNamespace.defaultSelected,
			beforeChange:function(data){
				var flag=false;
				if(needAuth){
					flag=$.combox.authentication(data);
					if(flag===false) return false;
				}
				if($.isFunction(beforeChange)){
					flag=beforeChange.call(this,data);
					if(flag===false) return false;
				}
				return true;
			}
		},op);
		op['tree']=$.extend(tree, op.tree||{}, {param:param});
		return this.combox(op);
	};
	
	$.fn.orgTree = function(op){
		if (typeof op == "string") {
			return this.combox.call(this,arguments);
		}
		op=op||{};
		var filter=op.filter||'';
		var beforeChange=op.beforeChange;
		delete op.beforeChange;
		var treeName=op.showVirtualOrg?'includeVirtualOrg':'org';
		op=$.extend({
			name : treeName,
			getParam:function(){
				return {a:1,b:1,orgRoot:'orgRoot'};
			},
			treeLeafOnly:false,
			searchName :'orgSelect',//快捷查询名称
			searchType :'sys',//快捷查询类别
			hasSearch  :true,//是否需要快捷查询
			checkboxIndex:'id',
			beforeChange:function(data){
				var flag = true;
				if(!Public.isBlank(filter)){
					var type=null;
					if($.isPlainObject(data)){
						type=data['orgKindId'];
					}else{
						type=$('input[name="orgKindId"]',data).val();
					}
					filter=$.isArray(filter)?filter:filter.split(',');
					flag= filter ? ($.inArray(type, filter) > -1) : false;
					if(!flag) return false;
				}
				if($.isFunction(beforeChange)){
					flag=beforeChange.call(this,data);
					if(flag===false) return false;
				}
				return true;
			},
			changeNodeIcon:function(data){
				var orgImagePath = web_app.name + "/themes/default/images/org/";
				switch (data.orgKindId) {
				case 'ogn':
					orgImagePath += "org";
					break;
				case 'dpt':
					orgImagePath += "dept";
					break;
				case 'pos':
					orgImagePath += "pos";
					break;
				case 'psm':
					orgImagePath += "personMember";
					break;
				case 'fld':
		            orgImagePath += "folder";
		            break;
		        case 'prj':
		            orgImagePath += "project";
		            break;
		        case 'grp':
		            orgImagePath += "group";
		            break;
		        case 'fun':
		            orgImagePath += "role";
		            break;
				}
				data.nodeIcon=orgImagePath+'.gif';
			}
		},op,{name : treeName});
		return this.treebox(op);
	};
	
	$.fn.remotebox = function(op){
		if (typeof op == "string") {
			return this.combox.call(this,arguments);
		}
		op=op||{};
		var param = {
			dictionary :op.name||'',
			filter:op.filter||''
		};	
		if(typeof op.param =='object'){//查询默认参数
			param=$.extend(param,op.param);
		}
		op=$.extend({
			mode : 'remote',
			url  : ComboxNamespace.dictionaryUrl,//默认查询地址
			queryDelay:1000,
			maxHeight:250,
			onDefaultSelected:ComboxNamespace.defaultSelected
		},op);
		op['param']=param;
		return this.combox(op);
	};
	
	$(document).bind('click',function(event){
		if($('#combox_droplist_wrap').is(':visible')){
			$.closeCombox();
		}
	});
	
	$(window).on('resize', function(){
		var div=$('#combox_droplist_wrap');
		if(div.is(':visible')){
			var obj=div.data("combox-object");
			if(!obj) return;
			obj.setListPosition();
		}
	});
	
	/**
		关闭控件方法，其中flag用于判断是否需要将返回控件的值赋值为原始值
	    控件赋值时flag被定义为true 将不会执行赋值为原始值的方法
	*/
	$.closeCombox=function(flag){
		flag=flag||false;
        var div=$('#combox_droplist_wrap').hide();
		if(!div.length) return;
		var obj=div.data("combox-object");
		if(!obj) return;
		obj=$(obj.input);
		var fn=obj.data('combox-close');
		if($.isFunction(fn)){
			fn.call(window);
		}
		fn=obj.data('tree-search-close');
		if($.isFunction(fn)){
			fn.call(window);
		}
		if(!flag){
			fn=obj.data('combox-before-close');
			if($.isFunction(fn)){
				fn.call(window);
			}
		}
		obj.removeData('combox-before-close');
		obj.removeData('combox-close');
		obj.removeData('tree-search-close');
		obj.blur();//2014-08-08 add 关闭显示层收不能光标离开
		div.removeData("combox-object");
	};

   /**
	 定义combox类型
	*/
	function combox(el,op){
		this.input = null;
		this.options={};
		this.formattedData=[];
		this.isExpanded = false;//是否打开
		this.set(op);
		this.isKeyQuery=false;//是否为键盘事件触发的查询
		this.disabled = false;
		this.isSelected=true;//是否选择数据
		this.init(el);
		$(el).data('ui-combox',this);
		$(el).addClass('ui-combox-element');
	}
	$.extend(combox.prototype, {
		set:function(op){
			this.options=$.extend({
				url       : null,//AJAX访问地址
				param     : {},//AJAX访问参数
				getParam  : null,//参数取值函数
				manageType:null,//查询使用的管理权限类别
				data      : null,//数据源JSON or 数组(第一项视为value,第二项视为text),如果对象本身为select,取option的数据,可以为function取值
				text	  : 'text',//JSON对象中key名称
				value     : 'value',//JSON对象中value名称
				dataListControl  : '#easySearchTableListData',
				callBackControls:{},//回调赋值控件 
				split     : ',',//多选数据分割符
				dataSortFunction:null,
				formatText: null,//格式化文本值
		        formatValue: null,//格式化数据值
				defaultIndex:null, //默认选中的项
				textIndex : null,//search模式lookup字段
				valueIndex: null,//search模式取值字段
				checkboxIndex:null,//search模式多选时关键字段
				cache     : true,//是否缓存数据(true,false)
				needSelectInput:false,//是否生成查询参数输入框
				mode      : 'local',//默认数据来源为本地(可选local:本地,remote:远程,search:远程查询(每次查询),tree 树查询)
				loading   : '<span class="loading">加载中...</span>',//AJAX访问提示内容
				noDataText: '没有匹配的选项',
				width	  : 'auto',//显示宽度
				height    : 'auto',//显示高度
				isOriginalValue:true,//关闭前将返回控件的值赋值为原始值
				maxHeight : 126,//最大显示高度
				checkbox  : false,//是否多选
				triggerEvent : 'click',//显示触发方法
				showToolbar : false,//是否显示工具栏
				reQuery   : false,//是否根据页面输入数据重新查询 true查询
				offset    : null,//显示位置
				getOffset : null,
				readOnly  : false,//控件是否只读默认false
				queryDelay: 0,//查询间隔时间 控制操作频繁度
				getViewWidth:null,
				onCustomMatch: null,//数据过滤执行方法
				onDefaultSelected:null,//默认选中方法
				onTrigger :null,//显示前触发执行方法
				afterShow:function(){},//显示后执行方法
				beforClose:function(){},//关闭前执行方法
				onSuccessed:null,//ajax查询执行后处理方法
				beforeChange: null,//数据改变前执行
		    	onChange: null,//数据改变后执行
				onClick:function(){},//显示区域点击事件
				onEnter:null
			},this.options, op||{});
			this.mode=this.options.mode;
			if(Map&&this.options.checkbox){
				this.selectDataMap=new Map();//多选时选中数据对象
			}
			if(this.options.back){
				this.options.callBackControls=this.options.back;
			}
			if(this.options.manageType){
				this.options.param[ComboxNamespace['manageType']]=this.options.manageType;
			}
		},
		init: function(el) {
			var opts = this.options,$el=$(el);
			if ($el.is('select')) {
				this.getDataFromSelect($el);
			}
			this.formatData();
			this.createCombox($el);
			this.bindEvent();	
		},
		getDataFromSelect: function($el) {//从select中获取数据
			var data = [];
			$.each($el.find('option'), function(i,o){
				data.push([$(o).attr('value'),$(o).text()]);
			});
			this.options.data=data;
		},
		createCombox: function($el){//创建控件
			var opts = this.options;
			if(!this.disabled){
				this.disabled=$el.is(':disabled')||$el.is('[readonly]');
			}
			this.input=$el;
			if($el.is('div.ui-combox-wrap')){
				this.input = $el.find('input.text');
				this.setDefaultSelected(this.input.val());
			}else if($el.parent().is('div.ui-combox-wrap')){
				this.input = $el;
				this.setDefaultSelected(this.input.val());
			}else if(!$el.hasClass('combox_button')){
				var width=$el.outerWidth();
				var display=$el.css('display');
				var combox_html=['<div class="ui-combox-wrap"  style="display:',display,';">','<span class="combo">','</span>','</div>'];
				var combox_wrap=$(combox_html.join('')).insertAfter($el);
				//combox_wrap.width(width);
				$el.hide();
				this.input =$('<input type="text" class="text"/>').prependTo(combox_wrap);
				this.input.attr({readOnly:opts.readOnly,id:$el.attr('name')+'_text',name:$el.attr('name')+'_text'});//.width(width);
				if($.isEmptyObject(opts.callBackControls)){//空对象时执行
					opts.callBackControls={text:this.input,value:$el};
				}
				this.setDefaultSelected($el.val());
			}else if($el.hasClass('special_combox')){//会议纪要模板扩展字段使用该样式
				var width=$el.outerWidth();
				var combox_html=['<span class="ui-combox-wrap" >','<span class="combo">','</span>','</span>'];
				var combox_wrap=$(combox_html.join('')).insertAfter($el);
				$el.hide();
				this.input =$('<input type="text" class="text"/>').prependTo(combox_wrap);
				this.input.width(width);
				this.input.attr({readOnly:opts.readOnly,id:$el.attr('name')+'_text',name:$el.attr('name')+'_text'});//.width(width);
				if($.isEmptyObject(opts.callBackControls)){//空对象时执行
					opts.callBackControls={text:this.input,value:$el};
				}
				this.setDefaultSelected($el.val());
			}
			if($.isFunction(opts.getInput)){
				this.input=opts.getInput.call(window);
			}
			this.input.addClass('ui-combox-input');
			if($el.isRequired()){
				this.input.addClass('ui-combox-required');
			}
			this.input.data('ui-combox-obj',this);
			if(!this.options.valueIndex){
				this.options.valueIndex=$el;
			}
			if(opts.lookUpValue||opts.fieldValue){
				this.setDefaultSelected({lookUpValue:opts.lookUpValue,value:opts.fieldValue});
			}
			if(this.disabled){
				this.disable();
			}
			
			//创建下拉对话框
			var droplist_wrap=this.getDroplistWrap();
			if(!droplist_wrap.length){
				var droplist_html=['<div class="toolbar">'];
				droplist_html.push('<span class="clear" title="清空">清空</span>');
				droplist_html.push('<span class="close" title="关闭">关闭</span>');
				droplist_html.push('</div>');
				droplist_html.push('<div class="gridQueryDiv">');
				droplist_html.push('<div class="ui-grid-query-div" style="position:relative;top:-2px;margin:0px;">');
				droplist_html.push('<input type="text" class="ui-grid-query-input"><span title="查询" class="ui-grid-query-button"></span>')
				droplist_html.push('</div></div>');
				droplist_html.push('<div class="droplist"></div>');
				droplist_wrap=$('<div id="combox_droplist_wrap" class="ui-droplist-wrap"></div>');
				droplist_wrap.html(droplist_html.join('')).appendTo('body');
				if($.fn.drag){
					droplist_wrap.drag({ handle: '.toolbar',opacity: 0.8,start:function(){
						droplist_wrap.addClass('ui_state_drag');
					},stop:function(){
						droplist_wrap.removeClass('ui_state_drag');
					}});
					$('.toolbar',droplist_wrap).css('cursor','move');
					var nwDrop=$('<div class="ui-btn-nw-drop"></div>').appendTo(droplist_wrap);
					droplist_wrap.find('div.droplist').drag({ handle: nwDrop,isResize:true,opacity: 0.8,start:function(){
						droplist_wrap.addClass('ui_state_drag').css({
							backgroundColor:'#eee',
							borderStyle:'dashed'
						});
					},
					stop:function(){
						droplist_wrap.removeClass('ui_state_drag').css({
							backgroundColor:'#fff',
							borderStyle:'solid'
						});
					},
					drag:function(){
						var width=droplist_wrap.find('div.droplist').width();
						droplist_wrap.find('div.toolbar').width(width);
						droplist_wrap.width(width);
						droplist_wrap.find('ul.l-tree').width(width);
						var dataListControl=$(opts.dataListControl);
						if(dataListControl.length>0){
							var tableWidth=parseInt(dataListControl.attr('pageWidth'));
							dataListControl.width(Math.max(tableWidth+2,width));
						}
					}});
				}else{
					$('.toolbar',droplist_wrap).css('cursor','default');
				}
				droplist_wrap.on('mousemove',function(e){
					if(droplist_wrap.hasClass('ui_state_drag')) return;
					var $clicked = $(e.target || e.srcElement);
					if($clicked.is('li')){
						if($clicked.hasClass('over')||$clicked.hasClass('seleced')) return false;
						$(this).find('li.over').removeClass('over');
						$clicked.addClass('over');
					}else{
						var tr= $clicked.parent('tr');
						if(tr.length==0 || !tr.hasClass('list') || tr.hasClass('over')||tr.hasClass('seleced')) return false;
						$(this).find('tr.over').removeClass('over');
						tr.addClass('over');
					}
					e.preventDefault();
					e.stopPropagation();
					return false;
				});
				//查询输入框事件
				droplist_wrap.find('input.ui-grid-query-input').keyup(function (e) {
		            var value = $(this).val();
		            if (value != '') {
		                var k = e.charCode || e.keyCode || e.which;
		                if (k == 13) {
		                    droplist_wrap.find('span.ui-grid-query-button').trigger('click');
		                }
		            }
		        });
			}
		},
	    getDroplistWrap: function(){
			return $('#combox_droplist_wrap');
		},
		getDroplist: function(){
			return $('#combox_droplist_wrap').find('div.droplist');
		},
		getText: function(){
			return this.input.val();
		},
		setText:function(text){
			this.input.val(text);
		},
		setValue: function(value){
			if(typeof value =='undefined'){
				if(this.options.valueIndex){
					value=$(this.options.valueIndex).val();
				}
			}
			if(this.options.checkbox&&this.selectDataMap){
				this.selectDataMap.clear();
			}
			this.setDefaultSelected(value);
		},
		triggerShow: function(){
			if(this.disabled){
				return;
			}
			this.input.focus();
			if(this.isExpanded){
				this.filter();
			} else {
				this.expand();
			}
		},
		inputFocus:function(){
			var _self=this;
			try{
				this.input.select();
			}catch(e){
				setTimeout(function(){
					var input=_self.input[0],r =input.createTextRange();  
					r.moveStart('character',input.value.length);  
					r.collapse(true);  
					r.select();  
				},0);
			}
		},
		getBeforeCloseFunction:function(fields){
			var vs=[];//采用闭包保存控件的原始值
			$.each(fields,function(i,o){vs.push($(o).val());});
			return function(){
				var ts=[];
				$.each(fields,function(i,o){ts.push($(o).val());});
				if(ts.join('')!=vs.join('')){//需要将返回控件的值赋值为原始值
					var tmp=0;
					$.each(fields,function(i,o){$(o).val(vs[tmp]);tmp++;});
				}
			};
		},
		bindEvent: function(){//绑定事件
			var opts = this.options,_self=this;
			//显示触发执行方法
			var _triggerShow=function(){
				if($.isFunction(_self.options.getParam)){//执行参数取值函数
					try{
						var tmp=_self.options.getParam.call(_self);
						if(tmp===false) return;
						_self.options.param=$.extend(_self.options.param,tmp);
					}catch(e){alert('参数取值函数执行错误:'+e.message);}
				}
				delete _self.options.param['intPage'];//默认分页查询条件为1
				_self.input.data("combox-close",function(){
					_self.isExpanded=false;
					if(!_self.isSelected){
						_self.clearControls();
					}
					if(_self.queryTimer){
						window.clearTimeout(_self.queryTimer);
					}
				});
				if(_self.options.checkbox){
					if(_self.mode=='search'){
						_self.initSearchSelectDataMap();
					}
				}
				_self.triggerShow();
			};
			//注册显示出发方法
			this.input.add(this.input.siblings('span')).on(opts.triggerEvent+'.combox',function(event){
				event.preventDefault();
				event.stopPropagation();
				if(_self.disabled){return;}
				try{$.datepicker.close();}catch(e){}
				if(_self.getDroplistWrap().is(':visible')){//对话框存在
					if($.data(_self.getDroplistWrap()[0], "combox-object")==_self){//且由当前控件触发
						//$.closeCombox(); // xx 2014-08-25 屏蔽
						return false;
					}
				}
				if(_self.options.reQuery){
					_self.options.param[ComboxNamespace['paramValue']]=encodeURI(_self.input.val());
				}else{
					_self.options.param[ComboxNamespace['paramValue']]='';
				}
				_self.input.removeData('combox-before-close');
				if(_self.options.isOriginalValue&&_self.isSelected){
					//注册关闭前执行方法，该方法用于关闭前将返回控件的值赋值为原始值
					_self.input.data("combox-before-close",_self.getBeforeCloseFunction(_self.options.callBackControls));
				}
				$.closeCombox();
				_self.isKeyQuery=false;
				_triggerShow();
				return false;
			});
			//绑定按键事件
			var KEY = {
				backSpace: 8,
				esc: 27,
				up: 38,
				down: 40,
				tab: 9,
				enter: 13,
				home: 36,
				end: 35,
				pageUp: 33,
				pageDown: 34,
				space: 32,
				deteleKey: 46
			};
			//按键事件
			this.input.on('keydown', function(e){
				if(_self.disabled){return;}
				if(opts.readOnly){
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
				var k =e.charCode||e.keyCode||e.which;
				switch (k) {
					case KEY.esc:
						_self.clearControls(true);//true 不关闭下拉框
						break ;
					case KEY.tab:
						//_self.collapse();
						break ;
					case KEY.down:
					case KEY.up:
						if(_self.isExpanded){
							_self.setItemFocus(e.keyCode == KEY.down);
						} else {
							delete opts.param[ComboxNamespace['paramValue']];
							delete opts.param[ComboxNamespace['intPage']];
							_triggerShow();
						}
						e.preventDefault();
						break ;
					
					case KEY.enter:
						if(_self.isExpanded){
							var item = _self.getDroplistWrap().find('.seleced');
							if(item.length > 0){
								_self.selectByItem(item);
								return;
							}
						}
						if($.isFunction(_self.options.onEnter)){//点击触发方法
							try{
								var el = $(e.target || e.srcElement);
								_self.options.onEnter.call(_self,el);
								_self.setDefaultSelected(el.val());
								_self.isSelected = (el.val() && el.val() != '');
								_self.input.data("combox-before-close",_self.getBeforeCloseFunction(_self.options.callBackControls));
								//关闭
								$('#combox_droplist_wrap').hide();
							}catch(e){alert('onEnter:'+e.message);}
						}
						if (e.ctrlKey) {
							if(_self.mode == 'search' || _self.mode == 'remote'){
								if(_self.queryTimer){
									window.clearTimeout(_self.queryTimer);
								}
								//默认enter执行AJAX查询
								var q = _self.input.val();
								opts.param['paramValue']=encodeURI(q);
								_self.isKeyQuery=true;//标志执行了按键查询
								_self.scrollPage(1);
							}else if(_self.mode == 'tree' ){
								var q = _self.input.val();
								_self.doQuery(q);
							}
							return false;
						}
						break ;

					case KEY.home:
					case KEY.end:
						if(_self.isExpanded){
							_self.scrollToItem(e.keyCode == KEY.home);
							e.preventDefault();
						}
						break ;
					
					case KEY.pageUp:
					case KEY.pageDown:
						if(_self.isExpanded){
							_self.scrollPage(e.keyCode == KEY.pageUp);
							e.preventDefault();
						}
						break ;
				}
				if(!_self.isExpanded&&!_self.isLocal()){//为打开选择框阻止输入 xx add 2014-08-08
					e.preventDefault();
					return false;
				}
			}).on('keyup',function(e){
				if(_self.disabled){return;}
				if(opts.readOnly){
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
				var k =e.charCode||e.keyCode||e.which;
			    //是否功能键
			    var isFuncKey = k == 8 || k == 9 || k == 13 || k == 27 || (k >= 16 && k <= 20) ||(k >= 33 && k <= 40) || 
			    				(k >= 44 && k <= 46) || (k >= 112 && k <= 123) || k == 144 || k == 145;
				var q = _self.input.val();
				if(q==''&&k!=KEY.backSpace&&k!=KEY.deteleKey){//Safari 浏览器存在自动触发keyup，这里处理存在按键事件但没有数据的情况
					return;
				}
				if (!isFuncKey || k == KEY.deteleKey || k == KEY.backSpace) {
					_self.isSelected=false;
					if(_self.isExpanded){
						_self.doDelayQuery(q);
					}else{
						if(_self.isLocal()){
							_triggerShow();
						}
					}
				};
			});
		},
		isLocal:function(){
			if(this.mode == 'local' || (this.mode == 'remote' && this.options.cache)){
				return true;
			}
			return false;
		},
		expand: function(){//展开下拉列表框
			var opts = this.options,_self=this;
			var droplist_wrap=this.getDroplistWrap(),droplist=$('div.droplist',droplist_wrap);
			if(opts.needSelectInput){
				droplist_wrap.find('input.ui-grid-query-input').val('');
			}
			//处理点击事件
			droplist_wrap.unbind('click').click(function(e){
				var $clicked = $(e.target || e.srcElement);
				if(opts.needSelectInput&&$clicked.hasClass('ui-grid-query-button')){
					var q=droplist_wrap.find('input.ui-grid-query-input').val();
					if(q!=''){
						opts.param['paramValue']=encodeURI(q);
						_self.isKeyQuery=true;//标志执行了按键查询
						_self.scrollPage(1);
					}
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
				_self.onDropListClick.call(_self,$clicked);//点击触发事件
				e.preventDefault();
				e.stopPropagation();
				return false;
			}).data("combox-object", this);
			var _show=function(){//显示下拉对话框,调用回调方法
				_self.isExpanded=true;
				droplist_wrap.show();
				//_self.setListLayout();
				_self.setListPosition();
				opts.afterShow.call(window,droplist);//显示后回调
			};
			switch (this.mode) {
			   case 'local' ://加载本地数据
					if(_self.isCached()){
						_self.formatData();//格式化数据
					}
					_self.populateList();
					_show();
				    break;
			   case 'remote'://通过AJAX加载数据
					if(_self.isCached()){
						_self.loadAjaxData('json',function(d){
							Public.ajaxCallback(d,function(data){
								if($.isFunction(opts.onSuccessed)){
									data = opts.onSuccessed.call(_self,data);
									if(data===false) return false;
								}
								_self.formatData(data);//格式化数据
								_self.populateList();
								if(opts.checkbox){
									_self.initSelectDataMap();
								}
								_show();
							});
						});
					}else{
						_self.populateList();
						_show();
					}
				    break;
			   case 'search'://快捷查询控件
					_self.loadAjaxData('text',function(data){
						if($.isFunction(opts.onSuccessed)){
							data = opts.onSuccessed.call(_self,data);
							if(data===false) return false;
						}
						droplist.html(data);
						_self.setSelectedClass();
						setTimeout(function(){_self.setListLayout();_show();},0);
						_self.autoComplete();
					});
				    break;
			   case 'tree'://树
				   _self.setTree(opts.tree,_show);
				   break;
			   default :
				    alert('数据来源无法解析!');
				    return;
			} 
		},
		valueExists:function(a, v) {
			a=$.isArray(a)?a:(a+'').split(this.options.split);
			return a ? ($.inArray((v+''), a) > -1) : false;
		},
		populateList:function(data){//填充显示数据
			data=data||this.formattedData;
			var _self = this, opts = _self.options;
			if($.isFunction(opts.onTrigger)){//调用显示前触发执行方法
				data=opts.onTrigger.call(_self,data);
			}
			var droplist=this.getDroplist();
			if(data.length == 0){
				$('<div class="tips"/>').html(opts.noDataText).appendTo(droplist.empty());
			} else{
				var value=$(opts.valueIndex).val(),
				className='',checkboxHtml='',labelText='',isExists=false;
				var html=['<ul class="ui-droplist-data">'];
				var liHtml='<li key="{key}" title="{text}" {class}>{checkbox}{labelText}</li>';
				$.each(data,function(i,o){
					isExists=($.trim(value)!=''&&_self.valueExists(value,o.value));
					className=isExists?'class="seleced"':'';
					if(opts.checkbox&&o.text!=''){
						checkboxHtml='<input type="checkbox"'+(isExists?' checked="true"':'')+'/>';
						labelText='<label>'+o.text+'</label>';
					}else{
						checkboxHtml='';
						labelText=o.text;
					}
					html.push(liHtml.replace('{text}',o.text)
		                    .replace('{key}',o.value)
		                    .replace('{class}',className)
		                    .replace('{checkbox}',checkboxHtml)
		                    .replace('{labelText}',labelText));
				});
				html.push('</ul>');
				droplist.html(html.join(''));
			}
			this.setListLayout();
			if(!opts.checkbox){//单选才执行
				this.autoComplete();//自动完成
				//自动定位
				setTimeout(function(){
					var item=droplist.find('li.seleced');
					if(item.length>0){
						_self.scrollToItem(item);
					}
				},0);
			}
		},
		setListLayout: function(){
			var droplist_wrap=this.getDroplistWrap(),droplist=$('div.droplist',droplist_wrap),toolbar=$('div.toolbar',droplist_wrap);
			var opts = this.options,height = parseInt(opts.height),width=opts.width,originListH,maxHeight=parseInt(opts.maxHeight);
			var isVisible=droplist_wrap.is(':visible'),diffHeight=0;
			if($.isFunction(opts.getViewWidth)){
				width=opts.getViewWidth.call(this);
			}
			droplist.css('overflow','hidden');
			//重置显示高度
			droplist_wrap.width('auto');
			droplist.height('auto');
			if(!isVisible){
				droplist_wrap.css({top:100,left:100}).show();//为了获取list高度显示一下
				this.isExpanded = true;
			}
			var dataListControl=$(opts.dataListControl);
			if(dataListControl.length>0){
				var tableWidth=parseInt(dataListControl.attr('pageWidth'));
				if(this.options.checkbox){
					tableWidth+=20;
				}
				if(isNaN(parseInt(width))){
					width=tableWidth;
					if(!isNaN(parseInt(width))){
						opts.width=width;
					}
				}
				dataListControl.width(tableWidth+5);
				if(width<tableWidth){
					diffHeight=20;
				}
				width+=7;
			}
			//显示宽度
			if(isNaN(parseInt(width))){
				width=this.input.outerWidth();
			}//alert(this.input.outerWidth());
			toolbar.css({width:width+2})[opts.showToolbar?'show':'hide']();
			$('div.gridQueryDiv',droplist_wrap)[opts.needSelectInput?'show':'hide']();
			droplist.css({width:width+2});
			droplist_wrap.css({width:width+2,zIndex:'100001'});
			originListH = droplist.height()+diffHeight;
			if(this.mode!='tree'){//不是树结构重新计算高度
				//设高
				if(!isNaN(height) && height >= 0){
					height = Math.min(height, originListH);
				}else{
					height=originListH;
				}
				if(!isNaN(maxHeight)&&height>maxHeight){
					height=maxHeight;
				}
			}
			droplist.css({overflow:'auto',height:height});
			if(!isVisible){
				droplist_wrap.hide();
				this.isExpanded = false;
			}
		},
		setListPosition: function() {//设置显示位置
			//if(!this.isExpanded){return ;}
			var droplist_wrap=this.getDroplistWrap();
			var opts = this.options,width=opts.width;
			var scrollTop=$(document).scrollTop();
			if($.isFunction(opts.getViewWidth)){
				width=opts.getViewWidth.call(this);
			}
			if($.isFunction(opts.getOffset)){
				try{opts.offset=opts.getOffset.call(window);}catch(e){alert('显示位置读取函数调用错误!'+e.message);}
			}else{
				if(this.input.is(':hidden')){
					$.closeCombox();
					return;
				}
				var of=this.input.parent().offset(),_height=this.input.parent().outerHeight();
				opts['offset']={top:of.top+_height+1,left:of.left};
			}
			if(isNaN(parseInt(width))){
				width=this.input.outerWidth();
			}
			//若下拉框大小超过当前document边框
			var tw=opts.offset.left+width+2,dw=$(window).width();
			//下拉内容向左展现
			if(tw > dw){
				opts.offset.left=dw-width-10;
			}
			//下拉内容向上展现
			var th=opts.offset.top+droplist_wrap.height()+2,dh = $(window).height()+scrollTop;
			if(th > (dh+10)){
				if(opts.offset.top-droplist_wrap.height()-_height-10>scrollTop){//判读不操作上边框
					opts.offset.top=opts.offset.top-droplist_wrap.height()-_height-10;
				}
			}
			droplist_wrap.css({top:opts.offset.top,left:opts.offset.left});
		},
		isCached:function(){//判断是否缓存数据
			return !this.options.cache||this.formattedData.length==0;
		},
		formatData: function(data){//格式化显示数据
			var datas =data||this.options.data,formattedData=[],opts = this.options;
			if(!datas) {return;}
			if(typeof datas =='string'){
				try{datas=eval('('+datas+')');}catch(e){alert('datas数据读取出错!');return;}
			}else if($.isFunction(datas)){
				try{datas=datas.call(this);}catch(e){alert('datas数据读取出错!');return;}
			}
			try{
				if($.isArray(datas)){//datas 是数组
					$.each(datas,function(i,o){
						if($.isArray(o)){//o为array 数组 (第一项视为value,第二项视为text)
							//[[1,'a'],[2,'b'],[3,'c']]
							formattedData.push({
								text : $.isFunction(opts.formatText) ? opts.formatText(o[1]) : o[1],
								value : $.isFunction(opts.formatValue) ? opts.formatValue(o[0]) : o[0]
							});
						}else{
							if(o[opts.text]){//o 为json对象 [{value:'1',text:'a'},{value:'2',text:'b'},{value:'3',text:'c'}]
								formattedData.push({
									text : $.isFunction(opts.formatText) ? opts.formatText(o[opts.text]) : o[opts.text],
									value : $.isFunction(opts.formatValue) ? opts.formatValue(o[opts.value]) : o[opts.value]
								});
							}else{// 满足[1,2,3,4]
								formattedData.push({
									text : $.isFunction(opts.formatText) ? opts.formatText(o) : o,
									value : $.isFunction(opts.formatValue) ? opts.formatValue(o) : o
								});
							}
						}
					});
				}else{//datas 是json对象 {1:'a',2:'b',3:'c'}
					$.each(datas,function(i,o){
						formattedData.push({
							text : $.isFunction(opts.formatText) ? opts.formatText(o) : o,
							value : $.isFunction(opts.formatValue) ? opts.formatValue(i) : i
						});
					});
				}
			}catch(e){
				alert('datas数据读取出错!');return;
			}
			if($.isFunction(opts.dataSortFunction)){
				formattedData.sort(opts.dataSortFunction);                   
			}
			this.formattedData=formattedData;
		},
		loadAjaxData : function(dataType,callBack){//通过AJAX加载数据
			var droplist_wrap=this.getDroplistWrap(),droplist=$('div.droplist',droplist_wrap);
			var _self = this, opts = _self.options,loading = $(opts.loading);
			droplist.empty().append(loading);
			droplist_wrap.show();
			this.setListLayout();
			this.setListPosition();
			//alert($.toJSON(opts.param));
			opts.param['isMultipleSelect']=opts.checkbox;
			$.ajax({
				url:web_app.name+ opts.url,
				type: 'post',
				data: opts.param,
				dataType: dataType,
				success: function(data){
					loading.remove();
					callBack.call(_self,data);
				},
				error: function(){
					loading.remove();
					$('<div class="tips"/>').text('数据加载失败').appendTo(droplist);
					_self.setListPosition();
				}
			});
		},
		collapse: function(flag) {//收起下拉列表
			if(!this.isExpanded){ return ; }
			var opts = this.options;
			if($.isFunction(opts.beforClose)){
				var falg=opts.beforClose.call(this);
				if(falg===false) {return;}
			}
			this.isExpanded = false;
			$.closeCombox(flag);
			this.input.blur();
		},
		setItemFocus: function(direction){//设置选中栏目 down==true
			var opts = this.options, idx;
			var listItems=this.getListItems();
			if (listItems.length == 0) {return ;}
			var focusItem = listItems.filter('.over').eq(0);
			if (focusItem.length == 0) {
				focusItem = listItems.filter('.seleced').eq(0);
			}
			if (focusItem.length == 0) {
				idx  = 0;
			} else {
				idx = listItems.index(focusItem);
				if (direction) {
					if(this.isLocal()){
						idx = (idx == listItems.length - 1) ? 0 : idx + 1;  
					}else{
						idx+=1;
					}
				} else {
					if(this.isLocal()){
						idx = idx == 0 ? listItems.length - 1 : idx - 1;
					}else{
						idx-=1;
					}
				}
			}
			listItems.removeClass('seleced').removeClass('over');
			if(idx>-1&&idx<listItems.length){
				var item = $(listItems.eq(idx));
				item.addClass('seleced');
				this.scrollToItem(item);
			}
		},
		scrollToItem: function(item){//如不在可视区内，使选中项可视
			var droplist=this.getDroplist();
			if(typeof item =='boolean') {
				var listItems=this.getListItems();
				if (listItems.length == 0) {return ;}
				item=item?listItems.eq(0):listItems.filter(':last');
			}
			var position=$(item).position();
			if(!item||!position){droplist.scrollTop(0);return;}
			var viewTop = droplist.scrollTop();
			var itemTop = viewTop + position.top;
			var viewBottom = viewTop + droplist.height();
			var itemBottom = itemTop + item.outerHeight();
			if(itemTop < viewTop || itemBottom > viewBottom){
				droplist.scrollTop(itemTop);
			}
		},
		getListItems:function(){//获取显示区域全部待选栏目
			var droplist=this.getDroplist(),listItems;
			if(droplist.find('table').length>0){//下拉框中是表格
				listItems=droplist.find('tr.list');
			}else if(droplist.find('ul.ui-droplist-data').length>0){//li
				listItems=droplist.find('li');
			}else{
				return [];
			}
			return listItems;
		},
		filter: function(value){//本地数据过滤，根据条件显示本地已缓存的数据
			value = typeof value == 'undefined' ? '' : value;
			var opts = this.options, self = this,filterData=[];
			if(!$.isArray(this.formattedData)){return ;}
			if(value == ''){
				filterData = this.formattedData;
			} else {
				$.each(self.formattedData, function(idx, item){
					if($.isFunction(opts.onCustomMatch)){//调用数据过滤方法
						if(!opts.onCustomMatch(item.text,value)){
							return ;
						}
					} else{//使用正则表达式过滤数据
						value=value.toLowerCase();
						var reg = new RegExp(value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), '');
						if(item.text.toLowerCase().search(reg) == -1){
							if($.chineseLetter){//增加中文转拼音支持
								var chineseLetter=$.chineseLetter(item.text);
								if(chineseLetter.toLowerCase().search(reg) == -1){
									return;
								}
							}else{
								return ;
							}
						}
					}
					filterData.push(item);
				});
			}
			this.populateList(filterData);
		},
		doDelayQuery: function(value){//延迟查询，显示查询结果
			var _self = this, opts = _self.options, delay = parseInt(opts.queryDelay);
			if(isNaN(delay)){
				delay = 0;
			}
			if(_self.queryTimer){
				window.clearTimeout(_self.queryTimer);
			}
			_self.queryTimer = window.setTimeout(function(){
				_self.doQuery(value);
			},delay);
			this.isKeyQuery=true;
		},
		doQuery: function(value){
			var _self=this,opts=this.options;
			if(this.isLocal()){
				this.filter(value);
			} else if(this.mode == 'search'){//访问后台的查询
				if(opts.hasSearch&&value==''){//回到树结构
					$.closeCombox(true);
					this.input.triggerHandler(opts.triggerEvent+'.combox');
				}else{
					opts.param[ComboxNamespace['paramValue']]=encodeURI(value);
					this.isKeyQuery=false;//暂不执行自动补全
					this.scrollPage(1);
				}
			} else if(this.mode=='tree'){//树查询
				if(opts.hasSearch&&value!=''){//使用快捷查询结构
					var treeUrl=opts.url,maxHeight=opts.maxHeight,height=opts.height;
					opts.param[ComboxNamespace['searchQueryName']]=opts.searchName||opts.name;//查询名称
					opts.param[ComboxNamespace['pageSize']]=opts.pageSize||12;//页面显示数据条数
					opts.param[ComboxNamespace['searchConfigType']]=opts.searchType||'tree';//查询类别
					opts.param[ComboxNamespace['paramValue']]=encodeURI(value);
					if(opts.manageType){
						opts.param[ComboxNamespace['manageType']]=opts.manageType;
					}
					opts.maxHeight=300;
					opts.height='auto';
					opts.url=ComboxNamespace.searchUrl;
					this.mode='search';
					this.isKeyQuery=false;//标志执行了按键查询
					if($.isFunction(opts.getParam)){//执行参数取值函数
						try{
							var tmp=opts.getParam.call(this);
							if(tmp===false) return;
							opts.param=$.extend(opts.param,tmp);
						}catch(e){alert('参数取值函数执行错误:'+e.message);}
					}
					this.scrollPage(1);
					this.input.data("tree-search-close",function(){
						delete opts.param[ComboxNamespace['searchQueryName']];
						delete opts.param[ComboxNamespace['pageSize']];
						delete opts.param[ComboxNamespace['searchConfigType']];
						delete opts.param[ComboxNamespace['paramValue']];
						_self.mode='tree';
						opts.url=treeUrl;
						opts.maxHeight=maxHeight;
						opts.height=height;
					});
				}
			}
		},
		scrollPage: function(flag){//设置选中栏目 down==true
			var _self = this, opts = _self.options;
			var page=parseInt(opts.param[ComboxNamespace['intPage']]);
			page=isNaN(page)?1:page;
			page=page<1?1:page;
			if(typeof flag=='boolean'){
				page+=flag?-1:1;
				var sunPage=parseInt($(opts.dataListControl).attr('pageCount'));
				if(!isNaN(page)&&page>sunPage) return;
				if(page==0) return;
			}else{
				page=flag;
			}
			opts.param[ComboxNamespace['intPage']]=page;
			this.expand();
		},
		getSearchBoxField:function(p,item){
			var opts = this.options;
			var field=$('input[name="'+p+'"]',item);
			/***为扩展字段中lookup添加以下代码 在不指定callBackControls时使用***/
			//匹配 textIndex:'fieldCname',valueIndex:'defineId' 情况
			if(opts[p+'Index']){
				if(field.length==0) field=$('input[name="'+opts[p+'Index']+'"]',item);
			}
			//匹配未指定任何返回属性情况
			if(field.length==0){
				if(p=='text'){
					field=$('input[flag="1"]:first',item);
				}else if(p=='value'){
					field=$('input[flag="0"]:first',item);
				}
			}
			/***end***/
			return field;
		},
		selectByItem: function(item,alwaysOn){//为回调控件赋值 alwaysOn==true 不关闭控件
			var opts = this.options,values={},_self=this;
			var nodeData={};
			if($.isPlainObject(item)){
				$.each(opts.callBackControls,function(p,o){
					if(typeof item[p]=='undefined'){
						return;
					}
					$(o).val(item[p]||'');
					values[p]=item[p]||'';
				});
				nodeData=item['nodeData']||{};
			}else{
				if($.isFunction(opts.beforeChange)){//原始数据作为参数回调
					if(opts.beforeChange.call(this,item)===false){
						return ;
					}
				}
				if(item.is('tr')){
					$.each(opts.callBackControls,function(p,o){
						var field=_self.getSearchBoxField(p,item);
						if(field.length>0){
							if($(o).length>0){
								$(o).val(field.val());
							}
							values[p]=field.val();
						}
					});
					item.find('input').each(function(){
						var name=$(this).attr('name'),val=$(this).val();
						nodeData[name]=val;
					});
				}else if(item.is('li')){
					if(opts.callBackControls.text){
						$(opts.callBackControls.text).val(item.text());
					}
					if(opts.callBackControls.value){
						$(opts.callBackControls.value).val(item.attr('key'));
					}
					values['text']=item.text();
					values['value']=item.attr('key');
					nodeData=values;
				}
			}
			if($.isFunction(opts.onChange)){
				opts.onChange.call(this,values,nodeData);
			}
			//alwaysOn==true 不关闭控件
			if(alwaysOn===true){
				if(opts.isOriginalValue){
					this.input.data("combox-before-close",this.getBeforeCloseFunction(opts.callBackControls));
				}
				return;
			}
			this.isSelected=true;
			this.collapse(true);
			this.inputFocus();
			this.input.triggerHandler('keydown.gridEditors',[true]);//定义在扩展GRID的编辑器中
		},
		clearControls: function(flag){//清空回调控件数据 
			var opts = this.options,values={};
			$.each(this.options.callBackControls,function(p,o){
				if($(o).length>0){
					if(opts.isOriginalValue){
						$(o).val('');
					}
				}
				values[p]='';
			});
			if($.isFunction(opts.onChange)){
				opts.onChange.call(this,values,{});
			}
			if(opts.checkbox&&this.selectDataMap){
				this.selectDataMap.clear();
			}
			//flag===true 不关闭下拉框
			if(flag===true){
				if(opts.isOriginalValue){
					this.input.data("combox-before-close",function(fields){
						return function(){
							$.each(fields,function(i,o){$(o).val('');});
						};
					}(this.options.callBackControls));
				}
				return;
			}
			this.collapse(true);
			this.isSelected=true;
			this.input.focus();
			this.input.triggerHandler('keydown.gridEditors',[true]);
		},
		onDropListClick:function(el){//下拉框点击事件
			//关闭
            if(el.is('span.close')){
				this.collapse();
			}
			//清空
			if(el.is('span.clear')){
				this.clearControls();
			}
			//翻页
			if(el.is('span.doPage')){
				this.scrollPage(el.attr('intpage'));
			}
			if(el.is('td.pager-td')){
				return;
			}
			if(this.options.checkbox){//复选
				var isCheckbox=el.is(':checkbox');
				if(el.is('label')||el.is(':checkbox')){
					el=el.parent();
				}
				if(el.is('li')){
					this.multiSelect(el,isCheckbox);
				}
				if(el.is('td')){
					this.multiSelect(el.parent(),isCheckbox);
				}
			}else{//单选
				//tr 列选择
				if(el.is('td')){
					this.selectByItem(el.parent());
				}
				//li 列选择
				if(el.is('li')){
					this.selectByItem(el);
				}
			}
			if($.isFunction(this.options.onClick)){//点击触发方法
				try{
					this.options.onClick.call(this,el);
				}catch(e){alert('onClik:'+e.message);}
			}
		},
		setDefaultSelected: function(value){//设置默认选中
			var opts = this.options,_self = this;
			if ($.isFunction(opts.onDefaultSelected)) {
				value = opts.onDefaultSelected.call(this,value);
			}
			if(value===false){return;}
			if(opts.checkbox){
				$.each(this.formattedData,function(i,o){
					if(_self.valueExists(value,o.value)){
						_self.selectDataMap.put(o.value,{text:o.text,value:o.value});
					}
				});
				this.formatSelectDataMap();
			}else{
				if(value===''){
					$(opts.callBackControls.text).val('');
					$(opts.callBackControls.value).val('');
				}
				$.each(this.formattedData,function(i,o){
					if(o.text===value||(o.value+'')===(value+'')){
						if(opts.callBackControls.text){
							$(opts.callBackControls.text).val(o.text);
						}
						if(opts.callBackControls.value){
							$(opts.callBackControls.value).val(o.value);
						}
						return false;
					}
				});
			}
			
		},
	    autoComplete:function(){//只有一条记录默认选中
			var opts = this.options,_self = this;
			var _clearAutoCompleteTime=function(){
				if(_self.autoCompleteTimer){
					window.clearTimeout(_self.autoCompleteTimer);
				}
				_self.autoCompleteTimer=null;
			};
			if(_self.isKeyQuery===true){
				_clearAutoCompleteTime();
				var table=$(opts.dataListControl);
				if(table.length>0){
					var count=table.attr('dataCount');
					if(parseInt(count)==1){
						_self.autoCompleteTimer=setTimeout(function(){
							_self.selectByItem(table.find('tr.list'));
							_self.input.blur();
						},500);
					}else{
						_clearAutoCompleteTime();
					}
				}else{
					var li=_self.getDroplist().find('li');
					if(li.length==1){
						_self.autoCompleteTimer=setTimeout(function(){
							_self.selectByItem(li);
							_self.input.blur();
						},500);
					}else{
						_clearAutoCompleteTime();
					}
				}
			}
		},
		enable: function() {
			this.disabled = false;
			var td=this.input.parent().parent('td.edit');
			if(td.length>0){
				td.removeClass('disable');
			}
			var optReadonly=this.options.readOnly;
			if(!optReadonly){
				this.input.removeAttr('readonly');
			}else{
				this.input.attr('readonly',true);
			}
			this.input.removeClass('textReadonly');
			this.input.next('span').show();
		},
		disable: function() {
			this.disabled = true;
			var td=this.input.parent().parent('td.edit');
			if(td.length>0){
				td.addClass('disable');
			}
			this.input.attr('readonly',true).addClass('textReadonly');
			this.input.next('span').hide();
		},
		getFormattedData:function(){
			return this.formattedData;
		},
		getJSONData:function(){
			var json={};
			$.each(this.formattedData,function(i,o){
				if(o.value!=''){
					json[o.value]=o.text;
				}
			});
			return json;
		},
		setTree: function (treeObj,_show){
			var droplist_wrap=this.getDroplistWrap(),droplist=$('div.droplist',droplist_wrap);
			droplist.find('ul.l-tree').removeAllNode();
			droplist.empty();
			if(!$.fn.ligerTree||!treeObj){
				$('<div class="tips"/>').text('请引入树结构插件').appendTo(droplist);
				this.setListLayout();
				_show();
				return;
			}
			var tree= null;
			//2015-05-12 增加判读 treeObj对象引用问题
			if(treeObj.url){
				tree=treeObj;
			}else{
				//tree对象只拷贝treeObj属性内容不产生引用
				tree= $.extend(true,{},treeObj);
			}
            var _self = this, opts = this.options;
            if (tree.checkbox != false){
                tree.onCheck = function (){
                    var nodes = _self.treeManager.getChecked();
                    var value = [],text = [],_tree=this;
                    $(nodes).each(function (i, node){
                    	if (opts.treeLeafOnly && _tree.hasChildren(node.data)) return;
                    	if($.isFunction(opts.beforeChange)){
            				if(opts.beforeChange.call(this,node.data)===false){
            					return;
            				}
            			}
                        value.push(node.data[tree.idFieldName]);
                        text.push(node.data[tree.textFieldName]);
                    });
                    _self.selectByItem({text:text.join(opts.split),value:value.join(opts.split)},true);
                };
            }else{
                tree.onSelect = function (node){
                	if (opts.treeLeafOnly && this.hasChildren(node.data)) return;
                	if($.isFunction(opts.beforeChange)){
        				if(opts.beforeChange.call(this,node.data)===false){
        					return;
        				}
        			}
    				_self.selectByItem({text:node.data[tree.textFieldName],value:node.data[tree.idFieldName],nodeData:node.data});
                };
            }
            tree.onAfterAppend = function (domnode, nodedata){
                if (!_self.treeManager) return;
                if(tree.checkbox&&opts.valueIndex&&$(opts.valueIndex).length>0){
                	var value = $(opts.valueIndex).val(),_treeSelf=this;
                	var valuelist = value.toString().split(opts.split);
                    $(valuelist).each(function (i, item){
                    	_treeSelf.selectNode(item.toString());
                    });
                }
                if(tree.url){
                	_self.tree.width(droplist.width());
                	//_self.setListPosition();
                }
            };
            if($.isFunction(_self.options.getParam)){//执行参数取值函数
				try{
					var tmp=_self.options.getParam.call(_self);
					if(tmp===false) return;
					tree.param=$.extend(tree.param,tmp);
				}catch(e){alert('参数取值函数执行错误:'+e.message);}
			}
            _self.tree = $("<ul style='clear:both;'></ul>").appendTo(droplist);
            _self.tree.ligerTree(tree);
            _self.treeManager = _self.tree.ligerGetTreeManager();
            _self.setListLayout();
			_show();
		},
		multiSelect:function(item,isCheckbox){
			var checked=false,checkbox=item.find('input:checkbox'),
			values={}, _self = this, opts = this.options;
			if(isCheckbox){
				checked=checkbox.is(':checked');
			}else{
				checked=!checkbox.is(':checked');
			}
			if(item.is('li')){
				values['text']=item.text();
				values['value']=item.attr('key');
				this.selectDataMap[checked?'put':'remove'](values['value'],values);
			}else if(item.is('tr')){
				var checkboxIndex=opts.checkboxIndex,checkboxField;
				if(!checkboxIndex){
					alert('请确认checkboxIndex字段');
					return;
				}
				checkboxField=$('input[name="'+checkboxIndex+'"]',item);
				if(checkboxField.length==0){
					alert('请确认'+checkboxIndex+'字段是否存在!');
					return;
				}
				$.each(opts.callBackControls,function(p,o){
					var field=_self.getSearchBoxField(p,item);
					if(!!field.length){
						values[p]=field.val();
					}
				});
				this.selectDataMap[checked?'put':'remove'](checkboxField.val(),values);
			}
			if(checked){
				setTimeout(function(){checkbox.attr('checked',true);},0);
				item.addClass('seleced');
			}else{
				setTimeout(function(){checkbox.removeAttr('checked');},0);
				item.removeClass('seleced');
			}
			this.formatSelectDataMap();
			this.inputFocus();
		},
		formatSelectDataMap:function(){
			var datas={},opts = this.options;
			this.selectDataMap.each(function(key,value){
				$.each(value,function(k,v){
					if(datas[k]){
						datas[k].push(v);
					}else{
						datas[k]=[v];
					}
				});
			});
			$.each(datas,function(k,v){
				datas[k]=v.join(opts.split);
			});
			if($.isEmptyObject(datas)){
				datas={text:'',value:''};
			}
			this.selectByItem(datas,true);
		},
		setSelectedClass:function(){//初始化选中状态
			var _self = this, opts = this.options;
			if(!opts.valueIndex||!opts.checkboxIndex||$(opts.valueIndex).length==0){
				return;
			}
			var table=$(opts.dataListControl),value=$(opts.valueIndex).val();
			table.find('tr.list').each(function(){
				checkboxField=$('input[name="'+opts.checkboxIndex+'"]',this);
				if(checkboxField.length>0&&_self.valueExists(value,checkboxField.val())){
					$(this).addClass('seleced');
					if(opts.checkbox){
						$(this).find('input:checkbox').attr('checked',true);
					}
				}
			});
		},
		initSearchSelectDataMap:function(){//search模式多选时初始化选中数据
			var _self = this, opts = this.options;
			if(!opts.valueIndex||!opts.checkboxIndex||$(opts.valueIndex).length==0){
				return;
			}
			this.selectDataMap.clear();
			var checkboxIndex=opts.checkboxIndex,values=$(opts.valueIndex).val();
			if($.trim(values)==''){
				return;
			}
			values=values.split(opts.split);
			var valueDatas={},keys=[];
			$.each(opts.callBackControls,function(p,o){
				valueDatas[p]=$(o).val().split(opts.split);
				keys.push(p);
			});
			$.each(values,function(i,k){
				var data={};
				$.each(keys,function(j,p){
					data[p]=valueDatas[p][i];
				});
				_self.selectDataMap.put(k,data);
			});
		},
		initSelectDataMap:function(){//远程加载是初始化选中map
			var _self = this,value=$(this.options.valueIndex).val();
			this.selectDataMap.clear();
			if($.trim(value)==''){
				return;
			}
			$.each(_self.formattedData,function(i,o){
				if(_self.valueExists(value,o.value)){
					_self.selectDataMap.put(o.value,{text:o.text,value:o.value});
				}
			});
		},
		setData:function(data){
			this.options.data=data;
			this.formatData();
		}
	});

	$.combox={
		authentication:function(node){
			try{
				var managerPermissionFlag=node['managerPermissionFlag'];
				if(managerPermissionFlag===false){
					return false;
				}
				return true;
			}catch(e){
				return true;
			}
		}
	};
})(jQuery);