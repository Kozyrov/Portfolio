<?php

error_reporting(E_ALL);

// Check for empty fields
if(empty($_POST['name'])      ||
   empty($_POST['email'])     ||
   empty($_POST['phone'])     ||
   empty($_POST['message'])   ||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
   echo "Missing one or more arguments!";
   return false;
   }
   
$name = strip_tags(htmlspecialchars($_POST['name']));
$email_address = strip_tags(htmlspecialchars($_POST['email']));
$phone = strip_tags(htmlspecialchars($_POST['phone']));
$message = strip_tags(htmlspecialchars($_POST['message']));

require_once('contact_config.php');
require('phpmailer/PHPMailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->SMTPDebug = 0;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication


$mail->Username = EMAIL_USER;                 // SMTP username
$mail->Password = EMAIL_PASS;                 // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to
$options = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);
$mail->smtpConnect($options);
$mail->From = 'sgfrankenfield@gmail.com';//your email sending account
$mail->FromName = 'Steven G. Frankenfield';//your email sending account name
$mail->addAddress('sfrankie11@gmail.com', 'Steven Frankenfield');     // Add a recipient
$mail->addReplyTo($email_address, $name);
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Portfolio Inquiry from:'.' '.$name;
$mail->Body    = $message."/n".$phone;
$output = [
  'success'=>false
];
if(!$mail->send()) {
    
    $output['error'] = $mail->ErrorInfo;
} else {
    $output['success']=true;
}
print(json_encode($output));
?>
