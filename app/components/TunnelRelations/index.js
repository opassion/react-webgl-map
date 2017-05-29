import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LinearScale from 'linear-scale';
import DeckGL, { LineLayer, PolygonLayer, PointCloudLayer, IconLayer } from 'deck.gl';
import LabelLayer from './label-layer';

import { updateTopology } from 'containers/HomePage/actions';
import { middlePoint } from 'utils/geoLib';

import iconA from './icons/pin-a.png';
import iconO from './icons/tower_red.svg';
import iconD from './icons/tower_grey.svg';

const towerIconScale = LinearScale([8, 17], [0, 40]);
const iconScale = LinearScale([0, 17], [0, 50]);
const fontScale = LinearScale([10, 17], [16, 24]);
const colorScale = LinearScale([0, 6], [0, 255]);

const LIGHT_SETTINGS = {
  lightsPosition: [-74.05, 40.7, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.0, 0.0, 0.0, 0.0],
  numberOfLights: 2,
};

function filterData(nodes) {
  const data = [];
  const processed = {};
  nodes.forEach(n => {
    const sNode = n.sourceNodeId;
    const tNode = n.targetNodeId;

    const id = [sNode, tNode].sort().join(':');

    if (!data.length) {
      data.push(n);
      processed[id] = true;
    } else if (!processed[id]) {
      data.push(n);
      processed[id] = true;
    }
  });
  return data;
}

class TunnelRelations extends Component {

  constructor(props) {
    super(props);

    this.state = {
      highlightNode: -1,       // To point out highlighted Node
      highlightIp: -1,         // To point out highlighted IP
      highlightTunnel: -1,     // To point out highlighted Tunnel
      highlightLte: -1,        //To point out highlighted LTE
    };
  }

  componentWillReceiveProps(nextProps) {

  }

