import React, { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const MediaUpload = ({ onMediaUpload, existingMedia = [] }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Only images and videos are allowed');
        return;
      }
      
      uploadFile(file);
    });
  };

  const uploadFile = (file) => {
    const fileId = Date.now() + Math.random();
    const storageRef = ref(storage, `media/${fileId}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const newUpload = {
      id: fileId,
      name: file.name,
      progress: 0,
      error: null,
      url: null,
      type: file.type.startsWith('image/') ? 'image' : 'video'
    };

    setUploads(prev => [...prev, newUpload]);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploads(prev => prev.map(upload => 
          upload.id === fileId ? { ...upload, progress } : upload
        ));
      },
      (error) => {
        setUploads(prev => prev.map(upload => 
          upload.id === fileId ? { ...upload, error: error.message } : upload
        ));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const completedUpload = { ...newUpload, url: downloadURL, progress: 100 };
          setUploads(prev => prev.map(upload => 
            upload.id === fileId ? completedUpload : upload
          ));
          onMediaUpload(completedUpload);
        });
      }
    );
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          border: dragActive ? '2px dashed #007bff' : '2px dashed #ccc',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: dragActive ? '#f8f9fa' : '#fff',
          cursor: 'pointer'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p>Drag & drop images/videos here or click to browse</p>
        <p style={{ fontSize: '12px', color: '#666' }}>Max file size: 10MB</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {uploads.map(upload => (
        <div key={upload.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{upload.name}</span>
            <span>{Math.round(upload.progress)}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px', marginTop: '5px' }}>
            <div style={{ width: `${upload.progress}%`, height: '100%', backgroundColor: upload.error ? '#dc3545' : '#28a745', borderRadius: '2px' }}></div>
          </div>
          {upload.error && <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>{upload.error}</p>}
        </div>
      ))}

      {existingMedia.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Uploaded Media:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {existingMedia.map((media, index) => (
              <div key={index} style={{ width: '100px', height: '100px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                {media.type === 'image' ? (
                  <img src={media.url} alt={media.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
