
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 450px;">
		
		<x:hidden name="agencyCooperaId" />
		<x:hidden name="agencyCooperaDetailId" />
		<x:hidden name="sequence" />
		
		<div class="row">
		<x:inputL name="projectName" required="true" label="项目名称" maxLength="128" 
			width="250" labelWidth="100"/>	
		</div>
		<div class="row">	
		<x:inputL name="houseInfomation" required="true" label="拟合作房源信息" maxLength="256" 
			width="250" labelWidth="100"/>		
		</div>
		<div class="row">	
		<x:inputL name="requirement" required="true" label="合作需求" maxLength="256" 
			width="250" labelWidth="100"/>		
		</div>
		<div class="row">		
	 		<x:inputL name="cooperStartDate" required="true" label="合作时间" maxLength="22"
				width="250" labelWidth="100" wrapper="date"/>
		</div>
		<div class="row">		
	 		<x:inputL name="brokerageRate"  required="true" label="佣金比例" maxLength="12" mask="nn.nn"
				width="250" labelWidth="100"/>
		</div>
		<div class="row">		
	 		<x:inputL name="brokerageCondition" required="true" label="结佣条件" maxLength="256"
				width="250" labelWidth="100"/>
		</div>
		<div class="row">		
	 		<x:inputL name="conformity"  required="true" label="与需求匹配度" maxLength="256"
				width="250" labelWidth="100"/>
		</div>
		<div class="row">		
	 		<x:inputL name="specialRemark"  required="true" label="特殊说明" maxLength="256"
				width="250" labelWidth="100"/>
		</div>
		<div class="row">	
		<x:textareaL name="finalOpinion" label="最终意见"
			maxLength="256" rows="3" labelWidth="100" width="250" />
		</div>
	</div>
</form>
