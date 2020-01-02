import React from 'react'
import PropTypes from 'prop-types'
import { Platform } from 'react-native'
import { Surface, Shape, Path, Group } from '@react-native-community/art'

function createPath(cx, cy, r, startAngle, arcAngle) {
  const p = new Path()
  if (Platform.OS === 'web') {
    p.moveTo(cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle))
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
  } else {
    p.path.push(0, cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle))
    p.path.push(4, cx, cy, r, startAngle, startAngle + arcAngle, 1)
  }
  return p
}

const ArcShape = ({ radius, width, color, strokeCap, startAngle, arcAngle }) => {
  const path = createPath(
    radius,
    radius,
    radius - width / 2,
    startAngle / 180 * Math.PI,
    arcAngle / 180 * Math.PI
  )
  return <Shape d={path} stroke={color} strokeWidth={width} strokeCap={strokeCap} />
}

const RingShape = props =>
  Platform.OS === 'ios'
    ? <ArcShape {...props} startAngle={0} arcAngle={360} />
    : <Group>
      <ArcShape {...props} startAngle={0} arcAngle={180} />
      <ArcShape {...props} startAngle={180} arcAngle={180} />
    </Group>

const Dividers = ({ dividers, dividerColorOverlays, strokeCap }) => {
  const needsColorOverlay = strokeCap === 'round';
  return (
    <Group>
      {dividers}
      {needsColorOverlay && dividerColorOverlays}
    </Group>
  )
}

const createDivider = (percentage, color, startAngle, arcAngle, idx, radius, width, dividerProps, strokeCap) => {
  const shouldShow = percentage !== 100;

  return shouldShow && (<ArcShape
    key={idx}
    radius={radius}
    width={width}
    color={dividerProps.color}
    startAngle={startAngle - dividerProps.size / 2}
    arcAngle={dividerProps.size}
    strokeCap={strokeCap}
  />)
}

const createDividerColorOverlay = (percentage, color, startAngle, arcAngle, idx, radius, width, dividerProps, strokeCap) => {
  const shouldShow = percentage !== 100;

  return shouldShow && (<ArcShape
    key={idx}
    radius={radius}
    width={width}
    color={color}
    startAngle={startAngle + arcAngle - dividerProps.size / 2 - 1}
    arcAngle={1}
    strokeCap={strokeCap}
  />
  )
}

const shouldShowDividers = dividerProps => !!dividerProps.size;

const Pie = ({ sections, radius, innerRadius, backgroundColor, strokeCap, dividerProps }) => {
  const width = radius - innerRadius
  const backgroundPath = createPath(radius, radius, radius - width / 2, 0, 360)
  let startValue = 0
  let dividers = [];
  let dividerColorOverlayArray = [];

  return (
    <Surface width={radius * 2} height={radius * 2}>
      <Group rotation={-90} originX={radius} originY={radius}>
        <Shape
          d={backgroundPath}
          stroke={backgroundColor}
          strokeWidth={width}
        />
        <RingShape radius={radius} width={width} color={backgroundColor} />
        {sections.map((section, idx) => {
          const { percentage, color } = section;

          const startAngle = startValue / 100 * 360
          const arcAngle = percentage / 100 * 360
          startValue += percentage

          if (shouldShowDividers(dividerProps)) {
            dividers.push(createDivider(percentage, color, startAngle, arcAngle, idx, radius, width, dividerProps, strokeCap))
            dividerColorOverlayArray.push(createDividerColorOverlay(percentage, color, startAngle, arcAngle, idx, radius, width, dividerProps, strokeCap))
          }

          return arcAngle >= 360
            ? <RingShape
              key={idx}
              radius={radius}
              width={width}
              color={color}
            />
            : <ArcShape
              key={idx}
              radius={radius}
              width={width}
              color={color}
              startAngle={startAngle}
              arcAngle={arcAngle}
              strokeCap={strokeCap}
            />
        })}
        {shouldShowDividers(dividerProps) &&
          <Dividers dividers={dividers} dividerColorOverlays={dividerColorOverlayArray}
            dividerProps={dividerProps}
            width={width}
            radius={radius}
            strokeCap={strokeCap}
          />}


      </Group>
    </Surface>
  )
}

export default Pie

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
  dividerProps: PropTypes.exact({
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  })
}

Pie.defaultProps = {
  dividerProps: { size: 0, color: '#fff' },
  innerRadius: 0,
  backgroundColor: '#fff',
  strokeCap: "butt",
}
