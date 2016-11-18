
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 450px;">
		
		<x:hidden name="ecommerceId" />
		<x:hidden name="ecommerceDetailId" />
		<x:hidden name="sequence" />
		
		<div class="row">
		<x:inputL name="preferentialPolicy" required="true" label="项目优惠政策" maxLength="128" 
			width="250" labelWidth="100"/>	
		</div>
		<div class="row">		
	 		<x:inputL name="startDate" required="true" label="合作开始时间" maxLength="22"
				width="250" labelWidth="100" wrapper="date"/>
		</div>
		<div class="row">		
	 		<x:inputL name="endDate" required="true" label="合作结束时间" maxLength="22"
				width="250" labelWidth="100" wrapper="date"/>
		</div>
		<div class="row">	
		<x:inputL name="housesCount" required="true" label="合作房源数量" maxLength="256" mask="nnnnnnnn"
			width="250" labelWidth="100"/>		
		</div>
		<div class="row">	
		<x:inputL name="housesAmount" required="true" label="房源合计金额" maxLength="256" mask="nnnnnnnnnnnnnn.nn"
			width="250" labelWidth="100"/>		
		</div>
		<div class="row">		
	 		<x:inputL name="otherPromise"  required="true" label="其它约定" maxLength="12" 
				width="250" labelWidth="100"/>
		</div>
		<div class="row">	
		<x:textareaL name="finalOpinion" label="最终意见"
			maxLength="256" rows="3" labelWidth="100" width="250" />
		</div>
	</div>
</form>
