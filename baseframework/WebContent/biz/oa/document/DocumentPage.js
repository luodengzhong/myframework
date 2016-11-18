var personPowerAuth={};//权限缓存
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight(function(pageSize){
		$('#showDocumentLibraryFile').height($('#layoutCenter').height()-30);
		$('#showDocumentFileDiv').height($('#layoutCenter').height());
		$('#divTreeArea').height(pageSize.h - 95);	
	});
	initializeUI();
	initializeButton();
	initDocumentLibrary();
	clearViewHandler();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 230,heightDiff : -5,allowTopResize:false,onSizeChanged:function(){
		$('#showDocumentLibraryFile').height($('#layoutCenter').height()-30);
		$('#showDocumentFileDiv').height($('#layoutCenter').height());
	}});
	$('#showDocumentLibraryFile').height($('#layoutCenter').height()-30);
	$('#showDocumentFileDiv').height($('#layoutCenter').height());
	
	$('#view_handle').on('change',function(){
		setTimeout(viewHandleChange,10);
	});
	//事件上提注册点击事件(中间布局单击事件)
	$('div.l-layout-center').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.hasClass('document-library-link')){//导航菜单上的链接
			documentLibraryLinkChange($clicked.attr('id'));
			return false;
		}else if($clicked.is('img.item-folder')){//文件夹图标
			documentLibraryLinkChange($clicked.parents('.file-item-wrapper').attr('id'));
			return false;
		}else if($clicked.hasClass('item-name')){
			var parent=$clicked.parents('.file-item-wrapper');
			var id=parent.attr('id'),type=parent.attr('type');
			if(type=='DIR'){
				documentLibraryLinkChange(id);
			}else if(type='FILE'){
				documentFileLinkShow(id);
			}
			return false;
		}else if($clicked.hasClass('item-file')){//文件
			documentFileLinkShow($clicked.parents('.file-item-wrapper').attr('id'));
			return false;
		}else if($clicked.is('div.item-folder')){//文件
			documentFileLinkShow($clicked.parents('.file-item-wrapper').attr('id'));
			return false;
		}
	});
}

function getDocumentLibraryId(){
	var documentLibraryId=$('#chooseDocumentLibraryId').val();
	return documentLibraryId;
}

function initializeButton(){
	//上传按钮
	AttachmentUtil.registerUploadButton($('#addNewFile'),{
		afterUpload:function(data){
			viewHandleChange();
		},
		beforChoose:function(){
			var documentLibraryId=getDocumentLibraryId();
			if(documentLibraryId==''){
				Public.tip('请选择要操作的文件夹!');
				return false;
			}
		},
		onInit:function(){
			 var pick=this.element.find('div.webuploader-pick');
			 pick.css({left:-20,width:70}).show();
		},
		getParam:function(){
			var documentLibraryId=getDocumentLibraryId();
			return {bizCode:'document',bizId:documentLibraryId,backurl:'oaDocumentAction!saveDocumentFile.ajax'};
		}
	});
	//搜索按钮
	$('#queryByDetail').on('click',function(){
		var documentLibraryId=getDocumentLibraryId();
		if(documentLibraryId!=''&&documentLibraryId!='share'){
			showQueryDocumentDialog({queryLibraryId:documentLibraryId});
		}else{
			Public.tip('请选择要操作的文件夹!');
			return false;
		}
	});
	
	//文件批量上传
	$('#addNewFileByFtp').on('click',function(){
		var documentLibraryId=getDocumentLibraryId();
		if(documentLibraryId==''){
			Public.tip('请选择要操作的文件夹!');
			return false;
		}
		/*var param= {bizCode:'document',bizId:documentLibraryId};
		param['queryFileUrl']='oaDocumentAction!queryFileByLibraryId.ajax';
		param['saveFileFileUrl']='oaDocumentAction!saveFTPFileList.ajax';
		param['canDelete']='false';
		AttachmentUtil.openFTPUpLoadPage(param);
		//ftp上传回调
		window['callBackFTPApplet']=function(){
			viewHandleChange();
		};*/
		AttachmentUtil.batchUpload({
			title:'文件批量上传',
			params:{bizCode:'document',bizId:documentLibraryId,backurl:'oaDocumentAction!saveDocumentFile.ajax'},
			closeHandler:function(){
				var uploadFinished = this.iframe.contentWindow.uploadFinished;
				if(uploadFinished){
					viewHandleChange();
				}
			}	
		});
	});
	//文件操作按钮
	$('#folderOperator').contextMenu({
		width:"120px",eventType:'click',items:[],
		onSelect:function(){
			this._hideMenu();
		},
		overflow:function(){
			var offset=$('#folderOperator').offset();
			offset.top=offset.top+$('#folderOperator').height()+5;
			return offset;
		},
		checkEvent:function(e){
			var l=this.options.items.length;
			return !l==0;
		}
	});
	//评注信息
	$('#documentPostil').on('click',function(){
		var documentLibraryId=getDocumentLibraryId();
		if(documentLibraryId=='') return;
		var height=getDefaultDialogHeight()-50;
		window['documentPostilDialog']=UICtrl.showDialog({
			title:'评注信息',width:700,height:height,
			content:'<div id="showDocumentPostilGrid" class="document-postil" style="width:700px;height:'+height+'px"></div>',
			init:function(){
				initDocumentPostilGrid($('#showDocumentPostilGrid'),documentLibraryId);
			},
			okVal:'添加评注',
			ok:function(){
				showAddPostilDialog($('#showDocumentPostilGrid'),documentLibraryId);
			},
			button:[
			    {
					name: '列表',
					callback: function(){
						$('#documentPostil').attr('viewKind','list');
						initDocumentPostilGrid($('#showDocumentPostilGrid'),documentLibraryId);
					    return false;
					}
			    },
			    {
					name: '平铺',
					callback: function(){
						$('#documentPostil').attr('viewKind','tile');
						initDocumentPostilGrid($('#showDocumentPostilGrid'),documentLibraryId);
					    return false;
					}
			    }
		    ]
		});
	});
}
//打开搜索对话框
function showQueryDocumentDialog(param){
	UICtrl.showAjaxDialog({
		url: web_app.name + '/oaDocumentAction!showQueryDocumentDialog.load',
		title:'文档搜索',
		width:460,
		okVal:'搜索',
		init:function(doc){
			var formParam=window['queryDocumentFormParam'];
			if(formParam){
				$('#queryForm').formSet(formParam);
			}
		},
		ok:function(){
			var formParam = $('#queryForm').formToJSON();
			window['queryDocumentFormParam']=$('#queryForm').formToJSON({encode:false});
			formParam=$.extend({},formParam,param||{});
			initializeGrid(formParam,'slicedQueryDocument');
			return true;
		},
		button:[
		   {
				name: '清空条件',
				callback: function(){
					$('#queryForm').formClean();
					$('#queryDocumentNameModel').combox('setValue','and');
					$('#queryKeyValueModel').combox('setValue','and');
					window['queryDocumentFormParam']=null;
				    return false;
				},
				focus: true
		   }//,
		   /*{
				name: '全局搜索',
				callback: function(){
					$('#chooseDocumentLibraryId').val('');
					clearViewHandler();//清除权限
					var formParam = $('#queryForm').formToJSON();
					window['queryDocumentFormParam']=$('#queryForm').formToJSON({encode:false});
					initializeGrid(formParam,'slicedQueryDocument');
				    return true;
				},
				focus: true
		 	}*/
	    ]
	});
}
//显示模式
function viewHandleChange(){
	var viewHandle=$('#view_handle').val();
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId=='') return;
	if(viewHandle=='block'){//缩略图视图
		parseIconView(documentLibraryId);
	}else if(viewHandle=='list'){//列表视图
		parseListView(documentLibraryId);
	}
}
//清除显示区域数据
function clearViewHandler(){
	checkPersonPower();
	//文件详细信息显示框隐藏
	clearDocumentFileView();
	showErrorInfo('请选择文件夹进行浏览!');
}

