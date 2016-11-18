package com.brc.model.domain.parse.impl;

import com.brc.exception.NotFoundException;
import com.brc.exception.SQLParseException;
import com.brc.model.domain.parse.SQLBuilder;
import com.brc.model.domain.parse.SQLExecutor;
import com.brc.system.data.util.ParseSQLParam;
import com.brc.util.StringUtil;
import com.brc.xmlbean.ConditionDocument;
import com.brc.xmlbean.ConditionDocument.Condition;
import com.brc.xmlbean.ConditionDocument.Condition.Append;
import com.brc.xmlbean.EntityDocument;
import com.brc.xmlbean.EntityDocument.Entity;
import com.brc.xmlbean.IdDocument;
import com.brc.xmlbean.IdDocument.Id;
import com.brc.xmlbean.PropertyDocument;
import com.brc.xmlbean.PropertyDocument.Property;
import com.brc.xmlbean.PropertyDocument.Property.Insert;
import com.brc.xmlbean.PropertyDocument.Property.Update;
import com.brc.xmlbean.SqlDocument;
import com.brc.xmlbean.SqlDocument.Sql;
import com.brc.xmlbean.VersionDocument;
import com.brc.xmlbean.VersionDocument.Version;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.xmlbeans.XmlCursor;
import org.apache.xmlbeans.XmlObject;

public class SQLBuilderImpl implements SQLBuilder {
	private static final Pattern pattern = Pattern.compile("\t|\r|\n");

	public SQLExecutor buildDeleteSql(EntityDocument.Entity entity) {
		SQLExecutor executor = new SQLExecutor(entity.getIdArray().length);
		StringBuffer sb = new StringBuffer();
		sb.append("DELETE ").append(entity.getTable());
		sb.append(" WHERE 1=1 ");
		for (IdDocument.Id id : entity.getIdArray()) {
			sb.append(" AND ").append(id.getColumn());
			sb.append(" = ").append("?");
			executor.addParam(id.getName());
			executor.addParamType(id.getType());
		}
		executor.setExecuteSql(sb.toString());
		return executor;
	}

	public SQLExecutor buildDeleteSql(EntityDocument.Entity entity, Collection<String> properties) {
		SQLExecutor executor = new SQLExecutor(properties.size());
		StringBuffer sb = new StringBuffer();
		sb.append("DELETE ").append(entity.getTable()).append(" WHERE 1=1 ");
		for (IdDocument.Id id : entity.getIdArray()) {
			if (contains(properties, id.getName())) {
				sb.append(" AND ").append(id.getColumn());
				sb.append(" = ").append("?");
				executor.addParam(id.getName());
				executor.addParamType(id.getType());
			}
		}
		for (PropertyDocument.Property property : entity.getPropertyArray()) {
			if (contains(properties, property.getName())) {
				sb.append(" AND ").append(property.getColumn());
				sb.append(" = ").append("?");
				executor.addParam(property.getName());
				executor.addParamType(property.getType());
			}
		}
		executor.setExecuteSql(sb.toString());
		return executor;
	}

	public SQLExecutor buildInsertSql(EntityDocument.Entity entity) {
		SQLExecutor executor = new SQLExecutor(entity.getIdArray().length + entity.getPropertyArray().length);
		StringBuffer insertSQL = new StringBuffer("INSERT INTO ").append(entity.getTable()).append("(");
		StringBuffer valueSQL = new StringBuffer(" VALUES(");

		for (IdDocument.Id id : entity.getIdArray()) {
			insertSQL.append(id.getColumn()).append(",");
			valueSQL.append("?").append(",");
			executor.addParam(id.getName());
			executor.addParamType(id.getType());
		}

		for (PropertyDocument.Property property : entity.getPropertyArray()) {
			if ((property.getInsert() == null) || (property.getInsert() != PropertyDocument.Property.Insert.FALSE)) {
				insertSQL.append(property.getColumn()).append(",");
				valueSQL.append("?").append(",");
				executor.addParam(property.getName());
				executor.addParamType(property.getType());
			}
		}
		VersionDocument.Version version = entity.getVersion();
		if (version != null) {
			insertSQL.append(version.getColumn()).append(",");
			valueSQL.append("?").append(",");
			executor.addParam(version.getName());
			executor.addParamType(version.getType());
		}
		insertSQL.replace(insertSQL.length() - 1, insertSQL.length(), ")");
		valueSQL.replace(valueSQL.length() - 1, valueSQL.length(), ")");
		insertSQL.append(valueSQL);
		executor.setExecuteSql(insertSQL.toString());
		return executor;
	}

