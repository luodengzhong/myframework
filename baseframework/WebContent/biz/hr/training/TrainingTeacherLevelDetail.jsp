<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="100px,120px,120px,120px"/>
	    <tr>
		<x:hidden name="levelId"/>
		<x:hidden name="status"/>
		<x:inputTD name="teacherLevelName" required="true" label="讲师级别名称" maxLength="32"/>	
		<x:inputTD name="teacherLevelCode" required="true" label="讲师级别编码" maxLength="32"/>		
		</tr>
		<tr>	
		<x:inputTD name="normalCriteria" required="true" label="正常费用标准"   mask="nnnn"/>		
		<x:inputTD name="holidayCriteria" required="true" label="节假日费用标准"   mask="nnnn"/>
	    </tr>
	</table>
</form>