var icons={
	folder:web_app.name + "/themes/default/images/icons/folder.gif",
	drafts:web_app.name + "/themes/default/images/icons/folder_page.gif",
	sent:web_app.name + "/themes/default/images/icons/folder_go.png",
	inbox:web_app.name + "/themes/default/images/icons/folder_images.gif",
	note:web_app.name + "/themes/default/images/icons/folder_page_white.png"
}

function initDocumentLibrary(){
	 var obj = $('#maintree').data('ui-common-tree');
	 if(obj){//目录树已注册 执行刷新操作
		 $('#maintree').removeData('ui-common-tree');
		 $('#maintree').removeAllNode();
		 $('#divTreeArea').html('<ul id="maintree"></ul>');
		 obj= null;
	 }
	$('#maintree').commonTree({
		loadTreesAction:'oaDocumentAction!queryDocumentLibraryByAuth.ajax',
		idFieldName:'documentLibraryId',
		textFieldName: 'documentName',
		parentIDFieldName: 'parentId',
		nodeWidth: 220,
		isLeaf:function(treeNode){
			var flag= treeNode.hasChildren ? true : false;
			treeNode[this.options.iconFieldName]=flag? icons.folder:icons.note;
			if(treeNode.documentLibraryId=='share'){
				treeNode[this.options.iconFieldName]=icons.inbox;
			}
			return !flag;
		},
		onClick: function(data){
			onDocumentLibraryClick(data['documentLibraryId']);
		},
		dataRender:function(data){
			var share={documentLibraryId:'share' ,documentName: '共享文件夹',parentId:'',hasChildren:0};
			var list=data['list'],rootFlag=data['rootFlag'];
			if(rootFlag=='true'){
				if($.isArray(list)){
					list.unshift(share);
				}else{
					return [share];
				}
			}
			return list;
		},
		IsShowMenu:false
	});
}
//文件夹改变
function onDocumentLibraryClick(documentLibraryId){
	$('#chooseDocumentLibraryId').val(documentLibraryId);
	//文件详细信息显示框隐藏
	clearDocumentFileView();
	if(documentLibraryId=='share'){//共享文件夹
		showShareDocumentFile();
	}else{
		//执行权限校验操作
		doAjaxCheckPersonPower(documentLibraryId,false,function(data){
			//重新加载数据
			viewHandleChange();
			//创建路径
			createLibraryPath();
		});
	}
}
//显示共享文件
function showShareDocumentFile(){
	checkPersonPower();
	$('#view_handle').removeAttr('disabled');
	//创建路径
	createLibraryPath();
	//查询共享信息
	viewHandleChange();
}

//使用AJAX方法验证权限 isFile 是否为文件
function doAjaxCheckPersonPower(documentLibraryId,isFile,fn){
	Public.ajax(web_app.name + '/oaDocumentAction!checkPersonPower.ajax', {documentLibraryId:documentLibraryId}, function(data){
		checkPersonPower(data,isFile);
		fn.call(window,data);
	});
}

