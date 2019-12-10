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