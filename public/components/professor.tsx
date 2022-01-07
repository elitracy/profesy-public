import { TouchableOpacity, View, StyleSheet, SafeAreaView, Text } from "react-native"
import colors from "../assets/colors"
import { RootStackParamList } from "../RootStackParams"
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation, RouteProp} from '@react-navigation/native';

const departments = [
  "CSCE313",
  "STAT421",
  "MATH304"
]

interface Props{
  route:{params:{profName:string}}
}

type professorScreenProp = NativeStackNavigationProp<RootStackParamList, "Professsor">

export function Professor(Props:Props){
  
  const navigation = useNavigation<professorScreenProp>()

  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {Props.route.params.profName}
      </Text>
      <View style={{borderTopWidth: 1, borderColor: colors.GRAY,flex: .5, opacity: .7, paddingVertical: 6}}>
        <Text style={styles.departmentTitle}>
          Departments
        </Text>
      </View>

      <View style={styles.departments}>
        {departments.map((key,value) => {
          return (
            <TouchableOpacity 
              style={styles.departmentContainer}
              onPress={() => {navigation.navigate("Course", {courseName:key, profName:Props.route.params.profName}); console.log(Props.route.params.profName)}}
            >
              <Text style={styles.department}>
                {key}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View >
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  title:{
    textAlign: "center",
    fontSize: 40,
    marginTop: 50,
    marginBottom: 5
  },
  departmentTitle:{
    fontSize: 30,
    borderBottomWidth: 5,
    borderColor: colors.BLUE,
    paddingHorizontal: 30
  },
  departmentContainer:{
    backgroundColor: colors.GREEN,
    borderRadius: 30,
    marginHorizontal: 30,
    marginVertical: 20,
    shadowColor: colors.ORANGE,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 0
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
  }

})
