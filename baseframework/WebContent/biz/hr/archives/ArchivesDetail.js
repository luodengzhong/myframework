var gridManager = null, refreshFlag = false,formButtonDiv=null;
var archivesManageType='hrArchivesManage';
$(document).ready(function() {
	initializeUI();
	initSelectControl();
	initPersonalPassword();
});

function initializeUI(){
	$('html').addClass("html-body-overflow-x");
	var flag=Public.getQueryStringByName('flag');
	if(flag==='false'){//来至预览页面
		$('#leftTD').width(10);
		$('#floatBox').hide();
		return;
	}
	//按钮
	formButtonDiv=$.getFormButton(
		[
		  {id:'addHRArchives',name:'新 增',event:addHRArchives},
	      {id:'saveDetail',name:'保 存',event:doSave},
	      {id:'updateComputeRule',name:'刷新数据',event:updateComputeRuleByArchivesId},
	      {id:'updateWageRule',name:'刷新薪酬',event:updateWageRule},
	      {name:'关 闭',event:closeWindow}
	    ]
	);
	
	var showArchivePicture=$('#showArchivePicture');
	Public.checkImgExists(showArchivePicture[0].src,function(){
		showArchivePicture[0].src=web_app.name +'/themes/default/images/photo.jpg';
		$('#loadArchivePicture').hide();
	});
	
	$('#boxToolBar').toolBar([{name:'照片',id:"addPicture"},{line:true,id:'addPictureLine'},
		                      {name:'电子档案',icon:'edit',event:showAttachment}]);
	//注册上传照片事件
	$('#addPicture').find('span').uploadButton({
		filetype:['jpg','gif','jpeg','png','bmp'],
		afterUpload:function(data){
			Public.ajax(web_app.name + "/hrArchivesAction!saveArchivesPicture.ajax",data,function(d){
				showArchivePicture[0].src=web_app.name +'/attachmentAction!downFileBySavePath.ajax?file='+encodeURI(encodeURI(data['path']));
				$('#loadArchivePicture').show();
			});
		},
		param:function(){
			var archivesId=$('#modifArchivesId').val();
			if(archivesId==''){
				Public.tip('请先保存档案记录!');
				return false;
			}
			return {bizCode:'archivesPicture',bizId:archivesId,flag:'false'};//flag:'false' 不添加日期目录
		}
	});
	
	initFloatBox();
	//分组栏目
	UICtrl.autoGroupAreaToggle();
	initDetailTree();
	//身份证解析
	$('#idCardNo').on('blur',function(){
		parseIdCard($(this).val());
	});
	//身高解析
	$('#height').on('blur',function(){
		parseHeightCon($(this).val());
	});
	//姓名转拼音
	$('#staffName').on('blur',function(){
		if(Public.isBlank($.trim($('#staffNo').val()))){
			$('#staffNo').val($.chineseLetter($(this).val()));
		}
	});
	//职级选择
	$('#staffingPostsRank').combox({onChange:function(){
		$('#staffingPostsRankSequence').val('');
	}});
	
	//嘉宝部分职位信息设置自读 
	var oporgproperty = $('#oporgproperty').val();
	if(oporgproperty == 1){
		UICtrl.disable($('#ognName'));
		UICtrl.disable($('#centreName'));
		UICtrl.disable($('#dptName'));
		UICtrl.disable($('#posDesc'));
		UICtrl.disable($('#posName'));
	}
	
}