//用户权限校验 设置按钮
function checkPersonPower(data,isFile){
	if(!data){//权限不存在
		personPowerAuth={};//清空权限
		$('#folderOperator').reLoadMenu([],120);
		$('#folderOperator').hide();
		$('#addNewFile').hide();
		$('#addNewFileByFtp').hide();
		$('#documentPostil').hide();
		return;
	}else{
		$('#documentPostil').show();
	}
	if(isFile){//文件显示不允许切换视图
		$('#view_handle').attr('disabled',true);
	}else{
		$('#view_handle').removeAttr('disabled');
	}
	var isManage=parseInt(data['manage'],10)>0;
	var isAdd=parseInt(data['add'],10)>0;
	var isEdit=parseInt(data['edit'],10)>0;
	var isDelete=parseInt(data['delete'],10)>0;
	var isDownload=parseInt(data['download'],10)>0;
	//缓存权限
	personPowerAuth={
		isManage:isManage,
		isAdd:isAdd,
		isEdit:isEdit,
		isDelete:isDelete,
		isDownload:isDownload
	};
	if(isAdd){//新增权限
		$('#addNewFile').show();
		$('#addNewFileByFtp').show();
	}else{
		$('#addNewFile').hide();
		$('#addNewFileByFtp').hide();
	}
	if(isFile){//文件 不显示上传按钮
		$('#addNewFile').hide();
		$('#addNewFileByFtp').hide();
	}
	//操作菜单
	var folderOperatorItem=[];
	var addClasseSeparator=function(){
		if(folderOperatorItem.length>0){
			folderOperatorItem.push({classes:'separator'});
		}
	};
	if(!isFile){//目录才有这些功能
		if(isAdd){
			folderOperatorItem.push({
				name:"新建子文件夹",icon:'foldernew',handler:function(){
					var documentLibraryId=getDocumentLibraryId();
					if(documentLibraryId=='') return;
					showAddDocumentDialog(documentLibraryId,true);
				}
			});
		}
		if(isEdit){
			addClasseSeparator();
			folderOperatorItem.push({
				name:"重命名",icon:'edit',handler:function(){
					var documentLibraryId=getDocumentLibraryId();
					if(documentLibraryId=='') return;
					showAddDocumentDialog(documentLibraryId,false);
				}
			});
			folderOperatorItem.push({
				name:"扩展属性",icon:'paste',handler:function(){
					var documentLibraryId=getDocumentLibraryId();
					if(documentLibraryId=='') return;
					UICtrl.showAjaxDialog({
						url: web_app.name + '/oaDocumentAction!forwardUpdateDocumentExtend.load',
						param:{documentLibraryId:documentLibraryId},title:'扩展属性',width:640,
						ok:function(){
							var _self=this;
							$('#extendInfoForm').ajaxSubmit({url: web_app.name + '/oaDocumentAction!saveDocumentExtend.ajax',
								param:{documentLibraryId:documentLibraryId},
								success : function(id) {
									_self.close();
								}
							});
							return false;
						}
					});
				}
			});
		}
		if(isDelete){
			addClasseSeparator();
			folderOperatorItem.push({
				name:"删除目录",icon:'delete',handler:function(){
					var documentLibraryId=getDocumentLibraryId();
					if(documentLibraryId=='') return;//逻辑删除
					UICtrl.confirm("确定要删除当前文件夹吗?",function(){
						Public.ajax(web_app.name + '/oaDocumentAction!updateDocumentLibraryStatus.ajax', {ids:$.toJSON([documentLibraryId]),status:-1}, function(){
							initDocumentLibrary();//刷新目录树
							clearViewHandler();
						});
					});
				}
			});
		}
	}else{
		if(isDelete){
			addClasseSeparator();
			folderOperatorItem.push({
				name:"删除文件",icon:'delete',handler:function(){
					var documentLibraryId=getDocumentLibraryId();
					if(documentLibraryId=='') return;//逻辑删除
					UICtrl.confirm("确定要删除当前文件吗?",function(){
						Public.ajax(web_app.name + '/oaDocumentAction!updateDocumentLibraryStatus.ajax', {ids:$.toJSON([documentLibraryId]),status:-1}, function(){
							clearViewHandler();
						});
					});
				}
			});
		}
	}
	if(isManage){
		if(isFile){//文件具有共享功能
			folderOperatorItem.push({
				name:"共享",icon:'share',handler:function(){
					var documentLibraryId=getDocumentLibraryId();
					if(documentLibraryId=='') return;
					showShareDocumentDialog(documentLibraryId);
				}
			});
		}
		addClasseSeparator();
		folderOperatorItem.push({
			name:"复制",icon:'copy',handler:function(){
				var documentLibraryId=getDocumentLibraryId();
				if(documentLibraryId=='') return;
				moveOrCopyHandler('copy',{ids:documentLibraryId});
			}
		});
		folderOperatorItem.push({
			name:"移动",icon:'cut',handler:function(){
				var documentLibraryId=getDocumentLibraryId();
				if(documentLibraryId=='') return;
				moveOrCopyHandler('move',{ids:documentLibraryId});
			}
		});
		addClasseSeparator();
		folderOperatorItem.push({
			name:"设置权限",icon:'getworld',handler:function(){
				var documentLibraryId=getDocumentLibraryId();
				if(documentLibraryId=='') return;
				showSetDocumentAuthDialog(documentLibraryId);
			}
		});
		folderOperatorItem.push({
			name:"权限查询",icon:'computer_edit',handler:function(){
				var documentLibraryId=getDocumentLibraryId();
				if(documentLibraryId=='') return;
				showDocumentPersonPowerByKindAuth(documentLibraryId);
			}
		});
		folderOperatorItem.push({
			name:"操作历史",icon:'actiongo',handler:function(){
				var documentLibraryId=getDocumentLibraryId();
				if(documentLibraryId=='') return;
				UICtrl.showFrameDialog({
					url :web_app.name + "/oaDocumentAction!forwardListDocumentLog.do",
					param : {documentLibraryId : documentLibraryId},
					title : "操作历史",
					width :getDefaultDialogWidth(),
					height:getDefaultDialogHeight(),
					cancelVal: '关闭',
					ok:false,
					cancel:true
				});
			}
		});
	}
	addClasseSeparator();
	folderOperatorItem.push({
		name:"查询管理员",icon:'user',handler:function(){
			var documentLibraryId=getDocumentLibraryId();
			if(documentLibraryId=='') return;
			showDocumentManagePerson(documentLibraryId);
		}
	});
	$('#folderOperator').reLoadMenu(folderOperatorItem,120);
	$('#folderOperator')[folderOperatorItem.length>0?'show':'hide']();
}

//新增或修改目录 isAdd==true 新增 false 修改
function showAddDocumentDialog(documentLibraryId,isAdd){
	var title=isAdd?'新建子文件夹':'重命名文件夹';
	var action=isAdd?'showAddDocumentDialog':'showUpdateDocumentDialog';
	var param={};
	param[isAdd?'parentId':'documentLibraryId']=documentLibraryId
	UICtrl.showAjaxDialog({
		url: web_app.name + '/oaDocumentAction!'+action+'.load',
		param:param,title:title,width:340,
		ok:function(){
			var _self=this;
			$('#addDocumentForm').ajaxSubmit({url: web_app.name + '/oaDocumentAction!saveDocumentLibrary.ajax',
				param:param,
				success : function(id) {
					initDocumentLibrary();//刷新目录树
					if(isAdd){//新增才刷新
						viewHandleChange();//刷新显示列表
					}
					_self.close();
				}
			});
			return false;
		}
	});
}

