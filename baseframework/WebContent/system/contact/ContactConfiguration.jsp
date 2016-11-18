<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>
    <script src='<c:url value="/system/contact/ContactConfiguration.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <div id="layout">
            <div position="center" title="配置列表">
                <x:title title="搜索" hideTable="queryDiv"/>
                <form method="post" action="" id="queryMainForm">
                    <div class="ui-form" id="queryDiv" style="width: 900px;">
                        <x:inputL name="bizCodeLike" required="false" label="业务编码" maxLength="60" labelWidth="70"/>
                        <x:button value="查 询" onclick="query(this.form)"/>
                        &nbsp;&nbsp;
                        <x:button value="重 置" onclick="resetForm(this.form)"/>
                        &nbsp;&nbsp;
                    </div>
                </form>
                <div class="blank_div"></div>
                <div id="configurationGrid" style="margin: 2px;"></div>
            </div>
        </div>
    </div>
</div>
<x:select name="contactWay" emptyOption="false" id="contactWay" cssStyle="display:none;"/>
</body>
</html>