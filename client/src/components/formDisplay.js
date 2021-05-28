import React from 'react';

function FormDisplay(){
    const [originalUrl , setOriginalUrl] = React.useState(null);
    const [shortUrl, setShortUrl] = React.useState(null);
    const [display, setDisplay] = React.useState("Shorten");
    const [text, setText] = React.useState("");

    let createShortUrl = (e) => {
        e.preventDefault();
        let url = e.target.url.value;
        console.log(url);
        if(display === "Shorten"){
            fetch('/api/shorturl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    domain: url,
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    if(!data.error){
                        console.log(data);
                        setText(data.short_url);
                    }
                })
        } else if (display === "Copy"){

        } else if (display === "Copied"){

        }
    }

    let handleChange = (e) =>{
        setText(e.target.value)
        if(e.target.value === ""){
            setDisplay("Shorten");
        }
    }
    //user enters the original url and clicks submit
    //text input will change to short url
    //submit input will change to copy
    //submit input will change to copied
    //if text input is cleared, reset
    return(
        <div>
            <form onSubmit={createShortUrl}>
                <label for="url">Please enter your URL</label><br></br>
                <input type="text" id="url" placeholder="https://www.example.com" onChange={handleChange} value={text}></input>
                <input type="submit" value={display}></input>
            </form>
        </div>        
    );
}

export default FormDisplay;