package com.brc.util;

import com.brc.system.dictionary.model.DictionaryModel;
import java.io.Serializable;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

public class Singleton {
	private static final String CONTEXT_PATH = "sys_context_path";
	private static final String REAL_PATH = "sys_real_path";
	private static final String PARAMETER = "sys_parameter";
	private static final String DICTIONARY = "sys_dictionary";
	private Cache cache;

	public static Singleton getInstance() {
		return SingletonHolder.instance;
	}

	public static void setCache(Cache cache) {
		getInstance().cache = cache;
	}

	private void put(String cacheKey, Serializable obj) {
		Element element = new Element(cacheKey, obj);
		this.cache.put(element);
	}

	private <T> T get(String cacheKey, Class<T> cls) {
		if (this.cache == null)
			return null;
		Element element = this.cache.get(cacheKey);
		if (element != null) {
			return ClassHelper.convert(element.getValue(), cls);
		}
		return null;
	}

	private void remove(String key) {
		List<String> keys = this.cache.getKeys();
		for (String k : keys)
			if (k.startsWith(key + "."))
				this.cache.remove(k);
	}

	public static String getContextPath() {
		String contextPath = (String) getInstance().get("sys_context_path", String.class);
		return StringUtil.isBlank(contextPath) ? "" : contextPath;
	}

	public static void setContextPath(String contextPath) {
		getInstance().put("sys_context_path", contextPath);
	}

	public static String getRealPath() {
		return (String) getInstance().get("sys_real_path", String.class);
	}

	public static void setRealPath(String realPath) {
		getInstance().put("sys_real_path", realPath);
	}

	public static <T> T getParameter(String code, Class<T> cls) {
		System.out.println("_-------------------------------------"+code);
		String key = "sys_parameter" + "." + code.toUpperCase();
		return getInstance().get(key, cls);
	}

	public static void setParameter(String code, Serializable Object) {
		String key = "sys_parameter" + "." + code.toUpperCase();
		getInstance().put(key, Object);
	}

	public static void removeParameter() {
		getInstance().remove("sys_parameter");
	}

	public static Map<String, DictionaryModel> getDictionary(String code, String[] types) {
		String key = "sys_dictionary" + "." + code.toUpperCase();
		Map dictionary = (Map) getInstance().get(key, Map.class);
		if ((null != dictionary) && (dictionary.size() > 0)) {
			if (types != null)
				Arrays.sort(types);
			Map map = new LinkedHashMap(dictionary.size());
			Set<Entry> set = dictionary.entrySet();
			for (Map.Entry entry : set) {
				DictionaryModel dm = (DictionaryModel) entry.getValue();
				if ((StringUtil.isBlank(dm.getType())) || (types == null) || (types.length == 0)
						|| (Arrays.binarySearch(types, dm.getType()) > -1)) {
					map.put(dm.getValue(), dm);
				}
			}
			return map;
		}
		return null;
	}

	public static void setDictionary(String code, Serializable Object) {
		String key = "sys_dictionary" + "." + code.toUpperCase();
		getInstance().put(key, Object);
	}

	public static void removeDictionary() {
		getInstance().remove("sys_dictionary");
	}

	public static String getDictionaryDetailText(String code, Object value) {
		if (value == null)
			return null;
		String v = (String) ClassHelper.convert(value, String.class);
		if (StringUtil.isBlank(v))
			return null;
		Map map = getDictionary(code, new String[0]);
		if (map != null) {
			DictionaryModel model = (DictionaryModel) map.get(v);
			if (model != null) {
				return model.getName();
			}
			return "";
		}
		return null;
	}

	static class SingletonHolder {
		static Singleton instance = new Singleton();
	}
}
