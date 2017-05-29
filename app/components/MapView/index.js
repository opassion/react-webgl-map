import React from 'react';
import MapGL from 'react-map-gl';
import { autobind } from 'core-decorators';
import styled from 'styled-components';
import axios from 'axios';
import sizeMe from 'react-sizeme';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';

import TunnelRelations from 'components/TunnelRelations';
import IncidentDetails from 'components/IncidentDetails';
import TunnelDetails from 'components/MapView/TunnelDetails';
import POIDetails from 'components/MapView/POIDetails';
import InterfaceDetails from 'components/MapView/InterfaceDetails';
import Legends from 'components/MapView/Legends';
import MapControl from './MapControl';

import { API_URL, MapboxAccessToken } from '../../constants';

const Container = styled.div`
  .overlays {
    width: 100%;
    height: 100%;
  }

`

@sizeMe()
@autobind
export default class MapView extends React.Component {
  static propTypes = {
    incidentId: React.PropTypes.number,
    incidentDetails: React.PropTypes.object,
    topologyData: React.PropTypes.array,
    alarms: React.PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      viewport: {
        longitude: 77.41948,
        latitude: 23.22246,
        zoom: 12,
        maxZoom: 16,
        pitch: 120,
        bearing: 0,
        width: 1500,
        height: 500,
      },
      strokeWidth: 6,
      layerHeight: 100,
      selectedNodeType: null,
      nodeDetails: null,
      tunnelPaths: null,
      interfaceDetails: null,
      selected: null,
    };
  }

  componentDidMount() {
    this.setState({
      viewport: { ...this.state.viewport, width: this.props.size.width },
      selectedNodeType: null,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.topologyData !== this.props.topologyData) {
      this.resetMapView(nextProps);
      this.setState({ selectedNodeType: null });
    }
  }

  closeOverlays() {
    this.setState({
      selectedNodeType: null,
    });
  }

  _onChangeViewport(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
      // strokeWidth: this.state.viewport.zoom / 2
    });
  }

  resetMapView(props) {
    let { viewport } = this.state;
    if (!props.topologyData.length) return;

    viewport = Object.assign(viewport, props.topologyData.viewport_zoom);

    this.setState({
      viewport: { ...viewport },
    });
  }

  _onClickFeatures(features) {
    // window.console.log(features);
  }

  onTunnelClick(e) {
    this.setState({
      tunnelPaths: null,
      selected: null,
      selectedNodeType: null
    });
    const relId = e.object.relId;
    axios.get(`${API_URL}/get-paths-in-tunnel?tunnel=${relId}`).then((resp) => {
      const data = resp.data;
      this.setState({ tunnelPaths: data.paths, selected: e.object, selectedNodeType: 'tunnel' });
      return data;
    });
  }

  onIPClick(e) {
    this.setState({
      tunnelPaths: null,
      interfaceDetails: null,
      selectedNodeType: null,
      selected: null
    });
    axios.get(`${API_URL}/get-interface-relationship-info?interface=${e.object.relId}`).then((resp) => {
      const data = resp.data;
      this.setState({ interfaceDetails: data, tunnelPaths: null, selectedNodeType: 'interface', selected: e.object });
    });
  }

  onNodeClick(e) {
    this.setState({
      nodeDetails: null,
      selectedNodeType: null,
      selected: null,
    });

    Promise.all([
      axios.get(`${API_URL}/topology-search?correlated_alarm_id=${this.props.incidentId || ''}&filter_group_id=${e.object.node.nodeId}&device_details=True`).then((resp) => resp.data.paths),
      axios.get(`${API_URL}/stream?query=select%20*%20from%20alarm%20where%20correlatedAlarmId=${this.props.incidentId || ''}&group_id=${e.object.node.nodeId}`).then((resp) => resp.data.entries)
    ]).then(([devices, alarms]) => {
      this.setState({ nodeDetails: { devices, alarms }, tunnelPaths: null, selectedNodeType: 'node', selected: e.object });
    });
  }

  renderSelectedTunnelDetails() {
    if (this.state.tunnelPaths && this.state.selectedNodeType == 'tunnel') {
      return <TunnelDetails data={this.state.tunnelPaths} name={this.state.selected.attrs.name} />;
    }

    return null;
  }

  renderNodeDetails() {
    if (this.state.nodeDetails && this.state.selectedNodeType == 'node') {
      return <POIDetails data={this.state.nodeDetails} />;
    }
  }

  renderInterfaceDetails() {
    if (this.state.interfaceDetails && this.state.selectedNodeType == 'interface') {
      return <InterfaceDetails data={this.state.interfaceDetails} />;
    }
  }

  onPitch(val) {
    const current = this.state.viewport.pitch;
    if(current < 0 || current > 61) return;
    this.setState({
      viewport: {
        ...this.state.viewport,
        pitch: val + current,
      },
    });
  }

  onRotate(val) {
    this.setState({
      viewport: {
        ...this.state.viewport,
        bearing: val + this.state.viewport.bearing,
      },
    });
  }

  navigateTo(cords) {
    this.setState({
      viewport: {
        ...this.state.viewport,
        longitude: cords[0],
        latitude: cords[1],
        zoom: 15,
      }
    });
  }

  getAlarmNodes() {
    const alarmNodes = [];
    flatten(this.props.topologyData).forEach(d => {
      d.nodes.forEach(n => {
        if (n.alarm.present) {
          alarmNodes.push({
            id: n.nodeId,
            display_name: n.attrs.display_name,
            coordinates: n.geo.geometry.coordinates
          });
        }
      });
    });

    return alarmNodes;
  }

  render() {
    const { viewport, strokeWidth, tunnelPaths } = this.state;
    const { topologyData, alarms, incidentDetails } = this.props;

    return (
      <Container>
        <MapGL
          {...viewport}
          mapboxApiAccessToken={MapboxAccessToken}
          onChangeViewport={this._onChangeViewport}
          onClickFeatures={this._onClickFeatures}
          perspectiveEnabled
          preventStyleDiffing={false}
        >
          <TunnelRelations
            viewport={viewport}
            strokeWidth={strokeWidth}
            topologyPaths={topologyData}
            alarmEntries={alarms && alarms.entries}
            currentIncident={incidentDetails}
            onNodeClick={this.onNodeClick}
            onIPClick={this.onIPClick}
            onTunnelClick={this.onTunnelClick}
            tunnelPaths={tunnelPaths}
          />
          {incidentDetails && <IncidentDetails data={incidentDetails} alarms={this.getAlarmNodes()} navigateTo={this.navigateTo} />}
          {this.renderSelectedTunnelDetails()}
          {this.renderNodeDetails()}
          {this.renderInterfaceDetails()}
          <Legends />
          <MapControl onRotate={this.onRotate} onPitch={this.onPitch} onReset={e => this.resetMapView(this.props)} />
        </MapGL>
      </Container>
    );
  }
}
