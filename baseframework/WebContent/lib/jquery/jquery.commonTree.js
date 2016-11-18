/*---------------------------------------------------------------------------*\
 |  title:         通用文件夹树                                                                                                                                   |
 |  Author:        xiexin                                                      |
 |  Created:       2014-01-24                                                  |
 |  Description:   公用树操作包含树节点编辑等操作                                                                                     |
 \*---------------------------------------------------------------------------*/
(function ($) {
    $.fn.commonTree = function (op) {
        var obj = this.data('ui-common-tree');
        if (!obj) {
            new CommonTree(this, op);
        } else {
            if (typeof op == "string") {
                var _self = this, value= null, args = arguments;
                $.each(['refresh', 'getSelectedId', 'getSelected','getChecked','cancelSelect'], function (i, m) {
                    if (op == m) {
                        args = Array.prototype.slice.call(args, 1);
                        value = obj[m].apply(obj, Array.prototype.concat.call([_self], args));
                        return false;
                    }
                });
                return value;
            } else {
                obj.set(op);
            }
        }
        return this;
    };
    //公用树类定义
    function CommonTree(el, op) {
        this.options = {};
        this.treeManager = null;//树结构管理对象
        this.treeMenu = null;//菜单管理对象
        this.id = null;//当前选中节点ID
        this.kindId = null;//当前选中节点类别ID
        this.refreshType = 0;//是否刷新树节点
        this.selectNodeId = null;
        this.set(op);
        this.init(el);
        $(el).data('ui-common-tree', this);
    }

    $.extend(CommonTree.prototype, {
        set: function (op) {
            this.options = $.extend({
                loadTreesAction: 'configurationAction!loadCommonTrees.ajax',
                addFolderAction: 'configurationAction!forwardCommonTreeDetail.load',
                appendAction: 'configurationAction!insertCommonTree.ajax',
                loadNodeAction: 'configurationAction!loadCommonTreeNode.load',
                updateAction: 'configurationAction!updateCommonTree.ajax',
                deleteAction: 'configurationAction!deleteCommonTree.ajax',
                updateSequenceAction: 'configurationAction!updateCommonTreeSequence.ajax',
                dialogWidth:300,
                root: 'Rows',
                idFieldName: 'id',
                parentIDFieldName: 'parentId',
                textFieldName: "name",
                iconFieldName: "nodeIcon",
                sortnameParmName: 'sortname',        //页排序列名(提交给服务器)
                sortorderParmName: 'sortorder',      //页排序方向(提交给服务器)
                sortName: 'sequence',//排序列名
                sortOrder: 'asc',//排序方向
                manageType:null,//查询使用的管理权限类别
                nodeWidth: 180,
                getParam: null,//动态获取参数方法
                kindId: 1,
                parentId: 0,
                onClick: null,
                onAfterAppend: null,
                changeNodeIcon: null,
                onbeforeShowMenu: null,
                onDelay:null,
                dataRender: null,
                isLeaf: null,
                menuName:'文件夹',
                IsShowMenu: true //是否显示菜单
            }, this.options, op || {});
        },
        init: function (el) {
            var opt = this.options, _self = this;
            var menuName=opt.menuName
            if (opt.IsShowMenu) {
                this.treeMenu = UICtrl.menu({ top: 100, left: 100, width: 120,
                    items: [
                        { id: "menuAdd", text: '新建'+menuName, click: function () {
                            _self._addFolder();
                        }, icon: "add" },
                        { id: "menuUpdate", text: '修改'+menuName, click: function () {
                            _self._updateFolder();
                        }, icon: "edit" },
                        { id: "menuLine1", line: true },
                        { id: "menuDelete", text: '删除'+menuName, click: function () {
                            _self._deleteFolder();
                        }, icon: "delete" },
                        { id: "menuLine2", line: true },
                        { id: "menuRefresh", text: '刷新', click: function () {
                            var node = _self.treeManager.getSelected();
                            if (node) {
                                _self._refreshNode(node.target);
                            }
                        }, icon: "refresh" },
                        { id: "menuLine2", line: true },
                        { id: "menuUp", text: '上移', click: function () {
                            _self._moveFolder(true);
                        }, icon: "arrow_up" },
                        { id: "menuDown", text: '下移', click: function () {
                            _self._moveFolder(false);
                        }, icon: "arrow_down" }
                    ]
                });
            }
            this.kindId = opt.kindId;
            var param = {kindId: opt.kindId};
            param[opt.parentIDFieldName]=opt.parentId;
            param[opt.sortnameParmName] = opt.sortName;
            param[opt.sortorderParmName] = opt.sortOrder;
            if(opt.manageType){
            	param[Public.manageTypeParmName] = opt.manageType;
            }
            if ($.isFunction(opt.getParam)) {
                var p = opt.getParam.call(this);
                param = $.extend(param, p || {});
            }
            
            _self.treeManager = UICtrl.tree(el, {
                url: web_app.name + '/' + opt.loadTreesAction,
                param: param,
                idFieldName: opt.idFieldName,
                parentIDFieldName: opt.parentIDFieldName,
                textFieldName: opt.textFieldName,
                iconFieldName: opt.iconFieldName,
                autoCheckboxEven:opt.autoCheckboxEven||false,
                nodeWidth: opt.nodeWidth,
                checkbox:opt.checkbox||false,
                dataRender: function (data) {
                    if ($.isFunction(opt.dataRender)) {
                        return opt.dataRender.call(_self, data);
                    }
                    return data[opt.root];
                },
                isLeaf: function (data) {
                    if ($.isFunction(opt.changeNodeIcon)) {
                        opt.changeNodeIcon.call(_self, data);
                    }
                    if ($.isFunction(opt.isLeaf)) {
                        return opt.isLeaf.call(_self, data);
                    }
                    data.children = [];
                    return parseInt(data.hasChildren) == 0;
                },
                onClick: function (node, obj) {
                    if (!$(obj).is('span')&&!$(obj).hasClass('l-checkbox')) return;
                    //if(_self.id != node.data.id){
                    if (node.data[opt.parentIDFieldName] == -1) {
                        _self.id = 0;
                    } else {
                        _self.id = node.data[opt.idFieldName];
                    }
                    if ($.isFunction(opt.onClick)) {
                        opt.onClick.call(_self, node.data, _self.id, obj);
                    }
                    //}
                },
                onContextmenu: function (node, e) {
                    return _self._onContextmenu.call(_self, node, e);
                },
                delay: function (e) {
                	if($.isFunction(opt.onDelay)){
                		return opt.onDelay.call(this,e,opt);
                	}
                    var param = {};
                    param[opt.parentIDFieldName]=e.data[opt.idFieldName];
                    param[opt.sortnameParmName] = opt.sortName;
                    param[opt.sortorderParmName] = opt.sortOrder;
                    if(opt.manageType){
                    	param[Public.manageTypeParmName] = opt.manageType;
                    }
                    if ($.isFunction(opt.getParam)) {
                        var p = opt.getParam.call(this, e.data);
                        param = $.extend(param, p || {});
                    }
                    return { url: web_app.name + '/' + opt.loadTreesAction, parms: param};
                },
                onAfterAppend: function (node) {
                    if (_self.selectNodeId) {
                        setTimeout(function () {
                            _self.treeManager.selectNode(_self.selectNodeId);
                            _self.selectNodeId = null;
                        }, 0);
                    }
                }
            });
        },
        /*显示右键菜单*/
        _onContextmenu: function (node, e) {
            var opt = this.options;
            if (!opt.IsShowMenu) {
                return false;
            }
            if ($.isFunction(opt.onbeforeShowMenu)) {
                if (opt.onbeforeShowMenu.call(this, node) === false) {
                    return false;
                }
            }
            if (!this.treeMenu) return false;
            if (node.data.nodeUrl && node.data.nodeUrl == 'Folder') {
                this.id = node.data[opt.idFieldName];
                this.kindId = node.data.kindId;
                if (node.target.className == "l-first l-last l-onlychild ") {
                    this.treeMenu.setEnable("menuUp");
                    this.treeMenu.setDisable("menuDown");
                }
                if (node.target.className.indexOf('l-onlychild') >= 0) {
                    this.treeMenu.setDisable("menuUp");
                    this.treeMenu.setDisable("menuDown");
                } else if (node.target.className.indexOf('l-first') >= 0) {
                    this.treeMenu.setDisable("menuUp");
                    this.treeMenu.setEnable("menuDown");
                } else if (node.target.className.indexOf('l-last') >= 0) {
                    this.treeMenu.setEnable("menuUp");
                    this.treeMenu.setDisable("menuDown");
                } else {
                    this.treeMenu.setEnable("menuUp");
                    this.treeMenu.setEnable("menuDown");
                }
                this.treeMenu.show({top: e.pageY, left: e.pageX});
                var oldNode = this.treeManager.getSelected();
                if (oldNode) {
                    this.treeManager.cancelSelect(oldNode.target);
                }
                this.treeManager.selectNode(node.target);
            }
            return false;
        },
        /*新增节点*/
        _addFolder: function () {
            var opt = this.options, _self = this;
            var menuName=opt.menuName
            UICtrl.showAjaxDialog({
                url: web_app.name + "/" + opt.addFolderAction,
                param: {parentId: _self.id},
                title: "添加"+menuName,
                width: opt.dialogWidth,
                ok: function (doc) {
                    var dialog = this;
                    $('form:first', doc).ajaxSubmit({url: web_app.name + '/' + opt.appendAction,
                        param: {parentId: _self.id, kindId: _self.kindId},
                        success: function (data) {
                            _self.selectNodeId = data;
                            _self.refreshType = 2;
                            dialog.close();
                        }
                    });
                },
                close: function () {
                    _self._onDialogClose();
                }
            });
        },
        /*编辑节点*/
        _updateFolder: function () {
            var opt = this.options, _self = this;
            var menuName=opt.menuName
            UICtrl.showAjaxDialog({
                url: web_app.name + "/" + opt.loadNodeAction,
                param: {id: _self.id},
                title: "修改"+menuName,
                width: opt.dialogWidth,
                ok: function (doc) {
                    var dialog = this;
                    $('form:first', doc).ajaxSubmit({url: web_app.name + '/' + opt.updateAction,
                        param: {id: _self.id},
                        success: function (data) {
                            _self.refreshType = 1;
                            dialog.close();
                        }
                    });
                },
                close: function () {
                    _self._onDialogClose();
                }
            });
        },
        _onDialogClose: function () {
            if (this.refreshType > 0) {
                var node = this.treeManager.getSelected();
                if (node) {
                    if (this.refreshType == 1) this.selectNodeId = node.data.id;
                    if (this.id > 1) {
                        var parentNode = this.treeManager.getParentTreeItem(node.target);
                        this._refreshNode(parentNode);
                    } else {
                        this._refreshNode(node.target);
                    }
                }
            }
        },
        /*删除节点*/
        _deleteFolder: function () {
            var opt = this.options, _self = this;
            UICtrl.confirm('确定删除吗?', function () {
                Public.ajax(web_app.name + '/' + opt.deleteAction, {id: _self.id, kindId: _self.kindId}, function () {
                    if (_self.treeManager) {
                        var node = _self.treeManager.getSelected();
                        if (node) {
                            var parentNode = _self.treeManager.getParentTreeItem(node.target);
                            var parentData = _self.treeManager.getNodeData(parentNode);
                            if (parentData.children.length == 1) {
                                try {
                                    parentNode = _self.treeManager.getParent(parentData.treedataindex);
                                } catch (e) {
                                    alert(e.message);
                                }
                            }
                            _self.selectNodeId = parentData.id;
                            _self.refreshType = 1;
                            _self._refreshNode(parentNode);
                            if (_self.id == node.data.id) {
                                if ($.isFunction(opt.onClick)) {
                                    opt.onClick.call(_self, parentData, parentData.id);
                                }
                                _self.id = null;
                            }
                        }
                    }
                });
            });
        },
        /*刷新节点*/
        _refreshNode: function (parentNode) {
            var opt = this.options, _self = this;
            var parentData = _self.treeManager.getNodeData(parentNode);
            parentData = parentData ? parentData : _self.treeManager.getDataByID(_self.id);
            if (parentData) {
                if (parentData.children && parentData.children.length > 0) {
                    for (var i = 0; i < parentData.children.length; i++) {
                        _self.treeManager.remove(parentData.children[i].treedataindex);
                    }
                }
                var param = {kindId: _self.kindId, parentId: parentData[opt.idFieldName]};
                param[opt.sortnameParmName] = opt.sortName;
                param[opt.sortorderParmName] = opt.sortOrder;
                if ($.isFunction(opt.getParam)) {
                        var p = opt.getParam.call(this, parentData);
                        param = $.extend(param, p || {});
                }
                Public.ajax(web_app.name + '/' + opt.loadTreesAction, param, function (data) {
                    if (parentData.id == _self.kindId && !(parentData.children && parentData.children.length > 0)) {
                        if (parseInt(parentData.hasChildren) == 0) {
                            _self.treeManager.append(parentData, data[opt.root]);
                        }
                    } else {
                        if (!data[opt.root] || data[opt.root].length == 0) {
                            var pn = _self.treeManager.getParent(parentData.treedataindex);
                            if (pn) {
                                _self._refreshNode(pn);
                            }
                        } else {
                            _self.treeManager.append(parentData, data[opt.root]);
                        }
                    }
                    if (_self.refreshType == 2) {
                        setTimeout(function () {
                            _self.treeManager.selectNode(_self.id);
                            var node = _self.treeManager.getSelected();
                            if (node) {
                                var treeitembtn = $("div.l-body:first", $(node.target)).find("div.l-expandable-open:first,div.l-expandable-close:first");
                                if (treeitembtn.hasClass('l-expandable-close')) {
                                    treeitembtn.click();
                                }
                            }
                        }, 0);
                    } else if (_self.refreshType == 1) {
                        if (_self.selectNodeId) {
                            setTimeout(function () {
                                _self.treeManager.selectNode(_self.selectNodeId);
                                _self.selectNodeId = null;
                            }, 0);
                        }
                    }
                    _self.refreshType = 0;
                });
            }
        },
        /*移动节点*/
        _moveFolder: function (flag) {
            var opt = this.options, _self = this,node=null;
            var params = new Map(), moveNode;
            if (_self.treeManager) {
                node = _self.treeManager.getSelected();
                if (node) {
                    if (flag) {
                        moveNode = _self.treeManager.getNodeData($(node.target).prev());
                    } else {
                        moveNode = _self.treeManager.getNodeData($(node.target).next());
                    }
                    if (moveNode) {
                        params.put(node.data.id, moveNode.sequence);
                        params.put(moveNode.id, node.data.sequence);
                    }
                    _self.refreshType = 1;
                    _self.selectNodeId = node.data.id;
                }
            }
            if (params.isEmpty()) {
                return;
            }
            Public.ajax(web_app.name + '/' + opt.updateSequenceAction, {data: params.toString()}, function () {
                var parentNode = _self.treeManager.getParentTreeItem(node.target);
                _self._refreshNode(parentNode);
            });
        },
        refresh: function (el, id,type) {
            var pid = id;
            if (Public.isBlank(pid)) {
                var index= $(el).find('> li.l-first').attr('treedataindex');
            	var treenodedata = this.treeManager._getDataNodeByTreeDataIndex(this.treeManager.data, index);
            	if(treenodedata){
            		pid=treenodedata[this.options.idFieldName];
            	}
            }
            if (!Public.isBlank(type)) {
            	this.refreshType=type;
            }
            this.id = pid;
            this._refreshNode();
        },
        getSelectedId: function () {
            var node = this.treeManager.getSelected();
            if (node) {
                return node.data[this.options.idFieldName];
            }
            return null;
        },
        getSelected: function () {
            var node = this.treeManager.getSelected();
            if (node) {
                return node.data;
            }
            return null;
        },
        cancelSelect:function(node){
        	this.treeManager.cancelSelect(node);
        },
        getChecked:function(){
        	return this.treeManager.getChecked();
        }
    });
})(jQuery);
/* 文件夹类型 */
var CommonTreeKind = CommonTreeKind || {};
/* 机构 */
CommonTreeKind.OrgType = 1;
/* 部门 */
CommonTreeKind.DptType = 2;
/* 岗位 */
CommonTreeKind.PosType = 3;
/* 角色 */
CommonTreeKind.Role = 4;
/* 扩展属性定义 */
CommonTreeKind.ExtendedFieldDefine = 5;
/* 扩展属性分组 */
CommonTreeKind.ExtendedFieldGroup = 6;
/* 系统参数 */
CommonTreeKind.Parameter = 7;
/* 单据编号 */
CommonTreeKind.SerialNumber = 8;
/* 系统字典 */
CommonTreeKind.Dictionary = 9;
/*数据导入模板分类*/
CommonTreeKind.ExpTemplet = 10;
/* 人事子集分类 */
CommonTreeKind.HRDetailDefine = 11;
/* 人事主集字段分组 */
CommonTreeKind.HRArchivesFieldGroup = 12;
/* 建筑指标 */
CommonTreeKind.BuildingIndicator = 13;
/*招聘岗位分类*/
CommonTreeKind.RecruitPos=14;
/*消息提醒分类*/
CommonTreeKind.MessageRemind=15;
/*权限字段分类*/
CommonTreeKind.PermissionField=16;
/*基础管理权限分类*/
CommonTreeKind.BaseManagementType=17;
/*业务管理权限分类*/
CommonTreeKind.BizManagementType=18;
/*指标库分类*/
CommonTreeKind.PaIndexType = 19;
/*简历分类*/
CommonTreeKind.PersonRegisterType=20;
/*附件配置分类*/
CommonTreeKind.AttachmentConfig=21;
/*任务类别分类*/
CommonTreeKind.TaskKind=22;
/*考勤机分类*/
CommonTreeKind.AttKind=23;
/*异动类别与系统字典reshuffleType对应分类*/
CommonTreeKind.reshuffleType=24;
/*用户分组设置*/
CommonTreeKind.UserGroupKind=25;
/*信息反馈模板分类*/
CommonTreeKind.InfoFeedbackTemplate=26;
/*基础段类型*/
CommonTreeKind.BaseSegmentationType=27;
/*业务段类型*/
CommonTreeKind.BizSegmentationType=28;
/*会议类型分类*/
CommonTreeKind.MeetingKind=29;
/*请示报告类型分类*/
CommonTreeKind.AskReportKind=30;
/* 培训课程类别*/
CommonTreeKind.TrainingCourseType=31;
/*HR职能分类*/
CommonTreeKind.Responsibilitiykind=32;
/*基础职能角色*/
CommonTreeKind.BaseFunctionType = 33;
/*离职分类*/
CommonTreeKind.resignationType = 34;
/*费用分类*/
CommonTreeKind.feeKind = 35;
/*业务分类*/
CommonTreeKind.businessKind = 36;
/*单据编号规则分类*/
CommonTreeKind.dispatchKindType = 37;
/*审计类别分类*/
CommonTreeKind.AuditReportKind = 38;
/*项目典型案例分类*/
CommonTreeKind.ProjectTypicalCaseKind = 39;
/*业务导图分类*/
CommonTreeKind.OperationMapKind = 40;
/*法律风险检查项目*/
CommonTreeKind.lawRiskCheckIndexKind = 41;
/*微信消息发送类别*/
CommonTreeKind.weixinMessageKind = 50;
/*客户系统 问题分类*/
CommonTreeKind.csmProblemTask = 60;
/*客户系统 标准问题库*/
CommonTreeKind.csmProblemLib = 61;
/*招采战略业务类别*/
CommonTreeKind.tpStrategyBusinessKind = 62