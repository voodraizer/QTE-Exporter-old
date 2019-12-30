

//#include '~gui_gen_slot.jsx'
//#include "test_copylayers.jsx"

// EXPOTERDIALOG
// =============
var ExpoterDialog = new Window("dialog"); 
    ExpoterDialog.text = "Q.T.E. Export helper v.2.0"; 
    ExpoterDialog.preferredSize.width = 250; 
    ExpoterDialog.preferredSize.height = 430; 
    ExpoterDialog.orientation = "column"; 
    ExpoterDialog.alignChildren = ["left","top"]; 
    ExpoterDialog.spacing = 4; 
    ExpoterDialog.margins = 4; 

// EX_GROUPMIDDLE
// ==============
var Ex_GroupMiddle = ExpoterDialog.add("group", undefined, {name: "Ex_GroupMiddle"}); 
    Ex_GroupMiddle.orientation = "column"; 
    Ex_GroupMiddle.alignChildren = ["left","center"]; 
    Ex_GroupMiddle.spacing = 0; 
    Ex_GroupMiddle.margins = 0; 
    Ex_GroupMiddle.alignment = ["fill","top"]; 

// EX_GROUPMIDDLE_SLOTS
// ====================
var Ex_GroupMiddle_Slots = Ex_GroupMiddle.add("group", undefined, {name: "Ex_GroupMiddle_Slots"}); 
    Ex_GroupMiddle_Slots.preferredSize.width = 220; 
    Ex_GroupMiddle_Slots.preferredSize.height = 280; 
    Ex_GroupMiddle_Slots.orientation = "column"; 
    Ex_GroupMiddle_Slots.alignChildren = ["left","center"]; 
    Ex_GroupMiddle_Slots.spacing = 0; 
    Ex_GroupMiddle_Slots.margins = 0; 
    Ex_GroupMiddle_Slots.alignment = ["fill","center"];
	

// -- evaluate include file.
var exporterFilename = new File($.fileName);
var exporterFilepath = exporterFilename.parent;
//$.evalFile(exporterFilepath + "/~gui_gen_slot.jsx");


$.evalFile(exporterFilepath + "/~gui_gen_slot.jsx");
SL_ED_Slot.hide();
SL_SlotName.text = "Slot 1";
//SlotName.onClick = function () {ChangeSlotSettings(this);}
//SL_Slot.onClick = function(event) {
//	alert("Clicked: " + this.name);}
SL_Slot.is_SlotSelected = false;
SL_Slot.addEventListener('click', function(event) {
	//alert("Clicked: " + this.name);
	SL_Slot.is_SlotSelected = !SL_Slot.is_SlotSelected;
	if (SL_Slot.is_SlotSelected)
	{
		this.graphics.backgroundColor = this.graphics.newBrush (this.graphics.BrushType.SOLID_COLOR, [0.5, 0.0, 0.0]);
	}
	else
	{
		this.graphics.backgroundColor = this.graphics.newBrush (this.graphics.BrushType.SOLID_COLOR, [0.0, 0.5, 0.0]);
	}
});
SL_Slot.addEventListener('mouseover', function(event) {
	//this.graphics.backgroundColor = this.graphics.newBrush (this.graphics.BrushType.SOLID_COLOR, [0.5, 0.0, 0.0]);
});

$.evalFile(exporterFilepath + "/~gui_gen_slot.jsx");
SL_ED_Slot.hide();
SL_SlotName.text = "Slot 2";
SL_Slot.is_SlotSelected = false;
SL_Slot.color_On = RGB_Normalized(107, 120, 107);
SL_Slot.color_Off = RGB_Normalized(76, 79, 76);
SL_Slot.addEventListener('click', SL_Slot_OnClick);
//SL_Slot.notify("onClick");
SL_Slot.dispatchEvent(new UIEvent ('click'));

ExpoterDialog.show();

function SL_Slot_OnClick(event)
{
	//alert("Clicked: " + this.name);
	//SL_Slot.is_SlotSelected = !SL_Slot.is_SlotSelected;
	this.is_SlotSelected = !this.is_SlotSelected;
	if (SL_Slot.is_SlotSelected)
	{
		this.graphics.backgroundColor = this.graphics.newBrush (this.graphics.BrushType.SOLID_COLOR, this.color_On);
	}
	else
	{
		this.graphics.backgroundColor = this.graphics.newBrush (this.graphics.BrushType.SOLID_COLOR, this.color_Off);
	}
}

function RGB_Normalized(r, g, b)
{
	r = r/255;
	g = g/255;
	b = b/255;
	return [r, g, b];
}

function ChangeSlotSettings(slot_checkbox)
{
//~ 	$.writeln("Change settings in: " + slot_checkbox.text);
//~ 	
//~ 	var exportData = exporterSettings;		
//~ 	for (var i = 0; i < exportData.slots.length; i++)
//~ 	{	
//~ 		if (exportData.slots[i].type == slot_checkbox.text)
//~ 		{
//~ 			exportData.slots[i].selected = (slot_checkbox.value) ? "true" : "false";
//~ 		}
//~ 	}
}