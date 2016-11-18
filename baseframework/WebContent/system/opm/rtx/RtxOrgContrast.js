var treeManager, gridManager, parentId, orgKindId, parentOrgKindId, refreshFlag;

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

        $("#showDisabledOrg,#showVirtualOrg").click(function () {
            parentId = "orgRoot";
            refreshNode();
            reloadGrid2();
        });
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(
        		{saveHandler: saveRtxOrgConstrast,
                 deleteHandler: deleteRtxOrgConstrast
                 });
        
        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                { display: "组织全路径", name: "fullName", width: 300, minWidth: 60, type: "string", align: "left" },
                { display: "RTX组织全路径", name: "rtxDeptFullName", width: 300, minWidth: 60, maxWidth: 600, type: "string", align: "left",
                	editor: { type: 'text' }
				}				
            ],
            dataAction: "server",
            url: web_app.name + "/orgAction!slicedQueryOrgs.ajax",
            parms: { parentId: "orgRoot", rtxOrgContrast: 1 },
            pageSize: 20,
            sortName: 'fullSequence',
            sortOrder: 'asc',
            toolbar: toolbarOptions,
            width: "99.8%",
            height: "100%",
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            enabledEdit: true,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true
        });
    }
});




function saveRtxOrgConstrast() {
	var url = web_app.name + '/orgAction!saveRtxOrgContrast.ajax';
	 
	var data = DataUtil.getGridData({ gridManager: gridManager });
    if (!data) {
        return false;
    }

    Public.ajax(url,
        { data: encodeURI($.toJSON(data)) }, function () {
        	gridManager.loadData();
        }
    );
}

function deleteRtxOrgConstrast(){
	var url = web_app.name + '/orgAction!deleteRtxOrgContrast.ajax';
    DataUtil.delSelectedRows({ action: url,
        idFieldName: "orgContrastId",
        gridManager: gridManager,
        onSuccess: function () {
            gridManager.loadData();
        }
    });
}

function isShowDisabledOrg(){
	return $("#showDisabledOrg").is(":checked") ? 1 : 0;
}

function isShowVirtualOrg(){
	return $("#showVirtualOrg").is(":checked") ? 1 : 0;
}

function loadOrgTreeView() {
    if (treeManager)
        treeManager.clear();

    Public.ajax(web_app.name + "/orgAction!queryOrgs.ajax", {
        parentId: parentId,
        showDisabledOrg:  isShowDisabledOrg(),
        displayableOrgKinds: "ogn,fld,prj,dpt,grp,pos,psm",
        showVirtualOrg: isShowVirtualOrg(),
        showPosition: 1,
        rtxOrgContrast: 1
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
                displayableOrgKinds: "ogn,fld,prj,dpt,grp,pos,psm",
                showDisabledOrg: isShowDisabledOrg(),
                showVirtualOrg:  isShowVirtualOrg(),
                showPosition: 1,
                rtxOrgContrast: 1
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
            orgKindId: "ogn,fld,prj,dpt,grp,pos,psm,fun",
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