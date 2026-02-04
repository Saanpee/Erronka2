package vista;

import java.awt.*;
import java.util.List;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import clienteSocket.clienteSocket;
import modelo.Users;
import DTO.HorarioDTO;

public class OrdutegiaFrame extends JFrame {

    private clienteSocket socket;
    private Users usuario;
    private JTable tablaHorario;
    private DefaultTableModel modeloTabla;

    public OrdutegiaFrame(clienteSocket socketRecibido, Users usuarioRecibido) {
        this.socket = socketRecibido;
        this.usuario = usuarioRecibido;
        
        setTitle("ORDUTEGIA: " + usuario.getNombre().toUpperCase());
        setSize(950, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        cargarDatosEnTabla(); 
    }

    private void initComponents() {
        JPanel contentPane = new JPanel(new BorderLayout(15, 15));
        contentPane.setBackground(Color.WHITE);
        contentPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        setContentPane(contentPane);

        // Título estilizado (Azul como en tu imagen)
        JLabel lblTitulo = new JLabel("ORDUTEGIA: " + usuario.getNombre().toUpperCase(), SwingConstants.CENTER);
        lblTitulo.setFont(new Font("Segoe UI", Font.BOLD, 26));
        lblTitulo.setForeground(new Color(0, 128, 255));
        contentPane.add(lblTitulo, BorderLayout.NORTH);

        // Definición de Columnas según tu imagen
        String[] columnas = {"Hora", "Astelehena", "Asteartea", "Asteazkena", "Osteguna", "Ostirala"};
        
        modeloTabla = new DefaultTableModel(columnas, 0) {
            @Override
            public boolean isCellEditable(int row, int column) { return false; }
        };

        tablaHorario = new JTable(modeloTabla);
        tablaHorario.setRowHeight(70); // Altura para que quepa el nombre del módulo
        
        // Estilo de cabecera azul
        tablaHorario.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 15));
        tablaHorario.getTableHeader().setBackground(new Color(0, 128, 255));
        tablaHorario.getTableHeader().setForeground(Color.WHITE);
        
        contentPane.add(new JScrollPane(tablaHorario), BorderLayout.CENTER);

        // Botón Bueltatu
        JButton btnVolver = new JButton("Bueltatu");
        btnVolver.setBackground(new Color(0, 128, 255));
        btnVolver.setForeground(Color.WHITE);
        btnVolver.setFont(new Font("Segoe UI", Font.BOLD, 14));
        btnVolver.setPreferredSize(new Dimension(130, 40));
        btnVolver.addActionListener(e -> {
            new MenuaFrame(socket, usuario).setVisible(true);
            dispose();
        });
        
        JPanel panelBoton = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        panelBoton.setBackground(Color.WHITE);
        panelBoton.add(btnVolver);
        contentPane.add(panelBoton, BorderLayout.SOUTH);
    }

    private void cargarDatosEnTabla() {
        // 1. Crear las filas de tiempo fijas (08:00 a 13:30)
        String[] tramos = {"08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:30 - 12:30", "12:30 - 13:30", "13:30 - 14:30"};
        for (String t : tramos) {
            modeloTabla.addRow(new Object[]{t, "", "", "", "", ""});
        }

        // 2. Obtener lista de HorarioDTO del socket
        List<HorarioDTO> datos = socket.obtenerHorario(usuario.getId());

        // 3. Mapear cada DTO a su celda
        for (HorarioDTO dto : datos) {
            // Fila: La hora en tu base de datos empieza en 1, así que restamos 1 para el índice
            int fila = dto.getHora() - 1; 
           
            // Columna: Basada en el texto del día
            int columna = -1;
            String dia = dto.getDia().trim().toUpperCase();
            if (dia.contains("LUNES") || dia.contains("ASTELEHENA")) columna = 1;
            else if (dia.contains("MARTES") || dia.contains("ASTEARTEA")) columna = 2;
            else if (dia.contains("MIERCOLES") || dia.contains("ASTEAZKENA")) columna = 3;
            else if (dia.contains("JUEVES") || dia.contains("OSTEGUNA")) columna = 4;
            else if (dia.contains("VIERNES") || dia.contains("OSTIRALA")) columna = 5;

            // Insertar el nombre del módulo si la posición es válida dentro de los tramos creados
            if (fila >= 0 && fila < modeloTabla.getRowCount() && columna != -1) {
                modeloTabla.setValueAt(dto.getModulo(), fila, columna);
            }
        }
    }
}