function initPersonalPassword(){
	//判断是否是员工本人浏览
	var personOwnFlag=$('#personOwnFlagId').val();
	if(personOwnFlag=='true'){
		//是员工本人浏览需要验证访问密码
		PersonalPasswordAuth.showScreenOver();
		PersonalPasswordAuth.showDialog({
			okFun:function(){
				this.close();
				PersonalPasswordAuth.hideScreenOver();
			}
		});
		//添加员工操作的按钮
		formButtonDiv.formButton('addButton',
			[
			 {id:'personApply',name:'申请修改',event:personApplyModif}
			]
		);
	}else {
		//不是员工自己浏览判断是否为编辑且存在薪酬字段
		var archivesId=$('#modifArchivesId').val();
		if(archivesId!=''){
			if($('#wageStandard').length>0){//存在薪酬字段
				PersonalPasswordAuth.showScreenOver();
				PersonalPasswordAuth.showDialog({
					okFun:function(){
						this.close();
						PersonalPasswordAuth.hideScreenOver();
					}
				});
			}
		}
	}
}
function initFloatBox(){
	//浮动对话框
	var floatBox=$('#floatBox'),treeArea=$('#treeArea');
	var pageSize = UICtrl.getPageSize();
	floatBox.height(pageSize.h-60);
	treeArea.height(pageSize.h -220);
	var str_data = 'resize-special-event';
	floatBox.data(str_data, pageSize);
	setInterval(function(){
		var _size = UICtrl.getPageSize(),data = floatBox.data(str_data);
		if (_size.h !== data.h) {
			floatBox.data(str_data,_size).height(_size.h-60);
			treeArea.height(_size.h - 220);
	    }
		$('#archivesDetailDiv').width(_size.w-floatBox.width()-10).css({left:floatBox.width()+10});
	}, 140);
	$('#float-box-toggle').click(function(){
		var td=$('#leftTD'),down=$('#float-box-down');
		var flag=$(this).hasClass('combo-dialog-toggle');
		if(flag){
			td.width(200);
			floatBox.width(200);
			down.show();
			$(this).siblings('span').show();
			$(this).removeClass('combo-dialog-toggle');
		}else{
			td.width(25);
			floatBox.width(25);
			down.hide();
			$(this).siblings('span').hide();
			$(this).addClass('combo-dialog-toggle');
		}
		DetailUtil.reRender();
	});
}
function reloadGrid(){
	DetailUtil.reRender();
}
function initDetailTree(){
	$('#mainTree').commonTree({
		loadTreesAction:'hrArchivesAction!loadDetailKindTree.ajax',
		IsShowMenu:false,
		parentId:CommonTreeKind.HRDetailDefine,
		dataRender:function(data){
			return data;
		},
		onClick : function(data){
			var type=data.type;
			if(type===1){//type==1是子集
				loadDetailById(data.id);
			}
		}
	});
}
//初始化选择控件
function initSelectControl(){
	$('input[select]',$('#submitForm')).each(function(){
		var type=$(this).attr('select');
		type=Public.isBlank(type)?$(this).attr('name'):type;
		if($.isFunction(window[type+'Select'])){
			window[type+'Select'].call(window,$(this));
		}
	});
}
//选择机构
function ognNameSelect($el){
	$el.orgTree({filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"},
		manageType:archivesManageType,
		onChange:function(){
			clearPosInfo(['centreId','centreName','dptId','dptName']);
		},
		needAuth:false,
		back:{
			text:$el,
			value:'#ognId',
			id:'#ognId',
			name:$el
		}
	});
}
//选择中心
function centreNameSelect($el){
	$el.orgTree({filter:'dpt',
		getParam:function(){
			var ognId=$('#ognId').val();
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		manageType:archivesManageType,
		needAuth:false,
		onChange:function(){
			clearPosInfo(['dptId','dptName']);
		},
		back:{
			text:$el,
			value:'#centreId',
			id:'#centreId',
			name:$el
		}
	});
}
//选择部门
function dptNameSelect($el){
	$el.orgTree({filter:'dpt',
		getParam:function(){
			var ognId=$('#ognId').val();
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		manageType:archivesManageType,
		onChange:function(){
			clearPosInfo();
		},
		back:{
			text:$el,
			value:'#dptId',
			id:'#dptId',
			name:$el
		}
	});
}
//选择岗位
function posNameSelect($el){
	$el.orgTree({filter:'pos',
		searchName :'hrPosSelect',
		searchType :'hr',
		manageType:archivesManageType,
		getParam:function(){
			var ognId=$('#ognId').val(),
				centreId=$('#centreId').val(),
				dptId=$('#dptId').val(),
				root='orgRoot';
			if(ognId!=''){
				root=ognId;
			}
			if(centreId!=''){
				root=centreId;
			}
			if(dptId!=''){
				root=dptId;
			}
			var mode=this.mode;
			if(mode=='tree'){
				return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in('ogn','dpt','pos')"};
			}else{
				if(root=='orgRoot'){
					return {};
				}else{
					return {searchQueryCondition:"full_id like '%"+root+"%'"};
				}
			}
		},
		beforeChange:function(data){
			var fullId=null;
			if($.isPlainObject(data)){
				fullId=data['fullId'];
			}else{
				fullId=$('input[name="fullId"]',data).val();
			}
			$('#fullId').val(fullId);
		},
		onChange:function(values,nodeData){
			var ids=['posTier','posLevel','posType','systemType'];
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/hrSetupAction!loadPosTier.ajax", {posId: $('#posId').val()}, function(data) {
					$.each(ids,function(i,id){
						$('#'+id).val(data[id]).combox('setValue');
					});
				});
				$('#ognName').val(nodeData.orgName);
	        	$('#ognId').val(nodeData.orgId);
	        	$('#centreName').val(nodeData.centerName);
	        	$('#centreId').val(nodeData.centerId);
	        	$('#dptName').val(nodeData.deptName);
	        	$('#dptId').val(nodeData.deptId);
			}else{
				$.each(ids,function(i,id){
					$('#'+id).combox('setValue');
				});
			}
		},
		back:{
			text:$el,
			value:'#posId',
			id:'#posId',
			name:$el,
			posTier:'#posTier',
			posLevel:'#posLevel',
			posType:'#posType',
			systemType:'#systemType',
			orgName:'#ognName',
			orgId:'#ognId',
			centerName:'#centreName',
			centerId:'#centreId',
			deptName:'#dptName',
			deptId:'#dptId'
		}
	});
}

