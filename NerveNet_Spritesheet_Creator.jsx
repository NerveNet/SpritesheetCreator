{
    function JSON2API() {
        "object" != typeof JSON && (JSON = {}), function () {
            "use strict"

            function f(t) {
                return 10 > t ? "0" + t : t
            }

            function quote(t) {
                return escapable.lastIndex = 0, escapable.test(t) ? '"' + t.replace(escapable, function (t) {
                    var e = meta[t]
                    return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + t + '"'
            }

            function str(t, e) {
                var r, n, o, f, u, p = gap, i = e[t]
                switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) {
                    case"string":
                        return quote(i)
                    case"number":
                        return isFinite(i) ? i + "" : "null"
                    case"boolean":
                    case"null":
                        return i + ""
                    case"object":
                        if (!i) return "null"
                        if (gap += indent, u = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                            for (f = i.length, r = 0; f > r; r += 1) u[r] = str(r, i) || "null"
                            return o = 0 === u.length ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + p + "]" : "[" + u.join(",") + "]", gap = p, o
                        }
                        if (rep && "object" == typeof rep) for (f = rep.length, r = 0; f > r; r += 1) "string" == typeof rep[r] && (n = rep[r], o = str(n, i), o && u.push(quote(n) + (gap ? ": " : ":") + o))
                        else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i), o && u.push(quote(n) + (gap ? ": " : ":") + o))
                        return o = 0 === u.length ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + p + "}" : "{" + u.join(",") + "}", gap = p, o
                }
            }

            "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                return this.valueOf()
            })
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap, indent,
                meta = {"\b": "\\b", "  ": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, rep
            "function" != typeof JSON.stringify && (JSON.stringify = function (t, e, r) {
                var n
                if (gap = "", indent = "", "number" == typeof r) for (n = 0; r > n; n += 1) indent += " "
                else "string" == typeof r && (indent = r)
                if (rep = e, e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw Error("JSON.stringify")
                return str("", {"": t})
            }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) {
                function walk(t, e) {
                    var r, n, o = t[e]
                    if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (n = walk(o, r), void 0 !== n ? o[r] = n : delete o[r])
                    return reviver.call(t, e, o)
                }

                var j
                if (text += "", cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (t) {
                    return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j
                throw new SyntaxError("JSON.parse")
            })
        }()
    }

    
    function SpritesheetTools(thisObj)
    {
        var version = "1.0.0";

        var scope = thisObj;
        
        var windowWidth = 180;

        
        // File Pattern Items include variable names to be attached to the filename of a generated spritesheet.
        // Examples:
        // _#[30,6,5,15]
        // _#[48,48]

        var filePatternIndex = 1; // the current Active File Pattern Preset that will be applied
        var filePatterns = [];
        filePatterns.push(['sprites', 'columns', 'rows', 'fps']);
        filePatterns.push(['spriteWidth', 'spriteHeight']);
        
        
        function writeTxtFile(data)
        {
            // prompt to save file
            var theFile = new File("~/temp/" + app.project.activeItem.name + ".json");
            theFile = theFile.saveDlg('Save as:');

            // if user didn't cancel...
            if (theFile != null)
            {
                // open file for "w"riting,
                theFile.open("w", "TEXT", "????");

                theFile.writeln(data);

                // close the text file
                theFile.close();

                // open text file in default app
                //theFile.execute();
            }
        }

        function exportFrame(spriteComp, ext)
        {
            //render the Composition
            var ext = ext.toLowerCase();

            //Template
            var templateBasename = ext.toUpperCase() + " with Alpha";
            var renderTemplate = false;
            var outputTemplate = false;

            //shortcut to RenderQueue
            var queue = app.project.renderQueue;

            //deny rendering on all present RenderQueue Items
            for (var i = 0; i < queue.items.length; i++)
            {
                var item = queue.item(i + 1);
                if (item.status === RQItemStatus.DONE)
                {
                    item.remove();
                }
                else if (item.status === RQItemStatus.QUEUED || item === RQItemStatus.WILL_CONTINUE || item === RQItemStatus.NEEDS_OUTPUT)
                {
                    item.render = false;
                }
            }

            //check if templates are present
            var tempComp = app.project.items.addComp('temp', 4.0, 4.0, 1.0, 1.0, 1.0);
            var rqi_tempComp = queue.items.add(tempComp);

            //check if render template exists
            for (var i = 0; i < rqi_tempComp.templates.length; i++) {
                if (rqi_tempComp.templates[i] === templateBasename + " Render") {
                    renderTemplate = rqi_tempComp.templates[i];
                    break;
                }
            }

            //check if output template exists
            for (var i = 0; i < rqi_tempComp.outputModules[1].templates.length; i++) {
                if (rqi_tempComp.outputModules[1].templates[i] === templateBasename) {
                    outputTemplate = rqi_tempComp.outputModules[1].templates[i];
                    break;
                }
            }

            rqi_tempComp.remove();
            tempComp.remove();

            //extract templates from template file if not found
            if (!renderTemplate || !outputTemplate) {

                //import template project to save transparent template
                var exportModuleFilename = templateBasename + ".aep";
                var exportModuleFile = ((new File($.fileName)).path) + "/SheetahResources/templates/" + exportModuleFilename;
                exportModuleFile = new ImportOptions(File(exportModuleFile));

                app.project.importFile(exportModuleFile);

                //find the right template item
                for (var i = 0; i < queue.items.length; i++) {
                    var item = queue.item(i + 1);

                    if (item.comp.name === ext + "_export") {

                        //save render and output templates

                        if (!renderTemplate) {
                            renderTemplate = templateBasename + " Render";
                            item.saveAsTemplate(renderTemplate);
                        }

                        if (!outputTemplate) {
                            outputTemplate = templateBasename;

                            var file_name = File.decode("template." + ext),
                                new_path = "~/template",
                                new_dir = new Folder(new_path),
                                new_path = new_dir.fsName;

                            var new_data = {
                                "Output File Info": {

                                    "Base Path": new_path,
                                    "File Name": file_name

                                }
                            };

                            item.outputModules[1].setSettings(new_data);
                            item.outputModules[1].saveAsTemplate(outputTemplate);
                        }

                        //clear render queue from dummy item
                        item.remove();

                        //remove imported Template Project Folder
                        for (var j = 0; j < app.project.items.length; j++) {
                            var folder = app.project.item(j + 1);

                            if (folder instanceof FolderItem && folder.name === exportModuleFilename) {
                                folder.remove();
                                break;
                            }
                        }

                        break;
                    }
                }

            }
            var compRenderItem = queue.items.add(spriteComp);

            //apply render and output templates
            compRenderItem.applyTemplate(templateBasename + " Render");
            compRenderItem.outputModules[1].applyTemplate(templateBasename);
            compRenderItem.timeSpanDuration = spriteComp.duration;

            // save file dialog
            var renderFile = new File('~/temp/' + spriteComp.name + '.' + ext);
            renderFile = renderFile.saveDlg('Save Spritesheet', ext.toUpperCase() + ':*.' + ext);
            //alert(renderFile.name);

            var file_name = File.decode(renderFile.name),
                new_path = renderFile.path,
                new_dir = new Folder(new_path),
                new_path = new_dir.fsName;

            var new_data = {
                "Output File Info": {

                    "Base Path": new_path,
                    "File Name": file_name

                }
            };

            // if user didn't cancel...
            if (renderFile != null) {

                compRenderItem.outputModules[1].setSettings(new_data);

                //rename file to delete the frame tag "00000"
                compRenderItem.onStatusChanged = function () {
                    if (compRenderItem.status === RQItemStatus.DONE) {
                        queue.stopRendering();

                        //$.sleep(100);
                        var renamedFile = new File(renderFile.path + '/' + renderFile.name + '00000');

                        //check if file without frame tag is already present and delete to replace
                        //the user already decided to overwrite the file in the first dialog so removing should be okay
                        //if we do not remove the file we cannot rename
                        var alreadyPresentFile = new File(renderFile.path + '/' + renderFile.name);
                        alreadyPresentFile.remove();


                        renamedFile.rename(renderFile.name);


                    }
                }

                //start render
                queue.render();

            }
        }

        function OnCreateSpritesheetClick()
        {
            var scriptName = "Save Spritesheet";
            var comp = app.project.activeItem;

            if ((comp == null) || !(comp instanceof CompItem))
            {
                alert("Please select or open a composition first.", scriptName);
                return;
            }
            else
            {
                //check if animation layers in comp
                var animationLayers = [];
                for (var i = 0; i < comp.layers.length; i++)
                {
                    var layer = comp.layer(i + 1);
                    if (layer.timeRemapEnabled && !!layer.property("Time Remap").expression)
                    {
                        animationLayers.push({
                            name: layer.name,
                            expression: layer.property("Time Remap").expression
                        });
                        layer.property("Time Remap").expression = "";
                        layer.timeRemapEnabled = false;
                    }
                }
                

                var sprites = parseInt(comp.duration / comp.frameDuration);
                var columns = parseInt(Math.sqrt(sprites));
                var rows = Math.ceil(sprites / columns);

                var maxTextureWidth = scope.maxWidthDropdown.text === "none" ? 0 : parseInt(scope.maxWidthDropdown.text);
                if (maxTextureWidth == 0)
                {
                    if (scope.columnCount.text === "auto")
                    {
                        if (scope.rowCount.text !== "auto")
                        {
                            rows = parseInt(scope.rowCount.text);
                            rows = rows > sprites ? sprites : rows;
                            columns = Math.ceil(sprites / rows);
                        }
                    }
                    else if (scope.rowCount.text === "auto")
                    {
                        columns = parseInt(scope.columnCount.text);
                        columns = columns > sprites ? sprites : columns;
                        rows = Math.ceil(sprites / columns);
                    }
                }
                else
                {
                    columns = Math.floor(maxTextureWidth / comp.width);
                    rows = Math.ceil(sprites / columns);
                }
                

                /*var spriteWidth = comp.width;
                var spriteHeight = comp.height;
                var fps = comp.frameRate;*/

                
                // build the file name preset according to the active file pattern preset
                var spriteCompName = comp.name + '_#[';
                for (var i = 0; i < filePatterns[filePatternIndex].length; i++)
                {
                    spriteCompName += eval(filePatterns[filePatternIndex][i]);
                    if (i !== filePatterns[filePatternIndex].length - 1)
                        spriteCompName += ',';
                }
                ;
                spriteCompName += ']';

                
                var finalCompWidth = comp.width * columns;
                var finalCompHeight = comp.height * rows;
                if (scope.powerOfTwo.value)
                {
                    finalCompWidth = Math.pow(2, parseInt(Math.log(comp.width * columns - 1) / Math.log(2)) + 1);
                    finalCompHeight = Math.pow(2, parseInt(Math.log(comp.height * rows - 1) / Math.log(2)) + 1);
                }

                // check if dimensions are exceeded
                if (finalCompWidth >= 30000 || finalCompHeight >= 30000)
                {
                    var error = "Spritesheet Comps ";

                    if (finalCompWidth >= 30000 && finalCompHeight >= 30000) {
                        error += "width (" + finalCompWidth + "px) and height (" + finalCompHeight;
                    } else if (finalCompWidth >= 30000) {
                        error += "width (" + finalCompWidth;
                    } else if (finalCompHeight >= 30000) {
                        error += "height (" + finalCompWidth;
                    }

                    error += "px) exceeds AEs max of 30000px. error:[" + sprites + "," + comp.width + "," + comp.height + "]";
                    alert(error, scriptName);

                    error = "Your comps ";
                    if (comp.width > 1000) {
                        error += "width (" + comp.width + "px)";
                    }
                    if (comp.width > 1000 && comp.height > 1000) {
                        error += " and ";
                    }
                    if (comp.height > 1000) {
                        error += "height (" + comp.height + "px)";
                    }
                    if ((comp.width > 1000 || comp.height > 1000) && sprites > 200) {
                        error += " and your ";
                    }
                    if (sprites > 200) {
                        error += "framcount (" + sprites + ")";
                    }

                    error += " is very large. Please check your composition.";
                    alert(error, scriptName);

                    return;
                }

                var spriteComp = app.project.items.addComp(
                    spriteCompName, finalCompWidth, finalCompHeight, 
                    1.0,    // pixelAspect
                    1.0,    // duration in seconds
                    1.0     // framerate
                );

                var rowi = 0;
                var coli = 0;
                for (var i = 0; i < sprites; i++)
                {
                    var spriteLayer = spriteComp.layers.add(comp);

                    spriteLayer.timeRemapEnabled = true;
                    spriteLayer.property("Time Remap").expression = i / comp.frameRate;

                    var posp = spriteLayer.position;
                    var posv = posp.value;

                    posv[0] = posv[0] - spriteComp.width / 2 + comp.width / 2;
                    posv[1] = posv[1] - spriteComp.height / 2 + comp.height / 2;

                    posv[0] = posv[0] + comp.width * coli;
                    posv[1] = posv[1] + comp.height * rowi;

                    posp.setValue(posv);

                    coli++;
                    if (coli > (columns - 1))
                    {
                        rowi++;
                        coli = 0;
                    }
                }
                

                // render spritesheet
                var desiredFormat = scope.dropdown.selection;
                desiredFormat = desiredFormat.toString().replace(/\s/g, '');
                exportFrame(spriteComp, desiredFormat);

                // remove composition
                spriteComp.remove();

                // restore animation layers
                for (var i = 0; i < comp.layers.length; i++)
                {
                    var layer = comp.layer(i + 1);
                    for (var j = 0; j < animationLayers.length; j++)
                    {
                        if (layer.name === animationLayers[j].name)
                        {
                            layer.timeRemapEnabled = true;
                            layer.expression = animationLayers[j].expression;
                        }
                    }
                }

            }

        }


        function OnSetupForAnimationClick()
        {
            var scriptName = "Setup Animmation";
            var activeItem = app.project.activeItem;

            if ((activeItem == null) || !(activeItem instanceof CompItem))
            {
                alert("Please select or open a composition first.", scriptName);
                return;
            }
            else
            {
                var selectedLayers = activeItem.selectedLayers;

                if (activeItem.selectedLayers.length == 0)
                {
                    alert("Please select a layer in the active comp first.", scriptName);
                    return;
                }
                else
                {
                    var layer = selectedLayers[0];

                    if (!layer.canSetTimeRemapEnabled)
                    {
                        alert("This layer cannot be time remapped. Please Use Comps or MovieClips.", scriptName);
                        return;

                    } else {
                        layer.timeRemapEnabled = true;
                    }

                    app.beginUndoGroup("Sheetah");

                    layer.Effects.addProperty("Slider Control");
                    layer.property("Time Remap").expression = '(Math.min( parseInt(source.duration/source.frameDuration - 1), Math.max( 0,  parseInt(effect("Slider Control")("Slider")) ) ) | 0)/(1/thisComp.frameDuration)';

                    // advance layer to end of composition
                    layer.inPoint = 0;
                    layer.outPoint = activeItem.duration;

                    // move keyframes for good looks
                    var timeVal = layer.property("Time Remap").keyValue(2);
                    layer.property("Time Remap").setValueAtTime(activeItem.duration, timeVal);
                    layer.property("Time Remap").removeKey(2);

                    // add expression to slider map ranges according to comp Values
                    var slider = ((layer.property("Effects")).property("Slider Control")).property("Slider");
                    slider.setValueAtTime(0, 0);
                    //slider.expression = "Math.min( parseInt(source.duration/source.frameDuration), Math.max( 0, value ) ) | 0";

                    layer.effectsActive = true;

                    app.endUndoGroup();
                }
            }
        }

        
        function OnExportAnimationsClick()
        {
            var scriptName = "Export Animations";
            var activeItem = app.project.activeItem;

            if ((activeItem == null) || !(activeItem instanceof CompItem))
            {
                alert("Please select or open a composition first.", scriptName);
                return;
            }
            else
            {
                var animations = [];
                
                var activeComp = activeItem;
                for (var i = 0; i < activeComp.layers.length; i++)
                {
                    var layer = activeComp.layer(i + 1);
                    var layerEffects = undefined;
                    var layerSliderControl = undefined;

                    layerEffects = layer.property("Effects");
                    layerSliderControl = (!!layerEffects) ? layerEffects.property("Slider Control") : undefined;

                    if (!!layerEffects && !!layerSliderControl && layer.timeRemapEnabled)
                    {
                        var anim = {};
                        anim.name = layer.name;
                        anim.frameRate = activeComp.frameRate;
                        anim.frameDuration = activeComp.frameDuration;
                        anim.duration = layer.outPoint;
                        anim.length = parseInt(anim.duration / activeComp.frameDuration);
                        anim.frames = [];

                        var time = 0.0;
                        for (var frame = 0; frame < anim.length; frame++)
                        {
                            anim.frames.push(layer.property("Time Remap").valueAtTime(time, false) * (1 / activeComp.frameDuration));
                            time = time + activeComp.frameDuration;
                        }

                        for (var j = 0; j < animations.length; j++)
                        {
                            if (anim.name === animations[j].name)
                            {
                                layer.name += '_' + i;
                                anim.name = layer.name;
                            }
                        }

                        animations.push(anim);
                    }
                    else
                    {
                        //primitive error handling
                        var error = "The layer " + layer.name;
                        if (!layer.timeRemapEnabled) {
                            error += " has no Time Remapping";
                        } else if (!(!!layerEffects)) {
                            error += " has no Effects attached";
                        } else if (!(!!layerSliderControl)) {
                            error += " has no Slider Control attached";
                        }
                        error += ". Did you 'Setup' the layer ?";
                        alert(error, scriptName);
                    }

                }
                
                if (!(!!scope.checkbox.value))
                {
                    var res = "";
                    for (var t = 0; t < animations.length; t++)
                    {
                        res += animations[t].name + "\r\n" + animations[t].frames.toString() + "\r\n" + "\r\n";
                    }

                    scope.modal = new Window("window", "Animations");
                    scope.modal.margins = [5, 5, 5, 5];
                    scope.modal.alignChildren = 'left';
                    scope.modalText = scope.modal.add("editText", [0, 0, 240, 300], "", {
                        readonly: true,
                        borderless: true,
                        multiline: true,
                        scrollable: true
                    });
                    scope.modalText.text = res;
                    scope.modal.show();
                }
                else
                {
                    writeTxtFile(JSON.stringify(animations));
                }
            }
        }
        
        
        function SaveSetting(name, value)
        {
            app.settings.saveSetting("NerveNetSpritesheetCreator", name, value);
        }
        
        function LoadSetting(name, defaultValue)
        {
            if (app.settings.haveSetting("NerveNetSpritesheetCreator", name))
            {
                return app.settings.getSetting("NerveNetSpritesheetCreator", name);
            }
            return defaultValue;
        }


        function ResourceFile(relativePath)
        {
            return new File(ResourceFilePath(relativePath));
        }
        function ResourceFilePath(relativePath)
        {
            return ((new File($.fileName)).path) + '/SpritesheetCreatorResources/' + relativePath;
        }
        
        
        function AddButton(palette, buttonLabel, onclickfunc, rect)
        {
            var newButton = palette.add("button", rect, buttonLabel);
            newButton.onClick = onclickfunc;
            return newButton;
        }
        
        function AddDivider(panel)
        {
            var divider = panel.add("image", [0, 0, windowWidth, 3], ResourceFilePath('divider.png'));
            divider.margin = 0;
            divider.spacing = 0;
            divider.padding = 0;
        }

        function BuildUI(thisObj)
        {
            var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "NerveNet Spritesheet Creator", undefined, {resizeable: true});
            panel.margins = 9;
            panel.margins.top = 3;
            panel.margins.bottom = 3;
            panel.spacing = 9;
            panel.alignChildren = 'center';


            // Logo Group
            var logoGroup = panel.add("group", undefined);
            logoGroup.orientation = 'stack';
            logoGroup.alignChildren = ['right', 'bottom'];
            logoGroup.spacing = 1;
            logoGroup.margin = 1;
            
            // logo
            var logoImage = logoGroup.add("image", [0, 0, windowWidth, 50], ResourceFilePath('logo.png'));
            logoImage.onClick = function () { ResourceFile('github.html').execute(); };

            // logo version group
            var logoVersionGroup = logoGroup.add("group", undefined);
            logoVersionGroup.orientation = 'row';
            logoVersionGroup.alignChildren = ['right', 'bottom'];
            logoVersionGroup.spacing = 1;

            // version text
            var versionText = logoVersionGroup.add("statictext", undefined, "v" + version);

            // help button
            var helpButton = logoVersionGroup.add("iconbutton", [0, 0, 20, 20], ResourceFilePath('help.png'), {style: 'toolbutton'});
            helpButton.onClick = function ()
            {
                versionText.value = false;
                ResourceFile('github.html').execute();
            };


            // Divider
            AddDivider(panel);

            
            // Spritesheet Tools
            var dimensionsPanel = panel.add("panel", [0, 0, windowWidth, 30], "Dimensions (Columns x Rows)");
            dimensionsPanel.orientation = 'column';
            
            var dimensionsGroup = dimensionsPanel.add("group", [0, 0, 120, 24]);
            dimensionsGroup.spacing = 0;

            scope.columnCount = dimensionsGroup.add("editText {justify: 'center'}", [0, 0, 60, 24], '', {borderless: false});
            dimensionsGroup.add("staticText {justify: 'center', text:'x'}", [0, 0, 20, 24]);
            scope.rowCount = dimensionsGroup.add("editText {justify: 'center'}", [0, 0, 60, 24], '', {borderless: false});
            scope.rowCount.align = [ScriptUI.Alignment.CENTER, ScriptUI.Alignment.CENTER];
            scope.columnCount.text = LoadSetting("SpritesheetColumnCount", "auto");
            scope.rowCount.text =  LoadSetting("SpritesheetRowCount", "auto");
            scope.columnCount.onChange = function ()
            {
                var count = parseInt(scope.columnCount.text);
                if (!isNaN(count)) {
                    var num = Math.max(1, Math.abs(count));
                    scope.columnCount.text = num.toString();
                    scope.rowCount.text = "auto";
                } else {
                    scope.columnCount.text = "auto";
                }
                SaveSetting("SpritesheetColumnCount", scope.columnCount.text);
                SaveSetting("SpritesheetRowCount", scope.rowCount.text);
            }
            scope.rowCount.onChange = function ()
            {
                var count = parseInt(scope.rowCount.text);
                if (!isNaN(count)) {
                    var num = Math.max(1, Math.abs(count));
                    scope.rowCount.text = num.toString();
                    scope.columnCount.text = "auto";
                } else {
                    scope.rowCount.text = "auto";
                }
                SaveSetting("SpritesheetColumnCount", scope.columnCount.text);
                SaveSetting("SpritesheetRowCount", scope.rowCount.text);
            }

            
            // Max Spritesheet Width Group
            var maxWidthGroup = panel.add("group", [0, 0, windowWidth, 24]);

            maxWidthGroup.add("statictext", [0, 0, 115, 24], "Max Spritesheet Width");
            
            var maxWidthOptions = ["none", "128", "256", "512", "1024", "2048", "4096", "8192"];
            scope.maxWidthDropdown = maxWidthGroup.add("dropdownlist", [0, 0, 60, 24], maxWidthOptions);
            var maxWidthSetting = LoadSetting("SpritesheetMaxWidth", "none");
            if (maxWidthSetting === null || maxWidthSetting === "") maxWidthSetting = "none";
            scope.maxWidthDropdown.selection = parseInt(maxWidthSetting);
            scope.maxWidthDropdown.onChange = function () {
                SaveSetting("SpritesheetMaxWidth", scope.maxWidthDropdown.selection.index);
            }


            // Force Power Of Two Texture Size Group
            scope.powerOfTwo = panel.add("checkbox", [0, 0, windowWidth, 24], "Force Size to Power Of Two");
            scope.powerOfTwo.value = (LoadSetting("PowerOfTwo", "false") === "true") ? true : false;
            scope.powerOfTwo.onClick = function () {
                SaveSetting("PowerOfTwo", scope.powerOfTwo.value.toString())
            }

            
            // group
            var spritesheetGroup = panel.add("group", [0, 0, windowWidth, 30]);

            AddButton(spritesheetGroup, "Create Spritesheet", OnCreateSpritesheetClick, [0, 0, 115, 30]);

            // format dropdown and options
            var fileFormatOptions = ["png"/*, "psd"*/, "tga", "tif"];
            scope.dropdown = spritesheetGroup.add("dropdownlist", [0, 0, 60, 24], fileFormatOptions);
            scope.dropdown.onChange = function () {
                SaveSetting("SpritesheetFileFormat", fileFormatStr);
            }
            var fileFormatStr = LoadSetting("SpritesheetFileFormat", "png");
            var fileFormatIndex = 0;
            if (fileFormatStr === "png") fileFormatIndex = 0;
            //else if (fileFormatStr === "psd") fileFormatIndex = 1;
            else if (fileFormatStr === "tga") fileFormatIndex = 1;
            else if (fileFormatStr === "tif") fileFormatIndex = 2;
            scope.dropdown.selection = fileFormatIndex;


            // Divider
            AddDivider(panel);


            // Animation Tools
            AddButton(panel, "Setup for Animation", OnSetupForAnimationClick, [0, 0, windowWidth, 30]);

            AddButton(panel, "Export Animations", OnExportAnimationsClick, [0, 0, windowWidth, 30]);
            
            scope.checkbox = panel.add("checkbox", [0, 0, windowWidth, 24], "Export Animations to JSON File");
            scope.checkbox.value = (LoadSetting("ExportAnimationsToJson", "false") === "true") ? true : false;
            scope.checkbox.onClick = function () {
                SaveSetting("ExportAnimationsToJson", scope.checkbox.value.toString());
            }


            panel.layout.layout(true);
            return panel;
        }


        var SpritesheetToolsUI = BuildUI(thisObj);
        if (SpritesheetToolsUI != null && SpritesheetToolsUI instanceof Window)
        {
            SpritesheetToolsUI.center();
            SpritesheetToolsUI.show();
        }
    }

    
    JSON2API();
    SpritesheetTools(this);
}