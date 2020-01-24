import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Surface, Shape, Path, Group } from '@react-native-community/art';

function createPath(cx, cy, r, startAngle, arcAngle) {
  const p = new Path();
  if (Platform.OS === 'web') {
    p.moveTo(cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle));
    p.onArc(
      undefined,
      undefined,
      undefined,
      undefined,
      cx,
      cy,
      r,
      r,
      startAngle,
      startAngle + arcAngle,
    );
  } else {
    p.path.push(0, cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle));
    p.path.push(4, cx, cy, r, startAngle, startAngle + arcAngle, 1);
  }
  return p;
}

const ArcShape = ({ radius, width, color, strokeCap, startAngle, arcAngle }) => {
  const path = createPath(
    radius,
    radius,
    radius - width / 2,
    startAngle / 180 * Math.PI,
    arcAngle / 180 * Math.PI,
  );
  return <Shape d={path} stroke={color} strokeWidth={width} strokeCap={strokeCap} />;
};

const RoundDividers = ({ paintedSections, dividerSize, width, radius, backgroundColor }) => {
  let dividerColorOverlayArray = [];
  let dividerArray = [];
  if(paintedSections.length > 1){
    paintedSections.forEach((section, index) => {
      const { color, startAngle } = section;
      dividerArray.push(<ArcShape
        key={index}
        radius={radius}
        width={width}
        color={backgroundColor}
        startAngle={startAngle - dividerSize / 2}
        arcAngle={dividerSize}
        strokeCap={'round'}
      />);
  
      dividerColorOverlayArray.push(<ArcShape
        key={index}
        radius={radius}
        width={width}
        color={color}
        startAngle={startAngle + section.arcAngle - dividerSize / 2 - 1}
        arcAngle={1}
        strokeCap={'round'}
      />);
  });
}
  return ( 
    <Group>
      {dividerArray}
      {dividerColorOverlayArray}
    </Group>
  );
};

const getArcAngle = (percentage) => percentage / 100 * 360;
const shouldShowDivider = (sections, dividerSize) => sections.length > 1 && && !Number.isNaN(dividerSize);;

const Pie = ({ sections, radius, innerRadius, backgroundColor, strokeCap, dividerSize }) => {
  const width = radius - innerRadius;
  const backgroundPath = createPath(radius, radius, radius - width / 2, 0, 360);
  const shouldShowRoundDividers = !!dividerSize && strokeCap === 'round';
  let startValue = 0;
  let paintedSections = [];
  const showDividers = shouldShowDivider(sections, dividerSize);
  return (
    <Surface width={radius * 2} height={radius * 2}>
      <Group rotation={-90} originX={radius} originY={radius}>
        <Shape
          d={backgroundPath}
          stroke={backgroundColor}
          strokeWidth={width}
        />
        <ArcShape radius={radius} width={width} color={backgroundColor} startAngle={0} arcAngle={360} />
        {sections.map((section, idx) => {
          const { percentage, color } = section;
          
          const startAngle = startValue / 100 * 360;
          const arcAngle = getArcAngle(percentage);
          startValue += percentage;

          shouldShowRoundDividers && paintedSections.push({ percentage, color, startAngle, arcAngle });

          return <ArcShape
            key={idx}
            radius={radius}
            width={width}
            color={color}
            startAngle={showDividers ? startAngle + dividerSize / 2 : startAngle}
            arcAngle={showDividers ? arcAngle - dividerSize : arcAngle}
            strokeCap={strokeCap}
          />;
        })}
        {shouldShowRoundDividers &&
          <RoundDividers paintedSections={paintedSections}
            backgroundColor={backgroundColor}
            dividerSize={dividerSize}
            width={width}
            radius={radius}
          />}


      </Group>
    </Surface>
  );
};

export default Pie;

Pie.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.exact({
      percentage: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  radius: PropTypes.number.isRequired,
  innerRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
  strokeCap: PropTypes.string,
  dividerSize: PropTypes.number,
};

Pie.defaultProps = {
  dividerSize: 0,
  innerRadius: 0,
  backgroundColor: '#fff',
  strokeCap: 'butt',
};