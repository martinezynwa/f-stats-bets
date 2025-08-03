import { createBetCompetitionSchema, CreateBetCompetitionSchema } from '@f-stats-bets/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'

import { useCreateBetCompetition } from '@/api'
import { useNavigate } from '@/hooks/useNavigate'
import { useToast } from '@/hooks/useToast'
import { getCurrentDateAndTime } from '@/lib/util'
import { useCatalogStore } from '@/store/useCatalogStore'
import {
  APP_PADDING_TOP,
  DatePickerForm,
  Form,
  ScrollViewWrapper,
  SelectListModalForm,
  TextFormInput,
} from '@/ui'

export const CreateBetCompetition = () => {
  const showToast = useToast()
  const navigate = useNavigate()
  const { leagues, seasons } = useCatalogStore()

  const { mutateAsync: createBetCompetition } = useCreateBetCompetition()

  const form = useForm<CreateBetCompetitionSchema>({
    defaultValues: {
      dateStart: getCurrentDateAndTime(),
      dateEnd: getCurrentDateAndTime(),
    },
    resolver: zodResolver(createBetCompetitionSchema),
  })

  const selectedSeason = form.watch('season')

  const seasonOptions = Object.values(seasons).map(season => ({
    key: season.seasonId,
    value: season.seasonId.toString(),
  }))

  const leagueOptions = Object.values(leagues)
    .filter(league => league.season === Number(selectedSeason))
    .map(league => ({
      key: league.id,
      value: league.name,
    }))

  const onSubmit = async (data: CreateBetCompetitionSchema) => {
    const createdBetCompetition = await createBetCompetition(data)

    if (createdBetCompetition) {
      showToast({
        title: `Bet competition ${createdBetCompetition.name} created successfully`,
      })

      navigate('/(bets)/bet-competitions')
    }
  }

  return (
    <ScrollViewWrapper>
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
        {({ SubmitButton }) => (
          <View style={styles.container}>
            <TextFormInput required name='name' label='Name' type='text' />

            <DatePickerForm required label='Start date' name='dateStart' mode='datetime' />

            <DatePickerForm required label='End date' name='dateEnd' mode='datetime' />

            <TextFormInput required name='playerLimit' label='Player limit' type='number' />

            <SelectListModalForm
              required
              name='season'
              label='Season'
              data={seasonOptions}
              selectTitle='Select season'
            />

            <SelectListModalForm
              required
              name='leagueIds'
              label='Leagues'
              data={leagueOptions}
              selectTitle='Select leagues'
              multiSelect
              disabled={!selectedSeason}
            />

            <TextFormInput
              required
              name='fixtureResultPoints'
              label='Fixture result points'
              type='number'
            />

            <SubmitButton title='Create' />
          </View>
        )}
      </Form>
    </ScrollViewWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: APP_PADDING_TOP,
    gap: 16,
  },
})
