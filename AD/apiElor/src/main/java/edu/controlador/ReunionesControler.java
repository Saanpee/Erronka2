package edu.controlador;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import modelo.Reuniones;
import modelo.Users;
@RestController
@RequestMapping("/Reuniones")
public class ReunionesControler {
	@GetMapping
	public String listaReuniones() {
		
	try {
	    Session session = HibernateUtil.getSessionFactory().openSession();
	    String hql = "FROM Reuniones";
	    Query q = session.createQuery(hql);
	    List<Reuniones> reuniones = q.list();
        
	    Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
	    String reunionesJson = gson.toJson(reuniones);
	    return reunionesJson;
	} catch (Exception e) {
	    e.printStackTrace();  // Loguear la excepción para depurar
	    return "Error: " + e.getMessage();
	}  
	}
}
 