//选择工资主体单位
function wageOrgNameSelect($el){
	$el.orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		width:230,
		manageType:'hrWageOrgChooseManage',
		onChange:function(){
			$('#wageCompany').val('');
			$('#wageCompanyName').val('');
		},
		beforeChange:function(data){
				var flag=false,fullId=data.fullId;//是否是工资主体
				Public.authenticationWageOrg('',fullId,false,function(f){
					flag=f;
					if(f===false){
						Public.tip('选择的单位不是工资主体！');
					}
				});
				return flag;
		},
		back:{
			text:$el,
			value:'#wageOrgId',
			id:'#wageOrgId',
			name:$el
		}
	});
}
//清除岗位信息
function clearPosInfo(otherIds){
	var ids=['posTier','posLevel','posType','systemType','posId','posName'];
	if($.isArray(otherIds)){
		ids.push.apply(ids,otherIds);
	}
	$.each(ids,function(i,p){
		$('#'+p).val('');
	});
}
function businessRegistrationSelect($el){
	var name=$el.attr('name'),id=name.replace('Name','');
	$el.searchbox({type:'hr',name:'businessRegistration',back:{id:'#'+id,companyName:$el}});
}

function staffingPostsRankSequenceSelect($el){
	$el.searchbox({
		type:'hr',name:'postsRankSequenceByFullId',
		showToolbar:true,pageSize:100,
		maxHeight:200,
		checkbox:true,
		checkboxIndex:'code',
		getViewWidth:function(){
			return $el.width()-5;
		},
		getParam:function(){
			var ognId=$('#ognId').val()||"";
			return {organId:ognId};
		},
		onChange:function(data){
			$('#staffingPostsRank').combox('setValue',data.staffingPostsRank);
		},
		back:{
			code:$el,
			staffingPostsRank:$('#staffingPostsRank')
		}
	});
}
//机构工资类别
function wageKindSelect($el){
	$el.searchbox({
		type:'hr',name:'wageKindChooseByOrganId',
		getParam:function(){
			var organId=$('#ognId').val();
			if(organId!=''){
				return {organId: organId};
			}else{
				Public.tip('机构ID不存在'); 
			}
		},
	    back:{name:$el, value:'#wageKind'}
	});
}

