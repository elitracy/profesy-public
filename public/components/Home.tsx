import { StyleSheet, Text, SafeAreaView, View, Platform, Image, TextInput, TouchableOpacity } from "react-native"
import { useState } from "react"
import { colors } from "../assets/colors"
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Course } from "../RootStackParams"
import { NavigationContainer, useNavigation, RouteProp} from '@react-navigation/native';
import { Icon } from "react-native-elements"

type homeScreenProp = NativeStackNavigationProp<RootStackParamList, "Home">

async function getProfessor(name:string, setFilteredData: Function): void{
  await fetch(`http://192.168.0.22:8080/professors?name=${name}`)
    .then(result => result.json())
    .then(result => {
        setFilteredData(result.professors)
        return result
    })
    .catch(err => {
        console.error(err)
  })
}

export const Home = () => {
  
  const [searchBG, setSearchBG] = useState(colors.PURPLE)

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  
  const navigation = useNavigation<homeScreenProp>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.title}>
          Profesi 
        </ Text>
        <Text style={styles.username}>
          John Doe 
        </ Text>

        <Image 
          source={{ uri: 'https://picsum.photos/50/50' }}
          style={styles.userImage}
        />
      </View>
      <View style={{width: "80%"}}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
          <Icon name="search" style={{opacity: .7}} tvParallaxProperties={null}/>
          <TextInput 
              onChangeText={(data) => {
                getProfessor(data, setFilteredData)
                setWordEntered(data === undefined ? "" : data);
              }}
              onFocus={() => setSearchBG(colors.GREEN)}
              onBlur={() => setSearchBG(colors.PURPLE)}
              value={wordEntered}
              //clearTextOnFocus={true}
              placeholder="search for professor"
              //defaultValue="search by professor"
              style={[styles.inputStyles, {borderColor: searchBG, flex: 5, marginLeft: -30}]}
            />
        </View>
      </View>
      {filteredData.length != 0 && (
        <View style={{width: "94%", height: "auto", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 0}}>
          {filteredData.slice(0, 15).map((value:{name:string, university:string, overallGPA:string, courses:Course[]}, key) => {
            return (
            <TouchableOpacity 
              style={[styles.resultContainer, { shadowColor:  
                  (parseFloat(value.overallGPA) > 3.6) ? colors.BLUE
                : (parseFloat(value.overallGPA) > 3.0) ? colors.GREEN 
                : (parseFloat(value.overallGPA) > 2.4) ? colors.ORANGE 
                : colors.RED }]}
              onPress={() => navigation.navigate("Professor", {profName: value.name, courses: value.courses})} 
            >
          
              <Text style={{padding: 5, color: "white", fontSize: 25, textAlign: "center", fontWeight: "500", }}> 
                {value.name} {" "}
                <Text style={{textAlign: "right", fontWeight: "800", fontSize: 25, color:  
                  (parseFloat(value.overallGPA) > 3.6) ? colors.BLUE
                : (parseFloat(value.overallGPA) > 3.0) ? colors.GREEN 
                : (parseFloat(value.overallGPA) > 2.4) ? colors.ORANGE 
                : colors.RED }}
              > 
                {parseFloat(value.overallGPA).toFixed(2)}
              </Text>
              </Text>
              <Text style={{marginTop: -6, paddingBottom: 3, color: "white", textAlign: "center", fontSize: 18, opacity: .85}}> 
                {value.university}{" "}
                <Text style={{fontWeight: "800"}}>
                  {value.department} 
                </Text>
              </Text>
              
            </TouchableOpacity>
            );
          })} 
        </View>
      )}
    </ SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
  },
  title:{
    fontSize: 30,
    textAlign: "left",
    flex: 3
  },
  nav:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40
  },
  username:{
    flex: 3,
    textAlign: "right",
    paddingRight: 10,
    fontSize: 20
  },
  userImage:{
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 50 
  },
  inputStyles:{
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    paddingLeft: 30,
    fontSize: 15,
  },
  resultContainer:{
    borderRadius: 25,
    backgroundColor: colors.GRAY, 
    width: "90%",
    height: "auto",
    flexDirection: "column",
    padding: 5,
    margin: 10,    
    //shadowColor: colors.PURPLE,
    shadowOffset: {width: 4, height: 3},
    shadowOpacity: 1,
    shadowRadius: 0,
  }
})
