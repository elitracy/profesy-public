import { StyleSheet, Text, SafeAreaView, View } from "react-native"

interface Props{
}

export const Home: React.FC<Props> = ({}) => {

  return (
    <SafeAreaView style={styles.thing}>
      <Text >
        I am the Home Screen
      </ Text>
    </ SafeAreaView>
  )
}

const styles = StyleSheet.create({
  thing:{
    color: "black",
    fontSize: 40,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
})
