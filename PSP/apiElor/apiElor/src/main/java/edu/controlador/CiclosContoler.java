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

@RestController
@RequestMapping("/Ciclos")
public class CiclosContoler {

@GetMapping
public String listaCiclos(){
	
	try {
	    Session session = HibernateUtil.getSessionFactory().openSession();
	    String hql = "FROM Ciclos";
	    Query q = session.createQuery(hql);
	    List<Ciclos> ciclos = q.list();
        
	    Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
	    String ciclosJson = gson.toJson(ciclos);
	    return ciclosJson;
	} catch (Exception e) {
	    e.printStackTrace();  // Loguear la excepción para depurar
	    return "Error: " + e.getMessage();
	}  
	 
}
	
	
	
	
 
 


 
 



}
