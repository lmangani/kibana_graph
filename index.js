module.exports = function (kibana) {

  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/graph_vis/network_vis'
      ]
    }
  });

};
