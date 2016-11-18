<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="/WEB-INF/JSTLFunction.tld" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,dateTime,tree,combox,attachment" />
<script src='<c:url value="/biz/oa/dataCollection/use/DataCollection.js"/>' type="text/javascript"></script>
</head>
<c:set var="cols" value="6" />
<body>
	<div class="mainPanel">
		<div class="subject"><c:out value="${kindName}" /></div>
		<form method="post" action="" id="dataCollectionSubmitForm">
			<x:hidden name="dataCollectionId" />
			<x:hidden name="dataCollectionKindId" />
			<c:forEach items="${requestScope.fieldGroupList}" var="group">
				<c:set var="index" value="0" />
				<div class="navTitle" style="width:99.2%;">
					<a href='javascript:void(0);' hidefocus class='togglebtn' hideTable='#table_group_<c:out value="${group.kindFieldGroupId}"/>' title='show or hide'></a> 
					<span class='group'>&nbsp;</span>&nbsp;
					<span><c:out value="${group.groupName}" /> </span>
				</div>
				<div class="navline" style="width:99.2%;"></div>
				<table class='tableInput' style="width: 99%; margin: 2px;" id="table_group_<c:out value="${group.kindFieldGroupId}"/>">
					<x:layout/>
					<c:forEach items="${group.fields}" var="item">
						<c:set var="newLine" value="${item.newLine}" />
						<c:set var="colspan" value="${item.colSpan}" />
						<c:choose>
							<c:when test="${item.visible== '0'}">
								<input type="hidden" name="<c:out value="${item.fieldName}"/>" id="<c:out value="${item.fieldName}"/>" value="<c:out value="${fieldValues[item.fieldName]}"/>" />
							</c:when>
							<c:otherwise>
								<c:choose>
									<c:when test="${newLine== '1'}">
										<c:forEach begin="1" end="${cols-index}">
											<td class='title'>&nbsp;</td>
										</c:forEach>
										</tr>
										<tr>
											<c:set var="colspan" value="${cols-1}" />
											<c:set var="index" value="${cols}" />
									</c:when>
									<c:otherwise>
										<c:choose>
											<c:when test="${(index+1+colspan)>cols}">
												<c:set var="colspan" value="${cols-1-index}" />
											</c:when>
											<c:when test="${(index+1+colspan)==cols-1}">
												<c:set var="colspan" value="${colspan+1}" />
											</c:when>
										</c:choose>
										<c:if test="${colspan<1}">
											<c:set var="colspan" value="1" />
										</c:if>
										<c:if test="${index%cols==0}">
											<c:if test="${index==cols}">
												</tr>
												<c:set var="index" value="0" />
											</c:if>
											<tr>
										</c:if>
										<c:set var="index" value="${index+1+colspan}" />
										<c:if test="${index>cols}">
											<c:set var="index" value="cols" />
										</c:if>
									</c:otherwise>
								</c:choose>
								<td class='title'>
									<span class="labelSpan"><c:out value="${item.displayName}" /> <c:if test="${item.isRequired==1}"><font color='#FF0000'>*</font></c:if>:</span>
								</td>
								<td colspan='<c:out value="${colspan}"/>' class='<c:out value="${item.readOnly==1?'disable edit':'edit'}" />'>
									<c:choose>
									<c:when test="${item.controlType=='input'||item.controlType=='date'||item.controlType=='datetime'}">
										<input type='text'
										class='text<c:out value="${item.readOnly==1?' textReadonly':''}" />'
										name="<c:out value="${item.fieldName}"/>"
										id="<c:out value="${item.fieldName}"/>"
										value="<c:out value="${fieldValues[item.fieldName]}"/>"
										maxLength="<c:out value="${item.fieldLength}"/>"
										<c:if test="${item.controlType=='date'&&item.readOnly==0}">
											date="true"
										</c:if>
										<c:if test="${item.controlType=='datetime'&&item.readOnly==0}">
											datetime="true"
										</c:if>
										<c:if test="${item.fieldMask!=''}">
											mask="<c:out value="${item.fieldMask}"/>"
										</c:if>
										<c:if test="${item.isRequired==1}">
											required="true" label="<c:out value="${item.displayName}"/>"
										</c:if>
										<c:if test="${item.readOnly=='1'}">
											readOnly="true"
										</c:if>/>
									</c:when>
									<c:when test="${item.controlType=='textarea'}">
										<textarea 
											class='textarea<c:out value="${item.readOnly==1?' textareaReadonly':''}" />'
											name="<c:out value="${item.fieldName}"/>"
											id="<c:out value="${item.fieldName}"/>"
											maxLength="<c:out value="${item.fieldLength}"/>"
											<c:if test="${item.readOnly=='1'}">
												readOnly="true"
											</c:if>
											<c:if test="${item.isRequired==1}">
												required="true" label="<c:out value="${item.displayName}"/>"
											</c:if>
											rows="5"
										><c:out value="${fieldValues[item.fieldName]}"/></textarea>
									</c:when>
									<c:when test="${item.controlType=='select'}">
										<select	  class="select"
											name="<c:out value="${item.fieldName}"/>"
											id="<c:out value="${item.fieldName}"/>"
											<c:if test="${item.readOnly=='1'}">
												readOnly="true"
											</c:if>
											<c:if test="${item.isRequired==1}">
												required="true" label="<c:out value="${item.displayName}"/>"
											</c:if>
										>
											<option value=""></option>
											<c:forEach items="${item.dataSource}" var="d">
								                <option value="${d.key}"  <c:if test="${fieldValues[item.fieldName]==d.key}">selected="selected"</c:if>>${d.value}</option>  
								            </c:forEach>
										</select>
									</c:when>
									<c:when test="${item.controlType=='radio'}">
										<c:forEach items="${item.dataSource}" var="d">
											<label>
												<input type="radio" 
													name="<c:out value="${item.fieldName}"/>" 
													value="${d.key}" 
													<c:if test="${fieldValues[item.fieldName]==d.key}">checked="true"</c:if>
												/>
												&nbsp;${d.value}
											</label>
										</c:forEach>
									</c:when>
									<c:when test="${item.controlType=='checkbox'}">
										<c:forEach items="${item.dataSource}" var="d">
											<label>
												<input type="checkbox" 
													name="<c:out value="${item.fieldName}"/>" 
													value="${d.key}" 
													<c:if test="${f:checkContains(fieldValues[item.fieldName],d.key)}">checked="true"</c:if>
												/>
												&nbsp;${d.value}
											</label>
										</c:forEach>
									</c:when>
									</c:choose>
								</td>
							</c:otherwise>
						</c:choose>
					</c:forEach>
					<c:forEach begin="1" end="${cols-index}">
						<td class='title'>&nbsp;</td>
					</c:forEach>
					</tr>
				</table>
			</c:forEach>
		</form>
		<div class="blank_div"></div>
		<x:fileList bizCode="dataCollection" bizId="dataCollectionId"	id="dataCollectionAttachment" />
	</div>
</body>
</html>