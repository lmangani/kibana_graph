# Graph Network Plugin for Kibana 5.5.X

Kibana plugin producing interactive [VisJS](http://visjs.org/docs/network) Graph Visualization from Elastic aggregations.

##### Ideal companion of [gun](https://github.com/amark/gun), examples available at [gun-elastic](https://github.com/lmangani/gun-elastic)

## Git Install
```
cd $KIBANA_HOME/plugins
git clone https://github.com/lmangani/kbn_graph graph_vis
cd graph_vis
npm install
```

## Usage
* Choose an index
* Select a cascading set of Terms aggregations
* Hit Play

The plugin will automatically display a network of node with sizes and relations derived from the returned aggregations.


#### Infinite Nodes
A (virtually) unlimited number of aggregations can be used to populate the network.
<img width=600 src="https://user-images.githubusercontent.com/1423657/35233538-b7edf334-ff9e-11e7-930b-ef3a35daff16.png"/>

#### Interactive Context Filtering
Nodes can be used to generate positive or negative Kibana filters.
<img width=600 src="https://user-images.githubusercontent.com/1423657/35233387-50a40736-ff9e-11e7-9d6b-56bf791115f6.gif"/>

#### Consistent Colors
Consistent colors for nodes are automatically seeded by the key-value with no user interaction.

###### Enhanced Fork of the awesome [kbn_network](https://dlumbrer.github.io/kbn_network/)

