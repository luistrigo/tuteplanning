

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

//example configOrder = [{field1: 'asc'},{field2:'desc'}]
export const helperOrderBy = (data, configOrder) => {
  configOrder = Array.isArray(configOrder) ? configOrder : [configOrder];
        return data.sort(([kA,a],[kB,b]) => {
            for (let i = 0, size = configOrder.length; i < size; i++) {
                const key = Object.keys(configOrder[i])[0],
                    o = configOrder[i][key],
                    valueA = key === 'name' ? kA: a[key],
                    valueB = key === 'name' ? kB: b[key];
                if ((typeof valueA === 'undefined' || typeof valueB === 'undefined')) {
                    console.error("Data passed does not have the key '" + key + "' passed on sort!");
                    return [];
                }
                if (+valueA === +valueA) {
                    return o.toLowerCase() === 'desc' ? valueB - valueA : valueA - valueB;
                } else {
                    if (valueA.localeCompare(valueB) > 0) {
                        return o.toLowerCase() === 'desc' ? -1 : 1;
                    } else if (valueA.localeCompare(valueB) < 0) {
                        return o.toLowerCase() === 'desc' ? 1 : -1;
                    }
                }
            }
    })
}