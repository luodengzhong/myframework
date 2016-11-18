<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid,dialog,dateTime,tree,combox" />
<script src='<c:url value="/biz/oa/dataCollection/use/DataCollectionList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="dataCollectionKindId" id="mainDataCollectionKindId"/>
			<x:hidden name="dataCollectionKindName" id="mainDataCollectionKindName"/>
			<x:title title="搜索" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 1000px;">
					 <c:forEach items="${conditionFields}" var="item">
					 	<dl>
					 		<dt><c:out value="${item.displayName}" />&nbsp;:</dt>
					 		<c:choose>
								<c:when test="${item.fieldType=='VARCHAR2'}">
									<c:choose>
									<c:when test="${item.controlType=='input'||item.controlType=='textarea'||item.controlType=='checkbox'}">
										<dd style="width:210px"><input	 type="text"	 name="<c:out value="${item.fieldName}" />"	 maxlength="32"	 class="text"	/></dd>
									</c:when>
									<c:when test="${item.controlType=='select'||item.controlType=='radio'}">
									<dd style="width:80px">
										<select	 name="<c:out value="${item.fieldName}" />Symbol" class="select">
										    <option value="eq">等于</option>
										    <option value="in">包含</option>
										    <option value="noteq">不等于</option>
										    <option value="notin">不包含</option>
										</select>
									</dd>
									<dd style="width:120px">
										<input	 type="text"	 name="<c:out value="${item.fieldName}" />"	 maxlength="32"	 class="text selectField" />
										<select	 id="<c:out value="${item.fieldName}" />DataSource" style="display: none">
											<c:forEach items="${item.dataSource}" var="d">
								                <option value="${d.key}">${d.value}</option>  
								            </c:forEach>
										</select>
									</dd>
									</c:when>
									</c:choose>
								</c:when>
								<c:when test="${item.fieldType=='DATE'}">
								<dd style="width:100px">
									<input	 type="text"	 name="<c:out value="${item.fieldName}" />Begin"	 class="text" date="true"/>
								</dd>
								<dd style="width:100px">
									<input	 type="text"	 name="<c:out value="${item.fieldName}" />End"	 class="text" date="true"/>
								</dd>
								</c:when>
								<c:when test="${item.fieldType=='NUMBER'}">
								<dd style="width:80px">
									<select	 name="<c:out value="${item.fieldName}" />Symbol" class="select">
									    <option value="eq">等于</option>
									    <option value="gt">大于</option>
									    <option value="lt">小于</option>
									    <option value="noteq">不等于</option>
									    <option value="gteq">大于等于</option>
									    <option value="lteq">小于的等于</option>
									</select>
								</dd>
								<dd style="width:120px">
									<input	 type="text"	 name="<c:out value="${item.fieldName}" />"	 class="text"/>
								</dd>
								</c:when>
							</c:choose>
					 	</dl>
					 </c:forEach>
					<dl>
						<x:button value="查 询" onclick="queryForm(this.form)" /> &nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)" />&nbsp;&nbsp;
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>