  _initialize(gl) {
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);
  }

  _onIPHover(info) {
    if (info.index != -1) {
      this.props.topologyPaths[0].relIps[info.index].highlighted = true;
    } else {
      this.props.topologyPaths[0].relIps[this.state.highlightIp].highlighted = false;
    }
    const newPath = [];
    newPath.push(this.props.topologyPaths[0]);
    this.props.onUpdateTopologyPath(newPath);
    this.setState({ highlightIp: info.index });
  }

  render() {
    const { viewport, topologyPaths, alarmEntries, currentIncident, strokeWidth, tunnelPaths } = this.props;

    const layers = [];

    // Add Service Outage Layer
    if (currentIncident) {
      const ICON_MAPPING = {
        marker: { x: 0, y: 0, width: 70, height: 74, mask: false },
      };

      const outageData = [];
      currentIncident.object.content.serviceOutage.forEach((entry) => {
        if (entry.geo.geometry.coordinates[0] != null) {
          entry.geo.geometry.coordinates[0] = parseFloat(entry.geo.geometry.coordinates[0]);
          entry.geo.geometry.coordinates[1] = parseFloat(entry.geo.geometry.coordinates[1]);
          entry.geo.geometry.coordinates[2] = this.props.viewport.zoom;

          outageData.push({
            position: entry.geo.geometry.coordinates,
            icon: 'marker',
            size: 40,
          });
        }
      });

      layers.push(
        new IconLayer({
          id: 'outage-icon-layer',
          data: outageData,
          iconAtlas: iconO,
          iconMapping: ICON_MAPPING,
          sizeScale: 1.5,
          getSize: (x) => towerIconScale(this.props.viewport.zoom),
        }),
      );
    }

    // Add Service Degradation Layer
    if (currentIncident) {
      const ICON_MAPPING = {
        marker: { x: 0, y: 0, width: 60, height: 60, mask: false, anchorY: 30 },
      };

      const degradationData = [];
      currentIncident.object.content.serviceDegradation.forEach((entry) => {
        if (entry.geo.geometry.coordinates[0] != null) {
          entry.geo.geometry.coordinates[0] = parseFloat(entry.geo.geometry.coordinates[0]);
          entry.geo.geometry.coordinates[1] = parseFloat(entry.geo.geometry.coordinates[1]);

          degradationData.push({
            position: entry.geo.geometry.coordinates,
            icon: 'marker',
            size: 40,
          });
        }
      });

      //console.log('deg', degradationData)

      layers.push(
        new IconLayer({
          id: 'degration-icon-layer',
          data: degradationData,
          iconAtlas: iconD,
          iconMapping: ICON_MAPPING,
          sizeScale: 1.5,
          getSize: (x) => towerIconScale(this.props.viewport.zoom),
        }),
      );
    }

    if (!topologyPaths) {
      return null;
    }

    topologyPaths.forEach((path) => {

      // Add Labels for Nodes
      layers.push(
        new LabelLayer({
          fontSize: fontScale(this.props.viewport.zoom),
          data: path.topologyNodes,
          getLabel: (x) => x.label,
          getPosition: (x) => x.labelPosition,
          getColor: (x) => [50, 50, 50],
          getSize: (x) => 1,
        }),
      );

      // Add Nodes, building
      layers.push(
        new PolygonLayer({
          id: 'topologyNodes',
          data: path.topologyNodes,
          extruded: true,
          wireframe: false,
          fp64: false,
          opacity: 0.5,
          getPolygon: (f) => f.polygon,
          getElevation: (f) => f.height,
          //getElevation: (f) => towerIconScale(this.props.viewport.zoom)*5,
          getFillColor: (f) => f.color,
          lightSettings: LIGHT_SETTINGS,
          pickable: true,
          onClick: this.props.onNodeClick,
        }),
      );

      const filteredRel = filterData(path.relIps);

      // Add IP Layer
      layers.push(
        new LineLayer({
          id: 'relation-paths-ip',
          data: filteredRel,
          strokeWidth: 6,
          fp64: false,
          getSourcePosition: (d) => d.targetLocation,
          getTargetPosition: (d) => d.sourceLocation,
          getColor: (d) => [32, 64, 146], // dark blue
          pickable: true,
          onClick: this.props.onIPClick,
          onHover: this._onIPHover.bind(this),
        }),
      );

      // Add Tunnel Layer
      layers.push(
        new LineLayer({
          id: 'relation-paths-tunnel',
          data: filterData(path.relTunnels),
          strokeWidth,
          fp64: false,
          getSourcePosition: (d) => d.targetLocation,
          getTargetPosition: (d) => d.sourceLocation,
          getColor: (d) => [8, 180, 251], // light blue
          pickable: true,
          onClick: this.props.onTunnelClick,
        }),
      );

      // LTE layer
      layers.push(
        new LineLayer({
          id: 'relation-paths-lte',
          data: filterData(path.relLTE),
          strokeWidth,
          fp64: false,
          getSourcePosition: (d) => d.targetLocation,
          getTargetPosition: (d) => d.sourceLocation,
          getColor: (d) => [235, 211, 23], // yellow
          pickable: true,
          onClick: (e) => console.log('lte', e),
        }),
      );

      if (tunnelPaths && tunnelPaths.length) {
        const layerCords = [];
        tunnelPaths.forEach((path, idx) => {
          path.rels.forEach(rel => {
            const relId = rel.relId;
            topologyPaths.forEach(tp => {
              tp.rels.forEach(r => {
                if (relId == r.relId) {
                  layerCords.push({
                    index: idx,
                    label: 'P'+ (idx+1),
                    color: [32, 64, 146],
                    coordinates: [...middlePoint(r.sourceLocation[1], r.sourceLocation[0], r.targetLocation[1], r.targetLocation[0]), idx == 0 ? 50 : (idx+1) * 50]
                  });
                }
              });
            });
          });
        });

        // add labels for highlighted
        layers.push(
          new LabelLayer({
            fontSize: 32,
            data: layerCords,
            getLabel: (x) => x.label,
            getPosition: (x) => x.coordinates,
            getColor: (x) => x.color,
            getSize: (x) => 1,
          }),
        );
      }

    });

    return (
      <DeckGL
        {...viewport}
        layers={layers}
        onWebGLInitialized={this._initialize}
      />
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateTopologyPath: (paths) => dispatch(updateTopology(paths)),
  };
}

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, mapDispatchToProps)(TunnelRelations);

TunnelRelations.propTypes = {
  onUpdateTopologyPath: React.PropTypes.func,
};
