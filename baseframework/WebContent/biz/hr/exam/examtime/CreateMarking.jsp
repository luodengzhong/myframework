<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="questionContent" style="text-align: center; margin-top: 5%;" id="examEndDiv">
	<div class="subject">考试结束，本次考试需要阅卷</div>
	<div class="bill_info" style="margin-left: 20px;">阅卷结算后会自动通知考试结果！</div>
	<div class="bill_info" style="text-align: center">
		<a href="javascript:saveCompleteExamTaskCreateMarking();" hidefocus class="orangeBtn"><span>完成考试任务</span></a>
	</div>
</div>