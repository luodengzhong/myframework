<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:300px;">
		<x:hidden name="trainingLessonFeeId"/>
		<x:selectL name="status" list="lessonFeeStatusValues" required="false" label="课时费状态" maxLength="32"/>
	</div>
</form>
