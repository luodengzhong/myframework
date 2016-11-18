<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>

    <link href='<c:url value="/system/opm/permission/showIcon.css"/>'
          rel="stylesheet" type="text/css"/>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
            type="text/javascript"></script>
    <script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/pa/projectdata/taskReceive.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquey.scrollLoad.js"/>'
            type="text/javascript"></script>
    <title>节点定义管理</title>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <x:title title="搜索" hideTable="queryTable"/>
        <form method="post" action="" id="queryMainForm">
            <div class='ui-form' id='queryTable'>
                <x:inputL name="projectName" id="projectName" required="false" label="项目名称"
                          labelWidth="65" width="140"/>
                <x:inputL name="projectNodeName" id="projectNodeName" required="false" label="节点名称"
                          labelWidth="65" width="140"/>
                <x:inputL name="projectNodeFunctionName" id="objectName" required="false" label="功能名称"
                          labelWidth="65" width="140"/>
                <x:inputL name="objectName" id="objectName" required="false" label="接收人"
                          labelWidth="55" width="100"/>
                <x:selectL name="objectKindId" id="objectKindId" required="false" label="对象类型" emptyOption="false"
                         value="1" width="70" labelWidth="65"/>
                &nbsp;&nbsp;
                <x:button value="查 询" id="btnQuery"/>
            </div>
        </form>
        <div class="blank_div"></div>
        <div id="maingrid" style="margin: 2px;"></div>
    </div>
</div>
</body>
</html>