//打开设置权限对话框
function showSetDocumentAuthDialog(documentLibraryId){
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId=='') return;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/oaDocumentAction!showSetDocumentAuthDialog.load',
		param:{documentLibraryId:documentLibraryId,width:620},title:'权限设置',width:640,
		id:'setDocumentAuthDialog',
		init:function(doc){
			authGridManager={};//清空以前数据
			$('#setDocumentAuthTab').tab().on('click',function(e){
				var $clicked = $(e.target || e.srcElement);
				var _gridManager=null;
				if($clicked.is('li')){
					var id=$clicked.attr('id');
					_gridManager=authTabClickInit(id,documentLibraryId,'350');
					if(_gridManager){
						_gridManager._onResize.ligerDefer(_gridManager, 50);
					}
				}
			});
			var id=$($('#setDocumentAuthTab').find('li').get(0)).attr('id');
			authTabClickInit(id,documentLibraryId,'350');
		},
		ok:function(){
			$('#setDocumentAuthForm').ajaxSubmit({url: web_app.name + '/oaDocumentAction!saveDocumentLibrary.ajax',
				param:{documentLibraryId:documentLibraryId,isModigAuth:true},
				success : function(id) {
				}
			});
			return false;
		}
	});
}

//改变目录
function documentLibraryLinkChange(documentLibraryId){
	onDocumentLibraryClick(documentLibraryId);
}
//创建路径
function createLibraryPath(){
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId=='') return;
	if(documentLibraryId=='share'){
		dataListView([{documentLibraryId:'share' ,documentName: '共享文件夹'}]);
		return;
	}
	function dataListView(dataList){
		var html=['<img src="',web_app.name,'/themes/default/images/32X32/category.gif" width="22" height="22"/>','&nbsp;&nbsp;'];
		html.push('<span style="position:relative;top:-5px;">');
		$.each(dataList,function(i,d){
			html.push('<a href="##" id="',d['documentLibraryId'],'" class="document-library-link" style="">');
			html.push(d['documentName']);
			html.push('</a>');
			html.push('&nbsp;&#9658;&nbsp;');
		});
		html.push('</span>','&nbsp;&nbsp;');
		$('.l-layout-center .l-layout-header').html(html.join(''));
	};
	Public.ajax(web_app.name + '/oaDocumentAction!queryLibraryPath.ajax', {documentLibraryId:documentLibraryId}, function(data){
		if(!$.isArray(data)){
			return;
		}
		var dataList=data;
		dataList=dataList.reverse();
		dataListView(dataList);
	});
	
}

//显示文件信息
function documentFileLinkShow(documentLibraryId){
	var oldDocumentLibraryId=getDocumentLibraryId();
	$('#chooseDocumentLibraryId').val(documentLibraryId);
	$('#showDocumentFileDiv').show();
	//验证权限
	doAjaxCheckPersonPower(documentLibraryId,true,function(data){
		Public.load(web_app.name + '/oaDocumentAction!showDocumentFile.ajax',{documentLibraryId:documentLibraryId},function(html){
			$('#showDocumentFileDiv').html(html).show();
			$('#oldDocumentLibraryId').val(oldDocumentLibraryId);
			//初始化显示
			initDocumentFileInfoDiv();
		});
	});
}

//文件对应显示图标
var fileKindMatchupIcon={
	defaultIcon:'/biz/oa/document/css/img/mutifile.png',
	doc:'/biz/oa/document/css/img/file_extension_doc.png',
	docx:'/biz/oa/document/css/img/file_extension_doc.png',
	xls:'/biz/oa/document/css/img/file_extension_xls.png',
	xlsx:'/biz/oa/document/css/img/file_extension_xls.png',
	ppt:'/biz/oa/document/css/img/file_extension_ppt.png',
	pptx:'/biz/oa/document/css/img/file_extension_ppt.png',
	rar:'/biz/oa/document/css/img/file_extension_rar.png',
	zip:'/biz/oa/document/css/img/file_extension_zip.png',
	txt:'/biz/oa/document/css/img/file_extension_txt.png',
	gif:'/biz/oa/document/css/img/file_extension_gif.png',
	jpg:'/biz/oa/document/css/img/file_extension_jpg.png',
	jpeg:'/biz/oa/document/css/img/file_extension_jpg.png',
	png:'/biz/oa/document/css/img/file_extension_png.png',
	swf:'/biz/oa/document/css/img/file_extension_swf.png',
	gif:'/biz/oa/document/css/img/file_extension_gif.png',
	dwg:'/biz/oa/document/css/img/file_extension_dwg.png',
	folder:'/biz/oa/document/css/img/folder.jpg'
}

//查询目录下包含的文件及子目录 缩略图视图
function parseIconView(documentLibraryId){
	var div=$('#showDocumentLibraryFile').empty();
	if(div.hasClass('document-file-list')){
		div.scrollReLoad({params:{documentLibraryId:documentLibraryId}});
	}else{
		div.addClass('document-file-list').scrollLoad({
			url:web_app.name + '/oaDocumentAction!queryChildNodeByLibraryId.ajax',
			params:{documentLibraryId:documentLibraryId},
			itemClass:'file-item-wrapper',
			size : 50,
			scrolloffset : 70,
			sizeParmName:'pagesize',
			dataRender:function(data,op){
				var opTotal=parseInt(op['total'],10);
				var total=parseInt(data['Total'],10);
				if(isNaN(total)||(total==0&&opTotal==0)){
					showErrorInfo('该文件夹尚无文件!');
					return false;
				}
				return data['Rows'];
			},
			onLoadItem:function(o){
				var documentLibraryId=o['documentLibraryId'],documentType=o['documentType'],documentName=o['documentName'];
				var title='创建人：'+o['createByName']+' 创建时间：'+o['createDate']+'\n'+o['remark'];
				var imgSrc=getViewIcon(o);//获取显示图标
				var html=['<div id="',documentLibraryId,'" type="',documentType,'" class="file-item-wrapper">'];
				html.push('<a title="',title,'" href="##">');
				if(documentType=='FILE'){//文件
					html.push('<div class="document-isprite item-folder">');
					html.push('<div class="item-file-type"><img class="item-file" src="',imgSrc,'"></div>');
					html.push('</div>');
				}else{//目录
					html.push('<img class="item-folder"  src="',imgSrc,'">');
				}
				html.push('</a>');
				html.push('<span title="',documentName,'"  class="item-name"  id="documentNameView_',documentLibraryId,'">',documentName,'</span>');
				html.push('</div>');
				return html.join('');
			}
		});
	}
}
//获取显示图标
function getViewIcon(o){
	var documentType=o['documentType'],fileKind=o['fileKind'],imgSrc='';
	if(documentType=='FILE'){//文件
		imgSrc=fileKindMatchupIcon[o['fileKind']];
		if(!imgSrc) imgSrc=fileKindMatchupIcon['defaultIcon'];
	}else{
		imgSrc=fileKindMatchupIcon['folder'];
	}
	return web_app.name +imgSrc;
}

