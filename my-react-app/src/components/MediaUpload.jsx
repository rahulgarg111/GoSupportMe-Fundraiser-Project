import { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useToast } from '../context/ToastContext';

const MAX_MB = 10;

const MediaUpload = ({ onMediaUpload, onRemove, existingMedia = [] }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState([]);
  const inputRef = useRef(null);
  const toast = useToast();

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.size > MAX_MB * 1024 * 1024) { toast.error(`${file.name} is larger than ${MAX_MB} MB.`); return; }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) { toast.error(`${file.name} isn't an image or video.`); return; }
      upload(file);
    });
  };

  const upload = (file) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const task = uploadBytesResumable(ref(storage, `media/${id}_${file.name}`), file);
    const entry = { id, name: file.name, progress: 0, error: null, type: file.type.startsWith('image/') ? 'image' : 'video' };
    setUploads((prev) => [...prev, entry]);

    task.on(
      'state_changed',
      (snap) => setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, progress: (snap.bytesTransferred / snap.totalBytes) * 100 } : u))),
      (error) => setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, error: error.message } : u))),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setUploads((prev) => prev.filter((u) => u.id !== id));
        onMediaUpload({ id, name: file.name, type: entry.type, url });
      }
    );
  };

  const drag = (e, active) => { e.preventDefault(); e.stopPropagation(); setDragActive(active); };

  return (
    <div>
      <div
        className={`dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={(e) => drag(e, true)}
        onDragOver={(e) => drag(e, true)}
        onDragLeave={(e) => drag(e, false)}
        onDrop={(e) => { drag(e, false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <div className="dropzone-icon">📷</div>
        <strong>Drag & drop photos or videos</strong>
        <span className="muted small">or click to browse · up to {MAX_MB} MB each</span>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" hidden onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {uploads.map((u) => (
        <div key={u.id} className="upload-row">
          <span>{u.name}</span>
          <div className="progress progress-sm"><span style={{ width: `${u.progress}%`, background: u.error ? 'var(--danger)' : undefined }} /></div>
          {u.error ? <small className="error-text">{u.error}</small> : <small className="muted">{Math.round(u.progress)}%</small>}
        </div>
      ))}

      {existingMedia.length > 0 && (
        <div className="media-grid">
          {existingMedia.map((m, i) => (
            <div key={m.id || i} className="media-tile">
              {m.type === 'image' ? <img src={m.url} alt={m.name} /> : <video src={m.url} />}
              {i === 0 && <span className="cover-tag">Cover</span>}
              {onRemove && <button type="button" className="media-remove" onClick={() => onRemove(i)} aria-label="Remove">✕</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
