<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:380px;">
	<x:hidden name="cancelEmployApplyId"/>
	<x:hidden name="archivesId"/>
	<x:hidden name="staffName"/>
	<x:hidden name="organId"/>
	<x:textareaL name="cancelReason" label="原因" labelWidth="60" rows="5" required="true" height="80" width="280"  maxLength="128"/>
	</div>
</form>