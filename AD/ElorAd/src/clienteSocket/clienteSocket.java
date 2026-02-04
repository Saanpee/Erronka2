package clienteSocket;

import java.io.*;
import java.net.Socket;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;
import java.lang.reflect.Type;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

import DTO.AlumnoDTO;
import DTO.HorarioDTO;
import modelo.Ciclos;
import modelo.TiposEnum;
import modelo.Users;

public class clienteSocket {

    private static final String HOST = "10.5.104.138";
    private static final int PUERTO = 12345;
    
    private Socket socket;
    private DataOutputStream salida;
    private DataInputStream entrada;
    private Gson gson;

    /**
     * Abre la conexión y configura los flujos.
     */
    public clienteSocket() {
        try {
            this.socket = new Socket();
            // Intenta conectar. Si en 5 segundos no responde, lanza error en lugar de congelarse.
            this.socket.connect(new InetSocketAddress(HOST, PUERTO), 5000);
            
            this.salida = new DataOutputStream(socket.getOutputStream());
            this.entrada = new DataInputStream(socket.getInputStream());
            this.gson = new Gson();
            
            System.out.println("Conexión establecida con el servidor.");
        } catch (IOException e) {
            JOptionPane.showMessageDialog(null, "Ezin da zerbitzarira konektatu (No se pudo conectar)");
            e.printStackTrace();
        }
    }

    /**
     * 1. LOGIN
     * Envía la petición y las credenciales.
     */
    public Users loginIkerketa(String erabiltzailea, String pasahitza) {
        try {
            salida.writeUTF("LOGIN");
            salida.writeUTF(erabiltzailea);
            salida.writeUTF(pasahitza);
            salida.flush();

            String jsonRecibido = entrada.readUTF();

            if (jsonRecibido != null && !"null".equals(jsonRecibido)) {
                Users usr = gson.fromJson(jsonRecibido, Users.class);
                TiposEnum tipo = TiposEnum.fromCodigo(usr.getTipos().getId());
                
                if (tipo == TiposEnum.PROFESOR) {
                    JOptionPane.showMessageDialog(null, "Ondo hasieratuta, ongi etorri!!");
                    return usr;
                } else {
                    JOptionPane.showMessageDialog(null, "Baimenik gabeko erabiltzailea.");
                }
            } else {
                JOptionPane.showMessageDialog(null, "Erabiltzailea edo pasahitza okerra da.");
            }
        } catch (IOException e) {
            System.err.println("Error en Login: " + e.getMessage());
        }
        return null;
    }

    /**
     * 2. OBTENER ALUMNOS (Corregido para enviar ID de forma segura)
     */
    public List<AlumnoDTO> obtenerAlumnosPorProfesor(int idProfesor) {
        List<AlumnoDTO> listaAlumnos = new ArrayList<>();
        try {
            salida.writeUTF("GET_IKASLEAK");
            salida.writeInt(idProfesor); // Usamos writeInt para que coincida con el servidor
            salida.flush();

            String jsonRespuesta = entrada.readUTF();
            if (jsonRespuesta != null && !"null".equals(jsonRespuesta)) {
                listaAlumnos = gson.fromJson(jsonRespuesta, new TypeToken<List<AlumnoDTO>>() {}.getType());
            }
        } catch (Exception e) {
            System.err.println("Error al obtener alumnos: " + e.getMessage());
        }
        return listaAlumnos;
    }

    /**
     * 3. RELLENAR COMBOS (Unificado)
     * Importante: El servidor debe enviar un JsonObject con "ciclos" y "cursos".
     */
    public void rellenarCombos(JComboBox<Ciclos> cbCiclos, JComboBox<Byte> cbCursos) {
        try {
            salida.writeUTF("GET_COMBOS");
            salida.flush();

            String json = entrada.readUTF();
            JsonObject data = JsonParser.parseString(json).getAsJsonObject();

            // Rellenar Ciclos
            cbCiclos.removeAllItems();
            cbCiclos.addItem(new Ciclos("Guztiak / Todos")); 
            List<Ciclos> listaCi = gson.fromJson(data.get("ciclos"), new TypeToken<List<Ciclos>>(){}.getType());
            for (Ciclos c : listaCi) cbCiclos.addItem(c);

            // Rellenar Cursos
            cbCursos.removeAllItems();
            cbCursos.addItem((byte)-1); 
            List<Byte> listaCu = gson.fromJson(data.get("cursos"), new TypeToken<List<Byte>>(){}.getType());
            for (Byte b : listaCu) cbCursos.addItem(b);

        } catch (Exception e) {
            System.err.println("Error al rellenar combos: " + e.getMessage());
        }
    }

    /**
     * 4. FILTRAR ALUMNOS
     * Usa el formato de comando separado por punto y coma.
     */
    public List<AlumnoDTO> filtrarAlumnos(int idProf, int idCiclo, byte curso) {
        List<AlumnoDTO> lista = new ArrayList<>();
        try {
            String peticion = "FILTER_ALUMNOS;" + idProf + ";" + idCiclo + ";" + curso;
            salida.writeUTF(peticion);
            salida.flush();

            String jsonRespuesta = entrada.readUTF();
            
            if (jsonRespuesta != null && !jsonRespuesta.equals("[]") && !jsonRespuesta.equals("null")) {
                lista = gson.fromJson(jsonRespuesta, new TypeToken<List<AlumnoDTO>>(){}.getType());
            }
        } catch (IOException e) {
            System.err.println("Error al filtrar: " + e.getMessage());
        }
        return lista;
    }

    /**
     * 5. OBTENER TODOS LOS USUARIOS
     */
    public List<Users> listaUsuarios() {
        List<Users> usuarios = new ArrayList<>();
        try {
            salida.writeUTF("GET_USUARIOS");
            salida.flush();

            String json = entrada.readUTF();
            usuarios = gson.fromJson(json, new TypeToken<List<Users>>(){}.getType());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return usuarios;
    }

    public void cerrarConexion() {
        try {
            if (socket != null && !socket.isClosed()) {
                socket.close();
                System.out.println("Conexión cerrada.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public List<HorarioDTO> obtenerHorario(int idProfesor) {
        List<HorarioDTO> lista = new ArrayList<>();
        try {
            salida.writeUTF("GET_HORARIO");
            salida.writeInt(idProfesor); // Enviamos el ID del profesor
            salida.flush();

            String json = entrada.readUTF();
            if (json != null && !"null".equals(json)) {
                java.lang.reflect.Type tipoLista = new com.google.gson.reflect.TypeToken<List<HorarioDTO>>(){}.getType();
                lista = gson.fromJson(json, tipoLista);
            }
        } catch (IOException e) {
            System.err.println("Error al obtener horario: " + e.getMessage());
        }
        return lista;
    }
    public List<Users> buscarProfesores(String filtro) {
        try {
            salida.writeUTF("GET_PROFESORES");
            salida.writeUTF(filtro);
            salida.flush();
            String json = entrada.readUTF();
            return gson.fromJson(json, new TypeToken<List<Users>>(){}.getType());
        } catch (IOException e) {
            return new ArrayList<>();
        }
    }
}
