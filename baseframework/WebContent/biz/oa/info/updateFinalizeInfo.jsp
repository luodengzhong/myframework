<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="updateFinalizeInfoForm">
	<table class='tableInput' style="width: 99.9%;">
		<x:layout proportion="15%,35%,15%,35%" />
		<tr>
			<x:hidden name="infoPromulgateId" />
           <x:inputTD name="subject"  disabled="true" label="标题" colspan="3"/>
		</tr>
		<tr>
			<x:selectTD name="isFinalize" required="true" label="是否定稿" dictionary="yesorno" />
			<x:selectTD name="priority" required="true" label="优先级"  list="infoPriority" emptyOption="false"/>
		</tr>
		<tr>
			<x:inputTD name="effectiveTime" required="true" label="生效时间" wrapper="date" />
			<x:inputTD name="invalidTime" required="false" label="截止时间" wrapper="date" />
		</tr>
		<tr>
			<x:inputTD name="feedbackWidth" required="false" label="反馈区域" mask="nnn"/>
			<td class="title" colspan="2">&nbsp;</td>
		</tr>
		<tr>
			<x:inputTD name="keywords" required="false" label="主题词" maxLength="60" colspan="3" />
		</tr>
		<tr>
			<td colspan="2" class="title" style="text-align:center;"><x:checkbox name="hasFeedBack" label="需要反馈" /></td>
			<td colspan="2" class="title" style="text-align:center;"><x:checkbox name="isAllowMultiFeedback" label="允许多次反馈" /></td>
		</tr>
		<tr>
			<td colspan="2" class="title" style="text-align:center;"><x:checkbox name="hasFeedBackAttachment" label="允许反馈时上传附件" /></td>
			<td colspan="2" class="title" style="text-align:center;"><x:checkbox name="isCreateReadTask" label="生成阅读任务" /></td>
		</tr>
		<tr>
			<td colspan="2" class="title" style="text-align:center;"><x:checkbox name="isBodyReadonly" label="正文只读" /></td>
			<td colspan="2" class="title" style="text-align:center;"><x:checkbox name="isBodyDown" label="允许下载正文" /></td>
		</tr>
	</table>
</form>