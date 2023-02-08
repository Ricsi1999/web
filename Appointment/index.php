<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nemzeti Koronavírus Depó</title>
</head>
<body>
    <h1>Nemzeti Koronavírus Depó</h1>
    <h2>NemKoViD - Mondjon nemet a koronavírusra! Védőoltást ezen az oldalon online tud igényelni. Időpont foglaláshoz jelentkezzen be vagy regisztráljon!</h2>

    <?php
        $active = json_decode(file_get_contents('active.json'));
        $isloggedin = $active->isloggedin;
        $activemonth = $active->activemonth;
    ?>

    <?php if($isloggedin): ?>
        <button onclick='window.location.href="index.php?method=logout";'>Kijelentkezés</button>
        <?php
            $activeemail = $active->activeemail;
            $activename = $active->activename;

            if(isset($_GET["method"])) {
                if($_GET["method"] == "logout") {
                    $offlineuser = array(
                        "isloggedin" => 0,
                        "activeemail" => "",
                        "activename" => "",
                        "activemonth" => "Január"
                    );
                    file_put_contents("active.json", json_encode($offlineuser, JSON_PRETTY_PRINT));
                    header("Location: index.php");
                }
            }
        ?>
        
    <?php else: ?>
        <button onclick='window.location.href="index.php?method=login";'>Belépés</button>
        <button onclick='window.location.href="index.php?method=register";'>Regisztráció</button><br><br>
        <?php if(isset($_GET["method"])): ?>
            <?php if($_GET["method"] == "login"): ?>
                <?php if(isset($_GET["success"])): ?>
                    <a>Sikeres regisztráció. Jelentkezzen be!</a><br><br>
                <?php endif ?>
                <form method="post" action="<?php $_PHP_SELF ?>" novalidate>
                    <a>E-mail: </a><input type="text" name="l_email">
                    <a>Jelszó: </a><input type="password" name="pw">
                    <input type="submit" name="login" value="Belépés">
                </form>
            <?php elseif($_GET["method"] == "register"): ?>
                <form method="post" action="<?php $_PHP_SELF ?>" novalidate>
                    <a>Vezetéknév: </a><input type="text" name="lastname" value="<?php if(isset($_POST["lastname"])){ echo $_POST["lastname"]; } ?>">
                    <a>Keresztnév: </a><input type="text" name="firstname" value="<?php if(isset($_POST["firstname"])){ echo $_POST["firstname"]; } ?>"><br><br>
                    <a>TAJ szám: </a><input type="number" name="taj" value="<?php if(isset($_POST["taj"])){ echo $_POST["taj"]; } ?>"><br><br>
                    <a>Értesítési cím: </a><input type="text" name="address" value="<?php if(isset($_POST["address"])){ echo $_POST["address"]; } ?>"><br><br>
                    <a>E-mail cím: </a><input type="email" name="email" value="<?php if(isset($_POST["email"])){ echo $_POST["email"]; } ?>"><br><br>
                    <a>Jelszó: </a><input type="password" name="pw1">
                    <a>Jelszó megerősítése: </a><input type="password" name="pw2"><br><br>
                    <input type="submit" name="register" value="Regisztrálás">
                </form><br>
            <?php endif ?>
        <?php endif ?>
    <?php endif ?>

    <?php
        if(isset($_POST["register"])) {
            if($_POST["lastname"] != "" && $_POST["firstname"] != "") {
                if(ctype_digit($_POST["taj"]) && $_POST["taj"] > 99999999 && $_POST["taj"] < 1000000000) {
                    if($_POST["address"] != "") {
                        if(filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
                            if($_POST["pw1"] != "" && $_POST["pw2"] != "" && $_POST["pw1"] == $_POST["pw1"]) {
                                $users = json_decode(file_get_contents('users.json'));
                                if(isset($users)) {
                                    $exist = false;
                                    foreach($users as $user) {
                                        if($user->email == $_POST["email"]) {
                                            $exist = true;
                                            break;
                                        }
                                    }

                                    if($exist) {
                                        echo '<a>Ezzel az e-mail címmel már regisztráltak!</a>';
                                    }
                                    else {
                                        $newuser = array(
                                            "name" => $_POST["lastname"].' '.$_POST["firstname"],
                                            "taj" => intval($_POST["taj"]),
                                            "address" => $_POST["address"],
                                            "email" => $_POST["email"],
                                            "password" => password_hash($_POST["pw1"], PASSWORD_DEFAULT)
                                        );
                                        $users[] = $newuser;
                                        file_put_contents("users.json", json_encode($users, JSON_PRETTY_PRINT));
                                        header("Location: index.php?method=login&success");
                                    }
                                }
                                else {
                                    $newuser = array(
                                        "name" => $_POST["lastname"].' '.$_POST["firstname"],
                                        "taj" => intval($_POST["taj"]),
                                        "address" => $_POST["address"],
                                        "email" => $_POST["email"],
                                        "password" => password_hash($_POST["pw1"], PASSWORD_DEFAULT)
                                    );
                                    $users[] = $newuser;
                                    file_put_contents("users.json", json_encode($users, JSON_PRETTY_PRINT));
                                    header("Location: index.php?method=login&success");
                                }
                            }
                            else {
                                echo '<a>A jelszó mezők üresek, vagy nem egyeznek!</a>';
                            }
                        }
                        else {
                            echo '<a>Invalid e-mail cím!</a>';
                        }
                    }
                    else {
                        echo '<a>Üresen hagyott cím!</a>';
                    }
                }
                else {
                    echo '<a>Hibás TAJ szám!</a>';
                }
            }
            else {
                echo '<a>Hibásan kitöltött nevek!</a>';
            }
        }

        if(isset($_POST["login"])) {
            if($_POST["l_email"] != "" && $_POST["pw"] != "") {
                $users = json_decode(file_get_contents('users.json'));
                $exist = false;
                foreach($users as $user) {
                    if($user->email == $_POST["l_email"]) {
                        $exist = true;
                        if(password_verify($_POST["pw"], $user->password)) {
                            $activeuser = array(
                                "isloggedin" => 1,
                                "activeemail" => $user->email,
                                "activename" => $user->name,
                                "activemonth" => "Január"
                            );
                            file_put_contents("active.json", json_encode($activeuser, JSON_PRETTY_PRINT));
                            header("Location: index.php");
                        }
                        else {
                            echo '<a>Hibás jelszó!</a>';
                        }
                        break;
                    }
                }
                if(!$exist) {
                    echo '<a>Ezzel az e-mail címmel nem regisztráltak!</a>';
                }
            }
            else {
                echo '<a>Üresen hagyott mező(k)!</a>';
            }
        }
    ?>

    <?php $appointments = json_decode(file_get_contents('appointments.json')); ?>
    <?php if(isset($appointments)): ?>
        <br><h2>Időpontok (<?= $activemonth ?>):</h2>
        <table>
            <tr>
                <td><a>Nap</a></td>
                <td><a>Óra</a></td>
                <td><a>Helyek</a></td>
            </tr>
            <?php foreach($appointments as $a): ?>
                <tr>
                    <?php if(): ?>
                        <td><a><?= $a->day ?>.</a></td>
                        <td><a><?= $a->hour ?>:00</a></td>
                        <?php if(count($a->patients) < 5): ?>
                            <td><a style="color:green"><?= count($a->patients) ?>/5</a></td>
                        <?php else: ?>
                            <td><a style="color:red">5/5</a></td>
                        <?php endif ?>
                        <?php if($isloggedin): ?>
                            <td><a href="index.php?apply=">JELENTKEZÉS</a></td>
                        <?php endif ?>
                    <?php endif ?>
                </tr>
            <?php endforeach ?>
        </table>
    <?php endif ?>

    <style>
        h1 {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 40px;
        }

        h2 {
            font-family: Trebuchet MS;
            font-size: 25px;
        }

        table, th, td {
            border: 1px solid black;
            text-align: center;
            vertical-align: middle;
        }

        a {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px;
        }
    </style>

    
    
</body>
</html>