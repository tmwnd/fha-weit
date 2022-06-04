<!-- Legen Sie eine Datei processInputs.php an -->
<?php
require './mustache.php/src/Mustache/Autoloader.php';
Mustache_Autoloader::register();

// 1. Geben Sie in der processInputs.php mit der Funktion print_r() sowohl den Inhalt des Arrays $_POST als auch den Inhalt des Arrays $_GET aus.
// 2. Kommentieren Sie zunächst die Ausgabe per print_r in der processInputs.php aus.
// print_r($_POST);
// print_r($_GET);

// print_r($_COOKIE);

// Testen Sie das Ergebnis im Browser.
// Betrachten Sie auch den "Seitenquelltext" (i.d.R. Rechtsklick --> "Seitenquelltext anzeigen"; NICHT über die Developer-Tools). Handelt es sich hierbei um eine standardkonforme HTML-Seite? -> Nein.

// Sie haben hoffentlich festgestellt, dass es sich nicht um eine standardkonforme HTML-Seite handelt -> https://weit.tmwnd.de/h03/surprised_pikachu.jpg

// Das Einbinden von Mustache in Ihrer processInputs.php erfolgt mit den folgenden Zeilen Code am Anfang der Datei:
$template  = file_get_contents("./templates/beispiel.tpl.html");
$mustache = new Mustache_Engine();

error_reporting(E_ALL);
ini_set('display_errors', 'On');

// Die Daten können per POST oder GET übertragen werden. Achten Sie also darauf, dass Ihr Code für beide Varianten funktioniert.
// Das Rendern sollte trotzdem auch noch für GET funktionieren. -> tmp array unschoen, aber ist halt php
if (!empty($_POST)){
    // Filtern Sie im Backend eingehende POST-Requests

    // Bereinigen Sie den Status serverseitig so, dass Angriffe wie Cross-Site-Scripting (Einschleusen von fremden HTML-Code) verhindert werden.
    // Benutzen Sie hierfür die Funktion filter_input in Kombination mit dem Filter FILTER_SANITIZE_FULL_SPECIAL_CHARS.
    $_POST["status"] = filter_input(INPUT_POST ,"status", FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    $tmp = $_POST;
}
else
    $tmp = $_GET;

// Eingaben sollten immer gefiltert werden.

// Stellen Sie außerdem sicher, dass die E-Mail-Adresse formal gültig ist.
// Sie können ebenfalls die Funktion filter_input nutzen. -> So wird auch GET überprüft
// Benutzen Sie als Filter diesmal FILTER_VALIDATE_EMAIL.
// Falls die Mail-Adresse ungültig ist, geben Sie eine Fehlermeldung aus.
if (!filter_var($tmp["mail"], FILTER_VALIDATE_EMAIL))
    throw new Exception("Es wurde keine gültige Mailadresse angegeben. (" . $tmp["mail"] . ")");

// Wir wollen nun das Template beispiel.tpl.html nutzen, um neben dem Titel die E-Mail, das Passwort und den Status auszugeben
echo $mustache -> render($template, array(
    'mail' => $tmp["mail"],
    'password' => $tmp["password"],
    'status' => $tmp["status"],

    'lastVisit' => $_COOKIE["lastVisit"]
));

// Testen Sie das Ergebnis im Browser. Betrachten Sie wieder den "Seitenquelltext". Handelt es sich jetzt um eine standardkonforme HTML-Seite? -> Ja.

// Geben Sie nun also mit Hilfe der Template-Engine aus, wann Sie die Seite das letzte Mal besucht haben (Uhrzeit im Format hh:mm:ss).
// Verwenden Sie hierfür Cookies.
// Wählen Sie für den Namen des Cookies "lastVisit".
setcookie("lastVisit", date("H:i:s"), time()+3600);
?>

<!-- Stylen Sie das Formular mit Bootstrap. -> (schöne) GUIs sind wirklich nicht meins, sorry -->