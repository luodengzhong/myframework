$(document).ready(function () {
    $.fn.contact = function (options) {
        var contactWay = {};
        var fullContaceWay = {};
        var contactGridManager = null;
        var _this = this;

        if(!options.bizId) {
        	return;
        }
        $.ajax({
            url: web_app + "/contactAction!loadFirstContactWay.ajax",
            data: {bizCode: options.bizCode, bizId: options.bizId},
            dataType: "json",
            async: false,
            type: "post",
            success: function (data) {
            	if(!data.data) return;
                options.contact = data.data.value || "";
            }
        });

        var html = [];
        html.push('<div class="groupContact" style="width: 100%;">');
        html.push('<div class="contact" style="display: block;">');
        if(!options.readonly) {
        	html.push('<span class="manContact" title="维护">&nbsp;</span>');
        }
        html.push('<a class="clickableA" href="##" hidefocus="">' + options.contact + '</a>');
        html.push('</div>');
        html.push('</div>');

        $(_this).empty();
        $(html.join('')).appendTo(_this);
        _this.find("span.manContact").click(function () {
            iniManageContactDialog(options);
        });
        var iniManageContactDialog = function (options) {
            if (!options.bizCode || !options.bizId) {
                Public.tip("bizCode或bizId未找到!");
                return;
            }

            UICtrl.showAjaxDialog({
                title: "维护联系人",
                width: 800,
                height: 400,
                url: web_app.name + '/contactAction!forwardToShowContact.load',
                param: {
                    bizCode: options.bizCode,
                    bizId: options.bizId
                },
                init: options.initHandler || function () {
                    doInit(options)
                },
                ok: options.okHandler || doSaveContact,
                close: options.closeHandler || doDialogClose
            });
        };

        var doInit = function (options) {
            var params = {bizCode: options.bizCode};
            $.ajax({
                url: web_app + "/contactAction!queryAvailableContactWay.ajax",
                data: params,
                dataType: "json",
                async: false,
                type: "post",
                success: function (data) {
                    $.each(data.data.Rows, function (index, item) {
                        fullContaceWay[item.key] = item.name;
                        if (item.status == '1') {
                            contactWay[item.key] = item.name;
                        }
                    });
                }
            });


            var contactId = $("#contactId").val();
            var toolbarOptions = UICtrl.getDefaultToolbarOptions({
                addHandler: doAddContactHandler,
                deleteHandler: doDeleteContactHandler
            });

            contactGridManager = UICtrl.grid('#contactWayList', {
                columns: [
                    {display: "类型", name: "key", width: 120, minWidth: 60, type: "string", align: "left",
                        editor: { type: 'combobox', data: contactWay, required: true},
                        render: function (item, index, columnValue, columnInfo) {
                            item.name = fullContaceWay[columnValue] || item.name;
                            return fullContaceWay[columnValue] || item.name;
                        }
                    },
                    {display: "联系方式", name: "value", width: 300, minWidth: 60, type: "string", align: "left",
                        editor: { type: 'text', required: true}
                    },
                    {display: "排序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
                        editor: { type: 'spinner', min: 1, max: 100, mask: 'nnn'},
                        render: function (item) {
                            return UICtrl.sequenceRender(item);
                        }
                    }
                ],
                url: web_app.name + '/contactAction!queryContactWay.ajax',
                parms: {
                    bizCode: options.bizCode,
                    bizId: options.bizId,
                    contactId: contactId
                },
                usePager: false,
                sortName: "sequence",
                SortOrder: "asc",
                toolbar: toolbarOptions,
                width: '99.8%',
                height: '90d%',
                heightDiff: -13,
                headerRowHeight: 25,
                rowHeight: 25,
                checkbox: true,
                fixedCellHeight: true,
                enabledEdit: true,
                selectRowButtonOnly: true,
                autoAddRowByKeydown: false
            });
        };

        var doDeleteContactHandler = function () {
            var rows = contactGridManager.getSelectedRows();
            if (!rows || rows.length == 0) {
                Public.tip("请选择你要删除的数据!");
                return;
            }
            contactGridManager.deleteSelectedRow();
        }

        var doAddContactHandler = function () {
            UICtrl.addGridRow(contactGridManager);
        }

        var doSaveContact = function () {
        	contactGridManager.endEdit();
            var params = {};
            var rows = contactGridManager.rows;
            if (rows) {
                params.contactWayList = encodeURI($.toJSON(rows));
            }

            $('#contactSubmitForm').ajaxSubmit({url: web_app.name + '/contactAction!saveContactWay.ajax',
                param: params,
                success: function (data) {
                    if (rows) {
                        var rowTmp = null;
                        var minSequence = 99999;
                        $.each(rows, function (index, rowL) {
                            if (minSequence > rowL.sequence) {
                                rowTmp = rowL;
                                minSequence = rowL.sequence;
                            }
                        });
                        if (rowTmp) {
                            _this.find("a.clickableA").html(rowTmp.value);
                        }
                    }
                }
            });
        };

        var doDialogClose = function () {

        };
    }
});

