<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <x:hidden name="projectTemplateId" id="projectTemplateId"/>
    <x:hidden name="parentId" id="parentId"/>
    <x:hidden name="nodeKindId" id="nodeKindId"/>
    <div class='ui-form' id='queryTable'>
        <x:inputL name="code" id="code" required="true" label="编码"
                  readonly="false" labelWidth="60" width="260"/>
        <x:inputL name="name" id="name" required="true" label="名称"
                  readonly="false" labelWidth="60" width="260"/>
        <x:inputL name="sequence" id="sequence" required="false" label="排序号"
                  readonly="false" spinner="true" mask="nnn" dataoptions="min:1"
                  labelWidth="60" width="80"/>
        <x:textareaL name="description" id="description" label="描述"
                     readonly="false" labelWidth="60" width="260" rows="3"></x:textareaL>
    </div>
</form>
