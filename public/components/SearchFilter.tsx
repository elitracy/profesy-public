import { Pressable, Text } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import { colors } from '../assets/colors'

type Props = {
  route: {
    params: {
      filterType: string
      setFilterType: Dispatch<SetStateAction<string>>
      filterValue: string
      filterTitle: string
    }
  }
}

export const SearchFilter = (Props: Props['route']['params']) => {
  return (
    <Pressable
      style={{
        backgroundColor:
          Props.filterType === Props.filterValue ? colors.GREY : 'black',
        width: '49%',
        borderColor: colors.GREY,
        borderWidth: 2,
        borderRadius: 5,
      }}
      onPress={() => {
        Props.setFilterType(Props.filterValue)
      }}
    >
      <Text
        style={{
          color: 'white',
          fontWeight: '800',
          textAlign: 'center',
          padding: 5,
          paddingVertical: 7,
        }}
      >
        {Props.filterTitle}
      </Text>
    </Pressable>
  )
}
