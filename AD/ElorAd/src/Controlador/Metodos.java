package Controlador; 

import javax.swing.table.DefaultTableCellRenderer; // Si usas renderers
import javax.swing.event.ListSelectionEvent;      // Para el evento de clic en la tabla
import javax.swing.event.ListSelectionListener;   // Para detectar la selección
import java.util.List;                            // Para manejar las listas de AlumnoDTO
import java.util.ArrayList;
import DTO.AlumnoDTO;
import javax.swing.table.DefaultTableModel;
import javax.swing.JTable;

public class Metodos {
	public static void actualizarTabla(List<AlumnoDTO> alumnos, JTable tabla) {
	    String[] columnas = {"ID", "Nombre", "Apellidos", "Email", "Ciclo", "Curso"};
	    DefaultTableModel modelo = new DefaultTableModel(columnas, 0);

	    for (AlumnoDTO a : alumnos) {
	        Object[] fila = {
	            a.getId(),
	            a.getNombre(),
	            a.getApellidos(),
	            a.getEmail(),
	            a.getCicloNombre(),
	            a.getCurso()
	        };
	        modelo.addRow(fila);
	    }
	    
	    tabla.setModel(modelo);
	}
}
