package merotracker.repository;

import merotracker.model.Trip;
import merotracker.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
* Generated by Spring Data Generator on 08/04/2019
*/
@Repository
public interface TripRepository extends JpaRepository<Trip, Integer>{

}
