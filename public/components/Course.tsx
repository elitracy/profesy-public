import { Switch, View, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"
import { Icon } from "react-native-elements"
import { colors } from "../assets/colors"
import { RootStackParamList, Course as CourseType } from "../RootStackParams"
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from "react"
import { PieChart } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop, Text as SVGText} from 'react-native-svg'
import * as shape from "d3-shape"

const semesterInfo = [
  {
    semester: "Fall 2019",
    avgGPA: "3.406",
    A: "83",
    B: "45",
    C: "6",
    D: "4",
    F: "4",
    Q: "7",
    courseTotal: "150"
  },
  {
    semester: "Summer 2019",
    avgGPA: "2.512",
    A: "93",
    B: "25",
    C: "2",
    D: "9",
    F: "9",
    Q: "3",
    courseTotal: "141"
  },
  {
    semester: "Spring 2019",
    avgGPA: "3.261",
    A: "46",
    B: "28",
    C: "24",
    D: "4",
    F: "7",
    Q: "9",
    courseTotal: "118"
  },
  {
    semester: "All Time",
    avgGPA: "3.261",
    A: "46",
    B: "28",
    C: "24",
    D: "4",
    F: "7",
    Q: "9",
    courseTotal: "118"
  },
]

interface Props{
  route:{params:{courses:CourseType[], courseName: string, profName: string}}
}

