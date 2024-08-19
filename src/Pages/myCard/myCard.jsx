import axios from "axios";
import { MDBIcon } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import "./myCard.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import toast, { Toaster } from 'react-hot-toast';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const MyCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [content, setContent] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [links, setLinks] = useState({
    telegram: "",
    facebook: "",
  });

  const [user, setUser] = useState({});
  const [foundUser, setFoundUser] = useState({});

  const getUsers = async () => {
    try {
      const res = await axios.get('https://ntbackend.uz/api/users/all', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Access")}`,
        },
      });
      setData(res.data);
      findUserInData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while fetching users.');
    }
  };

  const findUserInData = (dataToSearch) => {
    const checkingValue = localStorage.getItem("Checking");
    if (checkingValue) {
      const foundUser = dataToSearch.find(data => data.email === checkingValue);
      setUser(foundUser || {});
      setFoundUser(foundUser || {});
    }
  };

  const handleClose = () => setOpen(false);

  const getCards = async () => {
    try {
      const res = await axios.get(`https://ntbackend.uz/api/cards/card/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("Access")}`,
        },
      });
      setData(res.data);
      if (res.data.data) {
        setName(res.data.data.name || "");
        setTitle(res.data.data.title || "");
        setBusinessName(res.data.data.businessName || "");
        setContent(res.data.data.content || "");
        setPhoneNumber(res.data.data.phoneNumber || "");
        setEmail(res.data.data.email || "");
        setLinks({
          telegram: res.data.data.links?.telegram || "",
          facebook: res.data.data.links?.facebook || "",
        });
      }
    } catch (err) {
      toast.error('Error fetching card data');
    }
  };

  const deleteCard = async (id) => {
    try {
      await axios.delete(`https://ntbackend.uz/api/cards/delete/${id}/card`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("Access")}`,
        },
      });
      toast.success('Card deleted successfully');
      navigate('/allcards');
    } catch (error) {
      toast.error('Error deleting card');
    }
  };

  const handleOpen = () => setOpen(true);

  const updateCard = async (e) => {
    e.preventDefault();

    const updatedLinks = {
      telegram: links.telegram,
      facebook: links.facebook,
    };

    try {
      await axios.put(`https://ntbackend.uz/api/cards/update/${data.data._id}/my-card`, {
        name,
        title,
        businessName,
        content,
        phoneNumber,
        email,
        links: JSON.stringify(updatedLinks),
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Access")}`,
        },
      });
      toast.success("Card updated successfully");
      handleClose();
      getCards();
    } catch (err) {
      toast.error('Error updating card');
    }
  };

  useEffect(() => {
    getCards();
    getUsers();
  }, [id]);

  return (
    <div className="sectionmcr">
      <div className="container">
        <h1>Card</h1>
        <b><Link to='/profile'>Profile</Link></b> || <b><Link to='/allcards'>All Cards</Link></b> || <b><Link to='/createcard'>Create Card</Link></b> || <b onClick={() => {
          localStorage.removeItem("Access");
          navigate('/');
        }}>Log out</b>
        <br />
        <br />
        {data ? (
          <div className="card card2">
            <div className="cardsec" key={data.data?.user}>
              <img className="pfp" src={`https://ntbackend.uz/static/${data.data?.image}`} alt="Profile" />
              <div className="cardinfo">
                <h1>{data.data?.name} {data.data?.title}</h1>
                <h3>{data.data?.businessName}</h3>
                <b>{data.data?.content}</b>
                <br />
                <a href={data.data?.links?.telegram} target="_blank" rel="noopener noreferrer"><b>{data.data?.links?.telegram}</b></a>
                <br />
                <b><MDBIcon fas icon="message me-1" className="icons" /> {data.data?.email}</b>
                <br />
                <img src={data.data?.qrcode} alt="QR Code" />
                <br />
                <b>{data.data?.phoneNumber}</b>
                <br />
                <br />
                {data.data?.user === foundUser._id ? (
                  <>
                    <button className="btn btn2" onClick={() => deleteCard(data.data._id)}>Delete My Card</button>
                    <Toaster />
                    <button className="btn btn2" onClick={handleOpen}>Edit My Card</button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button className="btndelete del" onClick={handleClose}>X</button>
          <h2 className="del">Edit</h2>
          <form className="AddTeacherForm" onSubmit={updateCard}>
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Business Name"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Telegram"
              required
              value={links.telegram}
              onChange={(e) => setLinks({ ...links, telegram: e.target.value })}
            />
            <input
              type="text"
              placeholder="Facebook"
              value={links.facebook}
              onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
            />
            <button type="submit">Update</button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default MyCard;
