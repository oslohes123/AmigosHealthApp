export default class RouteNamesClass{

    // All Base Routes
    readonly userBaseURL = '/api/user'
    readonly changeDetailsBaseURL = this.userBaseURL + '/changeProfileDetails'
    readonly exerciseBaseURL = this.userBaseURL + '/exercise'
    readonly workoutBaseURL = this.userBaseURL + '/workout'
    readonly completedWorkoutBaseURL = this.userBaseURL + '/completedWorkouts'
    // Auth Routes
    readonly partialSignupURL = '/sign_up';
    readonly partialLoginURL = '/login';

    readonly fullSignupURL = this.userBaseURL + this.partialSignupURL;
    readonly fullLoginURL = this.userBaseURL + this.partialLoginURL;

    //Change Profile Routes
     
    readonly partialChangeStatsURL = '/stats';
    readonly partialChangePasswordURL = '/password';
    readonly partialDeleteAccountURL = '/deleteAccount';

    readonly fullChangeStatsURL = this.changeDetailsBaseURL + this.partialChangeStatsURL;
    readonly fullChangePasswordURL = this.changeDetailsBaseURL + this.partialChangePasswordURL;
    readonly fullDeleteAccountURL = this.changeDetailsBaseURL + this.partialDeleteAccountURL;
    
    // Check Initial Token Route

    readonly partialCheckInitialTokenURL = '/checkInitialToken';
    readonly fullCheckInitialTokenURL = this.userBaseURL + this.partialCheckInitialTokenURL;

    //  Get Info Route
    readonly partialGetInfoURL = '/getInfo';
    readonly fullGetInfoURL = this.userBaseURL + this.partialGetInfoURL;

    //Exercise And Workout Routes

        //Exercise Routes
            readonly partialSearchExercise = '/search';
            readonly fullSearchExerciseURL = this.exerciseBaseURL + this.partialSearchExercise;
            readonly partialAddToExercises = '/add';
            readonly fullAddToExercisesURL = this.exerciseBaseURL + this.partialAddToExercises;
            readonly partialGetExercise = '/get';
            readonly fullGetExerciseURL = this.exerciseBaseURL + this.partialAddToExercises;
            readonly partialGetExerciseHistory = '/history';
            readonly fullGetExerciseHistoryURL = this.exerciseBaseURL + this.partialGetExerciseHistory;
            readonly partialGetAllExercises = '/getAll';
            readonly fullGetAllExercisesURL = this.exerciseBaseURL + this.partialGetAllExercises;
        //Workout Routes
            readonly partialAddWorkout = '/add';
            readonly fullAddWorkoutURL = this.workoutBaseURL + this.partialAddWorkout;
            readonly partialGetWorkout = '/get';
            readonly fullGetWorkoutURL = this.workoutBaseURL + this.partialGetWorkout;
            readonly partialGetAllWorkoutNames = '/getAllWorkoutNames';
            readonly fullGetAllWorkoutNames = this.workoutBaseURL + this.partialGetAllWorkoutNames;
        
        //Completed Workouts Routes
        readonly partialgetCompletedWorkouts = '/get';
        readonly fullGetCompletedWorkoutURL = this.completedWorkoutBaseURL + this.partialgetCompletedWorkouts;
        readonly partialGetAllCompletedWorkouts = '/getAll';
        readonly fullGetAllCompletedWorkoutURL = this.completedWorkoutBaseURL + this.partialgetCompletedWorkouts;
        readonly partialaddCompletedWorkouts = '/add';
        readonly fullAddCompletedWorkoutURL = this.completedWorkoutBaseURL + this.partialaddCompletedWorkouts;
    }   