import { useState, useEffect } from 'react';
import { Router, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TbSearch, TbChevronDown, TbClipboard, TbCloudUpload } from 'react-icons/tb';
import styles from '../styles/MatterForm.module.css'
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
    const [formData, setFormData] = useState(
        {
            title: '',
            client: '',
            type: types[0],
            assignee: '',
            shortDescription: '',
            work_notes: ''
        }
    );
    const navigate = useNavigate();

    const handleSave = (data) => {
        data = {...data, 'type': data.type.toUpperCase().replace(' ', '_')}

        fetch(`${DJANGO_PORT}/api/matters/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
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
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <FormInput
                            label="Short description"
                            value={formData.shortDescription}
                            onChange={(e) => handleChange({ target: { name: 'shortDescription', value: e.target.value } })}
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