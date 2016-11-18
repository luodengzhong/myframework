var treeManager,refreshFlag=false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	//bindDownFileEvent();
});

var loadUrl = web_app.name+'/queryInstitutionReadTree.ajax';//查询修制度

function initializeUI(){
    UICtrl.layout("#layout", {
        leftWidth: 240,
        heightDiff: -10
    });
	//制度树初始化
    initTreeManager();
}

function revise(id){
	if(id!=""){
		//页面跳转
		parent.addTabItem({
			tabid : 'InstitutionApply',
			text : '制度修订申请',
			url : web_app.name+'/forwardInstitutionApply.job?institutionTreeId=' + id
		});
	}		
}

function initTreeManager(){
	treeManager=UICtrl.tree("#maintree",{
		url:loadUrl,
		param:{parentId:1},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 180,
        isLeaf : function(data)
        {
            if (!data) return false;
            return data.hasChild == false;
        },
        delay: function(e){
        	//展开节点
            return { url:loadUrl,parms:{parentId: e.data.id} };
        },
        onClick: onEditNodeClick
    });
}

function reloadEditTree(){
	if(treeManager!=null){
		treeManager.clear();
		treeManager.loadData(null,loadUrl,{parentId:1});
	}
	else{
		initTreeManager();
	}
}

var instViewUrl = web_app.name+'/forwardInstitutionView.load';
function onEditNodeClick(node,obj){
	var data = node.data;
	var opfunctionCode = data.opfunctionCode;
	var isSystemChild = data.isSystemChild;
	var id = data.id;
	//if(node&&opfunctionCode!=""){//显示模块
	if(node&&(isSystemChild=="f"||opfunctionCode!="")){//显示模块
		Public.load(instViewUrl,{rootId:id},function(data){
			/*$('#institutionInfo').find('div.leaf').each(function(){
				var obj=$.data(this,'tooltip');
				if(obj){
					obj.destroy();
				}
			});*/
			$('#institutionInfo').html(data);
			UICtrl.autoSetWrapperDivHeight(function(_size){
				$('#mainWrapperDiv',$('#institutionInfo')).height(_size.h-10);
			});
			initTree(id);
		});
	}
	else{
		$('#institutionInfo').html("");
	}
}

function startProcess(code,name,url){
	parent.addTabItem({
		tabid : code,
		text : name,
		url : web_app.name+'/'+url
	});
}

var level = 0;
var count = 0;
var inslevel = 0;
var funlevel = 0;
var proclevel = 0;
function createTree(obj, lev, pidx, plen, htmlArr) {
    var childs = obj.childs ? obj.childs : [];
    if(obj.instLevel>level){
    	level = obj.instLevel;
    }
    count=count+1;
    if(count>1){
    	htmlArr.push("<div class=\"parent\">");
    }
    var kind = obj.kind||'file';
    var hlclass = 'hlline';
    var nclass = 'lnode';
    var hrclass = 'hline_r';
    var css = "";
    var name = obj.name;
    var len = getByteLen(name);
    var hasFile = obj.hasFile;
    var tdwidth = '285';
    var style = '';
    if('t'==hasFile){
    	css = ' aLink';
    	style = 'style="cursor:pointer"';
    }
    if('institution'==kind){
    	inslevel = level;
    	tdwidth = '235';
    	if(len>29){//换行
    		nclass = 'node';
    	}
    	else{
    		nclass = 'node2';
    	}
    }
    else if('function'==kind){
    	funlevel = level;
    	hlclass= 'hfline';
    	hrclass = 'fhline_r';
    	tdwidth = '117';
    	if(len>15){//换行
    		nclass = 'pnode';
    	}
    	else{
    		nclass = 'pnode2';
    	}
    }
    else if('process'==kind){
    	proclevel = level;
    	hrclass = 'prochline_r';
    	if(len>42){//换行
    		nclass = 'lnode';
    	}
    	else{
    		nclass = 'lnode2';
    	}
    }
    else if('system' ==kind){
    	hasFile = '';
    	hlclass= 'phlline';
    	hrclass = 'phline_r';
    	tdwidth = '117';
    	if(len>15){//换行
    		nclass = 'pnode';
    	}
    	else{
    		nclass = 'pnode2';
    	}
    }
    else if('file' ==kind){
    	if(len>41){//换行
    		nclass = 'lnode';
    	}
    	else{
    		nclass = 'lnode2';
    	}
    }
    if (lev == 1) {
        htmlArr.push("<div class=\""+hlclass+" "+hrclass+"\"></div>");
    } else {
        htmlArr.push("<div class=\"hline hline_l\"></div>");
        if (childs.length > 0)
            htmlArr.push("<div class=\""+hlclass+" "+hrclass+"\"></div>");
        if (pidx == 0 && plen != 1)
            htmlArr.push("<div class=\"vline vline_t\"></div>");
        if (pidx != 0 && pidx != plen - 1)
            htmlArr.push("<div class=\"vline vline_m\"></div>");
        if (pidx != plen - 1)
            htmlArr.push("<div class=\"vline vline_diff\"></div>");
        if (pidx == plen - 1 && pidx != 0)
            htmlArr.push("<div class=\"vline vline_b\"></div>");
    }
    if(count>1){
	    htmlArr.push("<table cellpadding=\"0\" cellspacing=\"0\">");
	    htmlArr.push("  <tr>");
	    htmlArr.push("      <td style=\"width:"+tdwidth+"px;\">");
    }
    htmlArr.push("          <div "+style+" class=\""+nclass+css+"\" id=\""+ obj.id +"\" onClick=openLink(this.id,'"+kind+"','"+hasFile+"')>" + name + "</div>");
    htmlArr.push("      </td>");
    if (childs.length > 0) {
        htmlArr.push("      <td>");
        var len = childs.length;
        //获取第一个子节点的层级
        for (var i = 0; i < len; i++) {
            var tempObj = childs[i];
            lev = lev + 1;
            createTree(tempObj, lev, i, len, htmlArr);
        }
        htmlArr.push("      </td>");
    }
    htmlArr.push("  </tr>");
    htmlArr.push("</table>");
    htmlArr.push("</div>");  
}

