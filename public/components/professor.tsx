import { SafeAreaView, Text } from "react-native"
import colors from "../assets/colors"
import { RootStackParamList } from "../RootStackParams"
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

export function Professor(Props:{route:{params:{profName:string}}}){
  console.log(Props.route.params.profName)
  return(
    <SafeAreaView>
      <Text>
        {Props.route.params.profName}
      </Text>
    </SafeAreaView>
  )
}
