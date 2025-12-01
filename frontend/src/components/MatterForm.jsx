import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TbSearch, TbChevronDown, TbClipboard, TbCloudUpload, TbFile, TbTrash } from 'react-icons/tb';
import styles from '../styles/MatterForm.module.css'

const API_BASE_URL = 'http://localhost:8000/api';

const types = ['Civil', 'Criminal', 'Family Law', 'Appeals', 'Probate', 'Small Claims'];
const states = ['New', 'In Progress', 'On Hold', 'Resolved', 'Closed'];

const FormInput = ({ label, value, onChange, required, readOnly = false, icon }) => {
  const inputName = label.toLowerCase().replace(/\s/g, '');
  return (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>
        {label}
        {required && <span className={styles.inputRequired}>*</span>}
      </label>
      <div className={`${styles.inputWrapper} ${readOnly ? styles.readOnly : ''}`}>
        <input
          type="text"
          name={inputName}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`${styles.inputField} ${icon ? styles.iconPresent : ''}`}
        />
        {icon && (
          <div className={styles.inputIcon}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

const FormSelect = ({ label, value, onChange, required, options, name }) => (
  <div className={styles.inputGroup}>
    <label className={styles.inputLabel}>
      {label}
      {required && <span className={styles.inputRequired}>*</span>}
    </label>
    <div className={styles.selectWrapper}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={styles.formSelect}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <TbChevronDown className={styles.selectArrow} size={20} />
    </div>
  </div>
);

const DragAndDropArea = ({ matterId, onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    };

    const handleBrowseClick = () => {
        document.getElementById('file-upload').click();
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            uploadFile(e.target.files[0]);
        }
    };

    const uploadFile = async (file) => {
        if (!matterId) {
            setError('Please save the matter first before uploading attachments');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploaded_by', 'Current User');

        try {
            const response = await fetch(`${API_BASE_URL}/matters/${matterId}/attachments/upload/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Upload failed');
            }

            const data = await response.json();
            console.log('Upload success:', data);
            onUploadSuccess && onUploadSuccess(data.attachment);
        } catch (err) {
            setError(err.message || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className={styles.dropArea}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            style={{ 
              borderColor: isDragging ? 'var(--color-primary)' : 'grey',
              backgroundColor: isDragging ? '#eff6ff' : 'var(--color-white)',
              opacity: uploading ? 0.6 : 1,
              cursor: uploading ? 'wait' : 'pointer'
            }}
        >
            <h2>Upload Attachments</h2>
            <p>Upload your files that you want to share with the record</p>
            {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
            <TbCloudUpload size={48} className={styles.dropIcon} />
            <p className={styles.dropText}>
                {uploading ? 'Uploading...' : 'Drag and drop here'}
            </p>
            <p className={styles.dropSubtext}>
                or <a className={styles.dropBrowse} onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}>browse</a>
            </p>
            <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

const AttachmentsList = ({ attachments }) => {
    if (!attachments || attachments.length === 0) {
        return null;
    }

    return (
        <div className={styles.attachmentsList}>
            <h3 className={styles.attachmentsTitle}>Uploaded Attachments</h3>
            {attachments.map((att) => (
                <div key={att.id} className={styles.attachmentItem}>
                    <TbFile size={20} />
                    <div className={styles.attachmentInfo}>
                        <span className={styles.attachmentName}>{att.filename}</span>
                        <span className={styles.attachmentMeta}>
                            Uploaded by {att.uploaded_by} on {new Date(att.uploaded_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const App = () => {
  const { id } = useParams();
  const matterId = id ? parseInt(id) : null;

  const [formData, setFormData] = useState({
    number: '',
    openedFor: '',
    type: 'Civil',
    assignedTo: '',
    state: 'New',
    shortDescription: '',
    workNotes: '',
  });

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (matterId) {
      fetchMatterDetails();
      fetchAttachments();
    } else {
      setLoading(false);
    }
  }, [matterId]);

  const fetchMatterDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/matters/${matterId}/`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          number: `MS${String(data.id).padStart(7, '0')}`,
          openedFor: data.activity || '',
          type: 'Civil',
          assignedTo: data.assignee || '',
          state: data.status || 'New',
          shortDescription: data.activity || '',
          workNotes: '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch matter details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttachments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/matters/${matterId}/attachments/`);
      if (response.ok) {
        const data = await response.json();
        setAttachments(data);
      }
    } catch (err) {
      console.error('Failed to fetch attachments:', err);
    }
  };

  const handleUploadSuccess = (newAttachment) => {
    setAttachments((prev) => [...prev, newAttachment]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className={styles.appContainer}><p>Loading...</p></div>;
  }

  if (!matterId) {
    return <div className={styles.appContainer}><p>No matter selected</p></div>;
  }

  return (
    <>
      <div className={styles.appContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.headerTitle}>Matter Record: {formData.number}</h1>

          <div className={styles.formGrid}>
            <FormInput
              label="Number"
              value={formData.number}
              readOnly
            />

            <FormInput
              label="Opened for"
              value={formData.openedFor}
              onChange={(e) => handleChange({ target: { name: 'openedFor', value: e.target.value } })}
              icon={<TbSearch size={16} />}
            />

            <FormSelect
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={types}
              required
            />

            <FormInput
              label="Assigned to"
              value={formData.assignedTo}
              onChange={(e) => handleChange({ target: { name: 'assignedTo', value: e.target.value } })}
              icon={<TbSearch size={16} />}
            />

            <FormSelect
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              options={states}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <FormInput
              label="Short description"
              value={formData.shortDescription}
              onChange={(e) => handleChange({ target: { name: 'shortDescription', value: e.target.value } })}
            />
          </div>

          <div className={styles.inputGroup} style={{ marginBottom: '2rem' }}>
            <label className={styles.inputLabel} style={{ display: 'flex', alignItems: 'center' }}>
              <TbClipboard size={16} style={{ marginRight: '0.5rem' }} />
              Work notes
            </label>
            <textarea
              name="workNotes"
              value={formData.workNotes}
              onChange={handleChange}
              rows="6"
              className={styles.notesTextarea}
              placeholder="Add comments and internal notes here..."
            ></textarea>
          </div>

          <DragAndDropArea 
            matterId={matterId} 
            onUploadSuccess={handleUploadSuccess} 
          />

          <AttachmentsList attachments={attachments} />

          <div className={styles.actionButtons}>
            <button
              type="submit"
              className={`${styles.buttonBase} ${styles.buttonSave}`}
              onClick={() => console.log('Form Data Submitted:', formData)}
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default App;