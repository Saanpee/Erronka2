package edu.controlador;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import modelo.Tipos;
import modelo.Users;
@RestController
@RequestMapping("/Tipos")
public class TiposControler {
	@GetMapping
	public String listaTipos() {
		
	try {
	    Session session = HibernateUtil.getSessionFactory().openSession();
	    String hql = "FROM Users";
	    Query q = session.createQuery(hql);
	    List<Tipos> tipos = q.list();
        
	    Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
	    String tiposJson = gson.toJson(tipos);
	    return tiposJson;
	} catch (Exception e) {
	    e.printStackTrace();  // Loguear la excepción para depurar
	    return "Error: " + e.getMessage();
	}  
	}
}
 
