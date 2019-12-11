//验证手机号
export function validMobileNo(value) {
  if (/^(13|14|15|16|17|18|19)[0-9]{9}$/.test(value) == false) {
    return false;
  } else {
    return true;
  }
}

//验证身份证
export function validIdCard(value) {
  if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) == false) {
    return false;
  } else {
    return true;
  }
}

//验证登录名
export function validLoginName(value) {
  if (/^[a-zA-Z]([_a-zA-Z0-9]+)$/.test(value) == false) {
    return false;
  } else {
    return true;
  }
}

//验证登录密码
export function validLoginPassword(value) {
  if (/^([_a-zA-Z0-9]+)$/.test(value) == false) {
    return false;
  } else {
    return true;
  }
}