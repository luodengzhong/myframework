
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	     <tr>		
		<x:inputTD name="workContactId" required="true" label="关联任务ID" maxLength="32"/>		
		<x:inputTD name="workContactDetailId" required="false" label="事项ID" maxLength="32"/>
				
		<x:inputTD name="title" required="false" label="标题" maxLength="128"/>
		</tr>	
	    <tr>					
		<x:inputTD name="dealPersonId" required="false" label="当前处理人ID" maxLength="65"/>	
		<x:inputTD name="dealPersonName" required="false" label="当前处理人名称" maxLength="128"/>		
		<x:inputTD name="workStatue" required="false" label="任务状态" maxLength="10"/>
		</tr>	
				<tr>		
					<x:inputTD name="createDate" required="false" label="创建时间" maxLength="7"/>	
					<td class='title'><span class="labelSpan">事务处理人&nbsp;:</span></td>
					<td class="title" colspan="2"><div id="handlerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
					
						<a href='##' class="GridStyle"  id="handlerChooseLink"  onclick='showChooseOrgDialog("handler")'>选择</a>&nbsp;&nbsp;
						<a href='##' class="GridStyle"  id="handlerClearLink"  onclick='clearChooseArray("handler")'>清空</a>
					</td>
				</tr>
	</table>
</form>
