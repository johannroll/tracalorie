class CalorieTracker {
    constructor () {
        this._calorieLimit = JSON.parse(localStorage.getItem('calorie-limit')) === null ? 0 : JSON.parse(localStorage.getItem('calorie-limit'));
        this._totalCalories = JSON.parse(localStorage.getItem('calorie-total')) === null ? 0 : JSON.parse(localStorage.getItem('calorie-total'));
        this._meals = [];
        this._workouts = [];

        this._populateArrays();
        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
        this._displayMeals();
        this._displayWorkouts();
        this.removeItem();
    }

    _populateArrays() {
        const Items = [];
        for (let [key, value] of Object.entries(localStorage)) {
            Items.push(({ key, value }));
        }
     
        for (let item of Items) {
            const itemParsed = JSON.parse(item.value);
            if (itemParsed.type === 'meal') {
                console.log(itemParsed);
                this._meals.push(itemParsed);
            } else if (itemParsed.type === 'workout') {
                console.log(itemParsed);
                this._workouts.push(itemParsed);
            }
        }


    }
    
    //Public Methods/API //
    addMeal(meal) {
        this._meals.push(meal);
        const calsConsumed = this._meals.reduce((total, meal) => 
                total + meal.calories,0
        );
        localStorage.setItem('calories-consumed', JSON.stringify(calsConsumed));

        this._totalCalories = JSON.parse(localStorage.getItem('calories-consumed')) - JSON.parse(localStorage.getItem('calories-workout'));

        localStorage.setItem('calorie-total', JSON.stringify(this._totalCalories));

        localStorage.setItem(`${meal.id}`, JSON.stringify(meal));
        this._displayMeals()
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        console.log(this._workouts);
        const calsWorked = this._workouts.reduce((total, workout) => 
            total + workout.calories,0
        );
        localStorage.setItem('calories-workout', JSON.stringify(calsWorked));

        this._totalCalories = JSON.parse(localStorage.getItem('calories-consumed')) - JSON.parse(localStorage.getItem('calories-workout'));

        localStorage.setItem('calorie-total', JSON.stringify(this._totalCalories));

        localStorage.setItem(`${workout.id}`, JSON.stringify(workout));
        this._displayWorkouts();
        this._render();
    }

    removeItem() {
        const deleteItems = document.querySelectorAll('.delete');
        deleteItems.forEach(item => {
            item.removeEventListener('click', this._deleteItem.bind(this), true)
            item.addEventListener('click', this._deleteItem.bind(this), true)
        });
    }

     _deleteItem (e) {
         if (e.target.classList.contains('delete')) {
            
             const removeEl = e.target.closest('.card');
             const itemRM = removeEl.getAttribute('data-id');
             
             if (removeEl) {
                 const parentId = removeEl.parentElement.getAttribute('id');
                 console.log(parentId);
               
         
                if (parentId === 'meal-items') {

                    const mealItems = document.getElementById('meal-items');

                    const totalCalsSubstract = this._meals.filter(meal => (meal.id === itemRM));
                    this._totalCalories -= totalCalsSubstract[0].calories;
                    localStorage.setItem('calorie-total', JSON.stringify(this._totalCalories));

                    this._meals = this._meals.filter(meal => (meal.id !== itemRM));
                    const calsConsumed = this._meals.reduce((total, meal) => 
                        total + meal.calories,0
                    );
                    localStorage.setItem('calories-consumed', JSON.stringify(calsConsumed));
                    localStorage.removeItem(itemRM)
                    mealItems.removeChild(removeEl);

                    this._displayCaloriesConsumed();

                } else if (parentId === 'workout-items') {

                    const workoutItems = document.getElementById('workout-items')
                    
                    const totalCalsAdd = this._workouts.filter(workout => (workout.id === itemRM));
                    console.log(totalCalsAdd[0].calories);
                    this._totalCalories += totalCalsAdd[0].calories;
                    console.log(this._totalCalories);
                    localStorage.setItem('calorie-total', JSON.stringify(this._totalCalories));

                    this._workouts = this._workouts.filter(workout => (workout.id !== itemRM));
                    const calsWorked = this._workouts.reduce((total, workout) => 
                        total + workout.calories,0
                    );
                    localStorage.setItem('calories-workout', JSON.stringify(calsWorked));
                    

                    localStorage.removeItem(itemRM);
                    workoutItems.removeChild(removeEl);

                    this._displayCaloriesBurned();
                }
            } 
            
        } else if (e.target.classList.contains('fa-xmark')) {
          
            const removeElAlt = e.target.closest('.card');
            const itemRM = removeElAlt.getAttribute('data-id');
            console.log(itemRM);

            if (removeElAlt) {
                const parentIdAlt = removeElAlt.parentElement.getAttribute('id');
                                
                if (parentIdAlt === 'meal-items') {

                    const mealItems = document.getElementById('meal-items');

                    const totalCalsSubstract = this._meals.filter(meal => (meal.id === itemRM));
                    this._totalCalories -= totalCalsSubstract[0].calories;
                    localStorage.setItem('calorie-total', JSON.stringify(this._totalCalories));

                    this._meals = this._meals.filter(meal => (meal.id !== itemRM));
                    const calsConsumed = this._meals.reduce((total, meal) => 
                        total + meal.calories,0
                    );
                   
                    localStorage.setItem('calories-consumed', JSON.stringify(calsConsumed));

                    localStorage.removeItem(itemRM);
                    mealItems.removeChild(removeElAlt);

                    this._displayCaloriesConsumed();

                } else if (parentIdAlt === 'workout-items') {

                    const workoutItems = document.getElementById('workout-items')

                    const totalCalsAdd = this._workouts.filter(workout => (workout.id === itemRM));
                    console.log(totalCalsAdd[0].calories);
                    this._totalCalories += totalCalsAdd[0].calories;
                    localStorage.setItem('calorie-total', JSON.stringify(this._totalCalories));

                    this._workouts = this._workouts.filter(workout => (workout.id !== itemRM));
                    const calsWorked = this._workouts.reduce((total, workout) => 
                        total + workout.calories,0
                    );

                    localStorage.setItem('calories-workout', JSON.stringify(calsWorked));

                    localStorage.removeItem(itemRM);
                    workoutItems.removeChild(removeElAlt);

                    this._displayCaloriesBurned();
                }
            } 
            
        }
        
        
       this._render();
        e.target.removeEventListener('click', this._deleteItem.bind(this), true);
        
    }

    //Private Methods
    _displayCaloriesLimit () {
        const caloriesLimitEl = document.getElementById('calories-limit');
        const btnMealOpenModal = document.querySelector('.btnMealOpenModal');
        const btnWorkoutOpenModal = document.querySelector('.btnWorkoutOpenModal');

        const calLimit = JSON.parse(localStorage.getItem('calorie-limit'));
        if (calLimit === null) {
            this._calorieLimit = 0;
            btnMealOpenModal.setAttribute('data-bs-toggle', 'modal');
            btnWorkoutOpenModal.setAttribute('data-bs-toggle', 'modal');

        } else {
            this._calorieLimit = calLimit;
            btnMealOpenModal.removeAttribute('data-bs-toggle', 'modal');
            btnWorkoutOpenModal.removeAttribute('data-bs-toggle', 'modal');
        }
        caloriesLimitEl.innerHTML = this._calorieLimit;
        this._displayCaloriesRemaining();
    }

    _displayCaloriesTotal () {
        const totalCaloriesEl = document.getElementById('calories-total');
        const calorieTotal = JSON.parse(localStorage.getItem('calorie-total')) !== null ? JSON.parse(localStorage.getItem('calorie-total')) : 0;
        totalCaloriesEl.innerHTML = calorieTotal;
    }

    _displayCaloriesConsumed () {
        const caloriesConsumedEl = document.getElementById('calories-consumed');
       
        const calsEaten = this._meals.reduce((total, meal) => 
            total + meal.calories,0
        );

      
        
        caloriesConsumedEl.innerHTML = JSON.parse(localStorage.getItem('calories-consumed')) === null ? 0 : JSON.parse(localStorage.getItem('calories-consumed')) ;
    }

    _displayCaloriesBurned () {
        const caloriesBurnedEl = document.getElementById('calories-burned');

        let calsBurned = this._workouts.reduce((total, workout) => 
            total + workout.calories,0
        );
       
        caloriesBurnedEl.innerHTML = JSON.parse(localStorage.getItem('calories-workout')) === null ? 0 : JSON.parse(localStorage.getItem('calories-workout')) ;
    }

    _displayCaloriesRemaining () {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const progressBarEl = document.getElementById('calorie-progress');
        
        let calsRemain = this._calorieLimit - JSON.parse(localStorage.getItem('calorie-total'));

        localStorage.setItem('calories-remaining', JSON.stringify(calsRemain));
        
        caloriesRemainingEl.innerHTML = calsRemain;

        if (calsRemain <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('progress-danger');

            progressBarEl.classList.remove('calorie-progress');
            progressBarEl.classList.add('progress-danger');
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('progress-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            
            progressBarEl.classList.remove('progress-danger');
            progressBarEl.classList.add('calorie-progress');
        }
    }

    _resetDay() {
        localStorage.clear();
        this._displayCaloriesLimit();
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        const caloriesConsumedEl = document.getElementById('calories-consumed').innerHTML = 0;
        const caloriesBurnedEl = document.getElementById('calories-burned').innerHTML = 0;
        const progressBarEl = document.getElementById('calorie-progress').style.width = '0%';
        this._render();
    }

    _displayMeals() {
       
        const mealItems = document.getElementById('meal-items');
        mealItems.innerHTML = '';

        const Items = [];
        for (let [key, value] of Object.entries(localStorage)) {
            Items.push(({key: value}));
        }
      
        for (let item of Items) {
            let itemParsed = JSON.parse(item.key);
            if (itemParsed.type === 'meal') {
                // this._meals = [];
                // this._meals.push(itemParsed);
                const newMeal = document.createElement('div');
                newMeal.classList.add('card', 'my-2', 'shadow');
                newMeal.setAttribute('data-id', itemParsed.id);
                newMeal.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <h4 class="mx-1">${itemParsed.name}</h4>
                            <div
                                id="btn-add-meal"
                                class="fs-1 bg-primary text-white text-center px-2 px-sm-5"
                            >
                                ${itemParsed.calories}
                            </div>
                            <button class="delete btn btn-danger btn-sm mx-2">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>`;
                 
                mealItems.appendChild(newMeal);
            }
        }
    }

    _filterMeals(str) {
        const mealItems = document.getElementById('meal-items');
        mealItems.innerHTML = '';

        const Items = [];
        for (let [key, value] of Object.entries(localStorage)) {
            Items.push(({key: value}));
        }
      
        for (let item of Items) {
            let itemParsed = JSON.parse(item.key);
            if (itemParsed.type === 'meal') {
                if (itemParsed.name.toLowerCase().includes(str.toLowerCase())) {                  
                    const newMeal = document.createElement('div');
                    newMeal.classList.add('card', 'my-2', 'shadow');
                    newMeal.setAttribute('data-id', itemParsed.id);
                    newMeal.innerHTML = `
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <h4 class="mx-1">${itemParsed.name}</h4>
                                <div
                                    id="btn-add-meal"
                                    class="fs-1 bg-primary text-white text-center px-2 px-sm-5"
                                >
                                    ${itemParsed.calories}
                                </div>
                                <button class="delete btn btn-danger btn-sm mx-2">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>`;

                    const deleteEl = newMeal.firstElementChild.firstElementChild.lastElementChild;
                     
                    mealItems.appendChild(newMeal);
                    this.removeItem();
                }
            }
        }
    }

    _displayWorkouts() {   

        const workoutItems = document.getElementById('workout-items');
        workoutItems.innerHTML = '';

        const Items = [];
        for (let [key, value] of Object.entries(localStorage)) {
            Items.push(({key: value}));
        }
      
        for (let item of Items) {
            let itemParsed = JSON.parse(item.key);
            if (itemParsed.type === 'workout') {
                // this._workouts = [];
                // this._workouts.push(itemParsed);
                const newWorkout = document.createElement('div');
                newWorkout.classList.add('card', 'my-2', 'shadow');
                newWorkout.setAttribute('data-id', itemParsed.id);
                newWorkout.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <h4 class="mx-1">${itemParsed.name}</h4>
                            <div
                                id="btn-add-workout"
                                class="fs-1 bg-secondary text-white text-center px-2 px-sm-5"
                            >
                                ${itemParsed.calories}
                            </div>
                            <button class="delete btn btn-danger btn-sm mx-2">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>`;
                
                workoutItems.appendChild(newWorkout);
                
            }
        }
    }

    _filterWorkouts(str) {
        const workoutItems = document.getElementById('workout-items');
        workoutItems.innerHTML = '';

        const Items = [];
        for (let [key, value] of Object.entries(localStorage)) {
            Items.push(({key: value}));
        }
      
        for (let item of Items) {
            let itemParsed = JSON.parse(item.key);
            if (itemParsed.type === 'workout') {
                if (itemParsed.name.toLowerCase().includes(str.toLowerCase())) {
                    const newWorkout = document.createElement('div');
                    newWorkout.classList.add('card', 'my-2', 'shadow');
                    newWorkout.setAttribute('data-id', itemParsed.id);
                    newWorkout.innerHTML = `
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <h4 class="mx-1">${itemParsed.name}</h4>
                                <div
                                    id="btn-add-workout"
                                    class="fs-1 bg-secondary text-white text-center px-2 px-sm-5"
                                >
                                    ${itemParsed.calories}
                                </div>
                                <button class="delete btn btn-danger btn-sm mx-2">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>`;
                    
                    workoutItems.appendChild(newWorkout);
                    this.removeItem();
                }
            }
        }
    }


    _displayCaloriesProgress() {
        const progressBarEl = document.getElementById('calorie-progress');
        const calLimit = JSON.parse(localStorage.getItem('calorie-limit'));
        const totalCals = JSON.parse(localStorage.getItem('calorie-total'));
        const progress  = (totalCals / calLimit) * 100;
        const width = Math.min(progress, 100);
        if (width < 0) {
            progressBarEl.style.width = `0%`; 
        } else {
            progressBarEl.style.width = `${width}%`; 
        }
    }

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
        this._displayMeals();
        this._displayWorkouts();
        this.removeItem();     
    }
}

