<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<div class="ui-form" style="width: 99%;">
	<form method="post" action="" id="submitForm">
		<x:hidden name="bizId" id="bizId" />
		<div class="row" style="width:380px;">
			<x:fileList bizCode="NodeDocument" bizId="bizId"
				id="NodeDocumentList" />
		</div>
	</form>
</div>
