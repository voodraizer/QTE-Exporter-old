var myItems = Array(["  ----Select Item----  ",""], ["Item 1","\\i1","y"], ["Item 2","\\i2","y"], ["Item 3","\\i3"], ["sep",""], ["Item 4","\\i4","y"], ["Item 5","\\i5"], ["Item 6","\\i6","y"], ["sep",""], ["Item 7","\\i7"], ["Item 8","\\i8"], ["Item 9","\\i9"], ["Item 10","\\i10","y"]);

var myWin = new Window('dialog','Custom Insert Menu');
var editText = myWin.add('edittext');
var myDrop = myWin.add('dropdownlist');
myWin.orientation = 'row';
myWin.spacing = 0;
editText.preferredSize = [250,25];
editText.active=true;

for(var i = 0; i < myItems.length; i++){
  if(myItems[i][0] == "sep"){
    myDrop.add('separator');
  }else{
    myDrop.add('item',myItems[i][0]);
    // if(myItems[i][2])
    // myDrop.items[i].image = File('/d/info.png');
    // else
    // myDrop.items[i].image = File('/d/empty.png');
  }
}

myDrop.preferredSize = [15,25];
myDrop.selection = 0;
myDrop.onChange = function(){
  editText.textselection += myItems[myDrop.selection.index][1];
  myDrop.selection = 0;
  editText.active=true;
}


myWin.center();
myWin.show();