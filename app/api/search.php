<?php
require_once __DIR__ . '/config/connect_db.php'; 
header('Content-Type: application/json');

$db = my_connect(); 
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $jsonData = file_get_contents('php://input');

  $data = json_decode($jsonData, true);

  $searchTerm = $data['searchTerm'] ?? '';
  $searchType = $data['searchType'] ?? 'content';
  if (empty($searchTerm)) {
    echo json_encode([]);
    exit;
  }

  $sql = "SELECT 
    tweet.id,
    tweet.content, 
    tweet.media1,
    tweet.media2,
    tweet.media3,
    tweet.media4,
    user.username, 
    user.display_name, 
    COUNT(DISTINCT likes.id_user) AS like_count, 
    COUNT(DISTINCT retweet.id_tweet) AS retweet_count
    FROM tweet
    JOIN user ON tweet.id_user = user.id
    LEFT JOIN likes ON likes.id_tweet = tweet.id
    LEFT JOIN retweet ON retweet.id_tweet = tweet.id
    WHERE ";

  switch ($searchType) {
    case 'hashtag':
      $searchTerm = ltrim($searchTerm, '#');
      $sql .= "tweet.content LIKE :searchTerm";
      $searchTerm = "%#" . $searchTerm . "%";
      break;
    case 'user':
      $sql .= "(user.username LIKE :searchTerm OR user.display_name LIKE :searchTerm)";
      $searchTerm = "%" . $searchTerm . "%";
      break;
    default: // content
      $sql .= "tweet.content LIKE :searchTerm";
      $searchTerm = "%" . $searchTerm . "%";
      break;
  }

  $sql .= " 
    GROUP BY tweet.id, user.username, user.display_name, tweet.content, tweet.media1, tweet.media2, tweet.media3, tweet.media4
    ORDER BY tweet.creation_date DESC";

  $stmt = $db->prepare($sql);
  $stmt->bindParam(':searchTerm', $searchTerm);
  $stmt->execute();

  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $response = $results;
}
echo json_encode($response);
?>