var treeManager, gridManager, parentId, orgKindId, parentOrgKindId, refreshFlag, propteryGridManager = null;
var dataSource = { yesOrNo: { 1: '是', 0: '否'} };

var displayableOrgKinds = "ogn,fld,prj,stm,grp,dpt,pos,psm,fun";

var pageParam = { org: { orgId: "", isProjectOrg: false} };

$(function () {
    bindEvents();
    loadOrgTreeView();
    initializeGrid();
    initializateUI();

    function initializateUI() {
        UICtrl.layout("#layout", { leftWidth: 250, heightDiff: -5 });
        UICtrl.setSearchAreaToggle(gridManager, false);
        initializateChangePersonMainOrg();
        initializateAddProjectOrgFun();
    }

    function initializateAddProjectOrgFun() {
        $('#toolbar_addProjectOrgFun').comboDialog({ type: 'opm', name: 'selectBizFunction', width: 480,
            dataIndex: "id",
            title: "选择业务岗位",
            checkbox: true,
            onShow: function () {
                if (!parentId) {
                    Public.errorTip("请选择人员。");
                    return false;
                }
                return true;
            },
            onChoose: function () {
                var bizFunctionData = this.getSelectedRows();
                if (bizFunctionData == null || bizFunctionData.length == 0) {
                    Public.errorTip("选择业务岗位。");
                    return;
                }

                var bizFunctionIds = [];
                $.each(bizFunctionData, function (i, o) {
                    bizFunctionIds.push(o.id);
                })

                var params = {};
                params.orgId = parentId;
                params.bizFunctionIds = $.toJSON(bizFunctionIds);

                Public.ajax(web_app.name + "/orgAction!insertBizFunctions.ajax",
    		             params, function () {
    		                 reloadGrid();
    		             });

                return true;
            }
        });
    }

    function initializateChangePersonMainOrg() {
        $('#toolbar_changePersonMainOrg').comboDialog({ type: 'opm', name: 'selectPersonOwnPsm', width: 480,
            getParam: function () {
                var row = gridManager.getSelectedRow();
                return { personId: row.personId };
            },
            title: "选择主岗位",
            checkbox: false,
            onShow: function () {
                var row = gridManager.getSelectedRow();
                if (row == null) {
                    Public.errorTip("请选择人员。");
                    return false;
                }
                return true;
            },
            onChoose: function () {
                var personData = gridManager.getSelectedRow();
                var mainOrgData = this.getSelectedRow();
                if (mainOrgData == null) {
                    Public.errorTip("请选择主岗位。");
                    return;
                }
                var params = {};
                params.personId = personData.personId;
                params.personMemberId = mainOrgData.id;

                Public.ajax(web_app.name + "/orgAction!changePersonMainOrg.ajax",
    		             params, function () {

    		             });
                return true;
            }
        });
    }

    function bindEvents() {
        $("#btnQuery").click(function () {
            reloadGrid2();
        });

        $("#btnReset").click(function () {
            $(this.form).formClean();
        });

        $("#showDisabledOrg,#showVirtualOrg").click(function () {
            parentId = "orgRoot";
            refreshNode();
            reloadGrid2();
        });
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();
        var imageFilePath = web_app.name + '/themes/default/images/icons/';

        var toolbarOptions = {
            items: [
                { id: "addOrg", text: "添加机构", click: showInsertOrgDialog, img: imageFilePath + "page_new.gif" },
                { id: "addDept", text: "添加部门", click: showInsertOrgDialog, img: imageFilePath + "page_new.gif" },
                { id: "addProjectOrgFolder", text: "添加项目组织分类", click: showInsertOrgDialog, img: imageFilePath + "page_new.gif" },
                { id: "addProjectOrg", text: "添加项目组织", click: showInsertOrgDialog, img: imageFilePath + "page_new.gif" },
                { id: "addProjectOrgGroup", text: "添加项目组织分组", click: showInsertOrgDialog, img: imageFilePath + "page_new.gif" },
                { id: "addSaleTeam", text: "添加销售团队", click: showInsertOrgDialog, img: imageFilePath + "page_new.gif" },
                { id: "addPosition", text: "添加岗位", click: showInsertOrgDialog, img: imageFilePath + "page_new.gif" },
                { id: "addPerson", text: "添加人员", click: showInsertPersonDialog, img: imageFilePath + "page_new.gif" },
                { id: "addProjectOrgFun", text: "添加业务岗位", img: imageFilePath + "page_new.gif" },
                { id: "addLine", line: true },
                { id: "assignPerson", text: "分配人员", click: assignPerson, img: imageFilePath + "page_new.gif" },
                { id: "assignLine", line: true },
                { id: "enableOrg", text: "启用", click: enableOrg, img: imageFilePath + "page_tick.gif" },
                { id: "disableOrg", text: "禁用", click: disableOrg, img: imageFilePath + "page_cross.gif" },
                { id: "updateOrg", text: "修改", click: showUpdateOrg, img: imageFilePath + "page_edit.gif" },
                { id: 'saveID', text:'保存排序号', click: updateOrgSequence, img: imageFilePath +'save.gif'},
                { id: "changePersonMainOrg", text: "设置主岗位", img: web_app.name + "/themes/default/images/org/pos.gif" },
                { id: "updateLine", line: true },
                { id: "quoteAuthorizationAndBizManagement", text: "引用权限", click: quoteAuthorizationAndBizManagement, img: web_app.name + "/themes/default/images/org/permission.gif" },
                { id: "updateLine", line: true },
                { id: "deleteOrg", text: "删除", click: logicDeleteOrg, img: imageFilePath + "page_delete.gif" },
                { id: "deleteLine", line: true },
                { id: "adjustOrg", text: "调整组织", click: adjustOrg, img: web_app.name + "/themes/default/images/org/org.gif" },
                { id: "adjustLine", line: true }
                ]
        };

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
                { display: "排序号", name: "sequence", width: 60, minWidth: 60, maxWidth: 600, type: "string", align: "left",
                  render : function(item) {
										return "<input type='text' id='txtSequence_"
												+ item.id
												+ "' class='textbox' value='"
												+ item.sequence + "' />";
									}
				},
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
                 }
            ],
            dataAction: "server",
            url: web_app.name + "/orgAction!slicedQueryOrgs.ajax",
            parms: { parentId: "orgRoot" },
            pageSize: 20,
            sortName: 'fullSequence',
            sortOrder: 'asc',
            toolbar: toolbarOptions,
            width: "99.8%",
            height: "100%",
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowIndex, rowObj) {
            	if (data.orgKindId != OrgKind.Function){
	                if (data.orgKindId == OrgKind.Psm)
	                    doShowUpdatePerson(data.personId);
	                else
	                    doShowUpdateOrg(data.id);
            	}
            }
        });

        hideOrgOpreateButtons();

        $("#toolbar_addOrg").show();
    }

    function getId() {
        return ($("#id").val());
    }

    function getTemplateId() {
        return ($("#templateId").val());
    }

    function checkSelectedParentId() {
        if (parentId == "null" || !parentId) {
            Public.tip("请选择父节点!");
            return false;
        }
        return true;
    }

    function checkSelectedData() {
        var row = gridManager.getSelectedRow();
        if (!row) {
            Public.tip("请选择数据！");
            return false;
        }
        return row;
    }

    function initializateTabPannel() {
    	/*
        UICtrl.layout("#layout", {
            leftWidth: 200,
            heightDiff: -5
        });
        */
        $('#tabPage').tab().bind('click', function (e) {
            var $clicked = $(e.target || e.srcElement);
            if ($clicked.is('li')) {
                var divid = $clicked.attr('divid');
                var div = $('#' + divid);
                $.each(['d1', 'd2'], function (i, o) {
                    $('#' + o).hide();
                });
                //d2的时候初始化并显示列表
                if (divid == 'd2' && propteryGridManager == null) {
                    initializePropertyGrid();
                }
                div.show();
            }
        });
    }

    function initializePropertyGrid() {
        var properties = null;
        $.ajax({
            url: web_app.name + "/orgAction!queryChildProperties.ajax",
            data: { orgType: $("#orgKindId").val() },
            success: function (data) {
                properties = data.data.Rows;
            },
            dataType: 'json',
            async: false
        });

        var toolbarOptions = UICtrl.getDefaultToolbarOptions({
    });
    var propertyData = {};
    propteryGridManager = UICtrl.grid('#propertyGrid', {
        columns: [
                { display: "主键", name: "orgPropertyId", hide: true, type: "string", align: "left" },
                { display: "dictValue", name: "value", hide: true, type: "string", align: "left" },
                { display: "属性名", name: "name", width: 150, minWidth: 60, type: "string", align: "left" },
                { display: "属性值", name: "propertyValue", width: 150, minWidth: 60, type: "string", align: "left",
                    editor: { type: "dynamic", getEditor: function (row) {
                        var t = {};
                        $.each(properties, function (index, property) {
                            if (property.code == row.value) {
                                t[property.detailId] = property.name;
                            }
                        });
                        return { type: 'combobox', data: t };
                    }
                    },
                    render: function (item, index, columnValue, columnInfo) {
                        var cv = columnValue;
                        $.each(properties, function (index, property) {
                            if (property.detailId == item.propertyValue) {
                                cv = property.name;
                            }
                        });
                        return cv;
                    }
                }
            ],
        dataAction: 'server',
        url: web_app.name + '/orgAction!slicedQueryOrgProperty.ajax',
        parms: {
            orgId: $("#id").val(),
            orgType: $("#orgKindId").val()
        },
        width: 500,
        sortName: 'orgPropertyId',
        sortOrder: 'asc',
        height: '300px',
        heightDiff: -60,
        headerRowHeight: 25,
        rowHeight: 25,
        toolbar: toolbarOptions,
        enabledEdit: true,
        usePager: false,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        autoAddRowByKeydown: false,
        onBeforeEdit: function (editParm) {
            var c = editParm.column;
            if (c.name == 'value') {//启用的数据value 不能编辑
                return editParm.record['status'] === 0;
            }
            return true;
        },
        onLoadData: function () {
            return !($('#dictIdDetal').val() == '');
        }
    });
}

