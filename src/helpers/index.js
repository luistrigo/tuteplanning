

export const getCardsTypes = () => {
  return {
    tshirt: {
      title: 'T-Shirt',
      values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "?"]
    },
    fibonacci: {
      title: 'Fibonacci',
      values: ["1", "2", "3", "5", "8", "13", "21","34", "99", "?"]
    }
  }
}

export const todayFormat = () =>{
  var date = new Date();
  return date.getFullYear() + "-" + 
  ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
  ("00" + date.getDate()).slice(-2) + " " +
  ("00" + date.getHours()).slice(-2) + ":" +
  ("00" + date.getMinutes()).slice(-2) + ":" +
  ("00" + date.getSeconds()).slice(-2);
}