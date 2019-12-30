//#target photoshop

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

// END__HARVEST_EXCEPTION_ZSTRING

*/

//$.level = 0;	// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
//debugger; 	// launch debugger on next line


// -- evaluate include file.
var exporterFilename = new File($.fileName);
var exporterFilepath = exporterFilename.parent;
$.evalFile(exporterFilepath + "/~Include.jsx");
$.evalFile(exporterFilepath + "/gui/~gui_gen_exporter.jsx");
$.evalFile(exporterFilepath + "/gui/~gui_gen_settings.jsx");


// ---------------------------------------------------------------------------------------------------------------------
// Main GUI func.
// ---------------------------------------------------------------------------------------------------------------------
function GUI_main( )
{
	if(Number(app.version.match(/^\d+/)) <12)
	{
		alert("Sorry but you need to have Photoshop CS5 or better");
		return;
	}

	if (app.documents.length == 0)
	{
		alert ('You must have a document open to export!');
		return;
	}
	
	// Read configs.
	exporterSettings.ReadXmlExporterConfigs();
	exporterSettings.GetExporterXMPPreset(app.activeDocument);
	//TestXMP();
	//exporterSettings.SetExporterXMPPreset();
	
	
	// -- show slot panels
	GUI_ShowSlots();
	
	// -- show window
	//var Ex_Slots_Scrollbar = ExpoterDialog.Ex_GroupMiddle.Ex_GroupMiddle_Scrollbar.add("scrollbar",  [0,0,14,300]);
	ExpoterDialog.size = { width: 250, height: 440 };
	ShowSettingsPanel(false);
	ShowExporterPanel(true);
	ExpoterDialog.show();
	
    
	return 1;
}

