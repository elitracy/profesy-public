import {
  Image,
  Switch,
  View,
  SafeAreaView,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native'

import { Icon } from 'react-native-elements'
import { colors } from '../assets/colors'
import { RootStackParamList, Course as CourseType } from '../RootStackParams'
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import {
  NavigationContainer,
  useNavigation,
  RouteProp,
} from '@react-navigation/native'
import { useState } from 'react'
import { LineChart } from 'react-native-svg-charts'
import { G, Text as SVGText, Circle } from 'react-native-svg'
import * as shape from 'd3-shape'
import backIcon from '../assets/arrow.png'

interface Props {
  route: {
    params: {
      courses: CourseType[]
      courseName: string
      profName: string
      allCourses: CourseType[]
    }
  }
}

export function Course(Props: Props) {
  const semesterInfo = Props.route.params.courses
  const semesterGPAs = semesterInfo.map((s) => {
    return parseFloat(s.semGPA)
  })
  const courseAvg =
    semesterGPAs.reduce((total, next) => total + next, 0) / semesterGPAs.length
  const [filteredData, setFilteredData] = useState<string[]>([])
  const [wordEntered, setWordEntered] = useState<any>('')

  const [searchBG, setSearchBG] = useState(colors.PURPLE)

  const [currentSemester, setCurrentSemester] = useState<any>(semesterInfo[0])
  const [graphData, setGraphData] = useState<number[]>([
    parseInt(currentSemester.A),
    parseInt(currentSemester.B),
    parseInt(currentSemester.C),
    parseInt(currentSemester.F),
    parseInt(currentSemester.Q),
  ])
  const [togglePercentages, setTogglePercentages] = useState(false)
  const [selectedNode, setSelectedNode] = useState(0)

  const handleSearch = (text: string) => {
    const searchWord = text
    setWordEntered(searchWord)
    const newFilter: any = semesterInfo.filter((value) => {
      return value.semester.toLowerCase().includes(searchWord.toLowerCase())
    })
    if (searchWord === undefined) {
      setFilteredData(semesterInfo.map((info) => info.semester))
    } else {
      setFilteredData(newFilter)
    }
  }

  function Decorator({ x, y, data }: { x: any; y: any; data: number[] }): any {
    return data.map((value: number, index) => (
      <Circle
        key={index}
        cx={x(index)}
        cy={y(value)}
        r={12}
        stroke={'rgb(134, 65, 244)'}
        strokeWidth={3}
        fill={selectedNode === index ? 'rgb(134, 65, 244)' : 'white'}
        onPress={() => {
          setCurrentSemester(
            semesterInfo.find((s) => parseFloat(s.semGPA) === value)
          )
          setSelectedNode(index)
        }}
      />
    ))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.courseTitle}>
        <Text
          style={{
            fontSize: 40,
            paddingHorizontal: 30,
            paddingVertical: 10,
            color: 'white',
            fontWeight: '500',
          }}
        >
          {Props.route.params.courseName.substring(0, 4)}
          <Text style={{ fontWeight: '300' }}>
            {Props.route.params.courseName.substring(4, 7)}
          </Text>
          <Text style={{ fontSize: 20, opacity: 0.75, paddingBottom: 2 }}>
            {' '}
            {Props.route.params.profName}
          </Text>
        </Text>
      </View>

      <View style={{ width: '70%', marginTop: 10, alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name="search"
            style={{ opacity: 0.7 }}
            tvParallaxProperties={null}
          />
          <TextInput
            onChangeText={handleSearch}
            onFocus={() => {
              setSearchBG(colors.GREEN)
              handleSearch('')
            }}
            onBlur={() => setSearchBG(colors.PURPLE)}
            value={wordEntered}
            placeholder="search by semester"
            style={[
              styles.inputStyles,
              { borderColor: searchBG, paddingLeft: 30 },
            ]}
          />
        </View>
        {filteredData.length != 0 && (
          <ScrollView
            style={{
              width: '105%',
              paddingHorizontal: 5,
              flexDirection: 'column',
              height: '40%',
              position: 'absolute',
              top: '16%',
              zIndex: 3,
              borderRadius: 10,
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
                >
                  <Text style={styles.result}>{value.semester}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        )}
        <Text style={{ fontSize: 25, textAlign: 'center', marginVertical: 15 }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              opacity: 0.6,
              letterSpacing: -1,
            }}
          >
            {' '}
            {currentSemester.semester.length > 0
              ? currentSemester.semester
              : 'N/A'}
          </Text>
        </Text>

        <View
          style={{
            width: '60%',
            padding: 10,
            borderRadius: 10,
            shadowColor: colors.GRAY,
            shadowOpacity: 1,
            shadowOffset: { width: 1, height: 2 },
            shadowRadius: 1,
            backgroundColor:
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
            <Text style={{ fontWeight: '400', opacity: 0.8 }}>GPA </Text>
            {parseFloat(currentSemester.semGPA).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 15,
            paddingHorizontal: 12,
            width: '120%',
            paddingBottom: 15,
            borderBottomWidth: 0.3,
            borderBottomColor: colors.GREY,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: '300' }}>
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
            {['A', 'B', 'C', 'F', 'Q'].map((letter) => {
              let letterPercentage: any = parseFloat(
                (currentSemester[letter] / currentSemester.CourseTotal) *
                  (100).toFixed(0)
              )

              return (
                <TouchableOpacity
                  style={[
                    styles.distLetter,
                    styles[`dist${letter}`],
                    {
                      flex:
                        letterPercentage < 5 ? 0.06 : letterPercentage / 100,
                    },
                  ]}
                  onPress={() => setTogglePercentages(!togglePercentages)}
                >
                  <Text
                    style={[
                      { marginLeft: -16, fontWeight: '700' },
                      togglePercentages && { fontWeight: '400' },
                    ]}
                  >
                    {togglePercentages ? `${letterPercentage}%` : letter}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60%',
          marginTop: 15,
          padding: 10,
          borderRadius: 10,
          shadowColor: colors.GRAY,
          shadowOpacity: 1,
          shadowOffset: { width: 1, height: 2 },
          shadowRadius: 1,
          backgroundColor:
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
            fontSize: 20,
            color: 'white',
            marginRight: 10,
            opacity: 0.8,
          }}
        >
          Course Average
        </Text>
        <Text
          style={{
            fontSize: 25,
            textAlign: 'center',
            color: 'white',
            fontWeight: '500',
          }}
        >
          {courseAvg.toFixed(2)}
        </Text>
      </View>

      <LineChart
        data={semesterGPAs}
        style={{ height: 200, width: '90%', zIndex: 1 }}
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
      <TouchableOpacity
        style={{
          zIndex: 0,
          position: 'absolute',
          bottom: 0,
          right: 0,
          height: '100%',
          width: '20%',
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
      <TouchableOpacity
        style={{
          zIndex: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '100%',
          width: '20%',
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
      <View style={{ width: '80%', height: 40, borderBottomWidth: 0.3 }}></View>
    </SafeAreaView>
  )
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  courseTitle: {
    backgroundColor: colors.GREEN,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: colors.PURPLE,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 1,
    shadowOpacity: 1,
    width: '90%',
  },
  resultContainer: {
    backgroundColor: colors.GRAY,
    padding: 8,
    width: '100%',
    marginLeft: -4,
    borderWidth: 0.3,
    borderColor: 'white',
    borderRadius: 10,
  },
  result: {
    color: 'white',
    fontSize: 15,
    padding: 10,
    paddingVertical: 5,
    paddingLeft: 4,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  inputStyles: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    flex: 5,
    marginLeft: -30,
  },
  distLetter: {
    paddingVertical: 8,
    paddingLeft: 16,
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'center',
  },
  distA: {
    backgroundColor: colors.BLUE,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  distB: {
    backgroundColor: colors.GREEN,
    borderRadius: 0,
    borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distC: {
    backgroundColor: colors.ORANGE,
    borderRadius: 0,
    borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distF: {
    backgroundColor: colors.RED,
    borderRadius: 0,
    borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distQ: {
    backgroundColor: colors.PURPLE,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderLeftWidth: 0,
  },
})
