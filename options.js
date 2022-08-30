const signUpDiv = document.querySelector('.signup-div');
const profileInfoDiv = document.querySelector('.profile-info-div');
const loginBtn = document.querySelector('#login-btn')
const registerBtn = document.querySelector('#register-btn')
const signOutBtn = document.querySelector('#sign-out-btn')
const responseMsgDiv = document.querySelector('.response-msg-div')

const backend_url = `http://localhost:3000`

chrome.storage.sync.get('user', function(result){
    
    const user = result.user;
    if(!user || typeof user != 'object' || Object.keys(user).length == 0){
        signUpDiv.classList.remove('hidden')
        profileInfoDiv.classList.add('hidden')
    }else{

        profileInfoDiv.querySelector('div').innerHTML = `${user.role}: ${user.username}`;
        signUpDiv.classList.add('hidden')
        profileInfoDiv.classList.remove('hidden')
    }
})

signOutBtn.addEventListener('click', () =>{
    chrome.storage.sync.remove('user', () =>{
        window.location.reload();
    })
})

loginBtn.addEventListener('click', ()=>{
    const username = document.querySelector('.login-div #username').value;
    const password = document.querySelector('.login-div #password').value;
    
    login(username, password)
})

registerBtn.addEventListener('click', ()=>{
    const username = document.querySelector('.register-div #username').value;
    const password = document.querySelector('.register-div #password').value;
    const role = document.querySelector('.register-div #roles').value;

    register(username, password, role)
})


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function login(username, password){
    //send http request to backend

    fetch(`${backend_url}/login`, {method: 'POST', body: JSON.stringify({username, password}), headers:{'Content-Type': 'application/json'}, credentials: 'same-origin'})
    .then(response => response.json())
        .then(response => {
            switch (response.status) {
                case 200:
                    const decodedJwt = parseJwt(response.payload.token)
                    chrome.storage.sync.set({ user: { username: decodedJwt.username, role: decodedJwt.role, token: response.payload.token } }, () => {
                        window.location.reload();
                    })
                break;
            case 400:
                if(response.code == 10003){
                    //user does not exist
                    responseMsgDiv.innerHTML = `User ${username} not found.`
                }else if(response.code == 10004){
                    //invalid password
                    responseMsgDiv.innerHTML = `Invalid password.`
                }else{
                    //some other error
                    responseMsgDiv.innerHTML = `Error occured`
                }
                break;
        }
    })
    .catch(error=>{
        responseMsgDiv.innerHTML = `Error occured`
        console.log(error)
    })
}

function register(username, password, role){
    fetch(`${backend_url}/register`, {method: 'POST', body: JSON.stringify({username, password, role}), headers:{'Content-Type': 'application/json'}, credentials: 'same-origin'})
    .then(response => response.json())
        .then(response => {
            switch (response.status) {
                case 201:
                    const decodedJwt = parseJwt(response.payload.token)
                    chrome.storage.sync.set({ user: { username: decodedJwt.username, role: decodedJwt.role, token: decodedJwt.token } }, () => {
                        window.location.reload();
                    })
                break;
            case 400:
                if(response.code == 10002){
                    //user does not exist
                    responseMsgDiv.innerHTML = `User ${username} already exists.`
                }else{
                    //some other error
                    responseMsgDiv.innerHTML = `Error occured`
                }
                break;
        }
    })
    .catch(error=>{
        responseMsgDiv.innerHTML = `Error occured`
        console.log(error)
    })
}