package edu;
 
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import edu.servidorSocket.ServidorSocket;

@SpringBootApplication
public class ApiElorApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiElorApplication.class, args);
		ServidorSocket.main(args);
		     
	}

}
