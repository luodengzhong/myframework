<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<style>
body{background-color:#e6efff;}
</style>
<script type="text/javascript">
function viewPosDetail(recPosId,sourceType){
 window.location.href =web_app.name + '/personregisterAction!forwardPosDetail.do?posId='+recPosId+'&sourceType='+sourceType;
}
</script>
</head>
<body>

<form method="post" action="" id="queryMainForm">
								<div class="ui-form" id="queryDiv" style="width: 900px;">
									<x:inputL name="applyPosName" required="false" label="应聘岗位名称"
										maxLength="64" />
									<x:inputL name="staffName" required="false" label="姓名"
										maxLength="32" />
									<x:inputL name="idCardNo" required="false" label="身份证号"
										maxLength="20" />
									<x:selectL name="education" required="false" label="最高学历"
										maxLength="2" />
									<x:selectL name="englishLevel" required="false" label="英语程度"
										maxLength="2" />
									<x:inputL name="height" required="false" label="身高(cm)"
										maxLength="8" />
									<dl>
										<p>以上</p>
									</dl>
									
									<x:selectL name="sourceType" required="false" label="应聘来源"
										maxLength="22" dictionary="recruitWay" />
									<x:selectL name="recruitResult" required="false" label="应聘结果" />
									<x:inputL name="registerDate" required="false" label="填表时间"  wrapper="date" />


									<dl>
										<dd>
						               <x:checkbox  name="checkvalue"  label="查询当前公司简历"   checked="true" />
						              </dd>
										<x:button value="查 询" onclick="query(this.form)" />
										&nbsp;&nbsp;
										<x:button value="重 置" onclick="resetForm(this.form)" />
										&nbsp;&nbsp;
									</dl>
								</div>
							</form>
							<div class="blank_div"></div>

<table border="0"  width="659" class="centerTable">
	<thead>
		<tr >
			<th align="center">职位</th>
			<th align="center">部门</th>
			<th align="center">单位</th>
			<th align="center">人数</th>
		</tr>
	</thead>
	<c:forEach items="${posList}" var="data">
	<tr>
	   <input type='hidden' name='recPosId'  value='<c:out value="${data.recPosId}"/>' />
	   <input type='hidden' name='jobPosId'  value='<c:out value="${data.jobPosId}"/>' />
	    <input type='hidden' name='sourceType'  value='<c:out value="${data.sourceType}"/>' />
	   
		<td align="center" height="40"  width="60" title='<c:out value="${data.name}"/>' class="title"  ><a href="javascript:viewPosDetail('+${data.recPosId}+'  , '+${data.sourceType}+');"  class="GridStyle">
		<c:out value="${data.name}" /></a></td>
		<td align="center" width="80" title='<c:out value="${data.deptName}"/>' class="title"><c:out value="${data.deptName}" /></td>
		<td align="center" width="140" title='<c:out value="${data.organName}"/>' class="title"><c:out value="${data.organName}" /></td>
		<td align="center" width="60" title='<c:out value="${data.recNumber}"/>' class="title"><c:out value="${data.recNumber}" /></td>
	</tr>						
	</c:forEach>
</table>
</div>
</body>
</html>