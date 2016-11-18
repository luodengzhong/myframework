var gridManager = null, flag = false;
$(document).ready(function () {
    $("#contactDIV").contact({bizId: '123123123_01', bizCode: "test"});
    $("#contactDIV2").contact({bizId: '123123123_02', bizCode: "test"});

    $('#hahaha').comboDialog({type: 'test', name: 'test001', dataIndex: 'test01', checkbox: true, onChoose: function () {
        show();
        var rows = this.getSelectedRows();
        var tree = this.getSelectedTreeNode();
        alert($.toJSON(tree));
        return true;
    }});
    //$('#hahaha').searchbox({type:'test',name:'test001',callBackControls:{operatorname:'#main_createbyname',userid:'#main_createby'}});
    $('#testFileList').fileList({afterUpload:function(a){}});

    $('#testToolBar').toolBar([
        {id: 'aaasssss', name: '测试', icon: 'add', event: function () {
            window.open(web_app.name + '/demoAction!createPdf.load');
        }},
        {line: true},
        {name: '测试01', event: 'test01'}
    ]);
    //$('#testFileList').fileList();
    $('#testTableFileList').fileList();
//	    $('#testTableFileList').fileList('disable');
    //var dd=$('#filename').combox('getFormattedData');
    //alert($.toJSON(dd));
    var treeData = [
        { "text": "节点1", "children": [
            { "text": "节点1.1" },
            { "text": "节点1.2" },
            { "text": "节点1.3", "children": [
                { "text": "节点1.3.1", "children": [
                    { "text": "节点1.3.1.1" },
                    { "text": "节点1.3.1.2" }
                ]
                },
                { "text": "节点1.3.2" }
            ]
            },
            { "text": "节点1.4" }
        ]
        },
        { "text": "节点2" },
        { "text": "节点3" },
        { "text": "节点4" }
    ];
    //$('#testTree').treebox({treeLeafOnly: true, name: 'org' });
    $('#testTree').orgTree({filter: 'dpt', param: {searchQueryCondition: "org_kind_id in('ogn','dpt')"}});
    var dataCombox = {1: 'a', 2: 'b', 3: 'c'};
    //$('#testCheckbox').combox({data:dataCombox,checkbox: true});
    //$('#testCheckbox').searchbox({type:'sys',name:'extendedFieldDefine',back:{defineId:'#testHidden',fieldCname:'#testCheckbox'}});
    $('#testCheckbox').searchbox({type: 'hr', width: 500, name: 'payChangeChoosePerson', back: {wageStandard: '#testHidden', wageStandard: '#main_sourcetable'}});
    $('#testdictionary').remotebox({ name: 'degree', checkbox: true, lookUpValue: '高中'});
    $('#testTreeSearch').orgTree({filter: 'dpt'});
    // UICtrl.disable($('#testCheckbox'));
    setTimeout(function(){
    	UICtrl.enable($('#main_bill_code'));
    },0);
    $('#main_bill_code').mask('nnnnnn',{number:true,onWriteBuffer:function(v){
    	if(v=='111111'){alert('aaa');}
    }});
    
});
function test01() {
    //alert($('#testTree').val());
	//Public.ajax(web_app.name + "/demoAction!testDoLeavePerson.ajax",{serialId:17446});
}
function getId(){
	return 0;
}
function show() {
    alert("show");
}
function initializeGrid() {
    UICtrl.autoSetWrapperDivHeight();
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({ addHandler: addHandler, updateHandler: updateHandler, deleteHandler: deleteHandler });
    gridManager = UICtrl.grid('#maingrid', {
        columns: [
            { display: "表名", name: "sourcetable", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "路径", name: "path", width: 160, minWidth: 60, type: "int", align: "center"},
            { display: "文件名", name: "filename", width: 160, minWidth: 60, type: "string", align: "left"},
            { display: "备注", name: "remark", width: 150, minWidth: 60, type: "string", align: "left", hide: 1 },
            { display: "创建时间", name: "createdate", width: 80, minWidth: 60, type: "date", align: "left"},
            { display: "创建人", name: "createbyname", width: 150, minWidth: 60, type: "string", align: "left"}
        ],
        dataAction: 'server',
        url: web_app.name + '/demoAction!query.ajax',
        pageSize: 20,
        width: '100%',
        height: '100%',
        heightDiff: -5,
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'sourcetable',
        sortOrder: 'asc',
        toolbar: toolbarOptions,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        onDblClickRow: function (data, rowindex, rowobj) {
            // top.AddTabItem(null, '修改应用程序',
            // 'System/ApplicationDetail.aspx?ApplicationID=' +
            // data.ApplicationID);
        },
        onAfterShowData: function () {
            //Public.setGridColumnAutoWidth(gridManager);
        }
    });
   
}

