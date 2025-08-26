import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import {toast} from 'react-hot-toast'
import { useChatStore } from '../store/useChatStore';
import {Send,Image,X} from 'lucide-react'

function MessageInput() {
  const [text,setText] = useState("");
  const [imagePreview,setImagePreview] = useState(null); //to show it to the user before sending
  const {sendMessage} = useChatStore()
  const imgInputRef = useRef();

  const handleImageChange = (e)=>{
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")){
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend=()=>{
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(file); //if you put this before onload,the reading might complete earliar before onloadend is attached for small files,
    // so it might happen that setimagepreview is not run
  }

  const removeImage = (e)=>{//to remove the image before sending, if user wants and clicks on cross on the right side of img preview}
    setImagePreview(null);
    if(imgInputRef.current) imgInputRef.current.value = "";
  }

  const handleSendMessage = async (e)=>{
    e.preventDefault();
    if(!text.trim() && !imagePreview){
      return toast.error("Please enter something to send")
    }
    try {
      await sendMessage({ //directly hits the endpoint with  data in {}
        text : text.trim(),
        image : imagePreview
      })

      //clear form
      setText("");
      setImagePreview("");
      if(imgInputRef.current){imgInputRef.current.value = "";}
    } catch (error) {
      console.error("Failed to send message",error)
    }
  }
  return (
    <div className="p-4 w-full">

      {imagePreview && ( //only when user had selected any image..we will show it as imagepreview
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

       <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden" //hidden because to prevent default input ui
            ref={imgInputRef} //will store the current input button
            onChange={handleImageChange}
          />

          <button //customized button to select any image
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => imgInputRef.current?.click()} //clicks the default input button of image
            //this onclick button safely checks if reference is attached or not..for eg.at initail render..it will throw error coz ref is not attached..example..when user removes the image from preview
          > 
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

    </div>
  )
}

export default MessageInput;