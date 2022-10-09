$(document).ready(async function () {

    userIsWhitelisted = false

    let crosssMINTcheckInterval;

    const firebaseConfig = {
        apiKey: "AIzaSyCM0RgYhycoCKNPJL4nfG2md6c9UEu4oao",
        authDomain: "tropicalsloth-7fe42.firebaseapp.com",
        projectId: "tropicalsloth-7fe42",
        storageBucket: "tropicalsloth-7fe42.appspot.com",
        messagingSenderId: "265412275847",
        appId: "1:265412275847:web:0372d08beb1e0da3f99222"
    };

    // Initializing Firebase
    await firebase.initializeApp(firebaseConfig);

    async function fetchWhitelisted(usersAddress) {
        const snapshot = await firebase.firestore().collection('whitelisted').get()
        var address_map = snapshot.docs.map(doc => doc.data());
        for (var i = 0; i < address_map.length; i++) {
            if (address_map[i]["address"] == usersAddress) {
                userIsWhitelisted = true
                break;
            }
        }
        if (userIsWhitelisted == true) {
            // Initialize the button
            clearInterval(crosssMINTcheckInterval);
            $('#pay-credit-card').fadeOut()
            $('#crossmintBTN').show()
        } else {
            alert("You are not whitelisted !!!");
            location.reload()
        }
    }

    $('#checkAddress').click(async () => {
        $('#checkAddress').addClass('disabled')
        let usersAddress = $('#usersAddress').val()
        if (usersAddress !== '') {
            $('#checkAddress').html('...')
            await fetchWhitelisted(usersAddress)
        } else {
            alert("Invalid Email ID !!!")
        }
        $('#checkAddress').removeClass('disabled')
    })

    crosssMINTcheckInterval = setInterval(() => {
        $('#crossmintBTN').hide()
    }, 100)
});