
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `draftosaurus_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `draftosaurus_db`;

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `edad` int(3) NOT NULL,
  `rol` ENUM('jugador', 'administrador') NOT NULL DEFAULT 'jugador',
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `idioma_preferido` varchar(50) DEFAULT 'es',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email_unico` (`email`),
  UNIQUE KEY `nombre_usuario_unico` (`nombre_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `dinosaurio` (
  `id_dino` int(11) NOT NULL AUTO_INCREMENT,
  `especie` varchar(100) NOT NULL,
  PRIMARY KEY (`id_dino`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `dinosaurio` (`id_dino`, `especie`) VALUES
(1, 't-rex'),
(2, 'spinosaurus'),
(3, 'brachiosaurus'),
(4, 'triceratops'),
(5, 'parasaurolophus'),
(6, 'stegosaurus');

CREATE TABLE `recinto` (
  `id_recinto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_recinto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `recinto` (`id_recinto`, `nombre`) VALUES
(1, 'bosqueSemejanza'),
(2, 'pradoDiferencia'),
(3, 'praderaAmor'),
(4, 'trioFrondoso'),
(5, 'reySelva'),
(6, 'islaSolitaria'),
(7, 'rio');

CREATE TABLE `partida` (
  `id_partida` int(11) NOT NULL AUTO_INCREMENT,
  `id_ganador` int(11) DEFAULT NULL,
  `estado` enum('en_curso','finalizada','pausada') NOT NULL DEFAULT 'en_curso',
  `fecha_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_partida`),
  KEY `id_ganador` (`id_ganador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `partida_usuario` (
  `id_partida` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `puntaje_final` int(11) DEFAULT 0,
  PRIMARY KEY (`id_partida`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `turno` (
  `id_turno` int(11) NOT NULL AUTO_INCREMENT,
  `id_partida` int(11) NOT NULL,
  `nro_ronda` int(11) NOT NULL,
  `nro_turno` int(11) NOT NULL,
  `restriccion_dado` ENUM('ninguna', 'boscosa', 'llanura', 'cafeteria', 'banos', 'vacio', 'sin-t-rex') DEFAULT 'ninguna',
  PRIMARY KEY (`id_turno`),
  KEY `id_partida` (`id_partida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `colocacion` (
  `id_colocacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_turno` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_dino` int(11) NOT NULL,
  `id_recinto` int(11) NOT NULL,
  PRIMARY KEY (`id_colocacion`),
  KEY `id_turno` (`id_turno`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_dino` (`id_dino`),
  KEY `id_recinto` (`id_recinto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `mano_turno` (
  `id_mano` int(11) NOT NULL AUTO_INCREMENT,
  `id_turno` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_dino` int(11) NOT NULL,
  PRIMARY KEY (`id_mano`),
  KEY `id_turno` (`id_turno`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_dino` (`id_dino`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `colocacion`
  ADD CONSTRAINT `colocacion_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id_turno`) ON DELETE CASCADE,
  ADD CONSTRAINT `colocacion_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `colocacion_ibfk_3` FOREIGN KEY (`id_dino`) REFERENCES `dinosaurio` (`id_dino`),
  ADD CONSTRAINT `colocacion_ibfk_4` FOREIGN KEY (`id_recinto`) REFERENCES `recinto` (`id_recinto`);

ALTER TABLE `partida`
  ADD CONSTRAINT `partida_ibfk_1` FOREIGN KEY (`id_ganador`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL;

ALTER TABLE `partida_usuario`
  ADD CONSTRAINT `partida_usuario_ibfk_1` FOREIGN KEY (`id_partida`) REFERENCES `partida` (`id_partida`) ON DELETE CASCADE,
  ADD CONSTRAINT `partida_usuario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

ALTER TABLE `turno`
  ADD CONSTRAINT `turno_ibfk_1` FOREIGN KEY (`id_partida`) REFERENCES `partida` (`id_partida`) ON DELETE CASCADE;

ALTER TABLE `mano_turno`
  ADD CONSTRAINT `mano_turno_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id_turno`) ON DELETE CASCADE,
  ADD CONSTRAINT `mano_turno_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `mano_turno_ibfk_3` FOREIGN KEY (`id_dino`) REFERENCES `dinosaurio` (`id_dino`);
COMMIT;

