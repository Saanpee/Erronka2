package DTO;

public class HorarioDTO {

	private String extra;

	private String modulo;

	private String dia;

	private int hora;

	public HorarioDTO(String nombre, String modulo, String dia, int hora) {

		this.extra = nombre;

		this.modulo = modulo;

		this.dia = dia;

		this.hora = hora;

	}

	public String getNombre() {

		return extra;

	}

	public void setNombre(String nombre) {

		this.extra = nombre;

	}

	public String getModulo() {

		return modulo;

	}

	public void setModulo(String modulo) {

		this.modulo = modulo;

	}

	public String getDia() {

		return dia;

	}

	public void setDia(String dia) {

		this.dia = dia;

	}

	public int getHora() {

		return hora;

	}

	public void setHora(int hora) {

		this.hora = hora;

	}

}
