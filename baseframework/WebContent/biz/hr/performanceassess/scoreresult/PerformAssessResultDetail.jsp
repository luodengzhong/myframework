<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,attachment"/>
   <script src='<c:url value="/biz/hr/performanceassess/scoreresult/PerformAssessResultDetail.js"/>' type="text/javascript"></script>
  	 <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
  	 <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
  			<div class="subject">员工测评结果</div>
	  	<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable'>
		     <x:layout proportion="70px,70px,70px,70px,70px,70px" />
					
		<x:hidden name="resultId"/>
		<x:hidden name="formId"/>
		<x:hidden name="scoreStatus"/>
		<x:hidden name="assessId"/>
		<x:hidden name="organName"/>
		<x:hidden name="periodCode"/>
		<tr>
		<x:inputTD name="assessName" required="false" label="被考核对象姓名" maxLength="64"  readonly="true"/>	
		<x:inputTD name="formName" required="false" label="任务名称" maxLength="64" colspan="3"   readonly="true"/>
		
		</tr>
		
		<tr>
		<x:inputTD name="age" required="false" label="年龄" maxLength="64"  readonly="true"/>	
		<x:inputTD name="ognName" required="false" label="单位" maxLength="64"  readonly="true"/>
		<x:inputTD name="posName" required="false" label="现任岗位" maxLength="64"  readonly="true"/>
		</tr>
		<tr>
		<x:inputTD name="employedDate" required="false" label="入职时间" maxLength="64"  readonly="true"  wrapper="date"/>	
		<x:selectTD name="sex" required="false" label="性别" maxLength="64"  readonly="true"/>
		<x:selectTD name="education" required="false" label="学历" maxLength="64"  readonly="true"/>
		</tr>
		<tr>	
		
		<td class="title" style='height: 40px;text-align: center;'>测评内容</td>	
		<td  style='height: 40px;text-align: center;'>上级平均分</td>	
		<td   style='height: 40px;text-align: center;'>业务横向平均分</td>	
		<td style='height: 40px;text-align: center;'>下级平均分</td>	
		<td style='height: 40px;text-align: center;'>合计平均分</td>	
		<td style='height: 40px;text-align: center;'>自评分</td>		

		</tr>
		
		<tr>			
		<td class="title" style='height: 40px;text-align: center;'>合计</td>	
		<td style='height: 40px;text-align: center;'>${upLevelAverageScore}</td>	
		<td style='height: 40px;text-align: center;'>${equelLevelAverageScore}</td>	
		<td style='height: 40px;text-align: center;'>${lowLevelAverageScore}</td>	
		<td style='height: 40px;text-align: center;'>${totalAverage}</td>	
		<td style='height: 40px;text-align: center;'>${scoreMyself}</td>		
		</tr>
		
		 <tr>
		<td  class="title"   rowspan='4'  style='text-align: center;'>素 质 测 评</td>
		 <td class="title" style='height: 40px;text-align: center;'>参加测评人员</td>
		<td colspan="4" style='height: 40px;'><c:out value="${personAnalyze}" escapeXml="false"/></td>
		
		</tr>
	   <tr>
	    <td class="title" style='height: 70px;text-align: center;'>指标得分排名前三项</td>
		<td colspan="4" style='height: 70px;'><c:out value="${topAnalyze}" escapeXml="false"/></td>
		
		</tr>
		<tr>
		<td class="title" style='height: 70px;text-align: center;'>指标得分排名后三项</td>
		<td colspan="4" style='height: 70px;'><c:out value="${lowAnalyze}" escapeXml="false"/></td>
		
		</tr>
		
       </table>
			</form>
		</div> 
  </body>
</html>
