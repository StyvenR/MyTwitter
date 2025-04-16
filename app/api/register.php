<?php
require_once __DIR__ . '/config/connect_db.php';
class RegisterModel
{
    public $pdo;

    public function __construct()
    {
        $this->pdo = my_connect();
    }

    public function inscription($firstname, $lastname, $username, $email, $password, $birthdate)
    {
        $query = $this->pdo->prepare("INSERT INTO user (firstname, lastname, username, email, `password`, birthdate, creation_date) VALUES (:prenom, :nom, :pseudo, :email, :mot_de_passe, :date_naissance, NOW())");
        $query->bindParam(':prenom', $firstname);
        $query->bindParam(':nom', $lastname);
        $query->bindParam(':pseudo', $username);
        $query->bindParam(':date_naissance', $birthdate);
        $query->bindParam(':email', $email);
        $hash = hash('ripemd160', $password);
        $query->bindParam(':mot_de_passe', $hash);
        $query->execute();
        return $query->fetch(PDO::FETCH_ASSOC);
    }
}

class registerController
{
    public $addModel;

    public function __construct()
    {
        $this->addModel = new RegisterModel;
    }


    function age($birthdate)
    {
        $birthDate = new DateTime($birthdate);
        $currentDate = new DateTime();
        $age = $currentDate->diff($birthDate)->y;
        return $age;
    }

    public function adduser($firstname, $lastname, $username, $email, $password, $birthdate, $check)
    {
        if ($this->age($birthdate) >= 13 && $password === $check) {

            $user = $this->addModel->inscription($firstname, $lastname, $username, $email, $password, $birthdate);
            var_dump($user);
            return;
        }

        $error = ($this->age($birthdate) < 18) ? "age" : "password";
        header("Location: /public/register.html?error=$error");
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $birthdate = $_POST['birthdate'];
    $check = $_POST['check'];
    // var_dump(print_r($data, true));
    $addUser = new registerController();
    $addUser->adduser($firstname, $lastname, $username, $email, $password, $birthdate, $check);
    header("Location: /app/public/login.html");
} else {
    var_dump("b");
    echo json_encode(['status' => 'error', 'message' => 'Lastname not provided']);
}