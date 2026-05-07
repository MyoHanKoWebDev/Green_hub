export const getImageUrl = (img,user) => {
  if (!img) {
    // Fallback if no image exists at all
    return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=84cc16&color=fff`;
  }

  // If it's a Google URL (starts with http or https)
  if (img.startsWith("http")) {
    return img; 
  }

  // If it's a local upload from your Laravel 'public/uploads/profiles' folder
  return `${import.meta.env.VITE_BACKEND_URL}/uploads/profiles/${img}`;
};