// ---------------------------------------------------------------------------------------------------------------------
//	Create slots panel.
// ---------------------------------------------------------------------------------------------------------------------
function GUI_ShowSlots()
{
	// В ~gui_gen_slot.jsx рутовую группу надо добавлять в Ex_GroupMiddle_Slots
	
	function SL_Slot_OnClick(event)
	{
		//alert("Clicked: " + this.name);
		var slot = this;//.children["SL_SlotInfo"];
		
		slot.is_SlotSelected = !slot.is_SlotSelected;
		if (slot.is_SlotSelected)
		{
			slot.graphics.backgroundColor = slot.graphics.newBrush (slot.graphics.BrushType.SOLID_COLOR, slot.color_On);
		}
		else
		{
			slot.graphics.backgroundColor = slot.graphics.newBrush (slot.graphics.BrushType.SOLID_COLOR, slot.color_Off);
		}
		
		// Store selected to config.
		//$.writeln(this.name);
		for (var i = 0; i < exporterSettings.xmlConf.slots.length; i++)
		{
			if (exporterSettings.xmlConf.slots[i].type == this.name)
			{
				exporterSettings.xmlConf.slots[i].selected = slot.is_SlotSelected;
			}
		}
	}

	function SL_Btn_Settings_OnClick(event)
	{
		//alert("Clicked: " + this.parent.parent.name);
		//#include "~gui_gen_slotinfo.jsx"
		
		for (var i = 0; i < exporterSettings.xmlConf.slots.length; i++)
		{
			if (exporterSettings.xmlConf.slots[i].type == this.parent.parent.name)
			{
				var SI_SlotInfo = CreateSlotInfo(exporterSettings.xmlConf.slots[i]);
			}
		}
	}

	var slotWidth = 205;
	var slotBigHeight = 60;
	var slotSmallHeight = 30;
	
	//var color_On = RGB_Normalized(107, 120, 107);
	var color_On = RGB_Normalized(52, 79, 52);
	var color_Off = RGB_Normalized(76, 79, 76);
	
	for (var i = 0; i < exporterSettings.xmlConf.slots.length; i++)
	{
		$.evalFile(exporterFilepath + "/gui/~gui_gen_slot.jsx");
		
		SL_Slot.name = exporterSettings.xmlConf.slots[i].type;
		
		if (exporterSettings.xmlConf.gui.compactslotsize == true)
		{
			SL_GroupDown.hide();
			SL_Slot.size = {width: slotWidth, height: slotSmallHeight};
		}
		else
		{
			SL_Slot.size = {width: slotWidth, height: slotBigHeight};
		}
		
		SL_BottomText.text = "";
		
		if (exporterSettings.xmlConf.slots[i].selected == true)
		{
			SL_SlotInfo.is_SlotSelected = false;
		}
		else
		{
			SL_SlotInfo.is_SlotSelected = true;
		}
		
		SL_SlotInfo.color_On = color_On;
		SL_SlotInfo.color_Off = color_Off;
		
		SL_SlotInfo.addEventListener('click', SL_Slot_OnClick);
		SL_SlotInfo.dispatchEvent(new UIEvent ('click'));
		
		SL_Btn_Settings.addEventListener('click', SL_Btn_Settings_OnClick);
		
		SL_SlotName.text = exporterSettings.xmlConf.slots[i].type;
		SL_SlotAddInfo.text = "  " + exporterSettings.xmlConf.slots[i].suffix;
		
		var channels = "";
		var isChannelUsed = false;
		for(var k = 0; k < exporterSettings.xmlConf.slots[i].channels.length; k++)
		{
			//channels += exporterSettings.xmlConf.slots[i].channels[k].type;
			//channels += " - ";
			//channels += exporterSettings.xmlConf.slots[i].channels[k].source;
			//channels += "; ";
			isChannelUsed = true;
		}
	
		if (isChannelUsed)
		{
			SL_ImageRGB.show();
			RemoveUIElement(SL_ImageEmpty);
		}
		else
		{
			RemoveUIElement(SL_ImageRGB);
			SL_ImageEmpty.show();
		}
	
		if (exporterSettings.xmlConf.options.disablecrytiff != false)
		{
			// Skip  show CryTiff preset.
			//exporterSettings.xmlConf.slots[i].tiffPres;
		}
		
		// Add divider after slot.
		var divider1 = Ex_GroupMiddle_Slots.add("panel", undefined, undefined, {name: "divider1"}); 
		divider1.alignment = "fill";
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Exporter window.
// ---------------------------------------------------------------------------------------------------------------------
// Set show handler.
ExpoterDialog.onShow = function()
{
	if (app.documents.length == 0)
	{
		alert ('You must have a document open to export!');
		//return 0;
	}
	else
	{
		
	}

	if(Number(app.version.match(/^\d+/)) <12)
	{
		alert("Sorry but you need to have Photoshop CS5 or better");
		return;
	}

//~ 	if (app.documents.length == 0)
//~ 	{
//~ 		alert ('You must have a document open to export!');
//~ 		return;
//~ 	}

	// --
	//dlg.addEventListener ('keydown', KeyboardHandler);
	//dlg.addEventListener ('enterKey', KeyboardHandler);
	// -- отослать ивент на таб, передастся фокус на кнопку флеша
	//dlg.initUIEvent(
	//initKeyboardEvent("enterKey", true, false, dlg, );
	
}

// Set close handler.
ExpoterDialog.onClose = function()
{
	// -- save config.
	//dlg.fp.invokePlayerFunction ("SavePanelStatus");
}

Ex_Btn_EditSlot.onClick = function()
{
	// Edit slots.
}

Ex_Btn_TemplLayers.onClick = function()
{
	// Create template groups in PSD.
	for (var i = 0; i < exporterSettings.xmlConf.slots.length; i++)
	{
		if (exporterSettings.xmlConf.slots[i].selected == true) // TODO: надо проходится не по сеттингам, а по открытыми слотам.
		{
			// TODO: проверять если уже есть такая папка, то не создавать новую.
			var rgb = exporterSettings.xmlConf.slots[i].fill.split(";");
			CreateGroupAndLayer(app.activeDocument, null, exporterSettings.xmlConf.slots[i].type, rgb);
			
			for(var k = 0; k < exporterSettings.xmlConf.slots[i].channels.length; k++)
			{
				
			}
		}
	}
	
	CloseWindow(ExpoterDialog);
}

Ex_Btn_Settings.onClick = function()
{
	// Show settings.
	ShowExporterPanel (false);
	ShowSettingsPanel (true);
}

Ex_Btn_Save.onClick = function()
{
	// Save settings to xml file.
	exporterSettings.WriteXmlExporterConfigs();
}

ExportTextures.onClick = function()
{
	// Export textures.
	ExportFiles();

	CloseWindow(ExpoterDialog);
}

CloseExporter.onClick = function()
{
	CloseWindow(ExpoterDialog);
}

ExportPathSelect.onClick = function()
{
	var outputFolder = Folder.selectDialog("Choose folder to export ...");
	if (outputFolder != null)
	{
		ExportPath.text = decodeURI(outputFolder.fsName.toString());
		//$.writeln ("Path: " + decodeURI(outputFolder.fsName.toString()));
	}

	//selectedFile = File.openDialog("Please select TEXT file.","TEXT File:*.txt"); 
	//if(selectedFile != null) win.testFile.text =  decodeURI(selectedFile.fsName);
}


function ShowExporterPanel(show)
{
	Ex_GroupMiddle_Slots.size = { width: 250, height: 280 };
	Ex_GroupBottom_Ch.margins = {left:130, top:0, right:0, bottom:0};
	
	if (show)
	{
		Ex_GroupInfo.show();
		Ex_GroupTop.show();
		Ex_GroupMiddle.show();
		Ex_GroupBottom.show();
		
		Ex_Divider_1.show();
		Ex_Divider_2.show();
		
		Ex_TextInfo.text = "";
		if (exporterSettings.xmlConf.options.copytoexportpath && exporterSettings.xmpConf.ExportPath != undefined)
		{
			Ex_TextInfo.text = exporterSettings.xmpConf.ExportPath;
			//$.writeln(">>>>>>>>>>>>" + Ex_TextInfo.text);
			//dialog.update();
			//$.sleep (2000); // waits 2 seconds
			//app.refresh();
			//waitForRedraw();
		}
	}
	else
	{
		//~ Exporter.hide();
		Ex_GroupInfo.hide();
		Ex_GroupTop.hide();
		Ex_GroupMiddle.hide();
		Ex_GroupBottom.hide();
		
		Ex_Divider_1.hide();
		Ex_Divider_2.hide();
	}
}

// Callback for slot chekbox.
function ChangeSlotSettings(slot_checkbox)
{
	$.writeln("Change settings in: " + slot_checkbox.text);
	
	var exportData = exporterSettings.xmlConf;		
	for (var i = 0; i < exportData.slots.length; i++)
	{	
		if (exportData.slots[i].type == slot_checkbox.text)
		{
			exportData.slots[i].selected = (slot_checkbox.value) ? "true" : "false";
		}
	}
}

function KeyboardHandler(event)
{
	$.writeln("Key pressed");
	
	//if (ScriptUI.environment.keyboardState.ctrlKey == true)
	if (event.ctrlKey == true)
	{
		
	}
	if (event.keyName == "Space") //"Enter"
	{
		$.writeln("Space pressed");
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Slot window.
// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// Slot info.
// ---------------------------------------------------------------------------------------------------------------------
function CreateSlotInfo(slot)
{
	$.evalFile(exporterFilepath + "/gui/~gui_gen_slotinfo.jsx");
	
	//SI_SlotInfo.opacity = 0.5;
	SI_SlotInfo.borderless = true;
	
	function SI_SlotInfo_OnClick(event)
	{
		//alert("Clicked: " + this.name);
		//this.dispatchEvent(new UIEvent("onClose"));
		SI_SlotInfo.close();
	}
	
	SI_SlotInfo.addEventListener('click', SI_SlotInfo_OnClick);
	
	SI_InfoChannel_Base.text = ""
	SI_InfoChannel_R.text = "";
	SI_InfoChannel_G.text = "";
	SI_InfoChannel_B.text = "";
	SI_InfoChannel_A.text = "";
	
	SI_Name.text = "Slot name: " + slot.type;
	SI_Suffix.text = "Slot suffix: " + slot.suffix;
			
	if (getByName(app.activeDocument.layerSets, slot.type) != undefined) SI_InfoChannel_Base.text = "RGB: " + slot.type;
			
	for(var k = 0; k < slot.channels.length; k++)
	{
		var chType = slot.channels[k].type;
		if (chType == "r") SI_InfoChannel_R.text = "Channel R: " + slot.channels[k].source;
		if (chType == "g") SI_InfoChannel_G.text = "Channel G: " + slot.channels[k].source;
		if (chType == "b") SI_InfoChannel_B.text = "Channel B: " + slot.channels[k].source;
		if (chType == "a") SI_InfoChannel_A.text = "Channel A: " + slot.channels[k].source;
	}

	if (SI_InfoChannel_Base.text == "") RemoveUIElement(SI_InfoChannel_Base);
	if (SI_InfoChannel_R.text == "") RemoveUIElement(SI_InfoChannel_R);
	if (SI_InfoChannel_G.text == "") RemoveUIElement(SI_InfoChannel_G);
	if (SI_InfoChannel_B.text == "") RemoveUIElement(SI_InfoChannel_B);
	if (SI_InfoChannel_A.text == "") RemoveUIElement(SI_InfoChannel_A);
	if (SI_InfoChannel_Base.text == "" && SI_InfoChannel_R.text == "" && SI_InfoChannel_G.text == "" && SI_InfoChannel_B.text == "" && SI_InfoChannel_A.text == "") RemoveUIElement(SI_InfoChannels);

	RemoveUIElement(SI_Info2);
	RemoveUIElement(SI_InfoButtons);
	
	SI_SlotInfo.layout.resize();
	SI_SlotInfo.show();
	
	SI_SlotInfo.onClose = function()
	{
		CloseWindow(SI_SlotInfo);
		//HideWindow(SI_SlotInfo);
	}

	SI_SlotInfo.GetWidget = function(widget)
	{
		return this.findElement(widget);
	}

	return SI_SlotInfo;
}

// ---------------------------------------------------------------------------------------------------------------------
// Settings window.
// ---------------------------------------------------------------------------------------------------------------------
OpenSettingsXml.onClick = function()
{
	var f = new File(exporterSettings.xmlExporterConfPath);
	f.execute();
	
	// -- close.
	//CloseWindow();
}


SaveOptions.onClick = function()
{	
	var obj = new Object();
	obj.ExportPath = ExportPath.text;
	obj.OutputType = "tga";
	obj.DownScale = 1;
	
	exporterSettings.SetExporterXMPPreset(app.activeDocument, obj);
	
	// Save settings to xml file.
	exporterSettings.WriteXmlExporterConfigs();
	
	ShowSettingsPanel(false);
	ShowExporterPanel(true);
}

ExitOptions.onClick = function()
{
	ShowSettingsPanel(false);
	ShowExporterPanel(true);
}

function ShowSettingsPanel(show)
{
	if (show)
	{
		ST_Group.show();
		ST_Group.enabled = true;
		ST_Group.location = { x: 5, y: 5 };
		ST_Group.size = { width: 250, height: 430 };
		//Ex_GroupMiddle_Slots.size = { width: 220, height: 280 };
		
		ExportPath.text = exporterSettings.xmpConf.ExportPath;
	}
	else
	{
		ST_Group.hide();
	}
}
