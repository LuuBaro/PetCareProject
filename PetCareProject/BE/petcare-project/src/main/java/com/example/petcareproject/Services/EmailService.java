package com.example.petcareproject.Services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(MimeMessage message) throws MessagingException {
        mailSender.send(message);
    }

    public MimeMessage createMimeMessage() {
        return mailSender.createMimeMessage();
    }
}

