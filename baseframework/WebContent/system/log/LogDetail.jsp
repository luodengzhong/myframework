<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width:595px;">
		<x:layout proportion="15%,35%,15%,35%" />
		<tr>
			<x:inputTD name="personName" required="false" label="操作者" disabled="true"/>
			<x:inputTD name="ip" required="false" label="IP地址" disabled="true"/>
		</tr>
		<c:choose>
			<c:when test="${typeId=='login'}">
         <tr>
			<x:inputTD name="createTime" required="false" label="登陆时间" mask="datetime" disabled="true"/>
			<x:inputTD name="endTime" required="false" label="登出时间" mask="datetime" disabled="true"/>
		 </tr>
       	    </c:when>
			<c:when test="${typeId=='error'}">
         <tr>
			<x:inputTD name="className" required="false" label="类名" disabled="true" />
			<x:inputTD name="functionName" required="false" label="函数名" disabled="true" />
	     </tr>
	     <tr>
			<x:textareaTD name="params" label="参数" rows="8" disabled="true" colspan="3"/>
	     </tr>
	     <tr>
			<x:textareaTD name="exception" label="异常信息" rows="8" disabled="true" colspan="3"/>
	     </tr>
             </c:when>
			<c:otherwise>
		 <tr>
			<x:inputTD name="className" required="false" label="操作路径" disabled="true" colspan="3"/>
	     </tr>
	     <tr>
			<x:textareaTD name="params" label="参数" rows="8" disabled="true" colspan="3"/>
	     </tr>
            </c:otherwise>
		</c:choose>
	</table>
</form>
