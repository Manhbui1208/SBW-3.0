// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract NewsDemo {

    event AddTweet(address recipient, uint tweetId);
    event DeleteTweet(uint tweetId, bool isDeleted);

    struct Tweet {
        uint id;
        address username;
        string tweetText;
        bool isDeleted;
    }

    Tweet[] private tweets;

    // Mapping of Tweet id to the wallet address of the user
    mapping(uint256 => address) tweetToOwner;

    // Method to be called by our frontend when trying to add a new Tweet
    function addTweet(string memory tweetText, bool isDeleted) external {
        uint tweetId = tweets.length;
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted));
        tweetToOwner[tweetId] = msg.sender;
        emit AddTweet(msg.sender, tweetId);
    }

    // Method to view tweet based on Id
    function getTweet(uint tweetId) public view returns (uint, address, string memory, bool) {
        require(tweetId < tweets.length, "Tweet does not exist.");
        Tweet memory tweet = tweets[tweetId];
        return (tweet.id, tweet.username, tweet.tweetText, tweet.isDeleted);
    }

    // Method to Delete a Tweet
    function deleteTweet(uint tweetId, bool isDeleted) external {
        if(tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId, isDeleted);
        }
    }

}