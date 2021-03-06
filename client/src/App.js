import React, { useState } from "react";
import { Switch, Route } from 'react-router-dom';

import MobileNavbar from "./components/MobileNavbar";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Container from "./styles/Container";

import Channel from "./pages/Channel";
import History from "./pages/History";
import Home from "./pages/Home";
import Library from "./pages/Library";
import LikedVideos from "./pages/LikedVideos";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";
import Subscriptions from "./pages/Subscriptions";
import Trending from "./pages/Trending";
import WatchVideo from "./pages/WatchVideo";
import YourVideos from "./pages/YourVideos";
import { useLocationChange } from "./hooks/use-location-change";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const closeSideBar = () => setIsSideBarOpen(false);
  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  }

  useLocationChange(closeSideBar);

  return (
    <>
      <Navbar toggleSideBar={toggleSideBar} />
      <Sidebar isSideBarOpen={isSideBarOpen} />
      <MobileNavbar />
      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/watch/:videoId" component={WatchVideo} />
          <Route path="/channel/:channelId" component={Channel} />
          <Route path="/results/:searchQuery" component={SearchResults} />
          <Route path="/feed/trending" component={Trending} />
          <Route path="/feed/subscriptions" component={Subscriptions} />
          <Route path="/feed/library" component={Library} />
          <Route path="/feed/history" component={History} />
          <Route path="/feed/my_videos" component={YourVideos} />
          <Route path="/feed/liked_videos" component={LikedVideos} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Container>
    </>
  );
}

export default App;
