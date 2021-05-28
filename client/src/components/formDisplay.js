import React, { useRef } from 'react';

function FormDisplay(){
    const [display, setDisplay] = React.useState("Shorten");
    const [text, setText] = React.useState("");
    const [warning, setWarning] = React.useState("");
    const textInputRef = useRef(null);

    const baseURL = window.location.href;

    let createShortUrl = (e) => {
        e.preventDefault();
        let url = e.target.url.value;
        if(display === "Shorten"){
            if(url.match(baseURL) != null){
                setWarning("The URL is already a shortened link.");
            } else {
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
                            setText(baseURL + "api/shorturl/" + data.short_url);
                            setDisplay("Copy");
                        } else {
                            setWarning("Please provide a valid URL");
                        }
                    })
            }            
        } else if (display === "Copy" || display === "Copied"){
            textInputRef.current.select();
            document.execCommand("copy");
            setDisplay("Copied");
            e.target.focus();
        } 
    }

    let handleChange = (e) =>{
        setText(e.target.value)
        if(e.target.value === ""){
            setDisplay("Shorten");
            setWarning("");
        }
    }

    function handleFocus() {
        if(display === "Copied"){
            setDisplay("Shorten");
            setWarning("");
        }
    }

    function handleKeyDown() {
        if(display === "Copied"){
            setDisplay("Shorten");
            setWarning("");
        }
        setWarning("");
    }


    //user enters the original url and clicks submit
    //text input will change to short url
    //submit input will change to copy
    //submit input will change to copied
    //if text input is cleared, reset
    return(
        <div className="wrapper">
            <form onSubmit={createShortUrl}>
                <label for="url">Please enter your URL</label><br></br>
                <input type="text" id="url" placeholder="https://www.example.com" onChange={handleChange} onFocus={handleFocus} onKeyDown={handleKeyDown} value={text} ref={textInputRef}></input>
                <input type="submit" value={display}></input>
            </form>
            <p>{warning}</p>
        </div>        
    );
}

export default FormDisplay;