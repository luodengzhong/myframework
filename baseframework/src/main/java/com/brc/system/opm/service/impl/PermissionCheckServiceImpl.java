package com.brc.system.opm.service.impl;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.brc.system.configuration.ConfigurationService;
import com.brc.system.opm.service.PermissionCheckService;
import com.brc.system.share.service.ServiceUtil;
import com.brc.util.QueryModel;
import com.brc.util.SDO;
import com.brc.xmlbean.EntityDocument;

public class PermissionCheckServiceImpl implements PermissionCheckService {
	private static final long serialVersionUID = 2950876027571297498L;
	private ServiceUtil serviceUtil;
	private ConfigurationService configurationService;

	public void setServiceUtil(ServiceUtil serviceUtil) {
		this.serviceUtil = serviceUtil;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	private EntityDocument.Entity getPermissionCheckEntity() {
		return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "permissionCheck");
	}

//	private Long saveBizData() {
//		SDO bizData = getBizAndApprovalData();
//		Long id = (Long) bizData.getProperty("id", Long.class);
//		if (CommonUtil.isLongNull(id)) {
//			bizData.putProperty("status", Integer.valueOf(BillStatus.APPLYING.getId()));
//			id = (Long) this.serviceUtil.getEntityDao().insert(getPermissionCheckEntity(), bizData.getProperties());
//		} else {
//			this.serviceUtil.getEntityDao().update(getPermissionCheckEntity(), bizData.getProperties(), new String[0]);
//		}
//		if (bizData.isApplyProcUnit()) {
//			String taskId = (String) bizData.getProperty("taskId", String.class);
//			if (!StringUtil.isBlank(taskId)) {
//				this.configurationService.deleteHandlerByBizId(id);
//			}
//			List details = bizData.getList("detailData");
//			this.configurationService.saveHandlerByBizIdAndData(details, id);
//		}
//		return id;
//	}

	private void updateStatus(Long id, BillStatus status) {
		String tableName = getPermissionCheckEntity().getTable();
		this.serviceUtil.updateStatusById(tableName, "ID", id, Integer.valueOf(status.getId()));
	}

//	private void doUpdateBackStatus(DelegateTask delegateTask, String destActivityId) {
//		if (destActivityId.equalsIgnoreCase("apply")) {
//			Long bizId = getBizIdFromTask(delegateTask);
//			updateStatus(bizId, BillStatus.APPLYING);
//		}
//	}

	public Map<String, Object> load(Long id) {
		return this.serviceUtil.getEntityDao().loadById(getPermissionCheckEntity(), id);
	}

