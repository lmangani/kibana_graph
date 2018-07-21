import { uiModules } from 'ui/modules';
import { notify } from 'ui/notify';
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';
import { AggTypesBucketsCreateFilterTermsProvider } from 'ui/agg_types/buckets/create_filter/terms';
import { AggTypesBucketsCreateFilterFiltersProvider } from 'ui/agg_types/buckets/create_filter/filters';
import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';

// get the kibana/table_vis module, and make sure that it requires the "kibana" module
const module = uiModules.get('kibana/transform_vis', ['kibana']);
//import the npm modules
const visN = require('vis');
const randomColor = require('randomcolor');
const ElementQueries = require('css-element-queries/src/ElementQueries');
const ResizeSensor = require('css-element-queries/src/ResizeSensor');


// add a controller to the module, which will transform the esResponse into a
// tabular format that we can pass to the table directive
module.controller('KbnNetworkVisController', function ($scope, $sce, $timeout, Private) {
    var network_id = "net_" + $scope.$id;
    var loading_id = "loading_" + $scope.$parent.$id;

    const queryFilter = Private(FilterBarQueryFilterProvider);
    const createTermsFilter = Private(AggTypesBucketsCreateFilterTermsProvider);
    const createFilter = Private(AggTypesBucketsCreateFilterFiltersProvider);
    const tabifyAggResponse = Private(AggResponseTabifyProvider);

    $scope.errorCustom = function(message, hide){
      if(!message) message = "General Error. Please undo your changes.";
      if(hide) {
	$("#" + network_id).hide();
      	$("#" + loading_id).hide();
      }
      notify.error(message);
    }

    $scope.initialShows = function(){
      $("#net").show();
      $("#loading").show();
      $("#errorHtml").hide();
    }

    $scope.startDynamicResize = function(network){
        new ResizeSensor($("#net"), function() {
            network.setSize('100%', '100%');
        });
    }

    $scope.drawColorLegend = function(usedColors, colorDicc){
        var canvas = document.getElementsByTagName("canvas")[0];
        var context = canvas.getContext("2d");

        context.fillStyle="#FFE8D6";
        var totalheight = usedColors.length * 25
        context.fillRect(canvas.width*(-2)-10, canvas.height*(-2)-18, 350, totalheight);

        context.fillStyle = "black";
        context.font = "bold 30px Arial";
        context.textAlign = "start";
        context.fillText("LEGEND OF COLORS:", canvas.width*(-2), canvas.height*(-2));

        var p=canvas.height*(-2) + 40;
        for(var key in colorDicc){
            context.fillStyle = colorDicc[key];
            context.font = "bold 20px Arial";
            context.fillText(key, canvas.width*(-2), p);
            p = p +22;
        }
    }
    $scope.$watchMulti(['esResponse',  'vis.params.secondNodeColor', 'searchSource.rawResponse'], function () {
   // $scope.$watchMulti(['esResponse', 'vis.params.secondNodeColor', 'searchSource.rawResponse'], function ([resp]) {
	  if (!$scope.vis && (!$scope.searchSource && !$scope.searchSource.rawResponse) ) {
             $scope.table = null;
	     $scope.errorCustom('No results from Tabify!',$scope.searchSource.rawResponse);
	     $("#loading").hide();  
          } else if ($scope.esResponse && $scope.vis && $scope.searchSource ) {
            var resp = $scope.esResponse;
            $("#loading").hide();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////NODE-NODE-RELATION Type///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if($scope.vis.aggs.bySchemaName['first'].length >= 1){

	        if (popupMenu !== undefined) {
		    popupMenu.parentNode.removeChild(popupMenu);
		    popupMenu = undefined;
		}

                $scope.initialShows();
                $(".secondNode").hide();

		var dataNodes = [];
		var dataEdges = [];
		var dataNodesId = [];
		var dataNodesCol = [];
		var dataBuckets = [];
		var ixx = 0;
		var popupMenu = undefined;

		var getRandomColor = function(seed){
		    var opt = {};
		    if (seed) opt.seed = seed;
		    while(true){
			var confirmColor = randomColor(opt);
                        if(dataNodesCol[seed] || dataNodesCol.indexOf(confirmColor) == -1){
                             dataNodesCol.push(confirmColor);
                             dataNodesCol[seed] = confirmColor;
                             return confirmColor;
                        }
		    }
		}

		var dataMetrics = $scope.dataMetrics = [];
		$scope.processTableGroups = function (tableGroups) {
   		  tableGroups.tables.forEach(function (table) {
   		    table.rows.forEach(function (row, i) {
			row.forEach(function (item, r){
				var rootCol = table.columns[r].title.split(':')[0];
				var rootId = r / 2;
				if(r % 2 === 0) {
		   		      dataMetrics.push({
		   		        bucket: rootCol,
		   		        id: rootId,
		   		        value: item
		   		      });
				}
			});
		    });
   		  });
   		};

		try {
			$scope.errorCustom('Attempting Tabify',$scope.searchSource);
			var tableGroups = tabifyAggResponse($scope.vis, $scope.searchSource.rawResponse, {
			    canSplit: false,
			    asAggConfigResults: true,
			    partialRows: true
			 });
			
		} catch(e) { 
			$scope.errorCustom('tablegroup error', e, $scope.searchSource.rawResponse); 
			var tableGroups = null; 
		}


		var buckeroo = function(data,akey,bkey){
		  for (var kxx in data) {
		    if (!data.hasOwnProperty(kxx)) continue;
		    var agg = data[kxx];

		    if (agg.key && agg.key.length>0) {

			var found = dataNodes.some(function (el) {
			    return el.key === agg.key;
			});

		        if (!found||!dataNodesId[agg.key]) {
				dataNodesId[agg.key] = ixx;
				// dataNodesCol[agg.key] = randomColor();

			        var nodeReturn = {
					id: dataNodesId[agg.key],
					key: agg.key,
					label: agg.key,
					value: agg.doc_count,
					color: getRandomColor(agg.key),
					shape: $scope.vis.params.shapeFirstNode,
        		                font : {
		                          color: $scope.vis.params.labelColor
		                        }
				};

		                //If activated, show the labels
			        if($scope.vis.params.showLabels){
		                    nodeReturn.label = agg.key;
		                }

		                //If activated, show the popups
		                if($scope.vis.params.showPopup){
		                    var inPopup = "<p>" + agg.key + "</p>";
		                    if(akey){
		                      inPopup += "<p> Parent: " + akey + "</p>";
				    }
		                    nodeReturn.title = inPopup;
		                }

			        dataNodes.push(nodeReturn);
			}

		        if (akey) {
				dataEdges.push({ from: dataNodesId[akey], value: agg.doc_count, to: dataNodesId[agg.key] });
			}

			ixx++;
		    }

		    if (agg.buckets) {
		        buckeroo(agg.buckets,agg.key);
		    } else {
		      // level down
		      for (var ak in agg) {
		         if (agg[ak].buckets) {
				buckeroo(agg[ak].buckets,agg.key,akey);
			}
		      }
		    }
		  }
		}

                if($scope.vis.aggs.bySchemaName['colornode']){
                        $scope.errorCustom('Color Node is not allowed in Multi-Node mode. Please remove and try again!',1);
                        return;
                }

                // Retrieve the metrics aggregation configured
                if($scope.vis.aggs.bySchemaName['size_node']){
                    var metricsAgg_sizeNode = $scope.vis.aggs.bySchemaName['size_node'][0];
                }
                if($scope.vis.aggs.bySchemaName['size_edge']){
                    var metricsAgg_sizeEdge = $scope.vis.aggs.bySchemaName['size_edge'][0];
                }

//////////////// BUCKET SCANNER ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		try {
			$scope.processTableGroups(tableGroups);
			buckeroo(resp.aggregations);
		} catch(e) {
	                $scope.errorCustom('OOps! Aggs to Graph error: '+e);
			return;
		}
//////////////////////////////////////////////////////////Creation of the network with the library//////////////////////////////////////////////////////////
                var nodesDataSet = new visN.DataSet(dataNodes);
                var edgesDataSet = new visN.DataSet(dataEdges);

                // Creation of the network
                var container = document.getElementById(network_id);
                //Set the Height
                container.style.height = container.getBoundingClientRect().height;
                container.height = container.getBoundingClientRect().height;
                //Set the Data
                var data = {
                    nodes: nodesDataSet,
                    edges: edgesDataSet
                };
                //Set the Options
                var options = {
                    height: container.getBoundingClientRect().height.toString(),
                    physics: {
                        barnesHut: {
                            gravitationalConstant: $scope.vis.params.gravitationalConstant,
                            springConstant: $scope.vis.params.springConstant,
                            springLength: 500
                        }
                    },
                    edges: {
                        arrows: {
                            to: {
                                enabled: $scope.vis.params.displayArrow,
                                scaleFactor: $scope.vis.params.scaleArrow,
                                type: $scope.vis.params.shapeArrow
                            }
                        },
                        arrowStrikethrough: false,
                        smooth: {
                            type: $scope.vis.params.smoothType
                        },
                        scaling:{
                            min:$scope.vis.params.minEdgeSize,
                            max:$scope.vis.params.maxEdgeSize
                        }
                    },
                    interaction: {
                        hideEdgesOnDrag: $scope.vis.params.hideEdgesOnDrag,
                        hover: true
                    },
                    nodes: {
                        physics: $scope.vis.params.nodePhysics,
                        scaling:{
                            min:$scope.vis.params.minNodeSize,
                            max:$scope.vis.params.maxNodeSize
                        }
                    },
                    layout: {
                        improvedLayout: false
                    }
                }
                console.log("Create aggs network now");
                var network = new visN.Network(container, data, options);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		var noContext = function(){
      		  if (popupMenu !== undefined) {
      		    popupMenu.parentNode.removeChild(popupMenu);
      		    popupMenu = undefined;
      		  }
		}

                $scope.startDynamicResize(network);

                network.on("afterDrawing", function (canvasP) {
                    $("#" + loading_id).hide();
                    // Draw the color legend if Node Color is activated
                    if($scope.vis.params.showColorLegend){
                        $scope.drawColorLegend(dataNodesId, dataNodesCol);
                    }
                });

                network.on("doubleClick", function (params) {
                    if($scope.vis.params.nodeFilter){
		      if(!params.nodes) return;
		      for (var nkey in dataNodesId) {
			if (dataNodesId[nkey] === params.nodes[0]) {
			  for (var mkey in dataMetrics) {
			    var zbucket = 0;
			    if (dataMetrics[mkey].value === nkey) {
				if (!dataMetrics[mkey].id) {
				     zbucket = 0;
				} else {
				     zbucket = dataMetrics[mkey].id;
				}
			  	try {
				        /* console.log('Current Filters:', queryFilter.getFilters() ); */
					const aggTermsConfig = $scope.vis.aggs.byTypeName.terms[zbucket];
	      				var xfilter = createTermsFilter(aggTermsConfig, nkey);
					if (xfilter) { queryFilter.addFilters([xfilter]); }
					break;
				} catch(e) { $scope.errorCustom('Error creating Filter: '+e); return; }
			    }
			  }
			}
		      }
		   }
		});

		// Context Menu + dragStart
		network.on('select', function(params) {
			noContext();
      		});
		network.on('dragStart', function(params) {
			noContext();
      		});

		// Context Click Event
		network.on('onFilterClick', function(params) {
	  	  try {
		      var negate = params.negate || false;
		      var node = params.node;
		      // console.log('onFilterClick',negate,node,dataNodes[node]);
		      noContext();
		      // Create Filter
		      for (var nkey in dataNodesId) {
			if (dataNodesId[nkey] === node ) {
			  var zbucket = 0;
			  for (var mkey in dataMetrics) {
			    if (dataMetrics[mkey].value === nkey) {
				if (!dataMetrics[mkey].id) {
				     zbucket = 0;
				} else {
				     zbucket = dataMetrics[mkey].id;
				}
				const aggTermsConfig = $scope.vis.aggs.byTypeName.terms[zbucket];
	      			var xfilter = createTermsFilter(aggTermsConfig, nkey);
				if (xfilter) {
					if (negate) xfilter.meta.negate = true;
					queryFilter.addFilters([xfilter]);
				}
				break;
			    }
			  }
			}
		      }
		  } catch(e) { $scope.errorCustom('Error creating Filter: '+e); }
		});

		// Context Display
		network.on("oncontext", function (params) {
		        if(params.nodes && params.nodes.length>0){
		          var position = network.getPositions(params.nodes)[params.nodes[0]];
		          position = network.canvasToDOM(position);
		          params.event = "[original event]";
		          noContext();
			  try {
				  var radius = 1;
			          for (var nkey in dataNodes) {
				    if (dataNodes[nkey].id === params.nodes[0] && dataNodes[nkey].value) {
			              //console.log('Selected Node:', dataNodes[nkey].key);
				      radius = parseInt(dataNodes[nkey].value) || 1;
				    }
			          }
			  } catch(e) { $scope.errorCustom(e); }

		          popupMenu = document.createElement("div");
		          popupMenu.setAttribute('id','visjsContext');

			  // Alias hack pipe events towards network - replace w/ proper directive!
			  window.network = network;

			  var plus = document.createElement("span");
			  plus.setAttribute('id','kbnFilterPlus');
			  plus.setAttribute('role','button');
			  plus.setAttribute('onclick',"window.network.emit('onFilterClick',{ node:"+params.nodes[0]+",negate: false });");
		          plus.setAttribute('class','spacer fa fa-search-plus');
		          popupMenu.appendChild(plus);

			  var minus = document.createElement("span");
		          minus.setAttribute('class','spacer fa fa-search-minus');
			  minus.setAttribute('id','kbnFilterMinus');
			  minus.setAttribute('role','button');
			  minus.setAttribute('onclick',"window.network.emit('onFilterClick',{ node:"+params.nodes[0]+",negate: true });");
		          popupMenu.appendChild(minus);

			  // Attach Contextual Popover
		          var offsetLeft = container.offsetLeft;
		          var offsetTop = container.offsetTop;
		          popupMenu.className = 'popupMenu';
		          //popupMenu.style.left = position.x - (50 + radius) + 'px';
		          popupMenu.style.left = position.x - (25) + 'px';
		          popupMenu.style.top = position.y - (25) + 'px';
		          container.appendChild(popupMenu);
		        }
		});

		if(container) {
			container.addEventListener('contextmenu', function(e) {
     			  e.preventDefault();
			  return false;
     			});
		}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }else{
		$scope.errorCustom('Error: Please select at least one Node',1);
            }
        }
    });
});
