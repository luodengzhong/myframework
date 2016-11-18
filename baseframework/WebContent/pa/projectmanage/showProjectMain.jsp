<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>

    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
            type="text/javascript"></script>
    <script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/pa/projectmanage/showProjectMain.js"/>'
            type="text/javascript"></script>
    <title>项目管理</title>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <div class="controlPanel">
            <div class="projectTitle" id="divProjectTitle"></div>
            <div style="float: right; padding-right: 15px;">
                <div class="projectNodeStatus_3">已处理</div>
                <div class="projectNodeStatus_2">处理中</div>
                <div class="projectNodeStatus_1">未处理</div>
            </div>
        </div>
        <div id="divProjectNode"></div>
    </div>
</div>
</body>
</html>