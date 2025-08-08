package com.n7.services;

import com.n7.pojo.EnvRecord;
import org.springframework.stereotype.Service;

@Service
public interface EnvRecordService {
    EnvRecord addEnvRecord(EnvRecord envRecord);
}
