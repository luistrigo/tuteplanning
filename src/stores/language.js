import { defineStore } from "pinia";
import i18n from '../i18n.js';

//No need to use a store for this approach, it is used as a store for future development
export const useLanguageStore = defineStore("language", () => {

  function setLocale(locale) {
    //User selection from navigation is stored in local db
    const localLocale = localStorage.getItem("tuteplanning_locale");
    if(typeof locale === 'undefined'){
        //no user selection, gets browser locale
        locale = localLocale ? localLocale : navigator.language.split('-')[0];
        i18n.global.locale.value = locale;
        return;
    }
    //user changes locale, store it in local db
    i18n.global.locale.value = locale;
    localStorage.setItem("tuteplanning_locale", locale);
  }

  return { setLocale }


});