class Meal {
    constructor (name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.type = 'meal';
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor (name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.type = "workout";
        this.name = name;
        this.calories = calories;
    }
}

class App {
    constructor () {
        this._tracker = new CalorieTracker();
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'))
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'))
        document.getElementById('limit-form').addEventListener('submit', this._setCaloriesLimit.bind(this))
        document.getElementById('reset').addEventListener('click', this._reset.bind(this));
        document.getElementById('filter-meals').addEventListener('input', this._filterMeals.bind(this));
        document.getElementById('filter-workouts').addEventListener('input', this._filterWorkouts.bind(this));
            
    }

    _filterMeals(e) {
        e.preventDefault();      
        this._tracker._filterMeals(e.target.value);
    }

    _filterWorkouts(e) {
        e.preventDefault();      
        this._tracker._filterWorkouts(e.target.value);
    }

    _setCaloriesLimit(e) {
        const inputField = document.querySelector('.saveDailyCals');
        console.log(e.target.elements.limit.value);
        if (inputField.checkValidity()) {
            const btnClose = document.getElementById('close-modal');
            btnClose.click();
        } else {
            e.preventDefault();
            e.stopPropagation();
            console.log("invalid-limit");
            return;    
        }
        
        e.preventDefault();
        
        localStorage.setItem('calorie-limit', JSON.stringify(Number(e.target.elements.limit.value)));
        // localStorage.setItem('calorie-total', JSON.stringify(Number(e.target.elements.limit.value)));
        this._tracker._displayCaloriesLimit();

    }

    _newItem (type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        //Validate inputs
        // if (name.value === '' || calories.value === '') {
        //     alert('Please fill in all fields');
        //     return;
        // }

       
        // if (calories.value <= 0) {
        //     alert('Please enter a positive calorie value greater than zero')
        //     return;
        // } 
                

        const calLimit = JSON.parse(localStorage.getItem('calorie-limit'));
        if (calLimit === 0 || calLimit === null) {
            
            const collapseItem = document.getElementById(`collapse-${type}`)
            const bsCollapse = new bootstrap.Collapse(collapseItem, {toggle: true});
            return;
                    
                  
        }
        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        } else if (type === 'workout') {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }

        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`)
        const bsCollapse = new bootstrap.Collapse(collapseItem, {toggle: true});
    }

    _reset() {
        this._tracker._resetDay();
    }

}

const app = new App();
