package edu.controlador;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import modelo.Ciclos;
import modelo.Modulos;

@RestController
@RequestMapping("/Modulos")
public class ModulosControler {
	@GetMapping
	public String listaModulos(){
		
		try {
		    Session session = HibernateUtil.getSessionFactory().openSession();
		    String hql = "FROM Modulos";
		    Query q = session.createQuery(hql);
		    List<Modulos> modulos = q.list();
	        
		    Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
		    String modulosJson = gson.toJson(modulos);
		    return modulosJson;
		} catch (Exception e) {
		    e.printStackTrace();  // Loguear la excepción para depurar
		    return "Error: " + e.getMessage();
		}  
		 
	}
}
