import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TbSearch, TbChevronDown, TbClipboard, TbCloudUpload } from 'react-icons/tb';
import styles from '../styles/MatterForm.module.css'
import DJANGO_PORT from '../services/setting.js';

const types = ['Civil', 'Criminal', 'Family Law', 'Appeal', 'Probate', 'Small Claims'];
const states = ['In Progress', 'Pending Approval', 'Approved'];
const type_labels = {
  'CIVIL': 'Civil',
  'CRIMINAL': 'Criminal',
  'FAMILY_LAW': 'Family Law',
  'APPEAL': 'Appeal',
  'PROBATE': 'Probate',
  'SMALL_CLAIMS': 'Small Claims',
}

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
  const { id } = useParams();
  const [formData, setFormData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handleSave = (data) => {
    fetch(`${DJANGO_PORT}/api/matters/${id}/`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .catch(error => console.error("Error:", error));
}

  useEffect(() => {
    fetch(`${DJANGO_PORT}/api/matters/${id}`)
      .then(response => response.json())
      .then(data => {
        setFormData({
          title: data.title || '',
          client: data.client || '',
          type: data.type || types[0],
          assignee: data.assignee || '',
          state: data.state || states[0],
          shortDescription: data.shortDescription || '',
          work_notes: data.work_notes || '',
        });
      })
      .catch(error => console.error("Error:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
      return <div>Loading data...</div>;
  }

  return (
    <>
      <div className={styles.appContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.headerTitle}>Matter Record: {formData.title}</h1>

          <div className={styles.formGrid}>
            <FormInput
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange({ target: { name: 'title', value: e.target.value } })}
            />

            <FormInput
              label="Opened for"
              value={formData.client}
              onChange={(e) => handleChange({ target: { name: 'client', value: e.target.value } })}
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
              value={formData.assignee}
              onChange={(e) => handleChange({ target: { name: 'assignee', value: e.target.value } })}
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
              name="work_notes"
              value={formData.work_notes}
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
              onClick={() => handleSave(formData)}
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