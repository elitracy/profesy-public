import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface Props {
    route: {
        params: {
            navigation: any
            nextScreen: string
            nextScreenParams: any
            displayText: string
            filterItem: any
            history: any[]
            setHistory: (value: any) => any
        }
    }
}

export const HistoryResult = (Props: Props['route']['params']) => {
    return (
        <View
            style={{
                width: '95%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: 14
            }}
        >
            <Pressable
                onPress={() =>
                    Props.navigation.navigate(Props.nextScreen, Props.nextScreenParams)
                }
                style={{ width: '100%' }}
            >
                <Text
                    style={{
                        color: 'rgba(255,255,255,.8)',
                        width: '100%',
                        fontSize: 24
                    }}
                >
                    {Props.displayText}
                </Text>
            </Pressable>
            <Pressable
                onPress={() =>
                    Props.setHistory(
                        Props.history.filter(elem => {
                            return elem != Props.filterItem
                        })
                    )
                }
            >
                <MaterialIcons
                    name="close"
                    size={20}
                    style={{
                        color: 'rgba(255,255,255,.8)',
                        paddingTop: 1
                    }}
                />
            </Pressable>
        </View>
    )
}
