import ReactMapGl from 'react-map-gl';
import LinearScale from 'linear-scale';

import { POI_ALARM_COLORS } from '../constants';

const viewportZoomScale = LinearScale([12, 17], [11, 13]);

export default function (paths) {
  const size = 0.00005;
  const layerHeight = 100;

  // we need to find lower bound on zoom level, to fit all latlong
  const upper_zoom = 15;
  const lower_zoom = 5;

  paths.forEach( (path) => {
    const nodes_len = path.nodes.length;
    var iter = 0;
    var node_a, node_b;
    var curr_min_lower_zoom = upper_zoom;

    // iterate two nodes at a time
    path.nodes.forEach( (node) => {
      const lng = parseFloat(node.geo.geometry.coordinates[0]);
      const lat = parseFloat(node.geo.geometry.coordinates[1]);

      if (iter == 0) {
        node_a = [lat, lng]
      }
      else if (iter < nodes_len) {

        node_b = node_a
        node_a = [lat, lng];

        const viewport_tmp = ReactMapGl.fitBounds(1140, 500, [node_a, node_b]); //TODO width height

        // upper_zoom is the street. lower_zoom is state level.
        // we start from curr_lower_zoom from a high value and decrement it as we iterate.
        // Sometime due to bad data, lower_zoom is less than 10.
        if (viewport_tmp.zoom > lower_zoom) {
          if (viewport_tmp.zoom < curr_min_lower_zoom) {
            curr_min_lower_zoom = viewport_tmp.zoom;
          }
          if (viewport_tmp.zoom > upper_zoom) {
            viewport_tmp.zoom = upper_zoom;
          }
          paths.viewport_zoom = viewport_tmp;
        } else {
          console.log("location data is bad", viewport_tmp.zoom);
        }
      }
      iter++;
    });
  });

  paths.forEach((path) => {
    // Separate Lng & Lat Pair
    path.relIps = [];
    path.relTunnels = [];
    path.relLTE = [];

    path.rels.forEach((rel) => {
      rel.targetLocation = convertToPosition(rel.targetNodeId);
      rel.sourceLocation = convertToPosition(rel.sourceNodeId);

      if (rel.relType === 'PathRelType.Interface') {
        rel.targetLocation.push(0);
        rel.sourceLocation.push(0);
        path.relIps.push(rel);
      } else if (rel.relType === 'PathRelType.Tunnel') {
        rel.targetLocation.push(layerHeight);
        rel.sourceLocation.push(layerHeight);
        path.relTunnels.push(rel);
      } else {
        console.log(rel);
      }
    });

    // Create Node Bar based on the Node Coordinates
    path.topologyNodes = [];

    path.mapCenter = { // Align Layer to the Center of the MAP
      longitude: 0,
      latitude: 0,
    };

    path.nodes.forEach((node) => {
      const lng = parseFloat(node.geo.geometry.coordinates[0]);
      const lat = parseFloat(node.geo.geometry.coordinates[1]);
      path.topologyNodes.push({
        node: node,
        label: node.attrs.display_name,
        labelPosition: [lng, lat],
        labelColor: [50, 50, 50],
        height: 100,
        polygon: drawcircle(15, [lng, lat], 4),
        position: [lng, lat, layerHeight],
        normal: [1, 1, 0],
        color: getPOIColor(node.alarm),
      });
    });
  });
  return paths;
}

export function getPOIColor(alarm){
  if (alarm === undefined){
    console.log("alarm attr no found")
    return POI_ALARM_COLORS.alarm_no;
  }
  if (Object.keys(alarm).length == 0) {
    return POI_ALARM_COLORS.alarm_no;
  }
  else{
    return POI_ALARM_COLORS.alarm_yes;
  }
}

function convertToPosition(pos) {
  const result = [];
  pos.split(':').forEach((val) => {
    result.push(parseFloat(val));
  });

  return result;
}

export function drawcircle(radiusInMeters, centerPoint, steps) {
  var center = [centerPoint[1], centerPoint[0]],
    dist = (radiusInMeters / 1000) / 6371,
    // convert meters to radiant
    radCenter = [numberToRadius(center[0]), numberToRadius(center[1])],
    steps = steps || 15,
    poly = [[center[0], center[1]]];
  for (let i = 0; i < steps; i++) {
    const brng = 2 * Math.PI * i / steps;
    const lat = Math.asin(Math.sin(radCenter[0]) * Math.cos(dist)
      + Math.cos(radCenter[0]) * Math.sin(dist) * Math.cos(brng));
    const lng = radCenter[1] + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(radCenter[0]),
        Math.cos(dist) - Math.sin(radCenter[0]) * Math.sin(lat));
    poly[i] = [];
    poly[i][1] = numberToDegree(lat);
    poly[i][0] = numberToDegree(lng);
  }
  return [poly];
}


const numberToRadius = function (number) {
  return number * Math.PI / 180;
};

const numberToDegree = function (number) {
  return number * 180 / Math.PI;
};
