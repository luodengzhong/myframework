
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	  <table class='tableInput' id='queryTable' >
	     <x:layout proportion="180px,180px,180px,180px" />
		
		<x:hidden name="learnId"/>
		<x:hidden name="writeId"/>
		<tr>	
		<x:inputTD name="university" required="true" label="毕业学校" maxLength="64"/>		
		<x:inputTD name="specialty" required="true" label="所学专业" maxLength="64"/>	
		</tr>	
		<tr>
		<x:inputTD name="enrollingDate" required="true" label="入学时间"  wrapper="date"/>		
		<x:inputTD name="graduationDate" required="true" label="毕业时间" wrapper="date"/>	
		</tr>
	
		<tr>
		<x:selectTD name="education" required="false" label="学历" />	
		<x:selectTD name="degree" required="false" label="学位" />
		</tr>
		<tr>		
		<x:inputTD name="remark" required="false" label="备注" maxLength="256"/>	
		<x:inputTD name="sequence" required="false" label="序号" maxLength="22"  mask="nnn"/>		
		</tr>
	</table>
</form>
