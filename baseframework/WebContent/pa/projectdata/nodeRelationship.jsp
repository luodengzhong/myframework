<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>

    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
            type="text/javascript"></script>
    <script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/pa/projectdata/nodeRelationship.js"/>'
            type="text/javascript"></script>
    <title>节点关系管理</title>
</head>
<body>
<div class="mainPanel" style="padding: 0px 0px 0px 2px;">
    <div id="mainWrapperDiv">
        <div class="blank_div"></div>
        <div id="maingrid" style="margin: 0px;"></div>
    </div>
</div>
</div>
</body>
</html>
