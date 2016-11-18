package com.brc.biz.common;

import com.brc.exception.ApplicationException;
import com.brc.util.Singleton;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

public final class GlobalConstant {

	public static final String PAYMENT_MODE_DICTIONARY = "PaymentMode";

	public static final boolean COLLECTION_SMS = true;

	public static final int FOUR_STAR = 4;

	public static final int PENALTY_SCALE = 4;

	public static final String PENALTY_JSON_NAME = "penaltyJson";

	public static final int BATCH_PENALTY_COUNT = 500;

	public static final int ACCOUNT_CHARGE_DEFAULT_TYPE = 0;

	public static final int ACCOUNT_ONCE_ITEM_TYPE = 1;

	public static final int ACCOUNT_PERIOD_ITEM_TYPE = 2;

	public static final int ACCOUNT_METER_ITEM_TYPE = 3;

	public static final int RESOURCE_TYPE_CHARGE = 1;

	public static final int ASSIGN_CHARGE_CUSTOMER_TYPE = 3;

	public static final int AUTO_CHARGE_MODE = 1;

	public static final int HAND_CHARGE_MODE = 2;

	public static final int STANDARD_CHARGE_MODE = 1;

	public static final int FORCE_CHARGE_MODE = 2;

	public static final int HAVE_PENALTY_NO = 0;

	public static final int HAVE_PENALTY_YES = 1;

	public static final int ZH_CN_CURC_TYPE = 1;

	public static final int ONCE_ACCOUNT_CHARGE_TYPE = 1;

	public static final int ONCE_NUMBER_ACCOUNT_CHARGE_TYPE = 2;

	public static final int INVOICE_NO = 0;

	public static final int ADVICE_STATUS_DEFAULT_VAL = 1;

	public static final int RECOVER_ARREAR_VAL = 1;

	public static final int CONTRACT_SUSPEND_STATUS = 3;

	public static final int CONTRACT_CHANGE_STATUS = 4;

	public static final int MATERIAL_RETURN_CHANGE_TYPE = 2;

	public static final Integer PARTITION_RESOURCE_TYPE_ID = Integer.valueOf(10);

	public static final Integer QUALITY_EVALUATION_TYPE_ID = Integer.valueOf(3);

	public static final int CONTRACT_END_STATUS = 5;

	public static final int STOCK_CONTRACT = 1;

	public static final int CLEAR_OPRT_TYPE = 1;

	public static final int CLEARUNPAID_OPRT_TYPE = 2;

	public static final int SUBMIT_OPRT_TYPE = 3;

	public static final int SUBMIT_SELECTED_OPRT_TYPE = 4;

	public static final int CANCLE_OPRT_TYPE = 5;

	public static final int BATCH_THREAD_THRESHOLD = 10;

	public static final String NEW_SCHEME_TYPE = "newScheme";

	public static final String MODIFY_SCHEME_TYPE = "modifyScheme";

	public static final String HAND_SCHEME_TYPE = "hand";

	public static final String AUTO_SCHEME_TYPE = "auto";

	public static final String ONE_TO_ONE_SCHEME_TYPE = "onetoone";

	public static final int ONE_TO_ONE_TYPE = 1;

	public static final int NOT_ONE_TO_ONE_TYPE = 0;

	public static final int RESOURCE_SCHEME_IN_MODIFY = 3;

	public static final int RESOURCE_SCHEMING = 2;

	public static final int RESOURCE_SCHEMED = 1;

	public static final int RESOURCE_NOT_SCHEME = 0;

	public static final String LEASE_CONTRACT_TYPE = "leaseContract";

	public static final String PROP_CONTRACT_TYPE = "propContract";

	public static final String LEASE_BACK_CONTRACT_TYPE = "leasebackContract";

	public static final int CAL_SALE_POINT = 1;

	public static final int NOT_CAL_SALE_POINT = 0;

