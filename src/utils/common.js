//日期格式化 YYYY-MM-dd
export function dateCommonFormat(dateStr){
    var date = new Date(dateStr);
    var year=date.getFullYear(),
       　　 month=date.getMonth()+1,
       　　 day=date.getDate(),
      　　  hour=date.getHours(),
      　　  min=date.getMinutes(),
      　　  sec=date.getSeconds();
  　　  var newDate=year+'-'+
      　　  (month<10?'0'+month:month)+'-'+
     　　   (day<10?'0'+day:day);
  　　  return newDate;
}
export function moneyFormat(cellValue) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    if (cellValue == null) return 0;
    var mn = (cellValue + "").replace(reg, "$&,");
    if (!mn.includes(".")) mn += ".00";
    return mn;
  }