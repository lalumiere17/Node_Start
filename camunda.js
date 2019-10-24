const axios = require('axios').default;

const instance = axios.create({
    baseURL: 'http://localhost:8080/engine-rest',
    timeout: 5000
  });

async function StartBookInstance(businessKey, callback){
    instance.post('/process-definition/key/MentorTask/start',
    {
        businessKey: businessKey
    },
    {
        headers: {'content-type': 'application/json'}
    })
    .then((response) => {
        callback(response);
    })
    .catch((err) => {
        console.log(err);
    })
}

function SendNewMessage(messageText, businessKey, callback){
    instance.post('/message',
    {
        messageName: messageText,
        businessKey: businessKey
        //resultEnabled: true
    },
    {
        headers: {'content-type': 'application/json'}
    })
    .then(() => {
        callback();
    })
    .catch((err) => {
        console.log(err)
    })
}

function GetTasksOfInstance(businessKey, callback){
    instance.get(`/task?processInstanceBusinessKey=${businessKey}`)
    .then(function (response) {
        callback(response);
    })
    .catch(function (error) {
         console.log(error.data); 
    });
}

function CompleteTask(businessKey){
    GetTasksOfInstance(businessKey, (response) =>{
        taskArr = response.data;
        let id = taskArr[0].id;
        instance.post(`/task/${id}/complete`, {},
        {
            headers: {'content-type': 'application/json'}
        })
        .catch((err) => {
            console.log("Error!!!");
        })
    });
}

function DeleteInstance(businessKey){

}

module.exports = {
    StartBookInstance,
    SendNewMessage,
    CompleteTask,
    DeleteInstance
};