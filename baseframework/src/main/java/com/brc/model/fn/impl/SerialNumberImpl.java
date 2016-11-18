package com.brc.model.fn.impl;

import com.brc.exception.ApplicationException;
import com.brc.model.fn.AbstractDaoFunction;
import com.brc.model.fn.SerialNumber;
import com.brc.system.data.EntityParserDao;
import com.brc.system.share.service.ServiceUtil;
import com.brc.util.ClassHelper;
import com.brc.util.DateUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.sql.DataSource;

public class SerialNumberImpl extends AbstractDaoFunction implements SerialNumber {
	private final String rule_reg = "\\{(.[^\\{\\}]*)\\}(.*)\\{([0-9])\\}";
	private ServiceUtil serviceUtil;

	public void setServiceUtil(ServiceUtil serviceUtil) {
		this.serviceUtil = serviceUtil;
	}

	public String getSerialNumber(String code) {
		Connection conn = null;
		PreparedStatement pst = null;
		PreparedStatement ept = null;
		ResultSet rs = null;
		try {
			conn = this.serviceUtil.getEntityDao().getDataSource().getConnection();
			conn.setAutoCommit(false);
			String sql = "select t.id,t.code,t.code_rule,t.value,t.last_update_date,seq_serial_number.nextval  as serial_number from sys_serial_number t where t.code=? for update";
			pst = conn.prepareStatement(sql);
			pst.setString(1, code);
			rs = pst.executeQuery();
			if (!rs.next()) {
				throw new ApplicationException("未找到:" + code + "的单据编号规则！");
			}
			String genrule = rs.getString("code_rule");
			String tmpVal = rs.getString("value");
			String serialNumber = rs.getString("serial_number");
			Pattern p = Pattern.compile("\\{(.[^\\{\\}]*)\\}(.*)\\{([0-9])\\}", 2);
			Matcher m = p.matcher(genrule);
			StringBuffer sb = new StringBuffer();
			Long temp = (Long) ClassHelper.convert(tmpVal, Long.class, new Long(0L));
			Date lastupdatedate = rs.getDate("last_update_date");
			String df;
			if (m.find()) {
				df = m.group(1);
				int length = Integer.parseInt(m.group(3));
				try {
					if (compareDate(df, lastupdatedate))
						temp = new Long(0L);
				} catch (ParseException e) {
					throw new ApplicationException("单据编号规则:" + df + "解析错误！");
				}
				temp = Long.valueOf(temp.longValue() + 1L);

				m.appendReplacement(sb,
						formatDate(df, DateUtil.getDateTime()) + m.group(2) + formatSerialNumber(serialNumber, length));
			} else {
				throw new ApplicationException("单据编号规则:" + genrule + "无法解析！");
			}
			sql = "update sys_serial_number set value=?,last_update_date=sysdate where code=?";
			ept = conn.prepareStatement(sql);
			ept.setLong(1, temp.longValue());
			ept.setString(2, code);
			ept.executeUpdate();
			conn.commit();
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (rs != null)
					rs.close();
			} catch (Exception e2) {
			}
			try {
				if (pst != null)
					pst.close();
			} catch (Exception e2) {
			}
			try {
				if (ept != null)
					ept.close();
			} catch (Exception e2) {
			}
			try {
				if (conn != null)
					conn.close();
			} catch (Exception e2) {
			}
		}
		return "";
	}

	private String formatDate(String s, Date date) {
		SimpleDateFormat df = new SimpleDateFormat(s);
		return df.format(date);
	}

	private String formatNo(Long no, int length) {
		String temp = no.toString();
		if (temp.length() == length)
			return temp;
		if (temp.length() > length)
			throw new ApplicationException("流水号长度超出限制:" + length);
		if (temp.length() < length) {
			do
				temp = "0" + temp;
			while (temp.length() != length);
			return temp;
		}

		return "";
	}

	private String formatSerialNumber(String serialNumber, int length) {
		String tmp = serialNumber;
		if (serialNumber.length() == length)
			return serialNumber;
		if (serialNumber.length() > length) {
			tmp = serialNumber.substring(serialNumber.length() - length, serialNumber.length());
			return tmp;
		}
		if (serialNumber.length() < length) {
			do
				tmp = "0" + tmp;
			while (tmp.length() != length);
			return tmp;
		}

		return "";
	}

	private boolean compareDate(String s, Date lastupdate) throws ParseException {
		lastupdate = lastupdate != null ? lastupdate : DateUtil.getDateTime();
		SimpleDateFormat df = new SimpleDateFormat(s);
		Date now = DateUtil.getDateTime();
		String ns = df.format(now);
		String ls = df.format(lastupdate);
		Date nd = df.parse(ns);
		Date ld = df.parse(ls);
		return nd.compareTo(ld) > 0;
	}
}