function showInsertOrgDialog(item) {
    if (!checkSelectedParentId()){
    	return;
    }

    var orgKindId = "";
    switch (item.id) {
        case "addOrg":
            orgKindId = OrgKind.Org;
            break;
        case "addDept":
            orgKindId = OrgKind.Dept;
            break;
        case "addPosition":
            orgKindId = OrgKind.Position;
            break;
        case "addProjectOrgFolder":
            orgKindId = OrgKind.Folder;
            break;
        case "addProjectOrg":
            orgKindId = OrgKind.Project;
            break;
        case "addProjectOrgGroup":
            orgKindId = OrgKind.Group;
            break;
        case "addSaleTeam":
        	orgKindId = OrgKind.SaleTeam;
        	break;
    }

    UICtrl.showAjaxDialog({
        title: "添加组织",
        param: {
            parentId: parentId,
            orgKindId: orgKindId
        },
        init: function () {
            //机构，选择模板
            $("#btnSelectOrgType").parent().hide();
            $("#btnSelectOrgTemplate").parent().hide();
            
            switch(orgKindId){
            case OrgKind.Org:
            	$("#btnSelectOrgTemplate").parent().show();
            	break;
            case OrgKind.Dept:
            case OrgKind.Position:
            	$("#btnSelectOrgType").parent().show();
            	break;
            case OrgKind.Project:
            	break;
            default:
            	$("#l2").hide();
            }

            $('#detailName').on('blur', function () {
                if (!$('#detailCode').val()) {
                    $('#detailCode').val($.chineseLetter($(this).val()));
                }
            });
            initializateIsCenter(orgKindId);
            initializteIsVirtual();
            initializateTabPannel();
        },

        width: 300,
        url: web_app.name + '/orgAction!showOrgDetail.load',
        ok: doSaveOrg,
        close: onDialogCloseHandler
    });
}

