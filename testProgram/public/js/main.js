let value = 0;

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function refreshPage(){
    value = 1;
    if (value == 1){
        await wait(2000);
        window.location.reload(true);
        value = 0;
    }
    
}
