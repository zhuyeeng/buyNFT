// cookie.js

import Cookies from 'js-cookie';
import { fetchProfileImage } from '../../data/nftDataFetcher';

// // Function to set the profile information in a cookie as a delimited string
// export const setProfileInfoCookie = (address, imageUrl) => {
//   const profileInfo = `${address};${imageUrl}`;
//   Cookies.set('profileInfo', profileInfo, { expires: 365 });
// };

// // Function to get the profile information from the cookie and split it
// export const getProfileInfoCookie = async () => {
//   // First, retrieve the data from the cookie
//   const profileInfoCookie = Cookies.get('profileInfo');

//   if (profileInfoCookie) {
//     // Decode the URL-encoded data
//     const decodedData = decodeURIComponent(profileInfoCookie);

//     // Split the decoded data using a semicolon
//     const [address, imageUrl] = decodedData.split(';');

//     // Check NFT ownership using the fetchProfileNFTData function
//     const isNFTOwned = await checkOwner(address, imageUrl);

//     if (isNFTOwned) {
//       return { address, imageUrl }; // Return the values obtained from the cookie
//     } else {
//       // NFT is not owned, update the image URL to the default image
//       const defaultImageUrl = '/images/avatars/default.jpg';
//       Cookies.set('profileInfo', `${address};${defaultImageUrl}`, { expires: 365 });
//       return { address, imageUrl: defaultImageUrl };
//     }
//   } else {
//     // Return the default values when the cookie doesn't exist or is empty
//     return { address: '', imageUrl: '/images/avatars/default.jpg' };
//   }
// };

// // Function to get or set the profile information in a cookie
// export const getOrSetProfileInfoCookie = async (address, imageUrl) => {
//   let slotNumber = 0;
//   let profileInfoCookie;

//   // Try to find a slot with matching address
//   while (true) {
//     profileInfoCookie = Cookies.get(`profileInfo${slotNumber}`);
//     if (!profileInfoCookie) break; // Exit loop if slot doesn't exist
//     const decodedData = decodeURIComponent(profileInfoCookie);
//     const [storedAddress, storedImageUrl] = decodedData.split(';');
    
//     if (storedAddress === address) {
//       // Check NFT ownership using the fetched NFT data
//       const isOwned = await checkOwner(address, imageUrl);

//       if (isOwned) {
//         return { address: storedAddress, imageUrl: storedImageUrl }; // Return the values obtained from the cookie
//       } else {
//         // NFT is not owned, update the image URL to the default image
//         const defaultImageUrl = '/images/avatars/default.jpg';
//         Cookies.set(`profileInfo${slotNumber}`, `${address};${defaultImageUrl}`, { expires: 365 });
//         return { address: storedAddress, imageUrl: defaultImageUrl };
//       }
//     } else {
//       slotNumber++;
//     }
//   }

//   // If no matching slots found, create a new one
//   const defaultImageUrl = '/images/avatars/default.jpg';
//   Cookies.set(`profileInfo${slotNumber}`, `${address};${imageUrl || defaultImageUrl}`, { expires: 365 });
//   return { address, imageUrl: imageUrl || defaultImageUrl };
// };

// Function to get or set the profile information in a cookie
export const getOrSetProfileInfoCookie = async (address, imageUrl) => {
  // Try to find a slot with matching address
  let slotNumber = 0;
  let profileInfoCookie;

  while (true) {
    profileInfoCookie = Cookies.get(`profileInfo${slotNumber}`);
    
    if (!profileInfoCookie) {
      // If no matching slots found, create a new one
      const defaultImageUrl = '/images/avatars/default.jpg';
      Cookies.set(`profileInfo${slotNumber}`, `${address};${imageUrl || defaultImageUrl}`, { expires: 365 });
      return { address: address, imageUrl: imageUrl || defaultImageUrl };
    }
    
    const decodedData = decodeURIComponent(profileInfoCookie);
    const [storedAddress, storedImageUrl] = decodedData.split(';');
    
    if (storedAddress === address) {
      // Check NFT ownership using the fetched NFT data
      const isOwned = await checkOwner(address, imageUrl);

      if (isOwned) {
        return { address: storedAddress, imageUrl: storedImageUrl }; // Return the values obtained from the cookie
      } else {
        // NFT is not owned, update the image URL to the default image
        const defaultImageUrl = '/images/avatars/default.jpg';
        Cookies.set(`profileInfo${slotNumber}`, `${address};${defaultImageUrl}`, { expires: 365 });
        return { address: storedAddress, imageUrl: defaultImageUrl };
      }
    } else {
      slotNumber++;
    }
  }
};

// Function to check NFT ownership
async function checkOwner(address, imageUrl) {
  // Implement the logic to check NFT ownership using the fetched NFT data
  const nftData = await fetchProfileImage();

  // Iterate through the NFT data and check if any NFT matches the provided address and imageUrl
  const isOwned = nftData.some((nft) => {
    // Compare address and imageUrl with nft.ownerName and nft.image respectively
    return nft.ownerName.toLowerCase() === address && nft.image === imageUrl;
  });

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
