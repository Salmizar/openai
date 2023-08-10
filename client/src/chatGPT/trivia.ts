import { promptGPT } from '@/chatGPT/chat';
import { IChatMSG } from '../interfaces/interfaces';

function getTriviaTopics(topicCount=5): Promise<IChatMSG> {
    return new Promise((resolve, reject) => {
        const message: object = {
            //system, user, assistant, function
            role: "user",
            content: `Please suggest ${topicCount} topics for a trivia game. keep the descriptions short.`
        };
        promptGPT(message).then((data: IChatMSG) => {
            resolve(data);
        }).catch((error: object) => {
            reject(error);
            console.log('error', error);
        });
    })
}
function getTriviaQuestions(topic:string, numberOfQuestions=10): Promise<IChatMSG> {
    return new Promise((resolve, reject) => {
        const message: object = {
            //system, user, assistant, function
            role: "user",
            content: `Please provide ${numberOfQuestions} multiple choice trivia questions, based on the following topic below. Include the answer after each question, wrapped in curly braces.
            
            "${topic}"`
        };
        console.log('prompt for questions',message);
        promptGPT(message).then((data: IChatMSG) => {
            resolve(data);
        }).catch((error: object) => {
            reject(error);
            console.log('error', error);
        });
    });
}
export { getTriviaTopics, getTriviaQuestions }