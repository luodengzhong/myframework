package com.brc.util;

import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import oracle.sql.TIMESTAMP;
import org.apache.commons.beanutils.Converter;

public class DateConverter implements Converter {
	private static List<String> patterns = new ArrayList();

	public Object convert(Class type, Object value) {
		SimpleDateFormat df = new SimpleDateFormat();

		if (value == null)
			return null;
		if ((value instanceof String)) {
			Object dateObj = null;
			Iterator it = patterns.iterator();
			while (it.hasNext()) {
				try {
					String pattern = (String) it.next();
					df.applyPattern(pattern);
					dateObj = df.parse((String) value);
				} catch (ParseException ex) {
				}
				if(dateObj!=null){
					return dateObj;
				}
			}
			return dateObj;
		}
		if ((value instanceof Date))
			return value;
		if ((value instanceof TIMESTAMP)) {
			TIMESTAMP t = (TIMESTAMP) value;
			try {
				return t.timestampValue();
			} catch (SQLException e) {
				e.printStackTrace();

				return null;
			}
		}
		return null;
	}

	static {
		patterns.add("yyyy/MM/dd HH:mm:ss");
		patterns.add("yyyy-MM-dd HH:mm:ss");
		patterns.add("yyyy-MM-dd HH:mm");
		patterns.add("yyyy-MM-dd");
	}
}
