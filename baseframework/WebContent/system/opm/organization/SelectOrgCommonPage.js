/**********************************************************************************
对话框入参格式
{
"filter": 	 过滤条件
"parentId":  根过滤条件
"manageCodes": 管理权限
displayableOrgKinds: 显示的组织机构类别
selectableOrgKinds: 可选择的组织机构类别
"showDisabledOrg":	是否包含禁用的组织单元
"listMode":	列表模式
"showCommonGroup":	是否显示常用组
"cascade":	默认是否级联选择
"selected":已选择的组织，id或fullID数组 	string[]
}
***********************************************************************************/

var inputParams = {
    filter: "",
    parentId: "",
    multiSelect: true,
    manageCodes: "",
    displayableOrgKinds: "ogn,dpt,pos,psm",
    selectableOrgKinds: "psm",
    showDisabledOrg: "false", //显示禁用组织
    showVirtualOrg: "false", //显示虚拟组织
    showProjectOrg: "false", //显示项目组织
    showPosition: "false", //显示岗位
    chooseChildCheck:"true",//级联选择
    listMode: "false",
    showCommonGroup: "false",
    cascade: "true",
    selected: []
};

var treeManager, userGroupTreeManager,gridManager, parentId, selectedData = [];
var orgQueryGridManager = null;
var isInitUserGroup = false, isInitializingData = false;

