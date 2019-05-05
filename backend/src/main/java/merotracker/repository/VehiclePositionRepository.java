package merotracker.repository;

import merotracker.model.Vehicle;
import merotracker.model.VehiclePosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
* Generated by Spring Data Generator on 08/04/2019
*/
@Repository
public interface VehiclePositionRepository extends JpaRepository<VehiclePosition, Integer> {

}