//列表展现模式
function parseListView(documentLibraryId){
	initializeGrid({documentLibraryId:documentLibraryId},'queryChildNodeByLibraryId');
}

var gridManager=null;
//初始化表格
function initializeGrid(param,action){
	var div=$('#showDocumentLibraryFile').empty();
	div.removeClass('document-file-list');
	div.html('<div class="grid" style="margin: 2px;"></div>');
	var gridDiv=div.find('div.grid');
	var toolbarOptions = [];
	 if(getPersonPowerAuth('isEdit')){//具有编辑权限
		 toolbarOptions= UICtrl.getDefaultToolbarOptions({
				saveSortIDHandler: function(){
					var action = "oaDocumentAction!updateDocumentLibrarySequence.ajax";
					DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'documentLibraryId', onSuccess: function(){
						gridManager.loadData();
					}});
				}
		 })['items'];
	 }
	 toolbarOptions.push.apply(toolbarOptions, UICtrl.getDefaultToolbarOptions({
			deleteHandler: function(){
				DataUtil.updateById({ action: 'oaDocumentAction!updateDocumentLibraryStatus.ajax',
					gridManager: gridManager,idFieldName:'documentLibraryId',param:{checkPower:true,status:-1},
					message: '确实要删除选中数据吗?',
					onSuccess:function(){
						gridManager.loadData();
					}
				});
			},
			moveHandler:function(){
				var ids = DataUtil.getSelectedIds({gridManager:gridManager,idFieldName:'documentLibraryId'});
				if(!ids) return;
				moveOrCopyHandler('move',{ids:ids.join(',')});
			},
			saveCopyHandler:{id:'saveCopy',text:'复制粘贴',img:'page_bookmark.gif',click:function(){
				var ids = DataUtil.getSelectedIds({gridManager:gridManager,idFieldName:'documentLibraryId'});
				if(!ids) return;
				moveOrCopyHandler('copy',{ids:ids.join(',')});
			}}
	})['items']);
	gridManager = UICtrl.grid(gridDiv,{
        columns: [
              { display: "类型", name: "documentType", width: 60, minWidth: 60, type: "string", align: "center",
            	  render: function (item){
	            		var imgSrc=getViewIcon(item);
	            		return '<img style="width:32px;height:32px;border: 0px;" src="'+imgSrc+'">';
	               }
              },
              { display: "标题", name: "documentName", width: 300, minWidth: 60, type: "string", align: "left",
            	  render: function (item){
            		  var type=item['documentType'],id=item['documentLibraryId'];
            		  var html=['<div id="',id,'" type="',type,'" class="file-item-wrapper">'];
            		  html.push('<a href="##" class="GridStyle item-name" id="documentNameView_',id,'">')
            		  html.push(item['documentName']);
            		  html.push('</a>','</div>');
            		  return html.join('');
            	  } 
              },
              { display: "序号", name: "sequence", width:60, minWidth: 60, type: "string", align: "left",
  				render: function (item) { 
  					return UICtrl.sequenceRender(item,'documentLibraryId');
  				}
  			  },
              { display: "路径", name: "fullPathName", width: 300, minWidth: 60, type: "string", align: "left" },
              { display: "创建人", name: "createByName", width: 80, minWidth: 60, type: "string", align: "left" },
              { display: "创建时间", name: "createDate", width: 120, minWidth: 60, type: "datetime", align: "left" },
              { display: "最后修改人", name: "lastModifName", width: 80, minWidth: 60, type: "string", align: "left" },
              { display: "最后修改时间", name: "lastModifDate", width: 120, minWidth: 60, type: "datetime", align: "left" },
              { display: "描述/关键字", name: "remark", width: 220, minWidth: 60, type: "string", align: "left" }
        ],
        dataAction : 'server',
		url: web_app.name+'/oaDocumentAction!'+action+'.ajax',
		parms:param,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 40,
		fixedCellHeight : true,
		alternatingRow:false,
		checkbox:true,
		toolbar: {items:toolbarOptions},
		onBeforeShowData:function(data){
			var total=parseInt(data['Total'],10);
			if(isNaN(total)||total==0){
				showErrorInfo('该文件夹尚无文件!');
				return false;
			}
		}
    });
	UICtrl.createGridQueryBtn(gridDiv,'div.l-panel-topbar', function (value) {
        UICtrl.gridSearch(gridManager, {documentKeyName: encodeURI(value) });
    });
}

//显示错误消息
function showErrorInfo(message){
	var html=['<table width="440" cellspacing="0" cellpadding="0" align="center" class="MessageBox">'];
	html.push('<tr class="head-no-title">');
	html.push('<td class="left"></td>');
	html.push('<td class="center"></td>');
	html.push('<td class="right"></td>','</tr>');
	html.push('<tr class="msg">');
	html.push('<td class="left"></td>');
	html.push('<td class="center info">');
	html.push('<div class="msg-content">',message,'</div>');
	html.push('</td>');
	html.push('<td class="right"></td>','</tr>');
	html.push('<tr class="foot">');
	html.push(' <td class="left"></td>');
	html.push('<td class="center"></td>');
	html.push('<td class="right"></td>');
	html.push('</tr>','</table>');
	var div=$('#showDocumentLibraryFile').empty();
	div.removeClass('document-file-list');
	div.html(html.join(''));
}

