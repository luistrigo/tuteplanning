export const getLastVote = (storyId) => {
  const jsonValue = JSON.parse(localStorage.getItem("tuteplanning"))
  if (typeof jsonValue !== 'undefined' && typeof jsonValue.lastVote !== 'undefined') {
    if (jsonValue.lastVote.storyId === storyId) {
      return jsonValue.lastVote.points ? jsonValue.lastVote.points : 0
    }
  }
  return ""
}

export const getCardsTypes = () => {
  return {
    tshirt: {
      title: 'T-Shirt',
      values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
    },
    fibonacci: {
      title: 'Fibonacci',
      values: ["1", "2", "3", "5", "8", "13", "23", "99", "?"]
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