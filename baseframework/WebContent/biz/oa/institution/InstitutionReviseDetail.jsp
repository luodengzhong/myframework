<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
		<x:hidden name="institutionReviseId"/>
		<x:hidden name="parentId"/>
		<x:hidden name="kind"/>
		<x:hidden name="oldInstitutionId"/>
		<x:hidden name="institutionProcessId"/>
		<x:select list="reviseStatusList" emptyOption="false"
						id="reviseStatusId" cssStyle="display:none;" />
		<table class="tableInput" style="width: 99%">
			<tr>
				<x:inputTD name="code" required="true" label="编码"/>
				<x:inputTD name="name" required="true" label="名称"/>
			</tr>
			<tr>
				<x:inputTD name="institutionVersion" required="true" label="制度版本"/>
				<x:selectTD name="reviseStatus" required="true" label="修订状态" list="reviseStatusList"/>
			</tr>
			<tr>
				<x:inputTD name="effectiveDate" required="false" wrapper="date" label="生效日期"/>
				<x:inputTD name="sequence" required="true" mask="nnn" label="序列号"/>
			</tr>
			<tr>
				<x:hidden name="processDefinitionKey"/>
				<x:inputTD name="processDefinitionName" label="制度对应流程" wrapper="select"/>
				<x:inputTD name="oldInstitutionName" readonly="true" label="原制度"/>
			</tr>
			<tr>
				<x:inputTD colspan="3" name="fullName" readonly="true" label="制度路径" width="460" rows="2"/>
			</tr>
		</table>
		<div id='editDetailTab' style="width:99%;margin: 0px;height:200px;margin-top: 5px;">
			<span style="color:red;font-size: 12px;font-weight: normal;">
				提示：当您完成修订原因，修订前、修订后的相关填写并点击保存后，在“制度/流程”、“管理工具”栏中将会自动生成相应的文件，请：
				<br>1、将新修订的文件进行上传，并删除相应废止的文件；2、确定其他未修订的文件是否无误；
			</span>
			<div id="inst" style='display:none'>
				<div id="reviseInstFile">
					<x:fileList bizCode="OAReviseInstAttachment" isClass="true" bizId="institutionReviseId" id="instFileList" proportion="12%,38%,12%,38%"/>
				</div>
				<div class="row" style="min-height: 60px">
					<x:title title="原制度文件"/>
					<div id="oldInstFile">
						<x:fileList bizCode="OACurrentInstAttachment" isClass="true" bizId="oldInstitutionId" id="oldInsFileList" proportion="12%,38%,12%,38%"/>
					</div>
				</div>
			</div>
			<div id="proc" style='display:none;overflow: hidden'>
				<div id="reviseInstProcFile">
					<x:fileList bizCode="OAReviseProcAttachment" isClass="true" bizId="institutionReviseId" id="instProcFileList" proportion="12%,38%,12%,38%"/>
				</div>
				<div class="row" style="min-height: 60px">
					<x:title title="原制度流程文件"/><div class="blank_div"></div>
					<div id="oldInstProcFile">
						<x:fileList bizCode="OACurrentProcAttachment" isClass="true" bizId="oldInstitutionId" id="oldInstProcFileList" proportion="12%,38%,12%,38%"/>
					</div>
				</div>
			</div>
			<div style="height: 60px;line-height: 60px;color:red;">完成相应的文件修订步骤后，请点击保存提交。</div>
		</div>
</form>