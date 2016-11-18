<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <x:hidden name="transactionConfigId" id="transactionConfigId"/>
    <x:hidden name="transactionHandleId" id="transactionHandleId"/>
    <div class='ui-form' id='queryTable'>
        <x:inputL name="subject" id="subject" required="true" label="主题" readonly="false" labelWidth="60" width="260"/>
        <x:textareaL name="content" id="content" label="内容"
                     readonly="false" labelWidth="60" width="260" rows="3"></x:textareaL>
    </div>
</form>
