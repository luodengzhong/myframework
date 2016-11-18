<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html xmlns="http://www.w3.org/1999/xhtml" class="layout-2">
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>
    <link href="<c:url value='/themes/default/archive.css'/>" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="<c:url value='/pa/projectmanage/description.js'/>"></script>
    <script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
    <script src="<c:url value='/lib/ligerUI/ligerui.min.js'/>" type="text/javascript"></script>
    <script src="<c:url value='/pa/projectmanage/archiveManager.js'/>"  type="text/javascript"></script>
    <script src="<c:url value='/pa/pautil.js'/>"  type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.attachment.js"/>'
            type="text/javascript"></script>

    <title>项目管理</title>
</head>
<body draggable="false">
<div class="Bdy">
    <div class="tab clearfix">
        <div class="order-menu clearfix">
				<span class="no-bl selected" tab-type="tab-nav" id="tab_project">项目
				</span> <span id="tab_archive" style="" tab-type="tab-nav">档案 </span>
        </div>
    </div>
    <div class="mainT"></div>
    <div id="mainer" class="noSelect loading2">
        <div style="display: block;" id="projectbox" class="main dn">
            <div class="maint">
                <div class="mainH operatebar" id="project-operatebar">
                    <ul class="operate operate-group">
                        <li class="operate">
                            <button data-ca="operatebar-back" class="btn back"
                                    id="projectback" title="返回">
                                <i class="i"></i>
                            </button>
                        </li>
                    </ul>
                    <ul style="display: none;"
                        class="selected-operate operate-group border-l dn">
                    </ul>
                    <div class="switch-view">
                        <a data-ca="switchView-category" href="javascript:void(0)"
                           id="switchView-category" class="list list-selected"
                           title="切换到项目分类模式"> </a> <a data-ca="switchView-headquarter"
                                                      id="switchView-headquarter" href="javascript:void(0)"
                                                      class="icon" title="切换到指挥部模式"> </a>
                    </div>
                </div>
                <div class="mainH2 search-bar" id="project-search-bar">
                    <div class="path" id="project-path"></div>
                    <div class="search" id="search">
                        <input id="projectNameText" class="txt" type="text"
                               title="输入文件名搜索">
                        <button data-ca="search-btn" class="search-submit"></button>
                        <button class="search-cancel"></button>
                        <%-- <p class="placeholder">
                        输入文件名搜索
                    </p>--%>
                    </div>
                </div>
            </div>
            <div class="content">
                <div style="display: block;" class="list-view" id="project-list">
                    <table class="tbl">
                        <thead>
                        <tr>
                            <th class="col_cbox"><span class="checkbox"></span></th>
                            <th class="col_fname name">名称</th>
                            <th class="col_ftype size">类型</th>
                        </tr>
                        </thead>
                        <tbody class="list-data-container">
                        </tbody>
                    </table>
                    <ul style="display: none;"
                        class="dropMenu dropMenuAbs contextmenu">
                    </ul>
                </div>
                <div style="top: 76px; left: 117px; display: none;" id="drag-files">
                </div>
                <div style="top: 157px; left: 104px; display: none;" id="drag-area">
                </div>
            </div>
        </div>
        <div style="display: none;" id="archivebox" class="main dn">
            <div class="maint">
                <div class="mainH operatebar" id="archive-operatebar">
                    <ul class="operate operate-group">
                        <li class="operate">
                            <button data-ca="operatebar-back" class="btn back"
                                    id="archiveback" title="返回">
                                <i class="i"></i>
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="mainH2 search-bar" id="archive-search-bar">
                    <div class="path" id="archive-path"></div>
                    <div class="search">
                        <input id="fileNameText" class="txt" type="text" title="输入文件名搜索">
                        <button data-ca="search-btn" class="search-submit"></button>
                        <button class="search-cancel"></button>
                        <%--<p class="placeholder">
                        输入文件名搜索
                    </p>--%>
                    </div>
                </div>
            </div>
            <div class="content">
                <div style="display: block;" class="list-view" id="archive-list">
                    <table class="tbl">
                        <thead>
                        <tr>
                            <th class="col_cbox"><span class="checkbox"></span></th>
                            <th class="col_fname name">名称</th>
                            <th class="col_ftype size">节点名称</th>
                            <th class="col_ftype size">类型</th>
                            <th class="col_fsize size">文件大小</th>
                            <th class="col_oper">经办人</th>
                            <th class="col_date date">办理时间</th>
                        </tr>
                        </thead>
                        <tbody class="list-data-container">
                        </tbody>
                    </table>
                    <ul style="display: none;"
                        class="dropMenu dropMenuAbs contextmenu">
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</body>

</html>