<?php

require_once __DIR__ . '/config/connect_db.php';
class TweetsModel
{
  private $db;
  public function __construct()
  {
    $this->db = my_connect();
  }
  public function TLTweet()
  {
    $query = $this->db->prepare('SELECT 
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
    GROUP BY tweet.id, user.username, user.display_name, tweet.content, tweet.media1, tweet.media2, tweet.media3, tweet.media4
    ORDER BY tweet.creation_date 
    DESC LIMIT 30;');
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
  public function getLoggedUser($id_user)
  {
    $query = $this->db->prepare('SELECT * FROM user WHERE id = :id_user');
    $query->bindParam(':id_user', $id_user);
    $query->execute();
    return $query->fetch(PDO::FETCH_ASSOC);
  }
  public function getUserTweets($id_user)
  {
    $query = $this->db->prepare('SELECT * FROM tweets WHERE id_user = :id_user ORDER BY creation_date DESC');
    $query->bindParam(':id_user', $id_user);
    $query->execute();
    return $query->fetch(PDO::FETCH_ASSOC);
  }

  public function getCommentsNumber($id_tweet)
  {
    $query = $this->db->prepare('SELECT COUNT(reply_to) FROM tweet WHERE id_tweet = :id_tweet');
    $query->bindParam(':id_tweet', $id_tweet);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
  public function addTweet($id_user, $content, $media1 = null, $media2 = null, $media3 = null, $media4 = null)
  {

    switch (true) {
      case $media4 !== null:
        $query = $this->db->prepare('INSERT INTO tweet (id_user, content, media1, media2, media3, media4, creation_date) VALUES (:id_user, :content, :media1, :media2, :media3, :media4, NOW())');
        $query->bindParam(':media4', $media4);
        $query->bindParam(':media3', $media3);
        $query->bindParam(':media2', $media2);
        $query->bindParam(':media1', $media1);
        break;
      case $media3 !== null:
        $query = $this->db->prepare('INSERT INTO tweet (id_user, content, media1, media2, media3, creation_date) VALUES (:id_user, :content, :media1, :media2, :media3, NOW())');
        $query->bindParam(':media3', $media3);
        $query->bindParam(':media2', $media2);
        $query->bindParam(':media1', $media1);
        break;
      case $media2 !== null:
        $query = $this->db->prepare('INSERT INTO tweet (id_user, content, media1, media2, creation_date) VALUES (:id_user, :content, :media1, :media2, NOW())');
        $query->bindParam(':media2', $media2);
        $query->bindParam(':media1', $media1);
        break;
      case $media1 !== null:
        $query = $this->db->prepare('INSERT INTO tweet (id_user, content, media1, creation_date) VALUES (:id_user, :content, :media1, NOW())');
        $query->bindParam(':media1', $media1);
        break;
      default:
        $query = $this->db->prepare('INSERT INTO tweet (id_user, content, creation_date) VALUES (:id_user, :content, NOW())');
        break;
    }
    $query->bindParam(':id_user', $id_user);
    $query->bindParam(':content', $content);
    $query->execute();
    return $this->db->lastInsertId();
  }
  public function deleteTweet($id)
  {
    $query = $this->db->prepare('DELETE FROM tweets WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->execute();
  }
  public function updateTweet($id, $tweet)
  {
    $query = $this->db->prepare('UPDATE tweet SET content = :content WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->bindParam(':content', $tweet);
    $query->execute();
  }
  public function trending()
  {
    $query = $this->db->prepare(' SELECT COUNT(name) FROM hashtag ORDER BY creation_date DESC LIMIT 5'); // A vérifier 
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

}
switch ($_SERVER['REQUEST_METHOD']) {
  case 'POST':
    $addTweet = new TweetsModel();

     // Traitement des images téléchargées
    $media1 = $media2 = $media3 = $media4 = null;
    
    if (isset($_FILES['media']) && !empty($_FILES['media']['name'][0])) {
      $uploadDir = '../assets/medias_uploads/';
      
       // Création du répertoire de téléchargement s'il n'existe pas
      if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
      }
      
      $fileCount = count($_FILES['media']['name']);
      $fileCount = min($fileCount, 4); // Limite à 4 images
      
      for ($i = 0; $i < $fileCount; $i++) {
        if ($_FILES['media']['error'][$i] === UPLOAD_ERR_OK) {
          $tmp_name = $_FILES['media']['tmp_name'][$i];
          $name = basename($_FILES['media']['name'][$i]);
          $fileExtension = pathinfo($name, PATHINFO_EXTENSION);
          $uniqueName = uniqid() . '.' . $fileExtension;
          $uploadFile = $uploadDir . $uniqueName;
          
          if (move_uploaded_file($tmp_name, $uploadFile)) {
            $mediaPath = '../assets/medias_uploads/' . $uniqueName; // Chemin à utiliser dans la base de données
            
            // Attribution à la variable média appropriée
            if ($i === 0) $media1 = $mediaPath;
            else if ($i === 1) $media2 = $mediaPath;
            else if ($i === 2) $media3 = $mediaPath;
            else if ($i === 3) $media4 = $mediaPath;
          }
        }
      }
    }
    
    $addTweet->addTweet($_COOKIE['UserID'], $_POST['tweetPost'], $media1, $media2, $media3, $media4);

    header("Location: /app/public/timeline.html");
    break;
  case 'GET':
    header('Content-Type: application/json');
    $getTweetTL = new TweetsModel();
    $getProfileUserInfo = new TweetsModel();
    $dataTL = $getTweetTL->TLTweet();
    $dataProfile = $getProfileUserInfo->getLoggedUser($_COOKIE['UserID']);
    $data = [];
    array_push($data, $dataTL);
    array_push($data, $dataProfile);
    echo json_encode($data);
    break;
  case 'PUT':
    $updateTweet = new TweetsModel();
    $data = json_decode(file_get_contents('php://input'), true);
    $updateTweet->updateTweet($data['id'], $data['tweet']);
    break;
  case 'DELETE':
    $deleteTweet = new TweetsModel();
    $data = json_decode(file_get_contents('php://input'), true);
    $deleteTweet->deleteTweet($data['id']);
    break;
  default:
    echo json_encode(['error' => 'Method not define']);
    break;
}