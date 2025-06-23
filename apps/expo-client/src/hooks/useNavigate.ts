import { Href, useRouter } from 'expo-router'

export const useNavigate = () => {
  const router = useRouter()

  return (link: string) => {
    if (link) {
      router.push(link as Href<string>)
    }
  }
}
