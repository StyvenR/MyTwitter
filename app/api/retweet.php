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

        $stmt = $pdo->prepare("SELECT * FROM retweet WHERE id_user = ? AND id_tweet = ?");
        $stmt->execute([$userId, $tweetId]);
        $existingRetweet = $stmt->fetch();

        if ($existingRetweet) {
            // Unretweet
            $stmt = $pdo->prepare("DELETE FROM retweet WHERE id_user = ? AND id_tweet = ?");
            $stmt->execute([$userId, $tweetId]);
            $response = ["success" => true, "message" => "Tweet unretweeted", "retweeted" => false];
        } else {
            // Retweet
            $stmt = $pdo->prepare("INSERT INTO retweet (id_user, id_tweet) VALUES (?, ?)");
            $stmt->execute([$userId, $tweetId]);
            $response = ["success" => true, "message" => "Tweet retweeted", "retweeted" => true];
        }
         // Fetch retweet_count
         $stmt = $pdo->prepare("SELECT COUNT(DISTINCT retweet.id_user) AS retweet_count FROM retweet WHERE retweet.id_tweet = ?;");
         $stmt->execute([$tweetId]);
         $newCount = $stmt->fetch(PDO::FETCH_ASSOC)['retweet_count'];
         $response['retweet_count'] = $newCount;

        echo json_encode($response);
    } else {
        echo json_encode(["success" => false, "message" => "Missing tweetId or userId"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
