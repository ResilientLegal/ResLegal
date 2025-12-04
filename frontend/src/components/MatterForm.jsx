import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TbSearch, TbChevronDown, TbClipboard, TbCloudUpload } from 'react-icons/tb';
import SelectableList from './SelectableList.jsx';
import styles from '../styles/MatterForm.module.css'
import DJANGO_PORT from '../services/setting.js';
import { Notification } from '@mantine/core';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/Notification.css';

const TYPE_MAP = {
  'CIVIL': 'Civil',
  'CRIMINAL': 'Criminal',
  'FAMILY_LAW': 'Family Law',
  'APPEAL': 'Appeal',
  'PROBATE': 'Probate',
  'SMALL_CLAIMS': 'Small Claims',
};

const STATE_MAP = {
  'IN_PROGRESS': 'In Progress',
  'PENDING_APPROVAL': 'Pending Approval',
  'APPROVED': 'Approved',
};

const types = Object.values(TYPE_MAP);
const states = Object.values(STATE_MAP);
let users = [];

const FormInput = ({ label, value, onChange, required, readOnly = false, icon, listOptions, onSelect }) => {
  const inputName = label.toLowerCase().replace(/\s/g, '');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleSelection = (item) => {
    onSelect(item);
    onChange({ target: { name: inputName, value: item.label } });
    setIsPopupVisible(false);
  };

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
          <div className={styles.inputIcon} onClick={() => setIsPopupVisible(isPopupVisible => !isPopupVisible)}>
            {icon}
          </div>
        )}

        {isPopupVisible && (
          <div className={styles.popupContainer}>
            <SelectableList
              data={listOptions}
              labelKey="label"
              valueKey="id"
              onSelect={handleSelection}
            />
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
  const [approver, setApprover] = useState();
  const [assignee, setAssignee] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const handleSave = (data) => {
    data = {
      ...data,
      'type': data.type.toUpperCase().replace(' ', '_'),
      'state': data.state.toUpperCase().replace(' ', '_'),
      'approver': approver,
      'assignee': assignee,
    };
    fetch(`${DJANGO_PORT}/api/matters/${id}/`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => {
      if (res.ok) {
        setShowNotification(true);
      }
    })
      .catch(error => console.error("Error:", error));
  }

  const handleApproverSelect = (item) => {
    const { id = "" } = item;
    setApprover(id);
  }

  const handleAssigneeSelect = (item) => {
    const { id = "" } = item;
    setAssignee(id);
  }

  useEffect(() => {
    fetch(`${DJANGO_PORT}/api/matters/${id}`)
      .then(response => response.json())
      .then(data => {
        setFormData({
          title: data.title || '',
          client: data.client || '',
          type: TYPE_MAP[data.type] || data.type,
          state: STATE_MAP[data.state] || data.state,
          assignee: data.assignee_detail?.username || null,
          shortDescription: data.shortDescription || '',
          work_notes: data.work_notes || '',
          approver: data.approver_detail?.username || null,
        });
      })
      .catch(error => console.error("Error:", error))
      .finally(() => setIsLoading(false));

    fetch(`${DJANGO_PORT}/api/users/`)
      .then(response => response.json())
      .then(data => {
        users = data.map(user => ({
          id: user.id,
          label: user.username,
        }));
      })
      .catch(error => console.error("Error fetching users:", error));
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
      {showNotification && (
        <div style={{ position: 'fixed', top: '1rem', left: '50%', zIndex: 1000  }}>
          <Notification
            title="Saved successfully"
            onClose={() => setShowNotification(false)}
          >
            Your record has been updated.
          </Notification>
        </div>
      )}

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
              listOptions={users}
              onSelect={handleAssigneeSelect}
            />

            <FormSelect
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              options={states}
            />

            <FormInput
              label="Approver"
              value={formData.approver}
              onChange={(e) => handleChange({ target: { name: 'approver', value: e.target.value } })}
              icon={<TbSearch size={16} />}
              listOptions={users}
              onSelect={handleApproverSelect}
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