//工资所属单位选择
function wageCompanyNameSelect($el){
	$el.searchbox({
		type:'hr',name:'businessRegistrationByOrg',
		getParam:function(){
			var orgId=$('#wageOrgId').val();
			if(orgId==''){
				Public.tip('请选择工资主体单位.');
				return false;
			}
			return {orgId:orgId};
		},
		back:{id:'#wageCompany',companyName:$el}
	});
}
//职能分类选择注册
function responsibilitiyNamesSelect($el){
	//注册点击事件打开选择对话框
	if(!Public.isReadOnly){
		$el.add($el.next('span')).on('click.archives',function(){
			var  archivesId=$('#modifArchivesId').val();
			if(archivesId==''){
				Public.tip('请先保存档案,在选择职能.');
				return false;
			}
			UICtrl.showFrameDialog({
				url :web_app.name + "/hrArchivesAction!selectResponsibilitiy.do",
				param : {
					archivesId :archivesId
				},
				title : "职能分类选择",
				width :580,
				height:350,
				cancelVal: '关闭',
				ok:function(){
					var saveHandler = this.iframe.contentWindow.saveData;
					if($.isFunction(saveHandler)){
						saveHandler.call(this,function(rows){
							var names=[];
							$.each(rows,function(i,o){
								names.push(o['fullName']);
							})
							$el.val(names.join(';'));
						});
					}
				},
				cancel:true
			});
		});
	}else{
		var td=$el.parent().parent('td.edit');
		if(td.length>0){
			td.addClass('disable');
		}
		$el.attr('readonly',true).addClass('textReadonly');
		$el.next('span').hide();
	}
}

//身份证解析
function parseIdCard(idCard){
	if(Public.isBlank(idCard)) return;
	if(!/^\d{6}((?:19|20)(?:(?:\d{2}(?:0[13578]|1[02])(?:0[1-9]|[12]\d|3[01]))|(?:\d{2}(?:0[13456789]|1[012])(?:0[1-9]|[12]\d|30))|(?:\d{2}02(?:0[1-9]|1\d|2[0-8]))|(?:(?:0[48]|[2468][048]|[13579][26])0229)))\d{2}(\d)[xX\d]$/.test(idCard)){
		Public.tip('身份证号非法.');
	    return;
	}
	var birthdate=RegExp.$1,sex=RegExp.$2;
	var year=birthdate.substr(0,4),month=birthdate.substr(4,2),day=birthdate.substr(6,4);
	var y=new Date().getFullYear();   
	$('#birthdate').val(year+'-'+month+'-'+day);
    $('#sex').combox('setValue',parseInt(sex)%2==0?'2':'1');
    $('#age').val(y-parseInt(year));
}

function parseHeightCon(height){
	if(Public.isBlank(height)) return;
	var  message='身高确定为'+height+'cm吗?'
	if(height>200 || height<155 ){
		Public.tip(message);
	//	$('#height').val('');
	    return;
	}
}
//加载子集
function loadDetailById(id){
	var mainDiv=$('#archivesMainInfoDiv'),detailDiv=$('#archivesDetailDiv');
	$('#archivesDetailGridDiv').removeAllNode();
	$('#archivesGridExport').show();
	Public.ajax(web_app.name + '/hrSetupAction!queryFieldDefine.ajax', {id:id}, function(data) {
		mainDiv.hide();
		$('div.form-bar').hide();
		$('div.hold-bar').hide();
		detailDiv.prepend('<div id="archivesDetailGridDiv"></div>').show();
		//var width=UICtrl.getPageSize().w-$('#floatBox').width()-10;
		//detailDiv.width(width);
		/******单独为现代服务业事业部 ZZJSY 、街区商业经营管理公司 JQSYJYGLGS 开通子集修改权限*******/
		/*var personOwnFlag=$('#personOwnFlagId').val(),fullId=$('#fullId').val();
		var code=data.code;
		if(personOwnFlag=='true'){
			if(fullId.indexOf('B0C0D3B549A84CA98B08974F5DC26F9C')>-1||fullId.indexOf('DEB6EF4C08524D17B7B1B97DB457BE1B')>-1){
				//个人简历  家庭成员子集 学历子表
				if(code=='resumeDetail'||code=='familyDetail'||code=='educationDetail'||code=='contractDetail'){
					Public.isReadOnly=false;
				}else{
					Public.isReadOnly=true;
				}
			}
		}*/
		/********结束*********/
		DetailUtil.getDetailGrid($('#archivesDetailGridDiv'),data,{archivesId:$('#modifArchivesId').val(),detailDefineId:id});
	});
}
function backArchivesMain(){
	var mainDiv=$('#archivesMainInfoDiv'),detailDiv=$('#archivesDetailDiv');
	$('#archivesDetailGridDiv').removeAllNode();
	$('div.form-bar').show();
	$('div.hold-bar').show();
	mainDiv.show();
	detailDiv.hide();
	DetailUtil.hrDetailGridManager=null;
	var personOwnFlag=$('#personOwnFlagId').val();
	if(personOwnFlag=='true'){
		Public.isReadOnly=true;
	}
}

