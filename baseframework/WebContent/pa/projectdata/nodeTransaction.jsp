<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>

    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
            type="text/javascript"></script>
    <script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/pa/projectdata/nodeTransaction.js"/>'
            type="text/javascript"></script>
    <title>节点事务管理</title>
</head>
<body>
<div class="mainPanel" style="padding: 0px 0px 0px 2px;">
    <div id="mainWrapperDiv">
        <x:title title="搜索" hideTable="queryTable"/>
        <form method="post" action="" id="queryMainForm">
            <div class='ui-form' id='queryTable'>
                <x:inputL name="name" id="name" required="false" label="名称"
                          labelWidth="50"/>
                &nbsp;&nbsp;
                <x:button value="查 询" id="btnQuery"/>
            </div>
        </form>
        <div class="blank_div"></div>
        <div id="maingrid" style="margin: 0px;"></div>
    </div>
</div>
</div>
</body>
</html>
