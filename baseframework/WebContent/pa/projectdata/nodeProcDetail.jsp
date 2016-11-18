<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <x:hidden name="nodeProcId" id="nodeProcId"/>
    <x:hidden name="bizId" id="bizId"/>
    <x:hidden name="bizKindId" id="bizKindId"/>
    <div class='ui-form' id='queryTable'>
        <x:inputL name="procKey" id="procKey" required="true" label="流程Key"
                  readonly="false" labelWidth="60" width="260"/>
        <x:inputL name="sequence" id="sequence" required="false" label="排序号"
                  readonly="false" spinner="true" mask="nnn" dataoptions="min:1"
                  labelWidth="60" width="80"/>
    </div>
</form>