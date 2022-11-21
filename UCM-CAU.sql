-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 17-11-2022 a las 16:55:27
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `UCM-CAU`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Notices`
--

CREATE TABLE `Notices` (
  `Id` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Text` varchar(500) NOT NULL,
  `Type` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Users`
--

CREATE TABLE `Users` (
  `Id` int(11) NOT NULL,
  `Name` varchar(25) NOT NULL,
  `Password` varchar(25) NOT NULL,
  `Profile` varchar(25) NOT NULL,
  `Employee` varchar(8) DEFAULT NULL,
  `Image` blob DEFAULT NULL,
  `CreationDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `UsersNotices`
--

CREATE TABLE `UsersNotices` (
  `Id` int(11) NOT NULL,
  `IdUser` int(11) DEFAULT NULL,
  `IdNotice` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Notices`
--
ALTER TABLE `Notices`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `UsersNotices`
--
ALTER TABLE `UsersNotices`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `usersNotices_ibfk_1` (`IdUser`),
  ADD KEY `usersNotices_ibfk_2` (`IdNotice`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Notices`
--
ALTER TABLE `Notices`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Users`
--
ALTER TABLE `Users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `UsersNotices`
--
ALTER TABLE `UsersNotices`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `UsersNotices`
--
ALTER TABLE `UsersNotices`
  ADD CONSTRAINT `usersNotices_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `Users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usersNotices_ibfk_2` FOREIGN KEY (`IdNotice`) REFERENCES `Notices` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