function initializteIsVirtual() {
    $('#isVirtual').combox({ data: dataSource.yesOrNo });
}

function initializateIsCenter(orgKindId) {
    //部门，是否中心可见
    if (orgKindId == OrgKind.Dept) {
        $('#divIsCenter').show();
        $('#isCenter').combox({ data: dataSource.yesOrNo });
    } else {
        $('#divIsCenter').hide();
    }
}

function orgNodeKindHasExtendProperty(orgKindId){
	return orgKindId == OrgKind.Dept || orgKindId == OrgKind.Org || orgKindId == OrgKind.Project;	
}

function doShowUpdateOrg(id) {
    UICtrl.showAjaxDialog({
        url: web_app.name + '/orgAction!loadOrg.load',
        param: {
            id: id
        },
        init: function () {
            $("#btnSelectOrgType").parent().show();
            $("#btnSelectOrgTemplate").parent().hide();

            var orgKindId = $("#orgKindId").val();

            if (orgKindId == OrgKind.Folder || orgKindId == OrgKind.Project || orgKindId == OrgKind.Group || orgKindId == OrgKind.Function) {
                $("#btnSelectOrgType").parent().hide();
            }

            if (!orgNodeKindHasExtendProperty(orgKindId)) {
                $("#l2").hide();
            }
            $('#detailName').on('blur', function () {
                if (!$('#detailCode').val()) {
                    $('#detailCode').val($.chineseLetter($(this).val()));
                }
            });
            //部门，是否中心可见
            initializateIsCenter(orgKindId);
            initializteIsVirtual();
            initializateTabPannel();
        },
        title: "修改组织",
        width: 300,
        ok: doSaveOrg,
        close: onDialogCloseHandler
    });
}