function initTree(rootId) {
    var obj = {};
    Public.ajax(web_app.name+'/queryInstitutionJsonTreeByRoot.ajax',
    	{rootId:rootId},
    	function(data){
    		obj=data;
    		var htmlArr = [];
    		level = 0;
    		count = 0;
    		var rootLevel = obj.instLevel;
    		createTree(obj, 1, 0, 0, htmlArr);
    		var colnum = level-rootLevel+1;
    		var head = [];
    		/**/
    		head.push("<table class='tableInput'><tr>");
    		var tdtitle = "";
    		var tdwidth = "";
    		for(var i=1;i<=5;i++){//colnum
    			if(i==3){
    				tdtitle = "一级制度";
    			}
    			else if(i==2){
    				tdtitle = "职能";
    			}
    			else if(i==4){
    				tdtitle = "二级流程";
    			}
    			else if(i==5){
    				tdtitle = "管理工具";
    			}
    			else if(i==1){
    				tdtitle = "手册";
    			}
    			if(i==1||i==2){
    				tdwidth = "55";
    			}
    			else if(i==3){
    				tdwidth = "115";
    			}
    			else{
    				tdwidth = "145";
    			}
    			head.push("<td class=\"title\" style=\"width:"+tdwidth+"px;text-align:center;font-weight:700\">"+tdtitle+"</td>");
    		}
    		head.push("</tr></table>");
    		
    		head.push("<div class=\"parent\">");
    		head.push("<table cellpadding=\"0\" cellspacing=\"0\">");
    		head.push("  <tr>");
    		head.push("      <td style=\"width:117px;\">");
    		$('#maindiv').empty().html( head.join("")+htmlArr.join(""));
    		$('#maindiv').css("width",colnum*205);
    });  
}


function openLink(id,kind,hasFile){
	/*if('system'==kind||'function'=='kind'){
		return;
	}*/
	if('t'!=hasFile){
		return;
	}
	else if('file'==kind){
		Public.syncAjax(web_app.name+'/checkDownloadAuthority.ajax',
				{fileId:id},
				function(data){
					AttachmentUtil.onOpenViewFile(id,'','',data);
					//var url="/attachmentPreview.do?isReadOnly="+data+"&id="+id;
					//window.open(web_app.name +url);
			});
		return;
	}
	else if('institution'==kind||'process'==kind){
		//var url="";
		Public.syncAjax(web_app.name + '/queryInstProcAttachment.ajax',
        		{id:id
        }, function (data) {
        	if(data&&data.id&&data.isReadOnly){
        		AttachmentUtil.onOpenViewFile(data.id,'','',data.isReadOnly);
        		//url = "/attachmentPreview.do?isReadOnly=" + data.isReadOnly + "&id=" + data.id;
        	}
        });
		return;
		/*if(url){
    		window.open(web_app.name + url);
    		return;
		}*/
	}
}

function initTip(){
	$('#maindiv').find('div.leaf').each(function(){
		var id=$(this).attr('id'),parentId=$(this).attr('parentId');
		$(this).tooltip({
			position:'right',
			heightDiff:-10,
			url:'forwardInstitutionTip.ajax',
			onShow:function(tip){
				var tipId=tip.attr('id');
				$('div.ui-tooltip').each(function(){
					var id=$(this).attr('id');
					if(id!=tipId){
						$(this).hide();
					}
				});
			},
			param:function(){
			   return {institutionId:id,institutionTreeId:parentId};
			}
		});
	});
}

function getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
       var length = val.charCodeAt(i);
       if(length>=0&&length<=128)
        {
            len += 1;
        }
        else
        {
            len += 2;
        }
    }
    return len;
}
