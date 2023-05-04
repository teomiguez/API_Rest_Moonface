const checkUserRegisterParams = (params) => {
    let check = false;

    if ((params.name) && (params.surname) && (params.nickname) && (params.email) && (params.password))
    {
        check = true;
    }

    return check;
}

const checkUserLoginParams = (params) => {
    let check = false;

    if ((params.email) && (params.password))
    {
        check = true;
    }

    return check;
}

const checkPublicationParams = (params) => {
    let check = false;
    
    if (params.text)
    {
        check = true;
    }

    return check;
}

const checkNotification = (params) => {
    let check = true;

    if ((!params.reason) || ((params.reason != "newComment") && (params.reason != "newFollow") && (params.reason != "newMessage")))
    {
        check = false;
    }

    return check;
}

module.exports = {
    checkUserRegisterParams,
    checkUserLoginParams,
    checkPublicationParams,
    checkNotification
}