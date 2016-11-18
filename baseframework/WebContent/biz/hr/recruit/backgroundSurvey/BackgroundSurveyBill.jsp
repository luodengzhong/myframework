<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,attachment"/>
  	<script src='<c:url value="/biz/hr/recruit/backgroundSurvey/BackgroundSurveyBill.js"/>' type="text/javascript"></script>
  	
  </head>
  <body>
  	<div class="ui-form" style="width: 99%;">
  	<div class="subject">人事背景调查表 </div>
    <form method="post" action="" id="submitForm">
		<x:hidden name="surveyId"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="organName" />
		<x:hidden name="deptName" />
		<x:hidden name="positionName" />
		<x:hidden name="personMemberName" />
		<x:hidden name="billCode" />
		<x:hidden name="fillinDate" type="date"/>
		<x:hidden name="fullId"/>
	    <div class="bill_info">
				<span style="float:left;">
					单据号码：<strong><c:out value="${billCode}"/></strong>
					&nbsp;&nbsp;
					调查日期：<strong><x:format name="fillinDate" type="date"/></strong>
				</span>
				<span style="float:right;">
					调查人：<strong><c:out value="${personMemberName}"/></strong>
				</span>
		</div>
		<div class="blank_div"></div>
    <table class='tableInput' id='queryTable'>
		<x:layout proportion="110px,160px,110px,160px,100px,160px" />
		<tr>
		<x:hidden name="writeId"/>
		<x:hidden name="employDeptId"/>
		<x:hidden name="employPosId"/>
		<x:hidden name="idCardNo"/>
		<x:inputTD name="surveyName" required="false" label="被调查人姓名" wrapper="select"/>		
		<x:inputTD name="employDept" required="false" label="试岗部门" maxLength="16"/>		
		<x:inputTD name="employPos" required="false" label="岗位" maxLength="16"/>		
		</tr>
	</table>
	<div class="blank_div"></div>
	<table  class='tableInput' id='queryDetailTable'>	
		<x:layout proportion="100px,160px,100px,160px,120px,160px" />
		<tr class="table_grid_head_tr">
						<td style='text-align: center;'>调查内容</td>
						<td   colspan="6"  style='text-align: center;'>调查结果</td>
						<td style='text-align: center;'>调查方式</td>
		</tr>
		<tr>
		<td  class="title"   rowspan='2'  style='text-align: center;'>学历</td>
		    <x:inputTD name="university" required="false" label="被调查人毕业学校" maxLength="64" colspan="2"/>	
		   	<td colspan="3" class="title"  style="color:red;font-size:14px">备注:请上传学历调查证明电子材料</td>
		   	<td   rowspan='2'  style='text-align: center;'  class="edit" >
		   	<x:textarea name="surveyWay"  required="true" label="调查方式" maxLength="32"/>
		   	</td>
		</tr>
		<tr>
		<x:inputTD name="specialty" required="false" label="被调查人专业" maxLength="64" colspan="2"/>	
		<x:selectTD name="queryResult" required="true" label="查询结果" maxLength="22" colspan="2"/>	
		</tr>
	   <tr>
		<td  class="title"   rowspan='8'  style='text-align: center;'>工作经历</td>
		<x:inputTD name="beforeWorkLeader" required="false" label="被访者" maxLength="16"  colspan="2"/>		
		<x:inputTD name="leaderTelephone" required="false" label="联系电话" maxLength="16"  colspan="2"/>		
	    <td   rowspan='14'  style='text-align: center;'  class="title" >
    	</td>
		</tr>
		<tr>
		<x:selectTD name="relation" required="false" label="与被调查者关系" maxLength="22" colspan="2"/>		
        <td colspan="3" class="title">&nbsp;</td>
		</tr>
		
	     <tr>
	     <td colspan="1" class="title">1:原单位工作时间(起):</td>
        <td class="edit" colspan="2"><x:input name="workTimeBegin"  required="true" label="1:原单位工作时间(起)"  wrapper="date" /></td>	
		<x:inputTD name="workTimeEnd" required="false" label="原单位工作时间(止)" wrapper="date" colspan="2"/>
		</tr>
		<tr>
		<td colspan="2" class="title">2.被调查人工作经历是否与简历属实</td>
        <td class="edit" colspan="4"><x:select name="isSame"  required="true" label="被调查人工作经历是否与简历属实" dictionary="yesorno" /></td>	
		</tr>
		<tr>
		<td colspan="2" class="title">3.被调查人离职时或最近职位名称：</td>
        <td class="edit" colspan="4"><x:input name="leaveJobName"  required="true" label="职位名称"   maxLength="64"/></td>	
		</tr>
		<tr>
		  <td colspan="1" class="title">4:离职类别:</td>
        <td class="edit" colspan="2"><x:select name="leaveType"  required="true" label="离职类别"  dictionary="resignationType" /></td>
		<x:inputTD name="leaveReason" required="false" label="离职原因"  colspan="2"/>
		</tr>
		<tr>
		<td colspan="2" class="title">5.被调查人在职期间的工作业绩表现：</td>
        <td class="edit" colspan="4"><x:radio name="workPerformance"  required="true"  list="#{'excellent':'优秀','good':'良好 ','ordinary':'一般 ','worse':'较差'}" />
        </td>	
		</tr>
		<tr>
		<td colspan="1" class="title">业绩案例:</td>
        <td class="edit" colspan="5"><x:textarea name="successCase"  required="true" label="业绩案例"  rows="3"  maxLength="256"/></td>	
		</tr>
		 <tr>
		<td  class="title"   rowspan='6'  style='text-align: center;'>综合评价</td>
		<td colspan="1" class="title">1.被调查人的素质能力(如：沟通协调/悟性潜力/责任心):</td>
        <td class="edit" colspan="5"><x:textarea name="qualityAbility"  required="true" label="被调查人的素质能力"  maxLength="256"/></td>	
		</tr>
		<tr>
		<td colspan="1" class="title">2.被访者对被调查者的评价:</td>
        <td class="edit" colspan="5"><x:radio name="totalEva"  required="true" label="被访者对被调查者的评价"  list="#{'excellent':'优秀','good':'良好 ','ordinary':'一般 ','worse':'较差'}" /></td>	
		</tr>
		<tr>
		<td colspan="1" class="title">3.其他情况(如：家庭背景/性格特点/优缺点等):</td>
        <td class="edit" colspan="5"><x:textarea name="otherSituation"  required="true" label="其他情况" rows="3"  maxLength="500"/></td>	
		</tr>
		</table>
	 <x:fileList bizCode="backgroundSurvey" bizId="surveyId" id="backgroundSurveyFileList" />
</form>
		</div> 
  </body>
</html>
