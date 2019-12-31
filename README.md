# react-native-pie

Pie chart for React Native, works on **iOS** and **Android** both

## Demo

![iOS](demo/ios.png)
![Android](demo/android.png)

## Install

1. `npm i --save react-native-pie` 
2. Link the ART library to your ReactNative project ([how to link a library](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#content)). You'll find the React ART library in `node_modules/react-native/Libraries/ART/ART.xcodeproj` 

> **for those who are using `react-native` with a version below `0.45` , please install `v0.1.0` instead**   
> `npm i --save react-native-pie@0.1.0` 

> **On android there is a ring shape drawing issue in React Native, I've made a PR to resolve it https://github.com/facebook/react-native/pull/15042, I also made a workarond for this component https://github.com/nihgwu/react-native-pie/commit/86adf51339854ef3dc50df8cef6d12afb9df7b82, and will remove it when that PR is shipped with a stable release**

## Usage

```jsx
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import Pie from 'react-native-pie'

export default class PieDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
          <View
            style={{
              paddingVertical: 15,
              flexDirection: 'row',
              width: 350,
              justifyContent: 'space-between',
            }}
          >
            <Pie
              radius={80}
              sections={[
                {
                  percentage: 10,
                  color: '#C70039',
                },
                {
                  percentage: 20,
                  color: '#44CD40',
                },
                {
                  percentage: 30,
                  color: '#404FCD',
                },
                {
                  percentage: 40,
                  color: '#EBD22F',
                },
              ]}
              strokeCap={'butt'}
            />
            <Pie
              radius={80}
              innerRadius={50}
              sections={[
                {
                  percentage: 10,
                  color: '#C70039',
                },
                {
                  percentage: 20,
                  color: '#44CD40',
                },
                {
                  percentage: 30,
                  color: '#404FCD',
                },
                {
                  percentage: 40,
                  color: '#EBD22F',
                },
              ]}
              strokeCap={'butt'}
            />
          </View>
          <View
            style={{
              paddingVertical: 15,
              flexDirection: 'row',
              width: 350,
              justifyContent: 'space-between',
            }}
          >
            <Pie
              radius={80}
              innerRadius={60}
              sections={[
                {
                  percentage: 10,
                  color: '#C70039',
                },
                {
                  percentage: 20,
                  color: '#44CD40',
                },
                {
                  percentage: 30,
                  color: '#404FCD',
                },
                {
                  percentage: 40,
                  color: '#EBD22F',
                },
              ]}
              dividerProps={{ size: 2, color: 'white' }}
              strokeCap={'round'}
            />
            <Pie
              radius={80}
              innerRadius={60}
              sections={[
                {
                  percentage: 10,
                  color: '#C70039',
                },
                {
                  percentage: 20,
                  color: '#44CD40',
                },
                {
                  percentage: 30,
                  color: '#404FCD',
                },
                {
                  percentage: 40,
                  color: '#EBD22F',
                },
              ]}
              dividerProps={{ size: 3, color: 'white' }}
              strokeCap={'butt'}
            />
          </View>
          <View
            style={{
              paddingVertical: 15,
              width: 350,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Pie
              radius={80}
              sections={[
                {
                  percentage: 10,
                  color: '#C70039',
                },
                {
                  percentage: 20,
                  color: '#44CD40',
                },
                {
                  percentage: 30,
                  color: '#404FCD',
                },
                {
                  percentage: 40,
                  color: '#EBD22F',
                },
              ]}
              dividerProps={{ size: 3, color: 'white' }}
              strokeCap={'butt'}
            />
            <View style={{ width: 175, alignItems: 'center' }}>
              <Pie
                radius={80}
                innerRadius={75}
                sections={[
                  {
                    percentage: 60,
                    color: '#f00',
                  },
                ]}
                backgroundColor="#ddd"
              />
              <View
                style={styles.gauge}
              >
                <Text
                  style={gaugeText}
                >
                  60%
                </Text>
              </View>
            </View>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', height: 1050 },
  gauge: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },
})
```

## Props

* **sections** `{percentage, color}` of each section in the pie - array, **required**
* **radius** `radius = size / 2` , - number, **required**
* **innerRadius** defaults to `0` - number, **optional**
* **backgroundColor** defaults to `#fff` - string, **optional**
* **strokeCap** ( `round` , `butt` , `square` ) defaults to `butt` - string, **optional**
* **dividerProps** `{size, color}` configuration of dividers for the pie - object, **optional**
  * **PLEASE NOTE** If using `strokeCap={'round'}` along with dividers, it is highly recommended to use a higher `innerRadius` (around 60% of `radius` and higher) in addition to not having very small percentage slices. This will ensure proper display. We intend to address these issues in future PRs



## License

MIT

