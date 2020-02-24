//get data


//listen for auth status changes logout and login
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user login in ' + user.email);
        //database clouds
        // db.collection('guides').get().then( snapshot =>{
        //     setupGuides(snapshot.docs);
        //     setupUI(user);
        // });

        //realtime database clouds
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs);
            setupUI(user);
        }, err => {
            console.log(err.message);
        });

    } else {
        console.log('user logout');
        setupGuides([]);
        setupUI('');
    }

});
//create new guide
const createFrom = document.querySelector('#create-form');
createFrom.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('guides').add({
        title: createFrom.title.value,
        content: createFrom.content.value
    }).then(() => {
        // console.log(cred);
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createFrom.reset();
    }).catch(err => {
        console.log(err.message);
    });
});
//console.log(d);
//singup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred);
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        }).then(() => {
            const modal = document.querySelector('#modal-signup');
            M.Modal.getInstance(modal).close();
            signupForm.reset();
        });

    });
});
//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("user click signup out");
    });
});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then((e) => {
        //console.log(e);
        ////console.log(e.user.email);
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
});