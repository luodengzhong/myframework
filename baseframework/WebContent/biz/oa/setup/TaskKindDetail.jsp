<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="20%,30%,15%,35%" />
		<tr>
			<x:hidden name="taskKindId" id="detailTaskKindId" />
			<x:inputTD name="taskKindName" required="true" label="类别名称" maxLength="30" />
			<x:inputTD name="taskKindCode" required="true" label="类别编码" maxLength="16" />
		</tr>
		<tr>
			<x:inputTD name="fileCode" required="false" label="附件编码" maxLength="40" />
			<x:selectTD name="taskLevel"  label="任务级别" required="false" list="taskLevelKind"/>
		</tr>
		<tr>
			<x:inputTD name="extendedCode" required="false" label="扩展属性编码" maxLength="30" />
			<x:inputTD name="sequence" required="false" label="序号" mask="nnnn" cssStyle="width:80px;" id="detailSequence"/>
		</tr>
		<tr>
			<x:inputTD name="createClass" required="false" label="创建类" maxLength="20" />
			<x:inputTD name="createFun" required="false" label="创建函数" maxLength="20" />
		</tr>
		<tr>
			<x:inputTD name="showUrl" required="false" label="查看连接" maxLength="60" colspan="3" />
		</tr>
	</table>
</form>
