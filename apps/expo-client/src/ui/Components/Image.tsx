import { Image as ImageAlias, ImageStyle, StyleProp } from 'react-native'

interface Props {
  uri: string
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center'
  style?: StyleProp<ImageStyle>
}

export const Image = ({ uri, resizeMode = 'contain', style }: Props) => {
  return <ImageAlias source={{ uri }} resizeMode={resizeMode} style={style} />
}
