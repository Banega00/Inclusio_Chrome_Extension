const signUpDiv = document.querySelector('.signup-div');
const profileInfoDiv = document.querySelector('.profile-info-div');
const loginBtn = document.querySelector('#login-btn')
const registerBtn = document.querySelector('#register-btn')
const signOutBtn = document.querySelector('#sign-out-btn')
const responseMsgDiv = document.querySelector('.response-msg-div')

const backend_url = `https://680e-34-68-13-255.ngrok.io`

chrome.storage.sync.get('user', function(result){
    
    const user = result.user;
    if(!user || typeof user != 'object' || Object.keys(user).length == 0){
        signUpDiv.classList.remove('hidden')
        profileInfoDiv.classList.add('hidden')
    }else{
        console.log(user)
        profileInfoDiv.querySelector('.username-div').innerHTML = `${user.role}: ${user.username}`;

        let preferencesHtml = ``;
        if(user.role == 'Volunteer'){
            preferencesHtml = `
                <div class="mail-preferences-div">
                    Mail preferences
                    <hr>
                    <div>
                        <input class="form-check-input" type="checkbox" id="checkbox-onPageRequest" ${user.preferences.receiveMail.onPageRequest == true ? "checked" : ""}>
                        <label class="form-check-label" for="checkbox-onPageRequest">Send mail for request for your page improvements</label>
                    </div>
                    <hr>
                    <button id="save-preferences-btn" type="button" class="btn btn-success">Save preferences</button>
                </div>
            `
        }else if(user.role == 'Consumer'){
            preferencesHtml = `
            <div class="mail-preferences-div">
                Mail preferences
                <hr>
                <div>
                    <input class="form-check-input" type="checkbox" id="checkbox-onPageRequest" ${user.preferences.receiveMail.onPageRequest == true ? "checked" : ""}>
                    <label class="form-check-label" for="checkbox-onPageRequest">Send mail to confirm that you requested a page to be processed</label>
                </div>
                <div>
                    <input class="form-check-input" type="checkbox" id="checkbox-onRequestedPagePublished" ${user.preferences.receiveMail.onRequestedPagePublished == true ? "checked" : ""}>
                    <label class="form-check-label" for="checkbox-onRequestedPagePublished">Send mail when page you've requested is published</label>
                </div>
                <hr>
                <button id="save-preferences-btn" type="button" class="btn btn-success">Save preferences</button>
            </div>
        `
        }

        setInterval(()=>{
            document.getElementById('save-preferences-btn').addEventListener('click', savePreferences)
        }, 100)

        profileInfoDiv.querySelector('.preferences').innerHTML = preferencesHtml;

        signUpDiv.classList.add('hidden')
        profileInfoDiv.classList.remove('hidden')
    }
})

function savePreferences(){
    const preferences = { receiveMail: {}}

    const onRequestedPagePublished = document.getElementById('checkbox-onRequestedPagePublished')?.checked;
    const onPageRequest = document.getElementById('checkbox-onPageRequest')?.checked;


    if(onPageRequest != undefined){
        preferences.receiveMail.onPageRequest = onPageRequest;
    }

    if(onRequestedPagePublished != undefined){
        preferences.receiveMail.onRequestedPagePublished = onRequestedPagePublished;
    }

    chrome.storage.sync.get('user', function (result) {
        const user = result.user;
        const token = user.token;

        console.log("Stavljam token:", token)
        fetch(`${backend_url}/preferences`, { method: 'PUT', body: JSON.stringify(preferences), headers: { 'Content-Type': 'application/json', Authorization: token } })
            .then(response => response.json())
            .then(response => {
                switch (response.status) {
                    case 200:
                        const decodedJwt = parseJwt(response.payload.token)
                        chrome.storage.sync.set({ user: { username: decodedJwt.username, role: decodedJwt.role, preferences: decodedJwt.preferences, token: response.payload.token } }, () => {
                            window.location.reload();
                            alert(`Preferences successfully saved!`)
                        })

                        break;
                    default:
                        responseMsgDiv.innerHTML = `Error occured`
                        break;
                }
            })
            .catch(error => {
                responseMsgDiv.innerHTML = `Error occured`
                console.log(error)
            })

    })
}

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
    const email = document.querySelector('.register-div #email').value;
    const role = document.querySelector('.register-div #roles').value;

    register(username, password, email, role)
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
                    console.log(decodedJwt)
                    chrome.storage.sync.set({ user: { username: decodedJwt.username, role: decodedJwt.role, preferences: decodedJwt.preferences, token: response.payload.token } }, () => {
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

function register(username, password, email, role){
    fetch(`${backend_url}/register`, {method: 'POST', body: JSON.stringify({username, password, email, role}), headers:{'Content-Type': 'application/json'}, credentials: 'same-origin'})
    .then(response => response.json())
        .then(response => {
            switch (response.status) {
                case 201:
                    const decodedJwt = parseJwt(response.payload.token)
                    chrome.storage.sync.set({ user: { username: decodedJwt.username, role: decodedJwt.role, preferences: decodedJwt.preferences, token: response.payload.token } }, () => {
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