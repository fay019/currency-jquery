# API - Währungsrechner
beschreibt Schnittstelle Client/Server für Währungsrechner-Beispiel

## Währungen auslesen
### Request
URL: http://wifi.1av.at/currency.php
Method: GET

### Response
Format: JSON
Data:
{
    "waehrungen": ARRAY[ 
        String mit Währungscode, ...
    ]
}

## Betrag umrechnen
### Request
URL: http://wifi.1av.at/currency_calc.php
Method: POST
Data: 
    "wieviel" //Number
    "waehrung1" //String mit Währungscode - von 
    "waehrung2" //String mit Währungscode - nach

### Response
Format: TXT
Data: umgerechneter Betrag

## Flagge
### Request
URL: http://wifi.1av.at/getflag.php
Method: POST
Data: 
    "currency" //String mit Währungscode

### Response
Format: JSON
Data: 
{
    "flag": STRING/URL
}
