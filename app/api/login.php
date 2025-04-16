<?php

header('Content-Type: application/json');
require_once 'config/connect_db.php';


$conn = my_connect();
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];


    if ($conn) {
        $stmt = $conn->prepare("SELECT * FROM user WHERE username = :username AND password = :password");
        $stmt->bindParam(':username', $username);
        $hashed = hash("ripemd160", $password);
        $stmt->bindParam(':password', $hashed);
        $stmt->execute();
        $rep = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($rep && $rep["id"] != false) {
            setcookie("UserID", $rep["id"], time() + 36000, "/");
            header("Location: /app/public/timeline.html");
        }
    } else {
        echo "Invalid username or password";
        header("Location: /app/public/login.html");

    }

}


?>