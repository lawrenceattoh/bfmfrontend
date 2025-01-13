import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeRequest } from "../../../api/apiClient";
import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import { auth } from "../../../firebase/config";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "phosphor-react"; // Importing icons from Phosphor
import { FaLock, FaUnlock } from "react-icons/fa";
import { FloppyDiskBack, X, TrashSimple } from "phosphor-react"; // Import Phosphor icons

import {
  FaSpotify,
  FaApple,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const WaveformPlayer = ({ track, isPlaying, onPlayPause }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    // Initialize WaveSurfer instance
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#f50",
      responsive: true,
      height: 80,
      barWidth: 2,
    });

    // Load the audio file
    wavesurferRef.current.load(track.audioUrl);

    // Stop audio when the song ends
    wavesurferRef.current.on("finish", () => {
      onPlayPause(null);
    });

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [track.audioUrl]);

  useEffect(() => {
    if (isPlaying) {
      wavesurferRef.current?.play();
    } else {
      wavesurferRef.current?.pause();
    }
  }, [isPlaying]);

  return <div ref={waveformRef} />;
};

const Track = ({ track, isPlaying, onPlayPause }) => (
  <div className="flex items-start bg-gray-800 p-4 rounded-lg shadow-md">
    <img
      src={track.cover}
      alt={track.title}
      className="w-24 h-24 rounded-md object-cover mr-4"
    />
    <div className="flex-1">
      <div className="flex items-center mb-2">
        <button
          onClick={() => onPlayPause(track.id)}
          className="mr-4 bg-transparent text-white"
        >
          {isPlaying ? (
            <Pause size={32} weight="fill" color="#f50" />
          ) : (
            <Play size={32} weight="fill" color="#f50" />
          )}
        </button>
        <div>
          <h3 className="text-lg font-semibold text-white">{track.artist}</h3>
          <p className="text-gray-400">{track.title}</p>
        </div>
      </div>
      <WaveformPlayer
        track={track}
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
      />
    </div>
  </div>
);

