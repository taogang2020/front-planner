import { extend, configure } from "vee-validate";
import { required, email, min } from "vee-validate/dist/rules";
import { i18n } from "./i18n";

configure({
  // Use custom default message handler.
  defaultMessage: (field, values) => {
    values._field_ = i18n._(`fields.${field}`);

    return i18n._(`validation.${values._rule_}`, values);
  }
});

// Install required rule and message.
extend("required", required);

// Install email rule and message.
extend("email", email);

// Install min rule and message.
extend("min", min);
