<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	    <x:layout proportion="120px,340px"/>
		<x:hidden name="indexDetailId"/>
		<x:hidden name="templetId"/>
		<x:hidden name="formId"/>
		<tr>
		 <x:inputTD name="sequence" required="true" label="序号"  mask="nn"/>		
		</tr>
		<tr>
		<x:inputTD name="mainContent" required="true" label="主项目" />		
		</tr>
		<tr>
		<x:inputTD name="partContent" required="true" label="指标名称" />		
		</tr>
		<tr>
		<x:textareaTD name="desption" required="true" label="指标要求" rows="4" colspan="1" />		
	    </tr>
	    <tr>
	    <x:inputTD name="scoreNum" required="true" label="分值"  mask="nn"/>		
	    </tr>
	</table>
</form>
