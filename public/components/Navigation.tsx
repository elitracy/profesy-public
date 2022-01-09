import { Image, StyleSheet, Text, Pressable, View } from "react-native"
import { useState } from "react"
import { colors } from "../assets/colors"
import accountIcon from "../assets/accountIcon.png"
import homeIcon from "../assets/homeIcon.png"
import favoriteIcon from "../assets/favoriteIcon.png"
import { RootStackParamList } from "../RootStackParams"
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation, RouteProp} from '@react-navigation/native';

type navScreenProp = NativeStackNavigationProp<RootStackParamList>

export function Navigation(){
  
  const navigation = useNavigation<navScreenProp>()
  const [navSelected, setNavSelected] = useState("home")
  
  return(
    <View style={styles.navContainer}>
      
      <Pressable 
        onPress={() => {navigation.navigate("Home"); setNavSelected("home")}}
        style={[navSelected === "home" && styles.pressed, {backgroundColor:"white", borderRadius: 50, width: 60, height: 60, alignItems: "center", justifyContent: "center"}]}
      >
        <Image 
          source={homeIcon} 
          style={{width: 37, height: 37, padding: 5, marginBottom: 3}}
        />
      </Pressable>
      <Pressable 
        onPress={() => {console.log("favorites pressed!"); setNavSelected("favorites")}}
        style={[navSelected === "favorites" && styles.pressed, {backgroundColor:"white", borderRadius: 50, width: 60, height: 60, alignItems: "center", justifyContent: "center"}]}
      >
        <Image 
          source={favoriteIcon} 
          style={{width: 40, height: 40, padding: 5
          }}
        />
      </Pressable>
      <Pressable 
        onPress={() => {console.log("account pressed!"); setNavSelected("account")}}
        style={[navSelected === "account" && styles.pressed, {backgroundColor: "white", borderRadius: 50, width: 60, height: 60, alignItems: "center", justifyContent: "center", overflow: "hidden"}]}
      >
        <Image 
          source={accountIcon} 
          style={{width: 45, height: 45, marginBottom: -5}}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  navContainer:{
    height: "12%", 
    position: "absolute", 
    zIndex: 100, 
    bottom: 0, 
    paddingBottom: 15,
    backgroundColor: "black", 
    width: "100%", 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-around",
    borderTopWidth: 6,
  },
  pressed:{
    borderWidth: 3,
    borderColor: colors.RED,
  },
})
