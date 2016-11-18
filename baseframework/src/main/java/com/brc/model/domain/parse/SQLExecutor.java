package com.brc.model.domain.parse;

import com.brc.exception.ApplicationException;
import com.brc.util.ClassHelper;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SQLExecutor {
	private static String DEFAULT_TYPE = "java.lang.String";
	private String executeSql;
	int initialCapacity = 4;
	private List<String> paramNames;
	private List<String> paramTypes;
	private String[] conditionLike;
	private String[] conditionIn;

	public SQLExecutor(int initialCapacity) {
		this.paramNames = new ArrayList(initialCapacity);
		this.paramTypes = new ArrayList(initialCapacity);
		this.initialCapacity = initialCapacity;
	}

	public String getExecuteSql() {
		return this.executeSql;
	}

	public void setExecuteSql(String executeSql) {
		this.executeSql = executeSql;
	}

	public void setConditionLike(String[] conditionLike) {
		if (conditionLike != null)
			Arrays.sort(conditionLike);
		this.conditionLike = conditionLike;
	}

	public void setConditionIn(String[] conditionIn) {
		if (conditionIn != null)
			Arrays.sort(conditionIn);
		this.conditionIn = conditionIn;
	}

	public List<String> getParamNames() {
		return this.paramNames;
	}

	public List<String> getParamTypes() {
		return this.paramTypes;
	}

	public void addParam(String name) {
		this.paramNames.add(name);
	}

	public void addParamType(String type) {
		this.paramTypes.add(type);
	}

	public Object[] getParams(Map<String, Object> map) throws ApplicationException {
		int length = this.paramNames.size();
		List values = new ArrayList(length);
		Object obj = null;
		String type = null;
		for (int i = 0; i < length; i++) {
			obj = map.get(this.paramNames.get(i));
			if ((obj != null) && (!obj.toString().equals(""))) {
				type = (String) this.paramTypes.get(i);
				if ((type == null) || (type.equals("")))
					type = DEFAULT_TYPE;
				values.add(ClassHelper.convert(obj, type));
			} else {
				values.add(null);
			}
		}
		return values.toArray();
	}

	public Map<String, Object> getParamMap(Map<String, Object> map) throws ApplicationException {
		int length = this.paramNames.size();
		Map values = new HashMap(length);
		Object obj = null;
		String name = null;
		String type = null;
		for (int i = 0; i < length; i++) {
			name = (String) this.paramNames.get(i);
			obj = map.get(name);
			if ((obj != null) && (!obj.toString().equals(""))) {
				type = (String) this.paramTypes.get(i);
				if ((type == null) || (type.equals("")))
					type = DEFAULT_TYPE;
				if (isLike(name)) {
					obj = ClassHelper.convert(obj, String.class);
					obj = "%" + obj + "%";
				}
				if (isIn(name)) {
					StringBuffer inSql = new StringBuffer("(");
					String[] vals = obj.toString().split(",");
					int vi = vals.length;
					for (int j = 0; j < vi; j++) {
						inSql.append(":").append(name).append(j);
						if (j < vi - 1) {
							inSql.append(",");
						}
						values.put(name + j, ClassHelper.convert(vals[j], type));
					}
					inSql.append(")");

					this.executeSql = this.executeSql.replaceAll(":" + name + "\\b", inSql.toString());
				} else {
					obj = ClassHelper.convert(obj, type);
					values.put(name, obj);
				}
			} else {
				values.put(name, null);
			}
		}
		return values;
	}

	private boolean isLike(String name) {
		if ((this.conditionLike != null) && (this.conditionLike.length > 0)) {
			return Arrays.binarySearch(this.conditionLike, name) > -1;
		}
		return false;
	}

	private boolean isIn(String name) {
		if ((this.conditionIn != null) && (this.conditionIn.length > 0)) {
			return Arrays.binarySearch(this.conditionIn, name) > -1;
		}
		return false;
	}
}
