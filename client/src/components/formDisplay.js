import React from 'react';

function FormDisplay(){
    const [originalUrl , setOriginalUrl] = React.useState(null);
    const [shortUrl, setShortUrl] = React.useState(null);

    //user enters the original url and clicks submit
    //text input will change to short url
    //submit input will change to copy
    //submit input will change to copied
    //if text input is cleared, reset
    return(
        <div>
            <form>
                <label for="url">Please enter your URL</label><br></br>
                <input type="text" id="url" placeholder="https://www.example.com"></input>
                <input type="submit" value="Shorten"></input>
            </form>
        </div>        
    );
}

export default FormDisplay;