<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:280px;">
		<x:hidden name="examinationTypeId"/>
		<x:inputL name="code" required="true" label="编码" maxLength="16" labelWidth="60" width="180"/>		
		<x:inputL name="name" required="true" label="名称" maxLength="30" labelWidth="60" width="180"/>
		<x:inputL name="timeout" required="false" label="考试时长" mask="nnnn" labelWidth="60" width="180"/>
		<x:inputL name="passingScore" required="false" label="合格分数"  mask="nnnn" labelWidth="60" width="180"/>
		<x:inputL name="retakeNum" required="false" label="重考次数" mask="nn" labelWidth="60" width="180"/>
		<x:inputL name="sequence" required="false" label="序号"  mask="nnnn" labelWidth="60" width="180"/>		
		<x:textareaL name="description" required="false" label="描述" maxLength="200" labelWidth="60" height="80" rows="5" width="180"/>	
	</div>
</form>