function showUpdateOrg(item) {
    var row = checkSelectedData();
    if (!row)
        return;
    doShowUpdateOrg(row.id);
}

function doSaveOrg() {
    var _self = this;
    
    var id = getId();
    var templateId = getTemplateId();
    var url = web_app.name + "/orgAction!insertOrgByTemplate.ajax";
    if (!templateId){
        url = web_app.name + (id ? '/orgAction!updateOrg.ajax' : '/orgAction!insertOrg.ajax');
    }

    var param = {};
    if (propteryGridManager != null) {
        propteryGridManager.endEdit();
        var detailData = propteryGridManager.rows;
        if (detailData && detailData.length > 0) {
            param.propertyList = encodeURI($.toJSON(detailData));
        }
    }

    $('#submitForm').ajaxSubmit({ url: url, param: param, success: function (data) {
            refreshFlag = true;
            _self.close();
        }
    });
}

function updateOrgSequence() {
	var action = "orgAction!updateOrgSequence.ajax";
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid
			});
}

function showInsertPersonDialog() {
    if (!checkSelectedParentId())
        return;

    UICtrl.showAjaxDialog({
        title: "添加人员",
        param: {
            mainOrgId: parentId
        },
        width: 840,
        url: web_app.name + '/orgAction!showPersonDetail.load',
        ok: doSavePerson,
        close: onDialogCloseHandler,
        init: initPersonDialog
    });
}

function showUpdatePerson() {
    var row = checkSelectedData();
    if (!row())
        return;

    doShowUpdatePerson(row.id);
}

function doShowUpdatePerson(id) {
    UICtrl.showAjaxDialog({
        url: web_app.name + '/orgAction!loadPerson.load',
        param: {
            id: id
        },
        title: "修改人员",
        width: 840,
        ok: doSavePerson,
        close: onDialogCloseHandler,
        init: initPersonDialog
    });
}

