package com.sagar.bookingsystem.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sagar.bookingsystem.dto.SeatHold;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisSeatHoldService {

    private final StringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper;

    private String key(String seatId) {
        return "seat:" + seatId;
    }

    public boolean tryCreateHold(
            String seatId,
            String userId
    ) {

        try {

            SeatHold hold =
                    new SeatHold(
                            userId,
                            "HELD"
                    );

            Boolean success =
                    redisTemplate.opsForValue()
                            .setIfAbsent(
                                    key(seatId),
                                    objectMapper.writeValueAsString(
                                            hold
                                    ),
                                    Duration.ofSeconds(30)
                            );

            return Boolean.TRUE.equals(
                    success
            );

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    public SeatHold getHold(
            String seatId
    ) {

        try {

            String json =
                    redisTemplate.opsForValue()
                            .get(
                                    key(seatId)
                            );

            if (json == null) {
                return null;
            }

            return objectMapper.readValue(
                    json,
                    SeatHold.class
            );

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    public void updateState(
            String seatId,
            String state
    ) {

        try {

            String redisKey =
                    key(seatId);

            SeatHold hold =
                    getHold(seatId);

            if (hold == null) {
                return;
            }

            Long ttlSeconds =
                    redisTemplate.getExpire(
                            redisKey
                    );

            if (ttlSeconds == null
                    || ttlSeconds <= 0) {
                return;
            }

            hold.setState(state);

            redisTemplate.opsForValue().set(
                    redisKey,
                    objectMapper.writeValueAsString(
                            hold
                    ),
                    Duration.ofSeconds(
                            ttlSeconds
                    )
            );

        } catch (JsonProcessingException e) {

            throw new RuntimeException(e);
        }
    }

    public long getRemainingTTL(
            String seatId
    ) {

        Long ttl =
                redisTemplate.getExpire(
                        key(seatId)
                );

        return ttl == null
                ? -1
                : ttl;
    }

    public void releaseSeat(
            String seatId
    ) {

        redisTemplate.delete(
                key(seatId)
        );
    }
}