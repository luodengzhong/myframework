
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 450px;">
		
		<x:hidden name="nonStrategicAdId" />
		<x:hidden name="nonStrategicAdDetailId" />
		<x:hidden name="sequence" />
		
		<div class="row">
		<x:inputL name="purpose" required="true" label="投放目的" maxLength="128" 
			width="250" labelWidth="100"/>	
		</div>
		<div class="row">	
		<x:inputL name="mediaName" required="true" label="媒体名称" maxLength="256" 
			width="250" labelWidth="100"/>		
		</div>
		<div class="row">	
		<x:inputL name="mediaRecommend" required="true" label="媒体介绍" maxLength="256" 
			width="250" labelWidth="100"/>		
		</div>
		<div class="row">	
		<x:inputL name="content" required="true" label="合作内容" maxLength="256" 
			width="250" labelWidth="100"/>		
		</div>
		<div class="row">		
	 		<x:inputL name="startDate" required="true" label="合作时间" maxLength="22"
				width="250" labelWidth="100" wrapper="date"/>
		</div>
		<div class="row">		
	 		<x:inputL name="price"  required="true" label="执行价" maxLength="12" mask="nnnnnnnnnnnn.nn"
				width="250" labelWidth="100"/>
		</div>
		<div class="row">		
	 		<x:inputL name="modeOfPayment" required="true" label="付款方式" maxLength="256"
				width="250" labelWidth="100"/>
		</div>
		<div class="row">		
	 		<x:radioL name="resources" dictionary="yesorno"  required="true" label="是否有可用资源" maxLength="256"
				width="250" labelWidth="100"/>
		</div>
		<div class="row">		
	 		<x:inputL name="record"  required="false" label="其他使用记录" maxLength="256"
				width="250" labelWidth="100"/>
		</div>
		<div class="row">	
		<x:textareaL name="finalOpinion" label="最终意见"
			maxLength="256" rows="3" labelWidth="100" width="250" />
		</div>
	</div>
</form>
