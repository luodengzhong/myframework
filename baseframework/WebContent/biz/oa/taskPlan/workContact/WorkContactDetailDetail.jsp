
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 860px;">
<x:hidden name="workContactId" /> 		
			<div style="margin: 0 auto;">
				<div class="subject">工 作 联 系 单</div>
			</div>
	<table class='tableInput' style="width: 99%;">
					<x:layout proportion="12%,24%,14%,24%" />
					<tr>
						<x:inputTD name="worktitle" disabled="true" required="false"
							label="标题" maxLength="256" colspan="3"/>
					</tr>
					<tr>
						<x:inputTD name="organName" disabled="true" required="false"
							label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" disabled="true" required="false"
							label="单据号码" maxLength="32" />
					</tr>
					<tr>
						<x:inputTD name="fillinDate" disabled="true" required="false"
							label="填表日期" maxLength="7" wrapper="dateTime" />
						<x:inputTD name="startDeptName" disabled="true" required="false"
							label="发起部门名称" maxLength="64" />
					</tr>
					<tr>
						<x:inputTD name="workPersonName" disabled="true" required="false"
							label="发起人名称" maxLength="65" /> 
						<x:inputTD name="lastDealDate"  disabled="true" required="false" label="最后处理时间"
							maxLength="7" wrapper="dateTime" />		
					</tr>
					<tr>				
						<x:textareaTD name="remark" required="false" label="备注信息"
							rows="3" colspan="3">
						</x:textareaTD>
					</tr>				
					
				</table>	
				<br/>			
				<div >联 系 事 项</div>
		<x:hidden name="workContactDetailId" />
		<x:hidden name="deptId" />
		<x:hidden name="funTypeId" /> 
		<x:hidden name="taskId"/>
		<x:hidden name="personId"/>
		<table class='tableInput' style="width: 99%;"> 
					<x:layout proportion="12%,24%,14%,24%" />
			<tr>
				<x:inputTD name="deptName" required="false" disable="true"
					label="联系部门名称" maxLength="64"  wrapper="tree"/>				
					
				<x:inputTD name="funTypeName" required="false" label="职能类别"
					maxLength="64" wrapper="select"/>
			</tr>
			<tr>
				<x:inputTD name="fullName" required="false" label="全路径"
					maxLength="256" disabled="true"/>
					<x:inputTD name="createDate" required="false" disable="true"
					label="创建时间" maxLength="7" wrapper="dateTime" />
			</tr> 
			<tr>

				<x:selectTD name="expectLoad" required="false" label="预估工作量"
					maxLength="10" list="infoDemandWorkList" />
				<x:inputTD name="expectDate" required="false" label="预期完成时间"
					maxLength="7" wrapper="dateTime" />

			</tr> 
			<%-- <tr>
				
				<x:selectTD name="urgentDegree" required="false" label="优先级"
					maxLength="22" list="infoDemandUrgentList" />
			</tr> --%>
			<tr> 
				<x:selectTD name="status" required="false" label="审核状态" disabled="true" 
							maxLength="10"  list="billStatusMap"  />
				<x:inputTD name="personName" required="true"  
					label="执行人"  wrapper="select"/>			
			</tr>	
			<tr>
				<x:textareaTD name="title" required="false" label="联系事项标题"
							width="744" rows="2" colspan="3"  maxLength="64" >
						</x:textareaTD>
			</tr>
			<tr>
				<x:textareaTD name="description" required="false" label="联系事项描述"
							width="744" rows="3" colspan="3"  maxLength="1000" >
						</x:textareaTD>
			</tr>	

				</table>
	</div>
	<div class="blank_div"></div>
	<div id="extendedFieldDiv"></div>
	<div class="blank_div"></div>
	<x:fileList bizCode="workContact" bizId="workContactId" id="workContactIdAttachment" />
	<div class="blank_div"></div>
</form>
