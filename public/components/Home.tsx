import { StyleSheet, Text, SafeAreaView, View, Platform, Image, TextInput, TouchableOpacity } from "react-native"
import { useState } from "react"
import colors from "../assets/colors"
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../RootStackParams"
import { NavigationContainer, useNavigation, RouteProp} from '@react-navigation/native';

type homeScreenProp = NativeStackNavigationProp<RootStackParamList, "Home">

const professors = [
  {
    name: "Tanzir Ahmed",
    school: "Texas A&M University",
    department: "CSCE",
    gpa: "4.0",
  },
  {
    name: "Teresa Leyk",
    school: "Texas A&M University",
    department: "CSCE",
    gpa: "3.0"
  },
  {
    name: "Dylan Shell",
    school: "Texas A&M University",
    department: "CSCE",
    gpa: "2.7"
  },
  {
    name: "Shawn Lupoli",
    school: "Texas A&M University",
    department: "CSCE",
    gpa: "1.5"
  },
]

export function Home() {

  const [search, setSearch] = useState("search by professor")
  const [searchBG, setSearchBG] = useState(colors.PURPLE)

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleSearch = (text:string) => {
    const searchWord = text;
    setWordEntered(searchWord);
    const newFilter:any = professors.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  }

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
        <TextInput 
            onChangeText={handleSearch}
            onFocus={() => setSearchBG(colors.GREEN)}
            onBlur={() => setSearchBG(colors.PURPLE)}
            value={wordEntered}
            //clearTextOnFocus={true}
            placeholder="search by professor"
            //defaultValue="search by professor"
            style={[styles.inputStyles, {borderColor: searchBG}]}
          />
      </View>
      {filteredData.length != 0 && (
        <View style={{width: "90%", height: "auto", flexDirection: "column", alignItems: "center", paddingTop: 5, marginTop: 20, borderTopWidth: 1, borderColor: colors.GRAY }}>
          {filteredData.slice(0, 15).map((value:{name:string, school:string, department:string, gpa:string}, key) => {
            return (
            <TouchableOpacity 
              style={styles.resultContainer}
              onPress={() => navigation.navigate("Professor", {profName: value.name})} 
            >
              <Text style={{padding: 5, color: "white", fontSize: 25, textAlign: "center", fontWeight: "500", }}> 
                {value.name} {" "}
                <Text style={{textAlign: "right", fontWeight: "800", fontSize: 25, color:  
                (parseFloat(value.gpa) > 3.4) ? colors.BLUE
                : (parseFloat(value.gpa) > 2.8) ? colors.GREEN 
                : (parseFloat(value.gpa)> 2.0) ? colors.ORANGE 
                : colors.RED }
              }> 
                {value.gpa}
              </Text>
              </Text>
              <Text style={{padding: 5, paddingTop: 0, color: "white", textAlign: "center", fontSize: 18, opacity: .85}}> 
                {value.school}{" "} 
                <Text style={{fontWeight:"800", opacity: 1}}>{value.department}</Text>
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
    paddingLeft: 5,
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
  }
})
