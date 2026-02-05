package edu.servidorSocket;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Transaction;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.hibernate.Session;
import org.hibernate.Hibernate;
import org.hibernate.Query;

import edu.DTO.AlumnoDTO;
import edu.DTO.HorarioDTO;
import edu.controlador.HibernateUtil;
import modelo.Ciclos;
import modelo.Horarios;
import modelo.Tipos;
import modelo.Users;

public class clienteHandler implements Runnable {

	 

	private Socket socket;

	public clienteHandler(Socket socket) {
		this.socket = socket;
	}

	@Override
	public void run() {
        // Usamos un solo bloque try-with-resources para los streams
        try (DataInputStream entrada = new DataInputStream(socket.getInputStream());
             DataOutputStream salida = new DataOutputStream(socket.getOutputStream())) {

            // BUCLE INFINITO: Para que el servidor siga escuchando después de cada comando
            while (!socket.isClosed()) {
                String peticionCompleta = entrada.readUTF();
                if (peticionCompleta == null) break;

                // Separamos el comando de los parámetros
                String[] partes = peticionCompleta.split(";");
                String comando = partes[0];
                Gson gson = new Gson();

                System.out.println("Comando recibido: " + comando);

                switch (comando) {
                    case "LOGIN":
                        String user = entrada.readUTF();
                        String pass = entrada.readUTF();
                        Users usuarioEncontrado = buscarUsuarioEnBD(user, pass);
                        
                        if (usuarioEncontrado != null) {
                            salida.writeUTF(gson.toJson(usuarioEncontrado));
                        } else {
                            salida.writeUTF("null");
                        }
                        break;
                    case "GET_IKASLEAK":

    					// 1. Leer el ID del profesor que manda el cliente

    					 

    					int idProfesor = entrada.readInt();

    					System.out.println("Solicitando alumnos para profesor ID: " + idProfesor);



    					// 2. Consultar y Limpiar

    					List<AlumnoDTO> listaAlumnos = (List<AlumnoDTO>) obtenerAlumnosPorProfesor(idProfesor);



    					// 3. Enviar JSON

    					String jsonAlumnos = gson.toJson(listaAlumnos);

    					salida.writeUTF(jsonAlumnos);

    					break;

                    case "GET_COMBOS":
                        Map<String, Object> comboData = new HashMap<>();
                        comboData.put("ciclos", obtenerTodosCiclos());
                        comboData.put("cursos", obtenerCursos());
                        
                        // Usamos Expose para evitar recursividad en Ciclos
                        String jsonCombos = new GsonBuilder()
                                .excludeFieldsWithoutExposeAnnotation()
                                .create().toJson(comboData);
                        salida.writeUTF(jsonCombos);
                        break;

                    case "FILTER_ALUMNOS":
                        try {
                            // Extraemos parámetros del split
                            int idProfe = Integer.parseInt(partes[1]);
                            int idCiclo = Integer.parseInt(partes[2]);
                            byte curso = Byte.parseByte(partes[3]);

                            List<AlumnoDTO> lista = obtenerAlumnosFiltrados(idProfe, idCiclo, curso);
                            salida.writeUTF(new Gson().toJson(lista));
                            System.out.println(lista);
                        } catch (Exception ex) {
                            ex.printStackTrace();
                            salida.writeUTF("[]");
                        }
                        break;
                    case "GET_HORARIO":
                        int idProf = entrada.readInt(); // Leemos el ID que envía el cliente
                        String jsonHorario = obtenerHorarioProfesorHQL(idProf);
                        salida.writeUTF(jsonHorario);
                        salida.flush();
                        break;
                        
                    case "GET_PROFESORES":
                        String filtroNombre = entrada.readUTF(); // Leemos lo que el usuario escribe
                        String jsonProfes = obtenerProfesoresBusqueda(filtroNombre);
                        salida.writeUTF(jsonProfes);
                        break;

                    default:
                        System.out.println("Comando no reconocido: " + comando);
                        break;
                }
                salida.flush(); // Aseguramos que los datos salgan por el socket
            }
        } catch (IOException e) {
            System.err.println("Conexión con el cliente cerrada.");
        } finally {
            try {
                if (socket != null && !socket.isClosed()) socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


	 

	private static Users buscarUsuarioEnBD(String usuario, String pass) {

		Session session = HibernateUtil.getSessionFactory().openSession();

		Users usuarioLimpio = null; // Este es el que devolveremos

		try {

			String hql = "from Users u where u.username = :erabiltzailea and u.password = :pass ";

			Query q = session.createQuery(hql);

			q.setParameter("erabiltzailea", usuario);

			q.setParameter("pass", pass);

			List<?> filas = q.list();

			if (!filas.isEmpty()) {

				// 1. Obtenemos el usuario "sucio" (conectado a Hibernate/Proxy)

				Users usuarioHibernate = (Users) filas.get(0);

				// 2. Creamos una instancia NUEVA (sin conexiones a BD)

				usuarioLimpio = new Users();

				// 3. Copiamos los datos básicos manualmente

				usuarioLimpio.setId(usuarioHibernate.getId());

				// ... copia aquí cualquier otro campo simple ...

				// 4. TRUCO IMPORTANTE PARA EL TIPO (Relación)

				// Si intentas serializar 'usuarioHibernate.getTipos()' directamente, fallará.

				if (usuarioHibernate.getTipos() != null) {

					// Asumiendo que tu clase de tipos se llama 'Tipos'

					Tipos tipoOriginal = usuarioHibernate.getTipos();

					Tipos tipoLimpio = new Tipos();

					// Copiamos SOLO los datos del tipo (ID y Nombre)

					tipoLimpio.setId(tipoOriginal.getId());

					tipoLimpio.setName(tipoOriginal.getName()); // O getNombre()

					// ¡CRUCIAL! NO copies la lista de usuarios del tipo.

					// Deja tipoLimpio.setUsers(null) o simplemente no lo llames.

					// Esto rompe el bucle infinito Usuario -> Tipo -> Usuario -> Tipo...

					usuarioLimpio.setTipos(tipoLimpio);

				}

				usuarioLimpio.setEmail(usuarioHibernate.getEmail());

				usuarioLimpio.setUsername(usuarioHibernate.getUsername());

				usuarioLimpio.setPassword(usuarioHibernate.getPassword());

				usuarioLimpio.setNombre(usuarioHibernate.getNombre());

				usuarioLimpio.setApellidos(usuarioHibernate.getApellidos());

				usuarioLimpio.setDni(usuarioHibernate.getDni());

				usuarioLimpio.setDireccion(usuarioHibernate.getDireccion());

				usuarioLimpio.setTelefono1(usuarioHibernate.getTelefono1());

				usuarioLimpio.setTelefono2(usuarioHibernate.getTelefono2());

				usuarioLimpio.setArgazkiaUrl(usuarioHibernate.getArgazkiaUrl());

				usuarioLimpio.setCreatedAt(usuarioHibernate.getCreatedAt());

				usuarioLimpio.setUpdatedAt(usuarioHibernate.getUpdatedAt());

			}

		} catch (Exception e) {

			e.printStackTrace();

		} finally {

			session.close();

		}

		// Devolvemos el objeto limpio que Gson sí podrá convertir

		return usuarioLimpio;

	}
	
	private List<AlumnoDTO> obtenerAlumnosPorProfesor(int idProfesor) {
	    List<AlumnoDTO> listaDTO = new ArrayList<>();
	    Session session = HibernateUtil.getSessionFactory().openSession();

	    try {
	        String hql = "SELECT DISTINCT r.usersByAlumnoId FROM Reuniones r WHERE r.usersByProfesorId.id = :idProfesor";
	        List<Users> alumnos = session.createQuery(hql, Users.class)
	                                     .setParameter("idProfesor", idProfesor)
	                                     .getResultList();

	        for (Users u : alumnos) {
	            AlumnoDTO dto = new AlumnoDTO();
	            dto.setId(u.getId());
	            dto.setNombre(u.getNombre());
	            dto.setApellidos(u.getApellidos());
	            dto.setEmail(u.getEmail());
	            dto.setUsername(u.getUsername());
	            dto.setTipo(u.getTipos() != null ? u.getTipos().getName() : null);

	            listaDTO.add(dto);
	        }
	    } finally {
	        session.close(); // cerrar sesión **después** de clonar
	    }

	    return listaDTO;
	} 
 
	public List<Ciclos> obtenerTodosCiclos() {
	    try (Session session = HibernateUtil.getSessionFactory().openSession()) {
	        // HQL para obtener los ciclos
	        return session.createQuery("from Ciclos", Ciclos.class).list();
	    }
	}

	// Método para obtener los cursos distintos (1, 2, etc.)
	public List<Byte> obtenerCursos() {
	    try (Session session = HibernateUtil.getSessionFactory().openSession()) {
	        // Consultamos los cursos únicos que existen en la tabla Modulos o Matriculaciones
	        return session.createQuery("select distinct m.curso from Modulos m order by m.curso", Byte.class).list();
	    }
	}
  
	private List<AlumnoDTO> obtenerAlumnosFiltrados(int idProfe, int idCiclo, byte curso) {
	    List<AlumnoDTO> resultado = new ArrayList<>();
	    try (Session session = HibernateUtil.getSessionFactory().openSession()) {
	        
	        // HQL simplificado para probar
	        StringBuilder hql = new StringBuilder(
	            "SELECT DISTINCT u FROM Users u " +
	            "JOIN Matriculaciones m ON u.id = m.users.id " +
	            "WHERE u.id IN (SELECT r.usersByAlumnoId.id FROM Reuniones r WHERE r.usersByProfesorId.id = :idP)"
	        );

	        if (idCiclo != -1) hql.append(" AND m.ciclos.id = :idC");
	        if (curso != -1) hql.append(" AND m.curso = :cur");

	        Query<Users> query = session.createQuery(hql.toString(), Users.class);
	        query.setParameter("idP", idProfe);
	        if (idCiclo != -1) query.setParameter("idC", idCiclo);
	        if (curso != -1) query.setParameter("cur", curso);

	        List<Users> alumnosDB = query.getResultList();
	        System.out.println("Alumnos encontrados en BD: " + alumnosDB.size()); // Log para depurar

	        for (Users u : alumnosDB) {
	            AlumnoDTO dto = new AlumnoDTO();
	            dto.setId(u.getId());
	            dto.setNombre(u.getNombre());
	            dto.setApellidos(u.getApellidos());
	            dto.setEmail(u.getEmail());
	            resultado.add(dto);
	        }
	    } catch (Exception e) {
	        System.err.println("Error en la consulta HQL:");
	        e.printStackTrace();
	    }
	    return resultado;
	}
	private String obtenerHorarioProfesorHQL(int idProfesor) {
	    List<HorarioDTO> listaDtos = new ArrayList<>();
	    // Usamos el SessionFactory que ya tienes configurado
	    try (Session session = HibernateUtil.getSessionFactory().openSession()) {
	        
	        // HQL CORREGIDO: 
	        // 'h.users.id' coincide con tu variable 'private Users users'
	        // 'h.modulos.nombre' coincide con la variable 'private Modulos modulos'
	        String hql = "SELECT h.dia, h.hora, h.modulos.nombre " +
	                     "FROM Horarios h " +
	                     "WHERE h.users.id = :idProf";
	        
	        Query query = session.createQuery(hql);
	        query.setParameter("idProf", idProfesor);
	        
	        List<Object[]> resultados = query.list();
	        
	        for (Object[] fila : resultados) {
	            String dia = (String) fila[0];
	            // Tu clase usa 'byte hora', Hibernate lo devuelve como tal
	            int hora = ((Byte) fila[1]).intValue(); 
	            String nombreModulo = (String) fila[2];
	            
	            // Creamos el DTO: (extra, modulo, dia, hora)
	            listaDtos.add(new HorarioDTO("", nombreModulo, dia, hora));
	        }
	    } catch (Exception e) {
	        System.err.println("Error en HQL: " + e.getMessage());
	        e.printStackTrace();
	    }
	    
	    return new Gson().toJson(listaDtos);
	}
	private String obtenerProfesoresBusqueda(String filtro) {
	    List<Users> listaLimpia = new ArrayList<>();
	    try (Session session = HibernateUtil.getSessionFactory().openSession()) {
	        String hql = "FROM Users u WHERE u.tipos.id = 3 AND " +
	                     "(u.nombre LIKE :f OR u.apellidos LIKE :f)";
	        Query<Users> query = session.createQuery(hql, Users.class);
	        query.setParameter("f", "%" + filtro + "%");
	        
	        List<Users> listaHibernate = query.list();
	        
	        for (Users u : listaHibernate) {
	            Users limpio = new Users();
	            limpio.setId(u.getId());
	            limpio.setNombre(u.getNombre());
	            limpio.setApellidos(u.getApellidos());
	            limpio.setEmail(u.getEmail());
	            // No copies la relación 'tipos' ni listas de alumnos para evitar el proxy
	            listaLimpia.add(limpio);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return new Gson().toJson(listaLimpia);
	}
}