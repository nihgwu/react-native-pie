import React, { PropTypes } from 'react'
import { ART } from 'react-native'

const { Surface, Shape, Path, Group } = ART

function createPath(cx, cy, r, startAngle, arcAngle) {
  const p = new Path()
  p.path.push(0, cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle))
  p.path.push(4, cx, cy, r, startAngle, startAngle + arcAngle, 1)
  return p
}

const Pie = ({ series, colors, radius, innerRadius, backgroundColor }) => {
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
        {series.map((item, idx) => {
          const startAngle = startValue / 100 * 2 * Math.PI
          const arcAngle = item / 100 * 2 * Math.PI
          startValue += item
          const path = createPath(
            radius,
            radius,
            radius - width / 2,
            startAngle,
            arcAngle
          )
          return (
            <Shape
              key={`${startAngle}-${arcAngle}`}
              d={path}
              stroke={colors[idx]}
              strokeWidth={width}
              strokeCap="butt"
            />
          )
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
}

Pie.defaultProps = {
  innerRadius: 0,
  backgroundColor: '#fff',
}