$(function () {
    bindEvents();
    initializeInputParams();
    initializeUI();
    loadOrgTreeView();
    initializeGrid();
    initializeOrgQueryGrid();

    function initializeUI() {
        $('html').addClass("html-body-overflow");
        if (inputParams.showVirtualOrg === "true"||inputParams.showVirtualOrg === true) {
            $("#showVirtualOrg").attr("checked", 'true');
        }
        if (inputParams.showPosition === "true"||inputParams.showPosition === true) {
            $("#showPosition").attr("checked", 'true');
        }
        if (inputParams.chooseChildCheck === "true"||inputParams.chooseChildCheck === true) {
            $("#chooseChildCheck").attr("checked", 'true');
            setChooseChildCheck();
        }
        $('#orgQueryName').orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
    		needAuth:false,width:250,
    		beforeChange:function(data){
    			var fullId=data['fullId']||'';
    			var orgId=data['orgId']||'';
    			$('#queryConditionOrgId').val(orgId);
    			$('#queryConditionFullId').val(fullId);
    		},
    		onChange:function(data){
    			var text=data['text']||'';
    			if(text==''){
    				$('#queryConditionOrgId').val('');
        			$('#queryConditionFullId').val('');
    			}
    		},
    		back:{
    			text:'#orgQueryName',
    			name:'#orgQueryName'
    		}
    	});
    }
    
    function bindEvents() {
        $("#divAdd").click(function () {
            addData();
        });
        $("#divDelete").click(function () {
            deleteData();
        });
        $('#chooseChildCheck').click(function () {
            setChooseChildCheck();
        });
        $("#showVirtualOrg").click(function () {
            if (!treeManager) {
                return;
            }
            if ($(this).is(':checked')) {
                inputParams.showVirtualOrg = "true";
            } else {
                inputParams.showVirtualOrg = "false";
            }
            loadOrgTreeView();
        });
        $("#showPosition").click(function () {
            if (!treeManager) {
                return;
            }
            if ($(this).is(':checked')) {
                inputParams.showPosition = "true";
            } else {
                inputParams.showPosition = "false";
            }
            loadOrgTreeView();
        });
        $('#ui-grid-query-button').click(function () {
            var value = $('#ui-grid-query-input').val();
            if (value != '') {
                $('#orgQueryGridDiv').show().parent().css({ borderWidth: '0', overflowY: 'hidden'}).scrollTop(0);
                $('#orgTreeDiv').hide();
                if (orgQueryGridManager) {
                    UICtrl.gridSearch(orgQueryGridManager, { paramValue: encodeURI(value) });
                }
            }
        });
        $('#ui-grid-query-input').keyup(function (e) {
            var value = $(this).val();
            if (value == '') {
                $('#orgQueryGridDiv').hide();
                $('#orgTreeDiv').show().parent().css({ border: '1px #eaeaea solid', overflowY: 'auto' }).scrollTop(0);
            } else {
                var k = e.charCode || e.keyCode || e.which;
                if (k == 13) {
                    $('#ui-grid-query-button').trigger('click');
                }
            }
        });
        //切换选择来源
        $('#chooseTabs').on('click', function (e) {
            var $clicked = $(e.target || e.srcElement),li=null;
            if($clicked.is('li')){
				li=$clicked;
			}else if($clicked.parent().is('li')){
				li=$clicked.parent();
			}
			if(!li) return;
            if (li.is('li')) {
                if (li.hasClass('current')) {
                    return false;
                }
                $(this).find('li.current').removeClass('current');
                $('div.chooseTypeDiv').hide();
                var divId = li.attr('divId');
                li.addClass('current');
                $('#' + divId).show();
                if (divId == 'chooseByGroup' && !isInitUserGroup) {
                    initializeUserGroup();
                }
                if(divId=='chooseByQuery'){
                	$('#checkBoxDiv').hide();
                	$('#queryConditionDiv').show();
                	if(!chooseByQueryGridManager){
                		initializeChooseByQueryGrid();
                	}
                }else{
                	$('#checkBoxDiv').show();
                	$('#queryConditionDiv').hide();
                }
            }
        });
    }
    //用户分组树
    function initializeUserGroup() {
        Public.ajax(web_app.name + "/oaSetupAction!getUserGroupTree.ajax", {}, function (data) {
            isInitUserGroup = true;
            $.each(data, function (i, o) {
                var kindId = o['nodeKindId'];
                if (kindId == 'node') {
                    o['icon'] = OpmUtil.getOrgImgUrl('pos', 1);
                }
            });
           userGroupTreeManager=UICtrl.tree('#userGroupTree', {
                data: data,
                textFieldName: 'treeName',
                slide: false,
                parentIDFieldName: 'parentId',
                checkbox: true,
                nodeWidth: 180,
                isLeaf: function (data){
                    if (!data) return false;
                    if(isUserGroupTreeOrgNode(data)){
                    	data['icon'] = OpmUtil.getOrgImgUrl(data.nodeKindId, 1);
                    	return true;
                    }else if(data.nodeKindId=='tree'){
                    	return data.children ? false : true;
                    }
                    return false;
                },
                render:function(node){
                	return ['<span title="',node['fullName'],'">',node['treeName'],'</span>'].join('');
                },
                onClick: function (node) {
                    /*var d = node.data;
                    var kindId = d['nodeKindId'];
                    if (kindId == 'node') {//是分组才查询分组下数据
                        var groupKind = d['groupKind'];
                        //选择的是系统组且没有选择自动选择下级组织
                        if (groupKind == OrgKind.SystemGroup//是系统组
                			&& !$('#chooseChildCheck').is(':checked')//没有选择自动选择下级组织
                			&& inputParams.selectableOrgKinds.indexOf(OrgKind.SystemGroup) != -1//允许选择系统组分组
                		) {
                            //将组信息放入已选择中
                            addDataOneNode({ id: d['id'], name: d['name'], orgKindId: OrgKind.SystemGroup });
                            reloadGrid(); //刷新已选择
                        } else {//用户组全部转换为机构
                            getUserGroupDetail(d.id);
                        }
                    }*/
                },
                dataRender:function(data){
                	return data['Rows'];
                },
                delay: function(e){
                    var data = e.data;
                    if(data.nodeKindId == "tree"){//分组数据直接加载
                    	return true;
                    }else if(data.nodeKindId=='node'){//定义分组下人员信息延迟加载连接
                   	 	return { url: web_app.name + "/oaSetupAction!getUserGroupDetail.ajax",parms:{groupId:data.id}};
                    }
                    return false;
                },
                onDblclick: function (node) {
                	addDataOneNode(node.data);
		            reloadGrid();
		        }
            });
        });
        /*function getUserGroupDetail(groupId) {
            Public.ajax(web_app.name + "/oaSetupAction!getUserGroupDetail.ajax", { groupId: groupId }, function (data) {
                var rows = data['Rows'];
                $.each(rows, function (i, row) {
                    addDataOneNode(row);
                });
                reloadGrid();
            });
        }*/
    }

    function initializeOrgQueryGrid() {
        orgQueryGridManager = UICtrl.grid("#orgQueryGrid", {
            columns: [
                { display: "名称", name: "name", width: 80, minWidth: 60, type: "string", align: "left", frozen: true,
                    render: function (item) {
                        return '<div title="' + item.fullName + '">' + item.name + '</div>';
                    }
                },
                { display: "路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left",
                    render: function (item) {
                        return '<div title="' + item.fullName + '">' + item.fullName + '</div>';
                    }
                }
            ],
            url: web_app.name + '/orgAction!slicedQueryOrgs.ajax',
            parms: { showProjectOrg: inputParams.showProjectOrg == "true" ? 1 : 0, displayableOrgKinds: "pos,psm" },
            height: "100%",
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            delayLoad: true,
            onDblClickRow: function (data, rowindex, rowobj) {
                addDataOneNode(data);
                reloadGrid();
            }
        });
    }
});
//设置树选择是否支持级联
function setChooseChildCheck(){
	if (!treeManager) {
       return;
    }
    setTimeout(function(){
    	 treeManager.options.autoCheckboxEven = $('#chooseChildCheck').is(':checked');
        if (userGroupTreeManager) {
        	userGroupTreeManager.options.autoCheckboxEven = $('#chooseChildCheck').is(':checked');
	    } 
     },0);
}
function loadOrgTreeView() {
    if (treeManager) {
        treeManager.clear();
    }
    treeManager = UICtrl.tree("#orgTree", {
        url: web_app.name + "/orgAction!queryOrgs.ajax",
        param: {
            parentId: inputParams.parentId,
            filter: inputParams.filter,
            manageCodes: inputParams.manageCodes,
            displayableOrgKinds: inputParams.displayableOrgKinds,
            showDisabledOrg: inputParams.showDisabledOrg == 'true' ? 1 : 0,
            showVirtualOrg: inputParams.showVirtualOrg == "true" ? 1 : 0,
            showProjectOrg: inputParams.showProjectOrg == "true" ? 1 : 0,
            showPosition: inputParams.showPosition == "true" ? 1 : 0
        },
        idFieldName: "id",
        parentIDFieldName: "parentId",
        textFieldName: "name",
        checkbox: true,
        iconFieldName: "nodeIcon",
        btnClickToToggleOnly: true,
        autoCheckboxEven: false,
        nodeWidth: 180,
        isLeaf: function (data) {
            data.children = [];
            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
            return data.hasChildren == 0;
        },
        delay: function (e) {
            return { url: web_app.name + "/orgAction!queryOrgs.ajax",
                parms: {
                    parentId: e.data.id,
                    filter: inputParams.filter,
                    manageCodes: inputParams.manageCodes,
                    displayableOrgKinds: inputParams.displayableOrgKinds,
                    showDisabledOrg: inputParams.showDisabledOrg == "true" ? 1 : 0,
                    showVirtualOrg: inputParams.showVirtualOrg == "true" ? 1 : 0,
                    showPosition: inputParams.showPosition == "true" ? 1 : 0
                }
            };
        },
        dataRender: function (data) {
            return data.Rows;
        },
        onClick: function (node) {
            if (!node || !node.data) return;
            parentId = node.data.id;
        },
        onDblclick: function (node) {
            addDataOneNode(node.data);
            reloadGrid();
        }
    });
    setChooseChildCheck();
}