function doSave(fn){
	$('#submitForm').ajaxSubmit({url: web_app.name +'/hrArchivesAction!doSave.ajax',
		success : function(id) {
			$('#modifArchivesId').val(id);
			refreshFlag = true;
			if($.isFunction(fn)){
				fn();
			}
		}
	});
}
function addHRArchives(){
	window.location.href = web_app.name +'/hrArchivesAction!showInsert.do?functionCode=HRArchivesMaintain';
}
function closeWindow(){
	if(refreshFlag){
		UICtrl.closeAndReloadParent('HRArchivesMaintain');
	}else{
		UICtrl.closeCurrentTab();
	}
}
//显示附件
function showAttachment(){
	var archivesId=$('#modifArchivesId').val();
	if(archivesId==''){
		Public.tip('请先保存档案记录!');
	    return false;
	}
	if($('#attachmentList').length>0){
		return false;
	}
	var mainDiv=$('#archivesMainInfoDiv'),detailDiv=$('#archivesDetailDiv');
	$('#archivesDetailGridDiv').removeAllNode();
	mainDiv.hide();
	$('div.form-bar').hide();
	$('div.hold-bar').hide();
	detailDiv.prepend('<div id="archivesDetailGridDiv"></div>').show();
	$('#archivesGridExport').hide();//hrArchives
	$("#archivesDetailGridDiv").load(web_app.name+"/common/attachment.jsp", {bizCode:"hrArchives",bizId:archivesId,isClass:'true'},function(){
		$('#attachmentList').fileList({isCheck:false});
	});
}

function updateComputeRuleByArchivesId(){
	doSave(function(){
		var archivesId=$('#modifArchivesId').val();
		Public.ajax(web_app.name + "/hrArchivesAction!updateComputeRuleByArchivesId.ajax",{archivesId:archivesId,isWageField:0},function(){
			window.location.replace(web_app.name +"/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId="+archivesId);
		});
	});
}
function updateWageRule(){
	doSave(function(){
		var archivesId=$('#modifArchivesId').val();
		Public.ajax(web_app.name + "/hrArchivesAction!updateComputeRuleByArchivesId.ajax",{archivesId:archivesId,isWageField:1},function(){
			window.location.replace(web_app.name +"/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId="+archivesId);
		});
	});
}
//员工申请修改，读取允许修改的字段，修改页面显示
function personApplyModif(){
	Public.ajax(web_app.name + "/hrSetupAction!queryCanEditColumn.ajax",{},function(data){
		$.each(data,function(i,o){
			var el=$('#'+o['name']);
			if(el.length>0){
				//修改为可编辑
				UICtrl.enable(el);
			}
		});
		//删除申请按钮
		formButtonDiv.formButton('removeButton','personApply');
		formButtonDiv.formButton('addButton',
			[{id:'personTodo',name:'保存修改',event:doSave}]
		);
	});
}
