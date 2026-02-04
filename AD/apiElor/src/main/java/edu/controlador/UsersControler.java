package edu.controlador;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import modelo.Ciclos;
import modelo.Horarios;
import modelo.Users;
@RestController
@RequestMapping("/Users")
public class UsersControler {
	
	@GetMapping
	public String listaUsers() {
		
	try {
	    Session session = HibernateUtil.getSessionFactory().openSession();
	    String hql = "SELECT u FROM Users u\r\n"
	    		+ "JOIN FETCH u.tipos";
	    Query q = session.createQuery(hql);
	    List<Users> usrs = q.list();
        
	    Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
	    String usrsJson = gson.toJson(usrs);
	    return usrsJson;
	} catch (Exception e) {
	    e.printStackTrace();  // Loguear la excepción para depurar
	    return "Error: " + e.getMessage();
	}  
	}
	@GetMapping("/login/{username}/{password}")
		public String UsuariosLogin(@PathVariable String username,@PathVariable String password) {
		Session session = HibernateUtil.getSessionFactory().openSession();		
		try {
	    String hql = "SELECT u FROM Users u JOIN FETCH u.tipos t WHERE u.username = :username AND u.password = :password";
	    
	    
	    Query q = session.createQuery(hql);
	    q.setParameter("username", username);
	    q.setParameter("password", password);
	    
	    
	    Users user = (Users) q.uniqueResult();
	    
	    Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
	    String usrsJson = gson.toJson(user);
	    return usrsJson;
	    
	} catch (Exception e) {
	    e.printStackTrace();  // Loguear la excepción para depurar
	    return "Error: " + e.getMessage();
	}  finally {
        session.close();
    }
		
	}
	
	
}
 