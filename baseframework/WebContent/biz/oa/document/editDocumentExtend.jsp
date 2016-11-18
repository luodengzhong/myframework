<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="extendInfoForm">
	<table class='tableInput' style="width: 99%; margin: 2px;">
		<x:layout />
		<tr>
			<x:inputTD name="code1" required="false" label="档号" maxLength="30"
				colspan="2" />
			<x:inputTD name="code2" required="false" label="案卷号" maxLength="30"
				colspan="2" />
		</tr>
		<tr>
			<x:inputTD name="code3" required="false" label="全宗号" maxLength="30"
				colspan="2" />
			<x:inputTD name="code4" required="false" label="件号" maxLength="30"
				colspan="2" />
		</tr>
		<tr>
			<x:inputTD name="code5" required="false" label="文号" maxLength="30"
				colspan="2" />
			<x:inputTD name="security" required="false" label="密级" maxLength="16"
				colspan="2" />
		</tr>
		<tr>
			<x:inputTD name="storagePlace" required="false" label="存放位置"
				maxLength="60" colspan="5" />
		</tr>
		<tr>
			<x:inputTD name="docRemark" required="false" label="备注"
				maxLength="100" colspan="5" />
		</tr>
	</table>
</form>