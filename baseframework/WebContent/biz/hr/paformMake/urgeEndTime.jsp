<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:380px;">
	<x:hidden name="scorePersonDetailId"/>
	<x:hidden name="formId"/>
	<x:hidden name="scorePersonId"/>
	
	<x:inputL name="urgeEndTime" label="截止时间" labelWidth="60"  required="true" wrapper="date" />
	</div>
</form>