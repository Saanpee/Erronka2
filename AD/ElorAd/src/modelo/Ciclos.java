package modelo;

import java.util.HashSet;
import java.util.Set;

public class Ciclos implements java.io.Serializable {
	private Integer id;
	private String nombre;
	private Set moduloses = new HashSet(0);
	private Set matriculacioneses = new HashSet(0);

	public Ciclos() {
	}

	public Ciclos(String nombre) {
		this.nombre = nombre;
	}

	public Ciclos(String nombre, Set moduloses, Set matriculacioneses) {
		this.nombre = nombre;
		this.moduloses = moduloses;
		this.matriculacioneses = matriculacioneses;
	}

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Set getModuloses() {
		return this.moduloses;
	}

	public void setModuloses(Set moduloses) {
		this.moduloses = moduloses;
	}

	public Set getMatriculacioneses() {
		return this.matriculacioneses;
	}

	public void setMatriculacioneses(Set matriculacioneses) {
		this.matriculacioneses = matriculacioneses;
	}

	public String toStringg() {
		return "Ciclos [id=" + id + ", nombre=" + nombre + ", moduloses=" + moduloses + ", matriculacioneses="
				+ matriculacioneses + "]";
	}
	@Override
	public String toString() {
	    return this.nombre; // Así el JComboBox mostrará "DAM", "ASIR", etc.
	}

}

