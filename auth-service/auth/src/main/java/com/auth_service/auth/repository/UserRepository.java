package com.auth_service.auth.repository;

import com.auth_service.auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);

    User findByVerificationToken(String token);

    User findByResetPasswordToken(String token);
}