export function Course(Props:Props){

  const semesterInfo = Props.route.params.courses
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const [search, setSearch] = useState("search by semester")
  const [searchBG, setSearchBG] = useState(colors.PURPLE)

  const [currentSemester, setCurrentSemester] = useState(semesterInfo[0])
  const [graphData, setGraphData] = useState([parseInt(currentSemester.A), parseInt(currentSemester.B), parseInt(currentSemester.C), parseInt(currentSemester.F), parseInt(currentSemester.Q)])
  const [togglePercentages, setTogglePercentages] = useState(false)

  console.log(currentSemester)
  const handleSearch = (text:string) => {
    const searchWord = text;
    setWordEntered(searchWord);
    const newFilter:any = semesterInfo.filter((value) => {
      return value.semester.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === undefined) {
      setFilteredData(semesterInfo.map(info => info.semester));
    } else {
      setFilteredData(newFilter);
    }
  }

  const Gradient = () => {

    let start = `0%`
    let A = `${parseFloat(currentSemester.A/currentSemester.courseTotal)*100}%`
    let B = `${parseFloat((currentSemester.A+currentSemester.B)/currentSemester.courseTotal)*100}%`
    let C = `${parseFloat((currentSemester.A+currentSemester.B+currentSemester.C)/currentSemester.courseTotal)*100}%`
    let F = `${parseFloat((currentSemester.A+currentSemester.B+currentSemester.C+currentSemester.F)/currentSemester.courseTotal)*100}%`
    let Q = `${parseFloat((currentSemester.A+currentSemester.B+currentSemester.C+currentSemester.F+currentSemester.Q)/currentSemester.courseTotal)*100}%`
    let end = `100%`
    return(
      <Defs key={'gradient'}>
          <LinearGradient id={'gradient'} x1={'0'} y1={'1'} x2={'0'} y2={'0'}>
              <Stop offset={start} stopColor={colors.BLUE}/>
              <Stop offset={A} stopColor={colors.BLUE}/>
              <Stop offset={B} stopColor={colors.GREEN}/>
              <Stop offset={C} stopColor={colors.ORANGE}/>
              <Stop offset={F} stopColor={colors.RED}/>
              <Stop offset={Q} stopColor={colors.RED}/>
              <Stop offset={end} stopColor={colors.RED}/>
          </LinearGradient>
      </Defs>
  )}

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
          <SVGText
            key={index}
            x={labelCentroid[0]}
            y={labelCentroid[1]}
            fill={'#000'}
            textAnchor={'middle'}
            alignmentBaseline={'center'}
            fontSize={togglePercentages ? 14 : 20}
            fontWeight={"400"}
          >
            {data.key}
          </SVGText>
        );
    });
  }; 

 return(
    <SafeAreaView style={styles.container}>
      <View style={styles.courseTitle}>
        <Text style={{fontSize: 40, paddingHorizontal: 30, paddingVertical: 10, color: "white", fontWeight:"500"}}>
          {Props.route.params.courseName.substring(0,4)}
          <Text style={{fontWeight:"300"}}>
            {Props.route.params.courseName.substring(4,7)}
          </Text>
          <Text style={{fontSize: 20, opacity: .75, paddingBottom: 2 }}>
            {" "}{Props.route.params.profName}
          </Text>
        </Text>
      </View>

      <View style={{width: "70%", marginTop: 20, alignItems: "center"}}>
        <View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center"}}>
          <Icon name="search" style={{opacity: .7}}/>
          <TextInput
              onChangeText={handleSearch}
              onFocus={() => setSearchBG(colors.GREEN)}
              onBlur={() => setSearchBG(colors.PURPLE)}
              value={wordEntered}
              placeholder="search by semester"
              //defaultValue="search by professor"
              style={[styles.inputStyles, {borderColor: searchBG, paddingLeft: 30}]}
          />
        </View>
        {filteredData.length != 0 && (
          <View style={{width: "100%", flexDirection: "column", alignItems: "center", marginTop: -1, position: "absolute", top: "17%", zIndex: 3}}>
            {filteredData.slice(0, 15).map((value:CourseType, key) => {
              return (
                <TouchableOpacity
                  style={styles.resultContainer}
                  onPress={() => {
                    setCurrentSemester(value)
                    setWordEntered(value.semester)
                    setFilteredData([])
                    setGraphData([parseInt(currentSemester.A), parseInt(currentSemester.B), parseInt(currentSemester.C), parseInt(currentSemester.F), parseInt(currentSemester.Q)])
                  }}
                >
                  <Text style={styles.result}>
                    {value.semester}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <Text style={{fontSize: 25, textAlign: "center", marginVertical: 15}}>
          GPA
          <Text style={{textAlign: "center", fontSize: 20, opacity: .6, letterSpacing: -1}}>
            {" "}{currentSemester.semester}
          </Text>
        </Text>

        <View style={{width: "40%", paddingVertical: 10, borderRadius: 10,
          shadowColor: colors.GRAY, shadowOpacity: 1, shadowOffset: {width: 1, height: 2}, shadowRadius: 1, backgroundColor:
            (parseFloat(currentSemester.semGPA) > 3.4) ? colors.BLUE
            : (parseFloat(currentSemester.semGPA) > 2.8) ? colors.GREEN
            : (parseFloat(currentSemester.semGPA)> 2.0) ? colors.ORANGE
            : colors.RED
        }}>
          <Text style={{fontSize: 25, textAlign: "center", color: "white", fontWeight: "500"}}>
            {currentSemester.semGPA}
          </Text>
        </View>
        <View style={{flexDirection: "column", alignItems: "center", marginTop: 15, paddingHorizontal: 12, width: "120%"}}>
          <Text style={{fontSize: 30, fontWeight: "300"}}>
            Grade Distribution
          </Text>

          <View style={{flexDirection: "row", justifyContent:"flex-start", marginTop: 15, alignItems: "center"}}>
          
          {["A","B","C","F","Q"].map(letter => {
            return(
              <TouchableOpacity
                style={[styles.distLetter, styles[`dist${letter}`],{flex: parseFloat(currentSemester[`${letter}`]/currentSemester.CourseTotal)}]}
              >
                <Text style={{marginLeft: -16, fontWeight: "700"}}>
                  {letter}
                </Text>
              </TouchableOpacity>
            )
          })}
          </View>
        </View>
      </View>

      <View style={{flexDirection:"row", alignItems:"flex-start", justifyContent:"flex-start", 
        marginTop: 25, paddingHorizontal: 30, paddingTop: 10 }}>
        <Switch
              trackColor={{ false: colors.GREY, true: colors.GREEN }}
              thumbColor={togglePercentages ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor={colors.GREY}
              onValueChange={setTogglePercentages }
              value={togglePercentages}
              style={{marginTop: 20, marginRight: -20, transform: [{rotate: "-90deg"}]}}
          />
          <PieChart
            style={ { height: 300, width: "100%"} }
            data={graphData.map((value,index) => ({
              value,
              svg:{
              fill: (index === 0) ? colors.BLUE 
                : (index === 1) ? colors.GREEN
                : (index === 2) ? colors.ORANGE
                : (index === 3) ? colors.RED
                : colors.PURPLE
              },
              key: togglePercentages ? `${parseFloat(value/currentSemester.CourseTotal*100).toFixed(0)}%` 
                :  (index === 0) ? "A" 
                : (index === 1) ? "B"
                : (index === 2) ? "C"
                : (index === 3) ? "F" 
                :  "Q"
,
            }))}
            labelRadius={'70%'}
            outerRadius={'100%'}
            innerRadius={'40%'}
          >
            <Labels/>
          </PieChart>
      </View>
            
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  courseTitle:{
    backgroundColor: colors.GREEN,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: colors.PURPLE,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 1,
    shadowOpacity: 1
  },
  resultContainer:{
    borderRadius: 0,
    backgroundColor: colors.GRAY,
    padding: 8,
    width: "102%",
    marginLeft: -4,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    borderRadius: 8,
  },
  result:{
    color:"white",
    fontSize: 15,
    padding: 10,
    paddingVertical: 5,
    paddingLeft: 4,
    fontWeight: "500",
    letterSpacing: .5
  },
  inputStyles:{
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    fontSize: 15,
    flex: 5,
    marginLeft: -30
  },
  distLetter:{
    paddingVertical: 8,
    paddingLeft: 16,
    borderWidth: 2,
    borderRadius: 15,
    alignItems: "center",
  },
  distA:{
    backgroundColor: colors.BLUE,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  distB:{
    backgroundColor: colors.GREEN,
    borderRadius: 0,
    borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distC:{
    backgroundColor: colors.ORANGE,
    borderRadius: 0,
    borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distF:{
    backgroundColor: colors.RED,
    borderRadius: 0,
    borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  distQ:{
    backgroundColor: colors.PURPLE,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderLeftWidth: 0,
  },
})
