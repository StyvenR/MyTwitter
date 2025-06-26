<?php

function my_connect()
{
  $host = "localhost";
  $username = "username"; // Change this to your actual username
  $password = "password"; // Change this to your actual password
  $db = "twitter";

  try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $username, $password);
  } catch (Exception $e) {

    die("Erreur : " . $e->getMessage());
  }
  return $conn;
}