/*
Created by Kumar from Vizplum Corporation 

*/


define(["jquery"], function($, cssContent) {
    'use strict';
    $("<style>").html(cssContent).appendTo("head");

    return {
        initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 50,
                    qHeight: 50
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 1,
                    max: 1
                },
                measures: {
                    uses: "measures",
                    min: 0,
                    max: 1
                },
                sorting: {
                    uses: "sorting"
                },
                settings: {
                    uses: "settings",


                    items: {
                        MarqueeType: {
                            ref: "MarqueeType",
                            type: "string",
                            component: "dropdown",
                            label: "Marquee Type",
                            options: [{
                                value: "Right to Left",
                                label: "Right to Left"
                            }, {
                                value: "Left to Right",
                                label: "Left to Right"
                            }, {
                                value: "Top to Bottom",
                                label: "Top to Bottom"
                            }, {
                                value: "Bottom to Top",
                                label: "Bottom to Top"
                            }],
                            defaultValue: "Right to Left"
                        },
                        BackgroundColor: {
                            type: "string",
                            ref: "BackgroundColor",
                            label: "Background color",
                            expression: "always",
                            defaultValue: "transparent"
                        },
                        TextColor: {
                            type: "string",
                            ref: "TextColor",
                            label: "Text color",
                            expression: "always",
                            defaultValue: "#545352"
                        },

                        FontFamily: {
                            type: "string",
                            ref: "FontFamily",
                            label: "Font Family",
                            expression: "always",
                            defaultValue: "verdana"
                        },
                        FontType: {
                            type: "string",
                            component: "dropdown",
                            label: "Font Type",
                            ref: "FontType",
                            options: [{
                                value: "Bold",
                                label: "Bold"
                            }, {
                                value: "Normal",
                                label: "Normal"
                            }]
                        },
                        FontSize: {
                            type: "string",
                            ref: "FontSize",
                            label: "Font Size",
                            expression: "always",
                            defaultValue: "100%"
                        },
                        selection: {
                            type: "string",
                            component: "dropdown",
                            label: "Selection mode",
                            ref: "selectionMode",
                            options: [{
                                value: "YES",
                                label: "Enabled"
                            }, {
                                value: "NO",
                                label: "Disabled"
                            }]
                        }



                    }



                }
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },

        paint: function($element, layout) {

            // Chart object width
            var width = $element.width();
            // Chart object height
            var height = $element.height();
            // Chart object id
            var id = "container_" + layout.qInfo.qId;
            console.log('height & width', height + " " + width);
            // Check to see if the chart element has already been created
            if (document.getElementById(id)) {
                // if it has been created, empty it's contents so we can redraw it
                $("#" + id).empty();
            } else {
                // if it hasn't been created, create it with the appropriate id and size
                $element.append($('<div />').attr({
                    "id": id,
                    "class": "qv-object-Marquee"
                }).css({
                    height: height,
                    width: width,
                    overflow: 'auto'
                }))
            }



            var html = "",
                self = this,
                lastrow = 0,
                morebutton = false,
                MarqueeStyle = "";
            if (layout.MarqueeType == 'Bottom to Top')
                MarqueeStyle = 'direction="up"';
            else if (layout.MarqueeType == 'Left to Right')
                MarqueeStyle = 'direction="Right"';
            else if (layout.MarqueeType == 'Top to Bottom')
                MarqueeStyle = 'direction="down"';

            html = html + "<marquee " + MarqueeStyle + " bgcolor=" + layout.BackgroundColor + " WIDTH=" + width + " HEIGHT=" + height + '>';


            var id = "container_" + layout.qInfo.qId;
            $("#" + id).css('cursor', 'default');
            //console.log("test",id);
            //console.log("Test:",layout.qHyperCube.qDataPages[0].qMatrix)
            var style1, FontType;

            if (layout.FontType == 'Bold')
                FontType = '<h1 ';
            else
                FontType = '<p ';

            if (layout.MarqueeType == 'Right to Left' || layout.MarqueeType == 'Left to Right') {
                style1 = 'style="cursor:pointer;color:' + layout.TextColor + ';' + 'font-family:' + layout.FontFamily + ';' + 'font-size:' + layout.FontSize + '; line-height:' + height + 'px;';
                html += FontType + style1 + '">';
            } else {
                style1 = 'style="cursor:pointer;color:' + layout.TextColor + ';' + 'font-family:' + layout.FontFamily + ';' + 'font-size:' + layout.FontSize + ';';
                html += FontType + style1 + '">';
            }


            var data = layout.qHyperCube.qDataPages[0].qMatrix
                .map(function(r) {
                    var row = {};

                    r.forEach(function(d, i) {
                        if (i == 0) {
                            if (layout.MarqueeType == 'Bottom to Top' || layout.MarqueeType == 'Top to Bottom')
                                html += FontType + style1 + '">';
                            html += '<de ' + ' class="data state' + d.qState + '" data-value="' + d.qElemNumber + '">';
                            html += d.qText;
                        } else {
                            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + d.qText;
                            html += "</de>";
                            if (layout.MarqueeType == 'Bottom to Top' || layout.MarqueeType == 'Top to Bottom')
                                html += "<br>";

                        }
                    });
                    html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

                });


            html += "</marquee>";
            $element.html(html);
		  console.log(html);

            if (this.selectionsEnabled && layout.selectionMode !== "NO") {

                $element.find('de').on('qv-activate', function() {
                    if (this.hasAttribute("data-value")) {
                        var value = parseInt(this.getAttribute("data-value"), 10),
                            dim = 0;
					  console.log(value);
                        self.backendApi.selectValues(dim, [value], false);
                    }
                });


            }



        }


    };

});