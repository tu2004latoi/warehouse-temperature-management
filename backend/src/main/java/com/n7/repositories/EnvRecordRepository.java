package com.n7.repositories;

import com.n7.pojo.EnvRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnvRecordRepository extends JpaRepository<EnvRecord, Integer> {
}
