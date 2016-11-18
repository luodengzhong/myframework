package com.brc.client;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class SessionListener extends HttpServlet implements HttpSessionListener, HttpSessionAttributeListener {
	public void sessionCreated(HttpSessionEvent se) {
	}

	// ERROR //
	public void sessionDestroyed(HttpSessionEvent se) {
	}

	public void attributeAdded(HttpSessionBindingEvent se) {
	}

	public void attributeRemoved(HttpSessionBindingEvent se) {
	}

	public void attributeReplaced(HttpSessionBindingEvent se) {
	}
}
