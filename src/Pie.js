import React from 'react'
import PropTypes from 'prop-types'
import { ART, Platform } from 'react-native'

const { Surface, Shape, Path, Group } = ART

function createPath(cx, cy, r, startAngle, arcAngle) {
  const p = new Path()
  p.path.push(0, cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle))
  p.path.push(4, cx, cy, r, startAngle, startAngle + arcAngle, 1)
  return p
}

const ArcShape = ({ radius, width, color, strokeCap,startAngle, arcAngle }) => {
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

const Pie = ({ series, colors, radius, innerRadius, backgroundColor,strokeCap}) => {
  const width = radius - innerRadius
  const backgroundPath = createPath(radius, radius, radius - width / 2, 0, 360)
  let startValue = 0
  return (
    <Surface width={radius * 2} height={radius * 2}>
      <Group rotation={-90} originX={radius} originY={radius}>
        <Shape
          d={backgroundPath}
          stroke={backgroundColor}
          strokeWidth={width}
        />
        <RingShape radius={radius} width={width} color={backgroundColor} />
        {series.map((item, idx) => {
          const startAngle = startValue / 100 * 360
          const arcAngle = item / 100 * 360
          startValue += item
          const color = colors[idx]
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
      </Group>
    </Surface>
  )
}

export default Pie

Pie.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  radius: PropTypes.number.isRequired,
  innerRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
  strokeCap: PropTypes.string,
}

Pie.defaultProps = {
  innerRadius: 0,
  backgroundColor: '#fff',
  strokeCap:"butt",
}
