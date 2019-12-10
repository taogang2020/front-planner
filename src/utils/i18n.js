import en from "vee-validate/dist/locale/en.json";
import zh_CN from 'vee-validate/dist/locale/zh_CN.json';
import { setupI18n } from "@lingui/core";

// https://lingui.js.org/ref/core.html
const i18n = setupI18n({
  language: "zh_CN",
  catalogs: {
    zh_CN: {
      messages: {
        "validation.required": zh_CN.messages.required,
        "validation.email": zh_CN.messages.email,
        "validation.min": zh_CN.messages.min,
        "fields.email": "邮箱",
        "fields.password": "密码"
      }
    }
  }
});

export { i18n };
