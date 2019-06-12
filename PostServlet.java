package com.calculator;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PostServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("GET");
		System.out.println(request.getParameter("test"));

		CopyOnWriteArrayList<String> lis = (CopyOnWriteArrayList<String>) request.getServletContext()
				.getAttribute("store");

		response.setContentType("text/html");
		writeResponse(lis, response);
		response.getWriter().flush();

	}

	private synchronized CopyOnWriteArrayList<String> createStore(HttpServletRequest request) {
		CopyOnWriteArrayList<String> lis = (CopyOnWriteArrayList<String>) request.getServletContext()
				.getAttribute("store");
		if (lis == null) {
			lis = new CopyOnWriteArrayList<String>();
			request.getServletContext().setAttribute("store", lis);
		}
		return lis;
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String calculation = request.getParameter("calculation");
		System.out.println(calculation);
		CopyOnWriteArrayList<String> lis = (CopyOnWriteArrayList<String>) request.getServletContext()
				.getAttribute("store");
		if (lis == null) {
			lis = createStore(request);
		}
		lis.add(calculation);
		if (lis.size() == 11) {
			lis.remove(0);
		}
		response.setContentType("text/html");

		writeResponse(lis, response);
		response.getWriter().flush();

	}

	private void writeResponse(CopyOnWriteArrayList<String> lis, HttpServletResponse response)
			throws ServletException, IOException {

		response.getWriter().write("[");
		if (lis != null) {
			String str = "";

			for (String g : lis) {
				str = str + "\"" + g + "\",";
			}
			str = str.substring(0, str.length() - 1);
			response.getWriter().write(str);
		}
		response.getWriter().write("]");
	}

}
