import { quizController } from './quizController.js';

import { UIController } from './UIController.js';


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

