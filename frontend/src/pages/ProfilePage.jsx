import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User,Pencil,Loader } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, updateProfileName , isUpdatingProfileName } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isNameChanging , setNameChanging] = useState(false)
  const updatedName = useRef("")

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
  }; 
};

   const handleUpdateButton = async (e) => {
  const name = updatedName.current?.value?.trim();

  if (!name) {
    console.log("Name is empty or invalid");
    return;
  }

  await updateProfileName({ profileName: name });
  updatedName.current.value = "";
  setNameChanging(false);
};
 

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
            
            {
              (!isNameChanging)?
              <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex justify-between h-11">
               <p>{authUser?.fullName}</p>
               <Pencil className="size-4" onClick={()=> setNameChanging(!isNameChanging)}/>
              </div>
              :
                 
                  (!isUpdatingProfileName)?
              <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex justify-between h-11">
               <input ref={updatedName} type="text" placeholder="Enter new name" id="nameField"  className="border-none outline-none bg-transparent shadow-none w-full"/>
               <button className="font-bold" onClick={handleUpdateButton}>update</button> 
              </div> :

                   <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex justify-center h-11">
                     <Loader/>
                   </div>
                
           }
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2 h-11">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
