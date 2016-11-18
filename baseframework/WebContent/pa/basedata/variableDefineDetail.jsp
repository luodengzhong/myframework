<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <x:hidden name="variableDefineId" id="variableDefineId"/>
    <x:hidden name="parentId" id="parentId"/>
    <x:hidden name="nodeKindId" id="nodeKindId"/>
    <div class='ui-form' id='queryTable'>
        <x:inputL name="code" id="code" required="true" label="编码" readonly="false" labelWidth="80" width="260"/>
        <x:inputL name="name" id="name" required="true" label="名称" readonly="false" labelWidth="80" width="260"/>
        <x:inputL name="sequence" id="sequence" required="false" label="排序号" readonly="false" spinner="true" mask="nnn" dataoptions="min:1"
                  labelWidth="80" width="80"/>
        <x:radioL list="kindList" name="kindId" id="kindId" value="1" label="变量类型" labelWidth="80"/>
        <x:selectL list="dataSourceList" emptyOption="false" id="dataSourceId" name="dataSourceId" label="数据源" labelWidth="80" width="260"/>
        <x:textareaL name="dataSourceConfig" id="dataSourceConfig" label="数据源配置" readonly="false" labelWidth="80" width="260" rows="3"></x:textareaL>
        <x:textareaL name="description" id="description" label="描述"
                     readonly="false" labelWidth="80" width="260" rows="3"></x:textareaL>
    </div>
</form>
