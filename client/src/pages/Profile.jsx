import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUserCircle } from 'react-icons/fa';
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-md mx-auto bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-lg border border-purple-200 p-6">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Profile Settings
        </h2>

        {/**profile upload and display image */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center rounded-full overflow-hidden shadow-lg">
            {user.avatar ? (
              <img
                alt={user.name}
                src={user.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaRegUserCircle size={70} className="text-white" />
            )}
          </div>
          <button
            onClick={() => setProfileAvatarEdit(true)}
            className="text-sm min-w-20 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-full mt-4 transition-all shadow-lg"
          >
            Edit Photo
          </button>
        </div>

        {openProfileAvatarEdit && (
          <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
        )}

        {/**name, mobile , email, change password */}
        <form className="my-6 grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-gray-700 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 outline-none border border-purple-200 focus-within:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl transition-all"
              value={userData.name}
              name="name"
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 outline-none border border-purple-200 focus-within:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl transition-all"
              value={userData.email}
              name="email"
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="mobile" className="text-gray-700 font-medium">
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              placeholder="Enter your mobile"
              className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 outline-none border border-purple-200 focus-within:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl transition-all"
              value={userData.mobile}
              name="mobile"
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 font-semibold rounded-xl shadow-lg transition-all">
            {loading ? 'Loading...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
