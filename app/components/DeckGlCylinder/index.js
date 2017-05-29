/* global window */
import React, {Component} from 'react';
import DeckGL, {HexagonLayer, PointCloudLayer} from 'deck.gl';
import {Matrix4} from 'luma.gl';

const LIGHT_SETTINGS = {
  lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
  ambientRatio: 0.45,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const elevationScale = {min: 1, max: 50};

const defaultProps = {
  radius: 1000,
  upperPercentile: 100,
  coverage: 1
};

function getPointCloud(data) {
  let _pointCloud = [];

  data.forEach((item) => {
    _pointCloud.push({
      position: [item.coordinates[0], item.coordinates[1], 100],
      normal: [1, 1, 0],
      color: [255, 0, 0]
    });
  })
  
  return _pointCloud;
}

function _getModelMatrix(index, offsetMode) {
  // the rotation controls works only for layers in
  // meter offset projection mode. They are commented out
  // here since layer browser currently only have one layer
  // in this mode.

  // const {settings: {separation, rotationZ, rotationX}} = this.state;
  // const {settings: {separation}} = this.state;
  // const {mapViewState: {longitude, latitude}} = this.props;
  // const modelMatrix = new Matrix4().fromTranslation([0, 0, 1000 * index * separation]);

  const modelMatrix = new Matrix4()
    .fromTranslation([0, 0, 1000 * index * 0]);

  // if (offsetMode) {
  //   modelMatrix.rotateZ(index * rotationZ * Math.PI);
  //   modelMatrix.rotateX(index * rotationX * Math.PI);
  // }

  return modelMatrix;
}


export default class DeckGlCylinder extends Component {

  static get defaultColorRange() {
    return colorRange;
  }

  static get defaultViewport() {
    return {
      longitude: -0.376227267397439,
      latitude: 51.88029525709689,
      zoom: 11.5,
      minZoom: 5,
      maxZoom: 15,
      pitch: 30,
      bearing: 0
    };
  }

  constructor(props) {
    super(props);
    this.startAnimationTimer = null;
    this.intervalTimer = null;
    this.state = {
      elevationScale: elevationScale.min,
      positionOrigin: [77.414485, 23.225397, 0]
    };

    this._startAnimate = this._startAnimate.bind(this);
    this._animateHeight = this._animateHeight.bind(this);

    this._animate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.length !== this.props.data.length) {
      this._animate();
    }
  }

  _animate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);

    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
  }

  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
  }

  _animateHeight() {
    if (this.state.elevationScale === elevationScale.max) {
      window.clearTimeout(this.startAnimationTimer);
      window.clearTimeout(this.intervalTimer);
    } else {
      this.setState({elevationScale: this.state.elevationScale + 1});
    }
  }

  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const {viewport, data, radius, coverage, upperPercentile} = this.props;

    if (!data) {
      return null;
    }

    const PointCloudLayerExample = {
      layer: PointCloudLayer,
      
      props: {
        data: getPointCloud(data),
        id: 'pointCloudLayer',
        outline: true,
        // projectionMode: 2,
        // positionOrigin: this.state.positionOrigin,
        // getPosition: d => get(d, 'position'),
        // getNormal: d => get(d, 'normal'),
        // getColor: d => get(d, 'color'),
        modelMatrix: _getModelMatrix(1, true),
        opacity: 1,
        radiusPixels: 4,
        pickable: true
      }
    };

    const layers = [
      // new HexagonLayer({
      //   id: 'heatmap',
      //   colorRange,
      //   coverage,
      //   data,
      //   elevationRange: [0, 3000],
      //   elevationScale: this.state.elevationScale,
      //   extruded: true,
      //   getPosition: d => d,
      //   lightSettings: LIGHT_SETTINGS,
      //   onHover: this.props.onHover,
      //   opacity: 1,
      //   pickable: Boolean(this.props.onHover),
      //   radius,
      //   upperPercentile
      // }),
      new PointCloudLayer(PointCloudLayerExample.props)
    ];
    return <DeckGL {...viewport} layers={layers} onWebGLInitialized={this._initialize} />;
  }
}

DeckGlCylinder.displayName = 'DeckGlCylinder';
DeckGlCylinder.defaultProps = defaultProps;
