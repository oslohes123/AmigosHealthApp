import test from 'ava'
import app from '../../../index'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { createUserWithID, deleteUserRow, createHashedPassword, createToken } from '../../../utils/userFunctions'
import cloneDeep from 'lodash/cloneDeep'
import { setUpCompletedWorkoutForTests } from '../../../utils/Exercise/setUpCompletedWorkoutForTests'
// import { selectAllActualExercises, selectAllCompletedWorkoutNames, selectAllTrackedWorkoutsWithExercises } from '../../../../utils/Exercise/exerciseFunctions'
import { getTodaysDate } from '../../../utils/convertTimeStamptz'
import { deleteMultipleExercises } from '../../../utils/Exercise/insertAndDeleteMultipleExercises'
import RouteNamesClass from '../../../utils/routeNamesClass'
const routeNames = new RouteNamesClass()
const getWorkoutHistoryByDateRoute = routeNames.fullGetWorkoutHistoryByDateURL
let token: string
const uuid = uuidv4()
const randomEmail = `${uuid}@example.com`
test.before(async (t: any) => {
  const hashedPassword = await createHashedPassword('Password123!')
  const { error } = await createUserWithID({
    id: uuid,
    firstName: 'firstName',
    lastName: 'lastName',
    email: randomEmail,
    password: hashedPassword,
    age: 20
  })
  if (error) {
    t.fail(JSON.stringify(error))
  }
  token = createToken(uuid)
})
test.after.always(async (t: any) => {
  const { error } = await deleteUserRow(randomEmail)
  if (error) {
    t.fail('Deleting user went wrong!')
  }
  const { errorDeletingMultipleExercises }: any = await deleteMultipleExercises([{ name: `Test Curl ${uuid}` }, { name: `Slow Jog ${uuid}` }])
  if (errorDeletingMultipleExercises) {
    t.fail(JSON.stringify(errorDeletingMultipleExercises))
  }
})

interface getWorkoutHistoryByDateRequest {
  userid?: string
  date?: string
}
const validRequest: getWorkoutHistoryByDateRequest = {
  userid: uuid,
  date: getTodaysDate()
}
test('getWorkoutHistoryByDate route is correct', (t: any) => {
  t.true(getWorkoutHistoryByDateRoute === '/api/user/completedWorkouts/workoutHistoryByDate')
})
test(`GET ${getWorkoutHistoryByDateRoute} returns error when userid is missing`, async (t: any) => {
  const invalidRequest = cloneDeep(validRequest)
  delete invalidRequest.userid
  const response = await request(app)
    .get(getWorkoutHistoryByDateRoute)
    .set({ authorization: token, ...invalidRequest })
  t.true(response.status === 400)
  t.true(JSON.stringify(response.body) === JSON.stringify({ mssg: 'Something went wrong!', dev: 'JSON instance does not follow the JSON schema' }))
})

test(`GET ${getWorkoutHistoryByDateRoute} returns error when date is missing`, async (t: any) => {
  const invalidRequest = cloneDeep(validRequest)
  delete invalidRequest.date
  const response = await request(app)
    .get(getWorkoutHistoryByDateRoute)
    .set({ authorization: token, ...invalidRequest })
  t.true(response.status === 400)
  t.true(JSON.stringify(response.body) === JSON.stringify({ mssg: 'Something went wrong!', dev: 'JSON instance does not follow the JSON schema' }))
})

test.serial(`GET ${getWorkoutHistoryByDateRoute} returns empty arrays with user who has no workouts`, async (t: any) => {
  const response = await request(app)
    .get(getWorkoutHistoryByDateRoute)
    .set({ authorization: token, ...validRequest })

  t.true(response.status === 200)
  t.true(JSON.stringify(response.body) === JSON.stringify({ mssg: 'Success!', arrayOfWorkoutNamesAndIDs: [], graphLabels: [], graphData: [] }))
})

test.serial(`GET ${getWorkoutHistoryByDateRoute} returns arrays of data with user who has workouts`, async (t: any) => {
  const nameOfWorkout = 'Test Workout Plan'
  const { errorSetUpCompletedWorkoutForTests, successSetUpCompletedWorkoutForTests } = await setUpCompletedWorkoutForTests(uuid, nameOfWorkout)
  if (errorSetUpCompletedWorkoutForTests || !successSetUpCompletedWorkoutForTests) {
    t.fail('Error setting up completed workout for tests')
  }
  const response = await request(app)
    .get(getWorkoutHistoryByDateRoute)
    .set({ authorization: token, ...validRequest })

  t.true(response.status === 200)
  t.true(response.body.mssg === 'Success!')
  t.true(JSON.stringify(response.body.graphLabels) === JSON.stringify([`Test Curl ${uuid}`, `Slow Jog ${uuid}`]))
  t.true(JSON.stringify(response.body.graphData) === JSON.stringify([1, 1]))
  try {
    t.true(response.body.arrayOfWorkoutNamesAndIDs[0].workoutname === nameOfWorkout)
  }
  catch (error) {
    t.fail('Failed to get first index of array or workoutname property')
  }
})
