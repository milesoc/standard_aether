// Initialize StackMob object
// Copy your init data from here: https://dashboard.stackmob.com/sdks/js/config
// Your other app information is here: https://dashboard.stackmob.com/settings
StackMob.init({
  appName: 'standardaether',
  clientSubdomain: 'milesoc',
  publicKey: 'cc2e7727-45bf-4e18-80db-2a285f344fd2',
  apiVersion : 1
});

var Market = StackMob.Model.extend({
  schemaName: 'market'
});

var Price = StackMob.Model.extend({
  schemaName: 'price' 
});

var Character = StackMob.Model.extend({
  schemaName: 'character'
})

var ActiveMarket = StackMob.Model.extend({
  schemaName: 'active_market'
})

function checkLogin() {
  //redirect to login if not logged in
  StackMob.isLoggedIn({
    yes: function(username) {
      console.log(username + " is logged in.");
    },
    no: function() {
      window.location("../");
    },
    error: function() {
      window.location("../");
    }
  })
}

function getNumber(str) {
  return parseInt(str.replace(/\,/g,''))
}

function populate(tableBodyId, method, idToPass, linkUrl, cells, updateFn) {
  var params = {}
  if (idToPass != null)
    params = {'id': idToPass}
  //retrieve the markets
  StackMob.customcode(method,
    params,
    'GET',
    {success: function(result) {
      var oldBody = document.getElementById(tableBodyId)
      var newBody = document.createElement('tbody')
      var objects = result.result

      for(var objectsIndex = 0; objectsIndex < objects.length; objectsIndex++) {
        var obj = objects[objectsIndex]
        row = newBody.insertRow(-1)
        row.id = obj.id+"row"

        for(var cellsIndex = 0; cellsIndex < cells.length; cellsIndex++) {
          var newCell = row.insertCell(-1)
          var cellName = cells[cellsIndex].name
          var cellType = cells[cellsIndex].type
          var cellValue = obj[cellName]
          switch(cellType) {
            case 'link':
              var link = document.createElement('a')
              link.title = cellValue
              link.innerHTML = link.title
              link.href = linkUrl + "?id=" + obj.id
              newCell.appendChild(link)
              break;
            case 'text': 
              var textNode = document.createTextNode(cellValue)
              newCell.appendChild(textNode)
              break;
            case 'number': 
              var textNode = document.createTextNode((cellValue).toLocaleString())
              newCell.appendChild(textNode)
              break;
            case 'trend':
              var trend = document.createTextNode((cellValue).toLocaleString())
              if (cellValue > 0)
                newCell.className = "positive"
              else if (cellValue < 0)
                newCell.className = "negative"
              newCell.appendChild(trend)
              break;
            case 'input':
              var input = document.createElement("input")
              input.setAttribute("value", cellValue.toLocaleString())
              input.id = obj.id+cellName
              newCell.appendChild(input)
              break;
            default:
              break;
          }
        }
        var buttonCell = row.insertCell(-1)
        var button = document.createElement("span")
        var txt = document.createTextNode("Update")
        button.appendChild(txt)
        button.className = "button"
        button.onclick = function(fn, id) {
          return function() {
            fn(id)
          }
        } (updateFn, obj.id)
        buttonCell.appendChild(button)
      }
      oldBody.parentNode.replaceChild(newBody, oldBody)
      newBody.id = tableBodyId
    }});
}

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
function getParameterByName( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function netWorth() {
  StackMob.customcode("net_worth",
    {},
    'GET',
    {success: function(result) {
      var netWorth = (Math.floor(result.worth/10000)/100)
      document.getElementById("net_worth").innerHTML = netWorth.toLocaleString()+" Million"
      var liquidity = Math.floor(100*result.money/result.worth)
      var liqTd = document.getElementById("liquidity")
      if (liquidity >= 30)
        liqTd.className = "good_net_worth"
      else if (liquidity >= 15)
        liqTd.className = "med_net_worth"
      else
        liqTd.className = "bad_net_worth"
      liqTd.innerHTML = liquidity + "%"
    }})
}
