<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,dateTime,grid,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/setup/DetailUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/archives/ArchivesDetail.js"/>' type="text/javascript"></script>
</head>
<c:set var="cols" value="6" />
<body>
	<div class="mainPanel">
		<table style="width: 99%;">
			<tr>
				<td style="width: 200px;" id="leftTD">
					<div class="float-box ui-combo-dialog" id="floatBox">
						<div class='combo-dialog-title'>
							<a id="float-box-toggle" class="toggle"></a>
							<div id="boxToolBar" style="background:none;border:0;"></div>
							<span style='clear: both;'></span>
						</div>
						<div id='float-box-down'>
							<div style="text-align: center;">
								<img src='<c:url value="/attachmentAction!downFileBySavePath.ajax?file=${picturePath}"/>' height='120' width='85' border=0 id="showArchivePicture"/>
										
								<a target='_blank' href='<c:url value="/attachmentAction!downFileBySavePath.ajax?file=${picturePath}"/>'  hidefocus id="loadArchivePicture">
									<img src='/xt/themes/default/images/icons/download.gif' width="16" height="16"  style="border: 0px;"/>
								</a>
							</div>
							<div
								style="overflow-x: hidden; overflow-y: auto; width: 190px; margin-top: 3px;" id="treeArea">
								<ul id="mainTree"></ul>
							</div>
						</div>
					</div></td>
				<td>
					<div id="archivesMainInfoDiv">
						<x:hidden name="personOwnFlag" id="personOwnFlagId" />
						<form method="post" action="" id="submitForm">
							<x:hidden name="archivesId" id="modifArchivesId" />
							<x:hidden name="oporgproperty" id="oporgproperty" />
							<c:forEach items="${requestScope.archivesFieldGroupList}"
								var="group">
								<c:set var="index" value="0" />
								<c:if test="${group.groupId!= '-1'}">
									<div id='group' class="navTitle">
										<a href='javascript:void(0);' hidefocus class='togglebtn'
											hideTable='#table_group_<c:out value="${group.groupId}"/>'
											title='show or hide'></a> <span class='group'>&nbsp;</span>&nbsp;
										<span><c:out value="${group.groupName}" /> </span>
									</div>
									<div class="navline"></div>
								</c:if>
								<table class='tableInput' style="width: 99%; margin: 2px;"
									id="table_group_<c:out value="${group.groupId}"/>">
									<COLGROUP>
										<COL width='14%'>
										<COL width='19%'>
										<COL width='14%'>
										<COL width='19%'>
										<COL width='14%'>
										<COL width='19%'>
									</COLGROUP>
									<c:forEach items="${group.items}" var="item">
										<c:set var="newLine" value="${item.newLine}" /> <c:set var="colspan" value="${item.colspan}" />
										<c:choose>
											<c:when test="${item.visible== '0'}">
												<input type="hidden" name="<c:out value="${item.name}"/>" id="<c:out value="${item.name}"/>" value="<c:out value="${item.value}"/>" />
											</c:when>
											<c:otherwise>
												<c:choose>
													<c:when test="${newLine== '1'}">
														<c:forEach begin="1" end="${cols-index}">
															<td class='title'>&nbsp;</td>
														</c:forEach>
														</tr>
														<tr >
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
												<td class='title'><span class="labelSpan"><c:out
															value="${item.display}" /> <c:if
															test="${item.nullable==0}">
															<font color='#FF0000'>*</font>
												 </c:if>:</span></td>
												<td colspan='<c:out value="${colspan}"/>'
													class='<c:out value="${item.readOnly==1?'disable edit':'edit'}" />'>
													<c:if test="${item.controlType=='select'&&item.readOnly==0}">
														<div class="ui-combox-wrap">
													</c:if>
													<input type='text' class='text<c:out value="${item.readOnly==1?' textReadonly':''}" />'
													name="<c:out value="${item.name}"/>"
													id="<c:out value="${item.name}"/>"
													value="<c:out value="${item.value}"/>"
													maxLength="<c:out value="${item.fieldLength}"/>"
													<c:if test="${item.controlType=='date'&&item.readOnly==0}">
														date="true"
													</c:if>
													<c:if test="${item.controlType=='select'&&item.readOnly==0}">
														select="<c:out value="${item.dataSource}"/>"
													</c:if>
													<c:if test="${item.controlType=='number'}">
														mask="number" precision="<c:out value="${item.fieldPrecision}"/>"
													</c:if>
													<c:if test="${item.controlType=='money'}">
														mask="money"
													</c:if>
													<c:if test="${item.controlType=='dictionary'}">
														combo="true" dataOptions="data:<c:out value="${item.dataSource}"/>"	
													</c:if> 
													<c:if test="${item.nullable==0}">
														required="true" label="<c:out value="${item.display}"/>"
													</c:if>
													<c:if test="${item.readOnly=='1'}">
														readOnly="true"
													</c:if> />
													<c:if test="${item.controlType=='select'&&item.readOnly==0}">
													<span class="select">&nbsp;</span></div>
													</c:if>
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
					</div>
				</td>
			</tr>
		</table>
	</div>
	<div id="archivesDetailDiv" style="display:none;position:absolute;top:10px;">
		<div style="text-align:center;margin-top:20px;">
			<x:button value="导 出" onclick="DetailUtil.gridExport()" id="archivesGridExport"/>&nbsp;&nbsp;&nbsp;
			<x:button value="返 回" onclick="backArchivesMain()" />
		</div>
	</div>
</body>
</html>