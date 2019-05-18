package merotracker.controller;

import com.sun.javaws.exceptions.InvalidArgumentException;
import merotracker.model.Vehicle;
import merotracker.model.VehiclePosition;
import merotracker.repository.VehiclePositionRepository;
import merotracker.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.persistence.EntityNotFoundException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;


@RepositoryRestController
@RequestMapping(value = "/vehiclepositions")
public class VehiclePositionController {

    private final static Logger logger = LoggerFactory.getLogger(VehiclePositionController.class);

    @Autowired
    private VehiclePositionRepository repository;
    @Autowired
    private VehicleRepository vehicleRepository;

    // example: ?latitude=3859.795314&longitude=-355.488458&altitude=689&time=20190504230523&satellites=14&speedOTG=&course=335.180481&vehicle=OraP37mHQ6SX4ZQP&sum=fbc2a37cf2bb19ef8c6d739682de7a4a
    // hash: lat, lon, date, public, private
    @GetMapping("/arduino")
    public ResponseEntity<?> create (

            @RequestParam String latitude,
            @RequestParam String longitude,
            @RequestParam String altitude,
            @RequestParam String time,
            @RequestParam String satellites,
            @RequestParam String speedOTG,
            @RequestParam String course,
            @RequestParam String vehicle,
            @RequestParam String sum

    ) throws NoSuchAlgorithmException, ParseException, InvalidArgumentException {

        System.out.println("ping!");

        Vehicle v = vehicleRepository.findByPublicId(vehicle).orElseThrow(() -> new EntityNotFoundException());

        if (Double.parseDouble(latitude) == 0 && Double.parseDouble(latitude) == 0 )
            throw new InvalidArgumentException(new String[]{"Invalid Coordinates"});


        String toCheck = latitude+longitude+time+v.getPublicId()+v.getPrivateId();
        byte[] bytesOfMessage = toCheck.getBytes(StandardCharsets.UTF_8);
        byte[] thedigest = MessageDigest.getInstance("MD5").digest(bytesOfMessage);
        StringBuilder sb = new StringBuilder();
        for (byte b : thedigest)
            sb.append(String.format("%02x", b));
        String sumGenerated = sb.toString();

        if ( sumGenerated.equals(sum) ){
            DateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
            Date parsed = df.parse(time);

            VehiclePosition vp = new VehiclePosition(
                    parsed,
                    -1,
                    (course.equals("")?null:Double.parseDouble(course)),
                    Short.parseShort(satellites),
                    Double.parseDouble(speedOTG),
                    coordParser(latitude),
                    coordParser(longitude),
                    v
            );

            repository.save(vp);

        } else {
            logger.warn("UNEXPECTED ATTEMPT AT VEHICLE POSITION CREATION");
        }

        return ResponseEntity.ok().body("\n\t Data Save\n");

    }

    // Converts DDMM.mmmmº (NMEA String by sim908) into DD.ddddº (Map-friendly, decimal coordinates)
    private double coordParser(String coord){
        String deg = coord.substring(0,coord.indexOf('.')-2);
        String min = coord.substring(coord.indexOf('.')-2);

        double val = Math.abs(Double.parseDouble(deg)) + (Double.parseDouble(min)/60);

        if(deg.charAt(0) == '-')
            val = 0 - val;

        return val;
    }

}