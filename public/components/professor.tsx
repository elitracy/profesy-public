import { TouchableOpacity, TextInput, View, ScrollView, StyleSheet, SafeAreaView, Text } from "react-native"
import { colors, randomColor } from "../assets/colors"
import { RootStackParamList, Course } from "../RootStackParams"
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation, RouteProp} from '@react-navigation/native';
import { useState } from "react"
import { Icon } from "react-native-elements"
import fuzzysort from "fuzzysort"

interface Props{
  route:{params:{profName:string, courses:Course[]}}
}

type professorScreenProp = NativeStackNavigationProp<RootStackParamList, "Professor">

export function Professor(Props:Props){

  const allCourses = Array.from([... new Set(Props.route.params.courses.map(obj => {
    return obj.course
  }))]).sort()
  
  const [wordEntered,setWordEntered] = useState("")
  const [searchBG,setSearchBG] = useState(colors.PURPLE)
  const navigation = useNavigation<professorScreenProp>()
  
  const [courses, setCourses] = useState(allCourses)


  function handleSearch(search:string, courses:string[], setCourses: Function){
    setCourses(search.length === 0 ? allCourses : fuzzysort.go(search, courses).map(item => {return item.target})) 
  }

  return(
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          {Props.route.params.profName}
        </Text>
        <View style={{borderTopWidth: 1, borderColor: colors.GRAY,flex: .5, opacity: .7, paddingVertical: 6}}>
          <Text style={styles.departmentTitle}>
           Courses 
          </Text>
        </View>
        <View style={{width: "80%", marginLeft: 40, marginTop: 5}}>
          <View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
            <Icon name="search" style={{opacity: .7}}/>
            <TextInput 
                onChangeText={(word) => {
                  setWordEntered(word)
                  handleSearch(word,courses,setCourses)
                }}
                onFocus={() => setSearchBG(colors.GREEN)}
                onBlur={() => setSearchBG(colors.PURPLE)}
                value={wordEntered}
                clearTextOnFocus={true}
                placeholder="search for course"
                style={[styles.inputStyles, {borderColor: searchBG, flex: 5, marginLeft: -30}]}
              />
          </View>
        </View>

        <View style={styles.departments}>
          {courses.map((course,value) => {
            console.log(course)
            return (
              <TouchableOpacity 
                style={[styles.departmentContainer,{ shadowColor: randomColor() }]}
                onPress={() => {
                  navigation.navigate("Course", {
                    courses: Props.route.params.courses
                             .filter(c => {return c.course.includes(course)}),
                    profName: Props.route.params.profName,
                    courseName: course,
                  }) 
                }}
              >
                <Text style={styles.department}
                >
                  {course.substring(0,4)}
                  <Text style={{ color: "white", opacity: .8, fontWeight: "300", 
                /*(parseFloat(value.overallGPA) > 3.4) ? colors.BLUE
                : (parseFloat(value.overallGPA) > 2.8) ? colors.GREEN 
                : (parseFloat(value.overallGPA)> 2.0) ? colors.ORANGE 
                : colors.RED*/ }}>
                    {course.substring(4,course.length)}
                  </Text>
                </Text>
              </TouchableOpacity>
            )
          })}
        </View >
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title:{
    textAlign: "center",
    fontSize: 40,
    marginTop: 15,
    marginBottom: 5
  },
  departmentTitle:{
    fontSize: 30,
    paddingHorizontal: 30,
    textAlign: "center"
  },
  departmentContainer:{
    backgroundColor: colors.GREEN,
    borderRadius: 30,
    marginHorizontal: 30,
    marginVertical: 10,
    shadowOffset: {width: 3, height: 2},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  department:{
    fontSize: 40,
    textAlign: "center",
    color: "white",
    fontWeight: "500",
    letterSpacing: 5,
    paddingVertical: 15,
    paddingHorizontal: 40

  },
  departments:{
    flex: 6, 
    justifyContent: "flex-start"
  },
  inputStyles:{
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    paddingLeft: 30,
    fontSize: 15,
  }
})
