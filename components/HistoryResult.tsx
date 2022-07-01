import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { Icon } from 'react-native-elements'

interface Props {
  route: {
    params: {
      navigation: any
      nextScreen: string
      nextScreenParams: any
      displayText: string
      filterItem: any
      history: never[]
      setHistory: (value: any) => any
    }
  }
}

export const HistoryResult = (Props: Props['route']['params']) => {
  return (
    <View
      key={undefined}
      style={{
        width: '95%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 8,
      }}
    >
      <Pressable
        onPress={() =>
          Props.navigation.navigate(Props.nextScreen, Props.nextScreenParams)
        }
        style={{ width: '100%' }}
      >
        <Text
          key={undefined}
          style={{
            color: 'rgba(255,255,255,.8)',
            width: '100%',
            fontSize: 28,
          }}
        >
          {Props.displayText}
        </Text>
      </Pressable>
      <Pressable
        onPress={() =>
          Props.setHistory(
            Props.history.filter((elem) => {
              return elem !== Props.filterItem
            })
          )
        }
      >
        <Icon
          tvParallaxProperties={undefined}
          name="close"
          size={20}
          style={{
            color: 'rgba(255,255,255,.8)',
            paddingTop: 1,
          }}
        />
      </Pressable>
    </View>
  )
}