	public static final Long SALE_POINT_ACCOUNT_ID = (Long) Singleton.getParameter("SalePointAccountId", Long.class);

	public static final String CONTRACT_CHARGE_MOLD = "contractChargeMold";

	public static final int CONTRACT_CHARGE_LEASE = 1;

	public static final int CONTRACT_CHARGE_PROPERTY = 3;

	public static final int CONTRACT_CHARGE_SALES = 4;

	public static final int CONTRACT_CHARGE_PAY = 2;

	public static enum fieldType {
		STRING(1, String.class), NUMBER(2, Number.class), DATE(3, Date.class), DATETIME(4, Timestamp.class), BOOL(5,
				Boolean.class);

		private int index;
		private Class<?> clazz;

		private fieldType(int index, Class<?> clazz) {
			this.clazz = clazz;
			this.index = index;
		}

		public int getId() {
			return index;
		}

		public static fieldType fromId(int index) {
			switch (index) {
			case 1:
				return STRING;
			case 2:
				return NUMBER;
			case 3:
				return DATE;
			case 4:
				return DATETIME;
			case 5:
				return BOOL;
			}
			return null;
		}

		public Class<?> getFieldClass() {
			return clazz;
		}
	}

	public static enum YesOrNo {
		YES(1, "是"), NO(0, "否");

		private int id;
		private String displayName;

