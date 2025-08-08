package com.n7.serviceimpl;

import com.n7.pojo.EnvRecord;
import com.n7.repositories.EnvRecordRepository;
import com.n7.services.EnvRecordService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnvRecordServiceImpl implements EnvRecordService {

    @Autowired
    private EnvRecordRepository envRecordRepository;

    @Override
    @Transactional
    public EnvRecord addEnvRecord(EnvRecord envRecord) {
        return this.envRecordRepository.save(envRecord);
    }
}
