import { Pressable, Text } from 'react-native'
import { useAppKit } from '@reown/appkit-wagmi-react-native'
import React from 'react'

export default function ConnectView() {
  const { open } = useAppKit()

  return (
    <>
      <Pressable onPress={() => { console.log("Pressed!"); open();}}>
        <Text>Open Connect Modal</Text>
      </Pressable>
    </>
  )
}