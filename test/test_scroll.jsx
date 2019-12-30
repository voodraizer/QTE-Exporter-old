app.bringToFront();

#target Photoshop

var windowResource = """dialog {  

    orientation: 'column', 

    alignChildren: ['fill', 'top'],  

    preferredSize:[300, 230], 

    text: 'Scroll panel example',  

    margins:15, 

    

    scrollPanel: Panel { 

        orientation: 'row', 

        alignChildren: 'top', 

        margins:0, 

        spacing:0,

        text: '',

        

        innerScrollPanel: Panel{

            orientation: 'column', 

            alignChildren: 'left', 

            alignment: 'top',

            margins:0, 

            spacing:0,

            text: '',

            properties: {borderStyle:'none'}

        },

        

        panelScrollbar: Scrollbar { 

            alignment: 'fill',

            margins:0,

            spacing:0

        }

    },

    

    bottomGroup: Group{ 

        cancelButton: Button { text: 'Cancel', properties:{name:'cancel'}, size: [120,24], alignment:['right', 'center'] }, 

        applyButton: Button { text: 'OK', properties:{name:'ok'}, size: [120,24], alignment:['right', 'center'] }, 

        orientation: 'row'

    }

}"""

var win = new Window(windowResource);

var scrollPanel = win.scrollPanel;

var innerScrollPanel = scrollPanel.innerScrollPanel;

var scrollBar = scrollPanel.panelScrollbar;

scrollPanel.size=[300,400];

innerScrollPanel.preferredSize.width = 300-20;

scrollBar.preferredSize.width = 16;

scrollBar.onChanging = function (){

    var outerPanel = this.parent;

    var innerPanel = outerPanel.children[0];

    

    var innerWidth = innerPanel.bounds.width;

    var innerHeight = innerPanel.bounds.height;

    

    var outerHeight = outerPanel.bounds.height;

    

    this.minvalue = 0;

    this.maxvalue = innerHeight-outerHeight;

    

    this.stepdelta = Math.round(outerHeight / 10);

    this.jumpdelta = Math.round(outerHeight / 5);

    

    var topOffset = -this.value;

    innerPanel.bounds = {x:0, y:topOffset, width:innerWidth,height:innerHeight};

}

// Storing reference to elements

var dropdown = {};

var label = {};

var panel = {};

// Add some sample UI content

for(var i = 0; i < 15; i++){

    panel = win.scrollPanel.innerScrollPanel.add('panel',undefined,'',{justify:'left', borderStyle:'none'});

    panel.orientation = 'row';

    panel.alignment = 'fill';

    label = panel.add('statictext',undefined,"Test dropdown "+i+":");

    dropdown = panel.add('dropdownlist',undefined,["a","b"]);

}

win.bottomGroup.applyButton.onClick = function() {

    win.close();

}

win.show();