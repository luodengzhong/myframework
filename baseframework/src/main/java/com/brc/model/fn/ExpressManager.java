package com.brc.model.fn;

import com.brc.system.share.service.ServiceUtil;
import com.brc.util.ClassHelper;
import com.brc.util.ClassScaner;
import com.brc.util.ClassTypeFilter;
import com.brc.util.LogHome;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;

public class ExpressManager {
	private static ExpressUtil expressUtil;
	private static boolean isInitialRunner = false;

	public static void initExpress(ExpressUtil expressUtil) throws InstantiationException, IllegalAccessException {
		if (isInitialRunner == true)
			return;
		ServiceUtil serviceUtil;
		synchronized (expressUtil) {
			if (isInitialRunner == true) {
				return;
			}
			ExpressManager.expressUtil = expressUtil;
			ClassScaner classScaner = new ClassScaner();
			classScaner.addIncludeFilter(new ClassTypeFilter(AbstractFunction.class));
			List beanNames = expressUtil.getBeanNames();
			for (Iterator i$ = beanNames.iterator(); i$.hasNext();) {
				Object obj = i$.next();
				Class c = obj.getClass();
				for (Method m : c.getDeclaredMethods())
					if (Modifier.isPublic(m.getModifiers())) {
						if (!m.getName().startsWith("set")) {
							try {
								expressUtil.addFunction(m.getName(), obj, m.getName(), m.getParameterTypes());
							} catch (Exception e) {
								LogHome.getLog(ExpressManager.class).error(c.getName() + ":" + m.getName(), e);
							}
						}
					}
				classScaner.addExcludeFilter(new ClassTypeFilter(c));
			}

			Set<Class> classes = classScaner.doScan("com.brc.model.fn.impl");
			serviceUtil = (ServiceUtil) expressUtil.getApplicationContext().getBean("serviceUtil", ServiceUtil.class);
			for (Class c : classes) {
				AbstractFunction function = (AbstractFunction) c.newInstance();
				if (ClassHelper.isSubClass(c, AbstractDaoFunction.class)) {
					AbstractDaoFunction daoFunction = (AbstractDaoFunction) function;
					daoFunction.setServiceUtil(serviceUtil);
				}
				for (Method m : c.getDeclaredMethods())
					if (Modifier.isPublic(m.getModifiers())) {
						try {
							expressUtil.addFunction(m.getName(), function, m.getName(), m.getParameterTypes());
						} catch (Exception e) {
							LogHome.getLog(ExpressManager.class).error(c.getName() + ":" + m.getName(), e);
						}
					}
			}
		}
		isInitialRunner = true;
	}

	public static Object evaluate(String expression, Map<String, Object> variables) throws Exception {
		addVariables(variables);
		return expressUtil.execute(expression, variables);
	}

	public static Object evaluate(String expression) throws Exception {
		return expressUtil.execute(expression);
	}

	public static void addVariable(String key, Object value) {
		VariableContainer.addVariable(key, value);
	}

	public static void addVariables(Map<String, Object> variables) {
		for (String key : variables.keySet())
			addVariable(key, variables.get(key));
	}
}
