import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { Text } from '../Typography/Text'
import { Colors } from '../colors'
import { commonLogoBackgroundStyles } from '../common'

import { Image } from './Image'

interface Props {
  headerImageUri?: string
  headerText: string
  subText?: string
  children: ReactNode
}

export const CardList = ({ headerText, subText, headerImageUri, children }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {headerImageUri && (
          <View style={commonLogoBackgroundStyles}>
            <Image uri={headerImageUri} resizeMode='contain' style={styles.logo} />
          </View>
        )}

        <View>
          <Text variant={subText ? 'md' : 'lg'} style={styles.textHeader} fontWeight='500'>
            {headerText}
          </Text>
          {subText && (
            <Text style={styles.textHeader} variant='sm' fontWeight='500'>
              {subText}
            </Text>
          )}
        </View>
      </View>

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.listContainer,
    borderRadius: 8,
    marginVertical: 12,
    paddingBottom: 8,
  },
  textHeader: {
    color: Colors.listTextHeader,
  },
  logo: { height: 24, width: 24 },
  header: {
    backgroundColor: Colors.listHeader,
    paddingLeft: 10,
    paddingVertical: 8,
    marginBottom: 8,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
