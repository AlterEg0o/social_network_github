import { SendEvent } from '../../api/websockets';
import '../submitPost/submitPost.css'
import { useEffect, useRef , useState} from 'react'

export default function SubmitPost({groupId}){
    let title = useRef();
    let content = useRef();
    let privacy = useRef();

    const [selectedFile, setSelectedFile] = useState(null);
    const [dragging, setDragging] = useState(false);
  
    // handle image upload
    const handleDragEnter = (event) => {
      event.preventDefault();
      setDragging(true);
    };
  
    const handleDragOver = (event) => {
      event.preventDefault();
      setDragging(true);
    };
  
    const handleDragLeave = (event) => {
      event.preventDefault();
      setDragging(false);
    };
  
    const handleDrop = (event) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      // Perform further processing with the selected file
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
    };

    // handle post
    function SavePost(){
        let post = {
            groupId : groupId ? groupId : 0,
            title : title.current.value,
            content : content.current.value,
            privacy : groupId ? "3" : privacy.current.value,
            image : selectedFile ? selectedFile.name : ''
        }
        SendEvent("SavePost",post)
    }

    return (
    <div className='submitPosts'>
        <input type="text" ref={title} placeholder='Title'/>
        <textarea ref={content} rows={8} placeholder='Let your creativity flow ...'></textarea>
        <div
            className={`drop-area ${dragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
        <input type="file" onChange={handleFileChange} />
        {selectedFile ? (
          <p>Selected file: {selectedFile.name}</p>
        ) : (
          <p>Drag and drop or click to select a file</p>
        )}
      </div>
        {/* <label htmlFor="upload-image" >Click here to add an image</label> */}
        {/* <input type="file" onChange={GetFile} name="upload-image" id="upload-image" accept='image/png image/jpeg image/gif'/> */}
        <div className='submit-and-privacy'>
            {!groupId && 
              <div className="select">
                <select ref={privacy}>
                  <option value="0">Public</option>
                  <option value="1">Followers only</option>
                  <option value="2">Private</option>
                </select>
              </div>
            }
            
            <input type="submit" value="submit" onClick={SavePost}/>
        </div>
    </div>)
}


