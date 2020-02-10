import {quizController} from './quizController.js';

/********************** UI CONTROLER*********************/

export var UIController = (function() {
	
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
			
			var restoreDefaultView;
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
				
				domItems.questUpdateBtn.style.display = 'inline-block';
				domItems.questDeleteBtn.style.display = 'inline-block';
				domItems.questInsertBtn.style.display = 'none';
				domItems.questsClearBtn.style.pointerEvents = 'none';
				
				addInputsDynFn();
				
				
				
				// here-> change options after adding question ==========>>>>>
				
					restoreDefaultView = function() {
					
					var updatedOptions;
					
					domItems.newQuestionText.value = '';
					updatedOptions = document.querySelectorAll(".admin-option");	
					
					for(var i = 0; i < updatedOptions.length; i++) {

						updatedOptions[i].value = '';
						updatedOptions[i].previousElementSibling.checked = false;
					}

					domItems.questUpdateBtn.style.display = 'none';
					domItems.questDeleteBtn.style.display = 'none';
					domItems.questInsertBtn.style.display = 'inline-block';
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
								
								restoreDefaultView();
								
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
					
					restoreDefaultView();
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
			
			characterArr = ['a', 'b', 'c.', 'd', 'e', 'f','g', 'h'];
			
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

