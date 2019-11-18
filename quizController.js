import { UIController } from './UIController.js';


export var quizController = (function () {
  
  
/*******************QUIZ CONTROLER*/

	/*-----Question constructor*/
	function Question(id, questionText, options, correctAnswer) {
		this.id = id;
		this.questionText = questionText;
		this.options = options;
		this.correctAnswer = correctAnswer;
	}
	
	var questionLocalStorage = {
		setQuestionCollection: function (newCollection) {
			localStorage.setItem('questionCollection', JSON.stringify(newCollection));
		},
		getQuestionCollection: function () {
			return JSON.parse(localStorage.getItem('questionCollection'));
		},
		removeQuestionCollection: function () {
			localStorage.removeItem('questionCollection');
		}
	};
	
	if (questionLocalStorage.getQuestionCollection() === null) {
		questionLocalStorage.setQuestionCollection([]);
	}
	
	var quizProgress = {
		questionIndex: 0
	};
	
	/************* Person constructor******/
	
	function Person(id, firstname, lastname, score) {
		this.id = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.score = score;
		
	}
	
	var currPersonData = {
		fullname: [],
		score: 0
	};
	
	var adminFullName = ['a', 'a'];
	
	var personLocalStorage = {
		
		setPersonData: function (newPersonData) {
			localStorage.setItem('personData', JSON.stringify(newPersonData));
		},
		getPersonData: function () {
			return JSON.parse(localStorage.getItem('personData'));
		},
		removePersonData: function () {
			localStorage.removeItem('personData');
		}
	};
	
	if (personLocalStorage.getPersonData() === null) {
		personLocalStorage.setPersonData([]);
	}
	
	return {
		
		getQuizProgress: quizProgress,
		
		getQuestionLocalStorage: questionLocalStorage,
		
		addQuestionOnLocalStorage: function (newQuestionText, opts) {
			
			var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
			
			if (questionLocalStorage.getQuestionCollection() === null) {
				questionLocalStorage.setQuestionCollection([]);
			}
			
			optionsArr = [];
			
			isChecked = false;
			
			for (var i = 0; i < opts.length; i++) {
				if(opts[i].value !== "") {
					optionsArr.push(opts[i].value);
				}
				
				if(opts[i].previousElementSibling.checked && 
				   opts[i].value !== '') {
					corrAns = opts[i].value;
					isChecked = true;
				}
			}
			
			// [ {id: 0} { id: 1 } ]
			
			if(questionLocalStorage.getQuestionCollection().length > 0) {
				questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
			} else {
				questionId = 0;
			}
			
			if(newQuestionText.value != '') {
				if(optionsArr.length > 1) {
					if(isChecked) {
					
					newQuestion = new Question(questionId, newQuestionText.value,
											   optionsArr, corrAns);
					getStoredQuests = questionLocalStorage.getQuestionCollection();

					getStoredQuests.push(newQuestion);
			
					questionLocalStorage.setQuestionCollection(getStoredQuests);
			
					newQuestionText.value = '';
					for(var x = 0; x < opts.length; x++) {
						opts[x].value = '';
						opts[x].previousElementSibling.checked = false;
					}
						
			//console.log(questionLocalStorage.getQuestionCollection());
						
						return true;
						
					} else {
						alert('Check correct answer');
						return false;
					}
				
				} else {
					alert('Insert at least 2 options');
					return false;
				}
			
			} else {
				alert('Insert question');
				return false;
			}
			
		},
		
		checkAnswer: function(ans) {
			
			if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
				
				currPersonData.score++;
				
				return true;
			
			} else {
				
				return false;
			}	
		},
		
		
		isFinished: function() {
			
			return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length; 
		},
		
		
		/**------ADD PERSON*******/
		
		addPerson: function() {
			var newPerson, personId, personData;
			
			if(personLocalStorage.getPersonData().length > 0) {
				personId = personLocalStorage.getPersonData()[
					personLocalStorage.getPersonData().length - 1].id + 1;
			} else {
				personId = 0;
			}
			
			newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);
			
			personData = personLocalStorage.getPersonData();
			
			personData.push(newPerson);
			
			personLocalStorage.setPersonData(personData);
			
			//console.log(newPerson);
		},
		
		getCurrPersonData: currPersonData,
		
		getAdminFullName: adminFullName,
		
		getPersonLocalStorage: personLocalStorage
	};
	
})();