	public SQLExecutor buildUpdateSql(EntityDocument.Entity entity, Collection<String> properties) {
		return buildUpdateSql(entity, properties, null);
	}

	public SQLExecutor buildUpdateSql(EntityDocument.Entity entity, Collection<String> properties,
			String[] nullProperties) {
		int initialCapacity = entity.getIdArray().length + properties.size();
		if (nullProperties != null)
			initialCapacity += nullProperties.length;
		SQLExecutor executor = new SQLExecutor(initialCapacity);

		StringBuffer updateSql = new StringBuffer("UPDATE ").append(entity.getTable()).append(" SET ");
		for (PropertyDocument.Property property : entity.getPropertyArray()) {
			VersionDocument.Version version;
			if ((property.getUpdate() == null) || (property.getUpdate() != PropertyDocument.Property.Update.FALSE)) {
				if (contains(properties, property.getName())) {
					updateSql.append(property.getColumn()).append("=?").append(",");
					executor.addParam(property.getName());
					executor.addParamType(property.getType());
				} else if (contains(nullProperties, property.getName())) {
					updateSql.append(property.getColumn()).append("=?").append(",");
					executor.addParam(property.getName());
					executor.addParamType(property.getType());
				}
			}
		}

		Version version = entity.getVersion();
		if (version != null) {
			updateSql.append(version.getColumn()).append("=?").append(",");
			executor.addParam(version.getName());
			executor.addParamType(version.getType());
		}
		updateSql.deleteCharAt(updateSql.lastIndexOf(","));
		updateSql.append(" WHERE 1=1 ");
		for (IdDocument.Id id : entity.getIdArray()) {
			updateSql.append(" AND ").append(id.getColumn());
			updateSql.append(" = ").append("?");
			executor.addParam(id.getName());
			executor.addParamType(id.getType());
		}
		executor.setExecuteSql(updateSql.toString());
		return executor;
	}

	public SQLExecutor buildUpdateSql(EntityDocument.Entity entity, Collection<String> properties,
			Collection<String> conditionProperties, String[] nullProperties) {
		int initialCapacity = properties.size() + conditionProperties.size();
		if (nullProperties != null)
			initialCapacity += nullProperties.length;
		SQLExecutor executor = new SQLExecutor(initialCapacity);

		StringBuffer updateSql = new StringBuffer("UPDATE ").append(entity.getTable()).append(" SET ");
		for (PropertyDocument.Property property : entity.getPropertyArray()) {
			VersionDocument.Version version;
			StringBuffer whereSql;
			if ((property.getUpdate() == null) || (property.getUpdate() != PropertyDocument.Property.Update.FALSE)) {
				if (contains(properties, property.getName())) {
					updateSql.append(property.getColumn()).append("=?").append(",");
					executor.addParam(property.getName());
					executor.addParamType(property.getType());
				} else if (contains(nullProperties, property.getName())) {
					updateSql.append(property.getColumn()).append("=?").append(",");
					executor.addParam(property.getName());
					executor.addParamType(property.getType());
				}
			}
		}

		Version version = entity.getVersion();
		if (version != null) {
			updateSql.append(version.getColumn()).append("=?").append(",");
			executor.addParam(version.getName());
			executor.addParamType(version.getType());
		}
		try {
			updateSql.deleteCharAt(updateSql.lastIndexOf(","));
		} catch (Exception e) {
			throw new SQLParseException("解析SQL错误:", e);
		}
		StringBuffer whereSql = new StringBuffer(" WHERE 1=1 ");
		for (PropertyDocument.Property property : entity.getPropertyArray()) {
			if (contains(conditionProperties, property.getName())) {
				whereSql.append(" AND ").append(property.getColumn());
				whereSql.append(" = ").append("?");
				executor.addParam(property.getName());
				executor.addParamType(property.getType());
			}
		}
		for (IdDocument.Id id : entity.getIdArray()) {
			if (contains(conditionProperties, id.getName())) {
				whereSql.append(" AND ").append(id.getColumn());
				whereSql.append(" = ").append("?");
				executor.addParam(id.getName());
				executor.addParamType(id.getType());
			}
		}
		executor.setExecuteSql(updateSql.append(whereSql).toString());
		return executor;
	}

