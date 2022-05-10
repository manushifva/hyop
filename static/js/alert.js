function endTransName() {
    var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }
    let bodyStyle = document.body.style

    for(let transition in transitions) {
        if(bodyStyle[transition] != undefined) {
            return transitions[transition]
        } 
    }
}

function showAlert(title, message) {
    id = Math.round(Math.random() * 6969)
    $('.alert-container').append(`
        <div class = "alert active" id = "alert-${id}">
            <div class = "alert-content">
                <b>${title}</b>
                <span>${message}</span>
            </div>
            <div class = "alert-loader" id = "alertl-${id}"></div>
        </div>
    `)

    $(`.alert#alert-${id}`).append(`<\script>
        setTimeout(() => {
            $('#alertl-${id}').addClass('anim')
            setTimeout(() => {
                $('#alert-${id}').removeClass('active')
                $('#alert-${id}').addClass('inactive')
                setTimeout(() => {
                    $('#alert-${id}').remove()
                }, 1000)
            }, 5000)
        }, 1000)
    </\script>`)
}