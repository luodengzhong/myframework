<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
		<c:forEach items="${askReportList}" var="data">
				<tr>
					<td><div class="subject"><c:out value="${data.myRownum}"/></div></td>
					<td>
						<div><a href="javascript:showAskReport(${data.bizId});" class="GridStyle" style="font-size:16px;font-weight: bold;"><c:out value="${data.description}"/></a></div>
						<div style="color:#555555;">
							<c:out value="${data.applicantPersonMemberName}"/>&nbsp;&nbsp;&nbsp;
							<c:out value="${data.procInstStartTime}"/>&nbsp;&nbsp;&nbsp;
						</div>
					</td>
					<td>
						<div class="ui-attachment-list">
						<c:forEach items="${data.attachments}" var="fileObj">
							<div class="file" id="${fileObj.id}" fileKind="${fileObj.fileKind}" >
								<span class="${fileObj.fileKind}">&nbsp;</span>&nbsp;<a href="##" hidefocus class="fileLink">${fileObj.fileName}</a>
								<c:if test="${fileObj.attachmentCode=='textBody'}"><font style="color:Tomato;font-size:14px;font-weight: bold;">(正文)</font></c:if>
							</div>
							<c:if test="${fileObj.attachmentCode=='textBody'}"><div class="clear"></div></c:if>
						</c:forEach>
						</div>
					</td>
					<td>
						<input type="hidden" name="processDefinitionKey"  value="<c:out value="${data.processDefinitionKey}"/>"/>
						<input type="hidden" name="procUnitId"  value="<c:out value="${data.taskDefKey}"/>"/>
						<input type="hidden" name="catalogId"  value="<c:out value="${data.catalogId}"/>"/>
						<input type="hidden" name="procInstId"  value="<c:out value="${data.procInstId}"/>"/>
						<input type="hidden" name="procUnitHandlerId"  value="<c:out value="${data.procUnitHandlerId}"/>"/>
						<input type="hidden" name="bizId"  value="<c:out value="${data.bizId}"/>"/>
						<input type="hidden" name="bizCode"  value="<c:out value="${data.bizCode}"/>"/>
						<input type="hidden" name="taskId"  value="<c:out value="${data.id}"/>"/>
						<input type="hidden" name="currentHandleId"  value="<c:out value="${data.currentHandleId}"/>"/>
						<input type="hidden" name="currentHandleSequence"  value="<c:out value="${data.currentHandleSequence}"/>"/>
						<input type="hidden" name="currentHandleGroupId"  value="<c:out value="${data.currentHandleGroupId}"/>"/>
						<input type="hidden" name="currentHandleCooperationModelId"  value="<c:out value="${data.cooperationModelId}"/>"/>
						<a href="javascript:void(0);" class="ui-button ui-button-save">同意</a>
						<a href="javascript:void(0);" class="ui-button ui-button-delete">重新报批</a>
						<a href="javascript:void(0);" class="ui-button ui-button-next">打回</a>
					</td>
				</tr>
		</c:forEach>