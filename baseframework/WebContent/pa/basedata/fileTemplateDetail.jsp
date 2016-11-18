<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<div class="ui-form" style="width: 99%;">
    <form method="post" action="" id="submitForm">
        <x:hidden name="fileTemplateId" id="fileTemplateId"/>
        <x:hidden name="parentId" id="parentId"/>
        <x:hidden name="nodeKindId" id="nodeKindId"/>
        <x:hidden name="bizCode" id="bizCode"/>
        <x:hidden name="templateKindId" id="templateKindId"/>
        <div class="row">
            <x:inputL name="title" id="title" required="true" label="标题" readonly="false" labelWidth="60" width="260"/>
        </div>
        <div class="row">
            <x:radioL list="statusList" name="status" id="status" label="状态" labelWidth="60" width="260"/>
        </div>
        <div class="row">
            <x:inputL name="sequence" id="sequence" required="false" label="排序号"
                      readonly="false" spinner="true" mask="nnn" dataoptions="min:1"
                      labelWidth="60" width="60"/>
        </div>
        <div class="row">
            <x:textareaL name="description" label="描述" readonly="false"
                         labelWidth="60" width="260" rows="3"></x:textareaL>
        </div>
        <div class="row">
            <x:fileList bizCode="FileTemplate" bizId="fileTemplateId"
                        id="fileTemplateList"/>
        </div>
    </form>


</div>
