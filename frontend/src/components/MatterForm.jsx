import React, { useState } from 'react';
import { TbSearch, TbChevronDown, TbClipboard, TbCloudUpload } from 'react-icons/tb';
import styles from '../styles/MatterForm.module.css'

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

const DragAndDropArea = () => {
    const [isDragging, setIsDragging] = useState(false);

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
        console.log('Files dropped:', e.dataTransfer.files);
    };

    const handleBrowseClick = () => {
        document.getElementById('file-upload').click();
    };

    const handleFileChange = (e) => {
        console.log('Files selected:', e.target.files);
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
            }}
        >
            <h2>Upload Attachments</h2>
            <p>Upload your files that you want to share with the record</p>
            <TbCloudUpload size={48} className={styles.dropIcon} />
            <p className={styles.dropText}>Drag and drop here</p>
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

const App = () => {
  const [formData, setFormData] = useState({
    number: 'MS0000002',
    openedFor: 'Adela Cerveantzs',
    type: 'Chat',
    assignedTo: 'Antony Alldis',
    state: 'New',
    shortDescription: 'DUI case california',
    workNotes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

          <DragAndDropArea />


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