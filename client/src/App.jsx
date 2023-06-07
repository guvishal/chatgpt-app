import { useEffect, useState } from 'react';
import axios from 'axios';

import send from './assets/send.svg';
import bot from './assets/bot.png';
import user from './assets/user.png';
import loaderIcon from './assets/loader.svg';

function App() {

  const [input, setInput] = useState();
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    document.querySelector(".layout").scrollTop = document.querySelector(".layout").scrollHeight;
  },[posts]);

  const fetchBotResp = async () =>{

    const data = await axios.post( 
      "https://chatgpt-app-gsa3.onrender.com", 
      { input }, 
      {
        headers: {
          "Content-Type":"application/json"
        }
      }
      
      );

      return data;

  };

  const onSubmit = () =>{
    if(input.trim() == '') return;
    updatePosts(input);
    updatePosts("loading...", false, true);
    fetchBotResp().then((resp) => {
      updatePosts(resp.bot.trim(), true);
    });
  };

  const autoTypingBot = (text) => {

    let index = 0;
    let interval = setInterval(() =>{

      if(index < text.length){
        setPosts((prevState) => {
          let LastItem = prevState.pop();
          if(LastItem.type !== "bot"){
            prevState.push({
              type: "bot",
              post: text.charAt(index-1)
            });
          }else{
            prevState.push({
              type: "bot",
              post: LastItem.post + text.charAt(index-1)
            });
          }
          return [...prevState];
        });
      }else{
        clearInterval(interval);
      }

    });
  };

  const updatePosts = (post, isBot, isLoading) => {

    if(isBot){

      autoTypingBot(post);
    }else{

      setPosts(prevState => {
        return [ ...prevState, { type: isLoading ? "loading": "user", post } ]
      });

    }

  };

  const onKeyUp = (e) => {

    if(e.key == "Enter" || e.which === 13){
      onSubmit();
    }

  };

  return (
    <main className='chatGPT-app'>
      <section className='chat-container'>
        
        <div className='layout'>
        {posts.map((post,index)=> (
            <div key = {index}
            className={`chat-bubble ${post.type === 'bot' || post.type === 'loading' ? "bot" : "" }`}>
              <div className='avatar'>
                <img src={post.type === 'bot' || post.type === 'loading' ? bot : user } />
              </div>

              {post.type === "loading" ? (
                <div className='loader'>
                <img src={loaderIcon} />
                </div>
              ) :
              (
                <div className='post'>{post.post}</div>
              )}
            </div>
        )) }

        </div>
      </section>
      <footer>
        <input 
          value={input}
          type="text"
          className="composebar"
          autoFocus
          placeholder='Ask Anything!'
          onChange={(e)=>{ setInput(e.target.value) }}
          onKeyUp={onKeyUp}
        />
        <div className='send-button' onClick={onSubmit}>
          <img src={send} />
        </div>
      </footer>

    </main>
  )
}

export default App
