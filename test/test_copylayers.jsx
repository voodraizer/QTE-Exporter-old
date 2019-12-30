function CreateLayer(doc, color)
{
	doc.artLayers.add();
	doc.selection.selectAll();
	
	if (color != null)
	{
		// -- fill.
		var fillColor = new SolidColor();
		fillColor.rgb.red = color[0];
		fillColor.rgb.green = color[1];
		fillColor.rgb.blue = color[2];
		doc.selection.fill(fillColor);
	}
	
	doc.selection.deselect();	
}

function HasBackgroundLayer(doc)
{
	// doc.hasOwnProperty("backgroundLayer")
    return doc.artLayers[doc.artLayers.length - 1].isBackgroundLayer ? true : false;
}

function CopyLayerToBackground(doc, layerFrom)
{
	if (layerFrom.allLocked == true) layerFrom.allLocked = false;
	if (layerFrom.visible == false) layerFrom.visible == true;
	
	if (HasBackgroundLayer(doc))
	{	
		var layerTo = doc.backgroundLayer;
		layerTo.isBackgroundLayer = false;
		doc.activeLayer = layerTo;
		doc.activeLayer.remove();
	}
	
	doc.activeLayer = layerFrom;
	doc.selection.selectAll();
	doc.selection.copy();
	doc.paste();
	doc.selection.deselect();
	
	doc.activeLayer.isBackgroundLayer = true;
	
	//backgroundLayer = layerTo;
}

//~ function CopyLayerToBackground(doc, layerFrom)
//~ {
//~ 	if (layerFrom.allLocked == true) layerFrom.allLocked = false;
//~ 	if (layerFrom.visible == false) layerFrom.visible == true;
//~ 	
//~ 	if (HasBackgroundLayer(doc))
//~ 	{	
//~ 		var layerTo = doc.backgroundLayer;
//~ 		layerTo.isBackgroundLayer = false;
//~ 		doc.activeLayer = layerTo;
//~ 		doc.activeLayer.remove();
//~ 		
//~ 		doc.activeLayer = layerFrom;
//~ 		doc.selection.selectAll();
//~ 		doc.selection.copy();
//~ 		doc.paste();
//~ 		doc.selection.deselect();
//~ 		
//~ 		doc.activeLayer.isBackgroundLayer = true;
//~ 		
//~ 		//backgroundLayer = layerTo;
//~ 	}
//~ 	else
//~ 	{
//~ 		doc.activeLayer = layerFrom;
//~ 		doc.selection.selectAll();
//~ 		doc.selection.copy();
//~ 		doc.paste();
//~ 		doc.selection.deselect();
//~ 		
//~ 		doc.activeLayer.isBackgroundLayer = true;
//~ 		
//~ 		//backgroundLayer = layerTo;
//~ 	}
//~ }

//~ function CopyLayerToBackground(doc, layerFrom)
//~ {
//~ 	if (layerFrom.allLocked == true) layerFrom.allLocked = false;
//~ 	if (layerFrom.visible == false) layerFrom.visible == true;
//~ 	
//~ 	if (doc.hasOwnProperty("backgroundLayer"))
//~ 	{
//~ 		var layerTo;
//~ 		CreateLayer(doc, [0, 0, 0]);
//~ 		layerTo = doc.activeLayer;
//~ 		
//~ 		doc.activeLayer = layerFrom;
//~ 		doc.selection.selectAll();
//~ 		doc.selection.copy();
//~ 		
//~ 		doc.activeLayer = layerTo;
//~ 		//doc.paste();
//~ 		doc.selection.duplicate(layerTo);
//~ 		doc.selection.deselect();
//~ 		
//~ 		//layerTo.isBackgroundLayer = true;
//~ 		
//~ 		//backgroundLayer = layerTo;
//~ 	}
//~ 	else
//~ 	{
//~ 		var layerTo = doc.backgroundLayer;
//~ 		layerTo.isBackgroundLayer = false;
//~ 		
//~ 		doc.activeLayer = layerFrom;
//~ 		doc.selection.selectAll();
//~ 		doc.selection.copy();
//~ 		
//~ 		doc.activeLayer = layerTo;
//~ 		doc.paste();
//~ 		doc.selection.deselect();
//~ 		
//~ 		layerTo.isBackgroundLayer = true;
//~ 		
//~ 		//backgroundLayer = layerTo;
//~ 	}
//~ }

var doc = app.activeDocument;
//app.activeDocument.layerSets.getByName("my group name").artLayers.getByName("my layer name");
var layerFrom = doc.artLayers.getByName("normal");
CopyLayerToBackground(doc, layerFrom);
