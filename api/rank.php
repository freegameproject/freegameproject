<?php
//session_start();
include 'header_js.php';
//include 'request_safe.php';
include 'conn.php';
$score=$_GET["score"];
$score= intval($score,10);

$game_id=$_GET['game_id'];
$game_id= intval($game_id,10);

$sql="INSERT INTO  `ranks` (`id` ,`game_id` ,`score`,`ip`,`ua`)VALUES (NULL ,  '$game_id',  '$score','$ip','$ua');";

mysql_query($sql);

$this_id=mysql_insert_id();

$result=mysql_query("SELECT * FROM  `ranks` order by `score` desc LIMIT 0 , 1");
$first=0;

if($row = mysql_fetch_array($result)){
	$first=$row['score'];
        
}else{
	echo 'error code #5012';
	exit;
}
$rank_sql="SELECT id,score,(SELECT COUNT( 1 ) FROM ranks WHERE score >= ( SELECT score FROM ranks
WHERE id =$this_id and game_id=$game_id ORDER BY score DESC LIMIT 1 )) AS rank FROM ranks WHERE id =$this_id and game_id=$game_id";

//echo $rank_sql;
$result=mysql_query($rank_sql);
if($row = mysql_fetch_array($result)){
	$cb=$_GET['cb'];
$r_id=$row['id'];
$r_rank=$row['rank'];
        echo "$cb({score:$score,rank:$r_rank,first_score:$first})";
}else{
	echo 'error code #5012';
	exit;
}
?>