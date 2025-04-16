<?php
session_start();
header('Content-Type: application/json');
require_once 'config/connect_db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (isset($data['tweetId'], $data['userId'])) {
    $tweetId = $data['tweetId'];
    $userId = $data['userId'];

    $db = my_connect();
    $pdo = $db;

    // Check si l'utilisateur a déjà liké ce tweet
    $stmt = $pdo->prepare("SELECT * FROM likes WHERE id_user = ? AND id_tweet = ?");
    $stmt->execute([$userId, $tweetId]);
    $existingLike = $stmt->fetch();

    if ($existingLike) {
      // Unlike
      $stmt = $pdo->prepare("DELETE FROM likes WHERE id_user = ? AND id_tweet = ?");
      $stmt->execute([$userId, $tweetId]);
      $response = ["success" => true, "message" => "Tweet unliked", "liked" => false];
    } else {
      // Like 
      $stmt = $pdo->prepare("INSERT INTO likes (id_user, id_tweet) VALUES (?, ?)");
      $stmt->execute([$userId, $tweetId]);
      $response = ["success" => true, "message" => "Tweet liked", "liked" => true];
    }

    // Fetch like_count
    $stmt = $pdo->prepare('SELECT COUNT(DISTINCT likes.id_user) AS like_count FROM likes WHERE likes.id_tweet = ?;');
    $stmt->execute([$tweetId]);
    $newCount = $stmt->fetch(PDO::FETCH_ASSOC)['like_count'];
    $response['like_count'] = $newCount;

    echo json_encode($response);
  } else {
    echo json_encode(["success" => false, "message" => "Missing tweetId or userId"]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>