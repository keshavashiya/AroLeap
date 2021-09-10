import React, {useState, useRef, useCallback} from 'react';
import {PanResponder, Dimensions} from 'react-native';
import Svg, {Path, Circle, G, Text} from 'react-native-svg';

const CircleSlider = ({
  btnRadius = 25,
  dialRadius = 130,
  dialWidth = 25,
  meterColor = '#03DAC6',
  textColor = '#B8B8B8',
  fillColor = 'none',
  strokeColor = '#223836',
  strokeWidth = 25,
  textSize = 35,
  value = 25,
  min = 0,
  max = 99,
  xCenter = Dimensions.get('window').width / 2,
  yCenter = Dimensions.get('window').height / 2,
  onValueChange = x => x,
}) => {
  const [angle, setAngle] = useState(value);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gs) => true,
      onStartShouldSetPanResponderCapture: (e, gs) => true,
      onMoveShouldSetPanResponder: (e, gs) => true,
      onMoveShouldSetPanResponderCapture: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        let xOrigin = xCenter - (dialRadius + btnRadius);
        let yOrigin = yCenter - (dialRadius + btnRadius);
        let a = cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);

        if (a <= min) {
          setAngle(min);
        } else if (a >= max) {
          setAngle(max);
        } else {
          setAngle(a);
        }
      },
    }),
  ).current;

  const polarToCartesian = useCallback(
    angle => {
      let r = dialRadius;
      let hC = dialRadius + btnRadius;
      let a = ((angle - 25) * Math.PI) / 50.0;

      let x = hC + r * Math.cos(a);
      let y = hC + r * Math.sin(a);
      return {x, y};
    },
    [dialRadius, btnRadius],
  );

  const cartesianToPolar = useCallback(
    (x, y) => {
      let hC = dialRadius + btnRadius;

      if (x === 0) {
        return y > hC ? 0 : 50;
      } else if (y === 0) {
        return x > hC ? 25 : 75;
      } else {
        return (
          Math.round((Math.atan((y - hC) / (x - hC)) * 50) / Math.PI) +
          (x > hC ? 25 : 75)
        );
      }
    },
    [dialRadius, btnRadius],
  );

  const width = (dialRadius + btnRadius) * 2;
  const bR = btnRadius;
  const dR = dialRadius;
  const startCoord = polarToCartesian(0);
  var endCoord = polarToCartesian(angle);

  return (
    <Svg width={width} height={width}>
      <Circle
        r={dR}
        cx={width / 2}
        cy={width / 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillColor}
      />
      <Text
        x={width / 2}
        y={dR + textSize}
        fontSize={textSize}
        fill={textColor}
        textAnchor="middle">
        {onValueChange(angle) + ''}
      </Text>
      <Path
        stroke={meterColor}
        strokeWidth={dialWidth}
        fill="none"
        d={`M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 0 ${
          angle > 50 ? 1 : 0
        } 1 ${endCoord.x} ${endCoord.y}`}
      />

      <G x={endCoord.x - bR} y={endCoord.y - bR}>
        <Circle
          r={bR}
          cx={bR}
          cy={bR}
          fill={meterColor}
          {...panResponder.panHandlers}
        />
      </G>
    </Svg>
  );
};

export default React.memo(CircleSlider);