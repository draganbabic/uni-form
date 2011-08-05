// Danish Localization by Christian Dalager
// http://eksponent.com

jQuery.fn.uniform.language = jQuery.extend(jQuery.fn.uniform.language, {
    required      : '%s er krævet',
    req_radio     : 'Vælg en værdi',
    req_checkbox  : 'Du skal krydse et af felterne af for at kunne fortsætte',
    minlength     : '%s skal være mindst %d langt',
    min           : '%s skal være større end eller lig med %d',
    maxlength     : '%s må ikke være længere end %d tegn',
    max           : '%s skal være mindre eller lig med %d',
    same_as       : '%s skal være det samme som %s',
    email         : '%s er ikke gyldig email-adresse',
    url           : '%s er ikke en gyldig URL',
    number        : '%s skal være et et gyldigt tal',
    integer       : '%s skal være et heltal',
    alpha         : '%s må kun indeholde bogstaver (ingen tal eller specialtegn)',
    alphanum      : '%s må kun indeholde tal og bogstaver (ingen specialtegn)',
    phrase        : '%s må kun indeholde bogstaver, tal, mellemrum og disse specialtegn: . , - _ () * # :',
    phone         : '%s skal være et telefonnummer',
    date          : '%s skal være en dato (dd/mm/åååå)',
    callback      : 'Fejl ved validering af %s. Validator Funktion (%s) er ikke defineret!',
    on_leave      : 'Er du sikker på at du vil forlade denne side uden at gemme dine data?',
    submit_msg    : 'Undskyld, men du skal rette fejlene i formularen for at fortsætte',
    submit_help   : 'Bemærk de markerede elementer for at se, hvor fejlen er i formen.',
    submit_success: 'Tak, formularen er sendt.'
});