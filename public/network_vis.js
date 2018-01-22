import "plugins/graph_vis/network_vis.less";
import 'plugins/graph_vis/network_vis_controller';
import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { VisSchemasProvider } from 'ui/vis/schemas';
import networkVisTemplate from 'plugins/graph_vis/network_vis.html';
import networkVisParamsTemplate from 'plugins/graph_vis/network_vis_params.html';

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(NetworkVisTypeProvider);

// define the TableVisType
function NetworkVisTypeProvider(Private) {
  const TemplateVisType = Private(TemplateVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);
  // return the visType object, which kibana will use to display and configure new
  // Vis object of this type.
  return new TemplateVisType({
    name: 'network',
    title: 'Network',
    icon: 'fa-share-alt',
    description: 'Displays aggregations as an interactive Graph network of related nodes.',
    template: networkVisTemplate,
    params: {
      defaults: {
        showLabels: true,
        showPopup: false,
        nodeFilter: false,
	hideEdgesOnDrag: false,
        showColorLegend: true,
        nodePhysics: true,
        firstNodeColor: '#FD7BC4',
        secondNodeColor: '#00d1ff',
        canvasBackgroundColor: '#FFFFFF',
        shapeFirstNode: 'dot',
        shapeSecondNode: 'box',
        displayArrow: false,
        posArrow: 'to',
        shapeArrow: 'arrow',
        smoothType: 'continuous',
        scaleArrow: 1,
        maxCutMetricSizeNode: 5000,
        maxCutMetricSizeEdge: 5000,
        minCutMetricSizeNode: 0,
        maxNodeSize: 80,
        minNodeSize: 8,
        maxEdgeSize: 20,
        minEdgeSize: 0.1,
        springConstant: 0.001,
        gravitationalConstant: -35000,
        labelColor: '#000000'
      },
      editor: networkVisParamsTemplate
    },

    ////////MIRAR THIS
    hierarchicalData: function (vis) {
      return true;
    },
    ////////////////////

    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'size_node',
        title: 'Node Size',
        max: 1
      },
      {
        group: 'metrics',
        name: 'size_edge',
        title: 'Edge Size',
        max: 1
      },
      {
        group: 'buckets',
        name: 'first',
        icon: 'fa fa-circle-thin',
        mustBeFirst: 'true',
        title: 'Node',
        min: 1,
        aggFilter: ['terms']
      }
    ])
  });
}

export default NetworkVisTypeProvider;