		private YesOrNo(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static YesOrNo fromId(int id) {
			if (id == 1) {
				return YES;
			}
			return NO;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum Status {
		DRAFT(0, "草稿"), ENABLE(1, "启用"), DISABLE(-1, "停用");

		private int id;
		private String displayName;

		private Status(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static Status fromId(int id) {
			if (id == 0)
				return DRAFT;
			if (id == 1) {
				return ENABLE;
			}
			return DISABLE;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum Ownership {
		ONESELF(1, "自持"), OWNER(2, "业主持有"), LEASEBACK(3, "返租");

		private int id;
		private String displayName;

		private Ownership(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static Ownership fromId(int id) {
			if (id == 1)
				return ONESELF;
			if (id == 2) {
				return OWNER;
			}
			return LEASEBACK;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum ReceiptSegmentStatus {
		IN_STOCK(

				1), COLLAR(

						2), USING(

								3), DISCARD(

										4), APPROVE(

												5), CANCELLATION(

														6),

		CANCELLATION_DISCARD(

				7),

		CANCELLATIONTWO(

				9),

		CANCELLATIONTWO_DISCARD(

				10),

		CHANGED(

				11),

		CANCELLATION_CHANGED(

				14),

		CANCELLATIONTWO_CHANGED(

				17);

		public final int value;

		private ReceiptSegmentStatus(int v) {
			value = v;
		}

		public int intValue() {
			return value;
		}

		public String strValue() {
			return String.valueOf(value);
		}

		public boolean equal(Object obj) {
			if (obj == null) {
				return false;
			}
			return String.valueOf(value).equals(obj.toString());
		}

		public static ReceiptSegmentStatus fromInt(int i) {
			switch (i) {
			case 1:
				return IN_STOCK;
			case 2:
				return COLLAR;
			case 3:
				return USING;
			case 4:
				return DISCARD;
			case 5:
				return APPROVE;
			case 6:
				return CANCELLATION;
			case 7:
				return CANCELLATION_DISCARD;
			case 9:
				return CANCELLATIONTWO;
			case 10:
				return CANCELLATIONTWO_DISCARD;
			case 11:
				return CHANGED;
			case 14:
				return CANCELLATION_CHANGED;
			case 17:
				return CANCELLATIONTWO_CHANGED;
			}
			throw new ApplicationException("不支持的票据状态：" + i);
		}
	}

	public static enum ModelExecuteType {
		SUBMIT(1, "表单提交"), QUERY(2, "查询列表"), REPORT(3, "报表查询条件"), QUESTIONARY(4, "调查表"), TODOTASK(5,
				"待办任务"), TEMPLATE(6, "模板"), GRID(7, "表格"), STARTTASK(8, "发起流程");

		private int id;
		private String displayName;

		private ModelExecuteType(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static ModelExecuteType fromId(int id) {
			switch (id) {
			case 1:
				return SUBMIT;
			case 2:
				return QUERY;
			case 3:
				return REPORT;
			case 4:
				return QUESTIONARY;
			case 5:
				return TODOTASK;
			case 6:
				return TEMPLATE;
			case 7:
				return GRID;
			case 8:
				return STARTTASK;
			}
			throw new ApplicationException("不支持的类型：" + id);
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum ModelOperation {
		SUBMIT(1, "提交"), BACK(2, "回退");

		private int id;
		private String displayName;

		private ModelOperation(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static ModelOperation fromId(int id) {
			switch (id) {
			case 1:
				return SUBMIT;
			case 2:
				return BACK;
			}
			throw new ApplicationException("不支持的类型：" + id);
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum ProblemStatus {
		REGISTRATION(

				1), DISPATCH(

						2), DEAL(

								3), CUSTOMER_VISIT(

										4), FINISH(

												5), ABORT(

														6), CUSTOMER_CHARGE(

																10);

		private int value;

		private ProblemStatus(int value) {
			this.value = value;
		}

		public int intValue() {
			return value;
		}
	}

	public static enum ContentStatus {
		UNPUBLISHED(

				1), PUBLISHED(

						2), UNUSE(

								3);

		private int value;

		private ContentStatus(int value) {
			this.value = value;
		}

		public int intValue() {
			return value;
		}
	}

	public static enum ContractStatus {
		DRAFT(0, "草稿"), ENABLE(1, "生效"), CHANGE(2, "已变更"), DISABLE(-1, "已终止");

		private int id;
		private String displayName;

		private ContractStatus(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static ContractStatus fromId(int id) {
			if (id == 0)
				return DRAFT;
			if (id == 1)
				return ENABLE;
			if (id == 2) {
				return CHANGE;
			}
			return DISABLE;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum ReceiptOpType {
		BILLING(1, "开票"), CHANGE(2, "换票"), LINK(3, "关联");

		private int id;
		private String displayName;

		private ReceiptOpType(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static ReceiptOpType fromId(int id) {
			if (id == 1)
				return BILLING;
			if (id == 2) {
				return CHANGE;
			}
			return LINK;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum ArrearStatus {
		NOPAID(0, "欠费"), PAID(1, "已交清"), CANCEL(-1, "已返销"), LOCK(2, "锁定"), COLLECTING(3, "托收中"), NOAPPROVE(4,
				"待审核"), APPROVING(5, "审核中");

		private int id;
		private String displayName;

		private ArrearStatus(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static ArrearStatus fromId(int id) {
			if (id == 0)
				return NOPAID;
			if (id == 1)
				return PAID;
			if (id == 2)
				return LOCK;
			if (id == 3) {
				return COLLECTING;
			}
			return CANCEL;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum PayablesStatus {
		NOPAID(0, "未付款"), PAID(1, "已付款"), CANCEL(-1, "已返销"), APPROVING(2, "付款中");

		private int id;
		private String displayName;

		private PayablesStatus(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static PayablesStatus fromId(int id) {
			if (id == 0)
				return NOPAID;
			if (id == 1)
				return PAID;
			if (id == 2) {
				return APPROVING;
			}
			return CANCEL;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum CollectionrStatus {
		NO_SUBMIT(0, "未提交"), SUBMIT(1, "已提交"), CANCEL(-1, "已返销");

		private int id;
		private String displayName;

		private CollectionrStatus(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static CollectionrStatus fromId(int id) {
			if (id == 0)
				return NO_SUBMIT;
			if (id == 1) {
				return SUBMIT;
			}
			return CANCEL;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum RenovationStatus {
		RENOVATING(1, "装修中"), NORENOVATE(1, "未在装修");

		private int id;
		private String displayName;

		private RenovationStatus(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static RenovationStatus fromId(int id) {
			if (id == 0) {
				return NORENOVATE;
			}
			return RENOVATING;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum BusinessMode {
		BATCH_CHARGE(1, "批量计费", "/customerArrearAction!forwardList.do",
				"/customerArrearAction!batchCancelChargeEvent.ajax"), BATCH_REMIT(2, "批量划账",
						"/paymentAction!forwardListEventPaymentDetail.do",
						"/paymentAction!batchCancleRemitEvent.ajax"), BATCH_PENALTY(3, "批量计算违约金", null,
								null), ARREAR_CANCEL(4, "欠费返销", "/customerArrearAction!forwardList.do",
										null), PAYMENT_CANCEL(5, "收费作废",
												"/paymentAction!forwardListEventPaymentDetail.do", null), METER_ADD(6,
														"三表添加", "/meterRecordAction!forwardEventMeterReadings.do",
														null), METER_MODIFY(7, "三表修改",
																"/eventManagerAction!forwardListEventLogDetail.do",
																null), METER_DELETE(8, "三表删除",
																		"/eventManagerAction!forwardListEventLogDetail.do",
																		null), REFUND(9, "退款",
																				"/paymentAction!forwardListEventPaymentDetail.do",
																				null), COLLECTION(10, "银行托收",
																						"/collectionOperationAction!forwardListEventCollectionDetail.do",
																						null), RECONCILIATION(11,
																								"欠费调账",
																								"/customerArrearAction!forwardList.do",
																								"/customerArrearAction!cancleWriteOffEvent.ajax"), PENALTYREDUCE(
																										12, "违约金减免",
																										"/customerArrearAction!forwardList.do",
																										"/customerArrearAction!cancleWriteOffEvent.ajax"), RECHARGE_BALANCE(
																												13,
																												"预存款账户充值",
																												"/paymentAction!forwardListEventPaymentDetail.do",
																												null), TRANSFER_BALANCE(
																														14,
																														"预存款账户转账",
																														"/paymentAction!forwardListEventPaymentDetail.do",
																														null), RECEIPT_IMPORT(
																																15,
																																"票据入库",
																																"receiptEventAction!forwardImportEventLog.do",
																																null), RECEIPT_DISTRIBUTE(
																																		16,
																																		"票据分配",
																																		"receiptEventAction!forwardDistributeEventLog.do",
																																		null), RECEIPT_SEND_BACK(
																																				17,
																																				"票据退回",
																																				"receiptEventAction!forwardBackEventLog.do",
																																				null), RECEIPT_RECONCILE_ONE(
																																						18,
																																						"票据一级核销",
																																						"receiptEventAction!forwardReconcileEventLog.do",
																																						null), RECEIPT_RECONCILE_TWO(
																																								19,
																																								"票据二级核销",
																																								"receiptEventAction!forwardReconcileEventLog.do",
																																								null), RECEIPT_DISCARD(
																																										20,
																																										"票据作废",
																																										null,
																																										null), RECEIPT_RECOVER(
																																												21,
																																												"票据恢复",
																																												null,
																																												null), RECEIPT_USE(
																																														22,
																																														"票据使用",
																																														null,
																																														null), RECEIPT_BATCH_USE(
																																																23,
																																																"票据批量使用",
																																																"receiptEventAction!forwardBatchUseEventLog.do",
																																																null), RECEIPT_REMOVE(
																																																		24,
																																																		"票据删除",
																																																		"receiptEventAction!forwardRemoveEventLog.do",
																																																		null), REPALCE_METER(
																																																				25,
																																																				"更换三表",
																																																				"/meterRecordAction!forwardEventMeterReadings.do",
																																																				null), ARREAR_SPLIT(
																																																						26,
																																																						"欠费拆分",
																																																						"/customerArrearAction!forwardList.do",
																																																						null), BATCH_REMIT_CANCEL(
																																																								27,
																																																								"批量划账返销",
																																																								"/paymentAction!forwardListEventPaymentDetail.do",
																																																								null), BATCH_EARLY_WARN(
																																																										28,
																																																										"批量预警",
																																																										null,
																																																										null), WRITE_OFF_CANCEL(
																																																												29,
																																																												"欠费核销事件返销",
																																																												"/customerArrearAction!forwardList.do",
																																																												null), COMPAR_CANCEL_ARREAR(
																																																														101,
																																																														"数据比对-返销应收",
																																																														"/customerArrearAction!forwardList.do",
																																																														null), COMPAR_UPDATE_ARREAR(
																																																																102,
																																																																"数据比对-更改应收",
																																																																"/customerArrearAction!forwardList.do",
																																																																null), COMPAR_CANCEL_PAYMENT(
																																																																		103,
																																																																		"数据比对-返销实收",
																																																																		"/paymentAction!forwardListEventPaymentDetail.do",
																																																																		null), COMPAR_UPDATE_PAYMENT(
																																																																				104,
																																																																				"数据比对-更改实收",
																																																																				"/paymentAction!forwardListEventPaymentDetail.do",
																																																																				null), COMPAR_IMPORT_ARREAR(
																																																																						105,
																																																																						"数据比对-应收导入",
																																																																						"/customerArrearAction!forwardList.do",
																																																																						null), COMPAR_IMPORT_PAYMENT(
																																																																								106,
																																																																								"数据比对-实收导入",
																																																																								"/paymentAction!forwardListEventPaymentDetail.do",
																																																																								null), COMPAR_UPDATE_BALANCE(
																																																																										107,
																																																																										"数据比对-账户余额调整",
																																																																										"",
																																																																										null), COMPAR_IMPORT_BALANCE(
																																																																												108,
																																																																												"数据比对-账户余额批量导入",
																																																																												"",
																																																																												null);

		private int id;

		private String displayName;
		private String detailUrl;
		private String cancelUrl;

		private BusinessMode(int id, String displayName, String detailUrl, String cancelUrl) {
			this.id = id;
			this.displayName = displayName;
			this.detailUrl = detailUrl;
			this.cancelUrl = cancelUrl;
		}

		public static BusinessMode fromId(int id) {
			switch (id) {
			case 1:
				return BATCH_CHARGE;
			case 2:
				return BATCH_REMIT;
			case 3:
				return BATCH_PENALTY;
			case 4:
				return ARREAR_CANCEL;
			case 5:
				return PAYMENT_CANCEL;
			case 6:
				return METER_ADD;
			case 7:
				return METER_MODIFY;
			case 8:
				return METER_DELETE;
			case 9:
				return REFUND;
			case 10:
				return COLLECTION;
			case 11:
				return RECONCILIATION;
			case 12:
				return PENALTYREDUCE;
			case 13:
				return RECHARGE_BALANCE;
			case 14:
				return TRANSFER_BALANCE;
			case 15:
				return RECEIPT_IMPORT;
			case 16:
				return RECEIPT_DISTRIBUTE;
			case 17:
				return RECEIPT_SEND_BACK;
			case 18:
				return RECEIPT_RECONCILE_ONE;
			case 19:
				return RECEIPT_RECONCILE_TWO;
			case 20:
				return RECEIPT_DISCARD;
			case 21:
				return RECEIPT_RECOVER;
			case 22:
				return RECEIPT_USE;
			case 23:
				return RECEIPT_BATCH_USE;
			case 24:
				return RECEIPT_REMOVE;
			case 25:
				return REPALCE_METER;
			case 26:
				return ARREAR_SPLIT;
			case 27:
				return BATCH_REMIT_CANCEL;
			case 28:
				return BATCH_EARLY_WARN;
			case 29:
				return WRITE_OFF_CANCEL;

			case 101:
				return COMPAR_CANCEL_ARREAR;
			case 102:
				return COMPAR_UPDATE_ARREAR;
			case 103:
				return COMPAR_CANCEL_PAYMENT;
			case 104:
				return COMPAR_UPDATE_PAYMENT;
			case 105:
				return COMPAR_IMPORT_ARREAR;
			case 106:
				return COMPAR_IMPORT_PAYMENT;
			case 107:
				return COMPAR_UPDATE_BALANCE;
			case 108:
				return COMPAR_IMPORT_BALANCE;
			}
			return null;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}

		public String getDetailUrl() {
			return detailUrl;
		}

		public String getCancelUrl() {
			return cancelUrl;
		}
	}

	public static enum AdviceStatus {
		REPLYING(1, "待回复"), REPLIED(2, "已回复"), CHECKING(3, "复核中"), DOING(4, "整改中");

		private int id;
		private String displayName;

		private AdviceStatus(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum ExportFormat {
		xls(1, "2003格式"), TXT(2, "text格式"), xlsx(3, "2007格式");

		private int id;
		private String displayName;

		private ExportFormat(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum PaymentMode {
		CASH(1, "现金"), COLLECTION(2, "银行托收"), POS(3, "POS单"), TICKET(4, "和骏抵扣卷"), TRANS(5, "转账收入"), REDUCE(6,
				"减免"), EXCHANGE(7, "换票未收现"), DEDUCTION(8, "预付款抵扣"), OTHER(9, "其他");

		private int id;
		private String displayName;

		private PaymentMode(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static PaymentMode fromId(int id) {
			switch (id) {
			case 1:
				return CASH;
			case 2:
				return COLLECTION;
			case 3:
				return POS;
			case 4:
				return TICKET;
			case 5:
				return TRANS;
			case 6:
				return REDUCE;
			case 7:
				return EXCHANGE;
			case 8:
				return DEDUCTION;
			case 9:
				return OTHER;
			}
			return CASH;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum PaymentType {
		NORMAL(1, "普通缴费"), REMIT(2, "划账"), REFUND(3, "退款"), RECONCILIATION(4, "欠费调账"), RECHARGE(5, "充值"), TRANS(6,
				"转账"), COLLECTION(7, "托收"), APP(8, "APP支付"), PENALTYREDUCE(9, "违约金减免");

		private int id;
		private String displayName;

		private PaymentType(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static PaymentType fromId(int id) {
			switch (id) {
			case 1:
				return NORMAL;
			case 2:
				return REMIT;
			case 3:
				return REFUND;
			case 4:
				return RECONCILIATION;
			case 5:
				return RECHARGE;
			case 6:
				return TRANS;
			case 7:
				return COLLECTION;
			case 8:
				return APP;
			case 9:
				return PENALTYREDUCE;
			}
			return NORMAL;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum PaymentStatus {
		NORMAL(1, "正常"), DISCARD(-1, "作废");

		private int id;
		private String displayName;

		private PaymentStatus(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static PaymentStatus fromId(int id) {
			switch (id) {
			case 1:
				return NORMAL;
			case -1:
				return DISCARD;
			}
			return NORMAL;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum MeterType {
		WATER(1, "水表"), ELECTRICITY(2, "电表"), GAS(3, "气表");

		private int id;
		private String displayName;

		private MeterType(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static MeterType fromId(int id) {
			switch (id) {
			case 1:
				return WATER;
			case 2:
				return ELECTRICITY;
			case 3:
				return GAS;
			}
			return WATER;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum WriteOffType {
		RECONCILIATION(1, "调账"), PENALTYREDUCE(2, "违约金减免");

		private int id;
		private String displayName;

		private WriteOffType(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static WriteOffType fromId(int id) {
			switch (id) {
			case 1:
				return RECONCILIATION;
			case 2:
				return PENALTYREDUCE;
			}
			return RECONCILIATION;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum EarlyWarning {
		EPIBOLY_CONTRACT(1, "外包合同预警明细", "EpibolyContractWarning"), SALES_CONTRACT(2, "经营合同预警明细",
				"SalesContractWarning"), CHARGE_CONTRACT(3, "合同收费预警明细", "ChargeContractWarning");

		private int id;
		private String code;
		private String displayName;

		private EarlyWarning(int id, String displayName, String code) {
			this.id = id;
			this.displayName = displayName;
			this.code = code;
		}

		public static EarlyWarning fromId(int id) {
			if (id == 1)
				return EPIBOLY_CONTRACT;
			if (id == 2)
				return SALES_CONTRACT;
			if (id == 3) {
				return CHARGE_CONTRACT;
			}
			return null;
		}

		public int getId() {
			return id;
		}

		public String getCode() {
			return code;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum WarnMode {
		FLOW(1, "流程");

		private int id;
		private String displayName;

		private WarnMode(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static WarnMode fromId(int id) {
			if (id == 1) {
				return FLOW;
			}
			return null;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum ProblemProcessUnit {
		Register(1), Dispatch(2), Deal(3), CustomerVisit(4), CustomerCharge(10), Finish(5), Abort(6);

		private int value;

		private ProblemProcessUnit(int value) {
			this.value = value;
		}

		public int intValue() {
			return value;
		}

		public static ProblemProcessUnit fromInt(int i) {
			switch (i) {
			case 1:
				return Register;
			case 2:
				return Dispatch;
			case 3:
				return Deal;
			case 4:
				return CustomerVisit;
			case 10:
				return CustomerCharge;
			case 5:
				return Finish;
			case 6:
				return Abort;
			}
			throw new ApplicationException("不支持的流程环节ID");
		}
	}

	public static enum OperatorKind {
		EQ("EQ", "="), OIN("OIN", "in"), GT("GT", ">"), LT("LT", "<"), GE("GE", ">="), LE("LE",
				"<="), INTERVAL("INTERVAL", "区间"), NOT_EQ("NOT_EQ", "!=");

		private final String id;
		private final String displayName;

		private OperatorKind(String id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public String getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}

		public static OperatorKind fromId(String id) {
			if (id.equalsIgnoreCase("EQ"))
				return EQ;
			if (id.equalsIgnoreCase("OIN"))
				return OIN;
			if (id.equalsIgnoreCase("GT"))
				return GT;
			if (id.equalsIgnoreCase("LT"))
				return LT;
			if (id.equalsIgnoreCase("GE"))
				return GE;
			if (id.equalsIgnoreCase("LE"))
				return LE;
			if (id.equalsIgnoreCase("INTERVAL"))
				return INTERVAL;
			if (id.equalsIgnoreCase("NOT_EQ")) {
				return NOT_EQ;
			}
			throw new RuntimeException(String.format("无效的操作符“%s”！", new Object[] { Integer.valueOf(id) }));
		}

		public static Map<String, String> getData() {
			Map<String, String> data = new HashMap(8);
			OperatorKind[] arrayOfOperatorKind;
			int j = (arrayOfOperatorKind = values()).length;
			for (int i = 0; i < j; i++) {
				OperatorKind item = arrayOfOperatorKind[i];
				data.put(item.id, item.displayName);
			}
			return data;
		}
	}

	public static enum IntervalKind {
		OPEN, LEF_OPEN, RIGHT_OPEN, CLOSE;

		private String operand1;
		private String operand2;

		public String getOperand1() {
			return operand1;
		}

		public String getOperand2() {
			return operand2;
		}

		public static IntervalKind getIntervalKind(String value) {
			value = value.trim();
			int len = value.length();
			char firstChar = value.charAt(0);
			char lastChar = value.charAt(len - 1);
			IntervalKind result;
			if (firstChar == '(') {
				if (lastChar == ')') {
					result = OPEN;
				} else
					result = LEF_OPEN;
			} else {
				if (lastChar == ')') {
					result = RIGHT_OPEN;
				} else
					result = CLOSE;
			}
			value = value.substring(1, len - 1);
			String[] values = value.split(",");
			result.operand1 = values[0];
			result.operand2 = values[1];
			return result;
		}
	}

	public static enum SettlementCycle {
		ONE(1, "一次性付清"), MONTH(2, "月付"), TWOMONTH(6, "两月付"), SEASON(3, "季付"), HALFYEAR(4, "半年付"), YEAR(5, "年付");

		private int id;
		private String displayName;

		private SettlementCycle(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static SettlementCycle fromId(int id) {
			if (id == 1)
				return ONE;
			if (id == 2)
				return MONTH;
			if (id == 3)
				return SEASON;
			if (id == 4)
				return HALFYEAR;
			if (id == 5)
				return YEAR;
			if (id == 6) {
				return TWOMONTH;
			}
			return null;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}

		public static Map<Integer, String> getData() {
			Map<Integer, String> result = new HashMap();
			SettlementCycle[] arrayOfSettlementCycle;
			int j = (arrayOfSettlementCycle = values()).length;
			for (int i = 0; i < j; i++) {
				SettlementCycle item = arrayOfSettlementCycle[i];
				result.put(Integer.valueOf(item.getId()), item.getDisplayName());
			}
			return result;
		}
	}

	public static enum IncreaseCycle {
		NONE(0, "无递增"), MONTH(2, "按月递增"), SEASON(3, "按季递增"), HALFYEAR(4, "按半年递增"), YEAR(5, "按年递增");

		private int id;
		private String displayName;

		private IncreaseCycle(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static IncreaseCycle fromId(int id) {
			if (id == 0)
				return NONE;
			if (id == 2)
				return MONTH;
			if (id == 3)
				return SEASON;
			if (id == 4)
				return HALFYEAR;
			if (id == 5) {
				return YEAR;
			}
			return null;
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static int getSettlementMonth(int settlementCycle) {
		int billIntervalMonth = 0;
		switch (SettlementCycle.fromId(settlementCycle)) {
		case MONTH:
			billIntervalMonth = 1;
			break;
		case ONE:
			billIntervalMonth = 2;
			break;
		case SEASON:
			billIntervalMonth = 3;
			break;
		case TWOMONTH:
			billIntervalMonth = 6;
			break;
		case YEAR:
			billIntervalMonth = 12;
			break;
		}

		return billIntervalMonth;
	}

	public static enum WarnKind {
		PROJECT(1, "项目预警"), CONTRACT(2, "合同预警");

		private int id;
		private String displayName;

		private WarnKind(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static WarnKind fromId(int id) {
			switch (id) {
			case 1:
				return PROJECT;
			case 2:
				return CONTRACT;
			}
			throw new ApplicationException("预警类型无效");
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public static enum ContractKind {
		leaseContract(1, "租赁合同"), leasebackContract(2, "委托运营合同");

		private int id;
		private String displayName;

		private ContractKind(int id, String displayName) {
			this.id = id;
			this.displayName = displayName;
		}

		public static Map<Integer, String> getData() {
			Map<Integer, String> result = new HashMap();
			ContractKind[] arrayOfContractKind;
			int j = (arrayOfContractKind = values()).length;
			for (int i = 0; i < j; i++) {
				ContractKind item = arrayOfContractKind[i];
				result.put(Integer.valueOf(item.getId()), item.getDisplayName());
			}
			return result;
		}

		public static ContractKind fromId(int id) {
			switch (id) {
			case 1:
				return leaseContract;
			case 2:
				return leasebackContract;
			}
			throw new ApplicationException("合同类型无效");
		}

		public int getId() {
			return id;
		}

		public String getDisplayName() {
			return displayName;
		}
	}
}