	private boolean contains(Collection<String> collection, String name) {
		if ((collection == null) || (collection.size() == 0))
			return false;
		return contains(collection.toArray(), name);
	}

	private boolean contains(Object[] array, String name) {
		if ((array == null) || (array.length == 0))
			return false;
		Arrays.sort(array);
		int i = Arrays.binarySearch(array, name);
		return i > -1;
	}

	public SQLExecutor buildLoadSql(EntityDocument.Entity entity) {
		SQLExecutor executor = null;
		String sql = entity.getSqlDetail();

		if ((sql != null) && (!sql.trim().equals(""))) {
			ParseSQLParam parser = new ParseSQLParam();
			Matcher matcher = pattern.matcher(sql);
			parser.parse(matcher.replaceAll(""));
			List<String> names = parser.getParameter();
			executor = new SQLExecutor(names.size());
			executor.setExecuteSql(parser.getParseSql());
			for (String name : names) {
				executor.addParam(name);
				executor.addParamType(getColumnType(entity, name));
			}
		} else {
			executor = new SQLExecutor(entity.getIdArray().length);
			String alias = entity.getName();
			StringBuffer querySql = new StringBuffer("SELECT ");
			StringBuffer whereSql = new StringBuffer(" WHERE 1=1 ");
			for (IdDocument.Id id : entity.getIdArray()) {
				querySql.append(alias).append(".").append(id.getColumn()).append(",");
				whereSql.append(" AND ").append(alias).append(".").append(id.getColumn());
				whereSql.append(" = ").append("?");
				executor.addParam(id.getName());
				executor.addParamType(id.getType());
			}
			for (PropertyDocument.Property property : entity.getPropertyArray()) {
				String formula = getNodeTextValue(property);
				if (StringUtil.isBlank(formula))
					querySql.append(alias).append(".").append(property.getColumn());
				else {
					querySql.append("(").append(formula).append(")").append(" AS ").append(property.getColumn());
				}
				querySql.append(",");
			}
			querySql.deleteCharAt(querySql.lastIndexOf(","));
			querySql.append(" FROM ").append(entity.getTable()).append(" ").append(alias);
			querySql.append(whereSql);
			executor.setExecuteSql(querySql.toString());
		}
		return executor;
	}

	public SQLExecutor buildQuerySql(EntityDocument.Entity entity, Map<String, Object> params) {
		StringBuffer querySql = new StringBuffer();
		String sql = entity.getSqlQuery();
		String alias = entity.getName();
		if ((sql != null) && (!sql.trim().equals(""))) {
			Matcher matcher = pattern.matcher(sql);
			querySql.append(matcher.replaceAll(""));
			if (sql.toUpperCase().indexOf("WHERE") < 0)
				querySql.append(" WHERE 1=1 ");
		} else {
			querySql.append("SELECT ");
			for (IdDocument.Id id : entity.getIdArray()) {
				querySql.append(alias).append(".").append(id.getColumn()).append(",");
			}
			for (PropertyDocument.Property property : entity.getPropertyArray()) {
				String formula = getNodeTextValue(property);
				if (StringUtil.isBlank(formula))
					querySql.append(alias).append(".").append(property.getColumn());
				else {
					querySql.append("(").append(formula).append(")").append(" AS ").append(property.getColumn());
				}
				querySql.append(",");
			}
			querySql.deleteCharAt(querySql.lastIndexOf(","));
			querySql.append(" FROM ").append(entity.getTable()).append(" ").append(alias);
			querySql.append(" WHERE 1=1 ");
		}
		return buildSqlCondition(entity, querySql, params);
	}

