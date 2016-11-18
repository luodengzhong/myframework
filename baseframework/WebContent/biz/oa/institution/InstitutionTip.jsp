<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div style="width: 400px">
	<table class='tableInput'>
	    <x:layout proportion="12%,38%,12%,38%"/>
		<tr>
			<x:inputTD name="code" readonly="true" label="编码" />
			<x:inputTD name="name" readonly="true" label="名称" />
		</tr>
		<tr>
			<x:textareaTD colspan="3" name="description" label="描述"
				readonly="true"  rows="3" />
		</tr>
		<tr>
			<td class="title" rowspan="">&nbsp;流程：</td>
			<td colspan="3">
				<c:forEach items="${requestScope.processList}" var="process">
					<div>
						<a class="GridStyle" id="procUrl" href="#" onClick='startProcess("${process.code}","${process.name}","${process.url}")'>${process.name}</a>
					</div>
				</c:forEach>
			</td>
		</tr>
	</table>
	<div style="width: 535px;min-height:30px;">
		<x:fileList bizCode="OACurrentInstAttachment" readOnly="true" isWrap="false" bizId="id" id="aaa"/>
	</div>
</div>
