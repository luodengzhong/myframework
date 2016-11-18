package com.brc.system.intercept;

import com.brc.util.ConfigFileVersions;
import com.brc.util.XmlLoadManager;
import java.io.Serializable;
import java.lang.reflect.Method;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.springframework.beans.factory.InitializingBean;

public class EhCacheInterceptor implements MethodInterceptor, InitializingBean {
	private Cache cache;

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	public void afterPropertiesSet() throws Exception {
	}

	public Object invoke(MethodInvocation invocation) throws Throwable {
		String targetName = invocation.getThis().getClass().getName();
		String methodName = invocation.getMethod().getName();
		Object[] arguments = invocation.getArguments();

		String cacheKey = getCacheKey(targetName, methodName, arguments);
		Element element = null;
		synchronized (this) {
			element = this.cache.get(cacheKey);
			if (element == null) {
				Object result = invocation.proceed();
				element = new Element(cacheKey, (Serializable) result);
				this.cache.put(element);
			} else {
				ConfigFileVersions versions = (ConfigFileVersions) element.getValue();

				Long lastModified = XmlLoadManager.getLastModified(versions.getConfigFilePath());

				if (lastModified.longValue() > versions.getVersions().longValue()) {
					Object result = invocation.proceed();
					element = new Element(cacheKey, (Serializable) result);
					this.cache.put(element);
				}
			}
		}
		return element.getValue();
	}

	private String getCacheKey(String targetName, String methodName, Object[] arguments) {
		StringBuffer sb = new StringBuffer();
		sb.append(targetName).append(".").append(methodName);
		if ((arguments != null) && (arguments.length != 0)) {
			for (int i = 0; i < arguments.length; i++) {
				sb.append(".").append(arguments[i]);
			}
		}
		return sb.toString();
	}
}
