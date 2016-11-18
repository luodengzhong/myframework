<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>

    <link href='<c:url value="/system/opm/permission/showIcon.css"/>'
          rel="stylesheet" type="text/css"/>
    <script src='<c:url value="/lib/jquery/jquey.scrollLoad.js"/>'
            type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
            type="text/javascript"></script>
    <script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/pa/projectdata/nodeDefineManageDetail.js"/>'
            type="text/javascript"></script>
    <title>节点定义管理</title>
</head>
<form method="post" action="" id="submitForm">
    <x:hidden name="nodeDefineId" id="nodeDefineId"/>
    <x:hidden name="parentId" id="parentId"/>
    <x:hidden name="nodeKindId" id="nodeKindId"/>
    <div class="ui_title" style="padding-left: 15px;">修改节点定义信息</div>
    <div class='ui-form' id='queryTable'
         style="width: 410px; height: 270px; margin-top: 20px;">
        <x:inputL name="code" id="code" required="true" label="编码"
                  readonly="false" labelWidth="80" width="280"/>
        <x:inputL name="name" id="name" required="true" label="名称"
                  readonly="false" labelWidth="80" width="280"/>
        <x:inputL name="shortName" id="shortName" required="true" label="简称"
                  readonly="false" labelWidth="80" width="280"/>
        <div class="row">
            <x:inputL name="iconUrl" id="iconUrl" label="图标" readonly="true"
                      labelWidth="80" width="230"/>
            <x:button value="..." onclick="chooseImg()"
                      cssStyle="min-width:30px;"/>
        </div>
        <x:radioL list="startModeList" name="startMode" id="startMode"
                  value="2" label="启动方式" labelWidth="80" width="180"/>
        <x:inputL name="executionNum" id="executionNum" required="false"
                  label="执行次数" readonly="false" spinner="true" mask="nnn"
                  dataoptions="min:0" labelWidth="80" width="85"/>

        <x:inputL name="timeLimit" id="timeLimit" required="false"
                  label="时限(天)" readonly="false" spinner="true" mask="nn.n"
                  dataoptions="min:0" labelWidth="80" width="85"/>
        <x:inputL name="sequence" id="sequence" required="false" label="排序号"
                  readonly="false" spinner="true" mask="nnn" dataoptions="min:1"
                  labelWidth="80" width="85"/>
        <x:textareaL name="description" id="description" label="描述"
                     readonly="false" labelWidth="80" width="280" rows="3"></x:textareaL>
    </div>
    <div style="float: left; padding-left: 90px; padding-top: 10px;"
         class="ui_buttons">
        <input class="ui_state_highlight" value="保存" id="ok" type="button"
               onclick="doSaveNodeDefine()"> <input value="重置" id="reSet"
                                                    type="button" onclick="doReSet()">
    </div>
</form>
</html>
