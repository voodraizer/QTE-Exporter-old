// Simple Color Picker SCRIPTUI
// Script by Mehmet Sensoy

function colorpicker (result_color) {
    var hexToRGB = function(hex) {
      var r = hex >> 16;var g = hex >> 8 & 0xFF;var b = hex & 0xFF;
      return [r, g, b];    };

    var color_decimal = $.colorPicker();
    $.writeln(color_decimal);
    var color_hexadecimal = color_decimal.toString(16);
    $.writeln(color_hexadecimal);
    var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
    $.writeln(color_rgb);
    var result_color = [color_rgb[0] / 255, color_rgb[1] / 255, color_rgb[2] / 255];
    $.writeln(result_color);   
    return result_color;
    return color_rgb;
    
    }

function customDraw()
{ with( this ) {
graphics.drawOSControl();
graphics.rectPath(0,0,size[0],size[1]);
graphics.fillPath(fillBrush);
if( text ) graphics.drawString(text,textPen,(size[0]-graphics.measureString (text,graphics.font,size[0])[0])/2,3,graphics.font);
}}


var w = new Window ("dialog");

var pnl =w.add('panel', undefined, 'Color Options');
var colorbutton1 = pnl.add('iconbutton', undefined, undefined, {name:'coloroption1', style: 'toolbutton'});
colorbutton1.size = [200,20];
colorbutton1.fillBrush = colorbutton1.graphics.newBrush( colorbutton1.graphics.BrushType.SOLID_COLOR, [0.5, 0.5, 0.5, 1] );
colorbutton1.text = "First Color";
colorbutton1.textPen = colorbutton1.graphics.newPen (colorbutton1.graphics.PenType.SOLID_COLOR,[1,1,1], 1);
colorbutton1.onDraw = customDraw;

var colorbutton2 = pnl.add('iconbutton', undefined, undefined, {name:'coloroption1', style: 'toolbutton'});
colorbutton2.size = [200,20];
colorbutton2.fillBrush = colorbutton2.graphics.newBrush( colorbutton2.graphics.BrushType.SOLID_COLOR, [0.5, 0.5, 0.5, 1] );
colorbutton2.text = "Second Color";
colorbutton2.textPen = colorbutton2.graphics.newPen (colorbutton2.graphics.PenType.SOLID_COLOR,[1,1,1], 1);
colorbutton2.onDraw = customDraw;



// ******************* COLOR BUTTONS ******************///

colorbutton1.onClick = function () {
    
    var newcolor1 = colorpicker ();
    colorbutton1.fillBrush = colorbutton1.graphics.newBrush( colorbutton1.graphics.BrushType.SOLID_COLOR,newcolor1);
    app.refresh();    
    colorbutton1.onDraw = customDraw; 
    
    }

colorbutton2.onClick = function () {
    var newcolor2 = colorpicker ();
    colorbutton2.fillBrush = colorbutton2.graphics.newBrush( colorbutton2.graphics.BrushType.SOLID_COLOR,newcolor2);
    app.refresh();    
    colorbutton2.onDraw = customDraw;
    
    }

w.center();
w.show ();