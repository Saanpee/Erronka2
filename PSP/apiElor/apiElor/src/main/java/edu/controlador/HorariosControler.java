package edu.controlador;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import edu.DTO.HorarioDTO;
import modelo.Ciclos;
import modelo.Horarios;
@RestController
@RequestMapping("/Horarios")
public class HorariosControler {
	@GetMapping
	public String listaHorarios(){
		
		try {
		    Session session = HibernateUtil.getSessionFactory().openSession();
		    String hql = "FROM Horarios";
		    Query q = session.createQuery(hql);
		    List<Horarios> horarios = q.list();
	        
		    Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
		    String horariosJson = gson.toJson(horarios);
		    return horariosJson;
		} catch (Exception e) {
		    e.printStackTrace();  // Loguear la excepción para depurar
		    return "Error: " + e.getMessage();
		}  
		 
	}
	@GetMapping("/Profesor/Horario/{id}")
	public String HorariosProfesor(@PathVariable int id) {
		Session session = HibernateUtil.getSessionFactory().openSession();		
		try {
			String hql =   "SELECT h.dia, h.hora, m.nombre, h.aula, p.nombre, p.apellidos " +
		            "FROM Horarios h " +       // nombre exacto de la entidad
		            "JOIN h.modulos m " +
		            "JOIN h.users p " +
		            "WHERE p.id = :id " +
		            "ORDER BY h.dia, h.hora";
			
			 Query q = session.createQuery(hql);
			    q.setParameter("id", id);
			    List<Horarios> horarios = q.list();
			
			 Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
			    String horarioJson = gson.toJson(horarios);
			    return horarioJson;

		}catch(Exception e){
			e.printStackTrace();
			 return "Error: " + e.getMessage();
		}finally {
			session.close();
		}
		
		
		
	} @GetMapping("/Alumno/Horario/{id}")
	public String HorariosAlumno(@PathVariable int id) {
		Session session = HibernateUtil.getSessionFactory().openSession();		
		try {
			 
			String hql =   "SELECT h\r\n"
					+ "FROM Horarios h\r\n"
					+ "JOIN h.modulos m\r\n"
					+ "JOIN Matriculaciones mat\r\n"
					+ "    ON m.ciclos.id = mat.ciclos.id\r\n"
					+ "   AND m.curso = mat.curso\r\n"
					+ "WHERE mat.users.id = :id\r\n"
					+ "ORDER BY \r\n"
					+ "    CASE h.dia \r\n"
					+ "        WHEN 'LUNES' THEN 1\r\n"
					+ "        WHEN 'MARTES' THEN 2\r\n"
					+ "        WHEN 'MIERCOLES' THEN 3\r\n"
					+ "        WHEN 'JUEVES' THEN 4\r\n"
					+ "        WHEN 'VIERNES' THEN 5\r\n"
					+ "    END,\r\n"
					+ "    h.hora";
			 
			Query q = session.createQuery(hql);
			    q.setParameter("id", id);
			    List<Horarios> horarios = q.list();
			
			 Gson gson = new GsonBuilder().setPrettyPrinting().excludeFieldsWithoutExposeAnnotation().create();
			    String horarioJson = gson.toJson(horarios);
			    return horarioJson;

		}catch(Exception e){
			e.printStackTrace();
			 return "Error: " + e.getMessage();
		}finally {
			session.close();
		}
	}
	//Hacer una logica que siga poco a poco paso por paso todo, de modulos a matriculaciones conseguir el ciclo para ver en que curso esta y de ahi sacar el horario alumno
	@GetMapping("/horarioAlumno/{id}")
	public String getHorariosAlumnoJoin(@PathVariable int id) {
	    Session session = null;
	    try {
	        session = HibernateUtil.getSessionFactory().openSession();
	        System.out.println("Executing query for student ID: " + id);  // Log for debugging
	        
	       String hql =
	    		    "SELECT h.dia, h.hora, m.nombre, MIN(h.users.nombre) " +
	    		    	    "FROM Matriculaciones mat " +
	    		    	    "JOIN mat.ciclos.moduloses m " +
	    		    	    "JOIN m.horarioses h " +
	    		    	    "WHERE mat.users.id = :id " +
	    		    	    "AND m.curso = mat.curso " +
	    		    	    "GROUP BY h.dia, h.hora " +
	    		    	    "ORDER BY h.dia, h.hora ASC"
	    			;	
	       
	        Query q =session.createQuery(hql);
	        q.setParameter("id", id);
	        
	        List<Object[]> filas = q.list();
	        if (filas.isEmpty()) {
	            return "No se encontraron horarios para el alumno con ID: " + id;
	        }

	        List<HorarioDTO> horarios = new ArrayList<>();
	        for (Object[] fila : filas) {
	            String dia = fila[0] != null ? fila[0].toString() : "Unknown Day";  // Safe null check
	            Number horaNum = (Number) fila[1];
	            String modulo = fila[2] != null ? fila[2].toString() : "Unknown Module";  // Safe null check
	            String profesor = fila[3] != null ? fila[3].toString() : "Unknown Professor";  // Safe null check
	            int hora = horaNum != null ? horaNum.intValue() : 0;
	            horarios.add(new HorarioDTO(profesor, modulo, dia, hora));
	        }

	        Gson gson = new GsonBuilder().setPrettyPrinting().create();
	        return gson.toJson(horarios);

	    } catch (Exception e) {
	        e.printStackTrace();  // Logs detailed exception
	        return "Error al obtener los horarios: " + e.getMessage();  // Return detailed error message
	    } finally {
	        if (session != null && session.isOpen()) {
	            session.close();
	        }
	    }
	}
}
