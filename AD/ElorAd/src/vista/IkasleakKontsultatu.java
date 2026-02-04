package vista;

import java.awt.*;
import java.util.List;
import javax.swing.*;
import modelo.Ciclos;
import modelo.Users;
import DTO.AlumnoDTO;
import clienteSocket.clienteSocket;

public class IkasleakKontsultatu extends JFrame {
    private clienteSocket socket;
    private Users usuario;
    private JTable tableAlumnos;
    private JComboBox<Ciclos> cbCiclo;
    private JComboBox<Byte> cbCurso;

    public IkasleakKontsultatu(clienteSocket socketRecibido, Users usuario, List<AlumnoDTO> iniciales) {
        this.socket = socketRecibido;
        this.usuario = usuario;
        initComponents();
        
        // Rellenar combos con la conexión abierta
        if (socket != null) {
            socket.rellenarCombos(cbCiclo, cbCurso);
        }
        
        // Cargar tabla inicial
        if (iniciales != null) {
            Controlador.Metodos.actualizarTabla(iniciales, tableAlumnos);
        }
    }

    public void initComponents() {
        setTitle("Consultar Alumnos");
        setSize(800, 500);
        setLocationRelativeTo(null);
        
        cbCiclo = new JComboBox<>();
        cbCurso = new JComboBox<>();
        JButton btnBuscar = new JButton("Buscar");

        btnBuscar.addActionListener(e -> {
            int idCiclo = -1;
            byte numCurso = -1;

            if (cbCiclo.getSelectedItem() instanceof Ciclos) {
                idCiclo = ((Ciclos) cbCiclo.getSelectedItem()).getId();
            }
            if (cbCurso.getSelectedItem() instanceof Byte) {
                numCurso = (Byte) cbCurso.getSelectedItem();
            }

            // Filtrar sin abrir nuevas conexiones
            List<AlumnoDTO> filtrados = socket.filtrarAlumnos(usuario.getId(), idCiclo, numCurso);
            Controlador.Metodos.actualizarTabla(filtrados, tableAlumnos);
        });

        // Layout...
        JPanel panelNorte = new JPanel();
        panelNorte.add(new JLabel("Ciclo:")); panelNorte.add(cbCiclo);
        panelNorte.add(new JLabel("Curso:")); panelNorte.add(cbCurso);
        panelNorte.add(btnBuscar);
        
        tableAlumnos = new JTable();
        getContentPane().add(panelNorte, BorderLayout.NORTH);
        getContentPane().add(new JScrollPane(tableAlumnos), BorderLayout.CENTER);

        JButton btnVolver = new JButton("Bueltatu");
        btnVolver.addActionListener(e -> {
            new MenuaFrame(socket, usuario).setVisible(true);
            dispose();
        });
        getContentPane().add(btnVolver, BorderLayout.SOUTH);
    }
}