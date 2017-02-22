import React, { PropTypes } from 'react'
import { Platform, ART } from 'react-native'
const { Surface, Shape, Path, Group } = ART

// modify from https://github.com/nerdyfactory/react-native-simple-gauge/blob/master/src/CircularProgress.js
function createPath(cx, cy, r, startAngle, arcAngle) {
  const p = new Path()
  if (Platform.OS === 'ios') {
    p.path.push(0, cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle))
    p.path.push(4, cx, cy, r, startAngle, startAngle + arcAngle, 1)
  } else {
    // For Android we have to resort to drawing low-level Path primitives, as ART does not support 
    // arbitrary circle segments. It also does not support strokeDash.
    // Furthermore, the ART implementation seems to be buggy/different than the iOS one.
    // MoveTo is not needed on Android 
    p.path.push(4, cx, cy, r, startAngle, startAngle - arcAngle, 0)
  }
  return p
}

const Pie = ({ series, colors, radius, innerRadius, backgroundColor }) => {
  const width = radius - innerRadius
  const backgroundPath = createPath(radius, radius, radius - width / 2, 0, 360)
  let startValue = 0
  return (
    <Surface
      width={radius * 2}
      height={radius * 2}>
      <Group rotation={-90} originX={radius} originY={radius}>
        <Shape d={backgroundPath} stroke={backgroundColor} strokeWidth={width}/>
        {series.map((item, idx) => {
          startAngle = startValue / 100 * 2  * Math.PI
          arcAngle = item / 100 * 2  * Math.PI
          startValue = startValue + item
          const path  = createPath(radius, radius, radius - width / 2, startAngle, arcAngle)
          return <Shape key={idx} d={path} stroke={colors[idx]} strokeWidth={width} strokeCap='butt' />
        })}
      </Group>
    </Surface>
  )
}

export default Pie

Pie.propTypes = {
  series: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  radius: PropTypes.number.isRequired,
  innerRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
}

Pie.defaultProps = {
  innerRadius: 0,
  backgroundColor: '#fff',
}
