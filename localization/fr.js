// French localization by Marc Friederich
// http://www.antistatique.net/

jQuery.fn.uniform.language = jQuery.extend(jQuery.fn.uniform.language, {
    required      : '%s est requis',
    req_radio     : 'Merci de choisir un élement',
    req_checkbox  : 'Vous devez cocher cette case pour continuer',
    minlength     : '%s doit contenir au moins %d caractère(s)',
    min           : '%s doit être plus grand ou égal à %d',
    maxlength     : '%s ne doit pas contenir plus de %d caractères',
    max           : '%s doit être plus petit ou égal à %d',
    same_as       : '%s doit être égal à %s',
    email         : '%s n\'est pas une adresse Email valide',
    url           : '%s n\'est pas un URL valide',
    number        : '%s needs to be a number',
    integer       : '%s doit être un nombre',
    alpha         : '%s doit uniquement contenir des lettres (ni chiffre, ni caractère spécial)',
    alphanum      : '%s doit uniquement contenir des chiffres et des lettres (sans caractère spécial)',
    phrase        : '%s doit uniquement contenir des caractères alphanumériques, espaces et : . , - _ () * # :',
    phone         : '%s doit être un numéro de téléphone',
    date          : '%s doit êtreune date au format suivant (mm/dd/yyyy)',
    callback      : 'Validation du champ %s échouée. La fonction de validation (%s) n\'est pas définie !',
    on_leave      : 'Êtes-vous sûr de vouloir quitter cette page sans envoyer le formulaire ?',
    submit_msg    : 'Navré, le formulaire doit être corrigé.',
    submit_help   : 'Merci de consulter les éléments indiqués ci-dessous.',
    submit_success: 'Merci beaucoup, le formulaire a été envoyé.'
});