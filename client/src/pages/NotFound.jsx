import React from "react";
import pageNotFoundImg from "../assets/transp-page-not-found.png";
import Wrapper from "../styles/NotFound";

function NotFound() {
  return (
    <Wrapper>
      <img src={pageNotFoundImg} alt="Error page illustration" />
      <br />
      <p>This page isn't available. Sorry about that.</p>
      <p>Try searching for something else.</p>
    </Wrapper>
  );
}

export default NotFound;
