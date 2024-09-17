import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("https://jobseeking-application-1.onrender.com/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("https://jobseeking-application-1.onrender.com/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`https://jobseeking-application-1.onrender.com/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const convertToCSV = (data) => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Address",
      "CoverLetter",
      "Job Title",
    ];

    const rows = data.map((application) => [
      application.name,
      application.email,
      application.phone,
      application.address,
      application.coverLetter,
      application.jobId.title,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(applications);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "applications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="my_applications page">
      <div className="container">
        {user && user.role === "Job Seeker" ? (
          <>
            <h1>My Applications</h1>
            {applications.length > 0 && (
              <button
                onClick={downloadCSV}
                // style={{ float: "right", marginBottom: "10px" ,width:"200px" , height:"50px",borderRadius:"8px",}}
                className="download-csv-btn"
              >
                <span style={{ color: "green", fontSize: "20px", cursor: "pointer" }}>Download CSV</span>
              </button>
            )}
            {applications.length <= 0 ? (
              <h4>No Applications Found</h4>
            ) : (
              applications.map((element) => {
                return (
                  <JobSeekerCard
                    element={element}
                    key={element._id}
                    deleteApplication={deleteApplication}
                    openModal={openModal}
                  />
                );
              })
            )}
          </>
        ) : (
          <>
            <h1>Applications From Students</h1>
            {applications.length > 0 && (
              <button
                onClick={downloadCSV}
                // style={{ float: "right", marginBottom: "10px", width: "200px", height: "50px", borderRadius: "8px" }}
                className="download-csv-btn"
              >
                <span style={{ color: "green", fontSize: "20px", cursor: "pointer" }}>Download CSV</span>
              </button>
            )}
            {applications.length <= 0 ? (
              <h4>No Applications Found</h4>
            ) : (
              applications.map((element) => {
                return (
                  <EmployerCard
                    element={element}
                    key={element._id}
                    openModal={openModal}
                  />
                );
              })
            )}
          </>
        )}
      </div>
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
          <p>
            <span>Job:</span> {element.jobId.title}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
          <p>
            <span>Job:</span> {element.jobId.title}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
      </div>
    </>
  );
};