function initPersonDialog(doc) {
    setTimeout(function () {
        var showArchivePicture = $('#showArchivePicture');
        Public.checkImgExists(showArchivePicture[0].src, function () {
            showArchivePicture[0].src = web_app.name + '/themes/default/images/photo.jpg';
        });
    }, 100);
}

function doSavePerson() {
    var _self = this;
    var id = getId();
    var url = web_app.name  + (id ? '/orgAction!updatePerson.ajax'  : '/orgAction!insertPerson.ajax');
    $('#submitForm').ajaxSubmit({ url: url, success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

function onDialogCloseHandler() {
    propteryGridManager = null;
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}

function quoteAuthorizationAndBizManagement() {
    var row = checkSelectedData();
    if (!row) {
        return;
    }

    var params = OpmUtil.getSelectOrgDefaultParams();
    params = jQuery.extend(params, { selectableOrgKinds: "ogn,dpt,pos,psm" })
    var destOrgId = row.id;

    UICtrl.showFrameDialog({
        title: "选择源组织",
        url: web_app.name + "/orgAction!showSelectOrgDialog.do",
        param: params,
        width: 700,
        height: 400,
        ok: function () {
            doQuoteAuthorizationAndBizManagement.call(this, destOrgId);
        },
        close: onDialogCloseHandler,
        cancel: true
    });
}

function doQuoteAuthorizationAndBizManagement(destOrgId) {
    var data = this.iframe.contentWindow.selectedData;
    if (data.length == 0) {
        Public.errorTip("请选择源组织。");
        return;
    }
    var _self = this;

    var params = {};
    params.sourceOrgId = data[0].id;
    params.destOrgId = destOrgId;
    Public.ajax(web_app.name + "/orgAction!quoteAuthorizationAndBizManagement.ajax",
            params, function () {
                refreshFlag = true;
                _self.close();
            });
}

function assignPerson() {
    var params = OpmUtil.getSelectOrgDefaultParams();
    params = jQuery.extend(params, { multiSelect: true })

    UICtrl.showFrameDialog({
        title: "分配人员",
        url: web_app.name + "/orgAction!showSelectOrgDialog.do",
        param: OpmUtil.getSelectOrgDefaultParams(),
        width: 700,
        height: 400,
        ok: doAssignPerson,
        close: onDialogCloseHandler
    });
}

function doAssignPerson() {
    var data = this.iframe.contentWindow.selectedData;
    if (data.length == 0) {
        Public.errorTip("请选择人员。");
        return;
    }
    var _self = this;

    var personIds = [];
    for (var i = 0; i < data.length; i++) {
        personIds[personIds.length] = OpmUtil
                .getPersonIdFromPsmId(data[i].id);
    }

    var params = {};
    params.orgId = parentId;
    params.personIds = $.toJSON(personIds);
    Public.ajax(web_app.name + "/orgAction!insertPersonMembers.ajax",
            params, function () {
                refreshFlag = true;
                _self.close();
            });
}

function enableOrg() {
    var row = checkSelectedData();
    if (!row)
        return;

    var isMasterPsm = (row.parentId == row.personMainOrgId);
    var name = row.name;
    var orgKindId = row.orgKindId;
    var personStatus = row.personStatus;

    var msg;
    var enableOrgAction;
    if (orgKindId != "psm" || isMasterPsm || personStatus == 1) {
        msg = "确实要启用“"
                + name
                + "”吗？"
                + (orgKindId != "psm" ? "<br/><br/>“启用”操作会同时启用选中组织的所有下级组织。"
                    : "");
        enableOrgAction = "orgAction!enableOrg.ajax";
    } else {
        msg = "“" + name + "”" + "的主岗位已被禁用，在启动当前岗位时会同时启用主岗位。"
                + "<br/><br/>确实要启用“" + name + "”的主岗位和当前岗位吗？";
        enableOrgAction = "orgAction!enableSubordinatePsm.ajax";
    }

    var params = {};
    params.id = row.id;
    params.personId = row.personId;
    params.version = row.version;

    DataUtil.updateById({
        action: enableOrgAction,
        gridManager: gridManager,
        param: params,
        message: msg,
        onSuccess: function () {
            Public.tip("启用“" + name + "”成功。");
            reloadGrid();
        }
    });
}

function disableOrg() {
    var row = checkSelectedData();
    if (!row)
        return;

    var isMasterPsm = (row.parentId == row.mainOrgId);
    var name = row.name;
    var orgKindId = row.orgKindId;

    var msg = "确实要禁用“"
            + name
            + "”吗？"
            + (orgKindId != "psm" ? "<br/><br/>“禁用”操作会禁用选中组织及其所有下级组织。" : "");
+((orgKindId == "psm" && isMasterPsm) ? "<br/><br/>禁用人员的主岗位会同时禁用人员的所有其他岗位。"
            : "");

    var params = {};
    params.id = row.id;
    params.version = row.version;

    DataUtil.updateById({
        action: 'orgAction!disableOrg.ajax',
        gridManager: gridManager,
        param: params,
        message: msg,
        onSuccess: function () {
            Public.tip("禁用“" + name + "”成功。");
            reloadGrid();
        }
    });
}

function logicDeleteOrg() {
    var selectedRow = gridManager.getSelectedRow();

    var action = "orgAction!logicDeleteOrg.ajax";
    action = action + "?orgId=" + selectedRow.id;

    var row = checkSelectedData();
    if (!row)
        return;
    var name = row.name;

    var msg = "“删除”操作会同时删除当前选中组织的所有直属下级及直属人员的所有人员成员。删除后的组织您还可以在回收站中进行“还原”和“清除”操作。<br/><br/>确实要删除“"
            + name + "”吗？";
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        message: msg,
        onSuccess: reloadGrid
    });
}
});