//复制 OR 剪切调用
function moveOrCopyHandler(kind,param){
	var title=kind=='copy'?'复制到......':'移动到......';
	var action=kind=='copy'?'updateDocumentLibraryCopy':'updateDocumentLibraryFolder';
	var documentMoveTree=null;
	UICtrl.showDialog({title:title,width:300,
		content:'<div style="overflow-x: hidden; overflow-y: auto; width:280px;height:250px;"><ul id="documentDialogMoveTree"></ul></div>',
		init:function(doc){
			$('#documentDialogMoveTree').commonTree({
				loadTreesAction:'oaDocumentAction!queryDocumentLibraryByAuth.ajax',
				idFieldName:'documentLibraryId',
				textFieldName: 'documentName',
				parentIDFieldName: 'parentId',
				nodeWidth: 220,
				isLeaf:function(treeNode){
					var flag= treeNode.hasChildren ? true : false;
					treeNode[this.options.iconFieldName]=flag? icons.folder:icons.note;
					return !flag;
				},
				dataRender:function(data){
					return data['list'];
				},
				IsShowMenu:false
			});
		},
		ok:function(){
			var data=$('#documentDialogMoveTree').commonTree('getSelected');
			if(!data){
				Public.tip('请选择树节点！');
				return false;
			}
			var parentId=data['documentLibraryId'];
			var parentName=data['documentName'];
			param['checkPower']=true;
			param['parentId']=parentId;
			param['parentName']=parentName;
			Public.ajax(web_app.name + '/oaDocumentAction!' + action+'.ajax', param, function(data) {
				initDocumentLibrary();//刷新目录树
				documentLibraryLinkChange(parentId);//刷新显示列表
			});
			return true;
		}
	});
}
//判断是否具有权限
function getPersonPowerAuth(kind){
	return personPowerAuth[kind]===true;
}
//批注信息初始化
function initDocumentPostilGrid(div,documentLibraryId){
	var viewKind=$('#documentPostil').attr('viewKind');
	if(!viewKind) viewKind='tile'; //默认平铺
	div.empty();
	if(viewKind=='tile'){//平铺显示
		$(div).scrollLoad({
			url:web_app.name + '/oaDocumentAction!slicedQueryDocumentPostil.ajax',
			params:{documentLibraryId:documentLibraryId},
			size : 20,
			itemClass:'scroll-load-data',
			scrolloffset :20,
			sizeParmName:'pagesize',
			dataRender:function(data,op){
				return data['Rows'];
			},
			onLoadItem:function(obj){
				var html=['<div class="scroll-load-data">'];
				html.push('<div class="title">');
				html.push('<span class="left">');
			    html.push('<b>',obj['createDate'],'&nbsp;',obj['createByName'],'&nbsp;:</b>');
			    html.push('</span>');
			    if(getPersonPowerAuth('isManage')){//具有管理权限
			    	html.push('<span class="right">');
			    	html.push('<a href="##" class="aLink" id="',obj['documentPostilId'],'" onclick="deleteDocumentPostil(this)">');
			    	html.push('<span class="ui-icon ui-icon-trash"  title="删除">&nbsp;</span>');
			    	html.push('</a>');
			    	html.push('</span>');
			    }
			    html.push('</div>');
			    html.push('<div class="content">');
			    html.push(obj['content'].replace(/\n/g,'</br>'));
			    html.push('</div>');
			    html.push('</div>');
			    return html.join('');
			}
		});
	}else if(viewKind=='list'){//列表显示
		var height=getDefaultDialogHeight()-50;
		div.html('<div class="pGrid"></div>');
		var documentPostilGridManager = null;
		if(getPersonPowerAuth('isManage')){//具有管理权限
			var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
				viewHandler: function(){
					viewPostil();
				},
				deleteHandler: function(){
					DataUtil.delSelectedRows({action:'oaDocumentAction!deleteDocumentPostil.ajax',
						gridManager:documentPostilGridManager,idFieldName:'documentPostilId',
						onSuccess:function(){
							documentPostilGridManager.loadData();
						}
					});
				},
				exportExcelHandler: function(){
					UICtrl.gridExport(documentPostilGridManager);
				}
			});
		 }else{
			 var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
					viewHandler: function(){
						viewPostil();
					}
			 });
		 }
		documentPostilGridManager = UICtrl.grid(div.find('div.pGrid'), {
			columns: [	   
			{ display: "创建人", name: "createByName", width: '100', minWidth: 60, type: "string", align: "left"},
			{ display: "创建时间", name: "createDate", width: '130', minWidth: 40, type: "dateTime", align: "left"},
			{ display: "内容", name: "content", width: '600', minWidth: 60, type: "string", align: "left"}
			],
			dataAction : 'server',
			url: web_app.name+'/oaDocumentAction!slicedQueryDocumentPostil.ajax',
			parms :{documentLibraryId:documentLibraryId},
			width : '700',
			height : height,
			headerRowHeight : 25,
			rowHeight : 25,
			heightDiff : -2,
			sortName:'createDate',
			sortOrder:'desc',
			checkbox: true,
			toolbar: toolbarOptions,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onDblClickRow : function(data, rowindex, rowobj) {
				viewPostil(data.documentPostilId);
			}
		});
		UICtrl.createGridQueryBtn(div.find('div.pGrid'),'div.l-panel-topbar', function (value) {
	        UICtrl.gridSearch(documentPostilGridManager, { keyValue: encodeURI(value) });
	    });
		var viewPostil=function(documentPostilId){
			if(!documentPostilId){
				var row = documentPostilGridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				documentPostilId=row.documentPostilId;
			}
			UICtrl.showAjaxDialog({
				url: web_app.name + '/oaDocumentAction!showUpdateDocumentPostil.load',
				param:{documentPostilId:documentPostilId},
				parent:window['documentPostilDialog'],
				width:550,title:'查看评注',
				init:function(doc){UICtrl.setReadOnly(doc);},
				ok:false
			});
		}
	}
}

//添加评注
function showAddPostilDialog(div,documentLibraryId){
	 var html = ['<textarea id="addCommentTextArea" class="textarea" style="height:76px;"></textarea>'];
     html.push('<div style="text-align:right;padding-right:10px;">', '<input type="button" value="确定" class="buttonGray ok"/>');
     html.push('&nbsp;&nbsp;', '<input type="button" value="取消" class="buttonGray close"/>', '</div>');
     var options = { title: '添加评注', content: html.join(''), width: 350, opacity: 0.1, onClick: function (e) {
         if (e.is('input.close')) {
             this.close();
         } else if (e.is('input.ok')) {
        	 var _self=this,content=$('#addCommentTextArea').val();
        	 if(content==''){
        		 Public.tip('请填写评注信息!');
        		 return false;
        	 }
        	 Public.ajax(web_app.name + '/oaDocumentAction!saveDocumentPostil.ajax', {documentLibraryId:documentLibraryId,content:Public.encodeURI(content)}, function(data){
        		 _self.close();
        		 div.scrollReLoad({params:{documentLibraryId:documentLibraryId}});
        	 });
         }
     }};
     Public.dialog(options);
     $('#addCommentTextArea').maxLength({ maxlength: 500 });
}