// 查询
function query(obj) {
    var param = $(obj).formToJSON();
    alert($.toJSON(param));
    return;
    UICtrl.gridSearch(gridManager, param);
}

function reloadGrid() {
    gridManager.loadData();
}

function resetForm(obj) {
    //$(obj).formClean();
    //Public.ajax(web_app.name + "/hrArchivesAction!saveInitArchivesPicture.ajax",{serialId:318770});
	//测试制度奖罚抄送任务
	//Public.ajax(web_app.name + "/hRrewardPunishAction!testCopyTask.ajax");
	//处理审批通过后未及时修改档案及架构的数据(临时处理时使用)
	//Public.ajax(web_app.name + "/structureAdjustmentAction!testUpdateOmit.ajax");
	//Public.ajax(web_app.name + "/rtx!setMsgTest.ajax");
	//testWebOffice();
	//Public.ajax(web_app.name + "/hrRosterAction!copyPersonPicture.ajax");
	//Public.ajax(web_app.name + "/hrArchivesAction!saveComputeRuleTest.ajax");
}
function testWebOffice(){
	//以打开窗口的形式打开一个新窗口（存在session丢失的问题，所以暂时不用这种方式）
	var screenWidth = window.screen.availWidth;
	var screenHeight = window.screen.availHeight;
	var width = (screenWidth - 10);
	var height = (screenHeight - 20);
	var feature = 'location=no,menubar=no,resizable=yes,scrollbars=no';
	feature += ',status=no,titlebar=no,toolbar=no,fullscreen=no';
	feature += ',width='+width+'px,height='+height+'px';
	feature += ',left=0px,top=0px';
	window.open(web_app.name + "/attachmentAction!forwardWebOffice.load?id=37573683&isReadOnly=true",'_blank',feature);
}

//.do :进入页面
//.load ajax加载页面
//.ajax 普通的ajax操作

function addHandler() {
    UICtrl.showAjaxDialog({url: web_app.name + '/demoAction!showDtl.load', width: 900, ok: save, close: dialogClose, init: function (doc) {
        //$('div.ui-form-container > div',doc).sortDrag();
        $('#extendedFieldDiv').extendedField({businessCode: '01'});
        $('#aaaaaa').uploadButton();
        UICtrl.disable($('#createdate'));
    }});
}

function updateHandler() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip('请选择数据！');
        return;
    }
    UICtrl.showAjaxDialog({url: web_app.name + '/demoAction!load.load', width: 900, param: {id: row.id}, ok: update, close: dialogClose});
}

function deleteHandler() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip('请选择数据！');
        return;
    }
    UICtrl.confirm('确定删除吗?', function () {
        Public.ajax(web_app.name + '/demoAction!delete.ajax', {id: row.id}, function () {
            reloadGrid();
        });
    });
}

function save() {
    var _self = this;
    $('#submitForm').ajaxSubmit({url: web_app.name + '/demoAction!save.ajax',
        param: $('#extendedFieldDiv').extendedField('getExtendedFieldValue'),
        success: function () {
            _self.close();
            flag = true;
        }
    });
}

function update() {
    $('#submitForm').ajaxSubmit({url: web_app.name + '/demoAction!update.ajax',
        success: function () {
            flag = true;
        }
    });
}

function dialogClose() {
    if (flag) {
        reloadGrid();
        flag = false;
    }
}
function updateArchivesByBillCode(){
	var billCode=$('#main_bill_code').val();
	if(billCode==''){
		return;
	}
	Public.ajax(web_app.name + '/hRPayChangeAction!updateArchivesByBillCode.ajax', {billCode:billCode});
}