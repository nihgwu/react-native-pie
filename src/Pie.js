import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Surface, Shape, Path, Group } from '@react-native-community/art';

function createPath(cx, cy, r, startAngle, arcAngle, isBezian, innerRadius) {
  const p = new Path();
  //starting point of our chart
  if(isBezian){
    const roundnessOutside = 1 - ((r - innerRadius)/ innerRadius) - (arcAngle * .5);
    const roundnessInside = 1 + ((r - innerRadius)/ innerRadius) + (arcAngle * .5);
    const pullback = 0.05;
    const anchorForward = .15;
      //This is for the part that is the divider
    p.moveTo(cx + r * roundnessOutside * Math.cos(startAngle + pullback), cy + r * roundnessOutside * Math.sin(startAngle + pullback));
    p.onBezierCurve(
      undefined,
      undefined,
      cx + r  * roundnessOutside * Math.cos(startAngle + pullback),
      cy + r  * roundnessOutside * Math.sin(startAngle + pullback),
      cx + r * Math.cos((startAngle + anchorForward)),
      cy + r * Math.sin((startAngle + anchorForward)),
      cx + r * roundnessInside * Math.cos(startAngle + pullback),
      cy + r  * roundnessInside * Math.sin(startAngle + pullback),
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
  return p;
}

const ArcShape = ({dimensions, color, strokeCap, startAngle, arcAngle, isBezian}) => {
  const {radius, innerRadius, width, dividerSize} = dimensions;
  const path = createPath(
    radius,
    radius,
    radius - width / 2,
    startAngle / 180 * Math.PI,
    arcAngle / 180 * Math.PI,
    isBezian,
    innerRadius,
  );
  const strokeWidth = isBezian ? (arcAngle * 5) : width;
  return <Shape d={path} stroke={color} strokeWidth={strokeWidth} strokeCap={strokeCap} />;
};

//The initial band to set the backgroundColor behind the pie chart
const Background = ({dimensions, color}) => {
  return <ArcShape dimensions={dimensions} color={color} startAngle={0} arcAngle={360} />
}

const getArcAngle = (percentage) => percentage / 100 * 360;
const shouldShowDivider = (sections, dividerSize) => sections.length > 1 && !Number.isNaN(dividerSize);

const Sections = ({dimensions, paintedSections, sections, shouldShowRoundDividers, strokeCapForLargeBands}) => {
  let startValue = 0;
  const {radius, width, dividerSize} = dimensions;
  const showDividers = shouldShowDivider(sections, dividerSize);
  paintedSections = sections.map((section, idx) => {
    const { percentage, color } = section;
    const startAngle = startValue / 100 * 360;
    const arcAngle = getArcAngle(percentage);
    startValue += percentage;
    shouldShowRoundDividers && paintedSections.push({ percentage, color, startAngle, arcAngle });
    return <ArcShape
      key={idx}
      dimensions={dimensions}
      color={color}
      startAngle={showDividers ? startAngle + dividerSize : startAngle}
      arcAngle={showDividers ? arcAngle - dividerSize : arcAngle}
      strokeCap={strokeCapForLargeBands}
    />;
  })
  return paintedSections;
}


// These are the rounded dividers when strokeCap='round'
const RoundDividers = ({ dimensions, paintedSections, backgroundColor, visible }) => {
  const {dividerSize, radius, innerRadius, width} = dimensions;
  const dividerOffSet = (dividerSize * 2) + 6;
  const strokeCap = 'butt';
  const isBezian = true;
  let dividerColorOverlayArray = [];
  let dividerArray = [];
  
  if(paintedSections.length > 1 && visible){
    
    paintedSections.forEach((section, index) => {
      const { color, startAngle } = section;
      
      for(let i = 0; i < dividerSize + 2; i++){
        dividerArray.push(<ArcShape
          key={index}
          dimensions={dimensions}
          color={backgroundColor}
          startAngle={startAngle + section.arcAngle + dividerSize + i - dividerOffSet}
          arcAngle={1}
          isBezian={isBezian}
          strokeCap={strokeCap}
        />);
        dividerColorOverlayArray.push(<ArcShape
          key={index}
          dimensions={dimensions}
          color={color}
          startAngle={startAngle + section.arcAngle - dividerSize + i - dividerOffSet}
          arcAngle={1}
          isBezian={isBezian}
          strokeCap={strokeCap}
        />);
      }
      
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
const CleanUpCircles = ({dimensions, backgroundColor, visible}) => {
  const { radius, innerRadius, width} = dimensions;
  const innerBackgroundPath = createPath(radius, radius, innerRadius - ((width) / 2), 0, 360);
  const outerBackgroundPath = createPath(radius, radius, radius + ((width)) / 2, 0, 360);
  if((width) < 100 && visible){
    return (<>
      <Shape
          d={innerBackgroundPath}
          stroke={backgroundColor}
          strokeWidth={width}
      />
      <Shape
        d={outerBackgroundPath}
        stroke={backgroundColor}
        strokeWidth={width}
      />
    </>)
  }
  return null;
}

const Pie = ({ sections, radius, innerRadius, backgroundColor, strokeCap, dividerSize }) => {
  strokeCapForLargeBands = dividerSize > 0 || strokeCap == 'butt' ? 'butt' : 'butt';
  const shouldShowRoundDividers = strokeCap === 'round';
  let paintedSections = [];
  
  // This is the width for the arc
  const width = radius - innerRadius;
  const dimensions = { radius, innerRadius, width, dividerSize };
  
  return (
    <Surface width={radius * 2} height={radius * 2}>
      <Group rotation={-90} originX={radius} originY={radius}>
        <Background dimensions={dimensions} color={backgroundColor} />
        <Sections 
          dimensions={dimensions} 
          paintedSections={paintedSections} 
          sections={sections} 
          strokeCapForLargeBands={strokeCapForLargeBands} 
          shouldShowRoundDividers={shouldShowRoundDividers} 
        />
        <RoundDividers 
          dimensions={dimensions}
          paintedSections={paintedSections}
          backgroundColor={backgroundColor}
          visible={shouldShowRoundDividers}
        />
        <CleanUpCircles 
          dimensions={dimensions} 
          backgroundColor={backgroundColor} 
          visible={shouldShowRoundDividers}
        />
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