//删除评注信息
function deleteDocumentPostil(obj){
	var id=$(obj).attr('id');
	var div=$(obj).parents('div.document-postil');
	var confirmFlag = window.confirm("此操作不能回退，确定要删除该评注吗？");
	if(confirmFlag){
		Public.ajax(web_app.name + '/oaDocumentAction!deleteDocumentPostil.ajax', {ids:$.toJSON([id])}, function(){
			 div.scrollReLoad();
		});
	}
}

/****文件详细页面按钮事件****/
//初始化
function initDocumentFileInfoDiv(){
	UICtrl.setReadOnly($('#documentFileInfoDiv'));
	var replaceFlag=$('#detailReplaceFlag').val();
	//根据权限验证按钮
	 if(getPersonPowerAuth('isEdit')){//具有编辑权限
		 $('#documentFileSave').show();
		 if(replaceFlag=='ok'){//允许替换操作
			$('#documentFileReplace').show();
			//$('#documentFileReplaceByFtp').show();
		}else{
			$('#documentFileReplace').hide();
			//$('#documentFileReplaceByFtp').hide();
		}
		 initDocumentFileReplace();//初始化替换文件按钮
		 $('#documentFileDownload').show();//具有编辑权限默认具有下载权限
	 }else{
		 $('#documentFileSave').hide();
		 UICtrl.setReadOnly($('#documentFileSubmitForm'));
		 UICtrl.setReadOnly($('#documentFileExtendInfoForm'));
	 }
	 if(getPersonPowerAuth('isDownload')){//具有下载权限
		 $('#documentFileDownload').show();
	 }
	 //文件历史按钮
	 initDocumentFileHistory();
}
//清除文件详细信息显示
function clearDocumentFileView(){
	//文件详细信息显示框隐藏
	$('#showDocumentFileDiv').empty().hide();
}

//返回按钮
function documentFileBack(){
	var oldDocumentLibraryId=$('#oldDocumentLibraryId').val();
	if(oldDocumentLibraryId!=''){//恢复以前的权限
		if(oldDocumentLibraryId=='share'){//共享文件夹
			checkPersonPower();
			$('#view_handle').removeAttr('disabled');
			$('#chooseDocumentLibraryId').val(oldDocumentLibraryId);
			clearDocumentFileView();
		}else{
			//执行权限校验操作
			doAjaxCheckPersonPower(oldDocumentLibraryId,false,function(data){
				$('#chooseDocumentLibraryId').val(oldDocumentLibraryId);
				clearDocumentFileView();
			});
		}
	}else{
		clearDocumentFileView();
	}
}
//保存
function documentFileSave(){
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId=='') return;
	var param=$('#documentFileExtendInfoForm').formToJSON();
	param['isDocumentExtend']='true';
	param['documentLibraryId']=documentLibraryId;
	$('#documentFileSubmitForm').ajaxSubmit({url: web_app.name + '/oaDocumentAction!saveDocumentLibrary.ajax',
		param:param,
		success : function(id) {
			var fileName=$('#documentName',$('#documentFileSubmitForm')).val();
			$('#documentNameView_'+id).text(fileName);
		}
	});
}
//插入操作日志
function insertDocumentLog(param,fn){
	/*Public.ajax(web_app.name + '/oaDocumentAction!insertDocumentLog.ajax', param, function(data){
		fn.call(window,data);
	});*/
	//修改异步调用为同步
	var flag=false;
	Public.syncAjax(web_app.name + '/oaDocumentAction!insertDocumentLog.ajax', param, function(data){
		flag=true;
	});
	if(flag){
		fn.call(window);
	}
}
//预览
function documentFilePreview(){
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId=='') return;
	var detailDocumentFileId=$('#detailDocumentFileId').val();
	if(detailDocumentFileId==''){
		Public.tip('文件不存在！');
		return;
	}
	insertDocumentLog({documentLibraryId:documentLibraryId,operationType:'preview'},function(data){
		AttachmentUtil.onOpenViewFile(detailDocumentFileId,'','',true);
	});
}
//下载
function documentFileDownload(){
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId=='') return;
	var detailDocumentFileId=$('#detailDocumentFileId').val();
	if(detailDocumentFileId==''){
		Public.tip('文件不存在！');
		return;
	}
	insertDocumentLog({documentLibraryId:documentLibraryId,operationType:'download'},function(){
		AttachmentUtil.downFileByAttachmentId(detailDocumentFileId);
	});
}
//替换文件按钮
function initDocumentFileReplace(){
	AttachmentUtil.registerUploadButton($('#documentFileReplace'),{
		afterUpload:function(data){
			$('#detailDocumentFileId').val(data['id']);
			$.each(data,function(p,v){$('#'+p,$('#documentFileInfoDiv')).val(v);});
		},
		beforChoose:function(){
			var documentLibraryId=getDocumentLibraryId();
			if(documentLibraryId==''){
				Public.tip('请选择要操作的文件夹!');
				return false;
			}
		},
		onInit:function(){
			 var pick=this.element.find('div.webuploader-pick');
			 pick.css({left:-20}).show();
		},
		getParam:function(){
			var documentLibraryId=getDocumentLibraryId();
			return {bizCode:'document',bizId:documentLibraryId,backurl:'oaDocumentAction!saveReplaceDocumentFile.ajax'};
		}
	});
}
//文件替换
function documentFileReplaceByFtp(){
	var documentLibraryId=getDocumentLibraryId();
	var param= {bizCode:'document',bizId:documentLibraryId,isMore:0,canDelete:false};
	param['saveFileFileUrl']='oaDocumentAction!saveFTPReplaceFile.ajax';
	AttachmentUtil.openFTPUpLoadPage(param);
	//ftp上传回调
	window['callBackFTPApplet']=function(){
		Public.ajax(web_app.name + '/oaDocumentAction!loadFileInfo.ajax', {documentLibraryId:documentLibraryId}, function(data){
			$.each(data,function(p,v){$('#'+p,$('#documentFileInfoDiv')).val(v);});
		});
	};
}
//初始化文件历史按钮
function initDocumentFileHistory(){
	 var dialogButton=[];
	 if(getPersonPowerAuth('isManage')){//具有管理权限
		 dialogButton.push({
			 name: '删除',
		     callback: function(){
		         var row=this['gridManager'].getSelectedRow();
				 if (!row) {Public.tip('请选择数据！'); return false; }
				 var id=row.id;
				 var confirmFlag = window.confirm("此操作不能回退，确定要删除该文件吗？");
				 if(confirmFlag){
					 var _self=this;
					 Public.ajax(web_app.name + '/attachmentAction!doDelete.ajax', {id:id,isCheck:false}, function(){
						_self['gridManager'].loadData();
					 });
				 }
		         return false;
		      },
		     focus: true
		 });
	 }
	 if(getPersonPowerAuth('isDownload')){//具有下载权限
		 dialogButton.push({
			 name: '下载',
		     callback: function(){
		    	 var row=this['gridManager'].getSelectedRow();
				 if (!row) {Public.tip('请选择数据！'); return false; }
				 var documentLibraryId=getDocumentLibraryId();
				 insertDocumentLog({documentLibraryId:documentLibraryId,operationType:'download',operationRemark:'下载历史版本:'+row.id},function(){
					 AttachmentUtil.downFileByAttachmentId(row.id);
				 });
				 return false;
		      },
		     focus: true
		 });
	 }
	$('#documentFileHistory').comboDialog({type:'sys',name:'sysAttachment',
		title:'文件历史版本',width:600,
		onShow:function(){
			var documentLibraryId=getDocumentLibraryId();
			if(documentLibraryId==''){return false; }
		},
		getParam:function(){
			var documentLibraryId=getDocumentLibraryId();
			return {bizId:documentLibraryId,bizCode:'DOCUMENTREPLACE'};
		},
		onChoose:function(){
			var row=this.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return false; }
			var documentLibraryId=getDocumentLibraryId();
			insertDocumentLog({documentLibraryId:documentLibraryId,operationType:'preview',operationRemark:'历史版本:'+row.id},function(){
				AttachmentUtil.onOpenViewFile(row.id,'','',true);
			});
			return false;
	    },
	    dialogOptions:{
	    	okVal:'预览',
	    	button:dialogButton
	   }
   });
}

