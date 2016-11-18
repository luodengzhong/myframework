<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width:340px;">
		<x:layout proportion="30%,70%" />
		<tr>
			<x:hidden name="templetId" />
			<x:inputTD name="templetName" required="true" label="考核表名称" maxLength="64" />
		</tr>
		<tr>
			<x:inputTD name="templetCode" required="false" label="考核表编码" maxLength="10" />
		</tr>
		<tr>
			<x:inputTD name="total" required="false" label="指标总分" maxLength="10" mask="nnnnn"/>
		</tr>
		<tr>
			<x:selectTD name="isSelectTemplet"   dictionary="yesorno" required="false"  label="是否作为绩效公用模板" maxLength="10" />
		</tr>
		<tr>
			<x:selectTD name="isEditTemplet" dictionary="yesorno"  required="false" label="模板是否固定" maxLength="10" />
		</tr>
		<tr>
			<x:selectTD name="isCountQuarterGrade" dictionary="yesorno"  required="false" label="是否月度考核,计算季度成绩" maxLength="10" />
		</tr>
		<tr>
			<x:selectTD name="isQuarterRank" dictionary="yesorno"  required="false" label="是否参与季度排名" maxLength="10" />
		</tr>
		<tr>
			<x:inputTD name="lineMax" required="false" label="最大行值" maxLength="10" mask="nnnnn"/>
		</tr>
		<tr>
			<x:inputTD name="lineMin" required="false" label="最小行值" maxLength="10" mask="nnnnn"/>
		</tr>
		<tr>
			<x:inputTD name="minScore" required="false" label="最小分值" maxLength="10" mask="nnnnn"/>
		</tr>
	</table>
</form>