function hideOrgOpreateButtons() {
    $("#toolbar_addOrg").hide();
    $("#toolbar_addProjectOrgFolder").hide();
    $("#toolbar_addProjectOrg").hide();
    $("#toolbar_addProjectOrgGroup").hide();
    $("#toolbar_addSaleTeam").hide();
    $("#toolbar_addProjectOrgFun").hide();
    $("#toolbar_addDept").hide();
    $("#toolbar_addPosition").hide();
    $("#toolbar_addPerson").hide();
    $("#toolbar_assignPerson").hide();
    $("#toolbar_changePersonMainOrg").hide();
    $("#separator_assignLine").hide();
}

function switchButtonsVisible(parentOrgKindId){
	switch (parentOrgKindId) {
	case OrgKind.Root:
	    $("#toolbar_addOrg").show();
	    break;
	case OrgKind.Org:
	    $("#toolbar_addOrg").show();
	    $("#toolbar_addDept").show();
	    $("#toolbar_addProjectOrgFolder").show();
	    break;
	case OrgKind.Dept:
	    $("#toolbar_addDept").show();
	    $("#toolbar_addPosition").show();
	    break;
	case OrgKind.Position:
	    $("#toolbar_addPerson").show();
	    $("#toolbar_assignPerson").show();
	    $("#toolbar_changePersonMainOrg").show();
	    $("#separator_assignLine").show();
	    break;
	case OrgKind.Folder:
	    $("#toolbar_addProjectOrgFolder").show();
	    $("#toolbar_addProjectOrg").show();
	    break;
	case OrgKind.Project:
	    $("#toolbar_addProjectOrgGroup").show();
	    $("#toolbar_addSaleTeam").show();
	    break;
	case OrgKind.SaleTeam:
		$("#toolbar_addDept").show();
		break;
	case OrgKind.Group:
	    $("#toolbar_addPerson").show();
	    $("#toolbar_assignPerson").show();
	    break;
	case OrgKind.Psm:
	    if (pageParam.org.isProjectOrg) {
	        $("#toolbar_addProjectOrgFun").show();
	    }
	    break;
	}
}


