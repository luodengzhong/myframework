
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 450px;">
		
		<x:hidden name="projectCtrlReportId" />
		<x:hidden name="projectCtrlDetailId" />
		
		<div class="row">
		<x:inputL name="projectName" required="true" label="管控项目" maxLength="128" 
			width="250" labelWidth="150"/>	
		</div>
		<div class="row">		
	 		<x:inputL name="sequence" required="true" label="序号" maxLength="22"
				width="250" labelWidth="150" mask="nn"/>
		</div>
		<div class="row">		
	 		<x:inputL name="nameAndLocation" required="true" label="名称及部位" maxLength="22"
				width="250" labelWidth="150" />
		</div>
		<div class="row" style="height:50px">	
			<x:textareaL name="pointAndContent" required="true" label="管控要点/主控内容分解" maxLength="256"
			width="250" labelWidth="150" rows="3" />		
		</div>
		<div class="row">	
		<x:inputL name="joinInDept" required="true" label="建设单位参与部门" maxLength="256" 
			width="250" labelWidth="150"/>		
		</div>
		<div class="row" style="height:50px">		
	 		<x:textareaL name="requestAndRecord" required="true" label="管控要求/相关记录" maxLength="256" 
				width="250" labelWidth="150"  rows="3" />
		</div>
		<div class="row">	
		<x:textareaL name="remark" label="备注"
			maxLength="256" rows="3" labelWidth="150" width="250" />
		</div>
	</div>
</form>
