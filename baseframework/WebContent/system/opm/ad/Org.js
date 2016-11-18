var treeManager, gridManager, parentId, orgKindId, parentOrgKindId, refreshFlag;
var dataSource = { yesOrNo: { 1: '是', 0: '否'} };

var pageParam = { org: { orgId: "", isProjectOrg: false} };

$(function () {
    bindEvents();
    loadOrgTreeView();
    initializeGrid();
    initializateUI();

    function initializateUI() {
        UICtrl.layout("#layout", { leftWidth: 250, heightDiff: -5 });
        UICtrl.setSearchAreaToggle(gridManager, false);
    }

    function bindEvents() {
        $("#btnQuery").click(function () {
            reloadGrid2();
        });

        $("#btnReset").click(function () {
            $(this.form).formClean();
        });

        $("#showDisabledOrg").click(function () {
            parentId = "orgRoot";
             $('#maintree').commonTree("refresh");
            reloadGrid2();
        });     
        
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();
        var imageFilePath = web_app.name + '/themes/default/images/icons/';

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                { display: "类型", name: "orgKindId", width: "30", minWidth: 30, type: "string", align: "left",
                    render: function (item) {
                        return '<img src="'
                            + OpmUtil.getOrgImgUrl(item.orgKindId,
                                item.status) + '">';
                    }
                },
                { display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },
                { display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
                { display: "性别", name: "sexTextView", width: 100, minWidth: 60, type: "string", align: "left" },
                { display: "身份证", name: "idCard", width: 140, minWidth: 60, type: "string", align: "left" },
                { display: "全称", name: "longName", width: 100, minWidth: 60, type: "string", align: "left" },
                { display: "路径", name: "fullName", width: 100, minWidth: 60, maxWidth: 600, type: "string", align: "left" },
                { display: "机构", name: "orgName", width: 100, minWidth: 60, maxWidth: 600, type: "string", align: "left" },
                { display: "是否中心", name: "isCenter", width: 100, minWidth: 60, maxWidth: 600, type: "string", align: "left",
                    render: function (item) {
                        return item.isCenter == 1 ? "是" : "否";
                    }
                },
                 { display: "中心", name: "centerName", width: 100, minWidth: 60, maxWidth: 600, type: "string", align: "left" },
                { display: "部门", name: "deptName", width: 100, minWidth: 60, maxWidth: 600, type: "string", align: "left" },
                { display: "岗位", name: "positionName", width: 100, minWidth: 60, maxWidth: 600, type: "string", align: "left" },
                 { display: "是否虚拟组织", name: "isVirtual", width: 100, minWidth: 60, maxWidth: 600, type: "string", align: "left",
                     render: function (item) {
                         return item.isVirtual == 1 ? "是" : "否";
                     }
                 },
                { display: "排序号", name: "sequence", width: 60, minWidth: 60, maxWidth: 600, type: "string", align: "left" }
            ],
            dataAction: "server",
            url: web_app.name + "/orgAction!slicedQueryOrgs.ajax",
            parms: {
                parentId: "orgRoot",
                showVirtualOrg: 1
            },
            manageType : 'ADManage',
            pageSize: 20,
            sortName: 'fullSequence',
            sortOrder: 'asc',
            width: "99.8%",
            height: "100%",
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowIndex, rowObj) {
                if (data.orgKindId == OrgKind.Psm) {
                    doShowUpdatePerson(data.personId);
                }
            }
        });
    }
});

function initializteIsHidden() {
    $('#isHidden').combox({ data: dataSource.yesOrNo });
}

function initializteIsOperator() {
    $('#isOperator').combox({ data: dataSource.yesOrNo });
}

var addedButton = [{
	id : 'compareAD',
	name : 'AD对照',
	callback : function(){
		Public.ajax(web_app.name + '/orgAction!compareAD.ajax', { personId: getPersonId() }, 
    	function(data) {
    	
    	});
    	return false;
	}
}];

function doShowUpdatePerson(id) {
    UICtrl.showAjaxDialog({
        url: web_app.name + '/orgAction!loadPersonAD.load',
        param: {
            id: id
        },
        title: "维护操作员信息",
        width: 870,
        ok: doSavePerson,
        close: onDialogCloseHandler,
        init: initPersonDialog,
        button: addedButton
    });
}

function getPersonId(){
    return $("#id").val();
}

function initPersonDialog(doc) {
    initializteIsHidden();
    initializteIsOperator();
    
    if ($("#isPersonSynToAD").val() == "true") {
        $("#loginName").attr("readonly", "true");
    }
    setTimeout(function () {
        var showArchivePicture = $('#showArchivePicture');
        Public.checkImgExists(showArchivePicture[0].src, function () {
            showArchivePicture[0].src = web_app.name + '/themes/default/images/photo.jpg';
        });
    }, 100);
}

function doSavePerson() {
    var _self = this;
    var url = web_app.name + ('/orgAction!updateOperator.ajax');
    $('#submitForm').ajaxSubmit({
        url: url,
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

function onDialogCloseHandler() {
}

function isShowDisabledOrg(){
	return $("#showDisabledOrg").is(":checked") ? 1 : 0;
}

function isShowVirtualOrg(){
	return $("#showVirtualOrg").is(":checked") ? 1 : 0;
}

function loadOrgTreeView(){
	$('#maintree').commonTree({
        loadTreesAction:  web_app.name + '/orgAction!queryOrgs.ajax',
        parentId: 'orgRoot',
        getParam: function (e) {
            if (e) {
            	var params = {};
            	params.showDisabledOrg = isShowDisabledOrg();
            	params.displayableOrgKinds = "ogn,fld,prj,dpt,grp,pos,psm,fun";
            	params.showVirtualOrg =  1;
            	params.showPosition = 1;
                return  params;
            }
            return { showDisabledOrg: 0 };
        },
        manageType: 'ADManage',
        isLeaf: function (data) {
            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status, false);
        },
        onClick: function (data) {
                if (!data) {
                    return;
                }

                pageParam.org.orgId = data.orgId;
                pageParam.org.isProjectOrg = OpmUtil.isProjectOrg(data.fullId);

                parentOrgKindId = data.orgKindId;
                parentId = data.id;
                gridManager.options.parms.parentId = parentId;
                gridManager.options.parms.fullId = data.fullId;

                if (!data.parentId) {
                    $('.l-layout-center .l-layout-header').html("组织机构列表");
                } else {
                    $('.l-layout-center .l-layout-header').html(
                            "<font style=\"color:Tomato;font-size:13px;\">["
                            + data.name + "]</font>组织机构列表");
                }
                reloadGrid2();
            },
        IsShowMenu: false
    });
}

function reloadGrid() {
    reloadGrid2();
}

function reloadGrid2() {
    var params = $("#queryMainForm").formToJSON();
    gridManager.options.parms.displayableOrgKinds = "";

    var displayableOrgKinds = "";
    $("input[kindId]:checked").each(function (i, o) {
        displayableOrgKinds += $(o).attr("kindId") + ",";
    });
    if (displayableOrgKinds) {
        displayableOrgKinds = displayableOrgKinds.substring(0, displayableOrgKinds.length - 1);
        gridManager.options.parms.displayableOrgKinds = displayableOrgKinds;
    }

    UICtrl.gridSearch(gridManager, params);
}