function isShowDisabledOrg(){
	return $("#showDisabledOrg").is(":checked") ? 1 : 0;
}

function isShowVirtualOrg(){
	return $("#showVirtualOrg").is(":checked") ? 1 : 0;
}

function loadOrgTreeView() {
    if (treeManager){
    	treeManager.clear();
    }

    Public.ajax(web_app.name + "/orgAction!queryOrgs.ajax", {
        parentId: parentId,
        showDisabledOrg:  isShowDisabledOrg(),
        displayableOrgKinds: displayableOrgKinds,
        showVirtualOrg: isShowVirtualOrg(),
        showPosition: 1
    }, function (data) {
        treeManager = UICtrl.tree("#maintree", {
            data: data.Rows,
            idFieldName: "id",
            parentIDFieldName: "parentId",
            textFieldName: "name",
            checkbox: false,
            iconFieldName: "icon",
            btnClickToToggleOnly: true,
            nodeWidth: 180,
            isLeaf: function (data) {
                data.children = [];
                data.icon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
                return data.hasChildren == 0;
            },
            onBeforeExpand: onBeforeExpand,
            onClick: function (node) {
                if (!node || !node.data) {
                    return;
                }

                pageParam.org.orgId = node.data.orgId;
                pageParam.org.isProjectOrg = OpmUtil.isProjectOrg(node.data.fullId);

                parentOrgKindId = node.data.orgKindId;
                parentId = node.data.id;
                
                gridManager.options.parms.parentId = parentId;
                gridManager.options.parms.fullId = node.data.fullId;
                
                if (!node.data.parentId) {
                    $('.l-layout-center .l-layout-header').html("组织机构列表");
                } else {
                    $('.l-layout-center .l-layout-header').html(
                            "<font style=\"color:Tomato;font-size:13px;\">["
                            + node.data.name + "]</font>组织机构列表");
                }

                hideOrgOpreateButtons();
                switchButtonsVisible(parentOrgKindId);
                
                reloadGrid2();
            } // end of onClick
        }); // end of UICtrl.tree
    }); // end of function(data)
}

function onBeforeExpand(node) {
    if (node.data.hasChildren) {
        if (!node.data.children || node.data.children.length == 0) {
            Public.ajax(web_app + "/orgAction!queryOrgs.ajax", {
                parentId: node.data.id,
                displayableOrgKinds: displayableOrgKinds,
                showDisabledOrg: isShowDisabledOrg(),
                showVirtualOrg:  isShowVirtualOrg(),
                showPosition: 1
            }, function (data) {
                treeManager.append(node.target, data.Rows);
            });
        }
    }
}

function reloadGrid() {
    refreshNode();
    reloadGrid2();
}

function reloadGrid2() {
    var params = $("#queryMainForm").formToJSON();
    gridManager.options.parms.displayableOrgKinds = "";

    var orgKinds = "";
    $("input[kindId]:checked").each(function (i, o) {
    	orgKinds += $(o).attr("kindId") + ",";
    });
    
    if (orgKinds) {
    	orgKinds = orgKinds.substring(0, displayableOrgKinds.length - 1);
        gridManager.options.parms.displayableOrgKinds = orgKinds;
    }

    UICtrl.gridSearch(gridManager, params);
}

function refreshNode(pNode) {
    var parentData;
    if (pNode)
        parentData = pNode;
    else
        parentData = treeManager.getDataByID(parentId);
    if (parentData) {
        if (parentData.children && parentData.children.length > 0) {
            for (var i = 0; i < parentData.children.length; i++) {
                treeManager.remove(parentData.children[i].treedataindex);
            }
        }
        Public.ajax(web_app.name + "/orgAction!queryOrgs.ajax", {
            parentId: parentData.id,
            //orgKindId: displayableOrgKinds,
            displayableOrgKinds: displayableOrgKinds,
            showDisabledOrg: this.isShowDisabledOrg(),
            showVirtualOrg: this.isShowVirtualOrg()
        }, function (data) {
            if (!data.Rows || data.Rows.length == 0) {
                var pn = treeManager.getParent(parentData.treedataindex);
                if (pn)
                    refreshNode(pn);
            } else {
                treeManager.append(parentData, data.Rows);
            }
        });
    }
}

