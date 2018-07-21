<img width=222 src="https://user-images.githubusercontent.com/1423657/35244908-15f41bd4-ffc2-11e7-9303-9a87a271d67a.png"/>

## Graph Network Plugin for Kibana 6.2.x

Kibana plugin to Visualize aggregations as an interactive [VisJS](http://visjs.org/docs/network) Graph network of related nodes.

##### Ideal companion of [gun](https://github.com/amark/gun), examples available at [gun-elastic](https://github.com/lmangani/gun-elastic)

### Git Install
```
cd $KIBANA_HOME/plugins
git clone https://github.com/lmangani/kbn_graph graph_vis -b 6.2.x
cd graph_vis
npm install
```
### Create Kibana Plugin archive (zip)
```
./release.sh
```

### Usage
* Choose an index
* Select a cascading set of Terms aggregations
* Hit Play

The plugin will automatically display a network of node with sizes and relations derived from the returned aggregations.


#### Infinite Nodes
A (virtually) unlimited number of aggregations can be used to populate the network.
<img width=600 src="https://user-images.githubusercontent.com/1423657/35233538-b7edf334-ff9e-11e7-930b-ef3a35daff16.png"/>

![image](https://user-images.githubusercontent.com/1423657/35237124-f135b018-ffa9-11e7-8375-12665257c04b.png)

#### Interactive Context Filtering
Nodes can be used to generate positive or negative Kibana filters.
<img width=600 src="https://user-images.githubusercontent.com/1423657/35233387-50a40736-ff9e-11e7-9d6b-56bf791115f6.gif"/>


#### Consistent Colors
Consistent colors for nodes are automatically seeded by the key-value with no user interaction.


### Acknowledgement

Plugin Based on a Fork of the awesome [kbn_network](https://dlumbrer.github.io/kbn_network/)

Elasticsearch and Kibana are trademarks of Elasticsearch BV, registered in the U.S. and in other countries.


