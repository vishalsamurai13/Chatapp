import { useDispatch, useSelector } from 'react-redux';
import './profile.css'
import moment from 'moment';
import { useEffect, useState } from 'react';
import { uploadProfilePic } from '../../apiCalls/users';
import { hideLoader, showLoader } from "../../redux/loaderSlice";
import { toast } from 'sonner';
import { setUser } from "../../redux/usersSlice";
import { useNavigate } from 'react-router-dom';

function Profile(){
    const {user} = useSelector(state => state.userReducer);
    const [image, setImage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(user?.profilePic){
            setImage(user.profilePic);
        }
    }, [user])

    function getFullname() {
        let fname =
          user?.firstname.at(0).toUpperCase() +
          user?.firstname.slice(1).toLowerCase();
        let lname =
          user?.lastname.at(0).toUpperCase() +
          user?.lastname.slice(1).toLowerCase();
        return fname + " " + lname;
    }

    const onFileSelect = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader(file);

        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            setImage(reader.result);
        }
    }

    const updateProfilePic = async () => {

        try {
            dispatch(showLoader())
            const response = await uploadProfilePic(image);
            dispatch(hideLoader())

            if(response.success){
                toast.success(response.message);
                dispatch(setUser(response.data));
            }else{
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message);
            dispatch(hideLoader())
        }
    }
    
   return (
    <div className="profile-page-container">
        <button 
          className='back-button'
          onClick={ () => navigate("/home") }
        >
            <i class="fa-solid fa-chevron-left back-icon"></i> back to chat
        </button>
        <div className="profile-card">
            <div className="profile-pic-container">
            {image && 
                <img
                src={image}
                alt="Profile Pic"
                className="user-profile-pic-upload"
                />}
            
                {!image && <img
                src="/images/profile.jpg"
                alt="Profile"
                className="profilePage-pic"
                />}
            
            </div>

            <div className="profile-info-container">

            {/* Name with underline */}
                <div className="user-profile-name">
                    <h1>{getFullname()}</h1>
                </div>

            {/* Email section */}
                <div className="user-info-item">
                    <b>Email</b>
                    <div className="info-box">{user?.email}</div>
                </div>

            {/* Account Created section */}
                <div className="user-info-item">
                    <b>Account Created</b>
                    <div className="info-box">{moment(user?.createdAt).format('MMM DD, YYYY')}</div>
                </div>

            {/* File input */}
                <div className="select-profile-pic-container">
                    <label htmlFor="profile-pic" className="file-label">
                    Choose a profile picture
                    </label>
                    <input type="file" id="profile-pic" className="file-input" onChange={ onFileSelect }/>
                </div>

                <button className='upload-profile-pic-btn' 
                    onClick={updateProfilePic}>
                        Save Changes
                </button>
            </div>
        </div>
    </div>

   )
}

export default Profile;