function isSelectedGroupPage() {
    var divId = $("#chooseTabs li.current").attr("divId");
    return divId == "chooseByGroup";
}
//判断是否是用户组中的组织机构节点
function isUserGroupTreeOrgNode(data){
	if(data.nodeKindId != "tree"&&data.nodeKindId!='node'){
		return true;
	}
	return false;
}
function isFromTreeView() {
    return $('#orgTreeDiv').is(':visible');
}
function isGroupTreeView() {
    return $('#userGroupTree').is(':visible');
}
function isQueryGridView() {
    return $('#orgQueryGrid').is(':visible');
}
function isQueryRelHrArchivesView() {
    return $('#chooseByQueryGrid').is(':visible');
}
/**
 * 获取选择的数据
 * */
function getChooseRowData(){
	var rows=[];
	//组织机构树选择
    if (isFromTreeView()) {
        var data = treeManager.getChecked();
        $.each(data, function (i, o) {
            rows.push(o.data);
        });
    } 
    //组织机构列表选择
    if(isQueryGridView()){
        rows = orgQueryGridManager.getSelectedRows();
    }
    //关联组织机构查询
    if(isQueryRelHrArchivesView()){
        rows = chooseByQueryGridManager.getSelectedRows();
    }
    //用户组树选择
    if(window['userGroupTreeManager']&&isGroupTreeView()){
    	var data = userGroupTreeManager.getChecked();
        $.each(data, function (i, o) {
        	if(isUserGroupTreeOrgNode(o.data)){
        		rows.push(o.data);
        	}
        });
    }
    return rows;
}
/**
* 取消选择数据
*/
function cancelSelect(row) {
    if (isInitializingData) {
        return;
    }
    if (isFromTreeView()) {
        treeManager.cancelSelect(row);
    } 
    if(isQueryGridView()){
        orgQueryGridManager.unselect(row);
    }
    if(isGroupTreeView()){
        userGroupTreeManager.cancelSelect(row);
    }
    if(isQueryRelHrArchivesView()){
    	chooseByQueryGridManager.unselect(row);
    }
}

var chooseByQueryGridManager=null;
function initializeChooseByQueryGrid() {
	chooseByQueryGridManager = UICtrl.grid("#chooseByQueryGrid", {
        columns: [
            { display: "名称", name: "name", width: 80, minWidth: 60, type: "string", align: "left", frozen: true,
            	render: function (item) {
                    return '<div title="' + item.fullName + '">' + item.name + '</div>';
                }
            },
            { display: "职级", name: "staffingPostsRankTextView", width: 60, minWidth: 40, type: "string", align: "left", frozen: true},
            { display: "路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left"}
        ],
        url: web_app.name + '/orgAction!slicedQueryOrgPersonRelHrArchives.ajax',
        height: "280",
        headerRowHeight: 25,
        sortName: 'fullSequence',
		sortOrder: 'asc',
        rowHeight: 25,
        checkbox: true,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        delayLoad: true,
        onDblClickRow: function (data, rowindex, rowobj) {
            addDataOneNode(data);
            reloadGrid();
        }
    });
}

function doQueryChoose(obj){
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(chooseByQueryGridManager, param);
}