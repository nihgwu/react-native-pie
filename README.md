# react-native-pie

Pie chart for React Native, works on **iOS** and **Android** both

## Demo

![iOS](demo/ios.png)
![Android](demo/android.png)

## Install

1. `npm i --save react-native-pie`  
2. Link the ART library to your ReactNative project ([how to link a library](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#content)). You'll find the React ART library in `node_modules/react-native/Libraries/ART/ART.xcodeproj`


> **for those who are using `react-native` with a version below `0.45`, please install `v0.1.0` instead**   
> `npm i --save react-native-pie@0.1.0`

> **On android there is a ring shape drawing issue in React Native, I've made a PR to resolve it https://github.com/facebook/react-native/pull/15042, I also made a warkarond for this compoent https://github.com/nihgwu/react-native-pie/commit/86adf51339854ef3dc50df8cef6d12afb9df7b82, and will remove it when that PR is shipped with a stable release**

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
            <Pie
              radius={100}
              pieSections={[
                {
                  percentage: 10,
                  color: 'red',
                },
                {
                  percentage: 20,
                  color: 'lime',
                },
                {
                  percentage: 30,
                  color: 'blue',
                },
                {
                  percentage: 40,
                  color: 'yellow',
                },
              ]}
            />
            <Pie
              radius={100}
              innerRadius={60}
              series={[10, 20, 30, 40]}
              colors={['#f00', '#0f0', '#00f', '#ff0']}
              pieSections={[
                {
                  percentage: 10,
                  color: '#f00',
                },
                {
                  percentage: 20,
                  color: '#0f0',
                },
                {
                  percentage: 30,
                  color: '#00f',
                },
                {
                  percentage: 40,
                  color: '#ff0',
                },
              ]}
            />
            <View>
              <Pie
                radius={50}
                innerRadius={45}
                series={[60]}
                colors={['#f00']}
                pieSections={[
                  {
                    percentage: 60,
                    color: '#f00',
                  },
                ]}
                backgroundColor="#ddd"
              />
              <View style={styles.gauge}>
                <Text style={styles.gaugeText}>60%</Text>
              </View>
            </View>
          </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
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

* **pieSections** `{percentage, color}` of each section in the pie - array, required
* **radius** `radius = size / 2`, required
* **innerRadius** default to `0`
* **backgroundColor** default to `#fff`

## License

MIT
