//IMPORTS
import {
  View,
  SafeAreaView,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native'
import React from 'react'
import { colors } from '../../assets/colors'
import { RootStackParamList, Course as CourseType } from '../../RootStackParams'
import { useState, useEffect } from 'react'
import { LineChart } from 'react-native-svg-charts'
import { G, Text as SVGText, Circle } from 'react-native-svg'
import * as shape from 'd3-shape'

interface Props {
  route: {
    params: {
      course: string
      prof: string
    }
  }
}

// Seasons object for sorting
const seasons: {
  SPRING: number
  SUMMER: number
  FALL: number
  WINTER: number
} = {
  SPRING: 3,
  SUMMER: 2,
  FALL: 1,
  WINTER: 0,
}

async function getSemesters(
  course: string,
  prof: string,
  setSemesterInfo: Function,
  setCurrentSemester: Function
): Promise<any> {
  return await fetch(
    `https://profesy.herokuapp.com/courseAndProf?course=${course}&prof=${prof}`
  )
    .then((result) => result.json())
    .then((result) => {
      const sortedCourses = sortFilterCourses(course, result.message.courses)
      setSemesterInfo(sortedCourses)
      setCurrentSemester(sortedCourses[0])
      return result
    })
    .catch((err) => {
      console.log(err)
    })
}

function sortFilterCourses(courseName: string, courses: CourseType[]) {
  return courses
    .sort((a, b) => {
      const aY = parseInt(
        a.semester.substring(a.semester.length - 4, a.semester.length)
      )
      const bY = parseInt(
        b.semester.substring(b.semester.length - 4, b.semester.length)
      )
      const aS = a.semester.substring(0, a.semester.length - 5)
      const bS = b.semester.substring(0, b.semester.length - 5)
      return aY !== bY ? aY - bY : seasons[bS] - seasons[aS]
    })
    .filter((c: CourseType) => {
      return c.course === courseName
    })
}

export function Course(Props: Props) {
  // const semesterInfo = Props.route.params.courses
  const [semesterInfo, setSemesterInfo] = useState([])
  const semesterGPAs = semesterInfo.map((s) => {
    return parseFloat(s.semGPA)
  })
  const courseAvg =
    semesterGPAs.reduce((total, next) => total + next, 0) / semesterGPAs.length

  // SET STATES
  const [filteredData, setFilteredData] = useState<string[]>([])
  const [wordEntered, setWordEntered] = useState<any>('')
  const [searchBG, setSearchBG] = useState(colors.PURPLE)
  const [currentSemester, setCurrentSemester] = useState<any>(semesterInfo[0])
  const [graphData, setGraphData] = useState<number[]>(
    currentSemester !== undefined
      ? [
          parseInt(currentSemester.A),
          parseInt(currentSemester.B),
          parseInt(currentSemester.C),
          parseInt(currentSemester.F),
          parseInt(currentSemester.Q),
        ]
      : []
  )
  const [togglePercentages, setTogglePercentages] = useState(false)
  const [selectedNode, setSelectedNode] = useState(0)
  useEffect((): Promise<any> => {
    getSemesters(
      Props.route.params.course,
      Props.route.params.prof,
      setSemesterInfo,
      setCurrentSemester
    )
  }, [])

  // FZF STRING MATCH
  // handleSearch - Params(text:string)
  const handleSearch = (text: string) => {
    const searchWord = text
    setWordEntered(searchWord)
    const newFilter: any = semesterInfo.filter((value: CourseType) => {
      return value.semester.toLowerCase().includes(searchWord.toLowerCase())
    })
    if (searchWord === undefined) {
      setFilteredData(semesterInfo.map((info: CourseType) => info.semester))
    } else {
      setFilteredData(newFilter)
    }
  }

  // CHART POINTS
  function Decorator({
    x,
    y,
    data,
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
    <SafeAreaView style={styles.container}>
      {/*HEADER*/}
      <View style={styles.courseTitle}>
        <Text
          style={{
            fontSize: 40,
            paddingHorizontal: 10,
            paddingVertical: 5,
            color: 'white',
            fontWeight: '500',
          }}
        >
          {Props.route.params.course.substring(0, 4)}
          <Text style={{ fontWeight: '300' }}>
            {Props.route.params.course.substring(4, 7)}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '300', paddingBottom: 2 }}>
            {' \n'}
            {Props.route.params.prof}
          </Text>
        </Text>
      </View>

      {currentSemester !== undefined ? (
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '90%', alignItems: 'center' }}>
            {/*SEARCH BAR*/}
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextInput
                onChangeText={handleSearch}
                onFocus={() => {
                  setSearchBG(colors.GREEN)
                  handleSearch('')
                }}
                onBlur={() => setSearchBG(colors.PURPLE)}
                value={wordEntered}
                placeholder="search by semester"
                keyboardAppearance="dark"
                style={[styles.inputStyles, { display: 'none' }]}
              />
            </View>
            {/*SEMSTER LIST*/}
            {false && filteredData.length != 0 && (
              <ScrollView
                style={{
                  width: '100%',
                  paddingHorizontal: 0,
                  flexDirection: 'column',
                  height: '40%',
                  position: 'absolute',
                  top: '16%',
                  zIndex: 3,
                  borderRadius: 5,
                }}
              >
                {filteredData.slice(0, 15).map((value: any, key) => {
                  return (
                    <TouchableOpacity
                      style={styles.resultContainer}
                      onPress={() => {
                        setCurrentSemester(value)
                        setWordEntered(value.semester)
                        setFilteredData([])
                        setGraphData([
                          parseInt(currentSemester.A),
                          parseInt(currentSemester.B),
                          parseInt(currentSemester.C),
                          parseInt(currentSemester.F),
                          parseInt(currentSemester.Q),
                        ])
                        Keyboard.dismiss()
                      }}
                      key={undefined}
                    >
                      <Text style={styles.result}>{value.semester}</Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            )}

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
                    : colors.RED,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  color: 'white',
                  marginRight: 10,
                  fontWeight: '400',
                }}
              >
                Course Average
              </Text>
              <Text
                style={{
                  fontSize: 35,
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: '700',
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
                marginVertical: 30,
                paddingHorizontal: 10,
                width: '100%',
                padding: 20,
                // borderBottomWidth: 0.3,
                // borderBottomColor: colors.GREY,
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 10,
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
                  alignItems: 'center',
                }}
              >
                {currentSemester.semester !== 'none' &&
                  ['A', 'B', 'C', 'F', 'Q'].map((letter) => {
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
                                : letterPercentage / 100,
                          },
                        ]}
                        onPress={() => setTogglePercentages(!togglePercentages)}
                        key={undefined}
                      >
                        <Text
                          style={[
                            {
                              marginLeft: -16,
                              fontWeight: '400',
                              fontSize: 15,
                              color: 'black',
                            },
                            togglePercentages && { fontWeight: '400' },
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
            style={{ height: '24%', width: '95%', zIndex: 1 }}
            svg={{
              strokeWidth: 3,
              stroke:
                parseFloat(courseAvg).toFixed(2) >= 3.5
                  ? colors.BLUE
                  : parseFloat(courseAvg).toFixed(2) >= 3.0
                  ? colors.GREEN
                  : parseFloat(courseAvg).toFixed(2) >= 2.5
                  ? colors.ORANGE
                  : colors.RED,
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
                  : colors.RED,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
                color: 'white',
                fontWeight: '700',
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
              marginTop: 10,
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
              bottom: 0,
              left: 0,
              height: '65%',
              width: '40%',
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

          <View
            style={{ width: '80%', height: 40, borderBottomWidth: 0.3 }}
          ></View>
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            height: '20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.GREY, fontSize: 20 }}>Loading ...</Text>
        </View>
      )}
    </SafeAreaView>
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
  },
  courseTitle: {
    borderRadius: 5,
    marginTop: 5,
    width: '90%',
    textAlign: 'left',
  },
  resultContainer: {
    backgroundColor: 'black',
    padding: 8,
    width: '100%',
    borderWidth: 0.3,
    borderColor: 'white',
  },
  result: {
    color: 'white',
    fontSize: 15,
    padding: 5,
    fontWeight: '700',
  },
  inputStyles: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    flex: 5,
    backgroundColor: 'white',
  },
  distLetter: {
    paddingVertical: 8,
    paddingLeft: 16,
    // borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    // borderColor: 'white',
  },
  distA: {
    backgroundColor: colors.BLUE,
    // borderRightWidth: 2,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  distB: {
    backgroundColor: colors.GREEN,
    borderRadius: 0,
    // borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distC: {
    backgroundColor: colors.ORANGE,
    borderRadius: 0,
    // borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distF: {
    backgroundColor: colors.RED,
    borderRadius: 0,
    // borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distQ: {
    backgroundColor: colors.PURPLE,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderLeftWidth: 0,
  },
})
