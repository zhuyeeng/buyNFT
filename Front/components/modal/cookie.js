// cookie.js

import Cookies from 'js-cookie';
import { fetchProfileNFTData } from '../../data/nftDataFetcher';

// Function to set the profile information in a cookie as a delimited string
export const setProfileInfoCookie = (address, imageUrl) => {
  const profileInfo = `${address};${imageUrl}`;
  Cookies.set('profileInfo', profileInfo, { expires: 365 });
};

// Function to get the profile information from the cookie and split it
export const getProfileInfoCookie = async () => {
  // First, retrieve the data from the cookie
  const profileInfoCookie = Cookies.get('profileInfo');

  if (profileInfoCookie) {
    // Decode the URL-encoded data
    const decodedData = decodeURIComponent(profileInfoCookie);

    // Split the decoded data using a semicolon
    const [address, imageUrl] = decodedData.split(';');

    // Check NFT ownership using the fetchProfileNFTData function
    const isNFTOwned = await checkOwner(address);

    if (isNFTOwned) {
      return { address, imageUrl }; // Return the values obtained from the cookie
    } else {
      // NFT is not owned, update the image URL to the default image
      const defaultImageUrl = '/images/avatars/default.jpg';
      Cookies.set('profileInfo', `${address};${defaultImageUrl}`, { expires: 365 });
      return { address, imageUrl: defaultImageUrl };
    }
  } else {
    // Return the default values when the cookie doesn't exist or is empty
    return { address: '', imageUrl: '/images/avatars/default.jpg' };
  }
};

// Function to check NFT ownership
async function checkOwner(address) {
  // Implement the logic to check NFT ownership using the fetched NFT data
  const nftData = await fetchProfileNFTData();

  // Iterate through the NFT data and check if any NFT is owned by the provided address
  const isOwned = nftData.some((nft) => nft.ownerName.toLowerCase() === address);

  return isOwned;
}

export const getProfileImageCookie = () => {
  const profileImage = Cookies.get('profileInfo');
  if (profileImage) {
    const [, imageUrl] = profileImage.split(';');
    return imageUrl;
  }
  return '/images/avatars/default.jpg';
};
