
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 450px;">
		
		<x:hidden name="institutionId" />
		<x:hidden name="institutionItemId" />
		
		<div class="row" >
			<x:inputL name="sequence" required="true" label="序号"  mask="nn"
				width="50" labelWidth="120"/>	
		</div>
		<div class="row" style="height:40px">
			<x:textareaL name="name" required="true" label="修订制度/工具名称" maxLength="128" 
				width="300" labelWidth="120"/>	
		</div>
		<div class="row" style="height:40px">	
			<x:textareaL name="reason" required="true" label="修订原因" maxLength="356" 
				width="300" labelWidth="120"/>		
		</div>
		<div class="row" style="height:40px">	
			<x:textareaL name="beforeTheChange" label="修订前" required="true" 
				maxLength="256" labelWidth="120" width="300" />
		</div>
		<div class="row" style="height:40px">	
			<x:textareaL name="modifiedContent" label="修订后" required="true" 
				maxLength="256"  labelWidth="120" width="300" />
		</div>
	</div>
</form>
