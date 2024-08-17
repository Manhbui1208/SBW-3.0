import React, {useContext, useEffect} from "react";
import Post from "./Post";
import { Web3Context } from './Web3Context';
import "./Feed.css";

function Feed() {
    const {tweets} = useContext(Web3Context);

    useEffect(() => {
        if (Array.isArray(tweets) && tweets.length > 0) {
            console.log('Updated tweets:', tweets)
        }
    }, [tweets])

    if (!tweets) {
        return <div>Loading...</div>
    }




    return (
      <div className='feed'>
          {/*Header */}
    

  
          {Post}
          {tweets.map((tweet) => (
            <Post key={tweet.id} tweet={tweet} />
          ))}
      </div>

    )
  }

  export default Feed;
