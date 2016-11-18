<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="120px,440px" />
					<x:hidden name="templetId"/>
		
		<tr>
			<x:inputTD name="sequence" required="true" label="序号" spinner="true" mask="nnn"/>
		</tr>
		<tr>
			<x:hidden name="detailId" id="templetIndexId"/>
			<x:inputTD name="mainContent" required="false" label="主项目"  />
		</tr>
		<tr>
			<x:inputTD name="partContent" required="true" label="指标名称" maxlength="128"/>
		</tr>
		
		<tr>
			<x:textareaTD name="desption" required="true" label="指标描述" rows="5" maxlength="500"/>
		</tr>
		<tr>
			<x:inputTD name="scoreNum" required="true" label="分值" spinner="true" mask="nnn"/>
		</tr>
		
	</table>
</form>
