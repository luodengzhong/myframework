package com.brc.license;

public class License {
	private int version;
	private int tableCount;
	private int orgNodeCount;
	private int functionCount;
	private int taskCount;
	private String expireDate;
	private boolean isExpired;
	private String macAddress;
	private String lockserial;
	private String appName;
	private String projectName;
	private String compName;

	public int getVersion() {
		return this.version;
	}

	public int getTableCount() {
		return this.tableCount;
	}

	public int getOrgNodeCount() {
		return this.orgNodeCount;
	}

	public int getFunctionCount() {
		return this.functionCount;
	}

	public int getTaskCount() {
		return this.taskCount;
	}

	public String getExpireDate() {
		return this.expireDate;
	}

	public boolean isExpired() {
		return this.isExpired;
	}

	public String getMacAddress() {
		return this.macAddress;
	}

	public String getLockserial() {
		return this.lockserial;
	}

	public String getAppName() {
		return this.appName;
	}

	public String getProjectName() {
		return this.projectName;
	}

	public String getCompName() {
		return this.compName;
	}
}
