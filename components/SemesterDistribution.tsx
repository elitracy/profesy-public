//IMPORTS
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import React from 'react'
import { colors, gpaColorizer } from '../utils/colors'
import { Course as CourseType } from '../RootStackParams'
import { useState, useEffect } from 'react'
import { LineChart, YAxis } from 'react-native-svg-charts'
import { Circle } from 'react-native-svg'
import * as shape from 'd3-shape'
import getSemesters from '../api/getSemesters'

interface props {
  route: {
    params: {
      course: string
      prof: string
      courseAverage: string
    }
  }
}

const SemesterDistribution = (Props: props) => {
  const { course, prof, courseAverage } = Props.route.params
  const [semesterInfo, setSemesterInfo] = useState([])
  const [loading, setLoading] = useState(false)
  const semesterGPAs = semesterInfo.map(s => {
    return parseFloat(s['semGPA'])
  })

  // SET STATES
  const [currentSemester, setCurrentSemester] = useState<any>(
    semesterInfo[semesterInfo.length - 1]
  )
  const [togglePercentages, setTogglePercentages] = useState(false)
  const [selectedNode, setSelectedNode] = useState(0)

  useEffect(() => {
    setLoading(true)
    getSemesters(course, prof, setSemesterInfo, setCurrentSemester).then(
      result => {
        setLoading(false)
        setCurrentSemester(result[result.length - 1])
        setSelectedNode(result.length - 1)
      }
    )
  }, [])

  // CHART POINTS
  function Decorator({
    x,
    y,
    data
  }: { x: any; y: any; data: number[] } | any): any {
    return data.map((value: number, index: any) => (
      <Circle
        key={index}
        cx={x(index)}
        cy={y(value)}
        r={6}
        // stroke={'rgb(134, 65, 244)'}
        stroke={colors.GREEN}
        strokeWidth={3}
        // fill={selectedNode === index ? 'rgb(134, 65, 244)' : 'black'}
        fill={selectedNode === index ? colors.GREEN : 'black'}
        onPress={() => {
          setCurrentSemester(
            semesterInfo.find((s: CourseType) => parseFloat(s.semGPA) === value)
          )
          setSelectedNode(index)
        }}
      />
    ))
  }

  return (
    <View style={styles.container}>
      {/*DISTRIBUTIONS*/}
      {!loading && currentSemester !== undefined ? (
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '80%'
          }}
        >
          <View style={{ width: '100%', alignItems: 'center' }}>
            {/*COURSE AVERAGE*/}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginTop: 5,
                padding: 10,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: gpaColorizer(courseAverage)
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  color: 'white',
                  marginRight: 10,
                  fontWeight: '400'
                }}
              >
                Course Average
              </Text>
              <Text
                style={{
                  fontSize: 35,
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: '700'
                }}
              >
                {courseAverage}
              </Text>
            </View>

            {/*GRADE DISTRIBUTION*/}
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 20,
                paddingHorizontal: 10,
                width: '100%',
                padding: 20,
                borderWidth: 2,
                borderColor: gpaColorizer(currentSemester.semGPA),
                borderRadius: 10
              }}
              key={undefined}
            >
              {/*GPA*/}
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: 'white', fontSize: 28, opacity: 0.8 }}>
                  {currentSemester.semester}
                  {'  '}
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    color: 'white',
                    textAlign: 'right',
                    fontWeight: '700'
                  }}
                >
                  {parseFloat(currentSemester.semGPA).toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginTop: 15,
                  alignItems: 'center'
                }}
              >
                {currentSemester.semester !== 'none' &&
                  ['A', 'B', 'C', 'F', 'Q'].map(letter => {
                    let letterPercentage = parseFloat(
                      (currentSemester[letter] / currentSemester.CourseTotal) *
                        (100).toFixed(0)
                    )

                    return (
                      <Pressable
                        style={[
                          styles.distLetter,
                          styles[`dist${letter}`],
                          {
                            flex:
                              letterPercentage < 5
                                ? 0.08
                                : letterPercentage / 100
                          }
                        ]}
                        onPress={() => setTogglePercentages(!togglePercentages)}
                        key={letter}
                      >
                        <Text
                          style={[
                            {
                              marginLeft: -16,
                              fontWeight: '400',
                              fontSize: 15,
                              color: 'black'
                            },
                            togglePercentages && { fontWeight: '400' }
                          ]}
                        >
                          {togglePercentages
                            ? `${letterPercentage.toFixed(0)}%`
                            : letter}
                        </Text>
                      </Pressable>
                    )
                  })}
              </View>
            </View>
          </View>

          {/*DISTRIBUTION GRAPH*/}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              height: '40%',
              width: '100%',
              marginTop: '6%',
              paddingVertical: 10,
              alignItems: "center",
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "rgba(255,255,255,.4)"
            }}
          >
            <YAxis
              style={{ flex: 0.2, height: '100%', borderRightWidth: 2, borderColor: "rgba(255,255,255,.1)" }}
              data={[
                Math.floor(Math.min(...semesterGPAs)),
                Math.ceil(Math.max(...semesterGPAs))
              ]}
              svg={{ fontSize: 20, fill: 'grey' }}
              contentInset={{top:15,bottom: 15}}
              numberOfTicks={5}
            />
            <LineChart
              data={semesterGPAs}
              yMin={Math.floor(Math.min(...semesterGPAs))}
              yMax={Math.ceil(Math.max(...semesterGPAs))}
              style={{
                flex: 1,
                height: '100%'
              }}
              svg={{
                strokeWidth: 3,
                stroke: gpaColorizer(courseAverage)
              }}
              contentInset={{ top: 15, bottom: 15, left: 20, right: 25 }}
              curve={shape.curveCatmullRom}
              numberOfTicks={5}
            >
              <Decorator />
            </LineChart>
          </View>

          {/*SIDE-SCROLL BUTTONS*/}
          <Pressable
            style={{
              zIndex: 5,
              position: 'absolute',
              bottom: "20%",
              right: 0,
              height: '50%',
              width: '40%',
            }}
            onPress={() => {
              setSelectedNode(
                selectedNode === semesterInfo.length - 1 ? 0 : selectedNode + 1
              )
              setCurrentSemester(
                selectedNode + 1 === semesterInfo.length
                  ? semesterInfo[0]
                  : semesterInfo[selectedNode + 1]
              )
            }}
          />
          <Pressable
            style={{
              zIndex: 5,
              position: 'absolute',
              bottom: "20%",
              left: 0,
              height: '50%',
              width: '40%'
            }}
            onPress={() => {
              setSelectedNode(
                selectedNode === 0 ? semesterInfo.length - 1 : selectedNode - 1
              )
              setCurrentSemester(
                selectedNode - 1 === -1
                  ? semesterInfo[semesterInfo.length - 1]
                  : semesterInfo[selectedNode - 1]
              )
            }}
          />
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            height: '20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  )
}

// STLYES - NOTE: Convert to inline
const styles: any = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingHorizontal: Dimensions.get('window').width * 0.05
  },
  courseTitle: {
    borderRadius: 5,
    marginTop: 5,
    width: '90%',
    textAlign: 'left'
  },
  distLetter: {
    paddingVertical: 8,
    paddingLeft: 16,
    borderRadius: 10,
    alignItems: 'center'
  },
  distA: {
    backgroundColor: colors.BLUE,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0
  },
  distB: {
    backgroundColor: colors.GREEN,
    borderRadius: 0,
    borderLeftWidth: 0
  },
  distC: {
    backgroundColor: colors.ORANGE,
    borderRadius: 0,
    borderLeftWidth: 0
  },
  distF: {
    backgroundColor: colors.RED,
    borderRadius: 0,
    borderLeftWidth: 0
  },
  distQ: {
    backgroundColor: colors.PURPLE,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderLeftWidth: 0
  }
})

export default SemesterDistribution
