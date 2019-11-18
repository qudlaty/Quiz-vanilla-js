
/*******************QUIZ CONTROLER*/

var quizController = (function () {
	
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
			
			var optionsArr, corrAns, questionId, newQuestion, getStoredQuests;
			
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




/************************************
********************* UI CONTROLER*/




var UIController = (function() {
	
	var domItems = {
		/*------Admin Panel Elements*/
		adminPanelSection: document.querySelector(".admin-container"),
		questInsertBtn: document.getElementById("question-insert-btn"),
		newQuestionText: document.getElementById("new-question-text"),
		adminOptions: document.querySelectorAll(".admin-option"),
		adminOptionsContainer: document.querySelector(".admin-options-container"),
		insertedQuestsWrapper: document.querySelector(".inserted-question-wrapper"),
		questUpdateBtn: document.getElementById("question-update-btn"),
		questDeleteBtn: document.getElementById("question-delete-btn"),
		questsClearBtn: document.getElementById("question-clear-btn"),
		resultsListWrapper: document.querySelector(".results-list-wrapper"),
		clearResultsBtn: document.getElementById("results-clear-btn"),
		/****--quiz section elements*/
		quizSection: document.querySelector(".quiz-container"),
		askedQuestText: document.getElementById("asked-question-text"),
		quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
		progressBar: document.querySelector("progress"),
		progressPar: document.getElementById("progress"),
		instantAnsContainer: document.querySelector(".instant-answer-container"),
		instAnsText: document.getElementById("instant-answer-text"),
		instAnsDiv: document.getElementById("instant-answer-wrapper"),
		emotionIcon: document.getElementById("emotion"),
		nextQuestbtn: document.getElementById("next-question-btn"),
		/*** ------Landing page elemants-----***/
		landingPageSection: document.querySelector(".landing-page-container"),
		startQuizBtn: document.getElementById("start-quiz-btn"),
		firstNameInput: document.getElementById("firstname"),
		lastNameInput: document.getElementById("lastname"),
		/*****-----Final results section elements---***/
		finalResultSection: document.querySelector(".final-result-container"),
		finalScoreText: document.getElementById("final-score-text")
			
	};
	
	return {
		getDomItems: domItems,
		
    // adding questions options
		addInputsDynamically: function() {
			
			var addInput = function() {
				
				var inputHTML, z;
        
				z = document.querySelectorAll('.admin-option').length;
				
				inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="option-radio admin-option-' + z + '" name="answer" value="' +
					z + '"> <input type="text" class="admin-option admin-option-' + z + '" value=""></div>';
				
				domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
				
				domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
				
				domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
			}
      
			domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
		},
		
		createQuestionList: function(getQuestions) {
			
			var questHTML, numberingArr;
			
			numberingArr = [];
			
			domItems.insertedQuestsWrapper.innerHTML = "";
			
			for(var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
				
				numberingArr.push(i + 1);
				
				questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button class="secondary-btn" id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';
				
		//console.log(getQuestions.getQuestionCollection()[i].id);
				
				domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
				
			}	
		},
		
    
    /// editing questions 
		editQuestsList: function(event, storageQuestList, addInputsDynFn, updateQuestListFn) {
			
			var getId, getStorageQuestList, placeInArr, optionHTML;
			
			if('question-'.indexOf(event.target.id)) {
				
				getId = parseInt(event.target.id.split('-')[1]);
			
				getStorageQuestList = storageQuestList.getQuestionCollection();
				
				for(var i = 0; i < getStorageQuestList.length; i++) {
					if(getStorageQuestList[i].id === getId) {
						
					var	foundItem = getStorageQuestList[i];
						
						placeInArr = i;
					}
				}
				
				domItems.newQuestionText.value = foundItem.questionText;
				
				domItems.adminOptionsContainer.innerHTML = '';
				
				optionHTML = ''; 
				
				for(var x = 0; x < foundItem.options.length; x++) {
					
					optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="option-radio admin-option-' + x + '" name="answer" value="' + x + '"> <input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';
				}
				domItems.adminOptionsContainer.innerHTML = optionHTML;
				
				domItems.questUpdateBtn.style.visibility = 'visible';
				domItems.questDeleteBtn.style.visibility = 'visible';
				domItems.questInsertBtn.style.visibility = 'hidden';
				domItems.questsClearBtn.style.pointerEvents = 'none';
				
				addInputsDynFn();
				
				
				
				
				var backDefaultViev = function() {
					var updatedOptions;
					
					domItems.newQuestionText.value = '';
					updatedOptions = document.querySelectorAll(".admin-option");		
					for(var i = 0; i < updatedOptions.length; i++) {

						updatedOptions[i].value = '';
						updatedOptions[i].previousElementSibling.checked = false;
					}

					domItems.questUpdateBtn.style.visibility = 'hidden';
					domItems.questDeleteBtn.style.visibility = 'hidden';
					domItems.questInsertBtn.style.visibility = 'visible';
					domItems.questsClearBtn.style.pointerEvents = '';

					updateQuestListFn(storageQuestList);

				}
				
				var updateQuestion = function() {
					var newOptions, optionEls;
					
					newOptions = [];
					
					optionEls = document.querySelectorAll(".admin-option");
					
					foundItem.questionText = domItems.newQuestionText.value;
					
					foundItem.correctAnswer = '';
					
					for(var i = 0; i < optionEls.length; i++) {
						if(optionEls[i].value !== '') {
							newOptions.push(optionEls[i].value);
							if(optionEls[i].previousElementSibling.checked) {
								foundItem.correctAnswer = optionEls[i].value; 
							}
						}
					}
					
					foundItem.options = newOptions;
					
					if(foundItem.questionText !== '') {
						if(foundItem.options.length > 1) {
							if(foundItem.correctAnswer !== '') {
								
								getStorageQuestList.splice(placeInArr, 1, foundItem);
								storageQuestList.setQuestionCollection(getStorageQuestList);
								
								backDefaultViev();
								
							} else {
								alert('Check correct answer');
							}
						} else {
							alert('Insert at least 2 options');
						}
					} else {
						alert('Insert question');
					}
				}
				
				
				domItems.questUpdateBtn.onclick = updateQuestion;
				
				var deleteQuestion = function() {
					
					getStorageQuestList.splice(placeInArr, 1);
					
					storageQuestList.setQuestionCollection(getStorageQuestList);
					
					backDefaultViev();
				}
				
				domItems.questDeleteBtn.onclick = deleteQuestion;
			
			}//first if end
		
		},
		
		
		clearQuestList: function(storageQuestList) {
			
			if(domItems.insertedQuestsWrapper.innerHTML !== null) {
				
				if(storageQuestList.getQuestionCollection().length > 0) {
					
					var conf = confirm('Warning! Delete entire question list ?');
				 	
					if(conf) {
						storageQuestList.removeQuestionCollection();
						domItems.insertedQuestsWrapper.innerHTML = '';
					 
				 	}
					
 				}
				
			}
			
		},
		
		displayQuestion: function(storageQuestionList, progress) {
			var newOptionHTML, characterArr;
			
			characterArr = ['a.', 'b.', 'c.', 'd.', 'e.', 'f.','g', 'h'];
			
			if(storageQuestionList.getQuestionCollection().length > 0) {
				domItems.askedQuestText.textContent = storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;
				
				domItems.quizOptionsWrapper.innerHTML = '';
				//adding new elements dynamically
				for(var i = 0; i < storageQuestionList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
					
					newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + '</span><p class="choice-' + i + '">' + storageQuestionList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
					
					domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
        }
      }
		},
		
		displayProgress: function(storageQuestList, progress) {
			
			domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
			
			domItems.progressBar.value = progress.questionIndex + 1;
			
			domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestList.getQuestionCollection().length; 
		},
		
		newDesign: function(ansResult, selectedAnswer) {
			var twoOptions, index;
			
			index = 0;
			
			if(ansResult) {
				index = 1;
			}
			
			twoOptions = {
				instantAnswerText: ['Wrong answer','Correct answer'],
				instAnswerClass: ['red', 'green'],
				emotionType: ['img/wrong.png', 'img/good.png'],
				optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .8)']
			};
			
			domItems.quizOptionsWrapper.style.cssText = "opacity: 0.4; pointer-events: none;";
			
			domItems.instantAnsContainer.style.opacity = "1";
			
			domItems.instAnsText.textContent = twoOptions.instantAnswerText[index];
			
			domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
			
			domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]) ;
			
			selectedAnswer.previousElementSibling.style.background = twoOptions.optionSpanBg[index];
			
			
		},
		
		resetDesign: function() {
			
			domItems.quizOptionsWrapper.style.cssText = "";
			
			domItems.instantAnsContainer.style.opacity = "0";
		},
		
		getFullName: function(currPerson, storageQuestList, admin) {
			
			if(domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {

				if(!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {

					if(storageQuestList.getQuestionCollection().length > 0) {
						currPerson.fullname.push(domItems.firstNameInput.value);
						currPerson.fullname.push(domItems.lastNameInput.value);

						domItems.landingPageSection.style.display = 'none';
						domItems.quizSection.style.display = 'block';

						console.log(currPerson);
					} else {
						alert("Quiz not ready. Login as admin to add questions.");
					}
					
				} else {

					domItems.landingPageSection.style.display = 'none';
					domItems.adminPanelSection.style.display = 'block';
				}
			} else {
				
				alert('Enter full name');
			}
		},
		
		finalResult: function(currPerson) {
			
			domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ' ur score is ' + currPerson.score;
			
			domItems.quizSection.style.display = 'none';
			domItems.finalResultSection.style.display = 'block';
		},
		
		addResultOnPanel: function(userData) {
			
			var resultHTML;
			
			domItems.resultsListWrapper.innerHTML = '';
			
			for(var i = 0; i < userData.getPersonData().length; i++) {
				
				resultHTML = '<p class="person person-' + i + '"><span class="person-' + i + '">' + userData.getPersonData()[i].firstname + ' ' + userData.getPersonData()[i].lastname + ' - ' + userData.getPersonData()[i].score + ' points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
				
				domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
				
			}
			
		},
		
		deleteResult: function(event, userData) {
			
			var getId, personsArr;
			
			personsArr = userData.getPersonData();
			
			if('delete-result-btn_'.indexOf(event.target.id)) {
				
				getId = parseInt(event.target.id.split('_')[1]);
				
				for(var i = 0; i < personsArr.length; i++) {
					
					if(personsArr[i].id === getId) {
						
						personsArr.splice(i, 1);
						
						userData.setPersonData(personsArr);
					}
				}
				
				
			}
			
		},
		
		
		clearResultsList: function(userData){
			
			var conf;
			if(userData.getPersonData() != null) {
			
				if(userData.getPersonData().length > 0) {

				conf = confirm('!! You will lose result list');

					if(conf) {
						userData.removePersonData();

						domItems.resultsListWrapper.innerHTML = '';
					} 
				}
			}
		}		

	};
	
	
})();


/************************************
******************** CONTROLER*/



var controller = (function(quizCtrl, UICtrl) {
	
	var selectedDomItems = UICtrl.getDomItems; 
	
	UICtrl.addInputsDynamically();
	
	UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
	
	selectedDomItems.questInsertBtn.addEventListener('click', function() {
    
    var adminOptions = document.querySelectorAll('.admin-option');
  
    var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
	
    if(checkBoolean) {
      UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    }
/*    backDefaultViev()*/

	});
	
	selectedDomItems.insertedQuestsWrapper.addEventListener('click', function(e) {
		UICtrl.editQuestsList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
		
	});
	
	selectedDomItems.questsClearBtn.addEventListener('click', function() {
		
		UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
		
	});
	
	UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
	
	UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
	
	
	selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e) {
		
		var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');
		
		for(var i = 0; i < updatedOptionsDiv.length; i++) {
			
			if(e.target.className === 'choice-' + i) {
				
				var answer =  document.querySelector('.quiz-options-wrapper div p.' + e.target.className); 
				
				var answerResult = quizCtrl.checkAnswer(answer);
				
				UICtrl.newDesign(answerResult, answer);
				
				if(quizCtrl.isFinished()) {
					
					selectedDomItems.nextQuestbtn.textContent = 'Finish quiz';
					
				}
				
				var nextQuestion = function(questData, progress) {
					
					if(quizCtrl.isFinished()) {
						
						//finish quiz 
						
						quizCtrl.addPerson();
						
						UICtrl.finalResult(quizCtrl.getCurrPersonData);
						
						
					// console.log('finshed');
						
						
					} else { 
						
						UICtrl.resetDesign();
						
						quizCtrl.getQuizProgress.questionIndex++;
						
						UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
						
						UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

					}
					
				}
				
				selectedDomItems.nextQuestbtn.onclick = function() {
					
					nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
					
				}
			}
		}
	});
	
	selectedDomItems.startQuizBtn.addEventListener('click', function() {
		
		UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
		
	});
	
	
	selectedDomItems.lastNameInput.addEventListener('focus', function() {
		
		selectedDomItems.lastNameInput.addEventListener('keypress', function(e) {
			
			if(e.keyCode === 13) {
				UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
			}
			
		});
	});
	
	
	UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
	
	selectedDomItems.resultsListWrapper.addEventListener('click', function(e) {
		
		UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
		
		UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
		
	});
	
	selectedDomItems.clearResultsBtn.addEventListener('click', function() {
		
		UICtrl.clearResultsList(quizCtrl.getPersonLocalStorage);
		
	});
		
	
})(quizController, UIController);