const ArtistDetailPage = () => {
  const { artistId } = useParams(); // Retrieve artist ID from URL params
  const navigate = useNavigate();

  let cachedToken = null;
  let lastTokenFetchTime = 0;
  const now = Date.now();

  const user = auth.currentUser;
  if (user) {
    cachedToken = user.getIdToken();
    lastTokenFetchTime = now;

    console.log("ArtistDetailPage Cached", cachedToken);
  } else {
    cachedToken = null;
  }

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For dropdown menu
  const [currentTrackId, setCurrentTrackId] = useState(null);

  const [isLocked, setIsLocked] = useState(true);
  const [originalArtist, setOriginalArtist] = useState(null); // Add this line

  useEffect(() => {
    const fetchArtistDetails = async () => {
      const { data, error } = await makeRequest("GET", `/artists/${artistId}`);
      if (!error) {
        setArtist(data);
        setOriginalArtist(data); // Set the original state when data is fetched
      }
      setLoading(false);
    };
    fetchArtistDetails();
  }, [artistId]);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handlePlayPause = (trackId) => {
    setCurrentTrackId((prevTrackId) =>
      prevTrackId === trackId ? null : trackId
    );
  };

  const toggleLock = () => {
    setIsLocked((prev) => !prev);
  };

  const handleFieldChange = (field, value) => {
    setArtist((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const { data } = await makeRequest(
        "PATCH",
        `/artists/${artistId}`,
        {}, // You can provide extra params here if needed
        { name: artist.name } // Update the name field
      );

      console.log("RESPONSE FROM API:", data); // Log the response to confirm it's successful

      setOriginalArtist(data); // Update the original artist state
      setIsLocked(true); // Lock the fields
      console.log("Changes saved successfully!"); // Log success message
      toast.success("Artist Updated successfully!");
    } catch (error) {
      console.error("Failed to save changes.", error); // Log the error properly
      toast.error("Failed to save changes."); // Log the error
    }
  };

  const cancelChanges = () => {
    setArtist(originalArtist); // Revert changes
    setIsLocked(true);
  };

  const handleEdit = () => {
    navigate(`/artists/edit/${artistId}`);
    setIsMenuOpen(false); // Close menu
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this artist?"
    );
    if (confirmed) {
      try {
        const { error } = await makeRequest("DELETE", `/artists/${artistId}`);
        if (!error) {
          toast.success("Artist deleted successfully!"); // Trigger toast
          setTimeout(() => {
            navigate("/artists"); // Delay navigation to ensure toast renders
          }, 2000); // Delay for 2 seconds
        } else {
          throw new Error();
        }
      } catch {
        toast.error("Failed to delete the artist."); // Show error toast
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

  if (!artist) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">
        <p className="text-red-500">Artist not found</p>
      </div>
    );
  }

  // const socialLinks = [
  //   { platform: "Spotify", url: artist.spotify_id, icon: <FaSpotify /> },
  //   { platform: "Apple Music", url: artist.apple_music_id, icon: <FaApple /> },
  //   { platform: "YouTube", url: artist.youtube_id, icon: <FaYoutube /> },
  //   { platform: "Facebook", url: artist.facebook_id, icon: <FaFacebook /> },
  //   { platform: "Instagram", url: artist.instagram_id, icon: <FaInstagram /> },
  //   { platform: "Twitter", url: artist.twitter_id, icon: <FaTwitter /> },
  // ].filter((link) => link.url); // Filter out null or undefined links

  const socialLinks = [
    {
      platform: "Spotify",
      url: "https://open.spotify.com/artist/5he5w2lnU9x7JFhnwcekXX",
      icon: <FaSpotify />,
    },
    {
      platform: "Apple Music",
      url: "https://music.apple.com/us/artist/skrillex/356545647",
      icon: <FaApple />,
    },
    {
      platform: "YouTube",
      url: "https://www.youtube.com/channel/UC_TVqp_SyG6j5hG-xVRy95A",
      icon: <FaYoutube />,
    },
    {
      platform: "Facebook",
      url: "https://www.facebook.com/skrillex/?locale=en_GB",
      icon: <FaFacebook />,
    },
    {
      platform: "Instagram",
      url: "https://www.instagram.com/skrillex/?hl=en",
      icon: <FaInstagram />,
    },
    {
      platform: "Twitter",
      url: "https://x.com/skrillex?lang=en",
      icon: <FaTwitter />,
    },
  ]; // Filter out null or undefined links

  const tracks = [
    {
      id: 1,
      title: "Purple Lamborghini",
      artist: "Skrillex & Rick Ross",
      cover: "https://i.scdn.co/image/ab67616d0000b273602b6507f5289db71603c2f4", // Replace with the actual path to your local image file
      audioUrl: "/src/assets/tracks/purple-lamborghini.mp3", // Replace with the actual path to your local audio file
    },
    {
      id: 2,
      title: "Pepper",
      artist: "Flowdan, Lil Baby & Skrillex",
      cover:
        "https://sportplaylists.com/wp-content/uploads/2023/10/PEPPER_4000x4000_edit-scaled.jpg", // Replace with the actual path to your local image file
      audioUrl: "/src/assets/tracks/pepper.mp3", // Replace with the actual path to your local audio file
    },
    {
      id: 3,
      title: "Kyoto (feat. Sirah)",
      artist: "Skrillex",
      cover:
        "https://i1.sndcdn.com/artworks-k3YtDFo9yZiZIVt1-iLBMzg-t500x500.jpg", // Replace with the actual path to your local image file
      audioUrl: "/src/assets/tracks/kyoto.mp3", // Replace with the actual path to your local audio file
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white py-8 px-20 ml-6 w-full">
      {/* Header Section */}
      <div className="relative flex items-start gap-6">
        {/* Image Section */}
        <div className="mt-3">
          <img
            // src={artist.image_url}
            src={
              "https://www.rollingstone.com/wp-content/uploads/2023/01/Untitled.jpg?w=1581&h=1054&crop=1"
            }
            alt={artist.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 mt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">
              <input
                type="text"
                value={artist.name}
                disabled={isLocked}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className={`w-full ${
                  isLocked ? "bg-[#121212]" : "bg-gray-800"
                } text-white rounded-lg p-2 focus:outline-none`}
              />
            </h1>
            <button
              onClick={toggleLock}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
              title={isLocked ? "Unlock Fields" : "Lock Fields"}
            >
              {isLocked ? <FaLock size={20} /> : <FaUnlock size={20} />}
            </button>
          </div>{" "}
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
          {/* <p className="mt-4 text-gray-300 leading-relaxed">{artist.bio}</p> */}
          <p className="mt-4 text-gray-300 leading-relaxed">
            Sonny Moore aka Skrillex is a record producer, DJ, musician, singer
            & songwriter from Los Angeles who has won 8 Grammy Awards, been
            named MTV’s Electronic Dance Music Artist of the Year & holds the
            record for most Grammys won by an electronic artist.
          </p>
          {/* Save/Cancel Buttons */}
          <div className="flex gap-3 mt-3 self-end content-end justify-end">
            {!isLocked && (
              <>
                <button
                  onClick={cancelChanges}
                  title="Cancel"
                  className="p-2 bg-red-600 rounded-full hover:bg-red-500"
                >
                  <X size={20} color="#fff" />
                </button>
                <button
                  onClick={saveChanges}
                  title="Save Changes"
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-500"
                >
                  <FloppyDiskBack size={20} color="#fff" />
                </button>
                <button
                  onClick={handleDelete}
                  title="Delete Artist"
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                >
                  <TrashSimple size={20} color="#fff" />
                </button>
              </>
            )}
          </div>
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
          {activeTab === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Tracks</h2>
              <div className="space-y-4">
                {tracks.map((track) => (
                  <Track
                    key={track.id}
                    track={track}
                    isPlaying={currentTrackId === track.id}
                    onPlayPause={handlePlayPause}
                  />
                ))}
              </div>
            </div>
          )}
          {activeTab === 3 && <p>Assets content goes here...</p>}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ArtistDetailPage;