//打开设置权限对话框
function showDocumentPersonPowerByKindAuth(documentLibraryId){
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId=='') return;
	var width=getDefaultDialogWidth()-100;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/oaDocumentAction!showSetDocumentAuthDialog.load',
		param:{documentLibraryId:documentLibraryId,isViewAuth:false,width:width-20},title:'权限查询',width:width,
		init:function(doc){
			authGridManagerView={};//清空以前数据
			$('#setDocumentAuthTab').tab().on('click',function(e){
				var $clicked = $(e.target || e.srcElement);
				var _gridManager=null;
				if($clicked.is('li')){
					var id=$clicked.attr('id');
					_gridManager=authTabClickDocumentPersonPower(id,documentLibraryId,'400');
					if(_gridManager){
						_gridManager._onResize.ligerDefer(_gridManager, 50);
					}
				}
			});
			var id=$($('#setDocumentAuthTab').find('li').get(0)).attr('id');
			authTabClickDocumentPersonPower(id,documentLibraryId,'400');
		},
		ok:false
	});
}

//文档管理员查询
function showDocumentManagePerson(documentLibraryId){
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId=='') return;
	var width=getDefaultDialogWidth()-100;
	UICtrl.showDialog({title:'具有管理权限的人员',width:width,
		content:'<div style="width:'+(width-20)+'px;"><div id="manageViewAuthGrid"></div></div>',
		init:function(doc){
			authGridManagerView={};//清空以前数据
			authTabClickDocumentPersonPower('manage',documentLibraryId,'400');
		},
		ok:false
	});
}

//打开共享文件对话框
function showShareDocumentDialog(documentLibraryId){
	UICtrl.showAjaxDialog({
		url: web_app.name + '/oaDocumentAction!showShareDocumentDialog.load',
		param:{documentLibraryId:documentLibraryId},title:'共享给他人',width:500,
		id:'shareDocumentDialog',
		okVal:'确 定',
		init:function(){
			initShareDocumentDialog();
		},
		ok:function(){
			var _self=this;
			if(!shareDocumentPersonArray||shareDocumentPersonArray.length==0){
				Public.tip('请选择共享给[人员]！'); 
				return false;
			}
			var param={documentLibraryId:documentLibraryId};
			param['detailData']=encodeURI($.toJSON(shareDocumentPersonArray));
			$('#shareDocumentForm').ajaxSubmit({url: web_app.name + '/oaDocumentAction!saveShareDocumentFile.ajax',
				param:param,
				success : function(id) {
					_self.close();
				}
			});
			return false;
		}
	});
}
var shareDocumentPersonArray=[];
function initShareDocumentDialog(){
	shareDocumentPersonArray=[];//清空数据
	//人员选择
	$('#sharePersonShowDiv').on('click',function(e){
		var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
		selectOrgParams['selectableOrgKinds']='psm';
		var options = { params: selectOrgParams,title : "选择人员",
			initHandler:function(){
				var addFn=this.iframe.contentWindow.addDataOneNode;
				if($.isFunction(addFn)){//初始化已选择列表
					this.iframe.contentWindow.isInitializingData = true;
					$.each(shareDocumentPersonArray,function(i,d){
						addFn.call(window,d);
					});
					this.iframe.contentWindow.isInitializingData = false;
					//刷新列表
					var reloadGrid=this.iframe.contentWindow.reloadGrid;
					reloadGrid.call(window);
				}
			},
			confirmHandler: function(){
				var data = this.iframe.contentWindow.selectedData;
				if (data.length == 0) {
					Public.errorTip("请选择数据。");
					return;
				}
				//清空数组
				shareDocumentPersonArray.splice(0,shareDocumentPersonArray.length);
				$.each(data,function(i,o){
					var row=$.extend({},o,{orgInId:o['id'],orgInName:o['name']});
					shareDocumentPersonArray.push(row);
				});
				var html=[];
				$.each(shareDocumentPersonArray,function(i,o){
					html.push('<span title="',o['fullName'],'">');
					html.push(o['name']);
					html.push('</span">;&nbsp;');
				});
				$('#sharePersonShowDiv').html(html.join(''));
				this.close();
			}
		};
		if(window['shareDocumentDialog']){
			options['parent']=window['shareDocumentDialog'];
		}
		OpmUtil.showSelectOrgDialog(options);
	});
}