function showSelectOrgTypeDialog() {
    var orgKindId = $("#orgKindId").val();
    var params = {
        orgKindId: orgKindId,
        confirmHandler: onSelectedOrgTypeHandler,
        closeHandler: function () {
        },
        isMultipleSelect: "false"
    };
    OpmUtil.showSelectOrgTypeDialog(params);
}

function onSelectedOrgTypeHandler() {
    _self = this;
    var fn = this.iframe.contentWindow.getOrgTypeData;
    var data = fn();
    $("#typeId").val(data[0].id);
    $("#detailCode").val(data[0].code);
    $("#detailName").val(data[0].name);
    $("#longName").val(data[0].name);
    _self.close();
}

function showSelectOrgTempalteDialog() {
    var params = {
        orgKindId: orgKindId,
        confirmHandler: onSelectedOrgTemplateHandler,
        closeHandler: function () {
        },
        lock: false,
        isMultipleSelect: "false"
    };
    OpmUtil.showSelectOrgTemplateDialog(params);
}

function onSelectedOrgTemplateHandler() {
    _self = this;
    var data = this.iframe.contentWindow.getOrgTemplateData();
    if (!data)
        return;
    $("#templateId").val(data[0].id);
    $("#detailCode").val(data[0].code);
    $("#detailName").val(data[0].name);
    $("#longName").val(data[0].name);
    _self.close();
}

/**
* 调整组织架构 
*/
function doAdjustOrg() {
    var params = {};
    params.sourceOrgId = $("#sourceOrgId").val();
    params.destOrgId = $("#destOrgId").val();

    if (!params.sourceOrgId) {
        Public.errorTip("请选择源组织。");
        return;
    }

    if (!params.destOrgId) {
        Public.errorTip("请选择目标组织。");
        return;
    }

    if (params.sourceOrgId == params.destOrgId) {
        Public.errorTip("选择的源组织和目标组织相同。");
        return;
    }
    var _self = this;
    Public.ajax(web_app.name + "/orgAction!adjustOrg.ajax",
         params, function () {
             _self.close();
         });
}

function dialogCloseHandler() {

}

function adjustOrg() {
    UICtrl.showAjaxDialog({ url: web_app.name + "/orgAction!showAdjustOrgDialog.load",
        width: 300, top: 100, ok: doAdjustOrg, title: "调整组织架构", init: initShowAdjustOrgSelectOrgDialog, close: dialogCloseHandler
    });
}

function initShowAdjustOrgSelectOrgDialog() {
    initSelectOrgDialog("#sourceOrgId", "#sourceOrgName");
    initSelectOrgDialog("#destOrgId", "#destOrgName");
}

/**
* 初始化选择组织对话框
*/
function initSelectOrgDialog(elId, elName) {
    var orgName = $(elName);
    var filter = 'ogn,dpt';
    orgName.orgTree({ filter: filter, param: { searchQueryCondition: "org_kind_id in('ogn','dpt')" },
        getParam: function () {
            var mode = this.mode;
            if (mode == 'tree') {//更改树的根节点
                return { a: 1, b: 1, orgRoot: 'orgRoot', searchQueryCondition: "org_kind_id in('ogn','dpt')" };
            } else {
                var param = { a: 1, b: 1 }, condition = ["org_kind_id in ('ogn','dpt')"];
                param['searchQueryCondition'] = condition.join('');
                return param;
            }
        },
        back: {
            text: orgName,
            value: elId,
            id: elId,
            name: orgName
        }
    });
}