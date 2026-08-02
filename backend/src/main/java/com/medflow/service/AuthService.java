package com.medflow.service;

import com.medflow.dto.LoginRequest;
import com.medflow.dto.LoginResponse;
import com.medflow.entity.Usuario;
import com.medflow.repository.UsuarioRepository;
import com.medflow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalStateException("Usuario nao encontrado apos autenticacao"));

        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(usuario);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(usuario.getUsername())
                .password(usuario.getPassword())
                .authorities(usuario.getRoles().stream()
                        .map(r -> r.getNome())
                        .toArray(String[]::new))
                .build();

        String token = jwtService.generateToken(userDetails);

        List<String> roles = usuario.getRoles().stream()
                .map(r -> r.getNome())
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(usuario.getUsername())
                .nomeCompleto(usuario.getNomeCompleto())
                .roles(roles)
                .expiresIn(jwtService.getExpiration())
                .build();
    }
}
