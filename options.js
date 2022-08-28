const signUpDiv = document.querySelector('.signup-div');
const profileInfoDiv = document.querySelector('.profile-info-div');
const loginBtn = document.querySelector('#login-btn')
const registerBtn = document.querySelector('#register-btn')
const signOutBtn = document.querySelector('#sign-out-btn')

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
    console.log('logging in',username, password)
    const jwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4iLCJyb2xlIjoiVm9sdW50ZWVyIiwiaWF0IjoxNTE2MjM5MDIyfQ.fzaqnQmnwr80OW8ibrX6zyLvwwoz86bnYlVStmL5AbE`
    const decodedJwt = parseJwt(jwtToken)

    chrome.storage.sync.set({user: {username: decodedJwt.username, jwtToken, role: decodedJwt.role}}, () =>{
        window.location.reload();
    })
}

function register(username, password, role){

}