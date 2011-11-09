// Finnish Localization by Petri Savolainen
// petri.savolainen@koodaamo.fi

jQuery.fn.uniform.language = jQuery.extend(jQuery.fn.uniform.language, {
    required      : '%s on pakollinen tieto',
    req_radio     : 'Valitse jokin vaihtoehdoista',
    req_checkbox  : 'Rastita valintaruutu jatkaaksesi',
    minlength     : '%sn minimipituus on %d merkkiä',
    min           : '%sn tulee olla %d tai enemmän',
    maxlength     : '%sn enimmäispituus on %d merkkiä',
    max           : '%sn tulee olla %d tai vähemmän',
    same_as       : '%sn tulee olla yhtä kuin %s',
    email         : 'annettu sähköpostiosoite on virheellinen',
    url           : '%s ei ole www-osoite (URL)',
    number        : '%sn tulee olla numero',
    integer       : '%sn on oltava kokonaisnumero',
    alpha         : '%s voi sisältää vain kirjaimia, numerot ja erikoismerkit poislukien',
    alphanum      : '%s voi sisältää vain kirjaimia tai numeroita (ei erikoismerkkejä)',
    phrase        : '%s voi sisältää vain kirjaimia, numeroita, välilyöntejä ja joitain näistä: . , - _ () * # :',
    phone         : '%sn tulee olla puhelinnumero',
    date          : '%sn tulee olla päivämäärä (dd/mm/vvvv)',
    callback      : '%sn tarkistus epäonnistui. Tarkistinta (%s) ei ole määritelty!',
    on_leave      : 'Oletko varma että haluat poistua lomakkeesta tallentamatta sitä?',
    submit_msg    : 'Ole hyvä, ja korjaa lomakkeen virheet jatkaaksesi',
    submit_help   : 'Lomakkeen virheelliset kohdat on esitetty korostettuina',
    submit_success: 'Kiitos, lomake on nyt lähetetty.'
});
