import "./ChannelListPage.css";
import channelsService from "../../services/channels.service";
import authService from "../../services/auth.service";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Searchbar from "../../components/Searchbar/Searchbar";
import CustomList from "../../components/CustomList/CustomList";

function ChannelListPage() {
  // contains all the channels and streams in the DB
  const [channels, setChannels] = useState([]);
  const [streams, setStreams] = useState([]);
  const [isAdded, setIsAdded] = useState(false);

  //state for the list
  const [cartChannels, setCartChannels] = useState([]);

  //state for the search filter
  const [channelFilter, setChannelFilter] = useState([]);
  //state for the stream filter
  const [streamFilter, setStreamFilter] = useState([]);

  //function to get all channels
  const getAllChannels = async () => {
    try {
      //using services to get all channels from the backend
      const response = await channelsService.getAllChannels();
      /* const response = await axios.get("http://localhost:5005/channels"); */
      setChannels(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //Useeffect hook
  useEffect(() => {
    getAllChannels();
  }, []);

  //function to get all streams

  const getAllStreams = async () => {
    try {
      const response = await axios.get("http://localhost:5005/streams");
      setStreams(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllStreams();
  }, []);

  //function to add the channel to my list
  const addChannel = async (id) => {
    //variable to store the value with a find function to see if the id of the channel exists or not
    /*  const exist = cartChannels.find(channelItem => channelItem._id === channel._id); */
    //conditional - what will happen if we find the id
    /* if(exist){
      console.log( setCartChannels("added"));

    } */

    try {
      //Used service to get the value from the DB on the backend
      const addedItem = await channelsService.addChannel(id);

      setIsAdded(!isAdded);
    } catch (error) {
      console.log(error);
    }
  };

  /*  useEffect(() => {
    addChannel();
  }, []); */

  //SEARCH BAR FILTER

  const filterChannelList = (char) => {
    let filteredChannel;
    //check if the search is empty
    if (char === "") {
      filteredChannel = channelFilter; //if its empty show all the channels
    } else {
      filteredChannel = channels.filter((oneChannel) => {
        return oneChannel.channelName
          .toLowerCase()
          .includes(char.toLowerCase());
      });
    }
    setChannels(filteredChannel);
  };

  useEffect(() => {}, []);

  //SEARCH FILTER for Streams
  const filterStreamList = (char) => {
    let filteredStream;
    //check if the search is empty
    if (char === "") {
      filteredStream = streamFilter; //if its empty show all the channels
    } else {
      filteredStream = channels.filter((oneChannel) => {
        return oneChannel.channelName
          .toLowerCase()
          .includes(char.toLowerCase());
      });
    }
    setChannels(filteredStream);
  };

  //DISPLAYING ON THE SCREEN

  return (
    <div>
      <h1>Channel list</h1>
      <Searchbar
        filterChannelList={filterChannelList}
        filterStreamList={filterStreamList}
      />
      <CustomList
        cartChannels={cartChannels}
        addChannel={addChannel}
        isAdded={isAdded}
      />
      <h2 className="channel-list-title">Channel list</h2>
      <div className="channel-container">
        {channels.map((oneChannel) => {
          return (
            <div className="channelCard" key={oneChannel._id}>
              <div className="info-container">
                <Link
                  to={"/channels/" + oneChannel._id}
                  className="link-service"
                >
                  <img
                    src={oneChannel.channelImage}
                    alt={oneChannel.channelName}
                    className="channel-img"
                  />
                  <h4>{oneChannel.channelName}</h4>
                </Link>
              </div>
              <button
                onClick={() => addChannel(oneChannel._id)}
                key={oneChannel._id}
                className="add-btn"
              >
                Add to HybridBox
              </button>
            </div>
          );
        })}
      </div>
      {/* Streams render */}
      <h1 className="channel-list-title">Streaming Services list</h1>
      <div className="stream-container">
        {streams.map((oneStream) => {
          return (
            <div className="streamCard" key={oneStream._id}>
              <div className="info-container">
                <Link to={"/streams/" + oneStream._id} className="link-service">
                <img src={oneStream.streamImage} alt={oneStream.streamName} className="stream-img" />
                  <h4>{oneStream.streamName}</h4>
                </Link>
              </div>
              <button className="add-btn">Add to my HybridBox</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChannelListPage;
