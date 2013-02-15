// Initialize StackMob object
// Copy your init data from here: https://dashboard.stackmob.com/sdks/js/config
// Your other app information is here: https://dashboard.stackmob.com/settings
StackMob.init({
  appName: 'standardaether',
  clientSubdomain: 'milesoc',
  publicKey: 'c37da8d5-dcf7-4d75-b69b-333350fd1cf7',
  apiVersion : 0
});

var Market = StackMob.Model.extend({
  schemaName: 'market' //this maps a schema at https://dashboard.stackmob.com/schemas/
});

var Price = StackMob.Model.extend({
  schemaName: 'price' //this maps a schema at https://dashboard.stackmob.com/schemas/
});

 //redirect to login if not logged in
console.log("test")
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
});


function populate(tableBodyId, method, linkUrl, cells, updateFn) {
  console.log("calling custom code to populate table")
  //retrieve the markets
  StackMob.customcode(method,
    {},
    'GET',
    {success: function(result) {
      var oldBody = document.getElementById(tableBodyId)
      var newBody = document.createElement('tbody')
      console.log("called custom code method " + method)
      var objects = result.result
      console.log(objects.length + " objects(s)")

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
            case 'trend':
              var trend = document.createTextNode(cellValue)
              console.log(cellValue > 0)
              if (cellValue > 0)
                newCell.className = "positive"
              else if (cellValue < 0)
                newCell.className = "negative"
              newCell.appendChild(trend)
              break;
            case 'input':
              var input = document.createElement("input")
              input.setAttribute("value", cellValue)
              input.id = obj.id+cellName
              console.log(obj.id+cellName)
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
