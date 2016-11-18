<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action=""   id="submitForm"> 
	<div class="ui-form" style="height:200px;">
		
		<x:hidden name="writeId"/>
		<x:inputL name="vaCode" required="true" label="验证码"  readonly="true"/>
	</div>
</form>
