<?php

require_once __DIR__ . '/config/connect_db.php';
header('Content-Type: application/json');

class ProfileModel
{
  private $db;
  public function __construct()
  {
    $this->db = my_connect();
  }
  public function getTweetFromUser($id_user)
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
    WHERE user.id = :id_user
    GROUP BY tweet.id, user.username, user.display_name, tweet.content 
    ORDER BY tweet.creation_date 
    DESC LIMIT 30;');
    $query->bindParam(':id_user', $id_user);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
  public function TweetLiked($id_user = 1)
  {
    $query = $this->db->prepare(
      'SELECT 
    tweet.id,
    tweet.content,
    tweet.media1,
    tweet.media2,
    tweet.media3,
    tweet.media4, 
    user.username, 
    user.display_name, 
    COUNT(DISTINCT likes_all.id_user) AS like_count, 
    COUNT(DISTINCT retweet.id_tweet) AS retweet_count,
    tweet.creation_date
    FROM likes 
    JOIN tweet ON likes.id_tweet = tweet.id
    JOIN user ON tweet.id_user = user.id
    LEFT JOIN likes AS likes_all ON likes_all.id_tweet = tweet.id
    LEFT JOIN retweet ON retweet.id_tweet = tweet.id
    WHERE likes.id_user = :id_user
    GROUP BY tweet.id, user.username, user.display_name, tweet.content, tweet.creation_date
    ORDER BY tweet.creation_date DESC
    LIMIT 30;
'
    );
    $query->bindParam(':id_user', $id_user);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function TweetMedia($id_user)
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
    COUNT(DISTINCT retweet.id_tweet) AS retweet_count,
    tweet.creation_date
    FROM tweet
    JOIN user ON tweet.id_user = user.id
    LEFT JOIN likes ON likes.id_tweet = tweet.id
    LEFT JOIN retweet ON retweet.id_tweet = tweet.id
    WHERE user.id = :id_user
    AND (tweet.media1 IS NOT NULL OR tweet.media2 IS NOT NULL OR tweet.media3 IS NOT NULL OR tweet.media4 IS NOT NULL)
    GROUP BY tweet.id, user.username, user.display_name, tweet.content, tweet.creation_date
    ORDER BY tweet.creation_date DESC
    LIMIT 30;');
    $query->bindParam(':id_user', $id_user);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function updateProfile($id, $birthdate, $display_name, $biography, $city, $country, $url)
  {
    $query = $this->db->prepare('UPDATE user SET birthdate = :birthdate, display_name = :display_name, biography = :biography, city = :city, country = :country, url = :url WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->bindParam(':birthdate', $birthdate);
    $query->bindParam(':display_name', $display_name);
    $query->bindParam(':biography', $biography);
    $query->bindParam(':city', $city);
    $query->bindParam(':country', $country);
    $query->bindParam(':url', $url);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getCommentsNumber($id_tweet)
  {
    $query = $this->db->prepare('SELECT COUNT(reply_to) FROM tweet WHERE id_tweet = :id_tweet');
    $query->bindParam(':id_tweet', $id_tweet);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
  public function deleteTweet($id)
  {
    $query = $this->db->prepare('DELETE FROM tweets WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->execute();
  }
  public function getUserInfo($id_user)
  {
    $query = $this->db->prepare('SELECT * FROM user WHERE id = :id_user');
    $query->bindParam(':id_user', $id_user);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
  public function updateTweet($id, $tweet)
  {
    $query = $this->db->prepare('UPDATE tweet SET content = :content WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->bindParam(':content', $tweet);
    $query->execute();
  }

  public function updateProfilePicture($id_user, $file)
{
  // Create upload directory if it doesn't exist
  $uploadDir = __DIR__ . '/../assets/profile_pictures/';
  if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
  }
  
  // Generate a unique filename
  $filename = $id_user . '_' . time() . '_' . basename($file['name']);
  $targetFile = $uploadDir . $filename;
  
  // Check if file is an actual image
  $check = getimagesize($file['tmp_name']);
  if($check === false) {
    return ["success" => false, "message" => "File is not an image."];
  }
  
  // Check file size (limit to 5MB)
  if ($file['size'] > 5000000) {
    return ["success" => false, "message" => "File is too large."];
  }
  
  // Allow certain file formats
  $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
    return ["success" => false, "message" => "Only JPG, JPEG, PNG & GIF files are allowed."];
  }
  
  // Upload file
  if (move_uploaded_file($file['tmp_name'], $targetFile)) {
    // Update user profile with new image path
    $relativePath = '/assets/profile_pictures/' . $filename;
    $query = $this->db->prepare('UPDATE user SET picture = :picture WHERE id = :id');
    $query->bindParam(':id', $id_user);
    $query->bindParam(':picture', $relativePath);
    $query->execute();
    return ["success" => true, "path" => $relativePath];
  } else {
    return ["success" => false, "message" => "There was an error uploading your file."];
  }
}

public function updateHeaderPicture($id_user, $file)
{
  // Create upload directory if it doesn't exist
  $uploadDir = __DIR__ . '/../assets/header_pictures/';
  if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
  }
  
  // Generate a unique filename
  $filename = $id_user . '_' . time() . '_' . basename($file['name']);
  $targetFile = $uploadDir . $filename;
  
  // Check if file is an actual image
  $check = getimagesize($file['tmp_name']);
  if($check === false) {
    return ["success" => false, "message" => "File is not an image."];
  }
  
  // Check file size (limit to 5MB)
  if ($file['size'] > 5000000) {
    return ["success" => false, "message" => "File is too large."];
  }
  
  // Allow certain file formats
  $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
    return ["success" => false, "message" => "Only JPG, JPEG, PNG & GIF files are allowed."];
  }
  
  // Upload file
  if (move_uploaded_file($file['tmp_name'], $targetFile)) {
    // Update user profile with new image path
    $relativePath = '/assets/header_pictures/' . $filename;
    $query = $this->db->prepare('UPDATE user SET header = :header WHERE id = :id');
    $query->bindParam(':id', $id_user);
    $query->bindParam(':header', $relativePath);
    $query->execute();
    return ["success" => true, "path" => $relativePath];
  } else {
    return ["success" => false, "message" => "There was an error uploading your file."];
  }
}
}



switch ($_SERVER['REQUEST_METHOD']) {
  case 'POST':
    $updateProfile = new ProfileModel();
  
  // Handle profile picture upload if a file is provided
  if(isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === 0) {
    $result = $updateProfile->updateProfilePicture($_COOKIE['UserID'], $_FILES['profilePicture']);
    
    // If only uploading profile picture without other form fields
    if(empty($_POST['display_name']) && empty($_POST['biography'])) {
      echo json_encode($result);
      exit;
    }
  }

  if(isset($_FILES['headerPicture']) && $_FILES['headerPicture']['error'] === 0) {
    $result = $updateProfile->updateHeaderPicture($_COOKIE['UserID'], $_FILES['headerPicture']);
    
    // If only uploading profile picture without other form fields
    if(empty($_POST['display_name']) && empty($_POST['biography'])) {
      echo json_encode($result);
      exit;
    }
  }
    $updateProfile->updateProfile($_COOKIE['UserID'], $_POST['birthdate'], $_POST['display_name'], $_POST['biography'], $_POST['city'], $_POST['country'], $_POST['url']);
    var_dump("test");
    header("Location: /app/public/profile.html");
    break;
  case 'GET':
    $getTweetUser = new ProfileModel();
    $dataTweetUser = $getTweetUser->getTweetFromUser($_COOKIE['UserID']);

    $getTweetUserLike = new ProfileModel();
    $dataTweetUserLike = $getTweetUserLike->TweetLiked($_COOKIE['UserID']);

    $getTweetUserMedia = new ProfileModel();
    $dataTweetUserMedia = $getTweetUserMedia->TweetMedia($_COOKIE['UserID']);

    $getProfileUserInfo = new ProfileModel();
    $dataUserProfileInfo = $getProfileUserInfo->getUserInfo($_COOKIE['UserID']);

    $dataProfile = [];
    array_push($dataProfile, $dataTweetUser);
    array_push($dataProfile, $dataTweetUserLike);
    array_push($dataProfile, $dataTweetUserMedia);
    array_push($dataProfile, $dataUserProfileInfo);
    echo json_encode($dataProfile);
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