<?php

function my_connect()
{
  $host = "localhost";
  $username = "styven";
  $password = "styven.raya2004";
  $db = "twitter";

  try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $username, $password);
  } catch (Exception $e) {

    die("Erreur : " . $e->getMessage());
  }
  return $conn;
}