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
import { colors } from '../utils/colors'
import { Course as CourseType } from '../RootStackParams'
import { useState, useEffect } from 'react'
import { LineChart } from 'react-native-svg-charts'
import { Circle } from 'react-native-svg'
import * as shape from 'd3-shape'
import getSemesters from '../api/getSemesters'

interface props {
  route: {
    params: {
      course: string
      prof: string
      courseAverage?: string
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
  const courseAvg = courseAverage
    ? courseAverage
    : semesterGPAs.reduce((total, next) => total + next, 0) /
      semesterGPAs.length

  // SET STATES
  const [currentSemester, setCurrentSemester] = useState<any>(semesterInfo[0])
  const [togglePercentages, setTogglePercentages] = useState(false)
  const [selectedNode, setSelectedNode] = useState(0)

  useEffect(() => {
    setLoading(true)
    getSemesters(course, prof, setSemesterInfo, setCurrentSemester).then(() => {
      setLoading(false)
    })
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
        r={8.5}
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
            alignItems: 'center'
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
                borderColor:
                  parseFloat(courseAvg.toFixed(2)) >= 3.5
                    ? colors.BLUE
                    : parseFloat(courseAvg.toFixed(2)) >= 3.0
                    ? colors.GREEN
                    : parseFloat(courseAvg.toFixed(2)) >= 2.5
                    ? colors.ORANGE
                    : colors.RED
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
                {courseAvg.toFixed(2)}
              </Text>
            </View>

            {/*GRADE DISTRIBUTION*/}
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginVertical: 20,
                paddingHorizontal: 10,
                width: '100%',
                padding: 20,
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 10
              }}
              key={undefined}
            >
              <Text
                style={{ fontSize: 30, fontWeight: '300', color: 'white' }}
                key={undefined}
              >
                Grade Distribution
              </Text>

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
          <LineChart
            data={semesterGPAs}
            style={{ height: '25%', width: '100%', zIndex: 1 }}
            svg={{
              strokeWidth: 3,
              stroke:
                parseFloat(courseAvg).toFixed(2) >= 3.5
                  ? colors.BLUE
                  : parseFloat(courseAvg).toFixed(2) >= 3.0
                  ? colors.GREEN
                  : parseFloat(courseAvg).toFixed(2) >= 2.5
                  ? colors.ORANGE
                  : colors.RED
            }}
            contentInset={{ top: 30, bottom: 20, left: 25, right: 25 }}
            curve={shape.curveCatmullRom}
          >
            <Decorator />
          </LineChart>
          {/*GPA*/}
          <View
            style={{
              width: '70%',
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              marginTop: 40,
              borderColor:
                parseFloat(currentSemester.semGPA).toFixed(2) >= 3.5
                  ? colors.BLUE
                  : parseFloat(currentSemester.semGPA).toFixed(2) >= 3.0
                  ? colors.GREEN
                  : parseFloat(currentSemester.semGPA).toFixed(2) >= 2.5
                  ? colors.ORANGE
                  : colors.RED
            }}
          >
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
                color: 'white',
                fontWeight: '700'
              }}
            >
              <Text style={{ fontWeight: '400' }}>GPA </Text>
              {parseFloat(currentSemester.semGPA).toFixed(2)}
            </Text>
          </View>

          {/*SELECTED SEMSTER*/}
          <Text
            style={{
              textAlign: 'left',
              fontSize: 25,
              color: 'white',
              marginTop: 10
            }}
          >
            {' '}
            {currentSemester.semester.length > 0
              ? currentSemester.semester
              : 'N/A'}
          </Text>

          {/*SIDE-SCROLL BUTTONS*/}
          <Pressable
            style={{
              zIndex: 5,
              position: 'absolute',
              bottom: 0,
              right: 0,
              height: '65%',
              width: '40%'
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
              bottom: 0,
              left: 0,
              height: '65%',
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
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
