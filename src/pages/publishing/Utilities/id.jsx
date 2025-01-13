import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeRequest } from "../../../api/apiClient";
import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import {
  FaSpotify,
  FaApple,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const UtilitiesDetailPage = () => {
  const { UtilitiesId } = useParams(); // Retrieve Utilities ID from URL params
  const navigate = useNavigate();

  const [Utilities, setUtilities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For dropdown menu

  useEffect(() => {
    const fetchUtilitiesDetails = async () => {
      const { data, error } = await makeRequest("GET", `/Utilities/${UtilitiesId}`);
      if (!error) {
        setUtilities(data);
      }
      setLoading(false);
    };
    fetchUtilitiesDetails();
  }, [UtilitiesId]);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleEdit = () => {
    navigate(`/Utilitiess/edit/${UtilitiesId}`);
    setIsMenuOpen(false); // Close menu
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Utilities?"
    );
    if (confirmed) {
      const { error } = await makeRequest("DELETE", `/Utilitiess/${UtilitiesId}`);
      if (!error) {
        navigate("/Utilitiess"); // Redirect to the Utilities list page
      }
    }
    setIsMenuOpen(false); // Close menu
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!Utilities) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">
        <p className="text-red-500">Utilities not found</p>
      </div>
    );
  }

  const socialLinks = [
    { platform: "Spotify", url: Utilities.spotify_id, icon: <FaSpotify /> },
    { platform: "Apple Music", url: Utilities.apple_music_id, icon: <FaApple /> },
    { platform: "YouTube", url: Utilities.youtube_id, icon: <FaYoutube /> },
    { platform: "Facebook", url: Utilities.facebook_id, icon: <FaFacebook /> },
    { platform: "Instagram", url: Utilities.instagram_id, icon: <FaInstagram /> },
    { platform: "Twitter", url: Utilities.twitter_id, icon: <FaTwitter /> },
  ].filter((link) => link.url); // Filter out null or undefined links

  return (
    <div className="min-h-screen bg-[#121212] text-white py-8 px-20 ml-6 w-full">
    {/* Header Section */}
    <div className="relative flex items-start gap-6">
      {/* Image Section */}
      <div className="mt-3">
        <img
          src={Utilities.image_url}
          alt={Utilities.name}
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>
  
      {/* Content Section */}
      <div className="flex-1 mt-4">
        <h1 className="text-4xl font-bold">{Utilities.name}</h1>
        <div className="flex gap-4 mt-2">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 text-xl"
            >
              {link.icon}
            </a>
          ))}
        </div>
        <p className="mt-4 text-gray-300 leading-relaxed">{Utilities.bio}</p>
      </div>
  
      {/* Menu Section */}
      <div className="ml-auto relative">
        <button
          onClick={toggleMenu}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
        >
          <FaEllipsisV />
        </button>
        {isMenuOpen && (
          <div className="absolute top-full right-0 bg-gray-800 shadow-md rounded mt-2 z-50">
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 hover:bg-gray-700 text-white w-full text-left"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 hover:bg-gray-700 text-white w-full text-left"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  
    {/* Tabs Section */}
    <div className="mt-8">
      <div className="flex space-x-6 border-b border-gray-700">
        {["Releases", "Products", "Tracks", "Assets"].map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`pb-2 ${
              activeTab === index
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {activeTab === 0 && <p>Releases content goes here...</p>}
        {activeTab === 1 && <p>Products content goes here...</p>}
        {activeTab === 2 && <p>Tracks content goes here...</p>}
        {activeTab === 3 && <p>Assets content goes here...</p>}
      </div>
    </div>
  </div>
  
  );
};

export default UtilitiesDetailPage;
