// Dutch localization by Roy Lodder
// http://roylodder.com/

jQuery.fn.uniform.language = jQuery.extend(jQuery.fn.uniform.language, {
    required      : '%s is een verplicht veld',
    req_radio     : 'Maak een selectie',
    req_checkbox  : 'U moet dit selectievakje aanvinken om door te gaan',
    //req_checkbox  : 'Maak een selectie', Alternatief
    minlength     : '%s moet minimaal %d tekens lang zijn',
    min           : '%s moet groter dan of gelijk aan %d zijn',
    maxlength     : '%s mag niet langer als %d karakters zijn',
    max           : '%s moet kleiner dan of gelijk aan %d zijn',
    same_as       : '%s moet gelijk aan %s zijn',
    email         : '%s is geen geldig e-mailadres',
    url           : '%s is geen geldige URL',
    number        : '%s moet een geldig getal zijn',
    integer       : '%s moet een geheel getal zijn',
    alpha         : '%s mag alleen letters bevatten (zonder speciale tekens of nummers)',
    alphanum      : '%s mag alleen cijfers en letters bevatten (zonder speciale tekens)',
    phrase        : '%s mag alleen letters, cijfers, spaties en de volgende tekens bevatten: . , - _ () * # :',
    phone         : '%s dient een telefoonnummer te zijn',
    date          : '%s moet een datum zijn (mm/dd/jjjj)',
    callback      : 'Kon veld %s niet valideren. Validator functie (%s) is niet gedefinieerd!',
    on_leave      : 'Weet u zeker dat u deze pagina wilt verlaten zonder het formulier te versturen?',
    submit_msg    : 'Sorry, niet alle velden zijn goed ingevuld.',
    submit_help   : 'Zie de gemarkeerde items hieronder.',
    submit_success: 'Dank u, het formulier is succesvol verzonden.'
});