<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <x:hidden name="projectNodeId" id="projectNodeId"/>
    <x:hidden name="bizKindId" id="bizKindId"/>
    <x:hidden name="bizId" id="bizId"/>
    <x:hidden name="nodeDefineId" id="nodeDefineId"/>
    <x:hidden name="nodeKindId" id="nodeKindId"/>
    <x:hidden name="parentId" id="parentId"/>
    <div class='ui-form' id='queryTable'>
        <x:inputL name="code" id="code" required="true" label="编码"
                  readonly="false" labelWidth="65" width="265"/>
        <x:inputL name="name" id="name" required="true" label="名称"
                  readonly="false" labelWidth="65" width="265"/>
        <x:inputL name="shortName" id="shortName" required="true" label="简称"
                  readonly="false" labelWidth="65" width="265"/>
        <div class="row">
            <x:inputL name="iconUrl" id="iconUrl" label="图标" readonly="false"
                      labelWidth="65" width="215"/>
            <x:button value="..." onclick="chooseImg()"
                      cssStyle="min-width:30px;"/>
        </div>
        <x:radioL list="startModeList" name="startMode" id="startMode"
                  label="启动方式" labelWidth="65" width="265"/>
        <x:inputL name="executionNum" id="executionNum" required="false"
                  label="执行次数" readonly="false" spinner="true" mask="nnn"
                  dataoptions="min:0" labelWidth="65" width="80"/>
        <x:inputL name="timeLimit" id="timeLimit" required="false"
                  label="时限(天)" readonly="false" spinner="true" mask="nn.n"
                  dataoptions="min:0" labelWidth="65" width="80"/>
        <x:inputL name="sequence" id="sequence" required="false" label="排序号"
                  readonly="false" spinner="true" mask="nnn" dataoptions="min:1"
                  labelWidth="65" width="80"/>
        <x:textareaL name="description" id="description" label="描述"
                     readonly="false" labelWidth="65" width="265" rows="3"></x:textareaL>
    </div>
</form>
