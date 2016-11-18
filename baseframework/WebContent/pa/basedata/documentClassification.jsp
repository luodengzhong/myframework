<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/pa/basedata/documentClassification.js"/>' type="text/javascript"></script>
    <title>文档类别管理</title>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <div id="layout">
            <div position="left" title="文档类别树" id="mainmenu">
                <div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
                     id="divTreeArea">
                    <ul id="maintree">
                    </ul>
                </div>
            </div>
            <div position="center" title="文档类别列表">
                <x:title title="搜索" hideTable="queryTable"/>
                <form method="post" action="" id="queryMainForm">
                    <div class='ui-form' id='queryTable'>
                        <x:inputL name="code" id="code" required="false" label="编码" labelWidth="50" width="120"/>
                        &nbsp;&nbsp;
                        <x:inputL name="name" id="name" required="false" label="名称" width="120" labelWidth="50"/>
                        &nbsp;&nbsp;
                        <x:button value="查 询" id="btnQuery"/>
                    </div>
                </form>
                <div class="blank_div"></div>
                <div id="maingrid" style="margin: 2px;"></div>
            </div>
            <div position="right" title="权限分配">
                <x:title title="搜索" hideTable="queryPermissionTable"/>
                <form method="post" action="" id="queryPermissionTableForm">
                    <div class='ui-form' id='queryPermissionTable'>
                        <x:hidden name="documentClassificationId" id="documentClassificationId"></x:hidden>
                        <x:selectL name="objectKindId" id="objectKindId" label="对象类型" emptyOption="false" width="150"
                                   value="1" labelWidth="60"></x:selectL>
                        <x:button value="查 询" id="btnQueryPermission"/>
                    </div>
                </form>
                <div class="blank_div"></div>
                <div id="permissiongrid" style="margin: 2px;"></div>
            </div>
        </div>
    </div>
</div>
</div>
</body>
</html>