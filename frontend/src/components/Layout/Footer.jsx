import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaLinkedin,FaTwitter ,FaGithub} from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By CareerQuest Team.</div>
      <div>
        <Link to={"https://twitter.com/AtulKum78802355"} target="_blank">
          <FaTwitter />
        </Link>
        <Link to={"https://github.com/1atul0"} target="_blank">
          <FaGithub />
        </Link>
        <Link to={"https://www.linkedin.com/in/atul-kumar-cse/"} target="_blank">
          <FaLinkedin />
        </Link>
        <Link to={"https://www.instagram.com/atulkumar7890/"} target="_blank">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
