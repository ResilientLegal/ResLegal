import { useState, useRef } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { TbChevronDown, TbCloudUpload } from 'react-icons/tb';
import styles from '../styles/MatterForm.module.css';
import DJANGO_PORT from '../services/setting.js';

const types = ['Civil', 'Criminal', 'Family Law', 'Appeal', 'Probate', 'Small Claims'];

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


const App = () => {
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        type: types[0],
        assignee: '',
        shortDescription: '',
        work_notes: '',
        approver: null,
    });
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleSave = (data) => {
        data = {...data, 'type': data.type.toUpperCase().replace(' ', '_')}

        const payload = { ...data, type: data.type.toUpperCase().replace(' ', '_') };
        if (attachment) {
            payload.attachmentName = attachment.name;
        }

        fetch(`${DJANGO_PORT}/api/matters/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.ok) {
                navigate('/matters', { replace: true });
            }
        })
        .catch(error => console.error("Error:", error));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilePick = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAttachment(file);
    };

    return (
        <>
            <div className={styles.appContainer}>
                <div className={styles.backdrop} />
                <div className={styles.formCard}>
                    <h1 className={styles.headerTitle}>Matter Record</h1>
                    <p className={styles.headerSubtitle}>Capture the key details and attach supporting files.</p>

                    <div className={styles.formGrid}>
                        <FormInput
                            label="Title"
                            value={formData.title}
                            onChange={(e) => handleChange({ target: { name: 'title', value: e.target.value } })}
                        />

                        <FormSelect
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            options={types}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <FormInput
                            label="Short description"
                            value={formData.shortDescription}
                            onChange={(e) => handleChange({ target: { name: 'shortDescription', value: e.target.value } })}
                        />
                    </div>

                    <div className={styles.dropArea} onClick={() => fileInputRef.current?.click()}>
                        <TbCloudUpload size={28} className={styles.dropIcon} />
                        <div className={styles.dropText}>
                            {attachment ? `Attached: ${attachment.name}` : 'Upload attachment'}
                        </div>
                        <div className={styles.dropSubtext}>
                            {attachment ? 'Click to replace the file' : 'Click to browse files'}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFilePick}
                        />
                    </div>

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
