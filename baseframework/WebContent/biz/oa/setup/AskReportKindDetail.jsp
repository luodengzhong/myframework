<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" >
		<x:hidden name="askReportKindId" id="detailAskReportKindId"/>
		<x:inputL name="code" required="true" label="编码" maxLength="16" labelWidth="70" width="200"/>		
		<x:inputL name="name" required="true" label="名称" maxLength="30" labelWidth="70" width="200"/>		
		<x:inputL name="extendedFieldCode" required="false" label="扩展编码" maxLength="16" labelWidth="70" width="200"/>		
		<x:selectL name="reportLevel" required="false" label="级别" list="taskLevelKind" maxLength="30" labelWidth="70" width="200"/>
		<x:inputL name="sequence" required="true" label="序号" mask="nnnn" cssStyle="width:80px;" id="detailSequence" labelWidth="70" width="200"/>	
		<x:inputL name="defaultTitle" required="false" label="默认标题" maxLength="80" labelWidth="70" width="200"/>
		<x:inputL name="recordManageType" required="false" label="备案权限" maxLength="30" labelWidth="70" width="200"/>
		<dl style="min-height: 60px">
			<dd style="width: 260px;padding-left:10px">
				<x:checkbox name="isNeedDispatchNo" label="是否需要发文号" />&nbsp;&nbsp;
				<x:checkbox name="isNeedAttachment" label="附件是否必传" />
			</dd>
			<dd style="width: 260px;padding-left:10px">
				<x:checkbox name="isBuildTask" label="是否产生计划" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<x:checkbox name="isChoose" label="是否可选" />
			</dd>
			<dd style="width: 260px;padding-left:10px"><x:checkbox name="isFreeFlow" label="是否为自由流程" /></dd>
		</dl>
		<x:inputL name="noAttachmentTip" required="false" label="无附件提示" maxLength="80" labelWidth="70" width="200"/>
		<x:textareaL name="remark" required="false" label="备注" maxLength="256" rows="4" labelWidth="70" width="200"/>		
	</div>
</form>