	public void delete(Long[] ids) {
		this.serviceUtil.getEntityDao().deleteByIds(getPermissionCheckEntity(), (Serializable[]) ids);
	}
//
//	public Long saveBizAndApprovalData() {
//		super.saveBizAndApprovalData();
//		return saveBizData();
//	}

//	protected void doCalculateNextProcUnitHandlers(DelegateTask delegateTask) {
//		if (isApplyProcUnit(delegateTask)) {
//			Long bizId = getBizIdFromTask(delegateTask);
//
//			List<Map<String, Object>> handlerList = queryHandler(bizId);
//			if ((null == handlerList) || (handlerList.size() == 0)) {
//				throw new ApplicationException("未找流程处理人。");
//			}
//			List handlers = new ArrayList(handlerList.size());
//
//			ApprovalRuleHandler approvalRuleHandler = new ApprovalRuleHandler();
//			approvalRuleHandler.setApprovalRuleId(Long.valueOf(0L));
//			approvalRuleHandler.setId(Long.valueOf(0L));
//			approvalRuleHandler.setHandlerKindCode(HandlerKind.PSM.getId());
//
//			for (Map m : handlerList) {
//				String handleKindName = (String) ClassHelper.convert(m.get("handleKindName"), String.class, "");
//				Integer groupId = (Integer) ClassHelper.convert(m.get("groupId"), Integer.class, Integer.valueOf(1));
//				Integer sequence = (Integer) ClassHelper.convert(m.get("sequence"), Integer.class, Integer.valueOf(1));
//				String fullId = (String) ClassHelper.convert(m.get("fullId"), String.class, "");
//				String fullName = (String) ClassHelper.convert(m.get("fullName"), String.class, "");
//
//				approvalRuleHandler.setGroupId(groupId);
//				approvalRuleHandler.setDescription(handleKindName);
//
//				if (!StringUtil.isBlank(fullId)) {
//					handlers.add(buildProcUnitHandler(String.valueOf(bizId), "Approve", new OrgUnit(fullId, fullName),
//							approvalRuleHandler, sequence, 0, "chief", Long.valueOf(0L)));
//				}
//			}
//
//			this.procUnitHandlerService.deleteProcUnitHandlerByBizId(getBizIdAsLong());
//			this.procUnitHandlerService.batchInsertProcUnitHandlers(handlers);
//		}
//	}
//
//	protected void onBeforeComplete(DelegateTask delegateTask) {
//		super.onBeforeComplete(delegateTask);
//
//		if ((isApplyProcUnit(delegateTask)) && (isAdvanceCmd())) {
//			Long bizId = getBizIdFromTask(delegateTask);
//			updateStatus(bizId, BillStatus.APPROVING);
//		}
//	}
//
//	protected void onWithdraw(DelegateTask delegateTask, String destActivityId) {
//		super.onWithdraw(delegateTask, destActivityId);
//		doUpdateBackStatus(delegateTask, destActivityId);
//	}
//
//	protected void onBack(DelegateTask delegateTask, String destActivityId) {
//		super.onBack(delegateTask, destActivityId);
//		doUpdateBackStatus(delegateTask, destActivityId);
//	}
//
//	protected void onAbort(DelegateTask delegateTask) {
//		super.onAbort(delegateTask);
//		Long bizId = getBizIdFromTask(delegateTask);
//		updateStatus(bizId, BillStatus.ABORTED);
//	}
//
//	protected void onDeleteProcessInstance(DelegateExecution delegateExecution) {
//		Long bizId = getBizIdFromExecution(delegateExecution);
//		this.serviceUtil.getEntityDao().deleteById(getPermissionCheckEntity(), bizId);
//	}
//
//	protected void onRecallProcessInstance(DelegateExecution delegateExecution) {
//		Long bizId = getBizIdFromExecution(delegateExecution);
//		updateStatus(bizId, BillStatus.ABORTED);
//	}
//
//	public void onEnd(DelegateExecution delegateExecution) {
//		Long bizId = getBizIdFromExecution(delegateExecution);
//		BillStatus status = BillStatus.COMPLETED;
//		if (!approvePassed()) {
//			status = BillStatus.ABORTED;
//		}
//
//		updateStatus(bizId, status);
//	}

	public Map<String, Object> slicedQuery(SDO params) {
		QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getPermissionCheckEntity(),
				params.getProperties());
		return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
	}

	public List<Map<String, Object>> queryHandler(Long id) {
		return this.configurationService.queryHandlerOrgByBizId(id);
	}

	public static enum BillStatus {
		APPLYING(0, "申请"), APPROVING(1, "审批中"), SUSPENDED(2, "已挂起"), COMPLETED(3, "已完成"), ARCHIVED(4, "已归档"), ABORTED(5,
				"已中止");

		private int id;
		private String displayName;

		private BillStatus(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static BillStatus fromId(int id) {
			switch (id) {
			case 0:
				return APPLYING;
			case 1:
				return APPROVING;
			case 2:
				return SUSPENDED;
			case 3:
				return COMPLETED;
			case 4:
				return ARCHIVED;
			case 5:
				return ABORTED;
			}
			throw new RuntimeException(String.format("无效的业务状态“%s”！", new Object[] { Integer.valueOf(id) }));
		}

		public int getId() {
			return this.id;
		}

		public String getDisplayName() {
			return this.displayName;
		}

		public static Map<String, String> getMap() {
			Map map = new HashMap(values().length);
			for (BillStatus c : values()) {
				map.put(String.valueOf(c.getId()), c.getDisplayName());
			}
			return map;
		}
	}
}
