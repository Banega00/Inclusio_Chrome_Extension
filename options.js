// chrome.storage.sync.get('user', function(result){
    
//     const user = result.user;

//     if(!user){

//     }
// })

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
    const jwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4iLCJyb2xlIjoiVm9sdW50ZWVyIiwiaWF0IjoxNTE2MjM5MDIyfQ.fzaqnQmnwr80OW8ibrX6zyLvwwoz86bnYlVStmL5AbE`
    console.log(parseJwt(jwtToken))
    chrome.storage.sync.set({username, jwtToken, role})
}