	private SQLExecutor buildSqlCondition(EntityDocument.Entity entity, StringBuffer querySql,
			Map<String, Object> params) {
		String alias = entity.getName();
		StringBuffer conditionLike = new StringBuffer();
		StringBuffer conditionIn = new StringBuffer();
		if ((params != null) && (params.size() > 0)) {
			Object obj = null;
			String tmpAlias = null;
			for (ConditionDocument.Condition condition : entity.getConditionArray()) {
				obj = params.get(condition.getName());
				tmpAlias = condition.getAlias();
				if ((obj != null) && (!obj.toString().equals(""))) {
					String formula = getNodeTextValue(condition);
					if (!StringUtil.isBlank(formula)) {
						querySql.append(formula);
						if (condition.getSymbol().toUpperCase().equals("LIKE")) {
							conditionLike.append(condition.getName()).append(";");
						}
						if (condition.getSymbol().toUpperCase().equals("IN"))
							conditionIn.append(condition.getName()).append(";");
					} else {
						String column = condition.getColumn();
						if ((column != null) && (!column.equals(""))) {
							if (condition.getSymbol().toUpperCase().equals("LIKE")) {
								conditionLike.append(condition.getName()).append(";");
							}
							if (condition.getSymbol().toUpperCase().equals("IN")) {
								conditionIn.append(condition.getName()).append(";");
							}

							if ((condition.getAppend() == null)
									|| (condition.getAppend() != ConditionDocument.Condition.Append.FALSE)) {
								if (StringUtil.isBlank(tmpAlias))
									tmpAlias = alias;
								querySql.append(" AND ").append(tmpAlias).append(".").append(condition.getColumn())
										.append(" ");
								querySql.append(condition.getSymbol());
								querySql.append(" :").append(condition.getName()).append(" ");
							}
						}
					}
				}
			}
		}
		ParseSQLParam parser = new ParseSQLParam();
		parser.parse(querySql.toString());
		List<String> names = parser.getParameter();
		SQLExecutor executor = new SQLExecutor(names.size());
		for (String name : names) {
			executor.addParam(name);
			executor.addParamType(getColumnType(entity, name));
		}
		executor.setExecuteSql(querySql.toString());

		if (conditionLike.length() > 0) {
			executor.setConditionLike(conditionLike.toString().split(";"));
		}
		if (conditionIn.length() > 0) {
			executor.setConditionIn(conditionIn.toString().split(";"));
		}
		return executor;
	}

	public String getSqlByName(EntityDocument.Entity entity, String sqlName) {
		for (SqlDocument.Sql sql : entity.getSqlArray()) {
			if (sql.getName().equals(sqlName)) {
				return getNodeTextValue(sql);
			}
		}
		throw new NotFoundException(String.format("实体%s中没有SQL(%s)的配置!", new Object[] { entity.getName(), sqlName }));
	}

	public SQLExecutor buildSqlByName(EntityDocument.Entity entity, String sqlName, Map<String, Object> params) {
		String sql = getSqlByName(entity, sqlName);
		if (StringUtil.isBlank(sql)) {
			throw new NotFoundException(
					String.format("实体%s中SQL(%s)的配置为空!", new Object[] { entity.getName(), sqlName }));
		}
		StringBuffer buildSql = new StringBuffer();
		buildSql.append(sql);
		if (sql.toUpperCase().indexOf("WHERE") < 0) {
			buildSql.append(" WHERE 1=1 ");
		}
		return buildSqlCondition(entity, buildSql, params);
	}

	private String getColumnType(EntityDocument.Entity entity, String name) {
		for (IdDocument.Id id : entity.getIdArray()) {
			if (id.getName().equals(name)) {
				return id.getType();
			}
		}
		for (PropertyDocument.Property property : entity.getPropertyArray()) {
			if (property.getName().equals(name)) {
				return property.getType();
			}
		}
		for (ConditionDocument.Condition condition : entity.getConditionArray()) {
			if (condition.getName().equals(name)) {
				return condition.getType();
			}
		}
		return null;
	}

	private String getNodeTextValue(XmlObject obj) {
		String value = obj.newCursor().getTextValue();
		Matcher matcher = pattern.matcher(value);
		return matcher.replaceAll("");
	}
}
