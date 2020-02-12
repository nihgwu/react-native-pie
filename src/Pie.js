import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Surface, Shape, Path, Group } from '@react-native-community/art';

function createPath(cx, cy, r, startAngle, arcAngle, isBezian, innerRadius) {
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
  //starting point of our chart
  if(isBezian){
    const ROUNDNESSOUSIDE = 1 - (r - innerRadius)/ innerRadius;
    const ROUNDNESSINSIDE = 1 + (r - innerRadius)/ innerRadius;
    const PULLBACK = 0.05;
    const ANCHORFORWARD = .2 ;
      //This is for the part that is the divider
      p.moveTo(cx + r * ROUNDNESSOUSIDE * Math.cos(startAngle + PULLBACK), cy + r * ROUNDNESSOUSIDE * Math.sin(startAngle + PULLBACK));
      p.onBezierCurve(
        undefined,
        undefined,
        cx + r  * ROUNDNESSOUSIDE * Math.cos(startAngle + PULLBACK),
        cy + r  * ROUNDNESSOUSIDE * Math.sin(startAngle + PULLBACK),
        cx + r * Math.cos((startAngle + ANCHORFORWARD)),
        cy + r * Math.sin((startAngle + ANCHORFORWARD)),
        cx + r * ROUNDNESSINSIDE * Math.cos(startAngle + PULLBACK),
        cy + r  * ROUNDNESSINSIDE * Math.sin(startAngle + PULLBACK),
      );
    }else{
      //This is for the main arc of the pie chart
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
      )
    }
  }
  return p;
}

const ArcShape = ({ radius, width, color, strokeCap, startAngle, arcAngle, isBezian, innerRadius }) => {
  const path = createPath(
    radius,
    radius,
    radius - width / 2,
    startAngle / 180 * Math.PI,
    arcAngle / 180 * Math.PI,
    isBezian,
    innerRadius
  );
  const strokeWidth = isBezian ? (arcAngle * 5) : width;
  return <Shape d={path} stroke={color} strokeWidth={strokeWidth} strokeCap={strokeCap} />;
};

// These are the rounded dividers when strokeCap='round'
const RoundDividers = ({ paintedSections, dividerSize, width, radius, backgroundColor, innerRadius, visible }) => {
  let dividerOffSet = 3;
  let strokeCap = 'butt';
  let isBezian = true;
  if(dividerSize > 2){
    dividerOffSet = 0;
    strokeCap = 'round';
    isBezian = false;
  }
  let dividerColorOverlayArray = [];
  let dividerArray = [];
  if(paintedSections.length > 1 && visible){
    paintedSections.forEach((section, index) => {
      const { color, startAngle } = section;
      dividerArray.push(<ArcShape
        key={index}
        radius={radius}
        width={width}
        color={backgroundColor}
        startAngle={startAngle - dividerSize/ 2 - (dividerOffSet)}
        arcAngle={dividerSize}
        isBezian={isBezian}
        innerRadius={innerRadius}
        strokeCap={strokeCap}
      />);
      
      dividerColorOverlayArray.push(<ArcShape
        key={index}
        radius={radius}
        width={width}
        color={color}
        startAngle={startAngle + section.arcAngle - dividerSize / 2 - (dividerOffSet + 1 && dividerOffSet + 2)}
        arcAngle={1}
        isBezian={isBezian}
        innerRadius={innerRadius}
        strokeCap={strokeCap}
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

// These circles clean up the strokes left over from the bezian curves
const CleanUpCircles = ({radius, innerRadius, backgroundColor}) => {
  const innerBackgroundPath = createPath(radius, radius, innerRadius - ((radius - innerRadius) / 2), 0, 360);
  const outerBackgroundPath = createPath(radius, radius, radius + ((radius - innerRadius)) / 2, 0, 360);
  if((radius - innerRadius) < 100){
    return (<>
      <Shape
          d={innerBackgroundPath}
          stroke={backgroundColor}
          strokeWidth={radius - innerRadius}
        />
      <Shape
        d={outerBackgroundPath}
        stroke={backgroundColor}
        strokeWidth={radius - innerRadius}
      />
    </>)
  }
  return null;
  
}

//The initial band to set the backgroundColor behind the pie chart
const InitialBand = ({radius, width, color}) => {
  return <ArcShape radius={radius} width={width} color={color} startAngle={0} arcAngle={360} />
}

const LargeBands = ({paintedSections, sections, shouldShowRoundDividers, radius, width, dividerSize}) => {
  let startValue = 0;
  const showDividers = shouldShowDivider(sections, dividerSize);
  paintedSections = sections.map((section, idx) => {
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
      startAngle={showDividers ? startAngle + dividerSize : startAngle}
      arcAngle={showDividers ? arcAngle - dividerSize : arcAngle}
      strokeCap={strokeCapBigForBigArc}
    />;
  })
  return paintedSections;
}

const getArcAngle = (percentage) => percentage / 100 * 360;
const shouldShowDivider = (sections, dividerSize) => sections.length > 1 && !Number.isNaN(dividerSize);

const Pie = ({ sections, radius, innerRadius, backgroundColor, strokeCap, dividerSize }) => {

  // This is the width for the arc
  const width = radius - innerRadius;
  strokeCapBigForBigArc = dividerSize <= 2 || strokeCap == 'butt' ? 'butt' : 'round';
  const shouldShowRoundDividers = !!dividerSize && strokeCap === 'round';
  let paintedSections = [];
  
  return (
    <Surface width={radius * 2} height={radius * 2}>
      <Group rotation={-90} originX={radius} originY={radius}>
        <InitialBand radius={radius} width={width} color={backgroundColor} />
        <LargeBands paintedSections={paintedSections} sections={sections} shouldShowRoundDividers={shouldShowRoundDividers} radius={radius} width={width} dividerSize={dividerSize} />
        <RoundDividers paintedSections={paintedSections}
          backgroundColor={backgroundColor}
          dividerSize={dividerSize}
          width={width}
          radius={radius}
          innerRadius={innerRadius}
          visible={shouldShowRoundDividers}
        />
        <CleanUpCircles radius={radius} innerRadius={innerRadius} backgroundColor={backgroundColor} />
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
