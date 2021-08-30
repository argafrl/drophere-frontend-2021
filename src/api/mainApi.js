import axios from "axios";

export default axios.create({
  baseURL: "http://bcc-drophere-devel.ap-southeast-1.elasticbeanstalk.com/",
});
